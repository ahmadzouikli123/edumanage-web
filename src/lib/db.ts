'use client'
import { supabase } from './supabase'

// ─── Students ────────────────────────────────────────────────────────────────
export async function syncStudents(students: any[]) {
  if (!students.length) return;
  const rows = students.map(s => ({
    id: s.id,
    sid: s.sid,
    name: s.name,
    class_id: s.classId,
    gender: s.gender,
    phone: s.phone || null,
    status: s.status,
    academic_year: s.academicYear || null,
  }));
  const { error } = await supabase.from('students').upsert(rows, { onConflict: 'id' });
  if (error) console.error('syncStudents:', error.message);
}

export async function loadStudents() {
  const { data, error } = await supabase.from('students').select('*').order('id');
  if (error) { console.error('loadStudents:', error.message); return null; }
  return data.map((s: any) => ({
    id: s.id, sid: s.sid, name: s.name, classId: s.class_id,
    gender: s.gender, phone: s.phone, status: s.status, academicYear: s.academic_year,
  }));
}

export async function deleteStudent(id: number) {
  const { error } = await supabase.from('students').delete().eq('id', id);
  if (error) console.error('deleteStudent:', error.message);
}

// ─── Teachers ────────────────────────────────────────────────────────────────
export async function syncTeachers(teachers: any[]) {
  if (!teachers.length) return;
  const rows = teachers.map(t => ({
    id: t.id,
    name: t.name,
    subject: t.subject || null,
    email: t.email || null,
    phone: t.phone || null,
    username: t.username || null,
    password: t.password || null,
    status: t.status || 'active',
    start_date: t.startDate || null,
    class_ids: t.classIds || [],
  }));
  const { error } = await supabase.from('teachers').upsert(rows, { onConflict: 'id' });
  if (error) console.error('syncTeachers:', error.message);
}

export async function loadTeachers() {
  const { data, error } = await supabase.from('teachers').select('*').order('id');
  if (error) { console.error('loadTeachers:', error.message); return null; }
  return data.map((t: any) => ({
    id: t.id, name: t.name, subject: t.subject, email: t.email,
    phone: t.phone, username: t.username, password: t.password,
    status: t.status, startDate: t.start_date, classIds: t.class_ids || [],
  }));
}

export async function deleteTeacher(id: number) {
  const { error } = await supabase.from('teachers').delete().eq('id', id);
  if (error) console.error('deleteTeacher:', error.message);
}

// ─── Classes ─────────────────────────────────────────────────────────────────
export async function syncClasses(classes: any[]) {
  if (!classes.length) return;
  const rows = classes.map(c => ({ id: c.id, name: c.name, teacher: c.teacher || null, room: c.room || null }));
  const { error } = await supabase.from('classes').upsert(rows, { onConflict: 'id' });
  if (error) console.error('syncClasses:', error.message);
}

export async function loadClasses() {
  const { data, error } = await supabase.from('classes').select('*').order('id');
  if (error) { console.error('loadClasses:', error.message); return null; }
  return data.map((c: any) => ({ id: c.id, name: c.name, teacher: c.teacher, room: c.room }));
}

// ─── Attendance ──────────────────────────────────────────────────────────────
export async function syncAttendance(attendance: Record<string, Record<number, string>>) {
  const rows: any[] = [];
  Object.entries(attendance).forEach(([date, dayRec]) => {
    Object.entries(dayRec).forEach(([studentId, status]) => {
      rows.push({ student_id: parseInt(studentId), date, status });
    });
  });
  if (!rows.length) return;
  const { error } = await supabase.from('attendance').upsert(rows, { onConflict: 'student_id,date' });
  if (error) console.error('syncAttendance:', error.message);
}

export async function loadAttendance() {
  const { data, error } = await supabase.from('attendance').select('*');
  if (error) { console.error('loadAttendance:', error.message); return null; }
  const result: Record<string, Record<number, string>> = {};
  data.forEach((r: any) => {
    if (!result[r.date]) result[r.date] = {};
    result[r.date][r.student_id] = r.status;
  });
  return result;
}

// ─── Messages ────────────────────────────────────────────────────────────────
export async function syncMessages(messages: any[]) {
  if (!messages.length) return;
  const rows = messages.map(m => ({
    id: m.id, student_id: m.studentId, tag: m.tag, subject: m.subject,
    body: m.body, from_school: m.fromSchool, read: m.read,
    timestamp: m.timestamp, replies: m.replies || [],
  }));
  const { error } = await supabase.from('messages').upsert(rows, { onConflict: 'id' });
  if (error) console.error('syncMessages:', error.message);
}

export async function loadMessages() {
  const { data, error } = await supabase.from('messages').select('*').order('timestamp', { ascending: false });
  if (error) { console.error('loadMessages:', error.message); return null; }
  return data.map((m: any) => ({
    id: m.id, studentId: m.student_id, tag: m.tag, subject: m.subject,
    body: m.body, fromSchool: m.from_school, read: m.read,
    timestamp: m.timestamp, replies: m.replies || [],
  }));
}
