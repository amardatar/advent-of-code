import { getData } from './data.js';

const data = await getData(18);

const RANGE_I = 70;
const RANGE_J = 70;
const BYTES_TO_DROP = 1024;

function parseInput(): [number, number][] {
    return data.split('\n').map((row) => [Number(row.split(',')[0]), Number(row.split(',')[1])]);
}

function part1() {
    const input = parseInput();

    const maze = Array(RANGE_I + 1)
        .fill(undefined)
        .map((_, i) =>
            Array(RANGE_J + 1)
                .fill(undefined)
                .map((_, j) => (input.slice(0, BYTES_TO_DROP).some((b) => b[0] === j && b[1] === i) ? '#' : '.'))
        );

    let paths: [number, number][][] = [[[0, 0]]];
    while (paths.length > 0) {
        const newPaths: typeof paths = [];

        for (const path of paths) {
            const [i, j] = path.at(-1)!;
            for (const [e_i, e_j] of [
                [0, 1],
                [1, 0],
                [0, -1],
                [-1, 0],
            ] as [number, number][]) {
                if (i + e_i < 0 || RANGE_I < i + e_i || j + e_j < 0 || RANGE_J < j + e_j) {
                    continue;
                }
                if (maze[i + e_i]![j + e_j] === '#') {
                    continue;
                }
                if (path.slice(0, -1).some((p) => p[0] === i && p[1] === j)) {
                    continue;
                }
                if (i + e_i === RANGE_I && j + e_j === RANGE_J) {
                    return path.length;
                }
                newPaths.push([...path, [i + e_i, j + e_j]]);
            }
        }

        paths = newPaths.filter(
            (p, idx) =>
                idx === newPaths.findIndex((np) => p.at(-1)![0] === np.at(-1)![0] && p.at(-1)![1] === np.at(-1)![1])
        );
    }

    return maze.map((row) => row.join('')).join('\n');
}

console.log(part1());

const ALL_DIRECTIONS: [number, number][] = [
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
];

function getWallPieces(allWalls: [number, number][], initPiece: [number, number]): [number, number][] {
    const allPieces: [number, number][] = [];
    const uncheckedPieces = [initPiece];
    let piece: [number, number] | undefined;

    while ((piece = uncheckedPieces.shift()) !== undefined) {
        const next = ALL_DIRECTIONS.filter(([e_i, e_j]) => {
            const newPos: [number, number] = [piece![0] + e_i, piece![1] + e_j];

            if (allPieces.some((h) => h[0] === newPos[0] && h[1] === newPos[1])) {
                return false;
            }

            return allWalls.some((wall) => wall[0] === newPos[0] && wall[1] === newPos[1]);
        }).map<[number, number]>(([e_i, e_j]) => [piece![0] + e_i, piece![1] + e_j]);
        allPieces.push(...next);
        uncheckedPieces.push(...next);
    }

    return allPieces;
}

function blocksPath(allWalls: [number, number][]) {
    for (const edgeWall of allWalls.filter(
        (wall) => wall[0] === 0 || wall[1] === 0 || wall[0] === RANGE_I || wall[1] === RANGE_J
    )) {
        const wallPieces = getWallPieces(allWalls, edgeWall);
        if (edgeWall[0] === 0 && wallPieces.some((p) => p[0] === RANGE_I || p[1] === 0)) {
            return true;
        }
        if (edgeWall[1] === 0 && wallPieces.some((p) => p[0] === 0 || p[1] === RANGE_J)) {
            return true;
        }
        if (edgeWall[0] === RANGE_I && wallPieces.some((p) => p[0] === 0 || p[1] === RANGE_J)) {
            return true;
        }
        if (edgeWall[1] === RANGE_J && wallPieces.some((p) => p[0] === RANGE_I && p[1] === 0)) {
            return true;
        }
    }
    return false;
}

function part2() {
    const input = parseInput();

    for (let i = 0; i < input.length; i++) {
        if (blocksPath(input.slice(0, i + 1))) {
            return input[i]?.join(',');
        }
    }

    return null;
}

console.log(part2());
