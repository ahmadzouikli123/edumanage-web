# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

# Remove the bad }; // that was added at the end of printReport
old = '    win.document.close();\n  };//'
new = '    win.document.close();\n  };'

if old in content:
    content = content.replace(old, new)
    print('Syntax fixed!')
else:
    print('ERROR: pattern not found!')
    # Try to find it
    idx = content.find('win.document.close')
    print(repr(content[idx:idx+50]))

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
