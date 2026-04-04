# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

# Fix auth reading to support new fields
old_auth = '''  const userRole   = auth?.role     || "admin";
  const teacherClassId = auth?.classId || null;   // classId for teacher
  const teacherName    = auth?.name    || "";'''

new_auth = '''  const userRole       = auth?.role       || "admin";
  const teacherClassId = auth?.classId   || null;
  const teacherClassIds= auth?.classIds  || (teacherClassId ? [teacherClassId] : []);
  const teacherSubject = auth?.subject   || null;
  const teacherType    = auth?.teacherType || "class"; // "class" | "subject"
  const teacherName    = auth?.name      || "";

  // Filter helpers based on teacher type
  const filterStudents = (all) => {
    if (userRole !== "teacher") return all;
    if (teacherType === "subject") return all; // subject teacher sees all students (filtered by subject in Grades)
    return teacherClassIds.length ? all.filter(s => teacherClassIds.includes(s.classId)) : all;
  };
  const filterClasses = (all) => {
    if (userRole !== "teacher") return all;
    if (teacherType === "subject") return all; // subject teacher sees all classes
    return teacherClassIds.length ? all.filter(c => teacherClassIds.includes(c.id)) : all;
  };'''

# Fix component rendering to use new filter helpers
old_pages = '''{page === "students"   && <Students   userRole={userRole} students={teacherClassId ? students.filter(s => s.classId === teacherClassId) : students} setStudents={setStudents} classes={classes} attendance={attendance} grades={grades} subjects={subjects} exams={exams} examResults={examResults} messages={messages} />}
          {page === "classes"    && <Classes    classes={teacherClassId ? classes.filter(c => c.id === teacherClassId) : classes} setClasses={setClasses} students={students} />}
          {page === "attendance" && <Attendance students={teacherClassId ? students.filter(s => s.classId === teacherClassId) : students} classes={teacherClassId ? classes.filter(c => c.id === teacherClassId) : classes} attendance={attendance} setAttendance={setAttendance} teacherClassId={teacherClassId} />}
          {page === "grades"     && <Grades     students={teacherClassId ? students.filter(s => s.classId === teacherClassId) : students} classes={teacherClassId ? classes.filter(c => c.id === teacherClassId) : classes} subjects={subjects} grades={grades} setGrades={setGrades} teacherClassId={teacherClassId} />}
          {page === "timetable"  && <Timetable  classes={teacherClassId ? classes.filter(c => c.id === teacherClassId) : classes} subjects={subjects} timetable={timetable} setTimetable={setTimetable} />}
          {page === "messages"   && <Messaging  students={teacherClassId ? students.filter(s => s.classId === teacherClassId) : students} classes={teacherClassId ? classes.filter(c => c.id === teacherClassId) : classes} messages={messages} setMessages={setMessages} userRole={userRole} teacherName={teacherName} />}
          {page === "exams"      && <ExamScheduler students={teacherClassId ? students.filter(s => s.classId === teacherClassId) : students} classes={teacherClassId ? classes.filter(c => c.id === teacherClassId) : classes} subjects={subjects} exams={exams} setExams={setExams} examResults={examResults} setExamResults={setExamResults} />}'''

new_pages = '''{page === "students"   && <Students   userRole={userRole} students={filterStudents(students)} setStudents={setStudents} classes={classes} attendance={attendance} grades={grades} subjects={subjects} exams={exams} examResults={examResults} messages={messages} />}
          {page === "classes"    && <Classes    classes={filterClasses(classes)} setClasses={setClasses} students={students} />}
          {page === "attendance" && <Attendance students={filterStudents(students)} classes={filterClasses(classes)} attendance={attendance} setAttendance={setAttendance} teacherClassId={teacherClassId} />}
          {page === "grades"     && <Grades     students={filterStudents(students)} classes={filterClasses(classes)} subjects={teacherType === "subject" && teacherSubject ? subjects.filter(s => s.name === teacherSubject) : subjects} grades={grades} setGrades={setGrades} teacherClassId={teacherClassId} teacherSubject={teacherSubject} />}
          {page === "timetable"  && <Timetable  classes={filterClasses(classes)} subjects={teacherType === "subject" && teacherSubject ? subjects.filter(s => s.name === teacherSubject) : subjects} timetable={timetable} setTimetable={setTimetable} />}
          {page === "messages"   && <Messaging  students={filterStudents(students)} classes={filterClasses(classes)} messages={messages} setMessages={setMessages} userRole={userRole} teacherName={teacherName} />}
          {page === "exams"      && <ExamScheduler students={filterStudents(students)} classes={filterClasses(classes)} subjects={teacherType === "subject" && teacherSubject ? subjects.filter(s => s.name === teacherSubject) : subjects} exams={exams} setExams={setExams} examResults={examResults} setExamResults={setExamResults} />}'''

if old_auth in content:
    content = content.replace(old_auth, new_auth)
    print('Auth updated!')
else:
    print('ERROR: auth not found!')

if old_pages in content:
    content = content.replace(old_pages, new_pages)
    print('Pages updated!')
else:
    print('ERROR: pages not found!')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
