import os

# ─── 1. Create supabase client file ──────────────────────────────────────────
os.makedirs("src/lib", exist_ok=True)

with open("src/lib/supabase.ts", "w", encoding="utf-8") as f:
    f.write('''import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Students ─────────────────────────────────────────────────────────────
export async function getStudents() {
  const { data, error } = await supabase.from("students").select("*").order("id");
  if (error) throw error;
  return data.map((s: any) => ({
    id: s.id, name: s.name, sid: s.sid, classId: s.class_id,
    gender: s.gender, phone: s.phone, status: s.status,
  }));
}

export async function upsertStudent(s: any) {
  const row = { name: s.name, sid: s.sid, class_id: s.classId, gender: s.gender, phone: s.phone, status: s.status };
  if (s.id && typeof s.id === "number" && s.id < 1e12) {
    const { error } = await supabase.from("students").update(row).eq("id", s.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("students").insert(row);
    if (error) throw error;
  }
}

export async function deleteStudent(id: number) {
  const { error } = await supabase.from("students").delete().eq("id", id);
  if (error) throw error;
}

// ─── Classes ──────────────────────────────────────────────────────────────
export async function getClasses() {
  const { data, error } = await supabase.from("classes").select("*").order("id");
  if (error) throw error;
  return data.map((c: any) => ({
    id: c.id, name: c.name, grade: c.grade, room: c.room,
    teacher: c.teacher, capacity: c.capacity,
  }));
}

export async function upsertClass(c: any) {
  const row = { name: c.name, grade: c.grade, room: c.room, teacher: c.teacher, capacity: c.capacity };
  if (c.id && typeof c.id === "number" && c.id < 1e12) {
    const { error } = await supabase.from("classes").update(row).eq("id", c.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("classes").insert(row);
    if (error) throw error;
  }
}

export async function deleteClass(id: number) {
  const { error } = await supabase.from("classes").delete().eq("id", id);
  if (error) throw error;
}

// ─── Teachers ─────────────────────────────────────────────────────────────
export async function getTeachers() {
  const { data, error } = await supabase.from("teachers").select("*").order("id");
  if (error) throw error;
  return data.map((t: any) => ({
    id: t.id, name: t.name, username: t.username, password: t.password,
    subject: t.subject, classIds: t.class_ids || [], phone: t.phone,
    email: t.email, status: t.status,
  }));
}

export async function upsertTeacher(t: any) {
  const row = { name: t.name, username: t.username, password: t.password,
    subject: t.subject, class_ids: t.classIds || [], phone: t.phone,
    email: t.email, status: t.status };
  if (t.id && typeof t.id === "number" && t.id < 1e12) {
    const { error } = await supabase.from("teachers").update(row).eq("id", t.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("teachers").insert(row);
    if (error) throw error;
  }
}

export async function deleteTeacher(id: number) {
  const { error } = await supabase.from("teachers").delete().eq("id", id);
  if (error) throw error;
}

// ─── Attendance ───────────────────────────────────────────────────────────
export async function getAttendance() {
  const { data, error } = await supabase.from("attendance").select("*");
  if (error) throw error;
  // Convert to { date: { studentId: status } }
  const result: any = {};
  data.forEach((r: any) => {
    if (!result[r.date]) result[r.date] = {};
    result[r.date][r.student_id] = r.status;
  });
  return result;
}

export async function saveAttendanceDay(date: string, records: Record<number, string>) {
  const rows = Object.entries(records).map(([sid, status]) => ({
    date, student_id: parseInt(sid), status,
  }));
  const { error } = await supabase.from("attendance").upsert(rows, { onConflict: "date,student_id" });
  if (error) throw error;
}

// ─── Grades ───────────────────────────────────────────────────────────────
export async function getGrades() {
  const { data, error } = await supabase.from("grades").select("*");
  if (error) throw error;
  // Convert to { studentId: { subjectId: { quiz, homework, midterm, final } } }
  const result: any = {};
  data.forEach((r: any) => {
    if (!result[r.student_id]) result[r.student_id] = {};
    result[r.student_id][r.subject_id] = {
      quiz: r.quiz, homework: r.homework, midterm: r.midterm, final: r.final,
    };
  });
  return result;
}

export async function saveGrade(studentId: number, subjectId: number, scores: any) {
  const { error } = await supabase.from("grades").upsert({
    student_id: studentId, subject_id: subjectId,
    quiz: scores.quiz, homework: scores.homework,
    midterm: scores.midterm, final: scores.final,
  }, { onConflict: "student_id,subject_id" });
  if (error) throw error;
}
''')

print("✅ src/lib/supabase.ts created")

# ─── 2. Create seed SQL file ─────────────────────────────────────────────────
with open("supabase_seed.sql", "w", encoding="utf-8") as f:
    f.write('''-- Run this in Supabase SQL Editor to seed initial data

-- Classes
insert into classes (name, grade, room, teacher, capacity) values
  ('Grade 1 — A', 'Grade 1', '101', 'Ms. Sarah Johnson', 25),
  ('Grade 1 — B', 'Grade 1', '102', 'Mr. David Lee', 25),
  ('Grade 2 — A', 'Grade 2', '201', 'Ms. Emily Carter', 25),
  ('Grade 3 — A', 'Grade 3', '301', 'Mr. James Miller', 25)
on conflict do nothing;

-- Students
insert into students (name, sid, class_id, gender, phone, status) values
  ('Liam Anderson',   'S001', 1, 'Male',   '555-0101', 'Active'),
  ('Olivia Martinez', 'S002', 1, 'Female', '555-0102', 'Active'),
  ('Noah Thompson',   'S003', 2, 'Male',   '555-0103', 'Active'),
  ('Emma Wilson',     'S004', 2, 'Female', '555-0104', 'Active'),
  ('Aiden Brown',     'S005', 3, 'Male',   '555-0105', 'Active'),
  ('Sophia Davis',    'S006', 3, 'Female', '555-0106', 'Active'),
  ('Lucas Garcia',    'S007', 4, 'Male',   '555-0107', 'Active'),
  ('Isabella White',  'S008', 4, 'Female', '555-0108', 'Active')
on conflict (sid) do nothing;

-- Teachers
insert into teachers (name, username, password, subject, class_ids, phone, email, status) values
  ('Ms. Sarah Johnson', 'sarah.johnson', 'teacher', 'Mathematics', ARRAY[1], '555-1001', 'sarah@school.edu', 'Active'),
  ('Mr. David Lee',     'david.lee',     'teacher', 'English',     ARRAY[2], '555-1002', 'david@school.edu', 'Active'),
  ('Ms. Emily Carter',  'emily.carter',  'teacher', 'Science',     ARRAY[3], '555-1003', 'emily@school.edu', 'Active'),
  ('Mr. James Miller',  'james.miller',  'teacher', 'Arabic',      ARRAY[4], '555-1004', 'james@school.edu', 'Active')
on conflict (username) do nothing;
''')

print("✅ supabase_seed.sql created")
print()
print("Next steps:")
print("1. Run supabase_seed.sql in Supabase SQL Editor")
print("2. npm install @supabase/supabase-js")
print("3. Update SchoolApp.jsx to use Supabase")
