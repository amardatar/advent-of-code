import { readFileSync, writeFileSync } from 'fs';

const envFile = readFileSync(`${import.meta.dirname}/../../.env`, 'utf-8');

const sessionToken =
    process.env['SESSION_TOKEN'] ??
    envFile
        .split('\n')
        .find((el) => el.startsWith('SESSION_TOKEN='))
        ?.split('=')[1];

export async function getData(day: number): Promise<string> {
    try {
        const data = readFileSync(`data/${day}.txt`, 'utf-8');
        return data.trim();
    } catch (err) {
        if (!(err instanceof Error && 'code' in err && err.code === 'ENOENT')) {
            throw err;
        }
    }
    const response = await fetch(`https://adventofcode.com/2024/day/${day}/input`, {
        headers: { cookie: `session=${sessionToken}` },
    });
    if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
    }
    const data = await response.text();
    writeFileSync(`data/${day}.txt`, data);
    return data.trim();
}
