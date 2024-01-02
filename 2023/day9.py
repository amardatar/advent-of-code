from data import get_data

data = get_data(9)

def get_next_number(row: list[int]):
    diff = [row[i + 1] - row[i] for i in range(0, len(row) - 1)]
    return row[-1] + (get_next_number(diff) if len([n for n in diff if n != 0]) > 0 else 0)

def part1():
    parsed_data = [[int(n) for n in row.split()] for row in data.split('\n')]
    return sum([get_next_number(row) for row in parsed_data])

print(part1())

def part2():
    parsed_data = [[int(n) for n in row.split()] for row in data.split('\n')]
    for row in parsed_data:
        row.reverse()
    return sum([get_next_number(row) for row in parsed_data])

print(part2())
