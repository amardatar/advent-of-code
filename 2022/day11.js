const { getData } = require('./data');

function createOp(fnLeft, fnOp, fnRight) {
    if (fnLeft === 'old' && fnRight === 'old') {
        return fnOp === '+'
            ? (old) => old + old
            : (old) => old * old;
    }
    if (fnLeft === 'old') {
        const right = Number(fnRight);
        return fnOp === '+'
            ? (old) => old + right
            : (old) => old * right;
    }
    if (fnRight === 'old') {
        const left = Number(fnLeft);
        return fnOp === '+'
            ? (old) => left + old
            : (old) => left * old;
    }
}

function createChain({ op, test, pass }, worryDivision) {
    return (item) => {
        const worryLevel = Math.floor(op(item) / worryDivision);
        const newMonkey = pass(test(worryLevel));
        return { worryLevel, newMonkey };
    }
}

async function part1() {
    const data = await getData(11);
    const monkeys = data.split('\n\n').map((d) => {
        const [, startingItems, operation, testRaw, ifTrue, ifFalse] = d.split('\n').map(e => e.trim());

        const items = startingItems.replace('Starting items: ', '').split(', ').map(Number);

        const [fnLeft, fnOp, fnRight] = operation.replace('Operation: new = ', '').split(' ');

        const op = createOp(fnLeft, fnOp, fnRight);

        const testVal = Number(testRaw.replace('Test: divisible by ', ''));
        const test = (val) => val % testVal === 0;

        const passTo = [Number(ifTrue.slice(-1)), Number(ifFalse.slice(-1))];
        const pass = (val) => val ? passTo[0] : passTo[1];

        const chain = createChain({ op, test, pass }, 3);

        return {
            inspections: 0,
            items,
            chain
        };
    });
    
    for(let i = 0; i < 20; i++) {
        for (const monkey of monkeys) {
            for (const item of monkey.items) {
                monkey.inspections++;
                const { worryLevel, newMonkey } = monkey.chain(item);
                monkeys[newMonkey].items.push(worryLevel);
            }
            monkey.items = [];
        }
    }

    return monkeys.map(m => m.inspections).sort((a, b) => a < b ? -1 : 1).slice(-2).reduce((a, c) => a * c, 1);
}

async function part2() {
    const data = await getData(11);
    const monkeys = data.split('\n\n').map((d) => {
        const [, startingItems, operation, testRaw, ifTrue, ifFalse] = d.split('\n').map(e => e.trim());

        const items = startingItems.replace('Starting items: ', '').split(', ').map(Number);

        const [fnLeft, fnOp, fnRight] = operation.replace('Operation: new = ', '').split(' ');

        const op = createOp(fnLeft, fnOp, fnRight);

        const testVal = Number(testRaw.replace('Test: divisible by ', ''));
        const test = (val) => val % testVal === 0;

        const passTo = [Number(ifTrue.slice(-1)), Number(ifFalse.slice(-1))];
        const pass = (val) => val ? passTo[0] : passTo[1];

        const chain = createChain({ op, test, pass }, 1);

        return {
            inspections: 0,
            items,
            chain
        };
    });
    
    const lcm = 9699690;

    for(let i = 0; i < 10000; i++) {
        for (const monkey of monkeys) {
            for (const item of monkey.items) {
                monkey.inspections++;
                const { worryLevel, newMonkey } = monkey.chain(item);
                monkeys[newMonkey].items.push(worryLevel % lcm);
            }
            monkey.items = [];
        }
    }

    return monkeys.map(m => m.inspections).sort((a, b) => a < b ? -1 : 1).slice(-2).reduce((a, c) => a * c, 1);
}

part1().then(res => console.log('Part 1\n', res));

part2().then(res => console.log('Part 2\n', res));
