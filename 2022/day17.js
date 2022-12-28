const { getData } = require('./data');

// x and y positions are based on the bottom-left of the rock (or the top-left as created here).
const rocks = [
    (y) => ({
        x: 2,
        y,
        width: 4,
        height: 1,
        rock: [
            [true, true, true, true]
        ]
    }),
    (y) => ({
        x: 2,
        y,
        width: 3,
        height: 3,
        rock: [
            [null, true, null],
            [true, true, true],
            [null, true, null]
        ]
    }),
    (y) => ({
        x: 2,
        y,
        width: 3,
        height: 3,
        rock: [
            [true, true, true],
            [null, null, true],
            [null, null, true]
        ]
    }),
    (y) => ({
        x: 2,
        y,
        width: 1,
        height: 4,
        rock: [
            [true],
            [true],
            [true],
            [true]
        ]
    }),
    (y) => ({
        x: 2,
        y,
        width: 2,
        height: 2,
        rock: [
            [true, true],
            [true, true]
        ]
    })
];

const getNextRockFn = () => {
    let i = 0;
    return {
        nextRock: (y) => rocks[i++ % 5](y),
        currentI: () => i
    };
};

const getNextJetFn = (data) => {
    let i = 0;
    const len = data.length;
    return {
        nextJet: () => data[i++ % len],
        currentI: () => i
    };
};

const moveIfFree = (x, width, dir) => dir.reduce((a, d) => {
    if (d === -1 && a > 0) {
        a--;
    } else if (d === 1 && a + width < 7) {
        a++;
    }
    return a;
}, x);

/**
 * Check if the provided rock has overlap with existing rocks in the map. Returns true if there is no overlap.
 */
const checkOverlap = (map, rock, x, y, floorMin) =>
    rock.every((r, i) => r.every((s, j) => !s || !map[y + i + 1 - floorMin][x + j]));

async function part1() {
    const data = await getData(17);

    const { nextRock } = getNextRockFn();
    const { nextJet } = getNextJetFn(data.split('').map(d => d === '<' ? -1 : 1));

    const map = [Array(7).fill(true)];
    
    let floorMin = 0;
    let floorMax = 0;

    for (let i = 0; i < 2022; i++) {
        let { rock, x, y, width, height } = nextRock(floorMax);

        const additions = y + height + 1 - map.length - floorMin;
        if (additions > 0) {
            map.push(...Array(additions).fill().map(() => Array(7).fill(false)));
        }

        // For the first 4 horizontal steps, the rock won't settle.
        x = moveIfFree(x, width, [nextJet(), nextJet(), nextJet(), nextJet()]);

        while (true) {
            y--;
            if (y < 0 || !checkOverlap(map, rock, x, y, floorMin)) {
                y++;

                if (y + height > floorMax) floorMax = y + height;

                rock.forEach((r, i) => r.forEach((s, j) => s ? map[y + i + 1 - floorMin][x + j] = true : undefined));

                break;
            }

            const jet = nextJet();

            x += jet;

            if (x < 0 || 7 < x + width || !checkOverlap(map, rock, x, y, floorMin)) {
                x -= jet;
            }
        }
    }

    return floorMax;
}

async function part2() {
    const data = await getData(17);

    const { nextRock, currentI: rockCurrentI } = getNextRockFn();
    const { nextJet, currentI: jetCurrentI } = getNextJetFn(data.split('').map(d => d === '<' ? -1 : 1));

    const map = [Array(7).fill(true)];
    
    let floorMin = 0;
    let floorMax = 0;

    const floorHeights = [];
    const cycles = [];
    let cycleStart = [];
    let cycleEnd = [];

    for (let i = 0; i < 10000000; i++) {
        floorHeights.push(floorMax);
        if (i > 0 && cycles[i / 2] === (rockCurrentI() % 5) * data.length + (jetCurrentI() % data.length)) {
            if (cycleStart.length === 0) {
                cycleStart = [i, floorMax];
            } else {
                cycleEnd = [i, floorMax];
                break;
            }
        }
        cycles.push((rockCurrentI() % 5) * 40 + (jetCurrentI() % data.length));

        let { rock, x, y, width, height } = nextRock(floorMax);

        const additions = y + height + 1 - map.length - floorMin;
        if (additions > 0) {
            map.push(...Array(additions).fill().map(() => Array(7).fill(false)));
        }

        // For the first 4 horizontal steps, the rock won't settle.
        x = moveIfFree(x, width, [nextJet(), nextJet(), nextJet(), nextJet()]);

        while (true) {
            y--;
            if (y < 0 || !checkOverlap(map, rock, x, y, floorMin)) {
                y++;

                if (y + height > floorMax) floorMax = y + height;

                rock.forEach((r, i) => r.forEach((s, j) => s ? map[y + i + 1 - floorMin][x + j] = true : undefined));

                if (i > 1000 && i % 1000 === 0) {
                    floorMin += map.length - 1000;
                    map.splice(0, map.length - 1000);
                }

                break;
            }

            const jet = nextJet();

            x += jet;

            if (x < 0 || 7 < x + width || !checkOverlap(map, rock, x, y, floorMin)) {
                x -= jet;
            }
        }
    }
    
    return Math.floor(10 ** 12 / cycleStart[0]) * (cycleEnd[1] - cycleStart[1]) + floorHeights[10 ** 12 % cycleStart[0]];
}

part1().then(res => console.log('Part 1\n', res));

part2().then(res => console.log('Part 2\n', res));
