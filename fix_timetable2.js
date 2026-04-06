const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

const oldTimetable = '<Timetable  classes={classes} subjects={subjects} timetable={timetable} setTimetable={setTimetable} />';
const newTimetable = '<Timetable  classes={classes} subjects={subjects} timetable={timetable} setTimetable={setTimetable} teacherClassIds={teacherClassIds} />';

if (content.includes(oldTimetable)) { content = content.replace(oldTimetable, newTimetable); console.log('Prop passed!'); }
else { console.log('ERROR: not found!'); }

fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');