const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { renameFilesInFolder } = require('../../feature/TextatlasRenamer/src/TextatlasRenamer');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile(__dirname + '/../res/index.html');
});

ipcMain.on('select-folder', async (event) => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    });

    if (!result.canceled && result.filePaths.length > 0) {
        const folderPath = result.filePaths[0];
        renameFilesInFolder(folderPath);
        event.sender.send('rename-complete');
    }
});