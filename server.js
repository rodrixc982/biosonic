const express = require('express');
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

const app = express();

const model = tf.sequential();
model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

const weightsFileBuffer = fs.readFileSync('train_1500_4200_hz_mfcc_validar_de_un_solo_día_mfcc_delta_delta_2_nuevas_dimensioness.h5');
const weights = tf.io.fromHDF5(weightsFileBuffer);
model.setWeights(weights);

app.use(express.json());

app.post('/predict', (req, res) => {
  const { input } = req.body;
  const inputData = tf.tensor2d([input], [1, 1]);
  const prediction = model.predict(inputData);
  const output = prediction.dataSync()[0];
  res.json({ prediction: output });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
