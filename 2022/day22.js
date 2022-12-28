const { getData } = require('./data');

class MonkeyMap {
    map;
    rowPos;
    colPos;
    dirPos;
    offset = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    constructor(rawMap) {
        this.map = rawMap.split('\n').map(r => r.split(''));

        this.rowPos = 0;
        this.colPos = this.map[0].indexOf('.');
        this.dirPos = 0;
    }

    loopPos() {
        if (this.dirPos === 0) return [this.rowPos, this.map[this.rowPos].findIndex(c => c && c !== ' ')];
        if (this.dirPos === 1) return [this.map.findIndex(r => r[this.colPos] && r[this.colPos] !== ' '), this.colPos];
        if (this.dirPos === 2) return [this.rowPos, this.map[this.rowPos].findLastIndex(c => c && c !== ' ')];
        if (this.dirPos === 3) return [this.map.findLastIndex(r => r[this.colPos] && r[this.colPos] !== ' '), this.colPos];
    }

    nextPos() {
        const offset = this.offset[this.dirPos];

        const i = this.rowPos + offset[0];
        const j = this.colPos + offset[1];
        if (0 <= i && i < this.map.length && 0 <= j && j < this.map[i].length) {
            const ahead = this.map[i][j];
            if (ahead === '.') return [i, j];
            if (ahead === '#') return [this.rowPos, this.colPos];
        }

        const newAhead = this.loopPos();
        if (this.map[newAhead[0]][newAhead[1]] === '.') return newAhead;
        if (this.map[newAhead[0]][newAhead[1]] === '#') return [this.rowPos, this.colPos];

        throw new Error('Failed to get next position');
    }

    move(steps) {
        for (let i = 0; i < steps; i++) {
            const newPos = this.nextPos();
            if (newPos[0] === this.rowPos && newPos[1] === this.colPos) break;
            [this.rowPos, this.colPos] = newPos;
        }
    }

    rotate(dir) {
        if (dir === 'L') {
            this.dirPos--;
        } else {
            this.dirPos++;
        }

        if (this.dirPos < 0) {
            this.dirPos += 4;
        } else if (this.dirPos > 3) {
            this.dirPos -= 4;
        }
    }
}

async function part1() {
    const data = await getData(22);

    const [rawMap, rawMoves] = data.split('\n\n');

    const map = new MonkeyMap(rawMap);

    const moves = rawMoves.split(/([LR])/g);

    for (const move of moves) {
        if (move === 'L' || move === 'R') {
            map.rotate(move);
        } else {
            map.move(move);
        }
    }
    
    return 1000 * (map.rowPos + 1) + 4 * (map.colPos + 1) + map.dirPos;
}

class MonkeyMap2 {
    map;
    faceSize;
    faces = [];
    facePositions = [];
    facePos;
    rowPos;
    colPos;
    dirPos;
    offset = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    constructor(rawMap, faceSize = 50) {
        this.faceSize = faceSize;

        const map = rawMap.split('\n').map(r => r.split(''));
        const faces = [];
        const facePositions = [];
        for (let i = 0; i < map.length / faceSize; i++) {
            const row = map.slice(i * faceSize, (i + 1) * faceSize);
            for (let j = 0; j < row[0].length / faceSize; j++) {
                const face = row.map(col => col.slice(j * faceSize, (j + 1) * faceSize));
                if (face[0][0] !== ' ') {
                    faces.push(face);
                    this.facePositions.push([i, j]);
                    facePositions.push([i, j]);
                }
            }
        }

        for (let i = 0; i < faces.length; i++) {
            const face = faces[i];
            const facePos = facePositions[i];
            
            const faceObj = { map: face };

            const right = facePositions.findIndex(f => f[0] === facePos[0] && f[1] === facePos[1] + 1);
            const bottom = facePositions.findIndex(f => f[0] === facePos[0] + 1 && f[1] === facePos[1]);
            const left = facePositions.findIndex(f => f[0] === facePos[0] && f[1] === facePos[1] - 1);
            const top = facePositions.findIndex(f => f[0] === facePos[0] - 1 && f[1] === facePos[1]);
            if (right !== -1) faceObj.right = { edge: 'left', face: right };
            if (bottom !== -1) faceObj.bottom = { edge: 'top', face: bottom };
            if (left !== -1) faceObj.left = { edge: 'right', face: left };
            if (top !== -1) faceObj.top = { edge: 'bottom', face: top };

            this.faces.push(faceObj);
        }

        const clockwise = {
            right: 'bottom',
            bottom: 'left',
            left: 'top',
            top: 'right'
        };

        while (!this.faces.every(f => 'right' in f && 'bottom' in f && 'left' in f && 'top' in f)) {
            for (let i = 0; i < this.faces.length; i++) {
                // Going clockwise around gets back to the same edge - use this to find the matching face.
                const face = this.faces[i];
                for (const edge of ['right', 'bottom', 'left', 'top']) {
                    if (edge in face) continue;

                    if (clockwise[edge] in face) {
                        const face1 = face[clockwise[edge]];
                        if (clockwise[face1.edge] in this.faces[face1.face]) {
                            const face2 = this.faces[face1.face][clockwise[face1.edge]]
                            face[edge] = { edge: clockwise[face2.edge], face: face2.face }
                            this.faces[face2.face][clockwise[face2.edge]] = { edge, face: i }
                        }
                    }
                }
            }
        }

        this.facePos = 0;
        this.rowPos = 0;
        this.colPos = 0;
        this.dirPos = 0;
    }

