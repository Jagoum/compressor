pub fn compress(data: &[u8]) -> Vec<u8> {
    if data.is_empty() {
        return Vec::new();
    }

    let mut result = Vec::new();
    let mut count = 1;
    let mut current = data[0];

    for &byte in data.iter().skip(1) {
        if byte == current && count < 255 {
            count += 1;
        } else {
            result.push(count);
            result.push(current);
            current = byte;
            count = 1;
        }
    }

    // Push the last group
    result.push(count);
    result.push(current);

    result
}

pub fn decompress(data: &[u8]) -> Vec<u8> {
    if data.is_empty() {
        return Vec::new();
    }

    let mut result = Vec::new();
    let mut i = 0;

    while i < data.len() {
        if i + 1 >= data.len() {
            break;
        }
        let count = data[i] as usize;
        let byte = data[i + 1];
        result.extend(std::iter::repeat(byte).take(count));
        i += 2;
    }

    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_rle_roundtrip() {
        let input = b"AAABBBCCCCCDDDDE";
        let compressed = compress(input);
        let decompressed = decompress(&compressed);
        assert_eq!(input.to_vec(), decompressed);
    }

    #[test]
    fn test_empty_input() {
        let input = b"";
        let compressed = compress(input);
        let decompressed = decompress(&compressed);
        assert_eq!(input.to_vec(), decompressed);
    }

    #[test]
    fn test_single_byte() {
        let input = b"A";
        let compressed = compress(input);
        let decompressed = decompress(&compressed);
        assert_eq!(input.to_vec(), decompressed);
    }
}
