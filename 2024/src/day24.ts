import { getData } from './data.js';

const data = await getData(24);

class Gate {
    inputA: string;
    inputB: string;
    operation: 'AND' | 'OR' | 'XOR';
    output: string;

    constructor(str: string) {
        const [input, output] = str.split(' -> ');
        if (input === undefined || output === undefined) {
            throw new Error();
        }

        const [inputA, operation, inputB] = input.split(' ');
        if (
            inputA === undefined ||
            inputB === undefined ||
            (operation !== 'AND' && operation !== 'OR' && operation !== 'XOR')
        ) {
            throw new Error();
        }

        this.inputA = inputA;
        this.inputB = inputB;
        this.operation = operation;
        this.output = output;
    }

    process(wires: Record<string, number>): number {
        const a = wires[this.inputA];
        const b = wires[this.inputB];
        if (a === undefined || b === undefined) {
            throw new Error();
        }

        switch (this.operation) {
            case 'AND':
                return a & b;
            case 'OR':
                return a | b;
            case 'XOR':
                return a ^ b;
        }
    }

    toString(): string {
        return `${this.inputA} ${this.operation} ${this.inputB} -> ${this.output}`;
    }
}

function parseInput() {
    const [init, gates] = data.split('\n\n');
    if (init === undefined || gates === undefined) {
        throw new Error();
    }

    return {
        init: init
            .split('\n')
            .reduce<Record<string, number>>((a, c) => ({ ...a, [c.split(': ')[0]!]: Number(c.split(': ')[1]) }), {}),
        gates: gates.split('\n').map((g) => new Gate(g)),
    };
}

function part1() {
    const { init: wires, gates } = parseInput();

    while (gates.length > 0) {
        for (let i = 0; i < gates.length; i++) {
            const gate = gates[i]!;
            if (gate.inputA in wires && gate.inputB in wires) {
                const res = gate.process(wires);
                wires[gate.output] = res;
                gates.splice(i, 1);
                i--;
            }
        }
    }

    return Object.entries(wires)
        .filter(([key]) => key.startsWith('z'))
        .sort((a, b) => Number(a[0].replace('z', '')) - Number(b[0].replace('z', '')))
        .reduce((a, c, i) => a + c[1] * 2 ** i, 0);
}

console.log(part1());

function createTestWires(nBits: number): Record<string, number> {
    const wires: Record<string, number> = {};
    const x = Math.floor(Math.random() * 2 ** nBits)
        .toString(2)
        .padStart(nBits, '0');
    const y = Math.floor(Math.random() * 2 ** nBits)
        .toString(2)
        .padStart(nBits, '0');
    for (let i = 0; i < nBits; i++) {
        const nBit = i.toString().padStart(2, '0');
        wires[`x${nBit}`] = Number(x.at(-i - 1));
        wires[`y${nBit}`] = Number(y.at(-i - 1));
    }
    return wires;
}

function getRelevantGates(gates: Gate[], arg1: number | Record<string, number>): Set<Gate> {
    const inputWires =
        typeof arg1 === 'object'
            ? Object.keys(arg1)
            : Array(arg1)
                  .fill(undefined)
                  .map((_, i) => [`x${i.toString().padStart(2, '0')}`, `y${i.toString().padStart(2, '0')}`])
                  .flat();

    const relevantGates = new Set<Gate>();
    let wires = inputWires;
    let nWires = 0;
    while (nWires !== wires.length) {
        nWires = wires.length;
        const possibleGates = gates.filter((gate) => wires.includes(gate.inputA) && wires.includes(gate.inputB));
        wires = possibleGates.reduce((a, c) => {
            relevantGates.add(c);

            if (!a.includes(c.output)) {
                a.push(c.output);
            }

            return a;
        }, wires);
    }

    return relevantGates;
}

function isCorrectAddition(gates: Gate[], { ...wires }: Record<string, number>, nBits: number) {
    const relevantGates = [...getRelevantGates(gates, wires)];

    while (relevantGates.length > 0) {
        const gate = relevantGates.shift()!;
        if (!(gate.inputA in wires) || !(gate.inputB in wires)) {
            if (relevantGates.length === 1) {
                throw new Error();
            }
            relevantGates.push(gate);
            continue;
        }

        const output = gate.process(wires);
        wires[gate.output] = output;
    }

    const x = Object.entries(wires)
        .filter(([k]) => k.startsWith('x'))
        .sort((a, b) => (a[0] < b[0] ? -1 : 1))
        .reduce((a, c, i) => a + c[1] * 2 ** i, 0);
    const y = Object.entries(wires)
        .filter(([k]) => k.startsWith('y'))
        .sort((a, b) => (a[0] < b[0] ? -1 : 1))
        .reduce((a, c, i) => a + c[1] * 2 ** i, 0);
    const z = Object.entries(wires)
        .filter(([k]) => k.startsWith('z'))
        .sort((a, b) => (a[0] < b[0] ? -1 : 1))
        .reduce((a, c, i) => a + c[1] * 2 ** i, 0);

    return z % 2 ** nBits === (x + y) % 2 ** nBits;
}

function part2() {
    const { gates } = parseInput();
    const inputGates = gates.filter(
        (g) =>
            g.inputA.startsWith('x') || g.inputA.startsWith('y') || g.inputB.startsWith('x') || g.inputB.startsWith('y')
    );

    const swaps: string[] = [];
    const endBit = inputGates.reduce((a, c) => {
        const num = Math.max(Number(c.inputA.slice(1)), Number(c.inputB.slice(1)));
        return a > num ? a : num;
    }, 0);
    for (let n = 0; n < endBit; n++) {
        const testWires = Array(100)
            .fill(undefined)
            .map(() => createTestWires(n + 1));

        if (!testWires.every((wires) => isCorrectAddition(gates, wires, n))) {
            const diff = [...getRelevantGates(gates, n).difference(getRelevantGates(gates, n - 1))];
            test: for (let i = 0; i < diff.length - 1; i++) {
                for (let j = i + 1; j < diff.length; j++) {
                    const testGate1 = new Gate(diff[i]!.toString());
                    const testGate2 = new Gate(diff[j]!.toString());
                    testGate1.output = diff[j]!.output;
                    testGate2.output = diff[i]!.output;

                    const swappedGates = gates.map((gate) => {
                        if (gate === diff[i]) {
                            return testGate1;
                        }
                        if (gate === diff[j]) {
                            return testGate2;
                        }
                        return gate;
                    });
                    if (testWires.every((wires) => isCorrectAddition(swappedGates, wires, n))) {
                        diff[i]!.output = testGate1.output;
                        diff[j]!.output = testGate2.output;
                        swaps.push(testGate1.output, testGate2.output);

                        break test;
                    }
                }
            }
        }
    }

    return swaps.sort().join(',');
}

console.log(part2());
