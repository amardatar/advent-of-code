import { getData } from './data.js';

const data = await getData(12);

class Plot {
    constructor(
        public readonly i: number,
        public readonly j: number,
        public readonly type: string,
        public consumed = false
    ) {}

    getAdjacentPlots(plots: Plot[]): Plot[] {
        return plots.filter((plot) => Math.abs(this.i - plot.i) + Math.abs(this.j - plot.j) === 1);
    }

    getDiagonalPlots(plots: Plot[]): Plot[] {
        return plots.filter(
            (plot) =>
                [-1, 0, 1].includes(this.i - plot.i) &&
                [-1, 0, 1].includes(this.j - plot.j) &&
                (this.i !== plot.i || this.j !== plot.j)
        );
    }
}

class Region {
    constructor(public plots: Plot[]) {}

    get area() {
        return this.plots.length;
    }

    get perimeter() {
        return this.plots.reduce((acc, plot) => acc + 4 - plot.getAdjacentPlots(this.plots).length, 0);
    }

    get sides() {
        const CORNERS: [[number, number], [number, number], [number, number]][] = [
            [
                [0, 1],
                [1, 1],
                [1, 0],
            ],
            [
                [1, 0],
                [1, -1],
                [0, -1],
            ],
            [
                [0, -1],
                [-1, -1],
                [-1, 0],
            ],
            [
                [-1, 0],
                [-1, 1],
                [0, 1],
            ],
        ];
        const cornerCounts = this.plots.map((plot) => {
            return CORNERS.map<number>(([a, b, c]) => {
                const aMatch = this.plots.some((p) => p.i === plot.i + a[0] && p.j === plot.j + a[1]);
                const bMatch = this.plots.some((p) => p.i === plot.i + b[0] && p.j === plot.j + b[1]);
                const cMatch = this.plots.some((p) => p.i === plot.i + c[0] && p.j === plot.j + c[1]);
                if (aMatch && !bMatch && cMatch) {
                    return 1;
                }
                if (!aMatch && !cMatch) {
                    return 1;
                }
                return 0;
            }).reduce((a, c) => a + c);
        });
        return cornerCounts.reduce((a, c) => a + c);
    }
}

function getPlots(plots: Plot[], plot: Plot): Plot[] {
    plot.consumed = true;

    const adjacentPlots: Plot[] = [];
    for (const [e_i, e_j] of [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
    ] as [number, number][]) {
        const t_i = plot.i + e_i;
        const t_j = plot.j + e_j;

        const nextPlot = plots.find((p) => p.i === t_i && p.j === t_j);
        if (nextPlot === undefined || nextPlot.consumed || nextPlot.type !== plot.type) {
            continue;
        }

        const extraPlots = getPlots(plots, nextPlot);
        adjacentPlots.push(...extraPlots);
    }

    return [plot, ...adjacentPlots];
}

function part1() {
    const plots = data
        .split('\n')
        .map((line, i) => line.split('').map((type, j) => new Plot(i, j, type)))
        .flat();

    const regions: Region[] = [];

    while (true) {
        const next = plots.find((plot) => !plot.consumed);
        if (next === undefined) {
            break;
        }

        const newRegion = new Region(getPlots(plots, next));
        regions.push(newRegion);
    }

    return regions.reduce((a, region) => a + region.area * region.perimeter, 0);
}

console.log(part1());

function part2() {
    const plots = data
        .split('\n')
        .map((line, i) => line.split('').map((type, j) => new Plot(i, j, type)))
        .flat();

    const regions: Region[] = [];

    while (true) {
        const next = plots.find((plot) => !plot.consumed);
        if (next === undefined) {
            break;
        }

        const newRegion = new Region(getPlots(plots, next));
        regions.push(newRegion);
    }

    return regions.reduce((a, region) => a + region.area * region.sides, 0);
}

console.log(part2());
