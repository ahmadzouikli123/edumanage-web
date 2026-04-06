const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

const settingsStart = content.indexOf('function Settings(');
const settingsEnd = content.indexOf('// ─── App Root');

if (settingsStart === -1 || settingsEnd === -1) {
  console.log('ERROR: could not find Settings boundaries');
  process.exit(1);
}

const newSettings = `function Settings({ teachers, setTeachers, students }) {
  const S = { primary: "#0d9488", border: "#e2e8f0", textMain: "#1e293b", textSub: "#64748b", textMuted: "#94a3b8", danger: "#ef4444", dangerBg: "#fee2e2" };
  const [tab, setTab] = useState("school");
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ username: "", password: "" });
  const [saved, setSaved] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("edu_theme") || "light");
  const [schoolForm, setSchoolForm] = useState(() => {
    try {
      const info = JSON.parse(localStorage.getItem("edu_school_info") || "{}");
      return { name: info.name || "Al-Huffath Academy", sub: info.sub || "Ilm | Iman | Hifz", email: info.email || "admin@al-huffath.edu", year: info.year || "2024/2025", adminPassword: "" };
    } catch { return { name: "Al-Huffath Academy", sub: "Ilm | Iman | Hifz", email: "admin@al-huffath.edu", year: "2024/2025", adminPassword: "" }; }
  });

  const showSaved = (msg) => { setSaved(msg); setTimeout(() => setSaved(null), 3000); };

  const saveSchoolInfo = () => {
    const info = { name: schoolForm.name, sub: schoolForm.sub, email: schoolForm.email, year: schoolForm.year };
    localStorage.setItem("edu_school_info", JSON.stringify(info));
    if (schoolForm.adminPassword) localStorage.setItem("edu_admin_password", schoolForm.adminPassword);
    showSaved("School settings saved!");
  };

  const saveTheme = (t) => { setTheme(t); localStorage.setItem("edu_theme", t); showSaved("Theme updated!"); };

  const openEdit = (person) => { setEditId(person.id); setForm({ username: person.username || "", password: person.password || "" }); };

  const saveTeacher = () => {
    setTeachers(prev => prev.map(t => t.id === editId ? { ...t, username: form.username, password: form.password } : t));
    setEditId(null);
    showSaved("Teacher credentials updated!");
  };

  const exportData = () => {
    const keys = ["edu_students","edu_teachers","edu_classes","edu_attendance","edu_grades","edu_messages","edu_exams","edu_exam_results","edu_timetable","edu_subjects"];
    const data = {};
    keys.forEach(k => { try { data[k.replace("edu_","")] = JSON.parse(localStorage.getItem(k) || "null"); } catch {} });
    data.exportedAt = new Date().toISOString();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "edumanage_backup_" + new Date().toISOString().split("T")[0] + ".json";
    a.click(); URL.revokeObjectURL(url);
    showSaved("Data exported successfully!");
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        const map = { students:"edu_students", teachers:"edu_teachers", classes:"edu_classes", attendance:"edu_attendance", grades:"edu_grades", messages:"edu_messages", exams:"edu_exams", exam_results:"edu_exam_results" };
        Object.entries(map).forEach(([k,v]) => { if (data[k]) localStorage.setItem(v, JSON.stringify(data[k])); });
        showSaved("Data imported! Please refresh the page.");
      } catch { showSaved("ERROR: Invalid file format!"); }
    };
    reader.readAsText(file);
  };

  const resetAllData = () => {
    if (!confirmReset) { setConfirmReset(true); return; }
    ["edu_students","edu_teachers","edu_classes","edu_attendance","edu_grades","edu_messages","edu_exams","edu_exam_results","edu_timetable","edu_subjects"].forEach(k => localStorage.removeItem(k));
    setConfirmReset(false);
    showSaved("All data has been reset! Please refresh the page.");
  };

  const tabStyle = (t) => ({ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, background: tab === t ? S.primary : "#f1f5f9", color: tab === t ? "#fff" : S.textSub });
  const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: 8, border: \`1px solid \${S.border}\`, fontSize: 13, fontFamily: "inherit", outline: "none", marginBottom: 12, boxSizing: "border-box" };

  return (
    <div style={{ maxWidth: 820, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {[["school","🏫","School"],["teachers","👨‍🏫","Teachers"],["parents","👨‍👩‍👧","Parents"],["appearance","🎨","Appearance"],["data","📦","Data"]].map(([id,icon,label]) => (
          <button key={id} style={tabStyle(id)} onClick={() => setTab(id)}>{icon} {label}</button>
        ))}
      </div>

      {saved && (
        <div style={{ background: saved.startsWith("ERROR") ? S.dangerBg : "#d1fae5", color: saved.startsWith("ERROR") ? S.danger : "#065f46", padding: "10px 16px", borderRadius: 8, marginBottom: 16, fontSize: 13, fontWeight: 500 }}>
          {saved.startsWith("ERROR") ? "❌" : "✅"} {saved}
        </div>
      )}

      {tab === "school" && (
        <div style={{ background: "#fff", borderRadius: 12, border: \`1px solid \${S.border}\`, padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: S.textMain, marginBottom: 20 }}>🏫 School Information</div>
          {[["School Name","name","text"],["Slogan","sub","text"],["Email","email","email"],["Academic Year","year","text"]].map(([label,key,type]) => (
            <div key={key}>
              <label style={{ fontSize: 12, fontWeight: 600, color: S.textSub, display: "block", marginBottom: 4 }}>{label}</label>
              <input type={type} style={inputStyle} value={schoolForm[key]} onChange={e => setSchoolForm({...schoolForm, [key]: e.target.value})} />
            </div>
          ))}
          <div style={{ borderTop: \`1px solid \${S.border}\`, paddingTop: 16, marginTop: 4 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: S.textMain, marginBottom: 12 }}>🔐 Admin Password</div>
            <label style={{ fontSize: 12, fontWeight: 600, color: S.textSub, display: "block", marginBottom: 4 }}>New Password (leave blank to keep current)</label>
            <input type="password" style={inputStyle} placeholder="••••••••" value={schoolForm.adminPassword} onChange={e => setSchoolForm({...schoolForm, adminPassword: e.target.value})} />
          </div>
          <button onClick={saveSchoolInfo} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: S.primary, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>💾 Save Settings</button>
        </div>
      )}

      {tab === "teachers" && (
        <div style={{ background: "#fff", borderRadius: 12, border: \`1px solid \${S.border}\`, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: \`1px solid \${S.border}\`, fontSize: 14, fontWeight: 600, color: S.textMain }}>👨‍🏫 Teacher Login Credentials</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Name","Subject","Username","Password","Action"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: S.textSub, borderBottom: \`1px solid \${S.border}\` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teachers.map(t => (
                <tr key={t.id} style={{ borderBottom: \`1px solid \${S.border}\` }}>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500 }}>{t.name}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: S.textSub }}>{t.subject}</td>
                  <td style={{ padding: "12px 16px" }}>
                    {editId === t.id
                      ? <input value={form.username} onChange={e => setForm({...form, username: e.target.value})} style={{ padding: "6px 10px", borderRadius: 6, border: \`1px solid \${S.border}\`, fontSize: 13, fontFamily: "inherit", width: 130 }} />
                      : <span style={{ fontSize: 13, fontFamily: "monospace", background: "#f1f5f9", padding: "3px 8px", borderRadius: 4 }}>{t.username || "—"}</span>
                    }
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {editId === t.id
                      ? <input value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={{ padding: "6px 10px", borderRadius: 6, border: \`1px solid \${S.border}\`, fontSize: 13, fontFamily: "inherit", width: 130 }} />
                      : <span style={{ fontSize: 13, fontFamily: "monospace", background: "#f1f5f9", padding: "3px 8px", borderRadius: 4 }}>{t.password ? "••••••••" : "—"}</span>
                    }
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {editId === t.id
                      ? <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={saveTeacher} style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: S.primary, color: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Save</button>
                          <button onClick={() => setEditId(null)} style={{ padding: "6px 14px", borderRadius: 6, border: \`1px solid \${S.border}\`, background: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                        </div>
                      : <button onClick={() => openEdit(t)} style={{ padding: "6px 14px", borderRadius: 6, border: \`1px solid \${S.border}\`, background: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit", color: S.textMain }}>✏️ Edit</button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "parents" && (
        <div style={{ background: "#fff", borderRadius: 12, border: \`1px solid \${S.border}\`, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: \`1px solid \${S.border}\`, fontSize: 14, fontWeight: 600, color: S.textMain }}>👨‍👩‍👧 Parent Access</div>
          <div style={{ padding: "12px 20px", background: "#f0fdf4", borderBottom: \`1px solid \${S.border}\`, fontSize: 13, color: "#065f46" }}>
            ℹ️ Parents log in using their child's <b>Student ID</b> + <b>Phone Number</b>.
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Student Name","Student ID","Phone","Access"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: S.textSub, borderBottom: \`1px solid \${S.border}\` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} style={{ borderBottom: \`1px solid \${S.border}\` }}>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500 }}>{s.name}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontFamily: "monospace" }}>{s.sid}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13 }}>{s.phone || <span style={{ color: S.danger }}>Not set</span>}</td>
                  <td style={{ padding: "12px 16px" }}>
                    {s.phone
                      ? <span style={{ background: "#d1fae5", color: "#065f46", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>✅ Active</span>
                      : <span style={{ background: S.dangerBg, color: S.danger, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>❌ No Access</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "appearance" && (
        <div style={{ background: "#fff", borderRadius: 12, border: \`1px solid \${S.border}\`, padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: S.textMain, marginBottom: 20 }}>🎨 Appearance</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: S.textSub, marginBottom: 12 }}>Theme Mode</div>
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            {[["light","☀️","Light Mode"],["dark","🌙","Dark Mode"]].map(([id,icon,label]) => (
              <div key={id} onClick={() => saveTheme(id)} style={{ flex: 1, padding: 20, borderRadius: 10, border: \`2px solid \${theme === id ? S.primary : S.border}\`, cursor: "pointer", textAlign: "center", background: theme === id ? "#f0fdfa" : "#f8fafc" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: theme === id ? S.primary : S.textMain }}>{label}</div>
                {theme === id && <div style={{ fontSize: 11, color: S.primary, marginTop: 4, fontWeight: 600 }}>✓ Active</div>}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: S.textMuted, fontStyle: "italic" }}>Note: Full dark mode support coming in a future update.</div>
        </div>
      )}

      {tab === "data" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 12, border: \`1px solid \${S.border}\`, padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: S.textMain, marginBottom: 6 }}>📤 Export Data</div>
            <div style={{ fontSize: 13, color: S.textSub, marginBottom: 16 }}>Download all school data as a JSON backup file.</div>
            <button onClick={exportData} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: S.primary, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>📥 Download Backup</button>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, border: \`1px solid \${S.border}\`, padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: S.textMain, marginBottom: 6 }}>📥 Import Data</div>
            <div style={{ fontSize: 13, color: S.textSub, marginBottom: 16 }}>Restore data from a previously exported backup file.</div>
            <label style={{ display: "inline-block", padding: "10px 24px", borderRadius: 8, border: \`1px solid \${S.border}\`, background: "#f8fafc", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: S.textMain }}>
              📂 Choose Backup File
              <input type="file" accept=".json" onChange={importData} style={{ display: "none" }} />
            </label>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, border: \`2px solid \${confirmReset ? S.danger : S.border}\`, padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: S.danger, marginBottom: 6 }}>🗑️ Reset All Data</div>
            <div style={{ fontSize: 13, color: S.textSub, marginBottom: 16 }}>Permanently delete all students, teachers, grades, attendance, and messages. This cannot be undone.</div>
            {confirmReset && (
              <div style={{ background: S.dangerBg, border: \`1px solid \${S.danger}\`, borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: S.danger, fontWeight: 600 }}>
                ⚠️ WARNING: This will permanently delete ALL data! Click the button again to confirm.
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={resetAllData} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: S.danger, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                {confirmReset ? "⚠️ Confirm — Delete Everything" : "🗑️ Reset All Data"}
              </button>
              {confirmReset && <button onClick={() => setConfirmReset(false)} style={{ padding: "10px 24px", borderRadius: 8, border: \`1px solid \${S.border}\`, background: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

`;

const before = content.substring(0, settingsStart);
const after = content.substring(settingsEnd);
content = before + newSettings + after;

fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');
console.log('Settings component replaced successfully!');
