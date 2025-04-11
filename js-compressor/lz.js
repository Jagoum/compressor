const WINDOW_SIZE = 20;

function compress(data) {
    if (data.length === 0) {
        return Buffer.from([]);
    }

    const result = [];
    let i = 0;

    while (i < data.length) {
        const windowStart = Math.max(0, i - WINDOW_SIZE);
        const window = data.slice(windowStart, i);
        
        // Try to find a match
        let bestMatchLen = 0;
        let bestMatchOffset = 0;

        for (let offset = 1; offset <= window.length; offset++) {
            let matchLen = 0;
            while (i + matchLen < data.length 
                && matchLen < 255 
                && window[window.length - offset + matchLen] === data[i + matchLen]) {
                matchLen++;
            }

            if (matchLen > bestMatchLen) {
                bestMatchLen = matchLen;
                bestMatchOffset = offset;
            }
        }

        if (bestMatchLen >= 3) {
            // Output a match
            result.push(0x01);
            result.push(bestMatchOffset);
            result.push(bestMatchLen);
            i += bestMatchLen;
        } else {
            // Output a literal
            result.push(0x00);
            result.push(data[i]);
            i += 1;
        }
    }

    return Buffer.from(result);
}

function decompress(data) {
    if (data.length === 0) {
        return Buffer.from([]);
    }

    const result = [];
    let i = 0;

    while (i < data.length) {
        if (i + 1 >= data.length) {
            break;
        }

        if (data[i] === 0x00) {
            // Literal
            if (i + 1 < data.length) {
                result.push(data[i + 1]);
                i += 2;
            }
        } else if (data[i] === 0x01) {
            // Match
            if (i + 2 < data.length) {
                const offset = data[i + 1];
                const length = data[i + 2];
                
                const start = Math.max(0, result.length - offset);
                for (let j = 0; j < length; j++) {
                    if (start + j < result.length) {
                        result.push(result[start + j]);
                    }
                }
                i += 3;
            }
        } else {
            i += 1;
        }
    }

    return Buffer.from(result);
}

module.exports = {
    compress,
    decompress
}; 