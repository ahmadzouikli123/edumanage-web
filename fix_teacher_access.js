const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

// Get teacher's classIds from auth
const oldTeacherClassId = "  const teacherClassId = auth?.classId || null;   // classId for teacher";
const newTeacherClassId = "  const teacherClassId = auth?.classId || null;   // classId for teacher\r\n  const teacherClassIds = auth?.classIds || (teacherClassId ? [teacherClassId] : null); // all classIds for teacher";

if (content.includes(oldTeacherClassId)) { content = content.replace(oldTeacherClassId, newTeacherClassId); console.log('Step 1: done!'); }
else { console.log('ERROR step 1'); }

// Pass teacherClassIds to Attendance, Grades, Students
const oldAttendance = '{page === "attendance" && <Attendance students={students} classes={classes} attendance={attendance} setAttendance={setAttendance} />';
const newAttendance = '{page === "attendance" && <Attendance students={students} classes={classes} attendance={attendance} setAttendance={setAttendance} teacherClassIds={teacherClassIds} />';
if (content.includes(oldAttendance)) { content = content.replace(oldAttendance, newAttendance); console.log('Step 2: attendance done!'); }
else { console.log('ERROR step 2'); }

const oldGrades = '<Grades     students={students} classes={classes} subjects={subjects} grades={grades} setGrades={setGrades} />';
const newGrades = '<Grades     students={students} classes={classes} subjects={subjects} grades={grades} setGrades={setGrades} teacherClassIds={teacherClassIds} />';
if (content.includes(oldGrades)) { content = content.replace(oldGrades, newGrades); console.log('Step 3: grades done!'); }
else { console.log('ERROR step 3'); }

const oldStudents = '<Students   students={students} setStudents={setStudents} classes={classes} attendance={attendance} grades={grades} subjects={subjects} exams={exams} examResults={examResults} messages={messages} />';
const newStudents = '<Students   students={students} setStudents={setStudents} classes={classes} attendance={attendance} grades={grades} subjects={subjects} exams={exams} examResults={examResults} messages={messages} teacherClassIds={teacherClassIds} userRole={userRole} />';
if (content.includes(oldStudents)) { content = content.replace(oldStudents, newStudents); console.log('Step 4: students done!'); }
else { console.log('ERROR step 4'); }

fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');