const { getData } = require('./data');

async function part1() {
    const data = await getData(18);
    
    const cubes = data.split('\n').map(d => {
        const [x, y, z] = d.split(',').map(Number);
        const faces = [
            [x + 1, y, z],
            [x, y + 1, z],
            [x, y, z + 1],
            [x - 1, y, z],
            [x, y - 1, z],
            [x, y, z - 1]
        ]
        return { x, y, z, faces };
    });

    cubes.forEach((cube) => {
        cube.faces = cube.faces.filter(f => !cubes.find(c => c.x === f[0] && c.y === f[1] && c.z === f[2]));
    });

    return cubes.reduce((a, c) => a + c.faces.length, 0);
}

async function part2() {
    const data = await getData(18);
    
    const cubes = data.split('\n').map(d => {
        const [x, y, z] = d.split(',').map(Number);
        const faces = [
            [x + 1, y, z],
            [x, y + 1, z],
            [x, y, z + 1],
            [x - 1, y, z],
            [x, y - 1, z],
            [x, y, z - 1]
        ]
        return { x, y, z, faces };
    });

    cubes.forEach((cube) => {
        cube.faces = cube.faces.filter(f => !cubes.find(c => c.x === f[0] && c.y === f[1] && c.z === f[2]));
    });

    const minMax = cubes.reduce((a, c) => {
        if (a.xMin === undefined || a.xMin > c.x) a.xMin = c.x;
        if (a.yMin === undefined || a.yMin > c.y) a.yMin = c.y;
        if (a.zMin === undefined || a.zMin > c.z) a.zMin = c.z;
        if (a.xMax === undefined || a.xMax < c.x) a.xMax = c.x;
        if (a.yMax === undefined || a.yMax < c.y) a.yMax = c.y;
        if (a.zMax === undefined || a.zMax < c.z) a.zMax = c.z;
        return a;
    }, {});

    const pockets = [];

    for (let x = minMax.xMin; x <= minMax.xMax; x++) {
        for (let y = minMax.yMin; y <= minMax.yMax; y++) {
            for (let z = minMax.zMin; z <= minMax.zMax; z++) {
                if (cubes.find(c => c.x === x && c.y === y && c.z === z)) {
                    continue;
                }

                pockets.push({ x, y, z, faces: [
                    [x + 1, y, z],
                    [x, y + 1, z],
                    [x, y, z + 1],
                    [x - 1, y, z],
                    [x, y - 1, z],
                    [x, y, z - 1]
                ] });
            }
        }
    }

    let maxN = 1;

    // For each pocket, find if another is adjacent. If so, they're part of the same pocket.
    for (let i = 0; i < pockets.length; i++) {
        if (!pockets[i].n) {
            pockets[i].n = maxN++;
        }

        // To avoid max call stack size issue when using a recursive function.
        const pocketStack = [pockets[i]];
        while (pocketStack.length > 0) {
            const { faces, n } = pocketStack.shift();
            for (const pocket of pockets) {
                if (!pocket.n) {
                    if (faces.find(f => f[0] === pocket.x && f[1] === pocket.y && f[2] === pocket.z)) {
                        pocket.n = n;
                        pocketStack.push(pocket);
                    }
                }
            }
        }
    }
    
    const notPockets = pockets.reduce((a, pocket) => {
        pocket.faces = pocket.faces.filter(f => !pockets.find(c => c.x === f[0] && c.y === f[1] && c.z === f[2]));
        if (
            !a.includes(pocket.n) &&
            (
                pocket.x === minMax.xMin || pocket.x === minMax.xMax ||
                pocket.y === minMax.yMin || pocket.y === minMax.yMax ||
                pocket.z === minMax.zMin || pocket.z === minMax.zMax
            )
        ) {
            return a.concat(pocket.n);
        }
        return a;
    }, []);
    
    return cubes.reduce((a, c) => a + c.faces.length, 0) - pockets.filter(p => !notPockets.includes(p.n)).reduce((a, c) => a + c.faces.length, 0);
}

part1().then(res => console.log('Part 1\n', res));

part2().then(res => console.log('Part 2\n', res));
