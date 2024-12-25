import { getData } from './data.js';

const data = await getData(8);

const map = data.split('\n').map((row) => row.split(''));

const antennae = map.reduce<Record<string, [number, number][]>>(
    (a1, row, i) =>
        row.reduce((a2, el, j) => {
            if (el === '.') {
                return a2;
            }
            if (a2[el] !== undefined) {
                a2[el].push([i, j]);
            } else {
                a2[el] = [[i, j]];
            }
            return a2;
        }, a1),
    {}
);

function getAntinodes(nodes: [number, number][]) {
    return nodes
        .map((node1, idx) =>
            nodes
                .slice(idx + 1)
                .map((node2) => {
                    const d_i = node1[0] - node2[0];
                    const d_j = node1[1] - node2[1];
                    const positions: [number, number][] = [
                        [node1[0] - d_i, node1[1] - d_j],
                        [node1[0] + d_i, node1[1] + d_j],
                        [node2[0] - d_i, node2[1] - d_j],
                        [node2[0] + d_i, node2[1] + d_j],
                    ];
                    return positions.filter(
                        ([i, j]) => !((i === node1[0] && j === node1[1]) || (i === node2[0] && j === node2[1]))
                    );
                })
                .flat(1)
        )
        .flat(1);
}

function part1() {
    const antinodes = Object.values(antennae).map(getAntinodes).flat(1);

    const inBoundsAntinodes = antinodes.filter(([i, j]) => 0 <= i && i < map.length && 0 <= j && j < map[i]!.length);

    return inBoundsAntinodes.filter(
        ([i, j], idx) => idx === inBoundsAntinodes.findIndex((e) => i === e[0] && j === e[1])
    ).length;
}

console.log(part1());

function getAntinodes2(nodes: [number, number][]) {
    return nodes
        .map((node1, idx) =>
            nodes
                .slice(idx + 1)
                .map((node2) => {
                    const d_i = node1[0] - node2[0];
                    const d_j = node1[1] - node2[1];

                    const positions: [number, number][] = [];
                    let i = node1[0];
                    let j = node1[1];
                    while (i >= 0 && j >= 0 && i < map.length && j < map[i]!.length) {
                        positions.push([i, j]);
                        i -= d_i;
                        j -= d_j;
                    }
                    i = node1[0];
                    j = node1[1];
                    while (i >= 0 && j >= 0 && i < map.length && j < map[i]!.length) {
                        positions.push([i, j]);
                        i += d_i;
                        j += d_j;
                    }

                    return positions;
                })
                .flat(1)
        )
        .flat(1);
}

function part2() {
    const antinodes = Object.values(antennae).map(getAntinodes2).flat(1);

    const inBoundsAntinodes = antinodes.filter(([i, j]) => 0 <= i && i < map.length && 0 <= j && j < map[i]!.length);

    return inBoundsAntinodes.filter(
        ([i, j], idx) => idx === inBoundsAntinodes.findIndex((e) => i === e[0] && j === e[1])
    ).length;
}

console.log(part2());
