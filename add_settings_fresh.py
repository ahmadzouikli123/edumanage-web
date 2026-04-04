# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

# 1. Add settings to NAV array
idx_nav = content.find('const NAV = [')
if idx_nav != -1:
    # Find last item in NAV
    nav_end = content.find('];', idx_nav)
    nav_section = content[idx_nav:nav_end]
    if '"settings"' not in nav_section:
        # Add before closing ]
        old_nav_end = content[nav_end-10:nav_end+2]
        # Find last }, in NAV
        last_item_end = nav_section.rfind('},')
        insert_pos = idx_nav + last_item_end + 2
        settings_nav = '\n  { id: "settings",  icon: "⚙",  label: "Settings"  },'
        content = content[:insert_pos] + settings_nav + content[insert_pos:]
        print('NAV item added!')
    else:
        print('NAV item already exists')

# 2. Add Settings component before export default
settings_component = '''
function Settings() {
  const [form, setForm] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem("school_settings") || "{}"); } catch { return {}; }
  });
  const [saved, setSaved] = React.useState(false);

  const fields = [
    { label: "School Name", key: "schoolName", placeholder: "Al-Huffath Academy" },
    { label: "Admin Email", key: "adminEmail", placeholder: "admin@school.edu" },
    { label: "Academic Year", key: "academicYear", placeholder: "2025-2026" },
    { label: "Attendance Warning (%)", key: "attendanceWarning", placeholder: "75", type: "number" },
    { label: "Passing Grade (%)", key: "gradePassMark", placeholder: "60", type: "number" },
  ];

  const handleSave = () => {
    localStorage.setItem("school_settings", JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1e1e3a" }}>School Configuration</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Manage school settings and preferences</div>
        </div>
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {fields.map(({ label, key, placeholder, type }) => (
            <div key={key}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>{label}</label>
              <input type={type || "text"} value={form[key] || ""} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1e1e3a" }}>System Information</div>
        </div>
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 10 }}>
          {[["Version","EduManage v2.0"],["Developer","Eng. Ahmad Zouikli"],["Database","Supabase (PostgreSQL)"],["Hosting","Vercel"]].map(([l,v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f8fafc" }}>
              <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{l}</span>
              <span style={{ fontSize: 13, color: "#1e1e3a", fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={handleSave} style={{ padding: "11px 32px", borderRadius: 9, border: "none", background: saved ? "#059669" : "#0d9488", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          {saved ? "✓ Saved!" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

'''

if 'function Settings(' not in content:
    old_export = 'export default function App() {'
    content = content.replace(old_export, settings_component + old_export)
    print('Settings component added!')
else:
    print('Settings component already exists')

# 3. Add settings to PAGE_META
old_meta = 'teachers:   { title: "Teachers"'
new_meta_prefix = 'settings:   { title: "Settings",    sub: "School configuration & preferences" },\n    teachers:   { title: "Teachers"'
if 'settings:' not in content and old_meta in content:
    content = content.replace(old_meta, new_meta_prefix)
    print('Page meta added!')

# 4. Add settings page rendering
old_render = '{effectivePage === "teachers"  && userRole === "admin"'
new_render = '{effectivePage === "settings"   && userRole === "admin" && <Settings />}\n          ' + old_render
if 'effectivePage === "settings"' not in content and old_render in content:
    content = content.replace(old_render, new_render)
    print('Settings rendering added!')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
