const fs = require('fs');
const path = require('path');

const sourceFolder = './.github/hooks'; // Replace with the path to your source folder
const destinationFolder = './.git/hooks'; // Replace with the path to your destination folder

// Function to copy a file
function copyFile(source, destination) {
    fs.copyFile(source, destination, (err) => {
        if (err) {
            console.error(`Error copying ${source} to ${destination}: ${err}`);
        } else {
            console.log(`Copied ${source} to ${destination}`);
        }
    });
}

// Function to copy all files from the source folder to the destination folder
function copyFilesInFolder(sourceFolder, destinationFolder) {
    fs.readdir(sourceFolder, (err, files) => {
        if (err) {
            console.error(`Error reading source folder: ${err}`);
            return;
        }

        files.forEach((file) => {
            const sourcePath = path.join(sourceFolder, file);
            const destinationPath = path.join(destinationFolder, file);

            copyFile(sourcePath, destinationPath);
        });
    });
}

// Copy files from the source folder to the destination folder
copyFilesInFolder(sourceFolder, destinationFolder);
