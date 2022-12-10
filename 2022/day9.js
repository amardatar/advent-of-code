const { getData } = require('./data');

async function part1() {
    const data = await getData(9);
    const movements = data.trimEnd().split('\n');
    let hPos = { x: 0, y: 0 };
    let tPos = { x: 0, y: 0 };
    let visited = [];
    for(const mvmt of movements) {
        const [direction, places] = mvmt.split(' ');
        for (let i = 0; i < Number(places); i++) {
            hPos[['L', 'R'].includes(direction) ? 'x' : 'y'] += (['R', 'D'].includes(direction) ? 1 : -1);

            if (hPos.x !== tPos.x && hPos.y !== tPos.y && Math.abs(hPos.x - tPos.x) + Math.abs(hPos.y - tPos.y) > 2) {
                tPos.x += Math.sign(hPos.x - tPos.x);
                tPos.y += Math.sign(hPos.y - tPos.y);
            } else if (Math.abs(hPos.x - tPos.x) === 2) {
                tPos.x += Math.sign(hPos.x - tPos.x);
            } else if (Math.abs(hPos.y - tPos.y) === 2) {
                tPos.y += Math.sign(hPos.y - tPos.y);
            }
            visited.push({ ...tPos });
        }
    }
    return visited.filter((v, i) => visited.findIndex(d => d.x === v.x && d.y === v.y) === i).length;
}

async function part2() {
    const data = await getData(9);
    const movements = data.trimEnd().split('\n');
    let pos = Array(10).fill().map(() => ({ x: 0, y: 0 }));
    let visited = [];
    for(const mvmt of movements) {
        const [direction, places] = mvmt.split(' ');
        for (let i = 0; i < Number(places); i++) {
            pos[0][['L', 'R'].includes(direction) ? 'x' : 'y'] += (['R', 'D'].includes(direction) ? 1 : -1);

            for (let j = 1; j < 10; j++) {
                if (pos[j - 1].x !== pos[j].x && pos[j - 1].y !== pos[j].y && Math.abs(pos[j - 1].x - pos[j].x) + Math.abs(pos[j - 1].y - pos[j].y) > 2) {
                    pos[j].x += Math.sign(pos[j - 1].x - pos[j].x);
                    pos[j].y += Math.sign(pos[j - 1].y - pos[j].y);
                } else if (Math.abs(pos[j - 1].x - pos[j].x) === 2) {
                    pos[j].x += Math.sign(pos[j - 1].x - pos[j].x);
                } else if (Math.abs(pos[j - 1].y - pos[j].y) === 2) {
                    pos[j].y += Math.sign(pos[j - 1].y - pos[j].y);
                }
            }
            visited.push({ ...pos[9] });
        }
    }
    return visited.filter((v, i) => visited.findIndex(d => d.x === v.x && d.y === v.y) === i).length;
}

part1().then(res => console.log('Part 1\n', res));

part2().then(res => console.log('Part 2\n', res));
