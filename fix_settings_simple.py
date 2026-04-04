# -*- coding: utf-8 -*-
import re
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

# Remove the entire Settings function and replace with simple one
old_settings = re.search(r'\nfunction Settings\(\).*?^}', content, flags=re.DOTALL | re.MULTILINE)

if old_settings:
    print(f'Found Settings at {old_settings.start()}-{old_settings.end()}')
    new_settings = '''
function Settings() {
  const [saved, setSaved] = useState(false);
  const [schoolName, setSchoolName] = useState(() => {
    try { return JSON.parse(localStorage.getItem("school_settings") || "{}").schoolName || "Al-Huffath Academy"; } catch { return "Al-Huffath Academy"; }
  });
  const [year, setYear] = useState(() => {
    try { return JSON.parse(localStorage.getItem("school_settings") || "{}").academicYear || "2025-2026"; } catch { return "2025-2026"; }
  });

  const save = () => {
    localStorage.setItem("school_settings", JSON.stringify({ schoolName, academicYear: year }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 8 }}>
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: 28, marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#1e1e3a", marginBottom: 20 }}>School Configuration</div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>School Name</label>
          <input value={schoolName} onChange={e => setSchoolName(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>Academic Year</label>
          <input value={year} onChange={e => setYear(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
        </div>
        <button onClick={save} style={{ padding: "10px 28px", borderRadius: 8, border: "none", background: saved ? "#059669" : "#0d9488", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          {saved ? "✓ Saved!" : "Save Settings"}
        </button>
      </div>
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: 28 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#1e1e3a", marginBottom: 16 }}>System Information</div>
        {[["Version","EduManage v2.0"],["Developer","Eng. Ahmad Zouikli"],["Database","Supabase"],["Hosting","Vercel"]].map(([l,v]) => (
          <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f8fafc" }}>
            <span style={{ fontSize: 13, color: "#64748b" }}>{l}</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}'''
    content = content[:old_settings.start()] + new_settings + content[old_settings.end():]
    print('Settings replaced!')
else:
    print('Settings not found!')
    # Check if it exists
    idx = content.find('function Settings(')
    print(f'Settings index: {idx}')
    if idx != -1:
        print(repr(content[idx:idx+100]))

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
