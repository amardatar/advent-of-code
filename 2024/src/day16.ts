import { getData } from './data.js';

const data = await getData(16);

const Direction: Readonly<Record<'UP' | 'DOWN' | 'LEFT' | 'RIGHT', [number, number]>> = {
    UP: [-1, 0],
    DOWN: [1, 0],
    LEFT: [0, -1],
    RIGHT: [0, 1],
};

class Position {
    private readonly buf: Buffer;

    constructor(i: number, j: number, dir: [number, number]) {
        this.buf = Buffer.alloc(3);
        this.buf.writeUInt8(i);
        this.buf.writeUInt8(j, 1);
        this.buf.writeInt8(dir[0] * 16 + dir[1], 2);
    }

    get i(): number {
        return this.buf.readUInt8();
    }

    set i(i: number) {
        this.buf.writeUInt8(i);
    }

    get j(): number {
        return this.buf.readUInt8(1);
    }

    set j(j: number) {
        this.buf.writeUInt8(j, 1);
    }

    get dir(): [number, number] {
        const dir = this.buf.readInt8(2);
        const j = dir % 16;
        const i = (dir - j) / 16;
        return [i, j];
    }

    set dir(dir: [number, number]) {
        this.buf.writeInt8(dir[0] * 16 + dir[1], 2);
    }

    get hash(): string {
        return this.buf.toString('base64');
    }
}

class Path {
    public readonly pos: Position;

    constructor(
        public history: Position[],
        public readonly cost: number
    ) {
        const pos = this.history.at(-1);
        if (pos === undefined) {
            throw new Error('Must have at least one position in history');
        }
        this.pos = pos;
    }

    get dir(): [number, number] {
        return this.pos.dir;
    }

    getNewPaths(maze: string[][]) {
        return Object.values(Direction).reduce<Path[]>((newPaths, dir) => {
            const nextPos = new Position(this.pos.i + dir[0], this.pos.j + dir[1], dir);

            if (
                maze[nextPos.i]![nextPos.j] !== '#' &&
                this.history.every((h) => nextPos.i !== h.i || nextPos.j !== h.j)
            ) {
                newPaths.push(
                    new Path(
                        [...this.history, nextPos],
                        this.cost + (dir[0] === this.dir[0] && dir[1] === this.dir[1] ? 1 : 1001)
                    )
                );
            }

            return newPaths;
        }, []);
    }
}

function parseInput() {
    return data.split('\n').map((line) => line.split(''));
}

function fillDeadEnds(maze: string[][]): string[][] {
    let changes = 0;
    maze.forEach((row, i) => {
        row.forEach((el, j) => {
            if (el !== '.') {
                return;
            }

            const [emptyDir, ...otherEmptyDirs] = Object.values(Direction).filter(
                ([e_i, e_j]) => maze[i + e_i]![j + e_j] !== '#'
            );
            if (emptyDir !== undefined && otherEmptyDirs.length === 0) {
                changes++;
                maze[i]![j] = '#';
            }
        });
    });
    return changes > 0 ? fillDeadEnds(maze) : maze;
}

function part1() {
    const input = parseInput();

    const maze = fillDeadEnds(input);

    const initPos = maze.reduce<Position | undefined>(
        (acc, row, i) => (row.includes('S') ? new Position(i, row.indexOf('S'), Direction.RIGHT) : acc),
        undefined
    )!;
    let paths: Path[] = [new Path([initPos], 0)];

    const finishedPaths: Path[] = [];

    const costMap = new Map<string, number>();

    while (paths.length > 0) {
        let newPaths: Path[] = [];
        let path: Path | undefined;
        while ((path = paths.shift()) !== undefined) {
            const nextPaths = path.getNewPaths(maze);
            for (const nextPath of nextPaths) {
                if (nextPath.pos.i === 1 && nextPath.pos.j === maze[1]!.length - 2) {
                    finishedPaths.push(nextPath);
                } else {
                    const existingCost = costMap.get(nextPath.pos.hash);
                    if (existingCost === undefined) {
                        costMap.set(nextPath.pos.hash, nextPath.cost);
                    } else if (existingCost < nextPath.cost) {
                        continue;
                    } else {
                        costMap.set(nextPath.pos.hash, nextPath.cost);
                        newPaths = newPaths.filter((p) => !p.history.some((h) => h.hash === nextPath.pos.hash));
                        paths = paths.filter((p) => !p.history.some((h) => h.hash === nextPath.pos.hash));
                    }
                    newPaths.push(nextPath);
                }
            }
        }
        paths = newPaths;
    }

    const sortedPaths = finishedPaths.sort((a, b) => a.cost - b.cost);

    return sortedPaths[0]!.cost;
}

console.log(part1());

function part2() {
    const input = parseInput();

    const maze = fillDeadEnds(input);

    const initPos = maze.reduce<Position | undefined>(
        (acc, row, i) => (row.includes('S') ? new Position(i, row.indexOf('S'), Direction.RIGHT) : acc),
        undefined
    )!;
    let paths: Path[] = [new Path([initPos], 0)];

    const finishedPaths: Path[] = [];

    const costMap = new Map<string, number>();

    while (paths.length > 0) {
        let newPaths: Path[] = [];
        let path: Path | undefined;
        while ((path = paths.shift()) !== undefined) {
            const nextPaths = path.getNewPaths(maze);
            for (const nextPath of nextPaths) {
                if (nextPath.pos.i === 1 && nextPath.pos.j === maze[1]!.length - 2) {
                    finishedPaths.push(nextPath);
                } else {
                    const existingCost = costMap.get(nextPath.pos.hash);
                    if (existingCost === undefined) {
                        costMap.set(nextPath.pos.hash, nextPath.cost);
                    } else if (existingCost < nextPath.cost) {
                        continue;
                    } else {
                        costMap.set(nextPath.pos.hash, nextPath.cost);
                        newPaths = newPaths.filter(
                            (p) => !(p.history.some((h) => h.hash === nextPath.pos.hash) && p.cost > nextPath.cost)
                        );
                        paths = paths.filter(
                            (p) => !(p.history.some((h) => h.hash === nextPath.pos.hash) && p.cost > nextPath.cost)
                        );
                    }
                    newPaths.push(nextPath);
                }
            }
        }
        paths = newPaths;
    }

    const sortedPaths = finishedPaths.sort((a, b) => a.cost - b.cost);

    const shortestPaths = sortedPaths.filter((path) => path.cost === sortedPaths[0]!.cost);

    const tiles = shortestPaths.reduce<[number, number][]>((a1, path) => {
        return path.history.reduce<[number, number][]>((a2, pos) => {
            if (!a2.some((p) => p[0] === pos.i && p[1] === pos.j)) {
                a2.push([pos.i, pos.j]);
            }
            return a2;
        }, a1);
    }, []);

    return tiles.length;
}

console.log(part2());
