const { app, BrowserWindow } = require('electron');
const path = require('path');
const isPortReachable = require('./is-port-reachable');

let isReachable = async () => {
    let result = await isPortReachable('22', {host: 'miuftp.tylertech.com'});
    return result;
}

console.log(isReachable());

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
      }
    });
    win.loadFile('./src/index.html')
};
    

  app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  });