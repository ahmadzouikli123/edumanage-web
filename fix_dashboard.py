# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

# Find the end of Dashboard return - just before the closing of the last div
old = '      {/* Quick Actions */}\n      <div style={{ marginTop: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "16px 22px", boxShadow: T.cardShadow, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>\n        <span style={{ fontSize: 13, fontWeight: 600, color: T.textMain, marginRight: 4 }}>⚡ Quick Actions</span>\n        {['

new = '''      {/* ── New Stats Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 16 }}>

        {/* Grade Distribution */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, overflow: "hidden", boxShadow: T.cardShadow }}>
          <div style={{ padding: "18px 22px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: T.textMain }}>Grade Distribution</div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>All students by grade letter</div>
          </div>
          <div style={{ padding: "16px 22px", display: "flex", flexDirection: "column", gap: 10 }}>
            {(() => {
              const dist = { A: 0, B: 0, C: 0, D: 0, F: 0 };
              students.filter(s => s.status === "Active").forEach(s => {
                const subs = (subjects || []).filter(sub => sub.classId === s.classId);
                const scores = subs.map(sub => calcTotal(grades?.[s.id]?.[sub.id])).filter(v => v !== null);
                if (!scores.length) return;
                const gpa = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
                const l = gpa >= 90 ? "A" : gpa >= 80 ? "B" : gpa >= 70 ? "C" : gpa >= 60 ? "D" : "F";
                dist[l]++;
              });
              const total = Object.values(dist).reduce((a, b) => a + b, 0) || 1;
              const colors = { A: "#059669", B: "#2563eb", C: "#d97706", D: "#ea580c", F: "#dc2626" };
              const bgs    = { A: "#d1fae5", B: "#dbeafe", C: "#fef3c7", D: "#ffedd5", F: "#fee2e2" };
              return Object.entries(dist).map(([l, c]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: bgs[l], color: colors[l], fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>{l}</div>
                  <div style={{ flex: 1, height: 8, background: "#f1f5f9", borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: colors[l], borderRadius: 8, width: Math.round((c / total) * 100) + "%", transition: "width .4s" }} />
                  </div>
                  <div style={{ fontSize: 12, color: T.textSub, minWidth: 20 }}>{c}</div>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* At-Risk Students */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, overflow: "hidden", boxShadow: T.cardShadow }}>
          <div style={{ padding: "18px 22px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: T.textMain }}>At-Risk Students</div>
              <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>Attendance below 75%</div>
            </div>
            <span style={{ fontSize: 11, background: "#fee2e2", color: "#dc2626", borderRadius: 20, padding: "2px 10px", fontWeight: 600 }}>
              {(() => {
                const allDates = Object.keys(attendance || {}).sort();
                return students.filter(s => {
                  let p = 0, total = 0;
                  allDates.forEach(d => { const rec = attendance[d]?.[s.id]; if (rec) { total++; if (rec === "present") p++; } });
                  return total > 0 && Math.round((p / total) * 100) < 75;
                }).length;
              })()} students
            </span>
          </div>
          <div style={{ padding: "12px 22px", display: "flex", flexDirection: "column", gap: 8, maxHeight: 200, overflowY: "auto" }}>
            {(() => {
              const allDates = Object.keys(attendance || {}).sort();
              const atRisk = students.filter(s => {
                let p = 0, total = 0;
                allDates.forEach(d => { const rec = attendance[d]?.[s.id]; if (rec) { total++; if (rec === "present") p++; } });
                return total > 0 && Math.round((p / total) * 100) < 75;
              }).map(s => {
                let p = 0, total = 0;
                allDates.forEach(d => { const rec = attendance[d]?.[s.id]; if (rec) { total++; if (rec === "present") p++; } });
                return { ...s, rate: Math.round((p / total) * 100) };
              });
              if (!atRisk.length) return <div style={{ textAlign: "center", color: T.textMuted, fontSize: 13, padding: "20px 0" }}>All students above 75%</div>;
              return atRisk.map(s => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid #f8fafc" }}>
                  <Avatar name={s.name} size={28} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: T.textMain }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: T.textMuted }}>{classes.find(c => c.id === s.classId)?.name}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#dc2626" }}>{s.rate}%</div>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Subject Performance */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, overflow: "hidden", boxShadow: T.cardShadow }}>
          <div style={{ padding: "18px 22px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: T.textMain }}>Subject Performance</div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>Average score per subject</div>
          </div>
          <div style={{ padding: "16px 22px", display: "flex", flexDirection: "column", gap: 10, maxHeight: 200, overflowY: "auto" }}>
            {(() => {
              return (subjects || []).map(sub => {
                const subStudents = students.filter(s => s.classId === sub.classId);
                const scores = subStudents.map(s => calcTotal(grades?.[s.id]?.[sub.id])).filter(v => v !== null);
                if (!scores.length) return null;
                const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
                const color = avg >= 80 ? "#059669" : avg >= 65 ? "#d97706" : "#dc2626";
                return (
                  <div key={sub.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: T.textMain }}>{sub.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color }}>{avg}%</span>
                    </div>
                    <div style={{ height: 6, background: "#f1f5f9", borderRadius: 6, overflow: "hidden" }}>
                      <div style={{ height: "100%", background: color, borderRadius: 6, width: avg + "%", transition: "width .4s" }} />
                    </div>
                  </div>
                );
              }).filter(Boolean);
            })()}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "16px 22px", boxShadow: T.cardShadow, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: T.textMain, marginRight: 4 }}>⚡ Quick Actions</span>
        {['''

if old in content:
    content = content.replace(old, new)
    print('Stats added!')
else:
    print('ERROR: not found!')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
