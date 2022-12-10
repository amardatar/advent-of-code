const { getData } = require('./data');

async function part1() {
    const data = await getData(1);
    const elves = data.split('\n\n');
    return elves.map(e => e.split('\n').reduce((a, c) => a + Number(c), 0)).sort((a, b) => a < b ? 1 : -1)[0];
}

async function part2() {
    const data = await getData(1);
    const elves = data.split('\n\n');
    return elves.map(e => e.split('\n').reduce((a, c) => a + Number(c), 0)).sort((a, b) => a < b ? -1 : 1).reverse().slice(0, 3).reduce((a, c) => a + c, 0);
}

part1().then(res => console.log('Part 1\n', res));

part2().then(res => console.log('Part 2\n', res));
