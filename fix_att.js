const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

const oldLine = "    const att = attendance.filter(a => a.studentId === s.id);";
const newLine = "    const att = (attendance || []).filter(a => a.studentId === s.id);";

if (content.includes(oldLine)) {
  content = content.replace(oldLine, newLine);
  console.log('Fixed!');
} else {
  console.log('ERROR: not found!');
}
fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');
