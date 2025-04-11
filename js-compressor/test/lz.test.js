const assert = require('assert');
const { compress, decompress } = require('../lz');

describe('LZ77 Compression', () => {
    it('should compress and decompress correctly', () => {
        const input = Buffer.from('ABABABABABAB');
        const compressed = compress(input);
        const decompressed = decompress(compressed);
        assert.strictEqual(decompressed.toString(), input.toString());
    });

    it('should handle empty input', () => {
        const input = Buffer.from('');
        const compressed = compress(input);
        const decompressed = decompress(compressed);
        assert.strictEqual(decompressed.length, 0);
    });

    it('should handle single byte input', () => {
        const input = Buffer.from('A');
        const compressed = compress(input);
        const decompressed = decompress(compressed);
        assert.strictEqual(decompressed.toString(), input.toString());
    });

    it('should handle repeated patterns', () => {
        const input = Buffer.from('ABCABCABCABC');
        const compressed = compress(input);
        const decompressed = decompress(compressed);
        assert.strictEqual(decompressed.toString(), input.toString());
    });

    it('should handle long matches', () => {
        const pattern = 'ABCDEFGHIJ';
        const input = Buffer.from(pattern.repeat(5));
        const compressed = compress(input);
        const decompressed = decompress(compressed);
        assert.strictEqual(decompressed.toString(), input.toString());
    });
}); 