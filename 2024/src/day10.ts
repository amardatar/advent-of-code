import { getData } from './data.js';

const data = await getData(10);

const points = data.split('\n').map((l) => l.split(''));

function getScore([i, j]: [number, number]): [number, number][] {
    const tops: [number, number][] = [];
    const height = Number(points[i]![j]);
    for (const [e_i, e_j] of [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
    ] as [number, number][]) {
        const t_i = i + e_i;
        const t_j = j + e_j;
        if (t_i < 0 || points.length <= t_i || t_j < 0 || points[i]!.length <= t_j) {
            continue;
        }
        const nextHeight = Number(points[t_i]![t_j]);
        if (nextHeight != height + 1) {
            continue;
        }
        if (nextHeight === 9) {
            tops.push([t_i, t_j]);
        } else {
            tops.push(...getScore([t_i, t_j]));
        }
    }
    return tops;
}

function part1() {
    const trailheads = points.reduce<[number, number][]>(
        (a, c, i) =>
            a.concat(
                c.reduce<[number, number][]>((b, d, j) => {
                    if (d === '0') {
                        b.push([i, j]);
                    }
                    return b;
                }, [])
            ),
        []
    );

    let totalScore = 0;
    for (const trailhead of trailheads) {
        const tops = getScore(trailhead);
        totalScore += tops.filter(
            ([i, j], idx) => idx === tops.findIndex(([t_i, t_j]) => i === t_i && j === t_j)
        ).length;
    }
    return totalScore;
}

console.log(part1());

function getScore2([i, j]: [number, number]): number {
    let score = 0;
    const height = Number(points[i]![j]);
    for (const [e_i, e_j] of [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
    ] as [number, number][]) {
        const t_i = i + e_i;
        const t_j = j + e_j;
        if (t_i < 0 || points.length <= t_i || t_j < 0 || points[i]!.length <= t_j) {
            continue;
        }
        const nextHeight = Number(points[t_i]![t_j]);
        if (nextHeight != height + 1) {
            continue;
        }
        if (nextHeight === 9) {
            score++;
        } else {
            score += getScore2([t_i, t_j]);
        }
    }
    return score;
}

function part2() {
    const trailheads = points.reduce<[number, number][]>(
        (a, c, i) =>
            a.concat(
                c.reduce<[number, number][]>((b, d, j) => {
                    if (d === '0') {
                        b.push([i, j]);
                    }
                    return b;
                }, [])
            ),
        []
    );

    let totalScore = 0;
    for (const trailhead of trailheads) {
        const score = getScore2(trailhead);
        totalScore += score;
    }
    return totalScore;
}

console.log(part2());
