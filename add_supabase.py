import os, re

SUPABASE_URL = "https://mhrtzppoiinpnbnximuf.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ocnR6cHBvaWlucG5ibnhpbXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4OTE3MDEsImV4cCI6MjA5MDQ2NzcwMX0.933qWXp0vslGHmt06eKgPuihMOVh4NzGUiHXY4iDNSQ"

# ─── 1. Update .env.production ───────────────────────────────────────────────
with open(".env.production", "w", encoding="utf-8") as f:
    f.write(f"NEXT_PUBLIC_SUPABASE_URL={SUPABASE_URL}\n")
    f.write(f"NEXT_PUBLIC_SUPABASE_ANON_KEY={SUPABASE_KEY}\n")
    f.write("NEXT_PUBLIC_API_URL=https://placeholder.com\n")
print("✅ .env.production updated")

# ─── 2. Update .env.local ────────────────────────────────────────────────────
with open(".env.local", "w", encoding="utf-8") as f:
    f.write(f"NEXT_PUBLIC_SUPABASE_URL={SUPABASE_URL}\n")
    f.write(f"NEXT_PUBLIC_SUPABASE_ANON_KEY={SUPABASE_KEY}\n")
    f.write("NEXT_PUBLIC_API_URL=http://localhost:3001\n")
print("✅ .env.local updated")

# ─── 3. Read SchoolApp.jsx ────────────────────────────────────────────────────
path = "src/components/SchoolApp.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# ─── 4. Add Supabase import at top ───────────────────────────────────────────
if "createClient" not in content:
    content = 'import { createClient } from "@supabase/supabase-js";\n' + content
    print("✅ Added supabase import")

# ─── 5. Add Supabase client + DB helpers after imports ───────────────────────
supabase_helpers = '''
// ─── Supabase Client ──────────────────────────────────────────────────────────
const _supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// ─── DB helpers ───────────────────────────────────────────────────────────────
async function dbGetStudents() {
  const { data, error } = await _supa.from("students").select("*").order("id");
  if (error) { console.error("getStudents:", error); return null; }
  return data.map(s => ({ id: s.id, name: s.name, sid: s.sid, classId: s.class_id, gender: s.gender, phone: s.phone, status: s.status }));
}
async function dbUpsertStudent(s) {
  const row = { name: s.name, sid: s.sid, class_id: s.classId, gender: s.gender, phone: s.phone, status: s.status };
  if (s._dbId) {
    const { error } = await _supa.from("students").update(row).eq("id", s._dbId);
    if (error) console.error("updateStudent:", error);
  } else {
    const { error } = await _supa.from("students").insert(row);
    if (error) console.error("insertStudent:", error);
  }
}
async function dbDeleteStudent(dbId) {
  const { error } = await _supa.from("students").delete().eq("id", dbId);
  if (error) console.error("deleteStudent:", error);
}
async function dbGetClasses() {
  const { data, error } = await _supa.from("classes").select("*").order("id");
  if (error) { console.error("getClasses:", error); return null; }
  return data.map(c => ({ id: c.id, name: c.name, grade: c.grade, room: c.room, teacher: c.teacher, capacity: c.capacity }));
}
async function dbGetTeachers() {
  const { data, error } = await _supa.from("teachers").select("*").order("id");
  if (error) { console.error("getTeachers:", error); return null; }
  return data.map(t => ({ id: t.id, name: t.name, username: t.username, password: t.password, subject: t.subject, classIds: t.class_ids || [], phone: t.phone, email: t.email, status: t.status }));
}
async function dbUpsertTeacher(t) {
  const row = { name: t.name, username: t.username, password: t.password, subject: t.subject, class_ids: t.classIds || [], phone: t.phone, email: t.email, status: t.status };
  if (t._dbId) {
    const { error } = await _supa.from("teachers").update(row).eq("id", t._dbId);
    if (error) console.error("updateTeacher:", error);
  } else {
    const { error } = await _supa.from("teachers").insert(row);
    if (error) console.error("insertTeacher:", error);
  }
}
async function dbDeleteTeacher(dbId) {
  const { error } = await _supa.from("teachers").delete().eq("id", dbId);
  if (error) console.error("deleteTeacher:", error);
}
async function dbSaveAttendance(date, records) {
  const rows = Object.entries(records).map(([sid, status]) => ({ date, student_id: parseInt(sid), status }));
  const { error } = await _supa.from("attendance").upsert(rows, { onConflict: "date,student_id" });
  if (error) console.error("saveAttendance:", error);
}
async function dbGetAttendance() {
  const { data, error } = await _supa.from("attendance").select("*");
  if (error) { console.error("getAttendance:", error); return null; }
  const result = {};
  data.forEach(r => {
    if (!result[r.date]) result[r.date] = {};
    result[r.date][r.student_id] = r.status;
  });
  return result;
}

'''

# Insert helpers before "// ─── Status Config"
marker = "// ─── Status Config"
if marker in content and "_supa" not in content:
    content = content.replace(marker, supabase_helpers + marker)
    print("✅ Added Supabase helpers")

# ─── 6. Update App Root to load from Supabase on mount ───────────────────────
old_useeffect_auth = '''  useEffect(() => {
    try {
      const stored = localStorage.getItem("edu_auth");
      if (!stored) { window.location.href = "/school/login"; return; }
      setAuth(JSON.parse(stored));
    } catch { localStorage.clear(); window.location.href = "/school/login"; }
  }, []);'''

new_useeffect_auth = '''  useEffect(() => {
    try {
      const stored = localStorage.getItem("edu_auth");
      if (!stored) { window.location.href = "/school/login"; return; }
      setAuth(JSON.parse(stored));
    } catch { localStorage.clear(); window.location.href = "/school/login"; }
  }, []);

  // Load from Supabase on mount
  useEffect(() => {
    (async () => {
      const [dbStudents, dbClasses, dbTeachers, dbAtt] = await Promise.all([
        dbGetStudents(), dbGetClasses(), dbGetTeachers(), dbGetAttendance()
      ]);
      if (dbStudents && dbStudents.length > 0) setStudents(dbStudents);
      if (dbClasses  && dbClasses.length  > 0) setClasses(dbClasses);
      if (dbTeachers && dbTeachers.length > 0) setTeachers(dbTeachers);
      if (dbAtt) setAttendance(prev => ({ ...prev, ...dbAtt }));
    })();
  }, []);'''

if "Load from Supabase on mount" not in content:
    content = content.replace(old_useeffect_auth, new_useeffect_auth)
    print("✅ Added Supabase load on mount")

# ─── 7. Sync attendance save to Supabase ─────────────────────────────────────
old_save_att = '''  const saveAttendance = () => {
    const dayOfWeek = new Date(date + "T00:00:00").getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      alert("Attendance cannot be recorded on weekends.");
      return;
    }
    setAttendance(prev => ({ ...prev, [date]: { ...(prev[date] || {}), ...draft } }));
    setSaved(true);
  };'''

new_save_att = '''  const saveAttendance = () => {
    const dayOfWeek = new Date(date + "T00:00:00").getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      alert("Attendance cannot be recorded on weekends.");
      return;
    }
    const merged = { ...(attendance[date] || {}), ...draft };
    setAttendance(prev => ({ ...prev, [date]: merged }));
    dbSaveAttendance(date, merged);
    setSaved(true);
  };'''

if "dbSaveAttendance" not in content:
    content = content.replace(old_save_att, new_save_att)
    print("✅ Added attendance sync to Supabase")

# ─── 8. Write back ───────────────────────────────────────────────────────────
with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print()
print("✅ SchoolApp.jsx updated!")
print("Next: npm run build")
