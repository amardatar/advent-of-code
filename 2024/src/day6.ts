import { getData } from './data.js';

const data = await getData(6);

const DIRS: ('^' | '>' | 'v' | '<')[] = ['^', '>', 'v', '<', '^'];
const DIR_MAP: Record<(typeof DIRS)[0], [number, number]> = {
    '^': [-1, 0],
    '>': [0, 1],
    v: [1, 0],
    '<': [0, -1],
};
const isDir = (dir: string): dir is (typeof DIRS)[0] => (DIRS as string[]).includes(dir);

function part1() {
    const map = data.split('\n').map((row) => row.split(''));

    let pos = map.reduce<[number, number]>(
        (acc, row, idx) => {
            if (acc[0] !== -1) {
                return acc;
            }
            const j = row.findIndex((el) => el in DIR_MAP);
            if (j !== -1) {
                return [idx, j];
            }
            return acc;
        },
        [-1, -1]
    );
    const visitedPositions: [number, number][] = [];
    while (true) {
        const [i, j] = pos;
        visitedPositions.push([i, j]);
        const dir = map[i]![j]!;
        if (!isDir(dir)) {
            throw new Error(`Got ${dir} at position ${i}, ${j} instead of a direction`);
        }
        const [e_i, e_j] = DIR_MAP[dir];
        const t_i = i + e_i;
        const t_j = j + e_j;
        if (t_i < 0 || map.length <= t_i || t_j < 0 || map[t_i]!.length <= t_j) {
            break;
        }
        if (map[t_i]![t_j] === '#') {
            map[i]![j] = DIRS[DIRS.indexOf(dir) + 1]!;
        } else {
            map[t_i]![t_j] = map[i]![j]!;
            map[i]![j] = '.';
            pos = [t_i, t_j];
        }
    }
    return new Set(visitedPositions.map(([i, j]) => `${i}.${j}`)).size;
}

console.log(part1());

function part2() {
    ('');
    const map = data.split('\n').map((row) => row.split(''));

    let num_loops = 0;

    for (let c_i = 0; c_i < map.length; c_i++) {
        for (let c_j = 0; c_j < map[c_i]!.length; c_j++) {
            console.log(c_i, c_j);

            const testMap = [...map.map((row) => [...row])];

            let pos = testMap.reduce<[number, number]>(
                (acc, row, idx) => {
                    if (acc[0] !== -1) {
                        return acc;
                    }
                    const j = row.findIndex((el) => el in DIR_MAP);
                    if (j !== -1) {
                        return [idx, j];
                    }
                    return acc;
                },
                [-1, -1]
            );

            if (c_i === pos[0] && c_j === pos[1]) {
                continue;
            }
            testMap[c_i]![c_j] = '#';

            const visitedPositions: [number, number][] = [pos];
            while (true) {
                const [i, j] = pos;
                const dir = testMap[i]![j]!;
                if (!isDir(dir)) {
                    throw new Error(`Got ${dir} at position ${i}, ${j} instead of a direction`);
                }
                const [e_i, e_j] = DIR_MAP[dir];
                const t_i = i + e_i;
                const t_j = j + e_j;
                if (t_i < 0 || testMap.length <= t_i || t_j < 0 || testMap[t_i]!.length <= t_j) {
                    break;
                }
                if (testMap[t_i]![t_j] === '#') {
                    testMap[i]![j] = DIRS[DIRS.indexOf(dir) + 1]!;
                } else {
                    if (
                        visitedPositions.length > 1 &&
                        visitedPositions
                            .slice(0, -1)
                            .some(
                                (vp, idx) =>
                                    vp[0] === i &&
                                    vp[1] === j &&
                                    visitedPositions[idx + 1]![0] === t_i &&
                                    visitedPositions[idx + 1]![1] === t_j
                            )
                    ) {
                        num_loops++;
                        break;
                    }

                    testMap[t_i]![t_j] = testMap[i]![j]!;
                    testMap[i]![j] = '.';
                    pos = [t_i, t_j];
                    visitedPositions.push([t_i, t_j]);
                }
            }
        }
    }

    return num_loops;
}

console.log(part2());
