const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

// Fix: teacher starts on attendance
const oldPage = 'const [page, setPage] = useState("dashboard");';
const newPage = 'const [page, setPage] = useState((() => { try { const a = JSON.parse(localStorage.getItem("edu_auth")||"{}"); return a.role === "teacher" ? "attendance" : "dashboard"; } catch { return "dashboard"; } })());';

if (content.includes(oldPage)) { content = content.replace(oldPage, newPage); console.log('Fixed!'); }
else { console.log('ERROR: not found!'); }

fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');