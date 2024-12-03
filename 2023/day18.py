import sys
from typing import Literal

from data import get_data

sys.setrecursionlimit(1000000)

data = get_data(18).strip()

class DigEdge:
    i: int | None = None
    j: int | None = None
    top: int | None = None
    bottom: int | None = None
    left: int | None = None
    right: int | None = None
    def __init__(self, start: tuple[int, int], end: tuple[int, int]):
        start_i, start_j = start
        end_i, end_j = end

        if start_i == end_i:
            self.i = start_i
            self.left = min(start_j, end_j)
            self.right = max(start_j, end_j)
        elif start_j == end_j:
            self.j = start_j
            self.top = min(start_i, end_i)
            self.bottom = max(start_i, end_i)
        else:
            raise BaseException('Unexpectedly received an angled line')

    def __repr__(self):
        if self.i is not None:
            return f'(({self.i}, {self.left}), ({self.i}, {self.right}))'
        else:
            return f'(({self.top}, {self.j}), ({self.bottom}, {self.j}))'

    def height(self) -> int:
        return self.bottom - self.top + 1

    def width(self) -> int:
        return self.right - self.left + 1

class DigInstruction:
    direction: Literal['U', 'D', 'L', 'R']
    distance: int
    color: str

    def __init__(self, line: str):
        dir, dis, c = line.split(' ')
        self.direction = dir
        self.distance = int(dis)
        self.color = c

    def convert_color(self) -> tuple[int, Literal['U', 'D', 'L', 'R']]:
        direction = ['R', 'D', 'L', 'U'][int(self.color[7:8])]
        distance = int(self.color[2:7], 16)
        return (distance, direction)

dig_instructions = [DigInstruction(line) for line in data.splitlines()]

def fill(dig_map: list[list[str]], i: int, j: int):
    dig_map[i][j] = '#'
    if i - 1 >= 0 and dig_map[i - 1][j] == '.':
        fill(dig_map, i - 1, j)
    if i + 1 < len(dig_map) and dig_map[i + 1][j] == '.':
        fill(dig_map, i + 1, j)
    if j - 1 >= 0 and dig_map[i][j - 1] == '.':
        fill(dig_map, i, j - 1)
    if j + 1 < len(dig_map[i]) and dig_map[i][j + 1] == '.':
        fill(dig_map, i, j + 1)

def part1():
    dig_edges: list[tuple[int, int]] = [(0, 0)]
    for di in dig_instructions:
        for _ in range(di.distance):
            last_i = dig_edges[-1][0]
            last_j = dig_edges[-1][1]
            match di.direction:
                case 'U':
                    dig_edges.append((last_i - 1, last_j))
                case 'D':
                    dig_edges.append((last_i + 1, last_j))
                case 'L':
                    dig_edges.append((last_i, last_j - 1))
                case 'R':
                    dig_edges.append((last_i, last_j + 1))

    min_i = 0
    max_i = 0
    min_j = 0
    max_j = 0
    for (i, j) in dig_edges:
        if i < min_i:
            min_i = i
        if i > max_i:
            max_i = i
        if j < min_j:
            min_j = j
        if j > max_j:
            max_j = j

    dig_map: list[list[str]] = []
    for i in range(min_i, max_i + 1):
        row = []
        dig_map.append(row)
        for j in range(min_j, max_j + 1):
            if (i, j) in dig_edges:
                row.append('#')
            else:
                row.append('.')

    start_j = dig_map[0].index('#')
    fill(dig_map, 1, start_j + 1)

    return sum([sum([1 for el in line if el == '#']) for line in dig_map])

print(part1())

