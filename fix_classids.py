# -*- coding: utf-8 -*-
content = open('src/app/school/login/page.tsx', encoding='utf-8').read()

old = '''          const t = data[0];
          // Determine teacher type: subject teacher (has subject) or class teacher (has class_ids)
          const teacherType = t.subject ? "subject" : "class";
          save("edu_auth", {
            role: "teacher",
            name: t.name,
            classId: t.class_ids?.[0] || null,
            classIds: t.class_ids || [],
            subject: t.subject || null,
            teacherType,
          });'''

new = '''          const t = data[0];
          // Parse class_ids - convert strings to numbers
          const rawIds = t.class_ids || [];
          const classIds = rawIds.map((x: any) => parseInt(x)).filter((x: number) => !isNaN(x));
          // subject teacher = has subject but teaches multiple classes
          // class teacher = tied to specific class(es) without a specific subject
          const teacherType = t.subject && t.subject !== "" ? "subject" : "class";
          save("edu_auth", {
            role: "teacher",
            name: t.name,
            classId: classIds[0] || null,
            classIds: classIds,
            subject: t.subject || null,
            teacherType,
          });'''

if old in content:
    content = content.replace(old, new)
    print('Fixed!')
else:
    print('ERROR: not found!')

open('src/app/school/login/page.tsx', 'w', encoding='utf-8').write(content)
print('Done!')
