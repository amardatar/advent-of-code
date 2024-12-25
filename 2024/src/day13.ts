import { getData } from './data.js';

const data = await getData(13);

type Machine = Record<'buttonA' | 'buttonB' | 'prize', { x: number; y: number }>;

const buttonRegex = /^Button [AB]: X\+(?<x>\d+), Y\+(?<y>\d+)$/;
const prizeRegex = /^Prize: X=(?<x>\d+), Y=(?<y>\d+)$/;

function parseInput(): Machine[] {
    const machines = data.split('\n\n');
    return machines.map((machine) => {
        const lines = machine.split('\n');

        const buttonA = lines[0]?.match(buttonRegex);
        const buttonB = lines[1]?.match(buttonRegex);
        const prize = lines[2]?.match(prizeRegex);

        const res = {
            buttonA: { x: Number(buttonA?.groups?.['x']), y: Number(buttonA?.groups?.['y']) },
            buttonB: { x: Number(buttonB?.groups?.['x']), y: Number(buttonB?.groups?.['y']) },
            prize: { x: Number(prize?.groups?.['x']), y: Number(prize?.groups?.['y']) },
        };
        return res;
    });
}

function normalise(float: number) {
    return float % 1 < 0.001 || 1 - (float % 1) < 0.001 ? Math.round(float) : float;
}

function solve({ buttonA, buttonB, prize }: Machine): { a: number; b: number } {
    const matrix: [[number, number, number], [number, number, number]] = [
        [buttonA.x, buttonB.x, prize.x],
        [buttonA.y, buttonB.y, prize.y],
    ];

    if (matrix[1][0] !== 0) {
        const mult = matrix[0][0] / matrix[1][0];
        matrix[1].forEach((el, idx) => (matrix[1][idx] = el * mult - matrix[0][idx]!));

        const div = matrix[1][1];
        matrix[1].forEach((el, idx) => (matrix[1][idx] = el / div));
    }

    if (matrix[0][1] !== 0) {
        const mult = matrix[1][1] / matrix[0][1];
        matrix[0].forEach((el, idx) => (matrix[0][idx] = el * mult - matrix[1][idx]!));

        const div = matrix[0][0];
        matrix[0].forEach((el, idx) => (matrix[0][idx] = el / div));
    }

    return { a: normalise(matrix[0][2]), b: normalise(matrix[1][2]) };
}

function part1() {
    const machines = parseInput();
    const solutions = machines.map(solve);
    console.log(solutions);
    return solutions.reduce((acc, sol) => acc + (sol.a % 1 === 0 && sol.b % 1 === 0 ? 3 * sol.a + sol.b : 0), 0);
}

console.log(part1());

function part2() {
    const machines = parseInput().map((machine) => ({
        ...machine,
        prize: { x: machine.prize.x + 10000000000000, y: machine.prize.y + 10000000000000 },
    }));
    const solutions = machines.map(solve);
    console.log(solutions);
    return solutions.reduce((acc, sol) => acc + (sol.a % 1 === 0 && sol.b % 1 === 0 ? 3 * sol.a + sol.b : 0), 0);
}

console.log(part2());
