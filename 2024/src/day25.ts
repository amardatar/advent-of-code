import { getData } from './data.js';

const data = await getData(25);

function parseInput() {
    return data.split('\n\n').reduce<{ locks: number[][]; keys: number[][] }>(
        (a, c) => {
            const rows = c.split('\n');
            const heights = rows[0]!
                .split('')
                .map((_, i) => rows.reduce((acc, row) => acc + (row[i] === '#' ? 1 : 0), -1));
            if (rows[0]?.includes('#')) {
                a.locks.push(heights);
            } else {
                a.keys.push(heights);
            }
            return a;
        },
        { locks: [], keys: [] }
    );
}

function part1() {
    const { locks, keys } = parseInput();
    let matches = 0;
    for (const lock of locks) {
        for (const key of keys) {
            if (lock.every((h, i) => h + key[i]! <= 5)) {
                matches++;
            }
        }
    }
    return matches;
}

console.log(part1());
