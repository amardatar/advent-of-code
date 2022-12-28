const { getData } = require('./data');

async function part1() {
    const data = await getData(15);

    const sensors = data.split('\n').map(d => {
        const [sensorX, sensorY, beaconX, beaconY] = d.match(/-?[0-9]+/g).map(Number);
        return { sensorX, sensorY, beaconX, beaconY };
    });

    const yRow = 2000000;
    let posList = [];

    for (const { sensorX, sensorY, beaconX, beaconY } of sensors) {
        const range = Math.abs(beaconY - sensorY) + Math.abs(beaconX - sensorX);
        const distToY = Math.abs(yRow - sensorY);
        if (distToY < range) {
            for (let i = sensorX - (range - distToY); i <= sensorX + (range - distToY); i++) {
                posList.push(i);
            }
        }
    }

    sensors.forEach(({ beaconX, beaconY }) => {
        if (beaconY === yRow) {
            posList = posList.filter(p => p !== beaconX);
        }
    });

    return [...new Set(posList)].length;
}

async function part2() {
    const data = await getData(15);

    const sensors = data.split('\n').map(d => {
        const [sensorX, sensorY, beaconX, beaconY] = d.match(/-?[0-9]+/g).map(Number);
        const range = Math.abs(beaconX - sensorX) + Math.abs(beaconY - sensorY);
        const lines = [
            { x: sensorX - range, y: sensorY, length: range + 1, dir: +1 },
            { x: sensorX - range, y: sensorY, length: range + 1, dir: -1 },
            { x: sensorX, y: sensorY - range, length: range + 1, dir: +1 },
            { x: sensorX, y: sensorY + range, length: range + 1, dir: -1 },
        ]
        return { sensorX, sensorY, beaconX, beaconY, range, lines };
    });

    function inRange(x, y) {
        for (const { sensorX, sensorY, range } of sensors) {
            if (Math.abs(x - sensorX) + Math.abs(y - sensorY) <= range) {
                return true;
            }
        }
        return false;
    }

    for (const { sensorX, lines } of sensors) {
        for (const { x, y, length, dir } of lines) {
            for (let i = 0; i <= length; i++) {
                const xp = x + i;
                const yp = y + i * dir + (sensorX === x ? -dir : dir);
                if (xp < 0 || xp > 4000000 || yp < 0 || yp > 4000000) continue;
                if (!inRange(xp, yp)) {
                    return 4000000 * xp + yp;
                }
            }
        }
    }
}

part1().then(res => console.log('Part 1\n', res));

part2().then(res => console.log('Part 2\n', res));
