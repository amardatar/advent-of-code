import { getData } from './data.js';

const data = await getData(19);

function parseInput() {
    const [patternsStr, designsStr] = data.split('\n\n');
    const patterns = patternsStr?.split(', ');
    const designs = designsStr?.split('\n');
    if (patterns === undefined || designs === undefined) {
        throw new Error();
    }

    return { patterns, designs };
}

function part1() {
    const { patterns, designs } = parseInput();

    const filteredPatterns = patterns.filter(
        (pattern) => !new RegExp(`^(${patterns.filter((p) => p !== pattern).join('|')})+$`).test(pattern)
    );

    const rgx = new RegExp(`^(${filteredPatterns.join('|')})+$`);

    return designs.filter((d) => rgx.test(d)).length;
}

console.log(part1());

const cache = new Map<string, number>();

function getPermutations(patterns: string[], design: string): number {
    if (design === '') {
        return 1;
    }
    const cachedResult = cache.get(design);
    if (cachedResult !== undefined) {
        return cachedResult;
    }
    let count = 0;
    for (const pattern of patterns) {
        if (design.startsWith(pattern)) {
            count += getPermutations(patterns, design.slice(pattern.length));
        }
    }
    cache.set(design, count);
    return count;
}

function part2() {
    const { patterns, designs } = parseInput();
    const permutations = designs.reduce((a, c) => a + getPermutations(patterns, c), 0);
    return permutations;
}

console.log(part2());
