# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

# Find all occurrences of assignModal outside Teachers component
idx_teachers = content.find('function Teachers(')
idx_students = content.find('function Students(')

# Check where assignModal appears
positions = []
idx = 0
while True:
    idx = content.find('assignModal', idx)
    if idx == -1:
        break
    positions.append(idx)
    idx += 1

print(f'Found {len(positions)} occurrences of assignModal')
for pos in positions:
    context = content[pos-50:pos+50]
    location = 'Teachers' if idx_teachers < pos < idx_students else 'Outside Teachers'
    print(f'{location} at {pos}: {repr(context)}')

# Remove the modal block from ProfileCard/outside Teachers
import re
# Find and remove any assignModal JSX outside of Teachers function
teachers_end = content.find('\nfunction Students(', idx_teachers)

# Get content before and after teachers
before_teachers = content[:idx_teachers]
teachers_part = content[idx_teachers:teachers_end]
after_teachers = content[teachers_end:]

# Remove assignModal references from before and after Teachers
before_teachers_clean = re.sub(r'\n\s*\{/\* Assign Classes Modal \*/\}.*?\}\)\(\)\)\}', '', before_teachers, flags=re.DOTALL)
after_teachers_clean = re.sub(r'\n\s*\{/\* Assign Classes Modal \*/\}.*?\}\)\(\)\)\}', '', after_teachers, flags=re.DOTALL)

content = before_teachers_clean + teachers_part + after_teachers_clean
print(f'\nAfter cleanup:')
positions2 = []
idx = 0
while True:
    idx = content.find('assignModal', idx)
    if idx == -1:
        break
    positions2.append(idx)
    idx += 1
print(f'Remaining occurrences: {len(positions2)}')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
