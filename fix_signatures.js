const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

// Fix Attendance signature
content = content.replace(
  'function Attendance({ students, classes, attendance, setAttendance }) {',
  'function Attendance({ students, classes, attendance, setAttendance, teacherClassIds = null }) {\r\n  const visibleClasses = teacherClassIds ? classes.filter(c => teacherClassIds.includes(c.id)) : classes;\r\n  const visibleStudents = teacherClassIds ? students.filter(s => teacherClassIds.includes(s.classId)) : students;'
);
console.log('Attendance done!');

// Fix Grades signature
content = content.replace(
  'function Grades({ students, classes, subjects, grades, setGrades }) {',
  'function Grades({ students, classes, subjects, grades, setGrades, teacherClassIds = null }) {\r\n  const visibleClasses = teacherClassIds ? classes.filter(c => teacherClassIds.includes(c.id)) : classes;\r\n  const visibleStudents = teacherClassIds ? students.filter(s => teacherClassIds.includes(s.classId)) : students;'
);
console.log('Grades done!');

// Fix Students signature
content = content.replace(
  'function Students({ students, setStudents, classes, attendance, grades, subjects, exams, examResults, messages }) {',
  'function Students({ students, setStudents, classes, attendance, grades, subjects, exams, examResults, messages, teacherClassIds = null, userRole = "admin" }) {\r\n  const visibleStudents = teacherClassIds ? students.filter(s => teacherClassIds.includes(s.classId)) : students;'
);
console.log('Students done!');

fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');