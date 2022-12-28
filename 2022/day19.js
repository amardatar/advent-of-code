const { getData } = require('./data');

class RobotFactory {
    blueprint;
    robots;
    inventory;

    constructor ({
        blueprint,
        robots = { ore: 1, clay: 0, obsidian: 0, geode: 0 },
        inventory = { ore: 0, clay: 0, obsidian: 0, geode: 0 }
    }) {
        this.blueprint = blueprint;
        this.robots = { ...robots };
        this.inventory = { ...inventory };
    }

    tick() {
        this.inventory.ore += this.robots.ore;
        this.inventory.clay += this.robots.clay;
        this.inventory.obsidian += this.robots.obsidian;
        this.inventory.geode += this.robots.geode;
    }

    canConstructRobots() {
        return Object.entries(this.blueprint.robotCosts).reduce((a, [k, v]) => {
            if (v.every(({ type, amount }) => this.inventory[type] >= amount)) {
                return a.concat(k);
            }
            return a;
        }, []);
    }

    buildRobot(robot) {
        this.blueprint.robotCosts[robot].forEach(({ type, amount }) => this.inventory[type] -= amount);
        this.robots[robot]++;
    }

    /**
     * Compare two factories. Returns -1 if the first is strictly better, 1 if the second is strictly better, and 0 otherwise.
     */
    static compareFactories(factoryA, factoryB) {
        if (
            factoryA.robots.ore >= factoryB.robots.ore &&
            factoryA.robots.clay >= factoryB.robots.clay &&
            factoryA.robots.obsidian >= factoryB.robots.obsidian &&
            factoryA.robots.geode >= factoryB.robots.geode &&
            factoryA.inventory.ore >= factoryB.inventory.ore &&
            factoryA.inventory.clay >= factoryB.inventory.clay &&
            factoryA.inventory.obsidian >= factoryB.inventory.obsidian &&
            factoryA.inventory.geode >= factoryB.inventory.geode
        ) {
            return -1;
        } else if (
            factoryA.robots.ore <= factoryB.robots.ore &&
            factoryA.robots.clay <= factoryB.robots.clay &&
            factoryA.robots.obsidian <= factoryB.robots.obsidian &&
            factoryA.robots.geode <= factoryB.robots.geode &&
            factoryA.inventory.ore <= factoryB.inventory.ore &&
            factoryA.inventory.clay <= factoryB.inventory.clay &&
            factoryA.inventory.obsidian <= factoryB.inventory.obsidian &&
            factoryA.inventory.geode <= factoryB.inventory.geode
        ) {
            return 1;
        } else {
            return 0;
        }
    }
}

function getBlueprintQuality(robotFactory, maxT = 24, bestOptions = Array(maxT).fill().map(() => []), bestScore = { geode: 0 }, t = 0) {
    if (t === maxT) {
        if (robotFactory.inventory.geode > bestScore.geode) {
            bestScore.geode = robotFactory.inventory.geode;
        }
        return robotFactory;
    }

    const constructableRobots = robotFactory.canConstructRobots();
    // Assume it's always best to build a geode robot if possible.
    const constructableRobotOptions = constructableRobots.includes('geode') ? ['geode'] : [undefined, ...constructableRobots];

    const options = constructableRobotOptions.reduce((opts, robot) => {
        const newFactory = new RobotFactory(robotFactory);
        newFactory.tick();
        if (robot) {
            newFactory.buildRobot(robot);
        }

        // Assume triangular growth for geode robots.
        // If this option still can't beat the best score, ignore it.
        const maxPossibleScore = newFactory.inventory.geode + newFactory.robots.geode + (newFactory.robots.geode + maxT - 2 - t) * (newFactory.robots.geode + maxT - 2 - t + 1) / 2 - (newFactory.robots.geode) * (newFactory.robots.geode + 1) / 2; 
        if (maxPossibleScore < bestScore.geode) return opts;

        for (let i = 0; i < bestOptions[t].length; i++) {
            const comparison = RobotFactory.compareFactories(bestOptions[t][i], newFactory);
            if (comparison === -1) {
                return opts;
            } else if (comparison === 1) {
                bestOptions[t].splice(i, 1);
                i--;
            }
        }
        
        bestOptions[t].push(newFactory);
        const option = getBlueprintQuality(newFactory, maxT, bestOptions, bestScore, t + 1);
        return option ? opts.concat(option) : opts;
    }, []);

    if (options.length > 0) {
        return options.reduce((a, c) => c.inventory.geode > a.inventory.geode ? c : a);
    }
}

async function part1() {
    const data = await getData(19);

    const blueprints = data.split('\n').map(d => {
        const [id, oreCost, clayCost, obsidianCost, geodeCost] = d.split(/[:.] ?/g);
        const [obsidianOreCost, obsidianClayCost] = obsidianCost.match(/[0-9]+/g).map(Number);
        const [geodeOreCost, geodeObsidianCost] = geodeCost.match(/[0-9]+/g).map(Number);
        return {
            id: Number(id.match(/[0-9]+/g)[0]),
            robotCosts: {
                ore: [{ type: 'ore', amount: Number(oreCost.match(/[0-9]+/g)[0]) }],
                clay: [{ type: 'ore', amount: Number(clayCost.match(/[0-9]+/g)[0]) }],
                obsidian: [{ type: 'ore', amount: obsidianOreCost }, { type: 'clay', amount: obsidianClayCost }],
                geode: [{ type: 'ore', amount: geodeOreCost }, { type: 'obsidian', amount: geodeObsidianCost }]
            }
        }
    });
    
    const qualities = blueprints.map(blueprint => {
        const quality = getBlueprintQuality(new RobotFactory({ blueprint }));
        console.log(new Date().toISOString(), quality);
        return quality;
    });
    console.log(qualities);

    return qualities.reduce((a, c, i) => a + c.inventory.geode * (i + 1), 0);
}

async function part2() {
    const data = await getData(19);

    const blueprints = data.split('\n').map(d => {
        const [id, oreCost, clayCost, obsidianCost, geodeCost] = d.split(/[:.] ?/g);
        const [obsidianOreCost, obsidianClayCost] = obsidianCost.match(/[0-9]+/g).map(Number);
        const [geodeOreCost, geodeObsidianCost] = geodeCost.match(/[0-9]+/g).map(Number);
        return {
            id: Number(id.match(/[0-9]+/g)[0]),
            robotCosts: {
                ore: [{ type: 'ore', amount: Number(oreCost.match(/[0-9]+/g)[0]) }],
                clay: [{ type: 'ore', amount: Number(clayCost.match(/[0-9]+/g)[0]) }],
                obsidian: [{ type: 'ore', amount: obsidianOreCost }, { type: 'clay', amount: obsidianClayCost }],
                geode: [{ type: 'ore', amount: geodeOreCost }, { type: 'obsidian', amount: geodeObsidianCost }]
            }
        }
    });
    
    const qualities = blueprints.slice(0, 3).map(blueprint => {
        const quality = getBlueprintQuality(new RobotFactory({ blueprint }), 32);
        console.log(new Date().toISOString(), quality);
        return quality;
    });
    console.log(qualities);

    return qualities.reduce((a, c) => a * c.inventory.geode, 1);
}

part1().then(res => console.log('Part 1\n', res));

part2().then(res => console.log('Part 2\n', res));
