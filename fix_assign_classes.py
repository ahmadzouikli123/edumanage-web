# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

# 1. Update Teachers function to accept classes prop
old_func = 'function Teachers({ userRole }) {'
new_func = 'function Teachers({ userRole, classes }) {\n  const [assignModal, setAssignModal] = useState(null); // teacher being assigned'

# 2. Add assignClasses function before handleDelete
old_handle_delete = '  const handleDelete = (id) => {'
new_handle_delete = '''  const handleAssignClasses = (teacher, selectedIds) => {
    supabase.from("teachers").update({ class_ids: selectedIds }).eq("id", teacher.id).then(({ error }) => {
      if (error) { alert("Failed: " + error.message); return; }
      setTeachers(prev => prev.map(t => t.id === teacher.id ? { ...t, classIds: selectedIds } : t));
      setAssignModal(null);
    });
  };

  const handleDelete = (id) => {'''

# 3. Add Assign Classes button next to Edit/Delete
old_buttons = '''                  <button \n                    onClick={() => { setEditing(teacher); setShowForm(true); }}\n                    className="text-blue-600 hover:underline"\n                  >Edit</button>\n                  <button \n                    onClick={() => handleDelete(teacher.id)}\n                    className="text-red-600 hover:underline"\n                  >Delete</button>'''

new_buttons = '''                  <button 
                    onClick={() => { setEditing(teacher); setShowForm(true); }}
                    className="text-blue-600 hover:underline"
                  >Edit</button>
                  <button 
                    onClick={() => handleDelete(teacher.id)}
                    className="text-red-600 hover:underline"
                  >Delete</button>
                  <button 
                    onClick={() => setAssignModal(teacher)}
                    className="text-purple-600 hover:underline"
                  >Assign Classes</button>'''

# 4. Show class_ids on teacher card
old_status = '                <span className={teacher.status === "active" ? "inline-block px-2 py-1 rounded text-xs mt-2 bg-green-100 text-green-700" : "inline-block px-2 py-1 rounded text-xs mt-2 bg-gray-100 text-gray-600"}>\n                  {teacher.status}\n                </span>'

new_status = '''                <span className={teacher.status === "active" ? "inline-block px-2 py-1 rounded text-xs mt-2 bg-green-100 text-green-700" : "inline-block px-2 py-1 rounded text-xs mt-2 bg-gray-100 text-gray-600"}>
                  {teacher.status}
                </span>
                {teacher.classIds && teacher.classIds.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {teacher.classIds.map(cid => {
                      const cls = (classes||[]).find(c => c.id === cid || c.id === parseInt(cid));
                      return cls ? <span key={cid} style={{background:"#e0f2fe",color:"#0369a1",padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:600}}>{cls.name}</span> : null;
                    })}
                  </div>
                )}'''

# 5. Add assign modal before closing return
old_form_end = '    </div>\n  );\n}\n// ─── Classes'
new_form_end = '''      {/* Assign Classes Modal */}
      {assignModal && (() => {
        const teacher = assignModal;
        const currentIds = (teacher.classIds || []).map(x => parseInt(x));
        return (
          <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center" }}
            onClick={e => e.target===e.currentTarget && setAssignModal(null)}>
            <div style={{ background:"#fff",borderRadius:12,padding:28,width:440,maxHeight:"80vh",overflowY:"auto" }}>
              <h3 style={{ fontSize:18,fontWeight:700,marginBottom:6 }}>Assign Classes</h3>
              <p style={{ fontSize:13,color:"#64748b",marginBottom:16 }}>{teacher.name} — {teacher.subject}</p>
              <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:20 }}>
                {(classes||[]).map(cls => {
                  const checked = currentIds.includes(cls.id);
                  return (
                    <label key={cls.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 14px",border:"1px solid #e2e8f0",borderRadius:8,cursor:"pointer",background:checked?"#f0fdf4":"#fff" }}>
                      <input type="checkbox" defaultChecked={checked} onChange={e => {
                        if (e.target.checked) { if (!currentIds.includes(cls.id)) currentIds.push(cls.id); }
                        else { const i = currentIds.indexOf(cls.id); if (i>-1) currentIds.splice(i,1); }
                      }} style={{ width:16,height:16,cursor:"pointer" }} />
                      <span style={{ fontSize:14,fontWeight:500,color:"#1e1e3a" }}>{cls.name}</span>
                    </label>
                  );
                })}
              </div>
              <div style={{ display:"flex",gap:10,justifyContent:"flex-end" }}>
                <button onClick={() => setAssignModal(null)} style={{ padding:"9px 18px",borderRadius:8,border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:13 }}>Cancel</button>
                <button onClick={() => handleAssignClasses(teacher, [...currentIds])} style={{ padding:"9px 24px",borderRadius:8,border:"none",background:"#7c3aed",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600 }}>Save Assignment</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
// ─── Classes'''

fixes = [
    (old_func,          new_func,          'Function updated!'),
    (old_handle_delete, new_handle_delete, 'assignClasses added!'),
    (old_buttons,       new_buttons,       'Assign button added!'),
    (old_status,        new_status,        'Class tags shown!'),
    (old_form_end,      new_form_end,      'Modal added!'),
]

for old, new, msg in fixes:
    if old in content:
        content = content.replace(old, new)
        print(msg)
    else:
        print(f'ERROR: not found -> {msg}')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
