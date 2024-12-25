import { getData } from './data.js';

const data = await getData(2);

const reports = data.split('\n').map((report) => report.split(' ').map((level) => Number(level)));

let count = 0;
for (const report of reports) {
    for (let i = 0; i < report.length; i++) {
        const maybeReport = [...report];
        maybeReport.splice(i, 1);
        if (
            maybeReport.every((level, idx) => idx === 0 || level > maybeReport[idx - 1]!) ||
            maybeReport.every((level, idx) => idx === 0 || level < maybeReport[idx - 1]!)
        ) {
            if (
                maybeReport.every(
                    (level, idx) =>
                        idx === 0 ||
                        (Math.abs(level - maybeReport[idx - 1]!) >= 1 && Math.abs(level - maybeReport[idx - 1]!) <= 3)
                )
            ) {
                count++;
                break;
            }
        }
    }
}

console.log(count);
