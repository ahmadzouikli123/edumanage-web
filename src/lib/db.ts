import { supabase } from './supabase'

export async function syncStudents(students: any[]) {
  if (!students.length) return;
  const rows = students.map((s: any) => ({
    id: s.id, sid: s.sid, name: s.name, class_id: s.classId,
    gender: s.gender, phone: s.phone || null, status: s.status, academic_year: s.academicYear || null,
  }));
  const { error } = await supabase.from('students').upsert(rows, { onConflict: 'id' });
  if (error) console.error('syncStudents:', error.message);
}

export async function loadStudents() {
  const { data, error } = await supabase.from('students').select('*').order('id');
  if (error) { console.error('loadStudents:', error.message); return null; }
  return data.map((s: any) => ({ id: s.id, sid: s.sid, name: s.name, classId: s.class_id, gender: s.gender, phone: s.phone, status: s.status, academicYear: s.academic_year }));
}

export async function syncTeachers(teachers: any[]) {
  if (!teachers.length) return;
  const rows = teachers.map((t: any) => ({
    id: t.id, name: t.name, subject: t.subject || null, email: t.email || null,
    phone: t.phone || null, username: t.username || null, password: t.password || null,
    status: t.status || 'active', start_date: t.startDate || null, class_ids: t.classIds || [],
  }));
  const { error } = await supabase.from('teachers').upsert(rows, { onConflict: 'id' });
  if (error) console.error('syncTeachers:', error.message);
}

export async function loadTeachers() {
  const { data, error } = await supabase.from('teachers').select('*').order('id');
  if (error) { console.error('loadTeachers:', error.message); return null; }
  return data.map((t: any) => ({ id: t.id, name: t.name, subject: t.subject, email: t.email, phone: t.phone, username: t.username, password: t.password, status: t.status, startDate: t.start_date, classIds: t.class_ids || [] }));
}

export async function syncClasses(classes: any[]) {
  if (!classes.length) return;
  const rows = classes.map((c: any) => ({ id: c.id, name: c.name, teacher: c.teacher || null, room: c.room || null }));
  const { error } = await supabase.from('classes').upsert(rows, { onConflict: 'id' });
  if (error) console.error('syncClasses:', error.message);
}

export async function loadClasses() {
  const { data, error } = await supabase.from('classes').select('*').order('id');
  if (error) { console.error('loadClasses:', error.message); return null; }
  return data.map((c: any) => ({ id: c.id, name: c.name, teacher: c.teacher, room: c.room }));
}

export async function syncAttendance(attendance: any) {
  const rows: any[] = [];
  Object.entries(attendance).forEach(([date, dayRec]: any) => {
    Object.entries(dayRec).forEach(([studentId, status]: any) => {
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
  const result: any = {};
  data.forEach((r: any) => {
    if (!result[r.date]) result[r.date] = {};
    result[r.date][r.student_id] = r.status;
  });
  return result;
}

export async function syncMessages(messages: any[]) {
  if (!messages.length) return;
  const rows = messages.map((m: any) => ({
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
  return data.map((m: any) => ({ id: m.id, studentId: m.student_id, tag: m.tag, subject: m.subject, body: m.body, fromSchool: m.from_school, read: m.read, timestamp: m.timestamp, replies: m.replies || [] }));
}
export async function syncSubjects(subjects: any[]) {
  if (!subjects.length) return;
  const rows = subjects.map((s: any) => ({
    id: s.id, class_id: s.classId, name: s.name, icon: s.icon || null,
  }));
  const { error } = await supabase.from('subjects').upsert(rows, { onConflict: 'id' });
  if (error) console.error('syncSubjects:', error.message);
}

export async function loadSubjects() {
  const { data, error } = await supabase.from('subjects').select('*').order('id');
  if (error) { console.error('loadSubjects:', error.message); return null; }
  return data.map((s: any) => ({ id: s.id, classId: s.class_id, name: s.name, icon: s.icon || 'book' }));
}

export async function syncGrades(grades: any) {
  const rows: any[] = [];
  Object.entries(grades).forEach(([studentId, subjects]: any) => {
    Object.entries(subjects).forEach(([subjectId, g]: any) => {
      rows.push({
        student_id: parseInt(studentId),
        subject_id: parseInt(subjectId),
        quiz: g.quiz ?? null,
        homework: g.homework ?? null,
        midterm: g.midterm ?? null,
        final: g.final ?? null,
      });
    });
  });
  if (!rows.length) return;
  const { error } = await supabase.from('grades').upsert(rows, { onConflict: 'student_id,subject_id' });
  if (error) console.error('syncGrades:', error.message);
}

export async function loadGrades() {
  const { data, error } = await supabase.from('grades').select('*');
  if (error) { console.error('loadGrades:', error.message); return null; }
  const result: any = {};
  data.forEach((r: any) => {
    if (!result[r.student_id]) result[r.student_id] = {};
    result[r.student_id][r.subject_id] = {
      quiz: r.quiz, homework: r.homework, midterm: r.midterm, final: r.final,
    };
  });
  return result;
}

export async function syncExams(exams: any[]) {
  if (!exams.length) return;
  const rows = exams.map((e: any) => ({
    id: e.id, class_id: e.classId, subject_id: e.subjectId,
    type: e.type, title: e.title, date: e.date,
    duration: e.duration, max_score: e.maxScore,
    room: e.room || null, notes: e.notes || null,
  }));
  const { error } = await supabase.from('exams').upsert(rows, { onConflict: 'id' });
  if (error) console.error('syncExams:', error.message);
}

export async function loadExams() {
  const { data, error } = await supabase.from('exams').select('*').order('date');
  if (error) { console.error('loadExams:', error.message); return null; }
  return data.map((e: any) => ({
    id: e.id, classId: e.class_id, subjectId: e.subject_id,
    type: e.type, title: e.title, date: e.date,
    duration: e.duration, maxScore: e.max_score,
    room: e.room, notes: e.notes,
  }));
}

export async function syncTimetable(timetable: any) {
  const rows: any[] = [];
  Object.entries(timetable).forEach(([classId, days]: any) => {
    Object.entries(days).forEach(([dayIdx, periods]: any) => {
      Object.entries(periods).forEach(([periodId, slot]: any) => {
        if (!slot || !slot.subjectId) return;
        rows.push({
          class_id: parseInt(classId),
          day_idx: parseInt(dayIdx),
          period_id: String(periodId),
          subject_id: slot.subjectId,
          room: slot.room || null,
        });
      });
    });
  });
  if (!rows.length) return;
  const { error } = await supabase.from('timetable').upsert(rows, { onConflict: 'class_id,day_idx,period_id' });
  if (error) console.error('syncTimetable:', error.message);
}

export async function loadTimetable() {
  const { data, error } = await supabase.from('timetable').select('*');
  if (error) { console.error('loadTimetable:', error.message); return null; }
  const result: any = {};
  data.forEach((r: any) => {
    if (!result[r.class_id]) result[r.class_id] = {};
    if (!result[r.class_id][r.day_idx]) result[r.class_id][r.day_idx] = {};
    result[r.class_id][r.day_idx][r.period_id] = { subjectId: r.subject_id, room: r.room };
  });
  return result;
}
