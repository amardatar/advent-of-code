import re

from data import get_data

data = get_data(15)

def hash_str(s: str, n = 0) -> int:
    n = 17 * (n + ord(s[0])) % 256
    return hash_str(s[1:], n) if len(s) > 1 else n

def part1():
    return sum(hash_str(i) for i in data.split(','))

print(part1())

def part2():
    boxes: list[list[tuple[str, int]]] = [[] for _ in range(0, 256)]

    for step in data.split(','):
        label, op, n = re.findall(r'([A-z]+)(-|=)(\d+)?', step)[0]
        box_idx = hash_str(label)
        box = boxes[box_idx]
        if op == '-':
            existing_idx = [i for i, l in enumerate(box) if l[0] == label]
            if len(existing_idx) > 0:
                box.pop(existing_idx[0])
        elif op == '=':
            focal_length = int(n)
            lens = [label, focal_length]
            existing_idx = [i for i, l in enumerate(box) if l[0] == label]
            if len(existing_idx) > 0:
                box[existing_idx[0]] = lens
            else:
                box.append(lens)

    return sum(sum((i + 1) * (j + 1) * l[1] for j, l in enumerate(box)) for i, box in enumerate(boxes))

print(part2())
