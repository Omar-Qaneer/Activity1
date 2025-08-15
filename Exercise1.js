const fs = require('fs');
const path = require('path');

function formatBytes(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}


const targetPath = process.argv[2];

if (!targetPath) {
    console.error('Error: Please provide a file or directory path.');
    process.exit(1);
}


const absolutePath = path.resolve(targetPath);

fs.stat(absolutePath, (err, stats) => {
    if (err) {
        console.error(`Error: Cannot access "${absolutePath}".`, err.message);
        process.exit(1);
    }

    console.log(`Path: ${absolutePath}`);
    console.log(`Name: ${path.basename(absolutePath)}`);
    console.log(`Extension: ${path.extname(absolutePath) || 'N/A'}`);
    console.log(`Last Modified: ${stats.mtime}`);
    console.log(`Size: ${formatBytes(stats.size)}`);

    if (stats.isDirectory()) {
        fs.readdir(absolutePath, (err, files) => {
            if (err) {
                console.error('Error reading directory contents:', err.message);
                return;
            }
            console.log(`Type: Directory`);
            console.log(`Number of files: ${files.length}`);
        });
    } else {
        console.log(`Type: File`);
    }
});
