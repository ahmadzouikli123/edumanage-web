const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

const oldCode = `    const att = (attendance || []).filter(a => a.studentId === s.id);
    const present = att.filter(a => a.status === 'Present').length;
    const absent  = att.filter(a => a.status === 'Absent').length;
    const late    = att.filter(a => a.status === 'Late').length;
    const excused = att.filter(a => a.status === 'Excused').length;
    const total   = att.length;
    const pct     = total ? Math.round(present / total * 100) : 0;`;

const newCode = `    const attObj = attendance || {};
    let present = 0, absent = 0, late = 0, excused = 0, total = 0;
    Object.values(attObj).forEach(dayRec => {
      const rec = dayRec[s.id];
      if (rec) { total++; if (rec === 'Present') present++; else if (rec === 'Absent') absent++; else if (rec === 'Late') late++; else if (rec === 'Excused') excused++; }
    });
    const pct = total ? Math.round(present / total * 100) : 0;`;

if (content.includes(oldCode)) {
  content = content.replace(oldCode, newCode);
  console.log('Fixed!');
} else {
  console.log('ERROR: not found!');
}
fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');
