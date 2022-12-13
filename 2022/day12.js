const { getData } = require('./data');

function availableMoves(map, visited, path, test = (a, b) => a > b + 1) {
    const [i, j] = path.at(-1);
    const moves = [];
    for (const [pi, pj] of [[i - 1, j], [i, j - 1], [i + 1, j], [i, j + 1]]) {
        if (pi < 0 || pj < 0 || pi >= map.length || pj >= map[i].length) continue;
        
        if (test(map[pi][pj], map[i][j])) continue;

        if (visited.find(p => p[0] === pi && p[1] === pj)) continue;

        moves.push([pi, pj]);
        visited.push([pi, pj]);
    }
    return moves;
}

async function part1() {
    const data = await getData(12);
    const startPos = data.split('\n').reduce((a, c, i) => c.includes('S') ? [i, c.indexOf('S')] : a, []);
    const endPos = data.split('\n').reduce((a, c, i) => c.includes('E') ? [i, c.indexOf('E')] : a, []);
    const map = data.split('\n').map(d => d.split('').map(c => {
        if (c === 'S') return 1;
        if (c === 'E') return 26;
        return c.charCodeAt(0) - 96;
    }));
    const paths = [[startPos]];
    const visited = [startPos];
    let finished = false;
    let i = 0;
    while (!finished) {
        i++;
        for (let n = 0; n < paths.length; ) {
            const path = paths[n];
            const moves = availableMoves(map, visited, path);
            if (moves.find(m => m[0] === endPos[0] && m[1] === endPos[1])) {
                const printMap = data.split('\n').map(row => row.split(''));
                path.forEach(([i, j]) => printMap[i][j] = printMap[i][j].toUpperCase());
                console.log(printMap.map(row => row.join('')).join('\n'));
                return i;
            }
            paths.splice(n, 1, ...moves.map(m => [...path, m]));
            n += moves.length;
        }
    }
}

async function part2() {
    const data = await getData(12);
    const startPos = data.split('\n').reduce((a, c, i) => c.includes('E') ? [i, c.indexOf('E')] : a, []);
    const map = data.split('\n').map(d => d.split('').map(c => {
        if (c === 'S') return 1;
        if (c === 'E') return 26;
        return c.charCodeAt(0) - 96;
    }));
    const paths = [[startPos]];
    const visited = [startPos];
    let finished = false;
    let i = 0;
    while (!finished) {
        i++;
        for (let n = 0; n < paths.length; ) {
            const path = paths[n];
            const moves = availableMoves(map, visited, path, (a, b) => a < b - 1);
            if (moves.find(m => map[m[0]][m[1]] === 1)) {
                return i;
            }
            paths.splice(n, 1, ...moves.map(m => [...path, m]));
            n += moves.length;
        }
    }
}

part1().then(res => console.log('Part 1\n', res));

part2().then(res => console.log('Part 2\n', res));
