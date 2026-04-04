# -*- coding: utf-8 -*-
import re
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

idx = content.find('function ProfileCard')
end = content.find('\nfunction ', idx+1)
profile_section = content[idx:end]

print(f'assignModal in ProfileCard: {profile_section.count("assignModal")}')

# Remove the modal block from ProfileCard
cleaned = re.sub(r'\n\s*\{/\* Assign Classes Modal \*/\}.*?\}\)\(\)\)\}', '', profile_section, flags=re.DOTALL)

if cleaned != profile_section:
    content = content[:idx] + cleaned + content[end:]
    print('Removed from ProfileCard!')
else:
    # Manual removal
    start = profile_section.find('\n\n      {/* Assign Classes Modal */}')
    if start == -1:
        start = profile_section.find('\n      {/* Assign Classes Modal */}')
    end2 = profile_section.find('})()}', start) + len('})()}')
    if start != -1:
        cleaned = profile_section[:start] + profile_section[end2:]
        content = content[:idx] + cleaned + content[end:]
        print('Manually removed!')
    else:
        # Find assignModal start
        am_idx = profile_section.find('assignModal')
        print(repr(profile_section[am_idx-200:am_idx+100]))

# Verify
idx2 = content.find('function ProfileCard')
end2 = content.find('\nfunction ', idx2+1)
print(f'After fix - assignModal in ProfileCard: {content[idx2:end2].count("assignModal")}')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
