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
    '12': '3A',

    '00': '30',
    '01': '31',
    '02': '32',
    '03': '33',
    '04': '34',
    '05': '35',
    '06': '36',
    '07': '37',
    '08': '38',
    '09': '39',
};

function getUnicodeFileName(fileName) {
    console.log(`Processing file name: ${fileName}`);

    // 提取尾部數字
    const numberMatch = fileName.match(/(\d+)(?!.*\d)/); // 匹配最後一組數字
    if (numberMatch) {
        const number = numberMatch[1];
        const paddedNumber = number.padStart(2, '0'); // 確保數字是兩位數
        const unicodeValue = unicodeMap[paddedNumber];

        if (unicodeValue) {
            return `${unicodeValue}.png`;
        } else {
            console.warn(`Undefined number mapping for: ${paddedNumber}`);
            return `${paddedNumber}.png`; // 使用原始數字作為檔名
        }
    }

    console.warn(`No numeric suffix found in file name: ${fileName}`);
    return null;
}

function renameFilesInFolder(folderPath) {
    console.log(`Processing folder: ${folderPath}`);
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error(`Failed to read folder ${folderPath}:`, err);
            return;
        }

        files.forEach(file => {
            const oldPath = path.join(folderPath, file);
            console.log(`Checking path: ${oldPath}`);
            fs.stat(oldPath, (err, stats) => {
                if (err) {
                    console.error(`Failed to get file stats: ${file}`, err);
                    return;
                }

                if (stats.isDirectory()) {
                    console.log(`Found subfolder: ${oldPath}`);
                    // Recursively process subfolders
                    renameFilesInFolder(oldPath);
                } else {
                    console.log(`Processing file: ${file}`);
                    const newFileName = getUnicodeFileName(file);
                    if (newFileName) {
                        const newPath = path.join(folderPath, newFileName);
                        console.log(`Renaming file from ${oldPath} to ${newPath}`);
                        fs.rename(oldPath, newPath, err => {
                            if (err) {
                                console.error(`Failed to rename file ${file}:`, err);
                            } else {
                                console.log(`File ${file} renamed to ${newFileName}`);
                            }
                        });
                    } else {
                        console.warn(`Skipped file ${file}, unable to generate new filename.`);
                    }
                }
            });
        });
    });
}

module.exports = { renameFilesInFolder };