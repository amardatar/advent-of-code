const { getData } = require('./data');

async function part1() {
    const data = await getData(2);
    const dict = {
        'A': { 'X': 4, 'Y': 8, 'Z': 3 },
        'B': { 'X': 1, 'Y': 5, 'Z': 9 },
        'C': { 'X': 7, 'Y': 2, 'Z': 6 },
    };
    return data.split('\n').reduce((a, c) => a + dict[c.split(' ')[0]][c.split(' ')[1]], 0);
}

async function part2() {
    const data = await getData(2);
    const dict = {
        'A': { 'X': 3, 'Y': 4, 'Z': 8 },
        'B': { 'X': 1, 'Y': 5, 'Z': 9 },
        'C': { 'X': 2, 'Y': 6, 'Z': 7 },
    };
    return data.split('\n').reduce((a, c) => a + dict[c.split(' ')[0]][c.split(' ')[1]], 0);
}

part1().then(res => console.log('Part 1\n', res));

part2().then(res => console.log('Part 2\n', res));
