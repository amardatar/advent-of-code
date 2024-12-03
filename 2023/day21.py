from data import get_data

data = get_data(21).strip()

garden_map = [list(line) for line in data.splitlines()]

def part1():
    old_positions = {(i, j) for i, line in enumerate(garden_map) for j, plot in enumerate(line) if plot == 'S'}
    for _ in range(64):
        new_positions = set()
        for i, j in old_positions:
            for e_i, e_j in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
                if 0 <= i + e_i < len(garden_map) and 0 <= j + e_j < len(garden_map[i]):
                    if garden_map[i + e_i][j + e_j] in ('.', 'S'):
                        new_positions.add((i + e_i, j + e_j))

        old_positions = new_positions
    
    return len(old_positions)

print(part1())

# Map is odd width and height, has empty edges and an empty central cross, with the start being at the centre.
# So all map tiles can be reached in the shortest number of steps (no mazes).
# Adjacent map tiles will alternate between "odd" and "even" because a single tile is odd width.
# The middle section is 1 * odd + 4 * even + 8 * odd = 12 * even + ... = 1 * odd + 8 * sum_1^101149(n) * odd + (8 * sum_1^101149(n) + 404600) * even
# The extending diagonals can then be calculated and multiplied by the number of times they will appear.
def part2():
    saved_positions: dict[tuple[int, int], int] = {(i, j): 0 for i, line in enumerate(garden_map) for j, plot in enumerate(line) if plot == 'S'}
    new_positions = {**saved_positions}

    while len(new_positions) > 0:
        old_positions = {**new_positions}
        new_positions = {}
        for (i, j), n in old_positions.items():
            for e_i, e_j in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
                t_i = i + e_i
                t_j = j + e_j
                if 0 <= t_i < len(garden_map) and 0 <= t_j < len(garden_map[t_i]):
                    if (t_i, t_j) not in saved_positions and garden_map[t_i][t_j] != '#':
                        saved_positions[(t_i, t_j)] = n + 1
                        new_positions[(t_i, t_j)] = n + 1

    count_positions = 40924885401 * len([_ for _, n in saved_positions.items() if n % 2 == 1]) + 40925290000 * len([_ for _, n in saved_positions.items() if n % 2 == 0])

    for entry_pos, start_n, k_reps in [
        ((65, 0), 1, 1),
        ((0, 0), -64, 202299),
        ((0, 0), 67, 202300),
        ((0, 65), 1, 1),
        ((0, 130), -64, 202299),
        ((0, 130), 67, 202300),
        ((65, 130), 1, 1),
        ((130, 130), -64, 202299),
        ((130, 130), 67, 202300),
        ((130, 65), 1, 1),
        ((130, 0), -64, 202299),
        ((130, 0), 67, 202300),
    ]:
        saved_positions: dict[tuple[int, int], int] = {entry_pos: start_n}
        new_positions = {**saved_positions}

        while len(new_positions) > 0:
            old_positions = {**new_positions}
            new_positions = {}
            for (i, j), n in old_positions.items():
                for e_i, e_j in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
                    t_i = i + e_i
                    t_j = j + e_j
                    if 0 <= t_i < len(garden_map) and 0 <= t_j < len(garden_map[t_i]):
                        if (t_i, t_j) not in saved_positions and garden_map[t_i][t_j] != '#':
                            saved_positions[(t_i, t_j)] = n + 1
                            new_positions[(t_i, t_j)] = n + 1
        
        count_positions += k_reps * len([_ for _, n in saved_positions.items() if n % 2 == 1 and n <= 131])

    return count_positions

print(part2())
