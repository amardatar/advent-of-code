const { getData } = require('./data');

async function part1() {
    const data = await getData(3);
    const bags = data.trim().split('\n');
    const dupes = bags.map(b => {
        const first = b.slice(0, b.length / 2);
        const second = b.slice(b.length / 2);
        const dupe = [...first].find(f => second.includes(f));
        const priority = dupe.charCodeAt(0);
        return priority > 96 ? priority - 96 : priority - 64 + 26;
    });
    return dupes.reduce((a, c) => a + c, 0);
}

async function part2() {
    const data = await getData(3);
    const groups = data.trim().split('\n').reduce((a, c, i) => i % 3 === 0 ? [...a, [c]] : [...a.slice(0, -1), [...a.at(-1), c]], []);
    const commonItems = groups.map(g => {
        const commonItem = g[0].split('').find(t => g[1].includes(t) && g[2].includes(t));
        const priority = commonItem.charCodeAt(0);
        return priority > 96 ? priority - 96 : priority - 64 + 26;
    })
    return commonItems.reduce((a, c) => a + c, 0);
}

part1().then(res => console.log('Part 1\n', res));

part2().then(res => console.log('Part 2\n', res));
