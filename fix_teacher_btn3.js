const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

const oldBtn = "                    onClick={() => handleDelete(teacher.id)}\r\n                    className=\"text-red-600 hover:underline\"\r\n                  >Delete</button>\r\n                </div>";
const newBtn = "                    onClick={() => handleDelete(teacher.id)}\r\n                    className=\"text-red-600 hover:underline\"\r\n                  >Delete</button>\r\n                  <button onClick={() => printTeacherReport(teacher)} className=\"text-green-600 hover:underline\">Report</button>\r\n                </div>";

if (content.includes(oldBtn)) {
  content = content.replace(oldBtn, newBtn);
  console.log('Teacher report button added!');
} else {
  console.log('ERROR: not found!');
}
fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');
