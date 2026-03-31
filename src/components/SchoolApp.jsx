import { useState, useMemo, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

import { useRouter as useNextRouter } from "next/navigation";

const supabase = createClient("https://mhrtzppoiinpnbnximuf.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ocnR6cHBvaWlucG5ibnhpbXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4OTE3MDEsImV4cCI6MjA5MDQ2NzcwMX0.933qWXp0vslGHmt06eKgPuihMOVh4NzGUiHXY4iDNSQ");

// â”€â”€â”€ Theme Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const T = {
  // Brand
  primary:   "#0d9488",
  primaryDk: "#0f766e",
  navy:      "#1e1e3a",
  // Text
  textMain:  "#1e1e3a",
  textSub:   "#64748b",
  textMuted: "#94a3b8",
  // Surfaces
  bg:        "#f1f5f9",
  surface:   "#fff",
  border:    "#e8ecf2",
  rowHover:  "#f8fafc",
  inputBg:   "#f8fafc",
  // Danger
  danger:    "#dc2626",
  dangerBg:  "#fee2e2",
  // Radius / shadow
  radius:    14,
  cardShadow:"0 1px 4px rgba(0,0,0,.06)",
};

const uid = () => Date.now() + Math.random(); // collision-safe unique ID

const inputStyle = {
  width: "100%", padding: "9px 12px", border: `1px solid ${T.border}`,
  borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none",
  color: T.textMain, background: T.inputBg, boxSizing: "border-box",
  transition: "border-color .15s",
};
const inputErrorStyle = { ...inputStyle, border: "1px solid #ef4444", background: "#fff5f5" };
const selectStyle = { ...inputStyle, cursor: "pointer" };


// â”€â”€â”€ Supabase Client â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const _supa = createClient(
  "https://mhrtzppoiinpnbnximuf.supabase.co" || "",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ocnR6cHBvaWlucG5ibnhpbXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4OTE3MDEsImV4cCI6MjA5MDQ2NzcwMX0.933qWXp0vslGHmt06eKgPuihMOVh4NzGUiHXY4iDNSQ" || ""
);

// â”€â”€â”€ DB helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ Status Config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const STATUS_CONFIG = {
  present: { label: "Present", color: "#059669", bg: "#d1fae5", dot: "#10b981", short: "P" },
  absent:  { label: "Absent",  color: "#dc2626", bg: "#fee2e2", dot: "#ef4444", short: "A" },
  late:    { label: "Late",    color: "#d97706", bg: "#fef3c7", dot: "#f59e0b", short: "L" },
  excused: { label: "Excused", color: "#7c3aed", bg: "#ede9fe", dot: "#8b5cf6", short: "E" },
};

// â”€â”€â”€ Seed Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SEED_CLASSES = [
  { id: 1, name: "Grade 1 â€” A", grade: "Grade 1", room: "101", teacher: "Ms. Sarah Johnson", capacity: 25 },
  { id: 2, name: "Grade 1 â€” B", grade: "Grade 1", room: "102", teacher: "Mr. David Lee",     capacity: 25 },
  { id: 3, name: "Grade 2 â€” A", grade: "Grade 2", room: "201", teacher: "Ms. Emily Carter",  capacity: 25 },
  { id: 4, name: "Grade 3 â€” A", grade: "Grade 3", room: "301", teacher: "Mr. James Miller",  capacity: 25 },
];

const SEED_TEACHERS = [
  { id: 1, name: "Ms. Sarah Johnson", username: "sarah.johnson", password: "teacher", subject: "Mathematics", classIds: [1], phone: "555-1001", email: "sarah@al-huffath.edu", status: "Active" },
  { id: 2, name: "Mr. David Lee",     username: "david.lee",     password: "teacher", subject: "English",     classIds: [2], phone: "555-1002", email: "david@al-huffath.edu", status: "Active" },
  { id: 3, name: "Ms. Emily Carter",  username: "emily.carter",  password: "teacher", subject: "Science",     classIds: [3], phone: "555-1003", email: "emily@al-huffath.edu", status: "Active" },
  { id: 4, name: "Mr. James Miller",  username: "james.miller",  password: "teacher", subject: "Arabic",      classIds: [4], phone: "555-1004", email: "james@al-huffath.edu", status: "Active" },
];