def part2():
    loc = (0, 0)
    dig_edges: list[DigEdge] = []
    for di in dig_instructions:
        distance, direction = di.convert_color()
        new_i = loc[0]
        new_j = loc[1]
        match direction:
            case 'U':
                new_i = loc[0] - distance
            case 'D':
                new_i = loc[0] + distance
            case 'L':
                new_j = loc[1] - distance
            case 'R':
                new_j = loc[1] + distance
        dig_edges.append(DigEdge(loc, (new_i, new_j)))
        loc = (new_i, new_j)

    horizontal_edges = [e for e in dig_edges if e.i is not None]
    vertical_edges = [e for e in dig_edges if e.j is not None]

    area = 0

    while len(horizontal_edges) > 0:
        horizontal_edges.sort(key=lambda edge: edge.i)

        top_edge = horizontal_edges.pop(0)

        top_vertical_edges: list[DigEdge] = sorted(
            [e for e in vertical_edges if e.top == top_edge.i and e.j in (top_edge.left, top_edge.right)],
            key=lambda e: e.bottom
        )
        if len(top_vertical_edges) != 2:
            raise BaseException('Unexpected number of vertical edges connected to the top edge')
        short_vertical_edge, long_vertical_edge = top_vertical_edges

        intermediate_horizontal_edges: list[DigEdge] = sorted(
            [e for e in horizontal_edges if e.i <= short_vertical_edge.bottom and top_edge.left < e.left and e.right < top_edge.right],
            key=lambda e: e.i
        )

        if len(intermediate_horizontal_edges) > 0:
            intermediate_horizontal_edges = sorted(
                [e for e in intermediate_horizontal_edges if e.i == intermediate_horizontal_edges[0].i],
                key=lambda e: e.left
            )
            for idx in range(len(intermediate_horizontal_edges) - 1):
                horizontal_edges.append(
                    DigEdge(
                        (intermediate_horizontal_edges[idx].i, intermediate_horizontal_edges[idx].right),
                        (intermediate_horizontal_edges[idx + 1].i, intermediate_horizontal_edges[idx + 1].left)
                    )
                )
                horizontal_edges.remove(intermediate_horizontal_edges[idx])
                area += intermediate_horizontal_edges[idx].width() - 2
            horizontal_edges.remove(intermediate_horizontal_edges[-1])
            area += intermediate_horizontal_edges[-1].width() - 2

            ihe = intermediate_horizontal_edges[0]
            ihe.right = intermediate_horizontal_edges[-1].right

            area += top_edge.width() * (ihe.i - top_edge.i)

            short_vertical_edge.top = ihe.i
            long_vertical_edge.top = ihe.i

            if ihe.i < short_vertical_edge.bottom:
                horizontal_edges.append(DigEdge((ihe.i, top_edge.left), (ihe.i, ihe.left)))
                horizontal_edges.append(DigEdge((ihe.i, ihe.right), (ihe.i, top_edge.right)))
                continue

            if ihe.i == long_vertical_edge.bottom:
                raise BaseException('Not implemented')
            
            vertical_edges.remove(short_vertical_edge)

            sve_horizontal_edge, *others = [e for e in horizontal_edges if e.i == short_vertical_edge.bottom and short_vertical_edge.j in (e.left, e.right)]
            if len(others) != 0:
                raise BaseException('Unexpected number of edges connected to the bottom of short_vertical_edge')
            
            if sve_horizontal_edge.right < ihe.left:
                horizontal_edges.append(DigEdge((ihe.i, ihe.right), (ihe.i, top_edge.right)))
                if sve_horizontal_edge.left == top_edge.left:
                    area += sve_horizontal_edge.right - sve_horizontal_edge.left
                    sve_horizontal_edge.left = sve_horizontal_edge.right
                sve_horizontal_edge.right = ihe.left
            elif sve_horizontal_edge.left > ihe.right:
                horizontal_edges.append(DigEdge((ihe.i, top_edge.left), (ihe.i, ihe.left)))
                if sve_horizontal_edge.right == top_edge.right:
                    area += sve_horizontal_edge.right - sve_horizontal_edge.left
                    sve_horizontal_edge.right = sve_horizontal_edge.left
                sve_horizontal_edge.left = ihe.right
        elif short_vertical_edge.bottom == long_vertical_edge.bottom:
            area += top_edge.width() * (short_vertical_edge.height() - 1)

            vertical_edges.remove(short_vertical_edge)
            vertical_edges.remove(long_vertical_edge)

            secondary_horizontal_edges: list[DigEdge] = sorted(
                [e for e in horizontal_edges if e.i == short_vertical_edge.bottom and (short_vertical_edge.j in (e.left, e.right) or long_vertical_edge.j in (e.left, e.right))],
                key=lambda e: e.left
            )
            if len(secondary_horizontal_edges) == 1:
                horizontal_edges.remove(secondary_horizontal_edges[0])
                area += secondary_horizontal_edges[0].width()
                continue
            if len(secondary_horizontal_edges) != 2:
                raise BaseException('Unexpected number of horizontal edges connected to the two vertical edges')
            
            left_horizontal_edge, right_horizontal_edge = secondary_horizontal_edges

            new_i = short_vertical_edge.bottom
            new_left = left_horizontal_edge.left if left_horizontal_edge.right == top_edge.left else left_horizontal_edge.right
            new_right = right_horizontal_edge.right if right_horizontal_edge.left == top_edge.right else right_horizontal_edge.left

            horizontal_edges.remove(left_horizontal_edge)
            horizontal_edges.remove(right_horizontal_edge)
            horizontal_edges.append(DigEdge((new_i, new_left), (new_i, new_right)))

            if new_left > top_edge.left:
                area += new_left - top_edge.left
            if new_right < top_edge.right:
                area += top_edge.right - new_right
        else:
            area += top_edge.width() * (short_vertical_edge.height() - 1)

            vertical_edges.remove(short_vertical_edge)
            long_vertical_edge.top = short_vertical_edge.bottom

            secondary_horizontal_edge, *others = [e for e in horizontal_edges if e.i == short_vertical_edge.bottom and short_vertical_edge.j in (e.left, e.right)]
            if len(others) != 0:
                raise BaseException('Expected exactly 1 horizontal edge orthogonal to the vertical edge that was orthogonal to the top-most horizontal edge')

            if top_edge.left == secondary_horizontal_edge.left:
                area += secondary_horizontal_edge.width() - 1
                secondary_horizontal_edge.left = secondary_horizontal_edge.right
                secondary_horizontal_edge.right = top_edge.right
            elif top_edge.right == secondary_horizontal_edge.right:
                area += secondary_horizontal_edge.width() - 1
                secondary_horizontal_edge.right = secondary_horizontal_edge.left
                secondary_horizontal_edge.left = top_edge.left
            elif secondary_horizontal_edge.right == top_edge.left:
                secondary_horizontal_edge.right = top_edge.right
            elif secondary_horizontal_edge.left == top_edge.right:
                secondary_horizontal_edge.left = top_edge.left
            else:
                raise BaseException('Did not expect to get here')

    return area

print(part2())
