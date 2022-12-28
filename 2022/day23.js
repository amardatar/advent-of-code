const { getData } = require('./data');

async function part1() {
    const data = await getData(23);

    const elves = data.split('\n').reduce((a, c, i) =>
        [ ...a, ...c.split('').reduce((b, d, j) => d === '#' ? [ ...b, [i, j] ] : b, []) ],
        []
    );

    const dirs = [
        [[-1, -1], [-1,  0], [-1,  1]],
        [[ 1,  1], [ 1,  0], [ 1, -1]],
        [[ 1, -1], [ 0, -1], [-1, -1]],
        [[-1,  1], [ 0,  1], [ 1,  1]]
    ];
    const around = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

    for (let n = 0; n < 10; n++) {
        const offsetI = elves.some(([i]) => i === 0) ? 1 : 0;
        const offsetJ = elves.some(([, j]) => j === 0) ? 1 : 0;
        if (offsetI + offsetJ > 0) {
            elves.forEach(e => (e[0] += offsetI) && (e[1] += offsetJ));
        }

        const maxI = elves.reduce((a, [i]) => i > a ? i : a, 0);
        const maxJ = elves.reduce((a, [, j]) => j > a ? j : a, 0);

        const map = Array(maxI + 2).fill().map(() => Array(maxJ + 2).fill(false));
        elves.forEach(([i, j]) => map[i][j] = true);

        const moves = elves.map(e => ({ pos: e }));
        for (const elf of moves) {
            if (around.every(([i, j]) => !map[elf.pos[0] + i][elf.pos[1] + j])) {
                elf.newPos = [...elf.pos];
                continue;
            }

            for (const dirCheck of dirs) {
                if (dirCheck.every(([i, j]) => !map[elf.pos[0] + i][elf.pos[1] + j])) {
                    elf.newPos = [elf.pos[0] + dirCheck[1][0], elf.pos[1] + dirCheck[1][1]];
                    break;
                }
            }
        }

        for (let m = 0; m < moves.length; m++) {
            const move = moves[m];
            if ('newPos' in move) {
                const samePosElves = moves.slice(m + 1).reduce((a, { newPos }, i) => {
                    if (newPos && newPos[0] === move.newPos[0] && newPos[1] === move.newPos[1]) {
                        return a.concat(m + 1 + i);
                    }
                    return a;
                }, []);
                
                if (samePosElves.length > 0) {
                    delete move.newPos;
                    samePosElves.forEach(k => {
                        delete moves[k].newPos;
                    });
                } else {
                    elves[m] = [...move.newPos];
                }
            }
        }

        dirs.push(dirs.shift());
    }

    const maxI = elves.reduce((a, [i]) => i > a ? i : a, 0);
    const maxJ = elves.reduce((a, [, j]) => j > a ? j : a, 0);
    const minI = elves.reduce((a, [i]) => i < a ? i : a, maxI);
    const minJ = elves.reduce((a, [, j]) => j < a ? j : a, maxJ);

    return (maxI - minI + 1) * (maxJ - minJ + 1) - elves.length;
}

async function part2() {
    const data = await getData(23);

    const elves = data.split('\n').reduce((a, c, i) =>
        [ ...a, ...c.split('').reduce((b, d, j) => d === '#' ? [ ...b, [i, j] ] : b, []) ],
        []
    );

    const dirs = [
        [[-1, -1], [-1,  0], [-1,  1]],
        [[ 1,  1], [ 1,  0], [ 1, -1]],
        [[ 1, -1], [ 0, -1], [-1, -1]],
        [[-1,  1], [ 0,  1], [ 1,  1]]
    ];
    const around = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

    let n = 0;
    while (true) {
        n++;
        const offsetI = elves.some(([i]) => i === 0) ? 1 : 0;
        const offsetJ = elves.some(([, j]) => j === 0) ? 1 : 0;
        if (offsetI + offsetJ > 0) {
            elves.forEach(e => (e[0] += offsetI) && (e[1] += offsetJ));
        }

        const maxI = elves.reduce((a, [i]) => i > a ? i : a, 0);
        const maxJ = elves.reduce((a, [, j]) => j > a ? j : a, 0);

        const map = Array(maxI + 2).fill().map(() => Array(maxJ + 2).fill(false));
        elves.forEach(([i, j]) => map[i][j] = true);

        const moves = elves.map(e => ({ pos: e }));
        for (const elf of moves) {
            if (around.every(([i, j]) => !map[elf.pos[0] + i][elf.pos[1] + j])) {
                elf.newPos = [...elf.pos];
                continue;
            }

            for (const dirCheck of dirs) {
                if (dirCheck.every(([i, j]) => !map[elf.pos[0] + i][elf.pos[1] + j])) {
                    elf.newPos = [elf.pos[0] + dirCheck[1][0], elf.pos[1] + dirCheck[1][1]];
                    break;
                }
            }
        }

        for (let m = 0; m < moves.length; m++) {
            const move = moves[m];
            if ('newPos' in move) {
                const samePosElves = moves.slice(m + 1).reduce((a, { newPos }, i) => {
                    if (newPos && newPos[0] === move.newPos[0] && newPos[1] === move.newPos[1]) {
                        return a.concat(m + 1 + i);
                    }
                    return a;
                }, []);
                
                if (samePosElves.length > 0) {
                    delete move.newPos;
                    samePosElves.forEach(k => {
                        delete moves[k].newPos;
                    });
                } else {
                    elves[m] = [...move.newPos];
                }
            }
        }

        if (moves.every(m => !('newPos' in m) || m.pos[0] === m.newPos[0] && m.pos[1] === m.newPos[1])) {
            break;
        }

        dirs.push(dirs.shift());
    }

    return n;
}

part1().then(res => console.log('Part 1\n', res));

part2().then(res => console.log('Part 2\n', res));
