const { getData } = require('./data');

async function part1() {
    const data = await getData(20);

    const encrypted = data.split('\n').map((c, idx) => ({ idx, val: Number(c) }));

    let unencrypted = [...encrypted];

    const nCount = encrypted.length - 1;
    for (const n of encrypted) {
        const { idx, val } = n;
        const oldIdx = unencrypted.findIndex(c => c.idx === idx);
        let newIdx = oldIdx + val;
        if (newIdx > nCount) newIdx -= nCount * Math.floor(newIdx / nCount);
        if (newIdx <= 0) newIdx += nCount * (Math.floor(-newIdx / nCount) + 1);

        unencrypted.splice(oldIdx, 1);
        unencrypted.splice(newIdx, 0, n);
    }

    const idxZero = unencrypted.findIndex(c => c.val === 0);
    return unencrypted[(idxZero + 1000) % unencrypted.length].val + unencrypted[(idxZero + 2000) % unencrypted.length].val + unencrypted[(idxZero + 3000) % unencrypted.length].val;
}

async function part2() {
    const data = await getData(20);

    const encrypted = data.split('\n').map((c, idx) => ({ idx, val: Number(c) * 811589153 }));

    let unencrypted = [...encrypted];

    const nCount = encrypted.length - 1;
    for (let i = 0; i < 10; i++) {
        for (const n of encrypted) {
            const { idx, val } = n;
            const oldIdx = unencrypted.findIndex(c => c.idx === idx);
            let newIdx = oldIdx + val;
            if (newIdx > nCount) newIdx -= nCount * Math.floor(newIdx / nCount);
            if (newIdx <= 0) newIdx += nCount * (Math.floor(-newIdx / nCount) + 1);

            unencrypted.splice(oldIdx, 1);
            unencrypted.splice(newIdx, 0, n);
        }
    }

    const idxZero = unencrypted.findIndex(c => c.val === 0);
    return unencrypted[(idxZero + 1000) % unencrypted.length].val + unencrypted[(idxZero + 2000) % unencrypted.length].val + unencrypted[(idxZero + 3000) % unencrypted.length].val;
}

part1().then(res => console.log('Part 1\n', res));

part2().then(res => console.log('Part 2\n', res));
