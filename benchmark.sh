#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Create test files of different sizes
echo -e "${BLUE}Creating test files...${NC}"
dd if=/dev/urandom of=test1.txt bs=1M count=1 2>/dev/null
dd if=/dev/urandom of=test2.txt bs=1M count=10 2>/dev/null
dd if=/dev/urandom of=test3.txt bs=1M count=100 2>/dev/null

# Function to run benchmark
run_benchmark() {
    local impl=$1
    local file=$2
    local algo=$3
    local operation=$4
    
    echo -e "${GREEN}Running $operation with $impl ($algo) on $(basename $file)...${NC}"
    
    if [ "$impl" = "rust" ]; then
        if [ "$operation" = "compress" ]; then
            time ./rust-compressor/target/release/rust-compressor compress "$file" "${file}.${algo}" --algorithm "$algo"
        else
            time ./rust-compressor/target/release/rust-compressor decompress "${file}.${algo}" "${file}.decompressed" --algorithm "$algo"
        fi
    else
        if [ "$operation" = "compress" ]; then
            time node js-compressor/index.js "$operation" "$file" "${file}.${algo}" --algorithm "$algo"
        else
            time node js-compressor/index.js "$operation" "${file}.${algo}" "${file}.decompressed" --algorithm "$algo"
        fi
    fi
    
    # Calculate file sizes
    original_size=$(stat -f %z "$file" 2>/dev/null || stat -c %s "$file")
    if [ "$operation" = "compress" ]; then
        compressed_size=$(stat -f %z "${file}.${algo}" 2>/dev/null || stat -c %s "${file}.${algo}")
        ratio=$(echo "scale=2; $compressed_size * 100 / $original_size" | bc)
        echo "Compression ratio: ${ratio}%"
    fi
    
    echo "----------------------------------------"
}

# Run benchmarks for each implementation and algorithm
for file in test1.txt test2.txt test3.txt; do
    echo -e "${BLUE}Benchmarking with file: $file${NC}"
    
    # RLE
    run_benchmark "rust" "$file" "rle" "compress"
    run_benchmark "rust" "$file" "rle" "decompress"
    run_benchmark "js" "$file" "rle" "compress"
    run_benchmark "js" "$file" "rle" "decompress"
    
    # LZ77
    run_benchmark "rust" "$file" "lz" "compress"
    run_benchmark "rust" "$file" "lz" "decompress"
    run_benchmark "js" "$file" "lz" "compress"
    run_benchmark "js" "$file" "lz" "decompress"
    
    echo "========================================"
done

# Cleanup
echo -e "${BLUE}Cleaning up...${NC}"
rm -f test*.txt* 