import { getData } from './data.js';

const data = await getData(23);

function parseInput() {
    return data.split('\n').map((row) => row.split('-') as [string, string]);
}

function getComputerMap(input: [string, string][]): Map<string, Set<string>> {
    return input.reduce((a, [c1, c2]) => {
        a.set(c1, (a.get(c1) ?? new Set()).add(c2));
        a.set(c2, (a.get(c2) ?? new Set()).add(c1));
        return a;
    }, new Map<string, Set<string>>());
}

function getGroups(computerMap: Map<string, Set<string>>): Set<string>[] {
    const seedComputer = computerMap.keys().next().value;
    if (seedComputer === undefined) {
        return [];
    }
    const currentGroup = new Set([seedComputer]);
    outer: for (const linkedComputer of computerMap.get(seedComputer)!.values()) {
        if (currentGroup.has(linkedComputer)) {
            continue;
        }

        const linkedComputerLinks = computerMap.get(linkedComputer);
        for (const computer of currentGroup.values()) {
            if (!linkedComputerLinks?.has(computer)) {
                continue outer;
            }
        }

        currentGroup.add(linkedComputer);
    }

    for (const c1 of currentGroup) {
        for (const c2 of currentGroup) {
            computerMap.get(c1)?.delete(c2);
        }
        if (computerMap.get(c1)?.size === 0) {
            computerMap.delete(c1);
        }
    }

    return [currentGroup, ...getGroups(computerMap)];
}

function part1() {
    const input = parseInput();
    const computerMap = getComputerMap(input);

    const groups: Set<string>[] = [];
    for (const [c1, s1] of computerMap.entries()) {
        for (const c2 of s1.values()) {
            const s2 = computerMap.get(c2);
            if (!s2?.has(c1)) {
                continue;
            }
            for (const c3 of s2) {
                const s3 = computerMap.get(c3);
                if (!s3?.has(c1) || !s3.has(c2)) {
                    continue;
                }

                if (s1.size === 0) {
                    computerMap.delete(c1);
                }
                if (s2.size === 0) {
                    computerMap.delete(c2);
                }
                if (s3.size === 0) {
                    computerMap.delete(c3);
                }
                groups.push(new Set([c1, c2, c3]));
            }
        }
    }
    const filteredGroups = groups.filter(
        (group, i) =>
            group.size >= 3 &&
            i === groups.findIndex((g) => [...g.values()].every((el) => group.has(el))) &&
            [...group.values()].some((c) => c.startsWith('t'))
    );
    return filteredGroups.length;
}

console.log(part1());

function part2() {
    const input = parseInput();
    const computerMap = getComputerMap(input);
    const groups = getGroups(computerMap);
    const sortedGroups = groups.sort((a, b) => b.size - a.size);
    return [...sortedGroups.values().next().value!].sort().join(',');
}

console.log(part2());
