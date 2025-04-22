#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const rle = require('./rle'); // importing the rle and the lz files use the functions in it
const lz = require('./lz');

program
    .name('js-compressor')
    .description('CLI tool for file compression using RLE and LZ77 algorithms')
    .version('1.0.0');

program
    .command('compress')
    .description('Compress a file')
    .argument('<input>', 'Input file path')
    .argument('<output>', 'Output file path')
    .option('-a, --algorithm <type>', 'Compression algorithm (rle or lz)', 'rle')
    .action((input, output, options) => {
        try {
            const data = fs.readFileSync(input);
            const compressed = options.algorithm === 'rle' 
                ? rle.compress(data)
                : lz.compress(data);
            fs.writeFileSync(output, compressed);
            console.log('Compression completed successfully!');
        } catch (error) {
            console.error('Error:', error.message);
            process.exit(1);
        }
    });

program
    .command('decompress')
    .description('Decompress a file')
    .argument('<input>', 'Input file path')
    .argument('<output>', 'Output file path')
    .option('-a, --algorithm <type>', 'Compression algorithm (rle or lz)', 'rle')
    .action((input, output, options) => {
        try {
            const data = fs.readFileSync(input);
            const decompressed = options.algorithm === 'rle'
                ? rle.decompress(data)
                : lz.decompress(data);
            fs.writeFileSync(output, decompressed);
            console.log('Decompression completed successfully!');
        } catch (error) {
            console.error('Error:', error.message);
            process.exit(1);
        }
    });

program.parse(); 