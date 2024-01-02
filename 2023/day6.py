from data import get_data

data = get_data(6)

lines = data.split('\n')
times = [int(t) for t in lines[0].split()[1:]]
distances = [int(d) for d in lines[1].split()[1:]]

def get_lowest_number(time, distance):
    for i in range(0, time):
        if i * (time - i) > distance:
            return i

def part1():
    mult = None
    for i in range(0, len(times)):
        lowest_number = get_lowest_number(times[i], distances[i])
        diff = times[i] - 2 * lowest_number + 1
        mult = diff if mult is None else mult * diff
    
    return mult

print(part1())

def part2():
    time = int(''.join([str(t) for t in times]))
    distance = int(''.join([str(d) for d in distances]))
    lowest_number = get_lowest_number(time, distance)
    return time - 2 * lowest_number + 1

print(part2())
