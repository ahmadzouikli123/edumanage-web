# -*- coding: utf-8 -*-
path = "src/components/SchoolApp.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix saveStudent function to also save to Supabase
old = '''    modal.mode === "add"
      ? setStudents(prev => [...prev, { ...form, id: uid() }])
      : setStudents(prev => prev.map(s => s.id === form.id ? form : s));
    setModal(null);
    showToast(modal.mode === "add" ? "Student added" : "Student updated");'''

new = '''    if (modal.mode === "add") {
      supabase.from("students").insert([{
        name: form.name, sid: form.sid, class_id: form.classId,
        gender: form.gender, phone: form.phone, status: form.status,
      }]).select().then(({ data, error }) => {
        if (data && data.length > 0) {
          const s = data[0];
          setStudents(prev => [...prev, { id: s.id, name: s.name, sid: s.sid, classId: s.class_id, gender: s.gender, phone: s.phone, status: s.status }]);
        } else {
          setStudents(prev => [...prev, { ...form, id: uid() }]);
        }
      });
    } else {
      supabase.from("students").update({
        name: form.name, sid: form.sid, class_id: form.classId,
        gender: form.gender, phone: form.phone, status: form.status,
      }).eq("id", form.id).then(() => {
        setStudents(prev => prev.map(s => s.id === form.id ? form : s));
      });
    }
    setModal(null);
    showToast(modal.mode === "add" ? "Student added" : "Student updated");'''

if old in content:
    content = content.replace(old, new)
    print("saveStudent fixed!")
else:
    print("Not found - searching...")
    idx = content.find("Student added")
    print(repr(content[idx-300:idx+100]))

# Fix delete student to also delete from Supabase
old_delete = '''  const doDelete = (id) => { setStudents(prev => prev.filter(s => s.id !== id)); setDeleteId(null); showToast("Student deleted"); };'''
new_delete = '''  const doDelete = (id) => {
    supabase.from("students").delete().eq("id", id).then(() => {
      setStudents(prev => prev.filter(s => s.id !== id));
      setDeleteId(null);
      showToast("Student deleted");
    });
  };'''

if old_delete in content:
    content = content.replace(old_delete, new_delete)
    print("doDelete fixed!")
else:
    print("doDelete not found")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Done!")
