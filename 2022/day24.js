const { getData } = require('./data');

async function part1() {
    const data = await getData(24);

    const map = data.split('\n').map(d => d.split(''));

    const blizzards = map.reduce(
        (a, c, i) => a.concat(...c.reduce(
            (b, d, j) => {
                if (d === '.' || d === '#')
                    return b;
                    
                return b.concat({ dir: d, i, j });
            },
            []
        )),
        []
    );

    const blizzardMovements = {
        '>': (i, j) => [i, j === map[i].length - 2 ? 1 : j + 1],
        'v': (i, j) => [i === map.length - 2 ? 1 : i + 1, j],
        '<': (i, j) => [i, j === 1 ? map[i].length - 2 : j - 1],
        '^': (i, j) => [i === 1 ? map.length - 2 : i - 1, j]
    };

    let posList = [[0, 1]];

    let n = 0;
    outer: while (true) {
        n++;
        blizzards.forEach(b => {
            const [newI, newJ] = blizzardMovements[b.dir](b.i, b.j);
            b.i = newI;
            b.j = newJ;
        });

        for (let k = 0; k < posList.length; ) {
            const [i, j] = posList[k];

            const initAvailablePositions = [[i, j], [i - 1, j], [i + 1, j], [i, j - 1], [i, j + 1]].filter(
                ([i, j]) => (i === 0 && j === 1) || (i > 0 && j > 0 && i < map.length - 1 && j < map[i].length - 1)
            );

            const availablePositions = blizzards.reduce((positions, b) => {
                const pos = positions.findIndex(([i, j]) => i === b.i && j === b.j);
                if (pos !== -1) {
                    positions.splice(pos, 1);
                }
                return positions;
            }, initAvailablePositions);

            if (availablePositions.some(([i, j]) => i === map.length - 2 && j === map[i].length - 2)) {
                break outer;
            }

            posList.splice(k, 1, ...availablePositions);
            k += availablePositions.length;
        }

        posList = posList.filter(([i, j], k) => posList.findIndex(([pi, pj]) => pi === i && pj === j) === k);
    }

    return n + 1;
}

async function part2() {
    const data = await getData(24);

    const map = data.split('\n').map(d => d.split(''));

    const blizzards = map.reduce(
        (a, c, i) => a.concat(...c.reduce(
            (b, d, j) => {
                if (d === '.' || d === '#')
                    return b;
                    
                return b.concat({ dir: d, i, j });
            },
            []
        )),
        []
    );

    const blizzardMovements = {
        '>': (i, j) => [i, j === map[i].length - 2 ? 1 : j + 1],
        'v': (i, j) => [i === map.length - 2 ? 1 : i + 1, j],
        '<': (i, j) => [i, j === 1 ? map[i].length - 2 : j - 1],
        '^': (i, j) => [i === 1 ? map.length - 2 : i - 1, j]
    };

    let posList = [[0, 1]];

    let n = 0;
    for (let m = 0; m < 3; m++) {
        outer: while (true) {
            n++;
            blizzards.forEach(b => {
                const [newI, newJ] = blizzardMovements[b.dir](b.i, b.j);
                b.i = newI;
                b.j = newJ;
            });

            for (let k = 0; k < posList.length; ) {
                const [i, j] = posList[k];

                const initAvailablePositions = [[i, j], [i - 1, j], [i + 1, j], [i, j - 1], [i, j + 1]].filter(
                    ([i, j]) =>
                        (i === 0 && j === 1) ||
                        (i === map.length - 1 && j === map[i].length - 2) ||
                        (i > 0 && j > 0 && i < map.length - 1 && j < map[i].length - 1)
                );

                const availablePositions = blizzards.reduce((positions, b) => {
                    const pos = positions.findIndex(([i, j]) => i === b.i && j === b.j);
                    if (pos !== -1) {
                        positions.splice(pos, 1);
                    }
                    return positions;
                }, initAvailablePositions);

                if (
                    availablePositions.some(
                        ([i, j]) =>
                            (m % 2 === 0 && i === map.length - 1 && j === map[i].length - 2) ||
                            (m % 2 === 1 && i === 0 && j === 1)
                    )
                ) {
                    break outer;
                }

                posList.splice(k, 1, ...availablePositions);
                k += availablePositions.length;
            }

            posList = posList.filter(([i, j], k) => posList.findIndex(([pi, pj]) => pi === i && pj === j) === k);
        }
        
        posList = m % 2 === 0
            ? [[map.length - 1, map[map.length - 1].length - 2]]
            : [[0, 1]];
    }

    return n;
}

part1().then(res => console.log('Part 1\n', res));

part2().then(res => console.log('Part 2\n', res));
