import re

path = "src/components/SchoolApp.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# ─── Fix 1: Students save → sync to Supabase ─────────────────────────────────
old_save_student = '''  const saveStudent = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    modal.mode === "add"
      ? setStudents(prev => [...prev, { ...form, id: uid() }])
      : setStudents(prev => prev.map(s => s.id === form.id ? form : s));
    setModal(null);
    showToast(modal.mode === "add" ? "Student added" : "Student updated");
  };'''

new_save_student = '''  const saveStudent = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (modal.mode === "add") {
      const newStudent = { ...form, id: uid() };
      setStudents(prev => [...prev, newStudent]);
      dbUpsertStudent({ ...newStudent, _dbId: null });
    } else {
      setStudents(prev => prev.map(s => s.id === form.id ? form : s));
      dbUpsertStudent({ ...form, _dbId: form.id });
    }
    setModal(null);
    showToast(modal.mode === "add" ? "Student added" : "Student updated");
  };'''

if "dbUpsertStudent" not in content:
    content = content.replace(old_save_student, new_save_student)
    print("✅ Students save → Supabase")
else:
    print("⚠️  Students already patched")

# ─── Fix 2: Students delete → sync to Supabase ───────────────────────────────
old_delete_student = '''  const doDelete = (id) => { setStudents(prev => prev.filter(s => s.id !== id)); setDeleteId(null); showToast("Student deleted"); };'''

new_delete_student = '''  const doDelete = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    dbDeleteStudent(id);
    setDeleteId(null);
    showToast("Student deleted");
  };'''

if old_delete_student in content:
    content = content.replace(old_delete_student, new_delete_student)
    print("✅ Students delete → Supabase")

# ─── Fix 3: Classes save → sync to Supabase ──────────────────────────────────
# Find the Classes save function
old_save_class = '''  const save = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    modal.mode === "add"
      ? setClasses(prev => [...prev, { ...form, id: uid() }])
      : setClasses(prev => prev.map(c => c.id === form.id ? form : c));
    setModal(null);
  };'''

new_save_class = '''  const save = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (modal.mode === "add") {
      const newClass = { ...form, id: uid() };
      setClasses(prev => [...prev, newClass]);
      dbUpsertClass({ ...newClass, _dbId: null });
    } else {
      setClasses(prev => prev.map(c => c.id === form.id ? form : c));
      dbUpsertClass({ ...form, _dbId: form.id });
    }
    setModal(null);
  };'''

if old_save_class in content:
    content = content.replace(old_save_class, new_save_class)
    print("✅ Classes save → Supabase")
else:
    print("⚠️  Classes save function not found — trying fallback")

# ─── Fix 4: Classes delete → sync to Supabase ────────────────────────────────
old_delete_class = '''onClick={() => { setClasses(prev => prev.filter(c => c.id !== deleteId)); setDeleteId(null); }}'''
new_delete_class = '''onClick={() => { dbDeleteClass(deleteId); setClasses(prev => prev.filter(c => c.id !== deleteId)); setDeleteId(null); }}'''

if old_delete_class in content:
    content = content.replace(old_delete_class, new_delete_class)
    print("✅ Classes delete → Supabase")

# ─── Fix 5: Teachers save → sync to Supabase ─────────────────────────────────
old_save_teacher = '''  const save = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    modal.mode === "add"
      ? setTeachers(prev => [...prev, { ...form, id: Date.now() }])
      : setTeachers(prev => prev.map(t => t.id === form.id ? form : t));
    setModal(null);
  };'''

new_save_teacher = '''  const save = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (modal.mode === "add") {
      const newTeacher = { ...form, id: uid() };
      setTeachers(prev => [...prev, newTeacher]);
      dbUpsertTeacher({ ...newTeacher, _dbId: null });
    } else {
      setTeachers(prev => prev.map(t => t.id === form.id ? form : t));
      dbUpsertTeacher({ ...form, _dbId: form.id });
    }
    setModal(null);
  };'''

if old_save_teacher in content:
    content = content.replace(old_save_teacher, new_save_teacher)
    print("✅ Teachers save → Supabase")
else:
    print("⚠️  Teachers save not found — checking variant")
    # try variant
    old2 = "setTeachers(prev => [...prev, { ...form, id: Date.now() }])"
    new2 = "const nt = { ...form, id: uid() }; setTeachers(prev => [...prev, nt]); dbUpsertTeacher({ ...nt, _dbId: null });"
    if old2 in content:
        content = content.replace(old2, new2)
        print("✅ Teachers add patched via fallback")
    old3 = "setTeachers(prev => prev.map(t => t.id === form.id ? form : t));\n    setModal(null);"
    new3 = "setTeachers(prev => prev.map(t => t.id === form.id ? form : t)); dbUpsertTeacher({ ...form, _dbId: form.id });\n    setModal(null);"
    if old3 in content:
        content = content.replace(old3, new3)
        print("✅ Teachers edit patched via fallback")

# ─── Fix 6: Teachers delete → sync to Supabase ───────────────────────────────
old_delete_teacher = '''setTeachers(prev => prev.filter(t => t.id !== deleteId)); setDeleteId(null);'''
new_delete_teacher = '''dbDeleteTeacher(deleteId); setTeachers(prev => prev.filter(t => t.id !== deleteId)); setDeleteId(null);'''

if old_delete_teacher in content:
    content = content.replace(old_delete_teacher, new_delete_teacher)
    print("✅ Teachers delete → Supabase")

# ─── Fix 7: Add dbUpsertClass and dbDeleteClass helpers if missing ────────────
if "dbUpsertClass" not in content:
    class_helpers = '''
async function dbUpsertClass(c) {
  const row = { name: c.name, grade: c.grade, room: c.room, teacher: c.teacher, capacity: c.capacity };
  if (c._dbId) {
    const { error } = await _supa.from("classes").update(row).eq("id", c._dbId);
    if (error) console.error("updateClass:", error);
  } else {
    const { error } = await _supa.from("classes").insert(row);
    if (error) console.error("insertClass:", error);
  }
}
async function dbDeleteClass(dbId) {
  const { error } = await _supa.from("classes").delete().eq("id", dbId);
  if (error) console.error("deleteClass:", error);
}
'''
    # Insert after dbGetTeachers
    content = content.replace(
        "async function dbSaveAttendance",
        class_helpers + "async function dbSaveAttendance"
    )
    print("✅ Added dbUpsertClass + dbDeleteClass helpers")

# ─── Write back ──────────────────────────────────────────────────────────────
with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print()
print("✅ Done! Run: npm run build")
