from data import get_data

data = get_data(5)

class ParsedData:
    _seeds_and_maps = data.split('\n\n')
    seeds = [int(e) for e in _seeds_and_maps[0].split(': ')[1].split()]
    seed_to_soil = [[int(e) for e in el.split()] for el in _seeds_and_maps[1].split(':\n')[1].split('\n')]
    soil_to_fertilizer = [[int(e) for e in el.split()] for el in _seeds_and_maps[2].split(':\n')[1].split('\n')]
    fertilizer_to_water = [[int(e) for e in el.split()] for el in _seeds_and_maps[3].split(':\n')[1].split('\n')]
    water_to_light = [[int(e) for e in el.split()] for el in _seeds_and_maps[4].split(':\n')[1].split('\n')]
    light_to_temperature = [[int(e) for e in el.split()] for el in _seeds_and_maps[5].split(':\n')[1].split('\n')]
    temperature_to_humidity = [[int(e) for e in el.split()] for el in _seeds_and_maps[6].split(':\n')[1].split('\n')]
    humidity_to_location = [[int(e) for e in el.split()] for el in _seeds_and_maps[7].split(':\n')[1].split('\n')]

    def __init__(self):
        pass

def map_val(map: list[list[int]], val: int):
    for map_item in map:
        if val in range(map_item[1], map_item[1] + map_item[2]):
            return map_item[0] + val - map_item[1]
    return val

def map_val_backwards(map: list[list[int]], val:int):
    for map_item in map:
        if val in range(map_item[0], map_item[0] + map_item[2]):
            return map_item[1] + val - map_item[0]
    return val

def part1():
    parsed_data = ParsedData()
    min_location = None
    for seed in parsed_data.seeds:
        soil = map_val(parsed_data.seed_to_soil, seed)
        fertilizer = map_val(parsed_data.soil_to_fertilizer, soil)
        water = map_val(parsed_data.fertilizer_to_water, fertilizer)
        light = map_val(parsed_data.water_to_light, water)
        temperature = map_val(parsed_data.light_to_temperature, light)
        humidity = map_val(parsed_data.temperature_to_humidity, temperature)
        location = map_val(parsed_data.humidity_to_location, humidity)
        if min_location is None or location < min_location:
            min_location = location

    return min_location

print(part1())

def part2():
    parsed_data = ParsedData()

    for location in range(0, 10 ** 12):
        if location in [10 ** n for n in range(0, 12)]:
            print(location)
        humidity = map_val_backwards(parsed_data.humidity_to_location, location)
        temperature = map_val_backwards(parsed_data.temperature_to_humidity, humidity)
        light = map_val_backwards(parsed_data.light_to_temperature, temperature)
        water = map_val_backwards(parsed_data.water_to_light, light)
        fertilizer = map_val_backwards(parsed_data.fertilizer_to_water, water)
        soil = map_val_backwards(parsed_data.soil_to_fertilizer, fertilizer)
        seed = map_val_backwards(parsed_data.seed_to_soil, soil)

        for i in range(0, len(parsed_data.seeds), 2):
            if seed in range(parsed_data.seeds[i], parsed_data.seeds[i] + parsed_data.seeds[i + 1]):
                return location

print(part2())
