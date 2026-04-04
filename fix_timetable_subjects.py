# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

old = 'Timetable  classes={filterClasses(classes)} subjects={teacherType === "subject" && teacherSubject ? subjects.filter(s => s.name === teacherSubject) : subjects}'
new = 'Timetable  classes={filterClasses(classes)} subjects={subjects}'

if old in content:
    content = content.replace(old, new)
    print('Fixed!')
else:
    print('ERROR: not found!')
    idx = content.find('Timetable  classes=')
    print(repr(content[idx:idx+200]))

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
