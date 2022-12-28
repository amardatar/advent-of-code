const { getData } = require('./data');

function compare(val1, val2) {
    if (typeof val1 === 'number' && typeof val2 === 'number') {
        if (val1 < val2) return -1;
        if (val2 < val1) return 1;
        return 0;
    }

    const arr1 = Array.isArray(val1) ? val1 : [val1];
    const arr2 = Array.isArray(val2) ? val2 : [val2];

    for (let i = 0; i < Math.min(arr1.length, arr2.length); i++) {
        const result = compare(arr1[i], arr2[i]);
        if (result !== 0) return result;
    }

    if (arr1.length < arr2.length) return -1;
    if (arr2.length < arr1.length) return 1;
    return 0;
}

async function part1() {
    const data = await getData(13);

    const pairs = data.split('\n\n').map(d => d.split('\n').map(JSON.parse));

    let sum = 0;

    for (let n = 1; n <= pairs.length; n++) {
        const [packet1, packet2] = pairs[n - 1];

        const result = compare(packet1, packet2);

        if (result !== 1) sum += n;
    }

    return sum;
}

async function part2() {
    const data = await getData(13);

    const packets = data.split('\n\n').map(d => d.split('\n').map(JSON.parse)).flat();

    const sorted = packets.concat([[[2]]], [[[6]]]).sort(compare);

    return (sorted.findIndex(s => s.length === 1 && Array.isArray(s[0]) && s[0].length === 1 && s[0][0] === 2) + 1) *
        (sorted.findIndex(s => s.length === 1 && Array.isArray(s[0]) && s[0].length === 1 && s[0][0] === 6) + 1);
}

part1().then(res => console.log('Part 1\n', res));

part2().then(res => console.log('Part 2\n', res));
