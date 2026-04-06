const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

const oldTeachers = '{page === "teachers"   && <Teachers   userRole={userRole}';
const newTeachers = '{page === "teachers"   && <Teachers   userRole={userRole} classes={classes}';

if (content.includes(oldTeachers)) { content = content.replace(oldTeachers, newTeachers); console.log('Fixed!'); }
else { console.log('ERROR: not found!'); }

fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');