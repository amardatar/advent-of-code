const { getData } = require('./data');

async function part1() {
    const data = await getData(6);
    return data.split('').findIndex((d, i) => {
        if (i < 3) return false;
        if ([...new Set(data.slice(i - 3, i + 1))].length < 4) return false;
        return true;
    }) + 1;
}

async function part2() {
    const data = await getData(6);
    return data.split('').findIndex((d, i) => {
        if (i < 13) return false;
        if ([...new Set(data.slice(i - 13, i + 1))].length < 14) return false;
        return true;
    }) + 1;
}

part1().then(res => console.log('Part 1\n', res));

part2().then(res => console.log('Part 2\n', res));
