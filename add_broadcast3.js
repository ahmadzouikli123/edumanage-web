const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

const oldCompose = "      {compose && (";
const newBroadcast = `      {broadcast && (
        <div style={{ padding: 24, borderBottom: \`1px solid \${T.border}\` }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#7c3aed", marginBottom: 16 }}>📢 Broadcast Message</div>
          <select value={bcForm.classId} onChange={e => setBcForm({...bcForm, classId: e.target.value})}
            style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: \`1px solid \${T.border}\`, fontSize: 13, fontFamily: "inherit", marginBottom: 10, outline: "none" }}>
            <option value="all">📚 All Students</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input placeholder="Subject" value={bcForm.subject} onChange={e => setBcForm({...bcForm, subject: e.target.value})}
            style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: \`1px solid \${T.border}\`, fontSize: 13, fontFamily: "inherit", marginBottom: 10, outline: "none" }} />
          <textarea placeholder="Message..." value={bcForm.body} onChange={e => setBcForm({...bcForm, body: e.target.value})}
            rows={4} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: \`1px solid \${T.border}\`, fontSize: 13, fontFamily: "inherit", marginBottom: 12, outline: "none", resize: "vertical" }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={sendBroadcast} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "none", background: "#7c3aed", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Send to {bcForm.classId === "all" ? "All Students" : classes.find(c=>c.id===parseInt(bcForm.classId))?.name}</button>
            <button onClick={() => setBroadcast(false)} style={{ padding: "9px 16px", borderRadius: 8, border: \`1px solid \${T.border}\`, background: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          </div>
        </div>
      )}
      {compose && (`;

if (content.includes(oldCompose)) {
  content = content.replace(oldCompose, newBroadcast);
  console.log('Broadcast UI added!');
} else { console.log('ERROR: not found!'); }

fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');