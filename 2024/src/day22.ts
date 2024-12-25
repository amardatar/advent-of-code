import { getData } from './data.js';

const data = await getData(22);

function parseInput() {
    return data.split('\n').map((el) => BigInt(el));
}

const cache = new Map<bigint, bigint>();
function generateNextSecretNumber(n: bigint) {
    const cachedResult = cache.get(n);
    if (cachedResult !== undefined) {
        return cachedResult;
    }

    const res1 = ((n * 64n) ^ n) % 16777216n;
    const res2 = ((res1 / 32n) ^ res1) % 16777216n;
    const res3 = ((res2 * 2048n) ^ res2) % 16777216n;
    cache.set(n, res3);
    return res3;
}

function part1() {
    const input = parseInput();
    return input.reduce((acc, n) => {
        for (let i = 0; i < 2000; i++) {
            n = generateNextSecretNumber(n);
        }
        return acc + n;
    }, 0n);
}

console.log(part1());

function getPricesAndChanges(n: bigint): [bigint, number, number] {
    const next = generateNextSecretNumber(n);
    const price = Number(next % 10n);
    const change = price - Number(n % 10n);
    return [next, price, change];
}

const changesMapCache = new Map<number[], Map<number, Set<number>>>();
function getChangesMap(changes: number[]) {
    const cachedResult = changesMapCache.get(changes);
    if (cachedResult !== undefined) {
        return cachedResult;
    }

    const res = changes.reduce((a, c, i) => {
        a.set(c, (a.get(c) ?? new Set<number>()).add(i));
        return a;
    }, new Map<number, Set<number>>());
    changesMapCache.set(changes, res);
    return res;
}

function getBananas(
    pricesAndChanges: { prices: number[]; changes: number[] }[],
    seq: [number, number, number, number]
) {
    return pricesAndChanges.reduce((acc, { prices, changes }) => {
        const changesMap = getChangesMap(changes);
        for (const i of changesMap.get(seq[0])!) {
            if (changes[i + 1] === seq[1] && changes[i + 2] === seq[2] && changes[i + 3] === seq[3]) {
                return acc + prices[i + 3]!;
            }
        }
        return acc;
    }, 0);
}

function part2() {
    const input = parseInput();

    const pricesAndChanges = input.map((n) => {
        const prices: number[] = [];
        const changes: number[] = [];
        for (let i = 0; i < 2000; i++) {
            const [next, price, change] = getPricesAndChanges(n);
            prices.push(price);
            changes.push(change);
            n = next;
        }
        return { prices, changes };
    });

    let bestSequence: [number, number, number, number] = [-9, -9, -9, -9];
    let bestPrice = 0;
    for (let s1 = -9; s1 <= 9; s1++) {
        for (let s2 = -9; s2 <= 9; s2++) {
            console.log(s1, s2);
            for (let s3 = -9; s3 <= 9; s3++) {
                for (let s4 = -9; s4 <= 9; s4++) {
                    const bananas = getBananas(pricesAndChanges, [s1, s2, s3, s4]);
                    if (bananas > bestPrice) {
                        bestSequence = [s1, s2, s3, s4];
                        bestPrice = bananas;
                    }
                }
            }
        }
    }

    console.log(bestSequence);
    return bestPrice;
}

console.log(part2());
