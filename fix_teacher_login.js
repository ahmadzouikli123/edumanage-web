const fs = require('fs');
let content = fs.readFileSync('src/app/school/login/page.tsx', 'utf8');

const oldLine = "        const teachers = load(\"edu_teachers\", SEED_TEACHERS)\r\n        const t = teachers.find((x: any) => x.username === user.toLowerCase().trim() && x.password === pass)";
const newLine = "        const storedTeachers = load(\"edu_teachers\", SEED_TEACHERS)\r\n        const allTeachers = [...SEED_TEACHERS, ...storedTeachers.filter((t: any) => !SEED_TEACHERS.find((s: any) => s.username === t.username))]\r\n        const t = allTeachers.find((x: any) => x.username === user.toLowerCase().trim() && x.password === pass)";

if (content.includes(oldLine)) { content = content.replace(oldLine, newLine); console.log('Fixed!'); }
else { console.log('ERROR: not found!'); }

fs.writeFileSync('src/app/school/login/page.tsx', content, 'utf8');