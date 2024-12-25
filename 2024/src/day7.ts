import { getData } from './data.js';

const data = await getData(7);

const equations = data.split('\n').map((line) => {
    const [res, numbers] = line.split(': ');
    return { result: Number(res), inputs: numbers?.split(' ').map((n) => Number(n)) ?? [] };
});

type Operators = '+' | '*' | '||';

function getOperatorCombinations(operators: Operators[], idx: number): Operators[][] {
    if (idx <= 1) {
        return operators.map((op) => [op]);
    }
    const nextCombinations = getOperatorCombinations(operators, idx - 1);
    return nextCombinations.map((combination) => operators.map((op) => [op, ...combination])).flat(1);
}

function getResult(inputs: number[], operators: Operators[]) {
    return inputs.reduce((a, c, i) => {
        const op = operators[i - 1];
        switch (op) {
            case '+':
                return a + c;
            case '*':
                return a * c;
            case '||':
                return Number(`${a}${c}`);
            default:
                throw new Error(`Unexepected operator ${op}`);
        }
    });
}

function part1() {
    const validEquations = equations.filter((eq) => {
        const operatorCombinations = getOperatorCombinations(['+', '*'], eq.inputs.length - 1);
        return operatorCombinations.some((operators) => eq.result === getResult(eq.inputs, operators));
    });
    return validEquations.reduce((a, c) => a + c.result, 0);
}

console.log(part1());

function part2() {
    const validEquations = equations.filter((eq) => {
        const operatorCombinations = getOperatorCombinations(['+', '*', '||'], eq.inputs.length - 1);
        return operatorCombinations.some((operators) => eq.result === getResult(eq.inputs, operators));
    });
    return validEquations.reduce((a, c) => a + c.result, 0);
}

console.log(part2());
