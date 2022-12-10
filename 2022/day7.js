const { getData } = require('./data');

let partADirList = [];
let partBDirList = [];

function getDirSize(tree) {
    tree.size = Object.entries(tree).reduce((a, [k, v]) => {
        if (k === '..' ) return a;
        if (typeof v === 'number') return a + v;
        dirSize = getDirSize(v).size;
        if (dirSize <= 100000) partADirList.push(dirSize);
        partBDirList.push(dirSize);
        return a + dirSize;
    }, 0)
    return tree;
}

async function part1() {
    const data = await getData(7);
    let tld = {};
    tld['/'] = {};
    let currentDirectory = tld;
    const commands = data.trimEnd().split(/(?:^|\n)\$ /g).slice(1).map(c => c.split('\n'));
    for (const [command, ...output] of commands) {
        const [cmd, target] = command.split(' ');
        if (cmd === 'cd') {
            currentDirectory = currentDirectory[target];
        } else {
            for(const item of output) {
                const [a, b] = item.split(' ');
                if (a === 'dir') {
                    currentDirectory[b] = { ['..']: currentDirectory };
                } else {
                    currentDirectory[b] = Number(a);
                }
            }
        }
    }
    
    getDirSize(tld);

    return partADirList.reduce((a, c) => a + c, 0);
}

async function part2() {
    const data = await getData(7);
    let tld = {};
    tld['/'] = {};
    let currentDirectory = tld;
    const commands = data.trimEnd().split(/(?:^|\n)\$ /g).slice(1).map(c => c.split('\n'));
    for (const [command, ...output] of commands) {
        const [cmd, target] = command.split(' ');
        if (cmd === 'cd') {
            currentDirectory = currentDirectory[target];
        } else {
            for(const item of output) {
                const [a, b] = item.split(' ');
                if (a === 'dir') {
                    currentDirectory[b] = { ['..']: currentDirectory };
                } else {
                    currentDirectory[b] = Number(a);
                }
            }
        }
    }

    getDirSize(tld);

    return partBDirList.reduce((a, c) => (3636666 <= c && c < a) ? c : a, 43636666);
}

part1().then(res => console.log('Part 1\n', res));

part2().then(res => console.log('Part 2\n', res));
