const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const heicConvert = require('heic-convert');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink); 

async function convertHeicToJpg(heicFilePath, outputJpgPath) {
  try {
    const inputBuffer = await readFile(heicFilePath);

    const jpgBuffer = await heicConvert({
      buffer: inputBuffer,
      format: 'JPEG',     
      quality: 1          
    });

    await writeFile(outputJpgPath, jpgBuffer);

    console.log(`Conversion successful: ${heicFilePath} converted to ${outputJpgPath}`);

    await unlink(heicFilePath);
    console.log(`Removed original file: ${heicFilePath}`);
  } catch (error) {
    console.error(`Error converting ${heicFilePath}:`, error);
  }
}

async function convertHeicFilesInDirectory(directoryPath) {
  try {
    const files = await readdir(directoryPath);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const fileExtension = path.extname(filePath).toLowerCase();

      if (fileExtension === '.heic' || fileExtension === '.HEIC') {
        const outputJpgPath = filePath.replace(/\.heic$/i, '.jpg');
        await convertHeicToJpg(filePath, outputJpgPath);
      }
    }
  } catch (error) {
    console.error('Error reading directory:', error);
  }
}

const directoryPath = './photos';

convertHeicFilesInDirectory(directoryPath);
