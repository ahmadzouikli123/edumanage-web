# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

# Find Teachers section boundaries
idx_teachers = content.find('function Teachers(')
idx_students = content.find('\nfunction Students(', idx_teachers)
teachers_section = content[idx_teachers:idx_students]

print(f'Teachers section length: {len(teachers_section)}')
print(f'assignModal count: {teachers_section.count("assignModal")}')
print(f'Modal count: {teachers_section.count("Assign Classes Modal")}')

# Find the closing of Teachers return - look for the last </div> before );
# Teachers uses className (Tailwind), so find the closing pattern
closing_pattern = '    </div>\n  );\n}\n\n'
last_idx = teachers_section.rfind(closing_pattern)
print(f'Closing pattern found at: {last_idx}')

if last_idx == -1:
    # Try alternative
    closing_pattern = '  );\n}\n\n'
    last_idx = teachers_section.rfind(closing_pattern)
    print(f'Alt closing found at: {last_idx}')
    print(repr(teachers_section[-300:]))

modal = '''
      {/* Assign Classes Modal */}
      {assignModal && (() => {
        const teacher = assignModal;
        const currentIds = (teacher.classIds || []).map(x => parseInt(x));
        return (
          <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center" }}
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

# Insert modal before closing of Teachers
insert_pos = idx_teachers + last_idx
new_content = content[:insert_pos] + modal + '\n' + content[insert_pos:]

# Verify
idx_t2 = new_content.find('function Teachers(')
idx_s2 = new_content.find('\nfunction Students(', idx_t2)
t_section = new_content[idx_t2:idx_s2]
print(f'\nAfter fix - Modal in Teachers: {t_section.count("Assign Classes Modal")}')
print(f'After fix - assignModal in Teachers: {t_section.count("assignModal")}')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(new_content)
print('Done!')
