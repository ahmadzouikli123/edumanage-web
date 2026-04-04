# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

# 1. Add settings to PAGE_META
old_meta = '''    teachers:   { title: "Teachers",    sub: "Manage teaching staff & assignments" },
  };'''
new_meta = '''    teachers:   { title: "Teachers",    sub: "Manage teaching staff & assignments" },
    settings:   { title: "Settings",    sub: "School configuration & preferences" },
  };'''

# 2. Add settings to sidebar nav items
old_nav = '''{ id: "teachers",   icon: "👤", label: "Teachers" },'''
# Find the sidebar items
sidebar_idx = content.find('{ id: "teachers"')
if sidebar_idx == -1:
    sidebar_idx = content.find('"teachers"')

# 3. Add Settings component before export
old_export = 'export default function App() {'
new_settings_component = '''function Settings({ schoolName, setSchoolName }) {
  const [form, setForm] = useState({
    schoolName: schoolName || "Al-Huffath Academy",
    adminEmail: "admin@al-huffath.edu",
    academicYear: "2025-2026",
    timezone: "Asia/Riyadh",
    attendanceWarning: "75",
    gradePassMark: "60",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (setSchoolName) setSchoolName(form.schoolName);
    localStorage.setItem("school_settings", JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.05)", marginBottom: 20 }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1e1e3a" }}>School Information</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Basic school details and configuration</div>
        </div>
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { label: "School Name", key: "schoolName", placeholder: "Al-Huffath Academy" },
            { label: "Admin Email", key: "adminEmail", placeholder: "admin@school.edu" },
            { label: "Academic Year", key: "academicYear", placeholder: "2025-2026" },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>{label}</label>
              <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.05)", marginBottom: 20 }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1e1e3a" }}>Academic Settings</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Grades and attendance thresholds</div>
        </div>
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { label: "Attendance Warning Threshold (%)", key: "attendanceWarning", placeholder: "75" },
            { label: "Passing Grade (%)", key: "gradePassMark", placeholder: "60" },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>{label}</label>
              <input type="number" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.05)", marginBottom: 20 }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1e1e3a" }}>System Information</div>
        </div>
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "Version", value: "EduManage v2.0" },
            { label: "Developer", value: "Eng. Ahmad Zouikli" },
            { label: "Database", value: "Supabase (PostgreSQL)" },
            { label: "Hosting", value: "Vercel" },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f8fafc" }}>
              <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{label}</span>
              <span style={{ fontSize: 13, color: "#1e1e3a", fontWeight: 600 }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={handleSave} style={{
          padding: "11px 32px", borderRadius: 9, border: "none",
          background: saved ? "#059669" : "#0d9488", color: "#fff",
          fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all .2s"
        }}>
          {saved ? "✓ Saved!" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

export default function App() {'''

# 4. Add settings page to sidebar
old_sidebar_items = '''{ id: "teachers",   icon: "👤", label: "Teachers" },'''
new_sidebar_items = '''{ id: "teachers",   icon: "👤", label: "Teachers" },
          { id: "settings",   icon: "⚙️", label: "Settings" },'''

# 5. Add settings to page rendering
old_rendering = '{effectivePage === "teachers"  && userRole === "admin" && <Teachers userRole={userRole}'
new_rendering = '''{effectivePage === "settings"   && userRole === "admin" && <Settings />}
          {effectivePage === "teachers"  && userRole === "admin" && <Teachers userRole={userRole}'''

fixes = [
    (old_meta,          new_meta,          'Settings meta added!'),
    (old_export,        new_settings_component, 'Settings component added!'),
    (old_sidebar_items, new_sidebar_items, 'Settings nav item added!'),
    (old_rendering,     new_rendering,     'Settings page rendering added!'),
]

for old, new, msg in fixes:
    if old in content:
        content = content.replace(old, new)
        print(msg)
    else:
        print(f'ERROR: not found -> {msg}')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
