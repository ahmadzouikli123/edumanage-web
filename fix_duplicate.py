# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

old = 'ody></html>"\n    );\n    win.document.close();\n  };body></html>");\n    win.document.close();\n  };'
new = 'ody></html>"\n    );\n    win.document.close();\n  };'

if old in content:
    content = content.replace(old, new)
    print('Duplicate fixed!')
else:
    print('ERROR: not found, trying another pattern...')
    idx = content.find('win.document.close')
    print(repr(content[idx-200:idx+100]))

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
