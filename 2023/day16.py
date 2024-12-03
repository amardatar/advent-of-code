import sys
from typing import Literal, TypedDict

from data import get_data

sys.setrecursionlimit(1000000)

data = get_data(16).strip()

data = [[*line] for line in data.splitlines()]

Dir = Literal['>', 'v', '<', '^']
MirrorDict = TypedDict('MirrorDict', {'/': Dir, '\\': Dir})
DirMirrorDict = TypedDict('DirMirrorDict', {'>': MirrorDict, 'v': MirrorDict, '<': MirrorDict, '^': MirrorDict})

dir_mirror_dict: DirMirrorDict = {
    '>': {
        '/': '^',
        '\\': 'v',
    },
    'v': {
        '/': '<',
        '\\': '>',
    },
    '<': {
        '/': 'v',
        '\\': '^',
    },
    '^': {
        '/': '>',
        '\\': '<',
    },
}

def step_beam(cave_map: list[list[Literal['.', '/', '\\', '|', '-']]], ex: list[tuple[tuple[int, int], Dir]], pos: tuple[int, int], dir: Dir):
    if (pos, dir) in ex:
        return

    ex.append((pos, dir))

    i, j = pos

    match dir:
        case '>':
            if j == len(cave_map[i]) - 1:
                return
            j += 1
        case 'v':
            if i == len(cave_map) - 1:
                return
            i += 1
        case '<':
            if j == 0:
                return
            j -= 1
        case '^':
            if i == 0:
                return
            i -= 1

    cave_map[i][j] = '#'

    el = data[i][j]
    match el:
        case '.':
            step_beam(cave_map, ex, (i, j), dir)
        case '/' | '\\':
            step_beam(cave_map, ex, (i, j), dir_mirror_dict[dir][el])
        case '|' | '-':
            if el == '|' and dir in ['v', '^'] or el == '-' and dir in ['>', '<']:
                step_beam(cave_map, ex, (i, j), dir)
            else:
                if el == '|':
                    step_beam(cave_map, ex, (i, j), 'v')
                    step_beam(cave_map, ex, (i, j), '^')
                elif el == '-':
                    step_beam(cave_map, ex, (i, j), '>')
                    step_beam(cave_map, ex, (i, j), '<')

def part1():
    cave_map = [['.' for _ in line] for line in data]
    step_beam(cave_map, [], (0, -1), '>')
    return sum([sum(1 for el in line if el != '.') for line in cave_map])

print(part1())

def part2():
    max_tiles = 0

    for i in range(0, len(data)):
        cave_map = [['.' for _ in line] for line in data]
        step_beam(cave_map, [], (i, -1), '>')
        tiles = sum([sum(1 for el in line if el != '.') for line in cave_map])
        if tiles > max_tiles:
            max_tiles = tiles

        cave_map = [['.' for _ in line] for line in data]
        step_beam(cave_map, [], (i, len(data[i])), '<')
        tiles = sum([sum(1 for el in line if el != '.') for line in cave_map])
        if tiles > max_tiles:
            max_tiles = tiles
    
    for j in range(0, len(data[0])):
        cave_map = [['.' for _ in line] for line in data]
        step_beam(cave_map, [], (-1, j), 'v')
        tiles = sum([sum(1 for el in line if el != '.') for line in cave_map])
        if tiles > max_tiles:
            max_tiles = tiles

        cave_map = [['.' for _ in line] for line in data]
        step_beam(cave_map, [], (len(data), j), '^')
        tiles = sum([sum(1 for el in line if el != '.') for line in cave_map])
        if tiles > max_tiles:
            max_tiles = tiles

    return max_tiles

print(part2())