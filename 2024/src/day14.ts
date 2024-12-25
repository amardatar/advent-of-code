import { getData } from './data.js';

const data = await getData(14);

const WIDTH = 101;
const HEIGHT = 103;

const QUADRANTS: { start: { x: number; y: number }; end: { x: number; y: number } }[] = [
    { start: { x: 0, y: 0 }, end: { x: Math.floor(WIDTH / 2), y: Math.floor(HEIGHT / 2) } },
    { start: { x: Math.ceil(WIDTH / 2), y: 0 }, end: { x: WIDTH, y: Math.floor(HEIGHT / 2) } },
    { start: { x: 0, y: Math.ceil(HEIGHT / 2) }, end: { x: Math.floor(WIDTH / 2), y: HEIGHT } },
    { start: { x: Math.ceil(WIDTH / 2), y: Math.ceil(HEIGHT / 2) }, end: { x: WIDTH, y: HEIGHT } },
];

function parseInput() {
    const robots = data.split('\n').map((line) => {
        const [pos, vel] = line.split(' ');
        const [posX, posY] = pos?.split('=')[1]?.split(',') ?? [];
        const [velX, velY] = vel?.split('=')[1]?.split(',') ?? [];
        return { position: { x: Number(posX), y: Number(posY) }, velocity: { x: Number(velX), y: Number(velY) } };
    });
    return robots;
}

function part1() {
    const robots = parseInput();

    for (let i = 0; i < 100; i++) {
        robots.forEach((robot) => {
            robot.position.x += robot.velocity.x;
            robot.position.y += robot.velocity.y;

            if (robot.position.x < 0) {
                robot.position.x += WIDTH;
            }
            if (robot.position.x >= WIDTH) {
                robot.position.x -= WIDTH;
            }
            if (robot.position.y < 0) {
                robot.position.y += HEIGHT;
            }
            if (robot.position.y >= HEIGHT) {
                robot.position.y -= HEIGHT;
            }
        });
    }

    const quadrantCounts = robots.reduce<number[]>(
        (acc, robot) => {
            const quadrant = QUADRANTS.findIndex(
                ({ start, end }) =>
                    start.x <= robot.position.x &&
                    robot.position.x < end.x &&
                    start.y <= robot.position.y &&
                    robot.position.y < end.y
            );

            if (acc[quadrant] === undefined) {
                return acc;
            }

            acc[quadrant]++;
            return acc;
        },
        [0, 0, 0, 0]
    );

    return quadrantCounts.reduce((a, c) => a * c, 1);
}

console.log(part1());

function part2() {
    const robots = parseInput();

    for (let i = 0; i < 100000000; i++) {
        robots.forEach((robot) => {
            robot.position.x += robot.velocity.x;
            robot.position.y += robot.velocity.y;

            if (robot.position.x < 0) {
                robot.position.x += WIDTH;
            }
            if (robot.position.x >= WIDTH) {
                robot.position.x -= WIDTH;
            }
            if (robot.position.y < 0) {
                robot.position.y += HEIGHT;
            }
            if (robot.position.y >= HEIGHT) {
                robot.position.y -= HEIGHT;
            }
        });

        const sorted = robots.sort((a, b) =>
            a.position.y === b.position.y ? a.position.x - b.position.x : a.position.y - b.position.y
        );

        if (
            sorted
                .slice(0, -10)
                .some((r, i) =>
                    [1, 2, 3, 4, 5, 6, 7, 8, 9].every(
                        (j) =>
                            r.position.y === sorted[i + j]?.position.y && r.position.x + j === sorted[i + j]?.position.x
                    )
                )
        ) {
            let robotMap = '';
            for (let y = 0; y <= HEIGHT; y++) {
                for (let x = 0; x <= WIDTH; x++) {
                    if (robots.some((robot) => robot.position.x === x && robot.position.y === y)) {
                        robotMap += '#';
                    } else {
                        robotMap += '.';
                    }
                }
                robotMap += '\n';
            }
            console.log(robotMap);
            // Check the image for validity
            return i + 1;
        }
    }

    return null;
}

console.log(part2());
