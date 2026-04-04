# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

# Find where assignModal code is inside Students and remove it
modal_code = '''\n      {/* Assign Classes Modal */}\n      {assignModal && (() => {
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

# Remove all occurrences of modal code
count = content.count('{/* Assign Classes Modal */}')
print(f'Found {count} modal(s)')
content = content.replace(modal_code, '')
print('Removed all modal occurrences')

# Now add it in the right place - inside Teachers component before its closing
# Teachers component ends just before "// ─── Classes" or "function Classes"
idx_teachers = content.find('function Teachers(')
idx_end = content.find('\nfunction Classes(', idx_teachers)
if idx_end == -1:
    idx_end = content.find('\n// ─── Classes', idx_teachers)

teachers_section = content[idx_teachers:idx_end]

# Find last </div>\n  );\n} in teachers section  
closing = '    </div>\n  );\n}'
last_pos = teachers_section.rfind(closing)

if last_pos != -1:
    insert_at = idx_teachers + last_pos
    content = content[:insert_at] + modal_code + '\n' + content[insert_at:]
    print('Modal inserted in Teachers!')
else:
    # Try className version
    closing2 = '    </div>\n  );\n}'
    print('ERROR: closing not found, searching...')
    print(repr(teachers_section[-300:]))

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
