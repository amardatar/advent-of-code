import math
from typing import Literal

from data import get_data

data = get_data(20).strip()

# data = """
# broadcaster -> a, b, c
# %a -> b
# %b -> c
# %c -> inv
# &inv -> a
# """.strip()

# data = """
# broadcaster -> a
# %a -> inv, con
# &inv -> b
# %b -> con
# &con -> output
# """.strip()

class Pulse:
    source: str
    target: str
    value: Literal['high', 'low']

    def __init__(self, source: str, target: str, value: Literal['high', 'low']):
        self.source = source
        self.target = target
        self.value = value

class CommModule:
    name: str
    targets: list[str]

    def __init__(self, name: str, targets: list[str]):
        self.name = name
        self.targets = targets

    def pulse(self, pulse: Pulse) -> list[Pulse]:
        return []

class BroadcastModule(CommModule):
    def __init__(self, name: str, targets: list[str]):
        super().__init__(name, targets)

    def pulse(self, pulse: Pulse):
        return [Pulse(self.name, target, pulse.value) for target in self.targets]

class FlipFlopModule(CommModule):
    state: Literal['on', 'off']

    def __init__(self, name: str, targets: list[str]):
        super().__init__(name, targets)
        self.state = 'off'

    def pulse(self, pulse: Pulse):
        if pulse.value == 'high':
            return []
        
        self.state = 'on' if self.state == 'off' else 'off'
        pulse_value = 'high' if self.state == 'on' else 'low'
        return [Pulse(self.name, target, pulse_value) for target in self.targets]

class ConjunctionModule(CommModule):
    memory: dict[str, Literal['high', 'low']]
    state: Literal['high', 'low']

    def __init__(self, name: str, targets: list[str]):
        super().__init__(name, targets)
        self.memory = {}
        self.state = 'high'

    def pulse(self, pulse: Pulse):
        self.memory[pulse.source] = pulse.value
        if pulse.value == 'low':
            self.state = 'high'
        elif all([v == 'high' for v in self.memory.values()]):
            self.state = 'low'
        return [Pulse(self.name, target, self.state) for target in self.targets]

def get_comm_module(input: str) -> CommModule:
    module_str, targets_str = input.split(' -> ')

    targets = targets_str.split(', ')

    if module_str == 'broadcaster':
        return 'broadcaster', BroadcastModule('broadcaster', targets)
    elif module_str.startswith('%'):
        return module_str[1:], FlipFlopModule(module_str[1:], targets)
    elif module_str.startswith('&'):
        return module_str[1:], ConjunctionModule(module_str[1:], targets)
    else:
        raise BaseException()

comm_modules: dict[str, CommModule] = dict([get_comm_module(line) for line in data.splitlines()])

for module in [*comm_modules.values()]:
    for target in module.targets:
        if target not in comm_modules:
            comm_modules[target] = CommModule(target, [])
        if isinstance(target_module := comm_modules[target], ConjunctionModule):
            target_module.memory[module.name] = 'low'

def part1():
    low_pulses = 0
    high_pulses = 0

    for _ in range(1000):
        pulse_queue: list[Pulse] = [Pulse('button', 'broadcaster', 'low')]
        while len(pulse_queue) > 0:
            pulse = pulse_queue.pop(0)
            if pulse.value == 'low':
                low_pulses += 1
            else:
                high_pulses += 1
            target = comm_modules[pulse.target]
            for p in target.pulse(pulse):
                pulse_queue.append(p)

    return low_pulses * high_pulses

print(part1())

def get_button_presses(group: str) -> int:
    button_presses = 0
    cycles = []

    while True:
        button_presses += 1
        pulse_queue: list[Pulse] = [Pulse('broadcaster', group, 'low')]
        while len(pulse_queue) > 0:
            pulse = pulse_queue.pop(0)
            target = comm_modules[pulse.target]
            for p in target.pulse(pulse):
                if p.target == 'xn' and p.value == 'high':
                    cycles.append(button_presses)
                    if len(cycles) > 2:
                        for i in range(len(cycles) - 2):
                            if cycles[i + 2] - cycles[i + 1] == cycles[i + 1] - cycles[i]:
                                return cycles
                pulse_queue.append(p)

# Relies on there being distinct non-interacting sub-groups from each target of broadcaster to each input to the module prior to `rx`.
def part2():
    button_presses = [get_button_presses(target) for target in comm_modules['broadcaster'].targets]
    return math.lcm(*[bp[1] - bp[0] for bp in button_presses])

print(part2())
