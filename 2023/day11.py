from data import get_data

data = get_data(11)

def _parse_data():
    return [list(row) for row in data.split('\n')]

def part1():
    image = _parse_data()
    for i in reversed(range(0, len(image))):
        if len([j for j in image[i] if j != '.']) == 0:
            image.insert(i, image[i].copy())
    for j in reversed(range(0, len(image[0]))):
        if len([row[j] for row in image if row[j] != '.']) == 0:
            for row in image:
                row.insert(j, '.')
    galaxies = []
    for i, row in enumerate(image):
        for j, pos in enumerate(row):
            if pos == '#':
                galaxies.append([i, j])
    distances = 0
    for i in range(0, len(galaxies) - 1):
        for j in range(i + 1, len(galaxies)):
            d = abs(galaxies[i][0] - galaxies[j][0]) + abs(galaxies[i][1] - galaxies[j][1])
            distances += d
    return distances

print(part1())

expansion_mult = 10 ** 6 - 1

def part2():
    image = _parse_data()
    galaxies = []
    for i, row in enumerate(image):
        for j, pos in enumerate(row):
            if pos == '#':
                galaxies.append([i, j])
    expanded_rows = [i for i, row in enumerate(image) if len([pos for pos in row if pos != '.']) == 0]
    expanded_cols = [j for j in range(0, len(image[0])) if len([row[j] for row in image if row[j] != '.']) == 0]
    distances = 0
    for i in range(0, len(galaxies) - 1):
        for j in range(i + 1, len(galaxies)):
            d = abs(galaxies[i][0] - galaxies[j][0]) + abs(galaxies[i][1] - galaxies[j][1])
            d += expansion_mult * len([row for row in expanded_rows if galaxies[i][0] < row < galaxies[j][0]])
            left_col = min(galaxies[i][1], galaxies[j][1])
            right_col = max(galaxies[i][1], galaxies[j][1])
            d += expansion_mult * len([col for col in expanded_cols if left_col < col < right_col])
            distances += d
    return distances

print(part2())
