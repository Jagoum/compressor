# Compression CLI Tool

A command-line tool for file compression using Run-Length Encoding (RLE) and LZ77 algorithms, implemented in both Rust and JavaScript.

## Features

- Two compression algorithms:
  - Run-Length Encoding (RLE)
  - Simplified LZ77
- Available in both Rust and JavaScript implementations
- Docker support
- GitHub Container Registry (GHCR) integration

## Installation

### Using Docker

```bash
# Pull the Rust implementation
docker pull ghcr.io/your-org-name/rust-compressor:latest

# Pull the JavaScript implementation
docker pull ghcr.io/your-org-name/js-compressor:latest
```

### Local Installation

#### Rust Implementation

```bash
cd rust-compressor
cargo install --path .
```

#### JavaScript Implementation

```bash
cd js-compressor
npm install -g .
```

## Usage

### Rust Implementation

```bash
# Compress a file using RLE
rust-compressor compress input.txt output.txt.cmp --algorithm rle

# Decompress a file using RLE
rust-compressor decompress input.txt.cmp output.txt --algorithm rle

# Compress a file using LZ77
rust-compressor compress input.txt output.txt.cmp --algorithm lz

# Decompress a file using LZ77
rust-compressor decompress input.txt.cmp output.txt --algorithm lz
```

### JavaScript Implementation

```bash
# Compress a file using RLE
js-compressor compress input.txt output.txt.cmp --algorithm rle

# Decompress a file using RLE
js-compressor decompress input.txt.cmp output.txt --algorithm rle

# Compress a file using LZ77
js-compressor compress input.txt output.txt.cmp --algorithm lz

# Decompress a file using LZ77
js-compressor decompress input.txt.cmp output.txt --algorithm lz
```

### Using Docker

```bash
# Compress using Rust implementation
docker run -v $(pwd):/data ghcr.io/your-org-name/rust-compressor compress /data/input.txt /data/output.txt.cmp --algorithm rle

# Decompress using JavaScript implementation
docker run -v $(pwd):/data ghcr.io/your-org-name/js-compressor decompress /data/input.txt.cmp /data/output.txt --algorithm lz
```

## Development

### Running Tests

#### Rust Implementation

```bash
cd rust-compressor
cargo test
```

#### JavaScript Implementation

```bash
cd js-compressor
npm test
```

### Building Docker Images

```bash
# Build Rust implementation
docker build -t rust-compressor ./rust-compressor

# Build JavaScript implementation
docker build -t js-compressor ./js-compressor
```

## License

MIT 