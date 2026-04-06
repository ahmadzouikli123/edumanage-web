const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

// Step 1: remove dashboard from teacher pages, start with attendance
const oldPages = 'const TEACHER_PAGES = ["dashboard", "attendance", "grades", "timetable", "messages"];';
const newPages = 'const TEACHER_PAGES = ["attendance", "grades", "timetable", "messages"];';
if (content.includes(oldPages)) { content = content.replace(oldPages, newPages); console.log('Step 1: done!'); }
else { console.log('ERROR step 1'); }

// Step 2: redirect teacher to attendance instead of dashboard
const oldDefault = 'const effectivePage = allowedPages && !allowedPages.includes(page)\r\n    ? "dashboard"\r\n    : page;';
const newDefault = 'const effectivePage = allowedPages && !allowedPages.includes(page)\r\n    ? "attendance"\r\n    : page;';
if (content.includes(oldDefault)) { content = content.replace(oldDefault, newDefault); console.log('Step 2: done!'); }
else { console.log('ERROR step 2'); }

fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');