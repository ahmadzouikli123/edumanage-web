# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

# Find Students section
idx_students = content.find('function Students(')
idx_classes = content.find('\nfunction Classes(', idx_students)
students_section = content[idx_students:idx_classes]

# Remove all assignModal code from students_section
import re

# Remove the modal block
pattern = r'\n\n\s*\{/\* Assign Classes Modal \*/\}.*?\}\)\(\)\)}'
cleaned = re.sub(pattern, '', students_section, flags=re.DOTALL)

if cleaned != students_section:
    content = content[:idx_students] + cleaned + content[idx_classes:]
    print('Removed from Students!')
else:
    print('Pattern not matched, trying manual removal...')
    # Find and remove manually
    start_marker = '\n\n\n      {/* Assign Classes Modal */}'
    end_marker = '      })()}'
    start = students_section.find(start_marker)
    if start != -1:
        end = students_section.find(end_marker, start) + len(end_marker)
        cleaned = students_section[:start] + students_section[end:]
        content = content[:idx_students] + cleaned + content[idx_classes:]
        print('Manually removed!')
    else:
        print('ERROR: marker not found!')
        idx = students_section.find('Assign Classes Modal')
        print(repr(students_section[idx-50:idx+200]))

# Verify
idx_students2 = content.find('function Students(')
idx_classes2 = content.find('\nfunction Classes(', idx_students2)
students_section2 = content[idx_students2:idx_classes2]
count = students_section2.count('assignModal')
print(f'assignModal count in Students after fix: {count}')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
