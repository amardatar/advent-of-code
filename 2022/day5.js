const { getData } = require('./data');

async function part1() {
    const data = await getData(5);
    const [stacksRaw, movesRaw] = data.trimEnd().split('\n\n');
    const stacks = [1, 5, 9, 13, 17, 21, 25, 29, 33].map((i) => stacksRaw.split('\n').map(sr => sr[i]).reverse().slice(1).filter(s => s !== ' '));
    const moves = movesRaw.split('\n').map(m => {
        const [, move, , from, , to] = m.split(' ');
        return { move: Number(move), from: Number(from) - 1, to: Number(to) - 1 };
    });

    for (const { move, from, to } of moves) {
        stacks[to].push(...stacks[from].splice(-move).reverse());
    }

    return stacks.map(s => s.slice(-1)).join('');
}

async function part2() {
    const data = await getData(5);
    const [stacksRaw, movesRaw] = data.trimEnd().split('\n\n');
    const stacks = [1, 5, 9, 13, 17, 21, 25, 29, 33].map((i) => stacksRaw.split('\n').map(sr => sr[i]).reverse().slice(1).filter(s => s !== ' '));
    const moves = movesRaw.split('\n').map(m => {
        const [, move, , from, , to] = m.split(' ');
        return { move: Number(move), from: Number(from) - 1, to: Number(to) - 1 };
    });

    for (const { move, from, to } of moves) {
        stacks[to].push(...stacks[from].splice(-move));
    }

    return stacks.map(s => s.slice(-1)).join('');
}

part1().then(res => console.log('Part 1\n', res));

part2().then(res => console.log('Part 2\n', res));
