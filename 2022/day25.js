const { getData } = require('./data');

const toBase10Map = { '2': 2, '1': 1, '0': 0, '-': -1, '=': -2 };
const toSNAFUMap = ['0', '1', '2', '=', '-'];

function toBase10 (str) {
    return str.split('').reverse().reduce((a, c, i) => a + toBase10Map[c] * 5 ** i, 0);
}

function toSNAFU(num) {
    if (num <= 2) return num.toString();

    const m = num % 5;
    if (m <= 2) {
        const r = (num - m) / 5;
        return `${toSNAFU(r)}${toSNAFUMap[m]}`;
    } else {
        const r = (num + 5 - m) / 5;
        return `${toSNAFU(r)}${toSNAFUMap[m]}`
    }
}

async function part1() {
    const data = await getData(25);

    const sum = data.split('\n').map(toBase10).reduce((a, c) => a + c, 0);

    return toSNAFU(sum);
}

part1().then(res => console.log('Part 1\n', res));
