# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

# 1. Teacher cannot see Students, Classes, Exams, Teachers pages
old_teacher_pages = 'const TEACHER_PAGES = ["dashboard", "attendance", "grades", "timetable", "messages"];'
new_teacher_pages = 'const TEACHER_PAGES = ["attendance", "grades", "timetable", "messages"];'

# 2. Hide Add Student button from teacher in Students component
old_add_student = '<button onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: T.primary, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>＋ Add Student</button>'
new_add_student = '{userRole !== "teacher" && <button onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: T.primary, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>＋ Add Student</button>}'

# 3. Hide Edit/Delete buttons from teacher in Students table
old_edit_del = '<button onClick={() => openEdit(s)} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${T.border}`, background: "#fff", fontSize: 12, cursor: "pointer", color: "#334155" }}>Edit</button>\n                        <button onClick={() => setDeleteId(s.id)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: T.dangerBg, fontSize: 12, cursor: "pointer", color: T.danger }}>Delete</button>'
new_edit_del = '{userRole !== "teacher" && <button onClick={() => openEdit(s)} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${T.border}`, background: "#fff", fontSize: 12, cursor: "pointer", color: "#334155" }}>Edit</button>}\n                        {userRole !== "teacher" && <button onClick={() => setDeleteId(s.id)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: T.dangerBg, fontSize: 12, cursor: "pointer", color: T.danger }}>Delete</button>}'

# 4. Pass userRole to Students component
old_students_comp = '{page === "students"   && <Students   students={teacherClassId ? students.filter(s => s.classId === teacherClassId) : students} setStudents={setStudents} classes={classes} attendance={attendance} grades={grades} subjects={subjects} exams={exams} examResults={examResults} messages={messages} />'
new_students_comp = '{page === "students"   && <Students   userRole={userRole} students={teacherClassId ? students.filter(s => s.classId === teacherClassId) : students} setStudents={setStudents} classes={classes} attendance={attendance} grades={grades} subjects={subjects} exams={exams} examResults={examResults} messages={messages} />'

# 5. Add userRole param to Students function
old_students_func = 'function Students({ students, setStudents, classes, attendance, grades, subjects, exams, examResults, messages }) {'
new_students_func = 'function Students({ students, setStudents, classes, attendance, grades, subjects, exams, examResults, messages, userRole }) {'

# 6. Hide Promote Year button from teacher
old_promote = '<button onClick={promoteSelected} style={{ padding: "9px 16px", borderRadius: 8, border: "none", background: "#7c3aed", color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Promote Year</button>'
new_promote = '{userRole !== "teacher" && <button onClick={promoteSelected} style={{ padding: "9px 16px", borderRadius: 8, border: "none", background: "#7c3aed", color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Promote Year</button>}'

fixes = [
    (old_teacher_pages, new_teacher_pages, 'Teacher pages restricted!'),
    (old_add_student,   new_add_student,   'Add Student button hidden!'),
    (old_edit_del,      new_edit_del,      'Edit/Delete buttons hidden!'),
    (old_students_comp, new_students_comp, 'userRole passed to Students!'),
    (old_students_func, new_students_func, 'Students function updated!'),
    (old_promote,       new_promote,       'Promote button hidden!'),
]

for old, new, msg in fixes:
    if old in content:
        content = content.replace(old, new)
        print(msg)
    else:
        print(f'ERROR: not found -> {msg}')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