const SEED_STUDENTS = [
  { id: 1, name: "Liam Anderson",   sid: "S001", classId: 1, gender: "Male",   phone: "555-0101", status: "Active" },
  { id: 2, name: "Olivia Martinez", sid: "S002", classId: 1, gender: "Female", phone: "555-0102", status: "Active" },
  { id: 3, name: "Noah Thompson",   sid: "S003", classId: 2, gender: "Male",   phone: "555-0103", status: "Active" },
  { id: 4, name: "Emma Wilson",     sid: "S004", classId: 2, gender: "Female", phone: "555-0104", status: "Active" },
  { id: 5, name: "Aiden Brown",     sid: "S005", classId: 3, gender: "Male",   phone: "555-0105", status: "Active" },
  { id: 6, name: "Sophia Davis",    sid: "S006", classId: 3, gender: "Female", phone: "555-0106", status: "Active" },
  { id: 7, name: "Lucas Garcia",    sid: "S007", classId: 4, gender: "Male",   phone: "555-0107", status: "Active" },
  { id: 8, name: "Isabella White",  sid: "S008", classId: 4, gender: "Female", phone: "555-0108", status: "Active" },
];

function seedAttendance(students) {
  const records = {};
  const statuses = ["present", "present", "present", "present", "absent", "late", "excused"];
  const today = new Date();
  for (let d = 6; d >= 1; d--) {
    const date = new Date(today);
    date.setDate(today.getDate() - d);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    const dateStr = date.toISOString().split("T")[0];
    records[dateStr] = {};
    students.forEach(s => {
      records[dateStr][s.id] = statuses[Math.floor(Math.random() * statuses.length)];
    });
  }
  return records;
}

// â”€â”€â”€ localStorage helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

const EMPTY_STUDENT = { name: "", sid: "", classId: 1, gender: "Male", phone: "", status: "Active" };
const EMPTY_CLASS   = { name: "", grade: "", room: "", teacher: "", capacity: 25 };

// â”€â”€â”€ Grades Seed Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SUBJECT_TEMPLATES = ["Mathematics", "English", "Science", "Arabic", "Art"];

const SEED_SUBJECTS = SEED_CLASSES.flatMap((cls, ci) =>
  SUBJECT_TEMPLATES.slice(0, 4).map((name, si) => ({
    id: ci * 10 + si + 1,
    classId: cls.id,
    name,
    icon: ["ðŸ“","ðŸ“–","ðŸ”¬","ðŸŒ™","ðŸŽ¨"][si],
  }))
);

// Grade weights
const WEIGHTS = { quiz: 0.15, homework: 0.15, midterm: 0.30, final: 0.40 };

function calcTotal(g) {
  if (!g) return null;
  const { quiz = null, homework = null, midterm = null, final: fin = null } = g;
  if ([quiz, homework, midterm, fin].every(v => v === null)) return null;
  const q = quiz ?? 0, h = homework ?? 0, m = midterm ?? 0, f = fin ?? 0;
  return Math.round(q * WEIGHTS.quiz + h * WEIGHTS.homework + m * WEIGHTS.midterm + f * WEIGHTS.final);
}

function letterGrade(score) {
  if (score === null) return "â€”";
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

const GRADE_COLOR = {
  A: { bg: "#d1fae5", color: "#059669" },
  B: { bg: "#dbeafe", color: "#1d4ed8" },
  C: { bg: "#fef3c7", color: "#d97706" },
  D: { bg: "#ffe4e6", color: "#e11d48" },
  F: { bg: "#fee2e2", color: "#dc2626" },
  "â€”": { bg: "#f1f5f9", color: "#94a3b8" },
};

function seedGrades(students, subjects) {
  const g = {};
  students.forEach(s => {
    g[s.id] = {};
    subjects.filter(sub => sub.classId === s.classId).forEach(sub => {
      g[s.id][sub.id] = {
        quiz:     Math.floor(Math.random() * 35) + 65,
        homework: Math.floor(Math.random() * 35) + 65,
        midterm:  Math.floor(Math.random() * 40) + 55,
        final:    Math.floor(Math.random() * 40) + 55,
      };
    });
  });
  return g;
}

// â”€â”€â”€ Timetable Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DAYS    = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const PERIODS = [
  { id: 1, label: "Period 1", time: "07:30 â€“ 08:15" },
  { id: 2, label: "Period 2", time: "08:15 â€“ 09:00" },
  { id: 3, label: "Break",    time: "09:00 â€“ 09:20", isBreak: true },
  { id: 4, label: "Period 3", time: "09:20 â€“ 10:05" },
  { id: 5, label: "Period 4", time: "10:05 â€“ 10:50" },
  { id: 6, label: "Break",    time: "10:50 â€“ 11:10", isBreak: true },
  { id: 7, label: "Period 5", time: "11:10 â€“ 11:55" },
  { id: 8, label: "Period 6", time: "11:55 â€“ 12:40" },
];

