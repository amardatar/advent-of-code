import re

from data import get_data

data = get_data(3)

def get_part_numbers(line_before, line, line_after):
    numbers = []
    matches = re.compile(r'\d+').finditer(line)
    if matches is None:
        return numbers

    for match in matches:
        left, right = match.span(0)
        left = max(0, left - 1)
        right = min(len(line), right + 1)

        if (line_before is not None and re.search(r'[^.\d]', line_before[left:right])) or \
            re.search(r'[^.\d]', line[left:right]) or \
            (line_after is not None and re.search(r'[^.\d]', line_after[left:right])):
            numbers.append(int(match.group()))
            continue

    return numbers

def part1():
    part_numbers = []
    lines = data.split('\n')
    for idx, line in enumerate(lines):
        line_before = lines[idx - 1] if idx > 0 else None
        line_after = lines[idx + 1] if idx < len(lines) - 1 else None
        nums = get_part_numbers(line_before, line, line_after)
        part_numbers.append(sum(nums))

    return sum(part_numbers)

print(part1())

def get_gear_numbers(line_before, line, line_after):
    numbers = []
    matches = re.compile(r'\*').finditer(line)
    if matches is None:
        return numbers

    for match in matches:
        left, right = match.span(0)
        left = max(0, left - 1)
        right = min(len(line), right + 1)

        adjacent_nums = []
        line_before_matches = re.compile(r'\d+').finditer(line_before) if line_before is not None else None
        line_matches = re.compile(r'\d+').finditer(line)
        line_after_matches = re.compile(r'\d+').finditer(line_after) if line_after is not None else None

        if line_before_matches is not None:
            for m in line_before_matches:
                l, r = m.span(0)
                if r > left and l < right:
                    adjacent_nums.append(int(m.group()))

        if line_matches is not None:
            for m in line_matches:
                l, r = m.span(0)
                if r > left and l < right:
                    adjacent_nums.append(int(m.group()))

        if line_after_matches is not None:
            for m in line_after_matches:
                l, r = m.span(0)
                if r > left and l < right:
                    adjacent_nums.append(int(m.group()))

        if len(adjacent_nums) == 2:
            numbers.append(adjacent_nums[0] * adjacent_nums[1])

    return numbers

def part2():
    gear_numbers = []
    lines = data.split('\n')
    for idx, line in enumerate(lines):
        line_before = lines[idx - 1] if idx > 0 else None
        line_after = lines[idx + 1] if idx < len(lines) - 1 else None
        nums = get_gear_numbers(line_before, line, line_after)
        gear_numbers.append(sum(nums))

    return sum(gear_numbers)

print(part2())
