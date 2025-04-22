use clap::Parser;
use std::fs;
mod lz;
mod rle;

/// This struct is used to take command line args and parse them
/// It uses clap crate to generate user friendly help information
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// Operation to perform (compress or decompress)
    #[arg(value_parser = ["compress", "decompress"])]
    operation: String,

    /// Input file path
    input: String,

    /// Output file path
    output: String,

    /// Compression algorithm to use
    #[arg(short, long, value_parser = ["rle", "lz"])]
    algorithm: String,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args = Args::parse();

    // Read input file
    let input_data = fs::read(&args.input)?;

    // Process the data based on operation and algorithm
    let output_data = match (args.operation.as_str(), args.algorithm.as_str()) {
        ("compress", "rle") => rle::compress(&input_data),
        ("decompress", "rle") => rle::decompress(&input_data),
        ("compress", "lz") => lz::compress(&input_data),
        ("decompress", "lz") => lz::decompress(&input_data),
        _ => return Err("Invalid operation or algorithm".into()),
    };

    // Write output file
    fs::write(&args.output, output_data)?;

    println!("Operation completed successfully!");
    Ok(())
}
