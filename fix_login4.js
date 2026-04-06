const fs = require('fs');
let content = fs.readFileSync('src/app/school/login/page.tsx', 'utf8');

const idx = content.indexOf('const allTeachers = [...SEED_TEACHERS]');
if (idx !== -1) {
  const endStr = 'x.password === pass)';
  const endIdx = content.indexOf(endStr, idx) + endStr.length;
  const newBlock = "const storedTeachers = (() => { try { return JSON.parse(localStorage.getItem('edu_teachers') || '[]'); } catch { return []; } })()\r\n        const allTeachers = [...SEED_TEACHERS, ...storedTeachers.filter((t: any) => t.username && !SEED_TEACHERS.find((s: any) => s.username === t.username))]\r\n        const t = allTeachers.find((x: any) => x.username === user.toLowerCase().trim() && x.password === pass)";
  content = content.substring(0, idx) + newBlock + content.substring(endIdx);
  console.log('Fixed!');
} else {
  console.log('ERROR: not found!');
}
fs.writeFileSync('src/app/school/login/page.tsx', content, 'utf8');