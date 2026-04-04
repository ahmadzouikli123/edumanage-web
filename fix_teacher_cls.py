# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

old = '  const teacherClassName = teacherClassId ? classes.find(c => c.id === teacherClassId)?.name || "" : "";\n'
new = ''

if old in content:
    content = content.replace(old, new)
    print('Fixed!')
else:
    print('ERROR: not found!')
    idx = content.find('teacherClassName')
    if idx != -1:
        print(repr(content[idx-10:idx+100]))

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
