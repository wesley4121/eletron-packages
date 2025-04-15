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

    mainWindow.loadURL(`data:text/html;charset=utf-8,<!DOCTYPE html>
<html>
<head>
    <title>圖像重命名工具</title>
</head>
<body>
    <h1>圖像重命名工具</h1>
    <button id="select-folder">選擇資料夾</button>
    <script>
        const { ipcRenderer } = require('electron');

        document.getElementById('select-folder').addEventListener('click', () => {
            ipcRenderer.send('select-folder');
        });

        ipcRenderer.on('rename-complete', () => {
            alert('重命名完成！');
        });
    </script>
</body>
</html>`);
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