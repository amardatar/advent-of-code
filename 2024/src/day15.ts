import { getData } from './data.js';

const data = await getData(15);

interface MapState {
    walls: [number, number][];
    boxes: [number, number][];
    robot: [number, number];
}

function parseInput() {
    const [map = '', moves = ''] = data.split('\n\n');
    const walls: [number, number][] = [];
    const boxes: [number, number][] = [];
    let robot: [number, number] | undefined;

    map.split('\n').forEach((row, i) => {
        row.split('').forEach((char, j) => {
            if (char === '#') {
                walls.push([i, j]);
            }

            if (char === 'O') {
                boxes.push([i, j]);
            }

            if (char === '@') {
                robot = [i, j];
            }
        });
    });

    if (robot === undefined) {
        throw new Error('Did not find robot');
    }

    return { walls, boxes, robot, moves: moves.replaceAll('\n', '').split('') as ('>' | 'v' | '<' | '^')[] };
}

const dirMap: Record<'>' | 'v' | '<' | '^', [number, number]> = {
    '>': [0, 1],
    v: [1, 0],
    '<': [0, -1],
    '^': [-1, 0],
};

function part1() {
    const { walls, boxes, robot, moves } = parseInput();

    for (const move of moves) {
        const boxesToMove: [number, number][] = [];
        const [e_i, e_j] = dirMap[move];
        let [i, j] = robot;
        while (true) {
            i += e_i;
            j += e_j;
            if (walls.some((wall) => wall[0] === i && wall[1] === j)) {
                boxesToMove.splice(0);
                break;
            }
            const box = boxes.find((box) => box[0] === i && box[1] === j);
            if (box !== undefined) {
                boxesToMove.push(box);
                continue;
            }
            robot[0] += e_i;
            robot[1] += e_j;
            break;
        }
        boxesToMove.forEach((box) => {
            box[0] += e_i;
            box[1] += e_j;
        });
    }

    return boxes.reduce((a, c) => a + c[0] * 100 + c[1], 0);
}

console.log(part1());

// Find any new boxes that are intersected by moving the existing boxes, and return a list of boxes (including the provided list) if they can (recursively) be moved.
function moveBox(
    { walls, boxes, robot }: MapState,
    box: [number, number],
    [e_i, e_j]: [number, number]
): [number, number][] {
    const [i, j] = box;
    if (walls.some((wall) => wall[0] === i + e_i && wall[1] + 1 >= j + e_j && wall[1] <= j + e_j + 1)) {
        return [];
    }

    const intersectingBoxes = boxes.filter(
        (b) => (b[0] !== i || b[1] !== j) && b[0] === i + e_i && b[1] + 1 >= j + e_j && b[1] <= j + e_j + 1
    );
    const res: [number, number][] = [box];
    for (const box of intersectingBoxes) {
        const nextBoxes = moveBox({ walls, boxes, robot }, box, [e_i, e_j]);
        if (nextBoxes.length === 0) {
            return [];
        }
        res.push(...nextBoxes);
    }
    return res;
}

function moveRobot({ walls, boxes, robot }: MapState, move: [number, number]) {
    const [i, j] = [robot[0] + move[0], robot[1] + move[1]];

    if (walls.some((wall) => i === wall[0] && (j === wall[1] || j === wall[1] + 1))) {
        return;
    }

    const box = boxes.find((box) => i === box[0] && (j === box[1] || j === box[1] + 1));
    if (box !== undefined) {
        const boxesToMove = moveBox({ walls, boxes, robot }, box, move);
        if (boxesToMove.length === 0) {
            return;
        }
        boxesToMove.forEach((b, idx) => {
            if (boxesToMove.indexOf(b) !== idx) {
                return;
            }
            b[0] += move[0];
            b[1] += move[1];
        });
    }

    robot[0] += move[0];
    robot[1] += move[1];
}

function part2() {
    const { walls, boxes, robot, moves } = parseInput();

    walls.forEach((wall) => (wall[1] *= 2));
    boxes.forEach((box) => (box[1] *= 2));
    robot[1] *= 2;

    for (const move of moves) {
        moveRobot({ walls, boxes, robot }, dirMap[move]);
    }

    return boxes.reduce((a, c) => a + c[0] * 100 + c[1], 0);
}

console.log(part2());
