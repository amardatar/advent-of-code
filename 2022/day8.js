const { getData } = require('./data');

async function part1() {
    const data = await getData(8);
    const forest = data.trim().split('\n').map(d => d.split('').map(Number));
    let visibleTrees = 2 * forest.length + 2 * forest[0].length - 4;
    for (let i = 1; i < forest.length - 1; i++) {
        for (let j = 1; j < forest[i].length - 1; j++) {
            const tree = forest[i][j],
                  left = forest[i].slice(0, j),
                  right = forest[i].slice(j + 1, forest[i].length),
                  top = forest.map(f => f[j]).flat().slice(0, i),
                  bottom = forest.map(f => f[j]).flat().slice(i + 1, forest.length);
            if (
                left.every(t => t < tree) ||
                right.every(t => t < tree) ||
                top.every(t => t < tree) ||
                bottom.every(t => t < tree)
            ) {
                visibleTrees++;
            }
        }
    }
    return visibleTrees;
}

async function part2() {
    const data = await getData(8);
    const forest = data.trim().split('\n').map(d => d.split('').map(Number));
    let sceneryMap = [];
    for (let i = 0; i < forest.length; i++) {
        sceneryMap.push([]);
        for (let j = 0; j < forest[i].length; j++) {
            const tree = forest[i][j],
                  left = forest[i].slice(0, j),
                  right = forest[i].slice(j + 1, forest[i].length),
                  top = forest.map(f => f[j]).flat().slice(0, i),
                  bottom = forest.map(f => f[j]).flat().slice(i + 1, forest.length);

            const sceneryLeft = ((left.reverse().findIndex(t => t >= tree) + 1) || left.length);
            const sceneryRight = ((right.findIndex(t => t >= tree) + 1) || right.length);
            const sceneryTop = ((top.reverse().findIndex(t => t >= tree) + 1) || top.length);
            const sceneryBottom = ((bottom.findIndex(t => t >= tree) + 1) || bottom.length);

            sceneryMap[i].push(sceneryLeft * sceneryRight * sceneryTop * sceneryBottom);
        }
    }

    return sceneryMap.reduce((a, c) => Math.max(a, c.reduce((b, d) => Math.max(b, d), 0)), 0);
}

part1().then(res => console.log('Part 1\n', res));

part2().then(res => console.log('Part 2\n', res));
