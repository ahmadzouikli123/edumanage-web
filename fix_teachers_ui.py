# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

idx = content.find('function Teachers(')
ret_idx = content.find('return (', idx)
end_ret = content.find('\n}\n// ─── Classes', idx)

old_return = content[ret_idx:end_ret]

new_return = '''return (
    <div style={{ padding: "0" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 13, color: "#64748b" }}>{filtered.length} teacher{filtered.length !== 1 ? "s" : ""} found</div>
        </div>
        {userRole === "admin" && (
          <button onClick={() => setShowForm(true)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "#0d9488", color: "#fff", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 2px 8px rgba(13,148,136,.3)" }}>
            + Add Teacher
          </button>
        )}
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 20 }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: "#94a3b8" }}>🔍</span>
        <input type="text" placeholder="Search by name or subject..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", padding: "11px 14px 11px 42px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, fontFamily: "inherit", outline: "none", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.05)" }} />
      </div>

      {/* Teachers Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
        {filtered.map(teacher => (
          <div key={teacher.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.06)", transition: "box-shadow .2s" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.1)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,.06)"}>
            {/* Card Header */}
            <div style={{ background: "linear-gradient(135deg,#1e1e3a,#0d9488)", padding: "20px 20px 16px", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                  {teacher.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{teacher.name}</div>
                  <div style={{ fontSize: 13, color: "#5eead4", marginTop: 2 }}>{teacher.subject || "—"}</div>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <span style={{ background: teacher.status === "active" || teacher.status === "Active" ? "rgba(16,185,129,.2)" : "rgba(239,68,68,.2)", color: teacher.status === "active" || teacher.status === "Active" ? "#10b981" : "#ef4444", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                    {teacher.status || "Active"}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                {teacher.email && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748b" }}>
                    <span>✉️</span><span>{teacher.email}</span>
                  </div>
                )}
                {teacher.phone && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748b" }}>
                    <span>📞</span><span>{teacher.phone}</span>
                  </div>
                )}
                {teacher.startDate && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748b" }}>
                    <span>📅</span><span>Since {new Date(teacher.startDate).toLocaleDateString("en-GB")}</span>
                  </div>
                )}
              </div>

              {/* Classes */}
              {teacher.classIds && teacher.classIds.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                  {teacher.classIds.map(cid => {
                    const cls = (classes||[]).find(c => c.id === cid || c.id === parseInt(cid));
                    return cls ? (
                      <span key={cid} style={{ background: "#e0f2fe", color: "#0369a1", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{cls.name}</span>
                    ) : null;
                  })}
                </div>
              )}

              {/* Username */}
              {teacher.username && (
                <div style={{ background: "#f8fafc", borderRadius: 8, padding: "8px 12px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>LOGIN</span>
                  <span style={{ fontSize: 12, color: "#475569", fontFamily: "monospace" }}>{teacher.username}</span>
                </div>
              )}

              {/* Actions */}
              {userRole === "admin" && (
                <div style={{ display: "flex", gap: 8, borderTop: "1px solid #f1f5f9", paddingTop: 14 }}>
                  <button onClick={() => { setEditing(teacher); setShowForm(true); }}
                    style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 12, cursor: "pointer", color: "#334155", fontWeight: 500, fontFamily: "inherit" }}>
                    ✏️ Edit
                  </button>
                  <button onClick={() => {
                      const today = new Date().toLocaleDateString("en-GB");
                      const startDate = teacher.startDate ? new Date(teacher.startDate).toLocaleDateString("en-GB") : "N/A";
                      const clsNames = (teacher.classIds || []).map(id => {
                        const cls = (classes || []).find(c => c.id === parseInt(id));
                        return cls ? cls.name : id;
                      }).join(", ") || "Not assigned";
                      const win = window.open("", "_blank");
                      win.document.write("<html><head><title>Teacher Report - " + teacher.name + "</title><style>* { box-sizing: border-box; margin: 0; padding: 0; } body { font-family: 'Times New Roman', serif; color: #1a1a1a; background: #fff; padding: 60px; max-width: 800px; margin: 0 auto; } .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #0d9488; padding-bottom: 20px; margin-bottom: 30px; position: relative; } .school-info { text-align: left; } .school-name { font-size: 22px; font-weight: bold; color: #0d9488; } .school-sub { font-size: 13px; color: #64748b; margin-top: 4px; } .logo { width: 90px; height: 90px; object-fit: contain; position: absolute; left: 50%; transform: translateX(-50%); } .info-table { width: 100%; border-collapse: collapse; margin: 16px 0; } .info-table td { padding: 10px 14px; border: 1px solid #d1d5db; font-size: 14px; } .info-table td:first-child { background: #f9fafb; font-weight: bold; width: 40%; } .sig-line { border-top: 1px solid #1a1a1a; width: 200px; margin-top: 50px; } .footer { margin-top: 40px; padding-top: 14px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 11px; color: #9ca3af; } @media print { button { display: none !important; } }</style></head><body>");
                      win.document.write("<div class='header'><div class='school-info'><div class='school-name'>Al-Huffath Academy</div><div class='school-sub'>Ilm | Iman | Hifz</div><div class='school-sub' style='font-size:11px;margin-top:2px'>admin@al-huffath.edu</div></div><img src='/logo.png' class='logo' /><div style='width:200px'></div></div>");
                      win.document.write("<div style='text-align:right;margin-bottom:30px;font-size:14px'>" + today + "</div>");
                      win.document.write("<div style='margin-bottom:24px;font-size:14px'><b>To Whom It May Concern,</b></div>");
                      win.document.write("<div style='font-size:15px;font-weight:bold;border-bottom:2px solid #1a1a1a;padding-bottom:6px;margin-bottom:28px;text-transform:uppercase;letter-spacing:1px'>OBJECT: Confirmation of Employment & Teaching Record</div>");
                      win.document.write("<p style='font-size:14px;line-height:2;margin-bottom:16px'>This letter is issued by Al-Huffath Academy administration to confirm the employment and teaching record of the staff member detailed below:</p>");
                      win.document.write("<table class='info-table'><tr><td>Full Name</td><td>" + teacher.name + "</td></tr><tr><td>Subject Taught</td><td>" + (teacher.subject||"-") + "</td></tr><tr><td>Assigned Classes</td><td>" + clsNames + "</td></tr><tr><td>Email Address</td><td>" + (teacher.email||"-") + "</td></tr><tr><td>Phone Number</td><td>" + (teacher.phone||"-") + "</td></tr><tr><td>Employment Status</td><td>" + (teacher.status||"-") + "</td></tr><tr><td>Start Date</td><td>" + startDate + "</td></tr><tr><td>Report Issued On</td><td>" + today + "</td></tr></table>");
                      win.document.write("<p style='font-size:14px;line-height:2;margin-top:20px'>This confirmation is provided upon request for administrative and verification purposes.</p>");
                      win.document.write("<div style='margin-top:50px'><p style='font-size:14px'>Regards,</p><div class='sig-line'></div><div style='font-size:13px;margin-top:6px;font-weight:bold'>School Principal</div><div style='font-size:12px;color:#64748b'>Al-Huffath Academy</div></div>");
                      win.document.write("<div style='margin-top:30px'><button onclick='window.print()' style='padding:10px 28px;background:#0d9488;color:#fff;border:none;border-radius:6px;font-size:14px;cursor:pointer'>Print Letter</button></div>");
                      win.document.write("<div class='footer'>Generated by EduManage | Developed by Eng. Ahmad Zouikli | " + today + "</div>");
                      win.document.write("</body></html>"); win.document.close();
                    }}
                    style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", background: "#d1fae5", fontSize: 12, cursor: "pointer", color: "#065f46", fontWeight: 500, fontFamily: "inherit" }}>
                    📄 Report
                  </button>
                  <button onClick={() => handleDelete(teacher.id)}
                    style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: "#fee2e2", fontSize: 12, cursor: "pointer", color: "#dc2626", fontFamily: "inherit" }}>
                    🗑
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={e => e.target === e.currentTarget && (setShowForm(false), setEditing(null))}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 28, width: 440, maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: "#1e1e3a" }}>{editing ? "Edit" : "Add"} Teacher</h3>
            <form onSubmit={handleSave}>
              {[
                { name: "name", placeholder: "Full Name", required: true },
                { name: "subject", placeholder: "Subject", required: true },
                { name: "email", placeholder: "Email", type: "email" },
                { name: "phone", placeholder: "Phone" },
              ].map(f => (
                <input key={f.name} name={f.name} type={f.type||"text"} defaultValue={editing?.[f.name]} placeholder={f.placeholder} required={f.required}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, fontFamily: "inherit", marginBottom: 12, outline: "none" }} />
              ))}
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>Start Date</label>
              <input name="startDate" type="date" defaultValue={editing?.startDate}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, fontFamily: "inherit", marginBottom: 12, outline: "none" }} />
              <select name="status" defaultValue={editing?.status || "active"}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, fontFamily: "inherit", marginBottom: 16, outline: "none" }}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {editing && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 8 }}>Assigned Classes</label>
                  <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 12, maxHeight: 160, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
                    {(classes||[]).map(cls => (
                      <label key={cls.id} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                        <input type="checkbox" name="classIds" value={cls.id}
                          defaultChecked={(editing?.classIds||[]).map(x=>parseInt(x)).includes(cls.id)}
                          style={{ width: 16, height: 16, cursor: "pointer" }} />
                        <span style={{ fontSize: 13 }}>{cls.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" style={{ flex: 1, padding: "11px", borderRadius: 9, border: "none", background: "#0d9488", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Save</button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }}
                  style={{ flex: 1, padding: "11px", borderRadius: 9, border: "1px solid #e2e8f0", background: "#fff", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
'''

if ret_idx != -1 and end_ret != -1:
    content = content[:ret_idx] + new_return + content[end_ret:]
    print('Teachers UI redesigned!')
else:
    print('ERROR: return not found!')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
