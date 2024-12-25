import { getData } from './data.js';

const data = await getData(3);

function part1() {
    const rgx = /mul\((?<l>\d+),(?<r>\d+)\)/g;
    const matches = data.matchAll(rgx);
    return [...matches].reduce((a, c) => a + Number(c.groups!['l']) * Number(c.groups!['r']), 0);
}

console.log(part1());

function part2() {
    const rgx = /(mul\((?<l>\d+),(?<r>\d+)\)|don't|do)/g;
    const matches = data.matchAll(rgx);

    let enabled = true;
    let res = 0;
    for (const match of matches) {
        if (match[0] === 'do') {
            enabled = true;
        } else if (match[0] === "don't") {
            enabled = false;
        } else if (enabled) {
            res += Number(match.groups!['l']) * Number(match.groups!['r']);
        }
    }
    return res;
}

console.log(part2());
