function compress(data) {
    if (data.length === 0) {
        return Buffer.from([]);
    }

    const result = [];
    let count = 1;
    let current = data[0];

    for (let i = 1; i < data.length; i++) {
        if (data[i] === current && count < 255) {
            count++;
        } else {
            result.push(count, current);
            current = data[i];
            count = 1;
        }
    }

    // Push the last group
    result.push(count, current);

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
        const count = data[i];
        const byte = data[i + 1];
        for (let j = 0; j < count; j++) {
            result.push(byte);
        }
        i += 2;
    }

    return Buffer.from(result);
}

module.exports = {
    compress,
    decompress
}; 