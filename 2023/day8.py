from math import lcm
import re

from data import get_data

data = get_data(8)

def _parse_data():
    [directions, nodes] = data.split('\n\n')
    nodes_matched = [re.findall('[A-Z]+', n) for n in nodes.split('\n')]
    node_dict = { n[0]: [n[1], n[2]] for n in nodes_matched }
    return [list(directions), node_dict]

def part1():
    [directions, node_dict] = _parse_data()
    i = 0
    node = 'AAA'
    while True:
        direction = directions[i % len(directions)]
        node = node_dict[node][0 if direction == 'L' else 1]
        i += 1
        if node == 'ZZZ':
            return i

print(part1())

def part2():
    [directions, node_dict] = _parse_data()
    lengths = []
    for node in node_dict.keys():
        if not node.endswith('A'):
            continue
        i = 0
        while True:
            direction = directions[i % len(directions)]
            node = node_dict[node][0 if direction == 'L' else 1]
            i += 1
            if node.endswith('Z'):
                lengths.append(i)
                break
    return lcm(*lengths)

print(part2())
