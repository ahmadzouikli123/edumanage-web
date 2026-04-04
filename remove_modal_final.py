# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

# Find and remove the block starting with currentIds and containing the modal
import re

# Remove everything between the currentIds line and the closing of the modal
pattern = r'\n\s*const currentIds = \(teacher\.classIds \|\| \[\]\)\.map\(x => parseInt\(x\)\);.*?>\s*\n'
match = re.search(pattern, content, flags=re.DOTALL)
if match:
    print(f'Found block at {match.start()}-{match.end()}')
    # Find a safe end point - look for the next function or component definition
    block_start = match.start()
    # Find "Save Assignment" button and its closing
    save_end = content.find('Save Assignment</button>', block_start)
    if save_end != -1:
        # Find the closing of this entire block
        close_pos = content.find('\n', save_end + 100)
        # Find next line after all the closing braces
        remaining = content[save_end:]
        # Count closing braces/brackets to find end
        close_match = re.search(r'</button>\s*\n\s*</div>\s*\n\s*</div>\s*\n\s*</div>\s*\n\s*\);?\s*\n\s*\}\)\(\)\}\s*\}?', remaining, flags=re.DOTALL)
        if close_match:
            end_pos = save_end + close_match.end()
            removed = content[block_start:end_pos]
            print(f'Removing {len(removed)} chars')
            content = content[:block_start] + content[end_pos:]
            print('Block removed!')
        else:
            print('Close match not found, trying simpler approach')
            # Just remove from currentIds to end of modal pattern
            end_marker = '})()}'
            end_pos = content.find(end_marker, save_end)
            if end_pos != -1:
                content = content[:block_start] + content[end_pos + len(end_marker):]
                print('Removed with simple approach!')
else:
    print('Pattern not found with regex')
    # Manual search
    idx = content.find('const currentIds = (teacher.classIds')
    if idx != -1:
        print(f'Found at index {idx}')
        end_marker = '})()}'
        end_idx = content.find(end_marker, idx)
        if end_idx != -1:
            content = content[:idx] + content[end_idx + len(end_marker):]
            print('Removed manually!')
        else:
            print(repr(content[idx:idx+100]))

print(f'currentIds remaining: {content.count("currentIds")}')
print(f'Save Assignment remaining: {content.count("Save Assignment")}')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
