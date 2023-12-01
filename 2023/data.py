from pathlib import Path
from urllib import request

cookie = 'session='

def get_data(day: int):
    """Gets data for a given day, caching it locally to avoid re-fetching while developing a solution"""
    if Path(f'./data/{day}.txt').is_file():
        return Path(f'./data/{day}.txt').read_text()
    
    req = request.Request(
        f'https://adventofcode.com/2023/day/{day}/input',
        headers={ 'cookie': cookie }
    )

    with request.urlopen(req) as res:
        data = res.read().decode('utf-8')
        Path(f'./data/{day}.txt').write_text(data)
        return data