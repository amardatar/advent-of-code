import { getData } from './data.js';

const data = await getData(1);

function parseInput() {
    return data.split('\n').reduce<[number[], number[]]>(
        ([left, right], row) => {
            const [l, r] = row.split(/ +/);
            left.push(Number(l));
            right.push(Number(r));
            return [left, right];
        },
        [[], []]
    );
}

function part1() {
    const [left, right] = parseInput();
    left.sort((a, b) => a - b);
    right.sort((a, b) => a - b);
    return left.reduce((a, c, i) => a + Math.abs(c - right[i]!), 0);
}

console.log(part1());

function part2() {
    const [left, right] = parseInput();
    return left.reduce((a, c) => a + c * right.filter((r) => c === r).length, 0);
}

console.log(part2());
