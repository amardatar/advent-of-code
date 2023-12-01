import re

from data import get_data

data = get_data(1)

def get_calibration_value1(line):
    all_nums = re.findall('\d', line)
    return int(f'{all_nums[0]}{all_nums[-1]}')

def part1():
    lines = data.split('\n')
    nums = [get_calibration_value1(line) for line in lines]
    return sum(nums)

print(part1())

spelled_nums = {
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9
}

def transform_spelled_num(maybe_spelled_num):
    return spelled_nums[maybe_spelled_num] if maybe_spelled_num in spelled_nums else maybe_spelled_num

def get_calibration_value2(line):
    all_nums = re.findall(f'(?=(\d|{"|".join(list(spelled_nums.keys()))}))', line)
    return int(f'{transform_spelled_num(all_nums[0])}{transform_spelled_num(all_nums[-1])}')

def part2():
    lines = data.split('\n')
    nums = [get_calibration_value2(line) for line in lines]
    return sum(nums)

print(part2())
