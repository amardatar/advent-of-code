import re

from data import get_data

data = get_data(4)

def get_card_points(card):
    _, left, right = re.split(' *[:|] +', card)
    winning_numbers = [int(num) for num in re.split(' +', left)]
    actual_numbers = [int(num) for num in re.split(' +', right)]
    correct = len([num for num in winning_numbers if num in actual_numbers])
    return 0 if correct == 0 else 2 ** (correct - 1)

def part1():
    cards = data.split('\n')
    return sum([get_card_points(card) for card in cards])

print(part1())

def get_card_copies(card):
    _, left, right = re.split(' *[:|] +', card)
    winning_numbers = [int(num) for num in re.split(' +', left)]
    actual_numbers = [int(num) for num in re.split(' +', right)]
    return len([num for num in winning_numbers if num in actual_numbers])

def part2():
    cards = data.split('\n')
    card_counts = [1 for _ in cards]
    for i, card in enumerate(cards):
        for j in range(0, min(get_card_copies(card), len(card_counts) - i -1)):
            card_counts[i + j + 1] += card_counts[i]
    return sum(card_counts)

print(part2())
