# -*- coding: utf-8 -*-
import re
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

# Remove handleAssignClasses function
content = re.sub(r'\n\s*const handleAssignClasses = \(teacher, selectedIds\) =>.*?setAssignModal\(null\);\n\s*\};\n', '\n', content, flags=re.DOTALL)

# Remove the modal JSX that references teacher/currentIds/handleAssignClasses
# Find and remove the block with currentIds
content = re.sub(r'\n\s*\{.*?const currentIds = \(teacher\.classIds.*?Save Assignment</button>.*?\}\)\(\)\)\}', '', content, flags=re.DOTALL)

# Remove any Cancel buttons that are orphaned from modal
# Remove handleAssignClasses references
content = content.replace('onClick={() => handleAssignClasses(teacher, [...currentIds])}', '')

print(f'assignModal remaining: {content.count("assignModal")}')
print(f'handleAssignClasses remaining: {content.count("handleAssignClasses")}')
print(f'currentIds remaining: {content.count("currentIds")}')
print(f'Save Assignment remaining: {content.count("Save Assignment")}')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
