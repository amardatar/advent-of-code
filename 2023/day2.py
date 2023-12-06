from data import get_data

data = get_data(2)

def is_valid_game(game):
    """Returns the ID if the game was valid, or 0 if not (so the sum is unaffected)"""
    game_id, draws_str = game.split(': ')
    id = game_id.split(' ')[1]
    draws = draws_str.split('; ')
    for draw in draws:
        colours = draw.split(', ')
        for draw_colour in colours:
            number, colour = draw_colour.split(' ')
            if colour == 'red' and int(number) > 12:
                return 0
            if colour == 'green' and int(number) > 13:
                return 0
            if colour == 'blue' and int(number) > 14:
                return 0
    return int(id)

def part1():
    ids = [is_valid_game(game) for game in data.split('\n')]
    return sum(ids)

print(part1())

def get_game_power(game):
    red = 0
    green = 0
    blue = 0
    _id, draws_str = game.split(': ')
    draws = draws_str.split('; ')
    for draw in draws:
        colours = draw.split(', ')
        for draw_colour in colours:
            number, colour = draw_colour.split(' ')
            if colour == 'red' and int(number) > red:
                red = int(number)
            if colour == 'green' and int(number) > green:
                green = int(number)
            if colour == 'blue' and int(number) > blue:
                blue = int(number)
    return red * green * blue

def part2():
    powers = [get_game_power(game) for game in data.split('\n')]
    return sum(powers)

print(part2())