// Pastel palette for subjects in timetable
const SLOT_COLORS = [
  { bg: "#dbeafe", border: "#93c5fd", text: "#1e40af" },
  { bg: "#d1fae5", border: "#6ee7b7", text: "#065f46" },
  { bg: "#ede9fe", border: "#c4b5fd", text: "#5b21b6" },
  { bg: "#fef3c7", border: "#fcd34d", text: "#92400e" },
  { bg: "#fce7f3", border: "#f9a8d4", text: "#9d174d" },
  { bg: "#ccfbf1", border: "#5eead4", text: "#0f766e" },
];

function subjectColor(name) {
  const idx = (name || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0) % SLOT_COLORS.length;
  return SLOT_COLORS[idx];
}

// Seed: { classId: { dayIdx: { periodId: { subjectId, room } } } }
function seedTimetable(classes, subjects) {
  const tt = {};
  classes.forEach(cls => {
    tt[cls.id] = {};
    DAYS.forEach((_, di) => {
      tt[cls.id][di] = {};
      const classSubs = subjects.filter(s => s.classId === cls.id);
      let subIdx = di % classSubs.length;
      PERIODS.filter(p => !p.isBreak).forEach(p => {
        tt[cls.id][di][p.id] = {
          subjectId: classSubs[subIdx % classSubs.length]?.id || null,
          room: cls.room,
        };
        subIdx++;
      });
    });
  });
  return tt;
}

// â”€â”€â”€ Messaging Constants & Seed â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const MSG_TAGS = {
  general:    { label: "General",          bg: "#dbeafe", color: "#1d4ed8" },
  attendance: { label: "Attendance Alert", bg: "#fef3c7", color: "#b45309" },
  grades:     { label: "Grade Alert",      bg: "#ede9fe", color: "#6d28d9" },
  behavior:   { label: "Behavior",         bg: "#fee2e2", color: "#b91c1c" },
  event:      { label: "School Event",     bg: "#d1fae5", color: "#065f46" },
};

function seedMessages(students) {
  const now = Date.now();
  const mins = (m) => now - m * 60000;
  const msgs = [];
  const templates = [
    { tag: "attendance", subject: "Absence Notice", body: "Your child was marked absent today. Please contact the school if this was unplanned.", fromSchool: true },
    { tag: "grades",     subject: "Mid-term Results Available", body: "Mid-term grades have been published. Please log in to view your child's results.", fromSchool: true },
    { tag: "event",      subject: "School Trip â€” Permission Slip", body: "We have an upcoming field trip on April 15th. Please sign and return the permission slip by April 10th.", fromSchool: true },
    { tag: "general",    subject: "Thank you", body: "Thank you for the update regarding my child's progress. We will make sure to follow up at home.", fromSchool: false },
    { tag: "behavior",   subject: "Classroom Behavior Report", body: "We wanted to inform you that your child had a minor incident in class today. We have spoken with them and the situation is resolved.", fromSchool: true },
  ];
  students.slice(0, 6).forEach((s, i) => {
    const t = templates[i % templates.length];
    const id = i + 1;
    msgs.push({
      id,
      studentId: s.id,
      tag: t.tag,
      subject: t.subject,
      body: t.body,
      fromSchool: t.fromSchool,
      timestamp: mins((i + 1) * 80),
      read: i > 1,
      replies: i === 0 ? [
        { id: 101, fromSchool: false, body: "Thank you for letting us know. We will ensure attendance improves.", timestamp: mins(70) },
        { id: 102, fromSchool: true,  body: "We appreciate your prompt response. Please reach out if you need any support.", timestamp: mins(60) },
      ] : [],
    });
  });
  return msgs;
}

// â”€â”€â”€ Exam Scheduler Constants & Seed â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const EXAM_TYPES = {
  quiz:    { label: "Quiz",         bg: "#dbeafe", color: "#1d4ed8", icon: "ðŸ“" },
  test:    { label: "Chapter Test", bg: "#ede9fe", color: "#6d28d9", icon: "ðŸ“„" },
  midterm: { label: "Midterm",      bg: "#fef3c7", color: "#b45309", icon: "ðŸ“‹" },
  final:   { label: "Final Exam",   bg: "#fee2e2", color: "#b91c1c", icon: "ðŸŽ“" },
};

function getExamStatus(dateStr) {
  const today = new Date().toISOString().split("T")[0];
  if (dateStr > today) return "upcoming";
  if (dateStr === today) return "ongoing";
  return "completed";
}

