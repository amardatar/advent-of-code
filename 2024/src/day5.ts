import { getData } from './data.js';

const data = await getData(5);

const [rawRules, rawUpdates] = data.split('\n\n');

const rules = rawRules!.split('\n').map((line) => line.split('|').map((el) => Number(el))) as [number, number][];
const updates = rawUpdates!.split('\n').map((line) => line.split(',').map((el) => Number(el)));

function part1() {
    let sum = 0;
    for (const update of updates) {
        const isValidUpdate = update.every((e, i) => {
            const followingPages = update.slice(i + 1);
            for (const page of followingPages) {
                if (rules.some(([left, right]) => left === page && right === e)) {
                    return false;
                }
            }
            return true;
        });

        if (isValidUpdate) {
            sum += update[(update.length - 1) / 2]!;
        }
    }
    return sum;
}

console.log(part1());

function part2() {
    const invalidUpdates: number[][] = [];

    for (const update of updates) {
        const isValidUpdate = update.every((e, i) => {
            const followingPages = update.slice(i + 1);
            for (const page of followingPages) {
                if (rules.some(([left, right]) => left === page && right === e)) {
                    return false;
                }
            }
            return true;
        });

        if (!isValidUpdate) {
            invalidUpdates.push(update);
        }
    }

    for (const update of invalidUpdates) {
        update.sort((a, b) => {
            const rule = rules.find(([left, right]) => (left === a && right === b) || (left === b && right === a));
            if (rule === undefined) {
                throw new Error(`Found no rule for pages ${a} and ${b}`);
            }
            return rule[0] === a ? -1 : 1;
        });
    }

    return invalidUpdates.reduce((a, c) => a + c[(c.length - 1) / 2]!, 0);
}

console.log(part2());
