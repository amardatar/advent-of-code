const { getData } = require('./data');

async function part1() {
    const data = await getData(21);

    const monkeys = data.split('\n').map((c) => {
        const [name, val] = c.split(': ');
        if (val.match(/[+\-*\/]/)) {
            const [left, op, right] = val.split(/ ([+\-*\/]) /);
            let fn;
            if (op === '+') fn = (l, r) => l + r;
            if (op === '-') fn = (l, r) => l - r;
            if (op === '*') fn = (l, r) => l * r;
            if (op === '/') fn = (l, r) => l / r;
            return { name, left, right, fn };
        } else {
            return { name, val: Number(val) };
        }
    });

    const numbers = {};

    while (!numbers.root) {
        for (let i = 0; i < monkeys.length; i++) {
            const monkey = monkeys[i];

            if (monkey.val) {
                numbers[monkey.name] = monkey.val;
                monkeys.splice(i, 1);
                i--;
            } else if (monkey.left in numbers && monkey.right in numbers) {
                numbers[monkey.name] = monkey.fn(numbers[monkey.left], numbers[monkey.right]);
                monkeys.splice(i, 1);
                i--;
            }
        }
    }
    
    return numbers.root;
}

async function part2() {
    const data = await getData(21);

    const monkeys = data.split('\n').map((c) => {
        const [name, val] = c.split(': ');
        if (name === 'humn') {
            return { name };
        }

        if (name === 'root') {
            const [left, right] = val.split(/ [+\-*\/] /);
            return { name, left, right, fnLeft: (r) => r, fnRight: (l) => l };
        }

        if (val.match(/[+\-*\/]/)) {
            const [left, op, right] = val.split(/ ([+\-*\/]) /);
            let fn;
            let fnLeft;
            let fnRight;
            if (op === '+') {
                fn = (l, r) => l + r;
                fnLeft = (val, r) => val - r;
                fnRight = (val, l) => val - l;
            }
            if (op === '-') {
                fn = (l, r) => l - r;
                fnLeft = (val, r) => val + r;
                fnRight = (val, l) => l - val;
            }
            if (op === '*') {
                fn = (l, r) => l * r;
                fnLeft = (val, r) => val / r;
                fnRight = (val, l) => val / l;
            }
            if (op === '/') {
                fn = (l, r) => l / r;
                fnLeft = (val, r) => val * r;
                fnRight = (val, l) => l / val;
            }
            return { name, left, right, fn, fnLeft, fnRight };
        } else {
            return { name, val: Number(val) };
        }
    });

    const numbers = {};

    while (!numbers.humn) {
        for (let i = 0; i < monkeys.length; i++) {
            const monkey = monkeys[i];
            if (monkey.name in numbers) {
                if (monkey.left && monkey.right) {
                    if (monkey.left in numbers && monkey.right in numbers) {
                        continue;
                    }
                } else {
                    continue;
                }
            }

            if (monkey.val) {
                numbers[monkey.name] = monkey.val;
            } else if (monkey.name === 'root') {
                // Special case because 'root' won't trigger any of the others.
                if (monkey.left in numbers) {
                    numbers[monkey.right] = numbers[monkey.left];
                } else if (monkey.right in numbers) {
                    numbers[monkey.left] = numbers[monkey.right];
                }
            } else if (monkey.left in numbers && monkey.right in numbers) {
                numbers[monkey.name] = monkey.fn(numbers[monkey.left], numbers[monkey.right]);
            } else if (monkey.name in numbers && monkey.left in numbers && !(monkey.right in numbers)) {
                numbers[monkey.right] = monkey.fnRight(numbers[monkey.name], numbers[monkey.left]);
            } else if (monkey.name in numbers && monkey.right in numbers && !(monkey.left in numbers)) {
                numbers[monkey.left] = monkey.fnLeft(numbers[monkey.name], numbers[monkey.right]);
            } else {
                continue;
            }
        }
    }
    
    return numbers.humn;
}

part1().then(res => console.log('Part 1\n', res));

part2().then(res => console.log('Part 2\n', res));
