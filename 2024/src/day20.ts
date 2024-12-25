import { getData } from './data.js';

const data = await getData(20);

interface PathSegment {
    i: number;
    j: number;
    distance: number;
}

function parseInput() {
    return data.split('\n').map((row) => row.split(''));
}

const DIRS: [number, number][] = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
];

function getPath(maze: string[][]): PathSegment[] {
    const start = maze.reduce<[number, number]>(
        (acc, row, i) => (row.includes('S') ? [i, row.indexOf('S')] : acc),
        [-1, -1]
    );
    const history: PathSegment[] = [{ i: start[0], j: start[1], distance: 0 }];

    while (true) {
        const prevPos = history.at(-2);
        const pos = history.at(-1)!;
        for (const [e_i, e_j] of DIRS) {
            const nextPos = { i: pos.i + e_i, j: pos.j + e_j, distance: pos.distance + 1 };

            if (prevPos?.i === nextPos.i && prevPos.j === nextPos.j) {
                continue;
            }

            const nextVal = maze[nextPos.i]![nextPos.j];

            if (nextVal === '#') {
                continue;
            }

            history.push(nextPos);

            if (nextVal === 'E') {
                return history;
            }

            break;
        }
    }
}

function distance(p1: PathSegment, p2: PathSegment) {
    return Math.abs(p1.i - p2.i) + Math.abs(p1.j - p2.j);
}

function part1() {
    const input = parseInput();
    const path = getPath(input);
    return path.reduce((a, p1, i) => a + path.slice(i + 102).filter((p2) => distance(p1, p2) <= 2).length, 0);
}

console.log(part1());

function part2() {
    const input = parseInput();
    const path = getPath(input);
    return path.reduce(
        (a, p1, i) =>
            a +
            path
                .slice(i + 100)
                .filter((p2) => distance(p1, p2) <= 20 && p2.distance - p1.distance - distance(p1, p2) >= 100).length,
        0
    );
}

console.log(part2());
