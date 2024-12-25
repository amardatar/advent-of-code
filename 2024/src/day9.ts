import { getData } from './data.js';

const data = await getData(9);

function part1() {
    const blocks = data.split('').reduce<(number | null)[]>((a, c, i) => {
        if (Number(c) === 0) {
            return a;
        }
        if (i % 2 === 0) {
            return a.concat(Array(Number(c)).fill(i / 2));
        } else {
            return a.concat(Array(Number(c)).fill(null));
        }
    }, []);

    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i] !== null) {
            continue;
        }

        const last = blocks.findLastIndex((el) => el !== null);
        if (last < i) {
            break;
        }

        blocks[i] = blocks.splice(last, 1)[0]!;
    }

    return blocks.reduce<number>((a, c, i) => a + (c ?? 0) * i, 0);
}

console.log(part1());

function part2() {
    let pos = 0;
    const blocks = data.split('').reduce<{ id: number; size: number; startPos: number }[]>((a, c, i) => {
        if (Number(c) !== 0 && i % 2 === 0) {
            a.push({ id: i / 2, size: Number(c), startPos: pos });
        }

        pos += Number(c);
        return a;
    }, []);

    for (const file of blocks.toReversed()) {
        blocks.sort((a, b) => a.startPos - b.startPos);
        const idx = blocks.findIndex(
            ({ startPos, size }, i) =>
                i < blocks.length - 1 &&
                startPos < file.startPos &&
                blocks[i + 1]!.startPos - size - startPos >= file.size
        );
        if (idx !== -1) {
            blocks.splice(
                blocks.findIndex(({ id }) => id === file.id),
                1
            );
            blocks.splice(idx, 0, { ...file, startPos: blocks[idx]!.startPos + blocks[idx]!.size });
        }
    }

    console.log(blocks);

    const finalBlocks: (number | null)[] = [];
    for (let i = 0; i < blocks.length; i++) {
        const { id, size, startPos } = blocks[i]!;
        finalBlocks.push(...new Array<number>(size).fill(id));
        if (i === blocks.length - 1) {
            continue;
        }
        const emptySize = blocks[i + 1]!.startPos - size - startPos;
        if (emptySize > 0) {
            finalBlocks.push(...new Array<null>(emptySize).fill(null));
        }
    }

    return finalBlocks.reduce<number>((a, c, i) => a + (c ?? 0) * i, 0);
}

console.log(part2());