    loopPos() {
        const edgeMapping = { right: 2, bottom: 3, left: 0, top: 1 };
        const len = this.faceSize - 1;
        const transformation = {
            right: {
                right: (i, j) => [len - i, len],
                bottom: (i, j) => [len, i],
                left: (i, j) => [i, 0],
                top: (i, j) => [0, len - i]
            },
            bottom: {
                right: (i, j) => [j, len],
                bottom: (i, j) => [len, len - j],
                left: (i, j) => [len - j, 0],
                top: (i, j) => [0, j]
            },
            left: {
                right: (i, j) => [i, len],
                bottom: (i, j) => [len, len - i],
                left: (i, j) => [len - i, 0],
                top: (i, j) => [0, i]
            },
            top: {
                right: (i, j) => [len - j, len],
                bottom: (i, j) => [len, j],
                left: (i, j) => [j, 0],
                top: (i, j) => [0, len - j]
            }
        }
        
        const face = this.faces[this.facePos];
        const edge = ['right', 'bottom', 'left', 'top'][this.dirPos];
        const { face: newFace, edge: newEdge } = face[edge];
        const newDir = edgeMapping[newEdge];
        const [newI, newJ] = transformation[edge][newEdge](this.rowPos, this.colPos);
        const newPos = this.faces[newFace].map[newI][newJ];
        
        if (newPos === '.') {
            this.facePos = newFace;
            this.dirPos = newDir;
            return [newI, newJ];
        } else if (newPos === '#') {
            return [this.rowPos, this.colPos];
        }
    }

    nextPos() {
        const { map } = this.faces[this.facePos];
        const offset = this.offset[this.dirPos];

        const i = this.rowPos + offset[0];
        const j = this.colPos + offset[1];
        if (0 <= i && i < map.length && 0 <= j && j < map[i].length) {
            const ahead = map[i][j];
            if (ahead === '.') return [i, j];
            if (ahead === '#') return [this.rowPos, this.colPos];
        }

        return this.loopPos();
    }

    move(steps) {
        for (let i = 0; i < steps; i++) {
            const newPos = this.nextPos();
            if (newPos[0] === this.rowPos && newPos[1] === this.colPos) break;
            [this.rowPos, this.colPos] = newPos;
        }
    }

    rotate(dir) {
        if (dir === 'L') {
            this.dirPos--;
        } else {
            this.dirPos++;
        }

        if (this.dirPos < 0) {
            this.dirPos += 4;
        } else if (this.dirPos > 3) {
            this.dirPos -= 4;
        }
    }

    get row() {
        const [iOffset] = this.facePositions[this.facePos];
        return iOffset * this.faceSize + this.rowPos;
    }

    get col() {
        const [, jOffset] = this.facePositions[this.facePos];
        return jOffset * this.faceSize + this.colPos;
    }
}

async function part2() {
    const data = await getData(22);

    const [rawMap, rawMoves] = data.split('\n\n');

    const map = new MonkeyMap2(rawMap);

    const moves = rawMoves.split(/([LR])/g);

    for (const move of moves) {
        if (move === 'L' || move === 'R') {
            map.rotate(move);
        } else {
            map.move(move);
        }
    }
    
    return 1000 * (map.row + 1) + 4 * (map.col + 1) + map.dirPos;
}

part1().then(res => console.log('Part 1\n', res));

part2().then(res => console.log('Part 2\n', res));
