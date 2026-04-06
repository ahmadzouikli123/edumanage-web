const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

const settingsComponent = `
// ─── Settings ────────────────────────────────────────────────────────────────
function Settings({ teachers, setTeachers, students }) {
  const [tab, setTab] = React.useState("teachers");
  const [editId, setEditId] = React.useState(null);
  const [form, setForm] = React.useState({ username: "", password: "" });
  const [saved, setSaved] = React.useState(null);

  const openEdit = (person) => {
    setEditId(person.id);
    setForm({ username: person.username || "", password: person.password || "" });
  };

  const saveTeacher = () => {
    setTeachers(prev => prev.map(t => t.id === editId ? { ...t, username: form.username, password: form.password } : t));
    setEditId(null);
    setSaved("Teacher credentials updated!");
    setTimeout(() => setSaved(null), 3000);
  };

  const tabStyle = (t) => ({
    padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer",
    fontFamily: "inherit", fontSize: 13, fontWeight: 600,
    background: tab === t ? T.primary : "#f1f5f9",
    color: tab === t ? "#fff" : T.textSub,
  });

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <button style={tabStyle("teachers")} onClick={() => setTab("teachers")}>👨‍🏫 Teacher Accounts</button>
        <button style={tabStyle("parents")} onClick={() => setTab("parents")}>👨‍👩‍👧 Parent Access</button>
      </div>

      {saved && (
        <div style={{ background: "#d1fae5", color: "#065f46", padding: "10px 16px", borderRadius: 8, marginBottom: 16, fontSize: 13, fontWeight: 500 }}>
          ✅ {saved}
        </div>
      )}

      {tab === "teachers" && (
        <div style={{ background: "#fff", borderRadius: 12, border: \`1px solid \${T.border}\`, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: \`1px solid \${T.border}\`, fontSize: 14, fontWeight: 600, color: T.textMain }}>
            Teacher Login Credentials
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Name", "Subject", "Username", "Password", "Action"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: T.textSub, borderBottom: \`1px solid \${T.border}\` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teachers.map(t => (
                <tr key={t.id} style={{ borderBottom: \`1px solid \${T.border}\` }}>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500 }}>{t.name}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: T.textSub }}>{t.subject}</td>
                  <td style={{ padding: "12px 16px" }}>
                    {editId === t.id ? (
                      <input value={form.username} onChange={e => setForm({...form, username: e.target.value})}
                        style={{ padding: "6px 10px", borderRadius: 6, border: \`1px solid \${T.border}\`, fontSize: 13, fontFamily: "inherit", width: 140 }} />
                    ) : (
                      <span style={{ fontSize: 13, fontFamily: "monospace", background: "#f1f5f9", padding: "3px 8px", borderRadius: 4 }}>{t.username || "—"}</span>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {editId === t.id ? (
                      <input value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                        style={{ padding: "6px 10px", borderRadius: 6, border: \`1px solid \${T.border}\`, fontSize: 13, fontFamily: "inherit", width: 140 }} />
                    ) : (
                      <span style={{ fontSize: 13, fontFamily: "monospace", background: "#f1f5f9", padding: "3px 8px", borderRadius: 4 }}>{t.password ? "••••••••" : "—"}</span>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {editId === t.id ? (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={saveTeacher} style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: T.primary, color: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Save</button>
                        <button onClick={() => setEditId(null)} style={{ padding: "6px 14px", borderRadius: 6, border: \`1px solid \${T.border}\`, background: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => openEdit(t)} style={{ padding: "6px 14px", borderRadius: 6, border: \`1px solid \${T.border}\`, background: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit", color: T.textMain }}>✏️ Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "parents" && (
        <div style={{ background: "#fff", borderRadius: 12, border: \`1px solid \${T.border}\`, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: \`1px solid \${T.border}\`, fontSize: 14, fontWeight: 600, color: T.textMain }}>
            Parent Access — Login by Student ID + Phone
          </div>
          <div style={{ padding: 20, fontSize: 13, color: T.textSub, lineHeight: 1.8 }}>
            <p style={{ marginBottom: 12 }}>Parents log in using their child's <b>Student ID</b> and <b>Phone Number</b>.</p>
            <p style={{ marginBottom: 16 }}>To grant access, make sure each student has a phone number set.</p>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Student Name", "Student ID", "Phone", "Access Status"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: T.textSub, borderBottom: \`1px solid \${T.border}\` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} style={{ borderBottom: \`1px solid \${T.border}\` }}>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500 }}>{s.name}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontFamily: "monospace", background: "#f8fafc" }}>{s.sid}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13 }}>{s.phone || <span style={{ color: "#ef4444" }}>Not set</span>}</td>
                  <td style={{ padding: "12px 16px" }}>
                    {s.phone ? (
                      <span style={{ background: "#d1fae5", color: "#065f46", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>✅ Active</span>
                    ) : (
                      <span style={{ background: "#fee2e2", color: "#991b1b", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>❌ No Access</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
`;

// Add before LogoutButton
const oldLogout = '// ─── App Root';
if (content.includes(oldLogout)) {
  content = content.replace(oldLogout, settingsComponent + '\n// ─── App Root');
  console.log('Settings component added!');
} else {
  console.log('ERROR: anchor not found!');
}

// Add to page render
const oldRender = '{page === "exams"';
const newRender = '{page === "settings"  && userRole === "admin" && <Settings teachers={teachers} setTeachers={setTeachers} students={students} />}\n          {page === "exams"';
if (content.includes(oldRender)) {
  content = content.replace(oldRender, newRender);
  console.log('Settings render added!');
} else {
  console.log('ERROR: render not found!');
}

// Hide settings from teacher nav
const oldTeacherPages = 'const TEACHER_PAGES = ["attendance", "grades", "timetable", "messages"];';
// already correct - settings not included

fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');
