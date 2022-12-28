const { getData } = require('./data');

function routeTo(valves, path, nodeTo) {
    const valve = valves.find(v => v.name === path.at(-1));
    const valvesTo = valve.valvesTo.filter(v => !path.includes(v));
    if (valvesTo.length === 0)
        return [];

    if (valvesTo.some(v => v === nodeTo))
        return path.concat(nodeTo);
        
    return valvesTo.reduce((a, c) => {
        const newPath = routeTo(valves, path.concat(c), nodeTo);
        return a.length === 0 ? newPath
            : newPath.length === 0 ? a
            : a.length < newPath.length ? a : newPath;
    }, []);
}

// Build a map between all valves with non-zero flow rate (and AA).
function buildMap(valves) {
    const nodes = valves.reduce((a, v) => v.name === 'AA' || v.flowRate > 0 ? a.concat(v.name) : a, []).sort();
    const edges = nodes.slice(0, -1).map((nodeFrom, i) => nodes.slice(i + 1).map(nodeTo => {
        const edge = routeTo(valves, [nodeFrom], nodeTo);
        return { from: nodeFrom, to: nodeTo, cost: edge.length - 1 };
    })).flat().filter(e => e !== undefined);
    return {
        edges: [...edges, ...edges.map(({ from, to, cost }) => ({ from: to, to: from, cost }))],
        nodes: valves.reduce((a, v) => v.name === 'AA' || v.flowRate > 0 ? { ...a, [v.name]: v.flowRate } : a, {})
    };
}

function getReleasedPressure(nodes, edges, location, releasedPressure, openValves, minute) {
    const openValvesPressure = openValves.reduce((a, c) => a + nodes[c], 0);
    
    const availableEdges = edges.filter(e => {
        if (e.from !== location) return false;
        if (openValves.includes(e.to)) return false;
        if (e.cost >= 30 - minute) return false;
        return true;
    });

    if (availableEdges.length === 0) {
        releasedPressure += (openValvesPressure * (30 - minute));
        return { location, releasedPressure, openValves };
    }

    return availableEdges.map(({ to, cost }) => {
        return getReleasedPressure(
            nodes,
            edges,
            to,
            releasedPressure + ((cost + 1) * (openValvesPressure)),
            [...openValves, to],
            minute + cost + 1
        );
    }).flat();
}

function getReleasedPressureWithElephant(
    nodes,
    edges,
    location,
    locationElephant,
    timer,
    timerElephant,
    releasedPressure,
    openValves,
    minute
) {
    // Whichever timer has come first is the one that will be processed in this "turn".
    const minTimer = Math.min(timer, timerElephant);
    const newReleasedPressure = releasedPressure + minTimer * openValves.reduce((a, c) => a + nodes[c], 0);
    const newOpenValves = [
        ...openValves,
        ...(minTimer === timer
            ? !openValves.includes(location) ? [location] : []
            : !openValves.includes(locationElephant) ? [locationElephant] : [])
    ];
    const newMinute = minute + minTimer;

    if (newMinute > 26) throw new Error('Elapsed time exceeded 26 minutes');

    if (newMinute === 26) return newReleasedPressure;

    const availableEdges = edges.filter(({ from, to, cost }) => {
        if (from !== (minTimer === timer ? location : locationElephant)) return false;
        if (newOpenValves.includes(to)) return false;
        if (cost >= 26 - newMinute) return false;
        return true;
    });

    // Set the relevant timer to use up the rest of the time and call again.
    if (availableEdges.length === 0) {
        return getReleasedPressureWithElephant(
            nodes,
            edges,
            location,
            locationElephant,
            minTimer === timer ? 26 - newMinute : timer - minTimer,
            minTimer === timer ? timerElephant - minTimer : 26 - newMinute,
            newReleasedPressure,
            newOpenValves,
            newMinute
        );
    }

    return availableEdges.reduce((a, { to, cost }) => {
        const c = getReleasedPressureWithElephant(
            nodes,
            edges,
            minTimer === timer ? to : location,
            minTimer === timer ? locationElephant : to,
            minTimer === timer ? cost + 1 : timer - minTimer,
            minTimer === timer ? timerElephant - minTimer : cost + 1,
            newReleasedPressure,
            newOpenValves,
            newMinute
        );

        return a > c ? a : c;
    }, 0);
}

async function part1() {
    const data = await getData(16);

    const valves = data.split('\n').reduce((a, d) => {
        const [name, ...valvesTo] = d.match(/[A-Z]{2}/g);
        const [flowRate] = d.match(/[0-9]+/g)
        return { ...a, [name]: { flowRate: Number(flowRate), valvesTo } };
    }, {});

    const { edges, nodes } = buildMap(Object.entries(valves).map(([name, v]) => ({ name, ...v })));

    const paths = getReleasedPressure(nodes, edges, 'AA', 0, [], 0);

    return paths.reduce((a, c) => a.releasedPressure === c.releasedPressure
        ? (a.openValves.reduce((b, d) => b + nodes[d]) > c.openValves.reduce((b, d) => b + nodes[d]) ? a : c)
        : (a.releasedPressure > c.releasedPressure ? a : c));
}

async function part2() {
    const data = await getData(16);

    const valves = data.split('\n').reduce((a, d) => {
        const [name, ...valvesTo] = d.match(/[A-Z]{2}/g);
        const [flowRate] = d.match(/[0-9]+/g)
        return { ...a, [name]: { flowRate: Number(flowRate), valvesTo } };
    }, {});

    const { edges, nodes } = buildMap(Object.entries(valves).map(([name, v]) => ({ name, ...v })));

    const paths = getReleasedPressureWithElephant(
        nodes,
        edges,
        'AA',
        'AA',
        0,
        0,
        0,
        [],
        0
    );

    return paths;
}

part1().then(res => console.log('Part 1\n', res));

part2().then(res => console.log('Part 2\n', res));
