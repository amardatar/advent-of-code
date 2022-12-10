const { getData } = require('./data');

async function part1() {
    const data = await getData(4);
    const pairs = data.trim().split('\n');
    const overlaps = pairs.filter(p => {
        const [a, b] = p.split(',').map(e => e.split('-').map(Number));

        return (a[0] <= b[0] && a[1] >= b[1]) ||
            (a[0] >= b[0] && a[1] <= b[1]);
    });
    return overlaps.length;
}

async function part2() {
    const data = await getData(4);
    const pairs = data.trim().split('\n');
    const overlaps = pairs.filter(p => {
        const [a, b] = p.split(',').map(e => e.split('-').map(Number));

        return (a[0] <= b[0] && b[0] <= a[1]) ||
            (b[0] <= a[0] && a[0] <= b[1]) ||
            (a[0] <= b[1] && b[1] <= a[1]) ||
            (b[0] <= a[1] && a[1] <= b[1]);
    });
    return overlaps.length;
}

part1().then(res => console.log('Part 1\n', res));

part2().then(res => console.log('Part 2\n', res));
