const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

const oldBtn = `<button onClick={() => setDeleteId(s.id)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: T.dangerBg, fontSize: 12, cursor: "pointer", color: T.danger }}>Delete</button>`;
const newBtn = `<button onClick={() => setDeleteId(s.id)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: T.dangerBg, fontSize: 12, cursor: "pointer", color: T.danger }}>Delete</button>
                        <button onClick={() => printStudentReport(s)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: "#d1fae5", fontSize: 12, cursor: "pointer", color: "#065f46" }}>Report</button>`;

if (content.includes(oldBtn)) {
  content = content.replace(oldBtn, newBtn);
  console.log('Button added!');
} else {
  console.log('ERROR: button not found!');
}

fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');
