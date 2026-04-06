const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

// Fix Timetable signature
content = content.replace(
  'function Timetable({ classes, subjects, timetable, setTimetable }) {\r\n  const [classId,  setClassId]  = useState(classes[0]?.id || 1);',
  'function Timetable({ classes, subjects, timetable, setTimetable, teacherClassIds = null }) {\r\n  const visibleClasses = teacherClassIds ? classes.filter(c => teacherClassIds.includes(c.id)) : classes;\r\n  const [classId,  setClassId]  = useState((teacherClassIds ? classes.filter(c => teacherClassIds.includes(c.id)) : classes)[0]?.id || 1);'
);
console.log('Timetable signature done!');

fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');