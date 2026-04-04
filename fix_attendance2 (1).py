# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

old = '''    const records = classStudents.map(s => ({
      student_id: s.id,
      date: date,
      status: draft[s.id] || "present",
      class_id: classId,
    }));'''

new = '''    const records = classStudents.map(s => ({
      student_id: s.id,
      date: date,
      status: draft[s.id] || "present",
    }));'''

if old in content:
    content = content.replace(old, new)
    print('class_id removed!')
else:
    print('ERROR: not found!')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
