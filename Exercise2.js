// resize.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(__dirname, 'input');
const outputDir = path.join(__dirname, 'output');
const sizes = process.argv.slice(2);

// Validate sizes
if (sizes.length === 0) {
    console.error('Error: Please provide at least one size (e.g., 128 or 128x256).');
    process.exit(1);
}

// Check input folder
if (!fs.existsSync(inputDir)) {
    console.error(`Error: Input folder "${inputDir}" does not exist.`);
    process.exit(1);
}

// Ensure output folder exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Allowed image extensions
const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.tiff'];

// Read input folder and filter images
fs.readdir(inputDir, async (err, files) => {
    if (err) {
        console.error('Error reading input directory:', err.message);
        process.exit(1);
    }

    const imageFiles = files.filter(file => validExtensions.includes(path.extname(file).toLowerCase()));

    if (imageFiles.length === 0) {
        console.error('Error: No valid image files found in input directory.');
        process.exit(1);
    }

    // Process each size
    for (const size of sizes) {
        const [widthStr, heightStr] = size.split('x');
        const width = parseInt(widthStr);
        const height = heightStr ? parseInt(heightStr) : null;

        if (isNaN(width) || (heightStr && isNaN(height))) {
            console.error(`Error: Invalid size "${size}". Use N or NxM format.`);
            continue;
        }

        const sizeOutputDir = path.join(outputDir, size);
        if (!fs.existsSync(sizeOutputDir)) {
            fs.mkdirSync(sizeOutputDir);
        }

        for (const file of imageFiles) {
            const inputFile = path.join(inputDir, file);
            const outputFile = path.join(sizeOutputDir, file);

            // Skip if output file already exists
            if (fs.existsSync(outputFile)) {
                console.log(`Skipped ${file} (already exists in ${size})`);
                continue;
            }

            try {
                await sharp(inputFile)
                    .resize(width, height) // keeps aspect ratio if height is null
                    .toFile(outputFile);
                console.log(`Resized ${file} to ${size}`);
            } catch (err) {
                console.error(`Error processing "${file}" for size ${size}:`, err.message);
            }
        }
    }
});
