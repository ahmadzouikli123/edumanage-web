# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

settings_component = '''
function Settings() {
  const [saved, setSaved] = useState(false);
  const [schoolName, setSchoolName] = useState("Al-Huffath Academy");
  const [year, setYear] = useState("2025-2026");

  const save = () => {
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
          {saved ? "Saved!" : "Save Settings"}
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
}

'''

# Add before export default
old_export = 'export default function App() {'
if 'function Settings(' not in content:
    content = content.replace(old_export, settings_component + old_export)
    print('Settings added!')
else:
    print('Settings already exists')

# Add to NAV
old_nav_item = '{ id: "teachers", icon: "👤", label: "Teachers" },'
new_nav_item = '{ id: "teachers", icon: "👤", label: "Teachers" },\n  { id: "settings",  icon: "⚙",  label: "Settings"  },'
if '"settings"' not in content and old_nav_item in content:
    content = content.replace(old_nav_item, new_nav_item)
    print('NAV item added!')

# Add page meta
old_meta = 'teachers:   { title: "Teachers"'
if 'settings:' not in content and old_meta in content:
    content = content.replace(old_meta, 'settings:   { title: "Settings", sub: "School configuration" },\n    ' + old_meta)
    print('Meta added!')

# Add rendering
old_render = '{effectivePage === "teachers"  && userRole === "admin"'
if 'effectivePage === "settings"' not in content and old_render in content:
    content = content.replace(old_render, '{effectivePage === "settings" && userRole === "admin" && <Settings />}\n          ' + old_render)
    print('Rendering added!')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
