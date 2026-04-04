# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

# Add monthly report function and button to Dashboard
old_quick = '      {/* Quick Actions */}\n      <div style={{ marginTop: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "16px 22px", boxShadow: T.cardShadow, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>\n        <span style={{ fontSize: 13, fontWeight: 600, color: T.textMain, marginRight: 4 }}>⚡ Quick Actions</span>'

new_quick = '''      {/* Monthly Report Button */}
      <div style={{ marginTop: 16, background: "linear-gradient(135deg,#1e1e3a,#0d9488)", borderRadius: T.radius, padding: "16px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 16px rgba(13,148,136,.3)" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Monthly Student Report</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", marginTop: 3 }}>Generate a comprehensive PDF-ready report for all students</div>
        </div>
        <button onClick={() => {
          const month = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
          const rows = students.filter(s => s.status === "Active").map(s => {
            const cls = classes.find(c => c.id === s.classId);
            const stdSubjs = (subjects || []).filter(sub => sub.classId === s.classId);
            const stdGrades = grades?.[s.id] || {};
            const scores = stdSubjs.map(sub => calcTotal(stdGrades[sub.id])).filter(v => v !== null);
            const gpa = scores.length ? Math.round(scores.reduce((a,b) => a+b,0) / scores.length) : null;
            const letter = gpa !== null ? (gpa>=90?"A":gpa>=80?"B":gpa>=70?"C":gpa>=60?"D":"F") : "-";
            const attDates = Object.keys(attendance || {});
            let present = 0, absent = 0, late = 0, total = 0;
            attDates.forEach(d => { const rec = attendance[d]?.[s.id]; if (rec) { total++; if (rec==="present") present++; else if (rec==="absent") absent++; else if (rec==="late") late++; } });
            const attRate = total ? Math.round((present/total)*100) : 100;
            const subRows = stdSubjs.map(sub => {
              const g = stdGrades[sub.id] || {};
              const t = calcTotal(g);
              return `<tr><td>${sub.name}</td><td>${g.quiz||"-"}</td><td>${g.homework||"-"}</td><td>${g.midterm||"-"}</td><td>${g.final||"-"}</td><td><b>${t !== null ? t : "-"}</b></td></tr>`;
            }).join("");
            return `
              <div class="student-card">
                <div class="student-header">
                  <div>
                    <div class="student-name">${s.name}</div>
                    <div class="student-meta">ID: ${s.sid} &nbsp;|&nbsp; Class: ${cls?.name||"-"} &nbsp;|&nbsp; Gender: ${s.gender||"-"}</div>
                  </div>
                  <div class="gpa-badge" style="background:${gpa>=80?"#d1fae5":gpa>=65?"#fef3c7":"#fee2e2"};color:${gpa>=80?"#065f46":gpa>=65?"#92400e":"#991b1b"}">${gpa !== null ? gpa : "-"} ${letter}</div>
                </div>
                <div class="stats-row">
                  <div class="stat-box">
                    <div class="stat-val" style="color:${attRate>=90?"#059669":attRate>=75?"#d97706":"#dc2626"}">${attRate}%</div>
                    <div class="stat-lbl">Attendance</div>
                  </div>
                  <div class="stat-box">
                    <div class="stat-val">${present}</div>
                    <div class="stat-lbl">Present</div>
                  </div>
                  <div class="stat-box">
                    <div class="stat-val" style="color:#dc2626">${absent}</div>
                    <div class="stat-lbl">Absent</div>
                  </div>
                  <div class="stat-box">
                    <div class="stat-val" style="color:#d97706">${late}</div>
                    <div class="stat-lbl">Late</div>
                  </div>
                  <div class="stat-box">
                    <div class="stat-val">${total}</div>
                    <div class="stat-lbl">Total Days</div>
                  </div>
                </div>
                ${subRows ? `<table><tr><th>Subject</th><th>Quiz</th><th>HW</th><th>Midterm</th><th>Final</th><th>Total</th></tr>${subRows}</table>` : "<p style='color:#94a3b8;font-size:12px'>No grades recorded</p>"}
              </div>`;
          }).join("");
          const win = window.open("", "_blank");
          win.document.write(`<html><head><title>Monthly Report - ${month}</title><style>
            *{box-sizing:border-box;margin:0;padding:0}
            body{font-family:Arial,sans-serif;padding:30px;color:#1e1e3a;background:#f8fafc}
            .header{background:linear-gradient(135deg,#1e1e3a,#0d9488);color:#fff;padding:28px;border-radius:12px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center}
            .header h1{font-size:24px;font-weight:800}.header p{font-size:13px;opacity:.7;margin-top:4px}
            .summary{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
            .sum-card{background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:16px;text-align:center}
            .sum-val{font-size:28px;font-weight:800;color:#0d9488}.sum-lbl{font-size:11px;color:#64748b;margin-top:4px;font-weight:600}
            .student-card{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:16px;page-break-inside:avoid}
            .student-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px}
            .student-name{font-size:17px;font-weight:700;color:#1e1e3a}.student-meta{font-size:12px;color:#64748b;margin-top:4px}
            .gpa-badge{padding:8px 16px;border-radius:8px;font-size:18px;font-weight:800}
            .stats-row{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:14px}
            .stat-box{background:#f8fafc;border-radius:8px;padding:10px;text-align:center}
            .stat-val{font-size:18px;font-weight:700;color:#1e1e3a}.stat-lbl{font-size:10px;color:#94a3b8;font-weight:600;margin-top:2px}
            table{width:100%;border-collapse:collapse}td,th{border:1px solid #e2e8f0;padding:7px 10px;font-size:12px;text-align:left}th{background:#f1f5f9;font-weight:600}
            .footer{text-align:center;margin-top:32px;font-size:11px;color:#94a3b8;padding-top:16px;border-top:1px solid #e2e8f0}
            @media print{button{display:none}.student-card{page-break-inside:avoid}}
          </style></head><body>
            <div class="header">
              <div><h1>Monthly Student Report</h1><p>${month} &nbsp;|&nbsp; Al-Huffath Academy</p></div>
              <button onclick="window.print()" style="padding:10px 24px;background:#fff;color:#0d9488;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer">Print Report</button>
            </div>
            <div class="summary">
              <div class="sum-card"><div class="sum-val">${students.filter(s=>s.status==="Active").length}</div><div class="sum-lbl">ACTIVE STUDENTS</div></div>
              <div class="sum-card"><div class="sum-val">${classes.length}</div><div class="sum-lbl">TOTAL CLASSES</div></div>
              <div class="sum-card"><div class="sum-val">${(() => { const all = students.filter(s=>s.status==="Active").map(s => { const sc = (subjects||[]).filter(sub=>sub.classId===s.classId).map(sub=>calcTotal((grades?.[s.id]||{})[sub.id])).filter(v=>v!==null); return sc.length ? sc.reduce((a,b)=>a+b,0)/sc.length : null; }).filter(v=>v!==null); return all.length ? Math.round(all.reduce((a,b)=>a+b,0)/all.length) : "-"; })()}%</div><div class="sum-lbl">SCHOOL GPA</div></div>
              <div class="sum-card"><div class="sum-val">${month.split(" ")[0]}</div><div class="sum-lbl">REPORT MONTH</div></div>
            </div>
            ${rows}
            <div class="footer">Generated by EduManage &nbsp;|&nbsp; Developed by Eng. Ahmad Zouikli &nbsp;|&nbsp; ${new Date().toLocaleDateString()}</div>
          </body></html>`);
          win.document.close();
        }} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: "#fff", color: "#0d9488", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
          Generate Report
        </button>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "16px 22px", boxShadow: T.cardShadow, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: T.textMain, marginRight: 4 }}>⚡ Quick Actions</span>'''

if old_quick in content:
    content = content.replace(old_quick, new_quick)
    print('Monthly report added!')
else:
    print('ERROR: not found!')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
