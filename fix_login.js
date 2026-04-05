const fs = require('fs');
let content = fs.readFileSync('src/app/school/login/page.tsx', 'utf8');
const oldLine = `save("edu_auth", {role:"teacher", name:t.name, classIds:t.class_ids, classId:t.class_ids[0]})`;
const newLine = `save("edu_auth", {role:"teacher", name:t.name, classIds:t.class_ids||[], classId:(t.class_ids||[])[0]})`;
if (content.includes(oldLine)) {
  content = content.replace(oldLine, newLine);
  console.log('Fixed!');
} else {
  console.log('ERROR: not found!');
}
fs.writeFileSync('src/app/school/login/page.tsx', content, 'utf8');