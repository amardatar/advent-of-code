from __future__ import annotations
from functools import reduce
from typing import Literal

from data import get_data

data = get_data(19).strip()

class Part:
    x: int
    m: int
    a: int
    s: int

    def __init__(self, part_str: str):
        for el in part_str[1:-1].split(','):
            key, val = el.split('=')
            setattr(self, key, int(val))
    
    def get_part_value(self):
        return self.x + self.m + self.a + self.s
    
class PartConstraint:
    x: tuple[int, int] | None = (1, 4000)
    m: tuple[int, int] | None = (1, 4000)
    a: tuple[int, int] | None = (1, 4000)
    s: tuple[int, int] | None = (1, 4000)

    def copy(self) -> PartConstraint:
        new_part = PartConstraint()
        new_part.x = self.x
        new_part.m = self.m
        new_part.a = self.a
        new_part.s = self.s
        return new_part

    def is_valid(self):
        return self.x is not None and self.m is not None and self.a is not None and self.s is not None

    def update_constraint(self, test: bool, key: Literal['x', 'm', 'a', 's'], operator: Literal['<', '>'], value: int) -> PartConstraint:
        lower, upper = getattr(self, key)
        match operator:
            case '<':
                if test:
                    if upper < value:
                        pass
                    elif lower >= value:
                        setattr(self, key, None)
                    else:
                        setattr(self, key, (lower, value - 1))
                else:
                    if lower >= value:
                        pass
                    elif upper < value:
                        setattr(self, key, None)
                    else:
                        setattr(self, key, (value, upper))
            case '>':
                if test:
                    if lower > value:
                        pass
                    elif upper <= value:
                        setattr(self, key, None)
                    else:
                        setattr(self, key, (value + 1, upper))
                else:
                    if upper <= value:
                        pass
                    elif lower > value:
                        setattr(self, key, None)
                    else:
                        setattr(self, key, (lower, value))
        return self
    
    def get_combinations(self) -> int:
        return (self.x[1] - self.x[0] + 1) * \
            (self.m[1] - self.m[0] + 1) * \
            (self.a[1] - self.a[0] + 1) * \
            (self.s[1] - self.s[0] + 1)

class WorkflowInstruction:
    condition_key: Literal['x', 'm', 'a', 's']
    condition_operator: Literal['<', '>']
    condition_value: int
    target_workflow_id: str

    def __init__(self, instruction_str: str):
        condition_str, target_str = instruction_str.split(':')
        if condition_str[0] not in ('x', 'm', 'a', 's'):
            raise ValueError(f'Expected one of x, m, a, or s, but received {condition_str[0]}')
        if condition_str[1] not in ('<', '>'):
            raise ValueError(f'Expected one of < or > but received {condition_str[1]}')
        self.condition_key = condition_str[0]
        self.condition_operator = condition_str[1]
        self.condition_value = int(condition_str[2:])
        self.target_workflow_id = target_str

    def test(self, part: Part) -> bool:
        match self.condition_operator:
            case '<':
                return getattr(part, self.condition_key) < self.condition_value
            case '>':
                return getattr(part, self.condition_key) > self.condition_value
            
    def get_combinations(self, test_val: bool) -> int:
        match self.condition_operator:
            case '<':
                return self.condition_value - 1 if test_val else 4001 - self.condition_value
            case '>':
                return 4000 - self.condition_value if test_val else self.condition_value

class Workflow:
    id: str
    instructions: list[WorkflowInstruction]
    default_target_workflow_id: str

    def __init__(self, workflow_str: str):
        self.id, instructions_str = workflow_str.split('{')
        instruction_lines = instructions_str[:-1].split(',')
        self.instructions = [WorkflowInstruction(s) for s in instruction_lines[:-1]]
        self.default_target_workflow_id = instruction_lines[-1]

    def get_result(self, part: Part, target_workflow_id: str) -> bool:
        if target_workflow_id == 'A':
            return True
        elif target_workflow_id == 'R':
            return False
        else:
            next_wf, = [wf for wf in workflows if wf.id == target_workflow_id]
            return next_wf.process_part(part)

    def process_part(self, part: Part) -> bool:
        for instruction in self.instructions:
            if instruction.test(part):
                return self.get_result(part, instruction.target_workflow_id)
        
        return self.get_result(part, self.default_target_workflow_id)
    
    def get_combinations(self, part: PartConstraint, idx: int | None = None) -> list[PartConstraint]:
        if idx is None:
            idx = 0

        if idx == len(self.instructions):
            if self.default_target_workflow_id == 'R':
                return []
            elif self.default_target_workflow_id == 'A':
                return [part.copy()]
            else:
                next_wf, = [wf for wf in workflows if wf.id == self.default_target_workflow_id]
                return next_wf.get_combinations(part.copy())

        instruction = self.instructions[idx]

        if instruction.target_workflow_id == 'R':
            return self.get_combinations(part.update_constraint(False, instruction.condition_key, instruction.condition_operator, instruction.condition_value), idx + 1)
        elif instruction.target_workflow_id == 'A':
            return [
                part.copy().update_constraint(True, instruction.condition_key, instruction.condition_operator, instruction.condition_value),
                *self.get_combinations(part.copy().update_constraint(False, instruction.condition_key, instruction.condition_operator, instruction.condition_value), idx + 1),
            ]
        else:
            next_wf, = [wf for wf in workflows if wf.id == instruction.target_workflow_id]
            return [
                *next_wf.get_combinations(part.copy().update_constraint(True, instruction.condition_key, instruction.condition_operator, instruction.condition_value)),
                *self.get_combinations(part.copy().update_constraint(False, instruction.condition_key, instruction.condition_operator, instruction.condition_value), idx + 1)
            ]

workflow_strs, part_strs = [s.splitlines() for s in data.split('\n\n')]
workflows = [Workflow(s) for s in workflow_strs]
parts = [Part(s) for s in part_strs]

def part1():
    in_workflow, = [wf for wf in workflows if wf.id == 'in']

    accumulated_value = 0

    for part in parts:
        if in_workflow.process_part(part):
            accumulated_value += part.get_part_value()

    return accumulated_value

print(part1())

def part2():
    in_workflow, = [wf for wf in workflows if wf.id == 'in']

    part_constraints = in_workflow.get_combinations(PartConstraint())

    return reduce(lambda acc, pc: acc + pc.get_combinations(), part_constraints, 0)

print(part2())
