const fs = require('fs');
const path = require('path');

const unicodeMap = {
    '0': '30',
    '1': '31',
    '2': '32',
    '3': '33',
    '4': '34',
    '5': '35',
    '6': '36',
    '7': '37',
    '8': '38',
    '9': '39',
    '10': '2C',
    '11': '2E',
};

function getUnicodeFileName(fileName) {
    const match = fileName.match(/num(\d+)/);
    if (match) {
        const number = match[1];
        const paddedNumber = number.padStart(2, '0'); // 確保數字是兩位數
        return `${unicodeMap[paddedNumber] || paddedNumber}.png`;
    }
    return null;
}

function renameFilesInFolder(folderPath) {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('無法讀取資料夾:', err);
            return;
        }

        files.forEach(file => {
            const oldPath = path.join(folderPath, file);
            const newFileName = getUnicodeFileName(file);
            if (newFileName) {
                const newPath = path.join(folderPath, newFileName);
                fs.rename(oldPath, newPath, err => {
                    if (err) {
                        console.error(`無法重新命名檔案 ${file}:`, err);
                    } else {
                        console.log(`檔案 ${file} 已重新命名為 ${newFileName}`);
                    }
                });
            }
        });
    });
}

module.exports = { renameFilesInFolder };