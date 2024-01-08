from functools import cache

from data import get_data

data = get_data(14)

@cache
def tilt_subsection_left(ss: str) -> str:
    n_rocks = len([pos for pos in ss if pos == 'O'])
    return n_rocks * 'O' + (len(ss) - n_rocks) * '.'

@cache
def tilt_left(l: str) -> str:
    sub_sections = l.split('#')
    return '#'.join(tilt_subsection_left(ss) for ss in sub_sections)

@cache
def rotate_counter_clockwise(rock_map: str) -> str:
    return '\n'.join(''.join(row) for row in list(zip(*rock_map.split('\n')))[::-1])

@cache
def rotate_clockwise(rock_map: str) -> str:
    return '\n'.join(''.join(row) for row in zip(*rock_map.split('\n')[::-1]))

@cache
def tilt_north(rock_map: str):
    return rotate_clockwise('\n'.join([tilt_left(row) for row in rotate_counter_clockwise(rock_map).split('\n')]))

@cache
def tilt_west(rock_map: str):
    return '\n'.join([tilt_left(row) for row in rock_map.split('\n')])

@cache
def tilt_south(rock_map: str):
    return rotate_counter_clockwise('\n'.join([tilt_left(row) for row in rotate_clockwise(rock_map).split('\n')]))

@cache
def tilt_east(rock_map: str):
    return '\n'.join([tilt_left(row[::-1])[::-1] for row in rock_map.split('\n')])

@cache
def cycle(rock_map: str):
    rock_map = tilt_north(rock_map)
    rock_map = tilt_west(rock_map)
    rock_map = tilt_south(rock_map)
    rock_map = tilt_east(rock_map)
    return rock_map

def get_load(rock_map: str):
    return sum(
        (i + 1) * len([pos for pos in list(row) if pos == 'O'])
        for i, row in enumerate(reversed(rock_map.split('\n')))
    )

def part1():
    rock_map = tilt_north(data)
    return get_load(rock_map)

print(part1())

def part2():
    rock_map = data
    for _ in range(0, 10 ** 9):
        rock_map = cycle(rock_map)
    return get_load(rock_map)

print(part2())