function seedExams(classes, subjects) {
  const today = new Date();
  const offset = (d) => {
    const dt = new Date(today);
    dt.setDate(today.getDate() + d);
    return dt.toISOString().split("T")[0];
  };
  const exams = [];
  let id = 1;
  const schedule = [
    { classIdx: 0, subIdx: 0, type: "quiz",    daysOffset: -5,  duration: 30,  maxScore: 20  },
    { classIdx: 0, subIdx: 1, type: "test",    daysOffset: -2,  duration: 60,  maxScore: 50  },
    { classIdx: 1, subIdx: 0, type: "midterm", daysOffset: 2,   duration: 90,  maxScore: 100 },
    { classIdx: 2, subIdx: 2, type: "quiz",    daysOffset: 4,   duration: 30,  maxScore: 20  },
    { classIdx: 3, subIdx: 1, type: "final",   daysOffset: 10,  duration: 120, maxScore: 100 },
    { classIdx: 0, subIdx: 2, type: "midterm", daysOffset: -8,  duration: 90,  maxScore: 100 },
    { classIdx: 2, subIdx: 0, type: "test",    daysOffset: 6,   duration: 60,  maxScore: 50  },
  ];
  schedule.forEach(({ classIdx, subIdx, type, daysOffset, duration, maxScore }) => {
    const cls = classes[classIdx];
    const classSubs = subjects.filter(s => s.classId === cls.id);
    const sub = classSubs[subIdx % classSubs.length];
    if (!cls || !sub) return;
    exams.push({
      id: id++, classId: cls.id, subjectId: sub.id, type,
      title: `${EXAM_TYPES[type].label} â€” ${sub.name}`,
      date: offset(daysOffset), duration, maxScore, room: cls.room, notes: "",
    });
  });
  return exams;
}

function seedExamResults(exams, students) {
  const results = {};
  exams.forEach(exam => {
    if (getExamStatus(exam.date) !== "completed") return;
    results[exam.id] = {};
    students.filter(s => s.classId === exam.classId).forEach(s => {
      results[exam.id][s.id] = Math.round(exam.maxScore * (0.45 + Math.random() * 0.50));
    });
  });
  return results;
}

const NAV = [
  { id: "dashboard",  icon: "âŠž", label: "Dashboard"  },
  { id: "students",   icon: "â—‰", label: "Students"   },
  { id: "teachers", icon: "ðŸ‘¤", label: "Teachers" },
  { id: "classes",    icon: "â–¦", label: "Classes"     },
  { id: "attendance", icon: "âœ“", label: "Attendance"  },
  { id: "grades",     icon: "â˜…", label: "Grades"      },
  { id: "timetable",  icon: "â–¦", label: "Timetable"   },
  { id: "messages",   icon: "ðŸ’¬", label: "Messages"   },
  { id: "exams",      icon: "ðŸ“‹", label: "Exams"      },
];



// ─── Teachers Module ──────────────────────────────────────────────────────────
const EMPTY_TEACHER = { name: "", username: "", password: "teacher", subject: "Mathematics", classIds: [], phone: "", email: "", status: "Active" };
const ALL_SUBJECTS  = ["Mathematics", "English", "Science", "Arabic", "Art", "Physical Education", "Islamic Studies", "History"];

