import { createClient } from "@supabase/supabase-js";

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
