import { getData } from './data.js';

const data = await getData(11);

function processStone(stone: number): number[] {
    const stoneStr = stone.toString();
    const digits = stoneStr.length;
    if (stone === 0) {
        return [1];
    } else if (digits % 2 === 0) {
        const left = Number(stoneStr.slice(0, digits / 2));
        const right = Number(stoneStr.slice(digits / 2));
        return [left, right];
    } else {
        return [stone * 2024];
    }
}

function part1() {
    const stones: number[] = data.split(' ').map((val) => Number(val));

    for (let n = 0; n < 25; n++) {
        for (let i = 0; i < stones.length; i++) {
            const newStones = processStone(stones[i]!);
            stones.splice(i, 1, ...newStones);
            i += newStones.length - 1;
        }
    }

    return stones.length;
}

console.log(part1());

function part2() {
    let stones = data.split(' ').reduce((acc, val) => acc.set(Number(val), 1), new Map<number, number>());

    for (let n = 0; n < 75; n++) {
        const newStones = new Map<number, number>();
        stones.forEach((count, stone) => {
            const extraStones = processStone(stone);
            extraStones.forEach((newStone) => {
                newStones.set(newStone, (newStones.get(newStone) ?? 0) + count);
            });
        });
        stones = newStones;
    }

    return [...stones.values()].reduce((a, c) => a + c, 0);
}

console.log(part2());
