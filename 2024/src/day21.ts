import { getData } from './data.js';

const data = await getData(21);

const directionalKeypadMap = {
    '^': { '>': 'A', v: 'v' },
    A: { v: '>', '<': '^' },
    '<': { '>': 'v' },
    v: { '>': '>', '<': '<', '^': '^' },
    '>': { '<': 'v', '^': 'A' },
};

const numericKeypadMap = {
    '0': { '>': 'A', '^': '2' },
    A: { '<': '0', '^': '3' },
    '1': { '>': '2', '^': '4' },
    '2': { '>': '3', v: '0', '<': '1', '^': '5' },
    '3': { v: 'A', '<': '2', '^': '6' },
    '4': { '>': '5', v: '1', '^': '7' },
    '5': { '>': '6', v: '2', '<': '4', '^': '8' },
    '6': { v: '3', '<': '5', '^': '9' },
    '7': { '>': '8', v: '4' },
    '8': { '>': '9', v: '5', '<': '7' },
    '9': { v: '6', '<': '8' },
};

function parseInput() {
    return data.split('\n');
}

class Cache<K, V> extends Map<K, V> {
    getOrSet(k: K, v: () => V) {
        const existingVal = this.get(k);
        if (existingVal !== undefined) {
            return existingVal;
        }
        const newVal = v();
        this.set(k, newVal);
        return newVal;
    }
}

const directionChangesCache = new Cache<string, number>();
function getDirectionChanges(path: string): number {
    return directionChangesCache.getOrSet(path, () =>
        path
            .split('')
            .slice(1)
            .reduce((a, c, i) => a + (path[i] === c ? 0 : 1), 0)
    );
}

function getNumericKeypadShortestPaths(start: string, end: string) {
    let paths: { pos: string; history: string }[] = [{ pos: start, history: '' }];
    while (paths.every((path) => path.pos !== end)) {
        const newPaths: typeof paths = [];
        for (const path of paths) {
            for (const [dir, key] of Object.entries(numericKeypadMap[path.pos as keyof typeof numericKeypadMap])) {
                newPaths.push({ pos: key, history: `${path.history}${dir}` });
            }
        }
        paths = newPaths;
    }
    return paths
        .filter((path) => path.pos === end && getDirectionChanges(path.history) < 2)
        .map((path) => path.history);
}

const directionalKeypadShortestPathsCache = new Cache<string, string[]>();
function getDirectionalKeypadShortestPaths(start: string, end: string): string[] {
    return directionalKeypadShortestPathsCache.getOrSet(`${start}${end}`, () => {
        let paths: { pos: string; history: string }[] = [{ pos: start, history: '' }];
        while (paths.every((path) => path.pos !== end)) {
            const newPaths: typeof paths = [];
            for (const path of paths) {
                for (const [dir, key] of Object.entries(
                    directionalKeypadMap[path.pos as keyof typeof directionalKeypadMap]
                )) {
                    newPaths.push({ pos: key, history: `${path.history}${dir}` });
                }
            }
            paths = newPaths;
        }
        return paths
            .filter((path) => path.pos === end && getDirectionChanges(path.history) < 2)
            .map((path) => path.history);
    });
}

const directionalKeypadPressesCache = new Cache<string, number>();
function getDirectionalKeypadPresses(seq: string, n: number): number {
    return seq
        .split('')
        .map((button, idx) =>
            directionalKeypadPressesCache.getOrSet(`${idx === 0 ? 'A' : seq[idx - 1]!}${button}${n}`, () => {
                const paths = getDirectionalKeypadShortestPaths(idx === 0 ? 'A' : seq[idx - 1]!, button);
                return paths.reduce((acc, path) => {
                    const presses = n === 1 ? path.length + 1 : getDirectionalKeypadPresses(`${path}A`, n - 1);
                    return acc !== -1 && acc < presses ? acc : presses;
                }, -1);
            })
        )
        .reduce((a, c) => a + c, 0);
}

function getNumericKeypadPresses(seq: string, robots = 2): number {
    return seq
        .split('')
        .map((button, idx) => {
            const paths = getNumericKeypadShortestPaths(idx === 0 ? 'A' : seq[idx - 1]!, button);
            return paths.map((path) => getDirectionalKeypadPresses(`${path}A`, robots)).sort((a, b) => a - b)[0]!;
        })
        .reduce((a, c) => a + c, 0);
}

function part1() {
    const input = parseInput();
    console.log(input.map((seq) => getNumericKeypadPresses(seq)));
    return input.reduce((acc, seq) => acc + Number(seq.slice(0, 3)) * getNumericKeypadPresses(seq), 0);
}

console.log(part1());

function part2() {
    const input = parseInput();
    return input.reduce((acc, seq) => acc + Number(seq.slice(0, 3)) * getNumericKeypadPresses(seq, 25), 0);
}

console.log(part2());
