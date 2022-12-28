const { getData } = require('./data');

async function part1() {
    const data = await getData(14);
    const rocks = data.split('\n').map(d => d.split(' -> ').map(r => JSON.parse(`[${r}]`)));

    const xMin = Math.min.apply(null, rocks.map(r => Math.min.apply(null, r.map(s => s[0]))));
    const xMax = Math.max.apply(null, rocks.map(r => Math.max.apply(null, r.map(s => s[0]))));

    const yMax = Math.max.apply(null, rocks.map(r => Math.max.apply(null, r.map(s => s[1]))));

    const map = Array(yMax + 1).fill().map(() => Array(xMax - xMin + 1).fill('.'));
    map[0][500 - xMin] = '+';
    for (const rock of rocks) {
        for (let i = 1; i < rock.length; i++) {
            let [xFrom, yFrom] = rock[i - 1];
            let [xTo, yTo] = rock[i];
            xFrom -= xMin;
            xTo -= xMin;
            if (xFrom === xTo) {
                for (let j = Math.min(yFrom, yTo); j <= Math.max(yFrom, yTo); j++) {
                    map[j][xFrom] = '#';
                }
            } else {
                for (let j = Math.min(xFrom, xTo); j <= Math.max(xFrom, xTo); j++) {
                    map[yFrom][j] = '#';
                }
            }
        }
    }

    let n = 0;
    let pos = [0, 500 - xMin];

    outer: while(true) {
        pos = [0, 500 - xMin];
        while(true) {
            const [y, x] = pos;
            if (y === yMax) {
                break outer;
            } else if (map[y + 1][x] === '.') {
                pos[0]++;
            } else if (x === 0) {
                break outer;
            } else if (map[y + 1][x - 1] === '.') {
                pos[0]++;
                pos[1]--;
            } else if (x === xMax - xMin + 1) {
                break outer;
            } else if (map[y + 1][x + 1] === '.') {
                pos[0]++;
                pos[1]++;
            } else {
                map[pos[0]][pos[1]] = 'o';
                break;
            }
        }
        n++;
    }
    
    console.log(map.map(m => m.join('')).join('\n'));
    return n;
}

async function part2() {
    const data = await getData(14);
    const rocks = data.split('\n').map(d => d.split(' -> ').map(r => JSON.parse(`[${r}]`)));

    const yMax = Math.max.apply(null, rocks.map(r => Math.max.apply(null, r.map(s => s[1])))) + 2;

    // The sand can only form a triangle so xMin and xMax will offset at most yMax from 500
    const xMin = 500 - yMax;
    const xMax = 500 + yMax;

    const map = Array(yMax + 1).fill().map(() => Array(xMax - xMin + 1).fill('.'));
    map[0][500 - xMin] = '+';
    map[yMax] = map[yMax].map(() => '#');
    for (const rock of rocks) {
        for (let i = 1; i < rock.length; i++) {
            let [xFrom, yFrom] = rock[i - 1];
            let [xTo, yTo] = rock[i];
            xFrom -= xMin;
            xTo -= xMin;
            if (xFrom === xTo) {
                for (let j = Math.min(yFrom, yTo); j <= Math.max(yFrom, yTo); j++) {
                    map[j][xFrom] = '#';
                }
            } else {
                for (let j = Math.min(xFrom, xTo); j <= Math.max(xFrom, xTo); j++) {
                    map[yFrom][j] = '#';
                }
            }
        }
    }

    let n = 0;
    let pos = [0, 500 - xMin];

    outer: while(true) {
        pos = [0, 500 - xMin];
        while(true) {
            const [y, x] = pos;
            if (map[y + 1][x] === '.') {
                pos[0]++;
            } else if (x === 0) {
                break outer;
            } else if (map[y + 1][x - 1] === '.') {
                pos[0]++;
                pos[1]--;
            } else if (x === xMax - xMin + 1) {
                break outer;
            } else if (map[y + 1][x + 1] === '.') {
                pos[0]++;
                pos[1]++;
            } else if (y === 0 && x === 500 - xMin) {
                break outer;
            } else {
                map[pos[0]][pos[1]] = 'o';
                break;
            }
        }
        n++;
    }
    
    console.log(map.map(m => m.join('')).join('\n'));
    return n + 1;
}

part1().then(res => console.log('Part 1\n', res));

part2().then(res => console.log('Part 2\n', res));
