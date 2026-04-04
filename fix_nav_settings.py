# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

old = '{ id: "teachers", icon: "👤", label: "Teachers" },'
new = '{ id: "teachers", icon: "👤", label: "Teachers" },\n  { id: "settings",  icon: "⚙",  label: "Settings"  },'

if old in content:
    content = content.replace(old, new)
    print('Fixed!')
else:
    print('ERROR: not found!')
    idx = content.find('"teachers"')
    print(repr(content[idx-20:idx+60]))

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
