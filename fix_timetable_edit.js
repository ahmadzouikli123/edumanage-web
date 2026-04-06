const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

// Disable edit for teacher in timetable
const oldOpenEdit = "  const openEdit = (dayIdx, periodId) => {\r\n    const slot = getSlot(dayIdx, periodId);";
const newOpenEdit = "  const openEdit = (dayIdx, periodId) => {\r\n    if (teacherClassIds) return; // teachers cannot edit timetable\r\n    const slot = getSlot(dayIdx, periodId);";

if (content.includes(oldOpenEdit)) { content = content.replace(oldOpenEdit, newOpenEdit); console.log('Fixed!'); }
else { console.log('ERROR: not found!'); }

fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');