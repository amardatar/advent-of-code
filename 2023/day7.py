from functools import reduce

from data import get_data

data = get_data(7)

hands = [d.split() for d in data.split('\n')]

p1_card_values = {
    'A': 'A',
    'K': 'B',
    'Q': 'C',
    'J': 'D',
    'T': 'E',
    '9': 'F',
    '8': 'G',
    '7': 'H',
    '6': 'I',
    '5': 'J',
    '4': 'K',
    '3': 'L',
    '2': 'M'
}

def p1_hand_reducer(value, element):
    if element not in value:
        value[element] = 0

    value[element] += 1
    return value

def p1_hand_type_rank(cards):
    hand = reduce(p1_hand_reducer, list(cards), {})
    rank = 'G'
    for key in hand.keys():
        if hand[key] == 2:
            if rank == 'D':
                rank = 'C'
            if rank == 'F':
                rank = 'E'
            if rank == 'G':
                rank = 'F'
        if hand[key] == 3:
            if rank == 'F':
                rank = 'C'
            if rank == 'G':
                rank = 'D'
        if hand[key] == 4:
            rank = 'B'
        if hand[key] == 5:
            rank = 'A'
    return rank

def p1_key_hand(hand_bid):
    return ''.join([p1_hand_type_rank(hand_bid[0])] + [p1_card_values[v] for v in list(hand_bid[0])])

def part1():
    sorted_hands = sorted(hands, key=p1_key_hand)
    sum = 0
    for idx, [_, bid] in enumerate(reversed(sorted_hands)):
        sum += (idx + 1) * int(bid)
    return sum

print(part1())

p2_card_values = {
    'A': 'A',
    'K': 'B',
    'Q': 'C',
    'J': 'Z',
    'T': 'E',
    '9': 'F',
    '8': 'G',
    '7': 'H',
    '6': 'I',
    '5': 'J',
    '4': 'K',
    '3': 'L',
    '2': 'M'
}

def p2_hand_reducer(value, element):
    if element not in value:
        value[element] = 0

    value[element] += 1
    return value

def p2_hand_type_rank(cards):
    hand = reduce(p2_hand_reducer, list(cards), {})
    rank = 'G'
    for key in hand.keys():
        if hand[key] == 2:
            if rank == 'D':
                rank = 'C'
            if rank == 'F':
                rank = 'E'
            if rank == 'G':
                rank = 'F'
        if hand[key] == 3:
            if rank == 'F':
                rank = 'C'
            if rank == 'G':
                rank = 'D'
        if hand[key] == 4:
            rank = 'B'
        if hand[key] == 5:
            rank = 'A'

    if 'J' not in hand:
        return rank
    
    if hand['J'] == 1:
        if rank == 'B':
            rank = 'A'
        if rank == 'D':
            rank = 'B'
        if rank == 'E':
            rank = 'C'
        if rank == 'F':
            rank = 'D'
        if rank == 'G':
            rank = 'F'

    if hand['J'] == 2:
        if rank == 'C':
            rank = 'A'
        if rank == 'D':
            rank = 'A'
        if rank == 'E':
            rank = 'B'
        if rank == 'F':
            rank = 'D'

    if hand['J'] == 3:
        if rank == 'C':
            rank = 'A'
        if rank == 'D':
            rank = 'B'

    if hand['J'] == 4:
        rank = 'A'

    return rank

def p2_key_hand(hand_bid):
    return ''.join([p2_hand_type_rank(hand_bid[0])] + [p2_card_values[v] for v in list(hand_bid[0])])

def part2():
    sorted_hands = sorted(hands, key=p2_key_hand)
    sum = 0
    for idx, [_, bid] in enumerate(reversed(sorted_hands)):
        sum += (idx + 1) * int(bid)
    return sum

print(part2())