function Teachers({ teachers, setTeachers, classes, subjects, userRole }) {
  const [modal,    setModal]    = useState(null);
  const [form,     setForm]     = useState(EMPTY_TEACHER);
  const [errors,   setErrors]   = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [search,   setSearch]   = useState("");
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 2500); };

  const filtered = (teachers || []).filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.subject || "").toLowerCase().includes(search.toLowerCase())
  );

  const openAdd  = () => { setForm({ ...EMPTY_TEACHER }); setErrors({}); setModal({ mode: "add" }); };
  const openEdit = (t) => { setForm({ ...t }); setErrors({}); setModal({ mode: "edit" }); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())     e.name     = "Required";
    if (!form.username.trim()) e.username = "Required";
    if (!form.email.trim())    e.email    = "Required";
    return e;
  };

  const save = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (modal.mode === "add") {
      const newT = { ...form, id: uid() };
      setTeachers(prev => [...prev, newT]);
      dbUpsertTeacher({ ...newT, _dbId: null });
      showToast("Teacher added");
    } else {
      setTeachers(prev => prev.map(t => t.id === form.id ? form : t));
      dbUpsertTeacher({ ...form, _dbId: form.id });
      showToast("Teacher updated");
    }
    setModal(null);
  };

  const doDelete = (id) => {
    dbDeleteTeacher(id);
    setTeachers(prev => prev.filter(t => t.id !== id));
    setDeleteId(null);
    showToast("Teacher deleted");
  };

  const toggleClass = (classId) => {
    const ids = form.classIds || [];
    setForm(f => ({
      ...f,
      classIds: ids.includes(classId) ? ids.filter(id => id !== classId) : [...ids, classId]
    }));
  };

  return (
    <div>
      {toastMsg && (
        <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 999, background: "#1e1e3a", color: "#fff", borderRadius: 10, padding: "12px 20px", fontSize: 13, fontWeight: 500, boxShadow: "0 8px 28px rgba(0,0,0,.22)", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#5eead4" }}>✓</span> {toastMsg}
        </div>
      )}

      {/* Toolbar */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", boxShadow: T.cardShadow }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: T.textMuted }}>🔍</span>
          <input placeholder="Search by name or subject..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 32 }} />
        </div>
        {userRole === "admin" && (
          <button onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: T.primary, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
            ＋ Add Teacher
          </button>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total Teachers", value: (teachers||[]).length,                                           color: T.primary,  bg: "#ccfbf1" },
          { label: "Active",         value: (teachers||[]).filter(t => t.status === "Active").length,        color: "#059669",  bg: "#d1fae5" },
          { label: "Subjects",       value: [...new Set((teachers||[]).map(t => t.subject))].filter(Boolean).length, color: "#7c3aed", bg: "#ede9fe" },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: T.radius, padding: "18px 22px", boxShadow: T.cardShadow }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: s.color, marginTop: 4, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, overflow: "hidden", boxShadow: T.cardShadow }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.textMain }}>Teaching Staff</div>
          <div style={{ fontSize: 12, color: T.textMuted, background: "#f1f5f9", padding: "3px 10px", borderRadius: 20 }}>{filtered.length} teachers</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Teacher", "Username", "Subject", "Classes", "Phone", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: T.textMuted, borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap", letterSpacing: ".05em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 48, textAlign: "center", color: T.textMuted }}>No teachers found</td></tr>
              ) : filtered.map(t => (
                <tr key={t.id} onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar name={t.name} size={34} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: T.textMain }}>{t.name}</div>
                        <div style={{ fontSize: 11, color: T.textMuted }}>{t.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc", fontSize: 12, color: T.textSub, fontFamily: "monospace" }}>{t.username}</td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: "#dbeafe", color: "#1d4ed8" }}>{t.subject}</span>
                  </td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc" }}>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {(t.classIds || []).map(cid => {
                        const cls = (classes||[]).find(c => c.id === cid);
                        return cls ? <span key={cid} style={{ fontSize: 11, padding: "2px 7px", borderRadius: 6, background: "#f1f5f9", color: T.textSub }}>{cls.name}</span> : null;
                      })}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc", fontSize: 13, color: T.textSub }}>{t.phone}</td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc" }}>
                    <span style={{ fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 20, background: t.status === "Active" ? "#d1fae5" : "#fee2e2", color: t.status === "Active" ? "#065f46" : "#991b1b" }}>{t.status}</span>
                  </td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc" }}>
                    {userRole === "admin" && (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => openEdit(t)} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${T.border}`, background: "#fff", fontSize: 12, cursor: "pointer", color: "#334155" }}>Edit</button>
                        <button onClick={() => setDeleteId(t.id)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: T.dangerBg, fontSize: 12, cursor: "pointer", color: T.danger }}>Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <Modal title={modal.mode === "add" ? "Add New Teacher" : "Edit Teacher"} onClose={() => setModal(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Full Name" error={errors.name}>
                <input style={errors.name ? inputErrorStyle : inputStyle} value={form.name}
                  onChange={e => { setForm({ ...form, name: e.target.value }); setErrors(p => ({ ...p, name: "" })); }}
                  placeholder="e.g. Ms. Jane Smith" />
              </Field>
            </div>
            <Field label="Username" error={errors.username}>
              <input style={errors.username ? inputErrorStyle : inputStyle} value={form.username}
                onChange={e => { setForm({ ...form, username: e.target.value }); setErrors(p => ({ ...p, username: "" })); }}
                placeholder="e.g. jane.smith" />
            </Field>
            <Field label="Password">
              <input style={inputStyle} value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} placeholder="teacher" />
            </Field>
            <Field label="Subject">
              <select style={selectStyle} value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                {ALL_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select style={selectStyle} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option>Active</option><option>Inactive</option>
              </select>
            </Field>
            <Field label="Phone">
              <input style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="555-0000" />
            </Field>
            <Field label="Email" error={errors.email}>
              <input style={errors.email ? inputErrorStyle : inputStyle} value={form.email}
                onChange={e => { setForm({ ...form, email: e.target.value }); setErrors(p => ({ ...p, email: "" })); }}
                placeholder="teacher@school.edu" />
            </Field>
            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Assigned Classes">
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                  {(classes||[]).map(c => (
                    <button key={c.id} onClick={() => toggleClass(c.id)} type="button" style={{
                      padding: "5px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 500,
                      background: (form.classIds || []).includes(c.id) ? T.primary : "#f1f5f9",
                      color: (form.classIds || []).includes(c.id) ? "#fff" : T.textSub, border: "none",
                    }}>{c.name}</button>
                  ))}
                </div>
              </Field>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
            <button onClick={() => setModal(null)} style={{ padding: "9px 18px", borderRadius: 8, border: `1px solid ${T.border}`, background: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
            <button onClick={save} style={{ padding: "9px 22px", borderRadius: 8, border: "none", background: T.primary, color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Save</button>
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <Modal title="Delete Teacher?" onClose={() => setDeleteId(null)}>
          <p style={{ fontSize: 14, color: T.textSub, marginBottom: 24 }}>
            This will permanently delete <strong>{(teachers||[]).find(t => t.id === deleteId)?.name}</strong>.
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button onClick={() => setDeleteId(null)} style={{ padding: "9px 18px", borderRadius: 8, border: `1px solid ${T.border}`, background: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
            <button onClick={() => doDelete(deleteId)} style={{ padding: "9px 22px", borderRadius: 8, border: "none", background: T.danger, color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}


export default function App() {
  const [page, setPage] = useState("dashboard");
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("edu_auth");
      if (!stored) { window.location.href = "/school/login"; return; }
      setAuth(JSON.parse(stored));
    } catch { localStorage.clear(); window.location.href = "/school/login"; }
  }, []);

  // Load from Supabase on mount
  useEffect(function() {
    async function loadData() {
      try {
        const dbS = await dbGetStudents();
        const dbC = await dbGetClasses();
        const dbT = await dbGetTeachers();
        const dbA = await dbGetAttendance();
        if (dbS && dbS.length > 0) setStudents(dbS);
        if (dbC && dbC.length > 0) setClasses(dbC);
        if (dbT && dbT.length > 0) setTeachers(dbT);
        if (dbA && Object.keys(dbA).length > 0) setAttendance(function(p){return Object.assign({},p,dbA);});
      } catch(e) { console.error('Supabase:', e); }
    }
    loadData();
  }, []);

  const userRole   = auth?.role     || "admin";
  const teacherClassId = auth?.classId || null;   // classId for teacher
  const teacherName    = auth?.name    || "";

  // â”€â”€â”€ Teacher: pages allowed â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const TEACHER_PAGES = ["dashboard", "attendance", "grades", "timetable", "messages"];
  const PARENT_PAGES  = ["dashboard"];

  const allowedPages = userRole === "teacher" ? TEACHER_PAGES
                     : userRole === "parent"  ? PARENT_PAGES
                     : null; // admin: all pages

  const effectivePage = allowedPages && !allowedPages.includes(page)
    ? "dashboard"
    : page;

  // localStorage persistence â€” load on mount, save on change
  const [students, setStudents]     = useState(SEED_STUDENTS);
  const [dbReady, setDbReady] = useState(false);
  useEffect(() => {
    supabase.from("students").select("*, classes(name)").then(({ data, error }) => {
      if (data && data.length > 0) {
        const mapped = data.map(s => ({
          id: s.id, name: s.name, sid: s.sid,
          classId: s.class_id, gender: s.gender,
          phone: s.phone, status: s.status,
        }));
        setStudents(mapped);
        save("edu_students", mapped);
      }
      setDbReady(true);
    });
  }, []);
  const [teachers, setTeachers]     = useState(() => load("edu_teachers",   SEED_TEACHERS));
  const [classes,  setClasses]      = useState(SEED_CLASSES);
  useEffect(() => {
    supabase.from("classes").select("*").then(({ data }) => {
      if (data && data.length > 0) {
        const mapped = data.map(c => ({
          id: c.id, name: c.name, grade: c.grade,
          room: c.room, teacher: c.teacher, capacity: c.capacity || 25,
        }));
        setClasses(mapped);
        save("edu_classes", mapped);
      }
    });
  }, []);
  const [attendance, setAttendance] = useState(() => load("edu_attendance", seedAttendance(SEED_STUDENTS)));
  const [subjects, setSubjects]     = useState(() => load("edu_subjects",   SEED_SUBJECTS));
  const [grades,   setGrades]       = useState(() => load("edu_grades",     seedGrades(SEED_STUDENTS, SEED_SUBJECTS)));
  const [timetable, setTimetable]   = useState(() => load("edu_timetable",  seedTimetable(SEED_CLASSES, SEED_SUBJECTS)));
  const [messages,  setMessages]    = useState(() => load("edu_messages",     seedMessages(SEED_STUDENTS)));
  const [exams,     setExams]       = useState(() => load("edu_exams",        seedExams(SEED_CLASSES, SEED_SUBJECTS)));
  const [examResults, setExamResults] = useState(() => load("edu_exam_results", seedExamResults(seedExams(SEED_CLASSES, SEED_SUBJECTS), SEED_STUDENTS)));

  useEffect(() => { save("edu_students",    students);    }, [students]);
  useEffect(() => { save("edu_teachers",     teachers);     }, [teachers]);
  useEffect(() => { save("edu_classes",     classes);     }, [classes]);
  useEffect(() => { save("edu_attendance",  attendance);  }, [attendance]);
  useEffect(() => { save("edu_subjects",    subjects);    }, [subjects]);
  useEffect(() => { save("edu_grades",      grades);      }, [grades]);
  useEffect(() => { save("edu_timetable",   timetable);   }, [timetable]);
  useEffect(() => { save("edu_messages",    messages);    }, [messages]);
  useEffect(() => { save("edu_exams",       exams);       }, [exams]);
  useEffect(() => { save("edu_exam_results",examResults); }, [examResults]);

  const PAGE_TITLES = {
    dashboard:  { title: "Dashboard",  sub: "Overview of your school" },
    students:   { title: "Students",   sub: "Manage student records" },
    classes:    { title: "Classes",    sub: "Manage classrooms & teachers" },
    attendance: { title: "Attendance", sub: "Track daily attendance" },
    grades:     { title: "Grades",     sub: "Enter grades & view report cards" },
    timetable:  { title: "Timetable",  sub: "Weekly schedule for each class" },
    messages:   { title: "Messages",    sub: "Communicate with parents & guardians" },
    exams:      { title: "Exams",       sub: "Schedule exams & record results" },
    teachers:   { title: "Teachers",    sub: "Manage teaching staff & assignments" },
  };

  if (!auth) return null;

  if (auth.role === "parent") {
    const student = students.find(s => s.id === auth.studentId);
    if (!student) { localStorage.clear(); window.location.href = "/school/login"; return null; }
    
useEffect(() => {
  loadStudents();
  loadTeachers();
  loadClasses();
}, []);

const loadStudents = async () => {
  const { data, error } = await supabase.from("students").select("*").order("id");
  if (!error) setStudents(data || []);
};

const loadTeachers = async () => {
  const { data, error } = await supabase.from("teachers").select("*").order("id");
  if (!error) setTeachers(data || []);
};

const loadClasses = async () => {
  const { data, error } = await supabase.from("classes").select("*").order("id");
  if (!error) setClasses(data || []);
};

return (
      <div style={{minHeight:"100vh",background:"#f1f5f9",fontFamily:"system-ui,sans-serif"}}>
        <div style={{background:"#1e1e3a",padding:"0 24px",display:"flex",alignItems:"center",gap:14,height:56}}>
          <div style={{fontSize:14,fontWeight:700,color:"#5eead4",flex:1}}>EduManage</div>
          <span style={{fontSize:12,color:"rgba(255,255,255,.5)"}}>Parent Portal</span>
          <Avatar name={student.name} size={28} />
          <span style={{fontSize:12,color:"rgba(255,255,255,.7)",fontWeight:500}}>{student.name}</span>
          <button onClick={()=>{localStorage.clear(); window.location.href="/school/login";}} style={{padding:"6px 14px",borderRadius:7,border:"1px solid rgba(255,255,255,.15)",background:"rgba(220,38,38,.2)",color:"#fca5a5",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Sign Out</button>
        </div>
        <div style={{padding:"24px 20px",maxWidth:900,margin:"0 auto"}}>
          <StudentProfile
            student={student} classes={classes} attendance={attendance}
            grades={grades} subjects={subjects} exams={exams}
            examResults={examResults} messages={messages}
            onClose={null}
          />
        </div>
      </div>
    );
  }

  
useEffect(() => {
  loadStudents();
  loadTeachers();
  loadClasses();
}, []);

const loadStudents = async () => {
  const { data, error } = await supabase.from("students").select("*").order("id");
  if (!error) setStudents(data || []);
};

const loadTeachers = async () => {
  const { data, error } = await supabase.from("teachers").select("*").order("id");
  if (!error) setTeachers(data || []);
};

const loadClasses = async () => {
  const { data, error } = await supabase.from("classes").select("*").order("id");
  if (!error) setClasses(data || []);
};

return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.bg, fontFamily: "system-ui,-apple-system,sans-serif", direction: "rtl" }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: T.navy, display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh", order: 2 }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "flex-end" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#5eead4" }}>Al-Huffath Academy</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)", marginTop: 2 }}>Ilm | Iman | Hifz</div>
            </div>
            <img src="/logo.png" style={{ width: 44, height: 44, objectFit: "contain", background: "#fff", borderRadius: 8, padding: 3, flexShrink: 0 }} />
          </div>
        </div>
        <nav style={{ flex: 1, padding: "14px 10px", display: "flex", flexDirection: "column", gap: 3 }}>
          {NAV.filter(n => !allowedPages || allowedPages.includes(n.id)).map(n => {
            const unreadCount = n.id === "messages" ? messages.filter(m => !m.read).length : 0;
            
useEffect(() => {
  loadStudents();
  loadTeachers();
  loadClasses();
}, []);

const loadStudents = async () => {
  const { data, error } = await supabase.from("students").select("*").order("id");
  if (!error) setStudents(data || []);
};

const loadTeachers = async () => {
  const { data, error } = await supabase.from("teachers").select("*").order("id");
  if (!error) setTeachers(data || []);
};

const loadClasses = async () => {
  const { data, error } = await supabase.from("classes").select("*").order("id");
  if (!error) setClasses(data || []);
};

return (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8,
              cursor: "pointer", fontSize: 13, border: "none", width: "100%", textAlign: "right",
              background: page === n.id ? T.primary : "transparent",
              color: page === n.id ? "#fff" : "rgba(255,255,255,.55)",
              fontFamily: "inherit", transition: "all .15s",
            }}>
              <span style={{ fontSize: 15 }}>{n.icon}</span>
              <span style={{ flex: 1 }}>{n.label}</span>
              {unreadCount > 0 && (
                <span style={{ background: "#ef4444", color: "#fff", borderRadius: 20, fontSize: 10, fontWeight: 700, padding: "1px 6px", minWidth: 18, textAlign: "center" }}>{unreadCount}</span>
              )}
            </button>
            );
          })}
        </nav>
        <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <Avatar name="Admin User" size={30} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,.8)" }}>Admin</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)" }}>admin@al-huffath.edu</div>
            </div>
          </div>
          <LogoutButton />
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, order: 1 }}>
        <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "16px 28px", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 3px rgba(0,0,0,.05)" }}>
          <div style={{ fontSize: 19, fontWeight: 700, color: T.textMain }}>{PAGE_TITLES[page].title}</div>
          <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>{PAGE_TITLES[page].sub}</div>
        </div>
        <div style={{ padding: 28, flex: 1 }}>
          {page === "dashboard"  && <Dashboard  students={students} classes={classes} attendance={attendance} grades={grades} subjects={subjects} timetable={timetable} messages={messages} exams={exams} onNavigate={setPage} />}
          {effectivePage === "teachers"  && userRole === "admin" && <Teachers userRole={userRole} teachers={teachers} setTeachers={setTeachers} classes={classes} subjects={subjects} />}
          {page === "students"   && <Students   students={students} setStudents={setStudents} classes={classes} attendance={attendance} grades={grades} subjects={subjects} exams={exams} examResults={examResults} messages={messages} />}
          {page === "classes"    && <Classes    classes={classes}   setClasses={setClasses}   students={students} />}
          {page === "attendance" && <Attendance students={students} classes={classes} attendance={attendance} setAttendance={setAttendance} />}
          {page === "grades"     && <Grades     students={students} classes={classes} subjects={subjects} grades={grades} setGrades={setGrades} />}
          {page === "timetable"  && <Timetable  classes={classes} subjects={subjects} timetable={timetable} setTimetable={setTimetable} />}
          {page === "messages"   && <Messaging  students={students} classes={classes} messages={messages} setMessages={setMessages} />}
          {page === "exams"      && <ExamScheduler students={students} classes={classes} subjects={subjects} exams={exams} setExams={setExams} examResults={examResults} setExamResults={setExamResults} />}
        </div>
      </div>
    </div>
  );
}

