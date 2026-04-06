const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

// Step 1: add settings to nav
const oldNav = '  { id: "exams",      icon: "📋", label: "Exams"      },\r\n];';
const newNav = '  { id: "exams",      icon: "📋", label: "Exams"      },\r\n  { id: "settings",   icon: "⚙️", label: "Settings"   },\r\n];';
if (content.includes(oldNav)) { content = content.replace(oldNav, newNav); console.log('Step 1: nav done!'); }
else { console.log('ERROR step 1'); }

fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');