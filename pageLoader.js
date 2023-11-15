const { ipcRenderer } = require('electron');

function loadPage(pageName) {
  ipcRenderer.send('load-page', pageName);

  ipcRenderer.on('page-loaded', (event, data) => {
    // Manipula el contenido cargado desde la página HTML aquí
    console.log(data); // Ejemplo: Imprime el contenido en la consola
  });

  ipcRenderer.on('page-load-error', (event, error) => {
    // Maneja errores de carga de página aquí
    console.error('Error al cargar la página:', error);
  });
}

module.exports = {
  loadPage
};
