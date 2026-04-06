const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

// Fix 1: teacher starts on attendance not dashboard
const oldDefault = 'const effectivePage = allowedPages && !allowedPages.includes(page)\r\n    ? "attendance"\r\n    : page;';
const newDefault = 'const effectivePage = allowedPages && !allowedPages.includes(page)\r\n    ? TEACHER_PAGES[0]\r\n    : page;\r\n  const initialPage = userRole === "teacher" ? "attendance" : "dashboard";';
if (content.includes(oldDefault)) { content = content.replace(oldDefault, newDefault); console.log('Fix 1 done!'); }
else { console.log('ERROR fix 1'); }

fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');