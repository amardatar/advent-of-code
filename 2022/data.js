const { get } = require('https');

exports.getData = async (day) => {
    let data = '';

    return new Promise((resolve) => {
        get(
            `https://adventofcode.com/2022/day/${day}/input`,
            {
                headers: {
                    cookie: 'session='
                }
            },
            (res) => {
                res.on('data', d => data += d);
                res.on('end', () => resolve(data.trimEnd()));
            }
        );
    });
}