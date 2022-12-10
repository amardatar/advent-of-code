const { getData } = require('./data');

async function part1() {
    const data = await getData(10);
    const operations = data.trimEnd().split('\n');
    let cycle = 0;
    let register = 1;
    let strengths = [];
    for (const operation of operations) {
        cycle++;
        if ((cycle - 20) % 40 === 0) {
            strengths.push(cycle * register);
        }
        const [op, val] = operation.split(' ');
        if (op === 'addx') {
            cycle++;
            if ((cycle - 20) % 40 === 0) {
                strengths.push(cycle * register);
            }
            register += Number(val);
        }
    }
    return strengths.reduce((a, c) => a + c, 0);
}

async function part2() {
    const data = await getData(10);
    const operations = data.trimEnd().split('\n');
    let cycle = -1;
    let register = 1;
    let image = [];
    for (const operation of operations) {
        cycle++;
        image.push(register - 1 <= cycle % 40 && cycle % 40 <= register + 1 ? 'X' : '.');
        const [op, val] = operation.split(' ');
        if (op === 'addx') {
            cycle++;
            image.push(register - 1 <= cycle % 40 && cycle % 40 <= register + 1 ? 'X' : '.');
            register += Number(val);
        }
    }
    return image.reduce((a, c, i) => {
        if (i % 40 === 0) {
            a.push([]);
        }
        a.at(-1).push(c);
        return a;
    }, []).map(a => a.join('')).join('\n');
}

part1().then(res => console.log('Part 1\n', res));

part2().then(res => console.log('Part 2\n', res));
