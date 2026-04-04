# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

# 1. Fix saveAttendance to save to Supabase
old_save = '''  const saveAttendance = () => {
    const dayOfWeek = new Date(date + "T00:00:00").getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      alert("Attendance cannot be recorded on weekends.");
      return;
    }
    setAttendance(prev => ({ ...prev, [date]: { ...(prev[date] || {}), ...draft } }));
    setSaved(true);
  };'''

new_save = '''  const saveAttendance = () => {
    const dayOfWeek = new Date(date + "T00:00:00").getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      alert("Attendance cannot be recorded on weekends.");
      return;
    }
    setAttendance(prev => ({ ...prev, [date]: { ...(prev[date] || {}), ...draft } }));
    setSaved(true);
    const records = classStudents.map(s => ({
      student_id: s.id,
      date: date,
      status: draft[s.id] || "present",
      class_id: classId,
    }));
    supabase.from("attendance").upsert(records, { onConflict: "student_id,date" }).then(({ error }) => {
      if (error) { console.error("Attendance save error:", error.message); alert("Save failed: " + error.message); }
    });
  };'''

# 2. Add useEffect to fetch attendance from Supabase
old_func = 'function Attendance({ students, classes, attendance, setAttendance }) {'
new_func = '''function Attendance({ students, classes, attendance, setAttendance }) {
  useEffect(() => {
    supabase.from("attendance").select("*").then(({ data, error }) => {
      if (error) { console.error(error); return; }
      if (!data) return;
      const next = {};
      data.forEach(r => {
        if (!next[r.date]) next[r.date] = {};
        next[r.date][r.student_id] = r.status;
      });
      setAttendance(prev => ({ ...next, ...prev }));
    });
  }, []);'''

if old_save in content:
    content = content.replace(old_save, new_save)
    print('saveAttendance fixed!')
else:
    print('ERROR: saveAttendance not found!')

if old_func in content:
    content = content.replace(old_func, new_func)
    print('Attendance fetch added!')
else:
    print('ERROR: function header not found!')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
