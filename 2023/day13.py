from typing import Optional

from data import get_data

data = get_data(13)

def _parse_data() -> list[list[str]]:
    patterns = data.strip().split('\n\n')
    return [pattern.split('\n') for pattern in patterns]

def check_vertical_reflection(pattern: list[str], ignore_i = -1) -> Optional[int]:
    width = len(pattern[0])

    for i in range(1, width):
        if i == ignore_i:
            continue
        compare_len = min(i, width - i)
        if all(line[0:i][-compare_len:] == line[2 * i - 1:i - 1:-1] for line in pattern):
            return i

    return None

def check_horizontal_reflection(pattern: list[str], ignore_i = -1) -> Optional[int]:
    height = len(pattern)

    for i in range(1, height):
        if i == ignore_i:
            continue
        compare_len = min(i, height - i)
        if pattern[0:i][-compare_len:] == pattern[2 * i - 1:i - 1:-1]:
            return 100 * i

    return None

def part1():
    patterns = _parse_data()
    return sum(check_vertical_reflection(pattern) or check_horizontal_reflection(pattern) for pattern in patterns)

print(part1())

def get_alternate_reflection(pattern: list[str]) -> Optional[int]:
    base_v = check_vertical_reflection(pattern) or check_horizontal_reflection(pattern)

    if base_v is None:
        raise ValueError('Failed to get a base reflection')

    for i, line in enumerate(pattern):
        for j, pos in enumerate(line):
            new_line = line[:j] + ('#' if pos == '.' else '.') + line[j + 1:]
            new_pattern = pattern[:i] + [new_line] + pattern[i + 1:]

            new_vertical_v = check_vertical_reflection(new_pattern, base_v)
            if new_vertical_v is not None and new_vertical_v != base_v:
                return new_vertical_v

            new_horizontal_v = check_horizontal_reflection(new_pattern, base_v / 100)
            if new_horizontal_v is not None and new_horizontal_v != base_v:
                return new_horizontal_v

    raise ValueError('Failed to get an alternate reflection')

def part2():
    patterns = _parse_data()
    return sum(get_alternate_reflection(pattern) for pattern in patterns)

print(part2())
