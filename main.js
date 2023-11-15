const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    icon: path.join(__dirname, 'about', 'Imagen1-modified.png')
  });

  // Cargar el archivo HTML principal
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Manejar el evento de cerrar ventana
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // Definir el menú de la aplicación
  const menuTemplate = [
    {
      label: 'IIAP-AUDIO',
      submenu: [
        {
          label: 'CONECTATE CON EL DESARROLLADOR',
          click: () => {
            // Abre un enlace externo, en este caso, WhatsApp
            shell.openExternal('https://wa.me/+51918244823');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

// Evento cuando la aplicación está lista
app.whenReady().then(createWindow);

// Salir de la aplicación cuando todas las ventanas están cerradas
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Crear una nueva ventana cuando la aplicación está activada (macOS)
app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

// Manejar el evento 'load-page' desde el proceso de renderizado
ipcMain.on('load-page', (event, pageName) => {
  const filePath = path.join(__dirname, `${pageName}.html`);

  // Leer el archivo HTML solicitado
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      event.sender.send('page-load-error', err.message);
    } else {
      // Establecer el contenido HTML en la ventana principal
      mainWindow.webContents.send('page-loaded', data);
    }
  });
});

// Añadir una nueva función para cambiar la pestaña desde el proceso principal
ipcMain.on('change-tab', (event, pageName) => {
  const filePath = path.join(__dirname, `${pageName}.html`);

  // Leer el archivo HTML solicitado
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      event.sender.send('page-load-error', err.message);
    } else {
      // Establecer el contenido HTML en la ventana principal
      mainWindow.webContents.send('change-tab', data);
    }
  });
});
