import { getData } from './data.js';

const data = await getData(17);

function parseInput() {
    const [registers, program] = data.split('\n\n');
    if (registers === undefined || program === undefined) {
        throw new Error();
    }

    const [a, b, c] = registers.split('\n').map((r) => Number(r.split(': ')[1]));
    if (a === undefined || b === undefined || c === undefined) {
        throw new Error();
    }

    const ops = program
        .split(': ')[1]!
        .split(',')
        .map((el) => Number(el));

    return { registers: { a, b, c }, ops };
}

function part1() {
    const { registers, ops } = parseInput();

    const output: number[] = [];

    const ComboOperand = [
        () => 0,
        () => 1,
        () => 2,
        () => 3,
        () => registers.a,
        () => registers.b,
        () => registers.c,
        () => {
            throw new Error();
        },
    ];

    let pointer = 0;
    while (true) {
        const [opcode, operand] = ops.slice(pointer);
        if (opcode === undefined || operand === undefined) {
            break;
        }

        pointer += 2;

        switch (opcode) {
            case 0:
                registers.a = Math.floor(registers.a / 2 ** ComboOperand[operand]!());
                break;
            case 1:
                registers.b ^= operand;
                break;
            case 2:
                registers.b = ComboOperand[operand]!() % 8;
                break;
            case 3:
                if (registers.a !== 0) {
                    pointer = operand;
                }
                break;
            case 4:
                registers.b ^= registers.c;
                break;
            case 5:
                output.push(ComboOperand[operand]!() % 8);
                break;
            case 6:
                registers.b = Math.floor(registers.a / 2 ** ComboOperand[operand]!());
                break;
            case 7:
                registers.c = Math.floor(registers.a / 2 ** ComboOperand[operand]!());
                break;
        }
    }

    return output.join(',');
}

console.log(part1());

// By inspection, the program just loops until all values have outputted,
// which means it will run as many times as the number of instructions in the program,
// and the final value of A must be 0.
// This won't work if the input doesn't meet these criteria.
function part2() {
    const input = parseInput();

    const ops: [number, number][] = Array(input.ops.length / 2)
        .fill(undefined)
        .map((_, i) => [input.ops[2 * i]!, input.ops[2 * i + 1]!]);

    let possibleAs: bigint[] = [];
    let nextPossibleAs = [0n];
    for (const val of input.ops.toReversed()) {
        possibleAs = nextPossibleAs
            .map((v) =>
                Array<bigint>(8)
                    .fill(v)
                    .map((v, i) => 8n * v + BigInt(i))
            )
            .flat();
        nextPossibleAs = [];

        for (let A of possibleAs) {
            let B = 0n;
            let C = 0n;

            const ComboOperand = [
                () => 0n,
                () => 1n,
                () => 2n,
                () => 3n,
                () => A,
                () => B,
                () => C,
                () => {
                    throw new Error();
                },
            ];

            // Exclude the final op which would move the pointer back to the start of the loop
            inner: for (const [opcode, operand] of ops.slice(0, -1)) {
                switch (opcode) {
                    case 0:
                        A = A / 2n ** ComboOperand[operand]!();
                        break;
                    case 1:
                        B ^= BigInt(operand);
                        break;
                    case 2:
                        B = ComboOperand[operand]!() % 8n;
                        break;
                    case 3:
                        throw new Error('Did not expect to move pointer');
                    case 4:
                        B ^= C;
                        break;
                    case 5:
                        if (ComboOperand[operand]!() % 8n === BigInt(val)) {
                            nextPossibleAs.push(A);
                            break inner;
                        }
                        break;
                    case 6:
                        B = A / 2n ** ComboOperand[operand]!();
                        break;
                    case 7:
                        C = A / 2n ** ComboOperand[operand]!();
                        break;
                }
            }
        }

        possibleAs = nextPossibleAs;
    }

    return possibleAs[0];
}

console.log(part2());
