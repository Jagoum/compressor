const WINDOW_SIZE: usize = 20;

pub fn compress(data: &[u8]) -> Vec<u8> {
    if data.is_empty() {
        return Vec::new();
    }

    let mut result = Vec::new();
    let mut i = 0;

    while i < data.len() {
        let window_start = if i >= WINDOW_SIZE { i - WINDOW_SIZE } else { 0 };
        let window = &data[window_start..i];

        // Try to find a match
        let mut best_match_len = 0;
        let mut best_match_offset = 0; // the position in the search buffer

        for offset in 1..=window.len() {
            let mut match_len = 0;
            while i + match_len < data.len()
                && match_len < 255
                && window.len() - offset + match_len < window.len()
                && window[window.len() - offset + match_len] == data[i + match_len]
            {
                match_len += 1;
            }

            if match_len > best_match_len {
                best_match_len = match_len;
                best_match_offset = offset;
            }
        }

        if best_match_len >= 3 {
            // Output a match
            result.push(0x01);
            result.push(best_match_offset as u8);
            result.push(best_match_len as u8);
            i += best_match_len;
        } else {
            // Output a literal
            result.push(0x00);
            result.push(data[i]);
            i += 1;
        }
    }
    println!("{:?}", result);
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

        match data[i] {
            0x00 => {
                // Literal
                if i + 1 < data.len() {
                    result.push(data[i + 1]);
                    i += 2;
                }
            }
            0x01 => {
                // Match
                if i + 2 < data.len() {
                    let offset = data[i + 1] as usize;
                    let length = data[i + 2] as usize;

                    let start = result.len().saturating_sub(offset);
                    for j in 0..length {
                        if start + j < result.len() {
                            result.push(result[start + j]);
                        }
                    }
                    i += 3;
                }
            }
            _ => i += 1,
        }
    }

    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_lz_roundtrip() {
        let input = b"ABABABABABAB";
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
