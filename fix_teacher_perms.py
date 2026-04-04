# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

# 1. Pass teacherClassId to all relevant components
old_pages = '''          {effectivePage === "teachers"  && userRole === "admin" && <Teachers userRole={userRole} teachers={teachers} setTeachers={setTeachers} classes={classes} subjects={subjects} />}
          {page === "students"   && <Students   students={students} setStudents={setStudents} classes={classes} attendance={attendance} grades={grades} subjects={subjects} exams={exams} examResults={examResults} messages={messages} />}
          {page === "classes"    && <Classes    classes={classes}   setClasses={setClasses}   students={students} />}
          {page === "attendance" && <Attendance students={students} classes={classes} attendance={attendance} setAttendance={setAttendance} />}
          {page === "grades"     && <Grades     students={students} classes={classes} subjects={subjects} grades={grades} setGrades={setGrades} />}
          {page === "timetable"  && <Timetable  classes={classes} subjects={subjects} timetable={timetable} setTimetable={setTimetable} />}
          {page === "messages"   && <Messaging  students={students} classes={classes} messages={messages} setMessages={setMessages} />}
          {page === "exams"      && <ExamScheduler students={students} classes={classes} subjects={subjects} exams={exams} setExams={setExams} examResults={examResults} setExamResults={setExamResults} />}'''

new_pages = '''          {effectivePage === "teachers"  && userRole === "admin" && <Teachers userRole={userRole} teachers={teachers} setTeachers={setTeachers} classes={classes} subjects={subjects} />}
          {page === "students"   && <Students   students={teacherClassId ? students.filter(s => s.classId === teacherClassId) : students} setStudents={setStudents} classes={classes} attendance={attendance} grades={grades} subjects={subjects} exams={exams} examResults={examResults} messages={messages} />}
          {page === "classes"    && <Classes    classes={teacherClassId ? classes.filter(c => c.id === teacherClassId) : classes} setClasses={setClasses} students={students} />}
          {page === "attendance" && <Attendance students={teacherClassId ? students.filter(s => s.classId === teacherClassId) : students} classes={teacherClassId ? classes.filter(c => c.id === teacherClassId) : classes} attendance={attendance} setAttendance={setAttendance} teacherClassId={teacherClassId} />}
          {page === "grades"     && <Grades     students={teacherClassId ? students.filter(s => s.classId === teacherClassId) : students} classes={teacherClassId ? classes.filter(c => c.id === teacherClassId) : classes} subjects={subjects} grades={grades} setGrades={setGrades} teacherClassId={teacherClassId} />}
          {page === "timetable"  && <Timetable  classes={teacherClassId ? classes.filter(c => c.id === teacherClassId) : classes} subjects={subjects} timetable={timetable} setTimetable={setTimetable} />}
          {page === "messages"   && <Messaging  students={teacherClassId ? students.filter(s => s.classId === teacherClassId) : students} classes={teacherClassId ? classes.filter(c => c.id === teacherClassId) : classes} messages={messages} setMessages={setMessages} userRole={userRole} teacherName={teacherName} />}
          {page === "exams"      && <ExamScheduler students={teacherClassId ? students.filter(s => s.classId === teacherClassId) : students} classes={teacherClassId ? classes.filter(c => c.id === teacherClassId) : classes} subjects={subjects} exams={exams} setExams={setExams} examResults={examResults} setExamResults={setExamResults} />}'''

# 2. Add teacher banner in sidebar
old_teacher_name = 'const teacherClassId = auth?.classId || null;   // classId for teacher\n  const teacherName    = auth?.name    || "";'
new_teacher_name = 'const teacherClassId = auth?.classId || null;   // classId for teacher\n  const teacherName    = auth?.name    || "";\n  const teacherClassName = teacherClassId ? classes.find(c => c.id === teacherClassId)?.name || "" : "";'

if old_pages in content:
    content = content.replace(old_pages, new_pages)
    print('Pages fixed!')
else:
    print('ERROR: pages not found!')

if old_teacher_name in content:
    content = content.replace(old_teacher_name, new_teacher_name)
    print('Teacher class name added!')
else:
    print('ERROR: teacher name not found!')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
