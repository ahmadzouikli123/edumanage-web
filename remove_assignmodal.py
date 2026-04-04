# -*- coding: utf-8 -*-
import re
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

print(f'Total assignModal occurrences: {content.count("assignModal")}')

# Remove useState for assignModal
content = re.sub(r'\n\s*const \[assignModal, setAssignModal\] = useState\(null\);[^\n]*\n', '\n', content)

# Remove the full modal JSX block
content = re.sub(r'\n\s*\{/\* Assign Classes Modal \*/\}.*?\}\)\(\)\)\}', '', content, flags=re.DOTALL)

# Remove any remaining assignModal references
content = re.sub(r'\s*onClick=\{[^}]*setAssignModal[^}]*\}', '', content)
content = re.sub(r'[^\n]*assignModal[^\n]*\n', '\n', content)

print(f'After cleanup: {content.count("assignModal")} occurrences')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
