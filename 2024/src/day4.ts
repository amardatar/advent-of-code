import { getData } from './data.js';

const data = await getData(4);

const chars = data.split('\n').map((d) => d.split(''));

function part1() {
    let occurrences = 0;

    for (let i = 0; i < chars.length; i++) {
        for (let j = 0; j < chars.length; j++) {
            if (chars[i]![j] !== 'X') {
                continue;
            }
            for (const [e_i, e_j] of [
                [0, 1],
                [1, 1],
                [1, 0],
                [1, -1],
                [0, -1],
                [-1, -1],
                [-1, 0],
                [-1, 1],
            ] as [number, number][]) {
                for (const [n, char] of [
                    [1, 'M'],
                    [2, 'A'],
                    [3, 'S'],
                ] as [number, string][]) {
                    const t_i = i + e_i * n;
                    const t_j = j + e_j * n;
                    if (t_i < 0 || chars.length <= t_i || t_j < 0 || chars[t_i]!.length <= t_j) {
                        break;
                    }
                    if (chars[t_i]![t_j] !== char) {
                        break;
                    }
                    if (char === 'S') {
                        occurrences++;
                    }
                }
            }
        }
    }

    return occurrences;
}

console.log(part1());

function part2() {
    let occurrences = 0;

    for (let i = 1; i < chars.length - 1; i++) {
        for (let j = 1; j < chars.length - 1; j++) {
            if (chars[i]![j] !== 'A') {
                continue;
            }

            const diag_down = [chars[i - 1]![j - 1], chars[i + 1]![j + 1]];
            const diag_up = [chars[i - 1]![j + 1], chars[i + 1]![j - 1]];
            const diag_down_is_valid =
                (diag_down[0] === 'M' && diag_down[1] === 'S') || (diag_down[0] === 'S' && diag_down[1] === 'M');
            const diag_up_is_valid =
                (diag_up[0] === 'M' && diag_up[1] === 'S') || (diag_up[0] === 'S' && diag_up[1] === 'M');
            if (diag_down_is_valid && diag_up_is_valid) {
                occurrences++;
            }
        }
    }

    return occurrences;
}

console.log(part2());
