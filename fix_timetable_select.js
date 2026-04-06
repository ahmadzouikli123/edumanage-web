const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

const oldSelect = "          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}\r\n        </select>\r\n        <div style={{ fontSize: 13, color: T.textSub }}>\r\n          👤 {currentClass?.teacher}";
const newSelect = "          {visibleClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}\r\n        </select>\r\n        <div style={{ fontSize: 13, color: T.textSub }}>\r\n          👤 {currentClass?.teacher}";

if (content.includes(oldSelect)) { content = content.replace(oldSelect, newSelect); console.log('Fixed!'); }
else { console.log('ERROR: not found!'); }

fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');