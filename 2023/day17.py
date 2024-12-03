from enum import Enum

from data import get_data

data = get_data(17).strip()

data = [[int(el) for el in line] for line in data.splitlines()]

I_0 = 0
I_N = len(data) - 1
J_0 = 0
J_N = len(data[0]) - 1

class Direction(Enum):
    UP = (-1, 0)
    DOWN = (1, 0)
    LEFT = (0, -1)
    RIGHT = (0, 1)

class Path:
    i: int
    j: int
    dir: Direction
    cost: int
    dir_rep: int
    history: tuple[Direction]

    def __init__(self, *, i: int, j: int, dir: Direction, cost: int, dir_rep: int, history: tuple[Direction]):
        self.i = i
        self.j = j
        self.dir = dir
        self.cost = cost
        self.dir_rep = dir_rep
        self.history = history

    def step(self, dir: Direction):
        i, j = dir.value
        cell_cost = data[self.i + i][self.j + j]
        return Path(
            i=self.i + i,
            j=self.j + j,
            dir=dir,
            cost=self.cost + cell_cost,
            dir_rep=(self.dir_rep + 1) if self.dir == dir else 1,
            history=(*self.history, dir)
        )

def is_acceptable_dir(path: Path, dir: Direction, min_steps: int, max_steps: int) -> bool:
    if path.dir_rep < min_steps and path.dir != dir:
        return False
    if path.dir_rep == max_steps and path.dir == dir:
        return False
    
    match dir:
        case Direction.UP:
            return path.i != I_0 and path.dir != Direction.DOWN
        case Direction.DOWN:
            return path.i != I_N and path.dir != Direction.UP
        case Direction.LEFT:
            return path.j != J_0 and path.dir != Direction.RIGHT
        case Direction.RIGHT:
            return path.j != J_N and path.dir != Direction.LEFT
        
def get_init_min_cost(min_steps: int):
    i = 0
    j = 0
    dir = Direction.RIGHT
    dir_rep = 0
    min_cost = 0
    for _ in range(I_N + J_N):
        i += dir.value[0]
        j += dir.value[1]
        dir_rep += 1
        min_cost += data[i][j]
        if dir_rep == min_steps:
            dir = Direction.DOWN if dir == Direction.RIGHT else Direction.RIGHT
            dir_rep = 0
        elif j == J_N and dir == Direction.RIGHT:
            dir = Direction.DOWN
            dir_rep = 0
        elif i == I_N and dir == Direction.DOWN:
            dir = Direction.RIGHT
            dir_rep = 0
    return min_cost
    
def get_path_min_cost(min_steps: int, max_steps: int):
    min_cost = get_init_min_cost(min_steps)

    min_costs: dict[tuple[int, int, Direction], list[tuple[int, Path] | None]] = {}

    paths = {
        Path(i=0, j=0, dir=Direction.RIGHT, cost=0, dir_rep=0, history=tuple()),
        Path(i=0, j=0, dir=Direction.DOWN, cost=0, dir_rep=0, history=tuple())
    }

    for _ in range(0, len(data) * len(data[0])):
        new_paths: set[Path] = set()

        for p in paths:
            for dir in Direction:
                if not is_acceptable_dir(p, dir, min_steps, max_steps):
                    continue

                path = p.step(dir)

                if path.dir_rep < min_steps:
                    new_paths.add(path)
                    continue

                if path.cost >= min_cost:
                    continue

                if path.i == I_N and path.j == J_N:
                    min_cost = path.cost
                    continue

                min_cost_for_pos = min_costs.get((path.i, path.j, path.dir), None)
                dir_rep_idx = path.dir_rep - min_steps

                if min_cost_for_pos is None:
                    min_cost_for_pos = [None] * (max_steps - min_steps + 1)
                    min_costs[(path.i, path.j, path.dir)] = min_cost_for_pos

                elif min([c[0] for c in min_cost_for_pos[:dir_rep_idx + 1] if c is not None] + [min_cost]) <= path.cost:
                    continue

                else:
                    for i, d in enumerate(min_cost_for_pos[dir_rep_idx:], dir_rep_idx):
                        if d is not None and d[0] > path.cost:
                            if len(d[1].history) == len(path.history):
                                new_paths.remove(d[1])
                            min_cost_for_pos[i] = None
                min_cost_for_pos[dir_rep_idx] = (path.cost, path)

                new_paths.add(path)

        paths = new_paths

        if len(paths) == 0:
            break

    return min_cost

def part1():
    return get_path_min_cost(1, 3)

print(part1())

def part2():
    return get_path_min_cost(4, 10)

print(part2())
