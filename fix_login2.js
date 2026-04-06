const fs = require('fs');
let content = fs.readFileSync('src/app/school/login/page.tsx', 'utf8');

// Find and replace using index
const searchStr = 'const teachers = load("edu_teachers", SEED_TEACHERS)';
const idx = content.indexOf(searchStr);
if (idx !== -1) {
  const endStr = 'x.password === pass)';
  const endIdx = content.indexOf(endStr, idx) + endStr.length;
  const oldBlock = content.substring(idx, endIdx);
  const newBlock = 'const allTeachers = [...SEED_TEACHERS]\n        const t = allTeachers.find((x: any) => x.username === user.toLowerCase().trim() && x.password === pass)';
  content = content.substring(0, idx) + newBlock + content.substring(endIdx);
  console.log('Fixed!');
} else {
  console.log('ERROR: not found!');
}

fs.writeFileSync('src/app/school/login/page.tsx', content, 'utf8');