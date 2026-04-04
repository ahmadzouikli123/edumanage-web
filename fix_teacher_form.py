# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

# 1. Add class checkboxes to form (before the buttons)
old_form = '''            <select name="status" defaultValue={editing?.status || "active"} className="w-full p-2 border rounded mb-4">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="flex gap-2">'''

new_form = '''            <select name="status" defaultValue={editing?.status || "active"} className="w-full p-2 border rounded mb-4">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {editing && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Classes</label>
                <div className="border rounded p-3 max-h-40 overflow-y-auto flex flex-col gap-2">
                  {(classes||[]).map(cls => (
                    <label key={cls.id} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="classIds" value={cls.id}
                        defaultChecked={(editing?.classIds||[]).map(x=>parseInt(x)).includes(cls.id)}
                        className="w-4 h-4 cursor-pointer" />
                      <span className="text-sm">{cls.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2">'''

# 2. Update handleSave to include class_ids
old_save = '''    if (editing) {
      supabase.from("teachers").update({
        name: newTeacher.name, subject: newTeacher.subject,
        phone: newTeacher.phone, email: newTeacher.email, status: newTeacher.status,
      }).eq("id", editing.id).then(() => {
        setTeachers(teachers.map(t => t.id === editing.id ? newTeacher : t));
      });'''

new_save = '''    if (editing) {
      const checkboxes = Array.from(e.target.querySelectorAll('input[name="classIds"]:checked'));
      const classIds = checkboxes.map(cb => parseInt(cb.value));
      supabase.from("teachers").update({
        name: newTeacher.name, subject: newTeacher.subject,
        phone: newTeacher.phone, email: newTeacher.email, status: newTeacher.status,
        class_ids: classIds,
      }).eq("id", editing.id).then(() => {
        setTeachers(teachers.map(t => t.id === editing.id ? { ...newTeacher, classIds } : t));
      });'''

# 3. Remove Assign Classes button
old_assign_btn = '''                  <button 
                    onClick={() => setAssignModal(teacher)}
                    className="text-purple-600 hover:underline"
                  >Assign Classes</button>'''
new_assign_btn = ''

fixes = [
    (old_form,       new_form,       'Class checkboxes added to form!'),
    (old_save,       new_save,       'handleSave updated with class_ids!'),
    (old_assign_btn, new_assign_btn, 'Assign Classes button removed!'),
]

for old, new, msg in fixes:
    if old in content:
        content = content.replace(old, new)
        print(msg)
    else:
        print(f'ERROR: not found -> {msg}')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
