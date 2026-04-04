# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

old = 'const printReport = (s) => {\n    const studentGrades = grades[s.id] || {};\n    const g = Object.entries(studentGrades).map(([subId, scores]) => ({ subjectId: subId, subject: subId, score: Math.round((parseFloat(scores.quiz||0)*0.15)+(parseFloat(scores.homework||0)*0.15)+(parseFloat(scores.midterm||0)*0.30)+(parseFloat(scores.final||0)*0.40)) }));\n    const att = Object.entries(attendance || {}).map(([d, r]) => ({ d, st: r[s.id] || "-" }));\n    const present = att.filter(a => a.st === "present").length;\n    const total = att.filter(a => a.st !== "-").length;\n    const pct = total ? Math.round((present / total) * 100) + "%" : "N/A";\n    const win = window.open("", "_blank");\n    win.document.write("<html><head><title>Report</title><style>body{font-family:Arial;padding:30px}h1{color:#1e40af}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ddd;padding:8px}th{background:#f1f5f9}@media print{button{display:none}}</style></head><body><h1>Student Report</h1><p><b>Name:</b> " + s.name + " | <b>ID:</b> " + s.sid + " | <b>Class:</b> " + cls(s.classId) + " | <b>Gender:</b> " + (s.gender||"-") + "</p><p><b>Phone:</b> " + (s.phone||"-") + " | <b>Status:</b> " + s.status + "</p><h2>Attendance: " + pct + " (" + present + "/" + total + " days)</h2><h2>Grades</h2><table><tr><th>Subject</th><th>Score</th></tr>" + g.map(x => "<tr><td>" + (x.subject||x.subjectId||"-") + "</td><td>" + x.score + "</td></tr>").join("") + "</table><br><button onclick=\'window.print()\'>Print</button></'

new = '''const printReport = (s) => {
    const studentGrades = grades[s.id] || {};
    const clsName = cls(s.classId);
    const stdSubjects = (subjects || []).filter(sub => sub.classId === s.classId);
    const rows = stdSubjects.map(sub => {
      const g = studentGrades[sub.id] || {};
      const quiz = parseFloat(g.quiz||0), hw = parseFloat(g.homework||0), mid = parseFloat(g.midterm||0), fin = parseFloat(g.final||0);
      const total = Math.round(quiz*0.15 + hw*0.15 + mid*0.30 + fin*0.40);
      const letter = total>=90?"A":total>=80?"B":total>=70?"C":total>=60?"D":"F";
      return "<tr><td>" + sub.name + "</td><td>" + quiz + "/100</td><td>" + hw + "/100</td><td>" + mid + "/100</td><td>" + fin + "/100</td><td><b>" + total + "</b></td><td><b>" + letter + "</b></td></tr>";
    }).join("");
    const att = Object.entries(attendance || {}).map(([d, r]) => ({ d, st: r[s.id] || "-" }));
    const present = att.filter(a => a.st === "present").length;
    const absent  = att.filter(a => a.st === "absent").length;
    const late    = att.filter(a => a.st === "late").length;
    const excused = att.filter(a => a.st === "excused").length;
    const total   = att.filter(a => a.st !== "-").length;
    const pct     = total ? Math.round((present / total) * 100) : 100;
    const allScores = stdSubjects.map(sub => {
      const g = studentGrades[sub.id] || {};
      return Math.round(parseFloat(g.quiz||0)*0.15 + parseFloat(g.homework||0)*0.15 + parseFloat(g.midterm||0)*0.30 + parseFloat(g.final||0)*0.40);
    }).filter(x => x > 0);
    const gpa = allScores.length ? Math.round(allScores.reduce((a,b)=>a+b,0)/allScores.length) : null;
    const gpaLetter = gpa !== null ? (gpa>=90?"A":gpa>=80?"B":gpa>=70?"C":gpa>=60?"D":"F") : "-";
    const win = window.open("", "_blank");
    win.document.write(
      "<html><head><title>Report - " + s.name + "</title>" +
      "<style>body{font-family:Arial;padding:30px;color:#1e1e3a}h1{color:#0d9488;border-bottom:2px solid #0d9488;padding-bottom:8px}h2{color:#1e1e3a;margin-top:24px}table{width:100%;border-collapse:collapse;margin-top:10px}td,th{border:1px solid #e2e8f0;padding:8px 12px;text-align:left}th{background:#f1f5f9;font-weight:600}.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}.info-item{background:#f8fafc;padding:10px;border-radius:8px}.info-label{font-size:11px;color:#64748b;font-weight:600}.info-value{font-size:14px;color:#1e1e3a;margin-top:2px}@media print{button{display:none}}</style>" +
      "</head><body>" +
      "<h1>Student Comprehensive Report</h1>" +
      "<div class=\\"info-grid\\">" +
      "<div class=\\"info-item\\"><div class=\\"info-label\\">FULL NAME</div><div class=\\"info-value\\">" + s.name + "</div></div>" +
      "<div class=\\"info-item\\"><div class=\\"info-label\\">STUDENT ID</div><div class=\\"info-value\\">" + s.sid + "</div></div>" +
      "<div class=\\"info-item\\"><div class=\\"info-label\\">CLASS</div><div class=\\"info-value\\">" + clsName + "</div></div>" +
      "<div class=\\"info-item\\"><div class=\\"info-label\\">GENDER</div><div class=\\"info-value\\">" + (s.gender||"-") + "</div></div>" +
      "<div class=\\"info-item\\"><div class=\\"info-label\\">PHONE</div><div class=\\"info-value\\">" + (s.phone||"-") + "</div></div>" +
      "<div class=\\"info-item\\"><div class=\\"info-label\\">STATUS</div><div class=\\"info-value\\">" + s.status + "</div></div>" +
      "</div>" +
      "<h2>Attendance Summary</h2>" +
      "<table><tr><th>Present</th><th>Absent</th><th>Late</th><th>Excused</th><th>Total</th><th>Rate</th></tr>" +
      "<tr><td>" + present + "</td><td>" + absent + "</td><td>" + late + "</td><td>" + excused + "</td><td>" + total + "</td><td><b>" + pct + "%</b></td></tr></table>" +
      "<h2>Academic Performance (GPA: " + (gpa||"-") + " - " + gpaLetter + ")</h2>" +
      "<table><tr><th>Subject</th><th>Quiz</th><th>Homework</th><th>Midterm</th><th>Final</th><th>Total</th><th>Grade</th></tr>" + rows + "</table>" +
      "<br><button onclick=\\"window.print()\\" style=\\"padding:10px 24px;background:#0d9488;color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer\\">Print Report</button>" +
      "<p style=\\"margin-top:40px;font-size:11px;color:#94a3b8;text-align:center\\">Generated by EduManage | Developed by Eng. Ahmad Zouikli | " + new Date().toLocaleDateString() + "</p>" +
      "</body></html>"
    );
    win.document.close();
  };//'''

if old in content:
    content = content.replace(old, new)
    print('printReport updated!')
else:
    print('ERROR: pattern not found!')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
