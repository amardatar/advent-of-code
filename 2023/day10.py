import sys
sys.setrecursionlimit(10 ** 6)

from data import get_data

data = get_data(10)

pipe_map = [list(row) for row in data.split('\n')]

def get_start():
    for i in range(0, len(pipe_map)):
        for j in range(0, len(pipe_map[i])):
            if pipe_map[i][j] == 'S':
                return i, j

translation = {
    'DOWN': {
        '|': [1, 0],
        'L': [0, 1],
        'J': [0, -1],
    },
    'LEFT': {
        '-': [0, -1],
        'L': [-1, 0],
        'F': [1, 0],
    },
    'RIGHT': {
        '-': [0, 1],
        'J': [-1, 0],
        '7': [1, 0],
    },
    'UP': {
        '|': [-1, 0],
        '7': [0, -1],
        'F': [0, 1],
    }
}

def get_translation_label(i, j):
    if i == 1:
        return 'DOWN'
    if i == -1:
        return 'UP'
    if j == 1:
        return 'RIGHT'
    if j == -1:
        return 'LEFT'
            
def get_next_pos(i, j, last_translation):
    next_translation = translation[last_translation][pipe_map[i][j]]
    next_i = i + next_translation[0]
    next_j = j + next_translation[1]
    if pipe_map[next_i][next_j] == 'S':
        return [[i, j]]
    return [[i, j]] + get_next_pos(next_i, next_j, get_translation_label(*next_translation))

def part1():
    i, j = get_start()
    return len(get_next_pos(i, j + 1, 'RIGHT')) / 2 + 0.5

print(part1())

def expand_map(old_map: list[list[str]], loop: list[tuple[int, int]]):
    new_map: list[list[str]] = []
    new_loop: list[tuple[int, int]] = []
    for i, row in enumerate(old_map):
        new_map.append([])
        new_map.append([])
        for j, pos in enumerate(row):
            is_loop_pos = [i, j] in loop

            right_is_loop_pos = is_loop_pos and pos in ('-', 'L', 'F', 'S')
            new_map[2 * i].append(pos)
            new_map[2 * i].append('-' if right_is_loop_pos else '.')
            if is_loop_pos:
                new_loop.append([2 * i, 2 * j])
            if right_is_loop_pos:
                new_loop.append([2 * i, 2 * j + 1])

            down_is_loop_pos = is_loop_pos and pos in ('|', '7', 'F', 'S')
            new_map[2 * i + 1].append('|' if down_is_loop_pos else '.')
            new_map[2 * i + 1].append('.')
            if down_is_loop_pos:
                new_loop.append([2 * i + 1, 2 * j])

    return [row[:-1] for row in new_map][:-1], new_loop

def fill_around(new_map: list[list[str]], loop: list[tuple[int, int]], pos: tuple[int, int]):
    i, j = pos
    if new_map[i][j] == '0' or pos in loop:
        return
    new_map[i][j] = '0'
    if j < len(new_map[i]) - 1:
        fill_around(new_map, loop, [i, j + 1])
    if i < len(new_map) - 1:
        fill_around(new_map, loop, [i + 1, j])
    if j > 0:
        fill_around(new_map, loop, [i, j - 1])
    if i > 0:
        fill_around(new_map, loop, [i - 1, j])

def fill_map(old_map: list[list[str]], loop: list[tuple[int, int]]):
    new_map = [row.copy() for row in old_map]
    for i, row in enumerate(new_map):
        for j, pos in enumerate(row):
            if i == 0 or j == 0 or i == len(new_map) - 1 or j == len(row) - 1:
                fill_around(new_map, loop, [i, j])
    return new_map

def contract_map(old_map: list[list[str]]):
    new_map: list[list[str]] = []
    for i in range(0, len(old_map), 2):
        new_map.append([])
        for j in range(0, len(old_map[i]), 2):
            new_map[int(i / 2)].append(old_map[i][j])
    return new_map

def part2():
    i, j = get_start()
    loop = [[i, j]] + get_next_pos(i, j + 1, 'RIGHT')
    expanded_map, new_loop = expand_map(pipe_map, loop)
    filled_map = fill_map(expanded_map, new_loop)
    contracted_map = contract_map(filled_map)
    return sum([len(row) for row in contracted_map]) - \
        sum([sum([1 if pos == '0' else 0 for pos in row]) for row in contracted_map]) - \
        len(loop)

print(part2())
