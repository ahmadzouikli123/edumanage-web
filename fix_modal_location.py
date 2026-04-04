# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

# 1. Remove modal from wrong location (inside Students)
old_wrong = '''      {/* Assign Classes Modal */}
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

new_wrong = '''    </div>
  );
}
// ─── Classes'''

# 2. Add modal in correct location inside Teachers component
old_teachers_end = '''      </div>\n    </div>\n  );\n}\n// ─── Classes'''

# Find the teachers return end
idx_teachers = content.find('function Teachers(')
idx_classes = content.find('\n// ─── Classes', idx_teachers)
teachers_section = content[idx_teachers:idx_classes]

# Find where teachers return ends
teachers_return_end = '    </div>\n  );\n}'

modal_code = '''
      {/* Assign Classes Modal */}
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
      })()}'''

# Remove from wrong place
if old_wrong in content:
    content = content.replace(old_wrong, new_wrong)
    print('Removed from wrong place!')
else:
    print('ERROR: wrong location not found!')

# Add in Teachers - find last </div> before // ─── Classes after Teachers function
idx_teachers = content.find('function Teachers(')
idx_classes = content.find('\n// ─── Classes', idx_teachers)
teachers_part = content[idx_teachers:idx_classes]

# Find the closing of Teachers return
last_return_close = teachers_part.rfind('    </div>\n  );\n}')
if last_return_close != -1:
    insert_pos = idx_teachers + last_return_close
    content = content[:insert_pos] + modal_code + '\n' + content[insert_pos:]
    print('Modal added to Teachers!')
else:
    print('ERROR: Teachers closing not found!')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
