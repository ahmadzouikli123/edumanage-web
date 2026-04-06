const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

// Step 1: add broadcast state
const oldState = "  const [compose, setCompose]       = useState(false);\r\n  const [replyText, setReplyText]";
const newState = "  const [compose, setCompose]       = useState(false);\r\n  const [broadcast, setBroadcast]   = useState(false);\r\n  const [bcForm, setBcForm]         = useState({ classId: \"all\", tag: \"general\", subject: \"\", body: \"\" });\r\n  const [replyText, setReplyText]";

if (content.includes(oldState)) {
  content = content.replace(oldState, newState);
  console.log('Step 1: state added!');
} else { console.log('ERROR step 1'); }

// Step 3: add broadcast button
const oldBtn = "}}>✏️ Compose</button>";
const newBtn = "}}>✏️ Compose</button>\r\n            <button onClick={() => { setBroadcast(true); setCompose(false); setSelected(null); }} style={{ display: \"flex\", alignItems: \"center\", gap: 5, padding: \"7px 14px\", background: \"#7c3aed\", color: \"#fff\", border: \"none\", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: \"pointer\", fontFamily: \"inherit\" }}>📢 Broadcast</button>";

if (content.includes(oldBtn)) {
  content = content.replace(oldBtn, newBtn);
  console.log('Step 3: broadcast button added!');
} else { console.log('ERROR step 3'); }

fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');