const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

const oldCode = `  const [selected, setSelected]     = useState(null); // selected message id
  const [compose, setCompose]       = useState(false);`;

const newCode = `  const [selected, setSelected]     = useState(null); // selected message id
  const [compose, setCompose]       = useState(false);
  const [broadcast, setBroadcast]   = useState(false);
  const [bcForm, setBcForm]         = useState({ classId: "all", tag: "general", subject: "", body: "" });`;

if (content.includes(oldCode)) {
  content = content.replace(oldCode, newCode);
  console.log('Step 1: state added!');
} else { console.log('ERROR step 1'); }

const oldSendNew = `  const sendNew = () => {`;
const newSendNew = `  const sendBroadcast = () => {
    if (!bcForm.subject.trim() || !bcForm.body.trim()) return;
    const targets = bcForm.classId === "all"
      ? students
      : students.filter(s => s.classId === parseInt(bcForm.classId));
    const newMsgs = targets.map(s => ({
      id: uid(), studentId: s.id,
      tag: bcForm.tag, subject: bcForm.body.trim(),
      body: bcForm.body.trim(), fromSchool: true,
      timestamp: Date.now(), read: true, replies: [],
    }));
    setMessages(prev => [...newMsgs, ...prev]);
    setBroadcast(false);
    setBcForm({ classId: "all", tag: "general", subject: "", body: "" });
  };

  const sendNew = () => {`;

if (content.includes(oldSendNew)) {
  content = content.replace(oldSendNew, newSendNew);
  console.log('Step 2: sendBroadcast added!');
} else { console.log('ERROR step 2'); }

const oldBtn = `            <button onClick={() => { setCompose(true); setSelected(null); }} style={{
              display: "flex", alignItems: "center", gap: 5, padding: "7px 14px",
              background: T.primary, color: "#fff", border: "none", borderRadius: 8,
              fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
            }}>✏️ Compose</button>`;

const newBtn = `            <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => { setCompose(true); setSelected(null); setBroadcast(false); }} style={{
              display: "flex", alignItems: "center", gap: 5, padding: "7px 14px",
              background: T.primary, color: "#fff", border: "none", borderRadius: 8,
              fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
            }}>✏️ Compose</button>
            <button onClick={() => { setBroadcast(true); setCompose(false); setSelected(null); }} style={{
              display: "flex", alignItems: "center", gap: 5, padding: "7px 14px",
              background: "#7c3aed", color: "#fff", border: "none", borderRadius: 8,
              fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
            }}>📢 Broadcast</button>
            </div>`;

if (content.includes(oldBtn)) {
  content = content.replace(oldBtn, newBtn);
  console.log('Step 3: broadcast button added!');
} else { console.log('ERROR step 3'); }

fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');