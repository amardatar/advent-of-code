from functools import cache
import re

from data import get_data

data = get_data(12)

def _parse_data() -> list[tuple[list[str], list[int]]]:
    return [
        (spring_map, (*map(int, damaged_spring_list.split(',')),))
        for spring_map, damaged_spring_list in (row.split(' ') for row in data.split('\n'))
    ]

@cache
def get_actual_spring_list(spring_map: str):
    sub_map = spring_map[:spring_map.index('?')] if '?' in spring_map else spring_map
    return (*(len(x) - 1 for x in re.findall(r'#+\.', sub_map)),)

@cache
def count_combinations(row: tuple[str, tuple[int]]) -> int:
    spring_map, damaged_spring_list = row

    if not '?' in spring_map:
        return (*map(len, re.findall(r'#+', spring_map)),) == damaged_spring_list
    
    actual_spring_list = get_actual_spring_list(spring_map)

    if (
        len(actual_spring_list) > len(damaged_spring_list)
        or any(x != y for x, y in zip(actual_spring_list, damaged_spring_list))
    ):
        return False

    idx = spring_map.index('?')
    new_spring_map = [re.sub(r'\.+', '.', spring_map[0:idx] + next + spring_map[idx + 1:]).strip('.') for next in '.#']
    return sum(count_combinations((s, damaged_spring_list)) for s in new_spring_map)

def part1():
    rows = _parse_data()
    combination_sum = 0
    for spring_map, damaged_spring_list in rows:
        combination_sum += count_combinations((spring_map, damaged_spring_list))
    return combination_sum

print(part1())

def part2():
    rows = _parse_data()
    combination_sum = 0
    for orig_spring_map, orig_damaged_spring_list in rows:
        spring_map = '?'.join(5 * [orig_spring_map])
        damaged_spring_list = 5 * orig_damaged_spring_list
        combination_sum += count_combinations((spring_map, damaged_spring_list))
    return combination_sum

print(part2())
