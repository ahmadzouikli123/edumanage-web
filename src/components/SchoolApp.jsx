﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿const supabase = {
  from: (name) => {
    const key = "edu_" + name;
    const loadT = () => { try { return JSON.parse(localStorage.getItem(key)||"[]"); } catch{return[];} };
    const saveT = (d) => { try { localStorage.setItem(key, JSON.stringify(d)); } catch{} };
    return {
      select: (_q) => ({ order: () => ({ then: (fn) => { fn({data:loadT(),error:null}); return {catch:()=>{}}; } }), then: (fn) => { fn({data:loadT(),error:null}); return {catch:()=>{}}; } }),
      insert: (rows) => ({ select: () => ({ then: (fn) => { const d=loadT(); const nr=rows.map((r,i)=>({...r,id:r.id||Date.now()+i})); saveT([...d,...nr]); fn({data:nr,error:null}); } }) }),
      update: (vals) => ({ eq: (k,v) => ({ then: (fn) => { const d=loadT().map(r=>String(r[k])===String(v)?{...r,...vals}:r); saveT(d); fn({data:d,error:null}); } }) }),
      delete: () => ({ eq: (k,v) => ({ then: (fn) => { saveT(loadT().filter(r=>String(r[k])!==String(v))); fn({data:null,error:null}); } }) }),
      upsert: (rows) => ({ then: (fn) => { fn({data:rows,error:null}); } }),
    };
  }
};
const _SB={url:"https://mhrtzppoiinpnbnximuf.supabase.co",key:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ocnR6cHBvaWlucG5ibnhpbXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4OTE3MDEsImV4cCI6MjA5MDQ2NzcwMX0.933qWXp0vslGHmt06eKgPuihMOVh4NzGUiHXY4iDNSQ",headers:{"apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ocnR6cHBvaWlucG5ibnhpbXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4OTE3MDEsImV4cCI6MjA5MDQ2NzcwMX0.933qWXp0vslGHmt06eKgPuihMOVh4NzGUiHXY4iDNSQ","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ocnR6cHBvaWlucG5ibnhpbXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4OTE3MDEsImV4cCI6MjA5MDQ2NzcwMX0.933qWXp0vslGHmt06eKgPuihMOVh4NzGUiHXY4iDNSQ","Content-Type":"application/json","Prefer":"resolution=merge-duplicates"},async get(t,q){try{const r=await fetch(this.url+"/rest/v1/"+t+"?"+(q||"select=*"),{headers:this.headers});if(!r.ok)return null;return r.json();}catch(e){return null;}},async upsert(t,rows,c){if(!rows||!rows.length)return;try{await fetch(this.url+"/rest/v1/"+t+"?on_conflict="+c,{method:"POST",headers:this.headers,body:JSON.stringify(rows)});}catch(e){}}};
async function sbLoadStudents(){const d=await _SB.get("students","select=*&order=id");return d?d.map(s=>({id:s.id,sid:s.sid,name:s.name,classId:s.class_id,gender:s.gender,phone:s.phone,status:s.status,academicYear:s.academic_year})):null;}
async function sbLoadTeachers(){const d=await _SB.get("teachers","select=*&order=id");return d?d.map(t=>({id:t.id,name:t.name,subject:t.subject,email:t.email,phone:t.phone,username:t.username,password:t.password,status:t.status,startDate:t.start_date,classIds:t.class_ids||[]})):null;}
async function sbLoadClasses(){const d=await _SB.get("classes","select=*&order=id");return d?d.map(c=>({id:c.id,name:c.name,teacher:c.teacher,room:c.room})):null;}
async function sbLoadAttendance(){const d=await _SB.get("attendance","select=*");if(!d)return null;const r={};d.forEach(row=>{if(!r[row.date])r[row.date]={};r[row.date][row.student_id]=row.status;});return r;}
async function sbLoadGrades(){const d=await _SB.get("grades","select=*");if(!d)return null;const r={};d.forEach(row=>{if(!r[row.student_id])r[row.student_id]={};r[row.student_id][row.subject_id]={quiz:row.quiz,homework:row.homework,midterm:row.midterm,final:row.final};});return r;}
async function sbLoadSubjects(){const d=await _SB.get("subjects","select=*&order=id");return d?d.map(s=>({id:s.id,classId:s.class_id,name:s.name,icon:s.icon||"book"})):null;}
async function sbSyncStudents(s){await _SB.upsert("students",s.map(x=>({id:x.id,sid:x.sid,name:x.name,class_id:x.classId,gender:x.gender||null,phone:x.phone||null,status:x.status||"active",academic_year:x.academicYear||null})),"id");}
async function sbSyncTeachers(t){await _SB.upsert("teachers",t.map(x=>({id:x.id,name:x.name,subject:x.subject||null,email:x.email||null,phone:x.phone||null,username:x.username||null,password:x.password||null,status:x.status||"active",start_date:x.startDate||null,class_ids:x.classIds||[]})),"id");}
async function sbSyncClasses(cl){await _SB.upsert("classes",cl.map(x=>({id:x.id,name:x.name,teacher:x.teacher||null,room:x.room||null})),"id");}
async function sbSyncAttendance(att){const rows=[];Object.entries(att).forEach(([date,day])=>{Object.entries(day).forEach(([sid,status])=>rows.push({student_id:parseInt(sid),date,status}));});if(rows.length)await _SB.upsert("attendance",rows,"student_id,date");}
async function sbSyncGrades(gr){const rows=[];Object.entries(gr).forEach(([sid,subs])=>{Object.entries(subs).forEach(([subId,g])=>rows.push({student_id:parseInt(sid),subject_id:parseInt(subId),quiz:g.quiz??null,homework:g.homework??null,midterm:g.midterm??null,final:g.final??null}));});if(rows.length)await _SB.upsert("grades",rows,"student_id,subject_id");}
async function sbSyncSubjects(sub){await _SB.upsert("subjects",sub.map(s=>({id:s.id,class_id:s.classId,name:s.name,icon:s.icon||null})),"id");}
import { useState, useMemo, useEffect, useCallback } from "react";
// Amiri Quran font loaded via CSS

import { useRouter as useNextRouter } from "next/navigation";

// ─── Theme Constants ──────────────────────────────────────────────────────────
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

const uid = () => Date.now() + Math.random();

// ─── Academic Year ────────────────────────────────────────────────────────────
function getCurrentAcademicYear() {
  const now = new Date();
  const y = now.getFullYear();
  return now.getMonth() >= 8 ? (y + "/" + (y+1)) : ((y-1) + "/" + y);
}
const CURRENT_YEAR = getCurrentAcademicYear();
function getAcademicYears(students) {
  const years = [...new Set((students||[]).map(s => s.academicYear).filter(Boolean))];
  if (!years.includes(CURRENT_YEAR)) years.unshift(CURRENT_YEAR);
  return years.sort().reverse();
}

 // collision-safe unique ID

const inputStyle = {
  width: "100%", padding: "9px 12px", border: `1px solid ${T.border}`,
  borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none",
  color: T.textMain, background: T.inputBg, boxSizing: "border-box",
  transition: "border-color .15s",
};
const inputErrorStyle = { ...inputStyle, border: "1px solid #ef4444", background: "#fff5f5" };
const selectStyle = { ...inputStyle, cursor: "pointer" };


// ─── Mobile CSS ───────────────────────────────────────────────────────────────
const MOBILE_CSS = `
  @media (max-width: 768px) {
    .edu-sidebar { position: fixed !important; left: 0; top: 0; height: 100vh; z-index: 50; transform: translateX(-100%); transition: transform .25s ease; }
    .edu-sidebar.open { transform: translateX(0) !important; }
    .edu-overlay { display: block !important; position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 40; cursor: pointer; }
    .edu-menu-btn { display: flex !important; }
    .edu-content { padding: 12px !important; }
    .edu-header-inner { padding: 12px 14px !important; }
  }
  @media (min-width: 769px) {
    .edu-overlay { display: none !important; }
    .edu-menu-btn { display: none !important; }
    .edu-sidebar { transform: translateX(0) !important; position: sticky !important; }
  }
  @media (max-width: 640px) {
    .edu-grid-6 { grid-template-columns: repeat(2,1fr) !important; gap: 10px !important; }
    .edu-grid-4 { grid-template-columns: repeat(2,1fr) !important; }
    .edu-grid-2 { grid-template-columns: 1fr !important; }
    .edu-modal-box { width: 95vw !important; padding: 18px 14px !important; max-height: 90vh; overflow-y: auto; }
  }
`;

// ─── Status Config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  present: { label: "Present", color: "#059669", bg: "#d1fae5", dot: "#10b981", short: "P" },
  absent:  { label: "Absent",  color: "#dc2626", bg: "#fee2e2", dot: "#ef4444", short: "A" },
  late:    { label: "Late",    color: "#d97706", bg: "#fef3c7", dot: "#f59e0b", short: "L" },
  excused: { label: "Excused", color: "#7c3aed", bg: "#ede9fe", dot: "#8b5cf6", short: "E" },
};

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED_CLASSES = [
  { id: 1, name: "Grade 1 — A", grade: "Grade 1", room: "101", teacher: "Ms. Sarah Johnson", capacity: 25 },
  { id: 2, name: "Grade 1 — B", grade: "Grade 1", room: "102", teacher: "Mr. David Lee",     capacity: 25 },
  { id: 3, name: "Grade 2 — A", grade: "Grade 2", room: "201", teacher: "Ms. Emily Carter",  capacity: 25 },
  { id: 4, name: "Grade 3 — A", grade: "Grade 3", room: "301", teacher: "Mr. James Miller",  capacity: 25 },
];

const SEED_TEACHERS = [
  { id: 1, name: "Ms. Sarah Johnson", username: "sarah.johnson", password: "teacher", subject: "Mathematics", classIds: [1], phone: "555-1001", email: "sarah@al-huffath.edu", status: "Active" },
  { id: 2, name: "Mr. David Lee",     username: "david.lee",     password: "teacher", subject: "English",     classIds: [2], phone: "555-1002", email: "david@al-huffath.edu", status: "Active" },
  { id: 3, name: "Ms. Emily Carter",  username: "emily.carter",  password: "teacher", subject: "Science",     classIds: [3], phone: "555-1003", email: "emily@al-huffath.edu", status: "Active" },
  { id: 4, name: "Mr. James Miller",  username: "james.miller",  password: "teacher", subject: "Arabic",      classIds: [4], phone: "555-1004", email: "james@al-huffath.edu", status: "Active" },
];

const SEED_STUDENTS = [
  { id: 1, name: "Liam Anderson",   sid: "S001", classId: 1, gender: "Male",   phone: "555-0101", status: "Active", academicYear: "2025/2026" },
  { id: 2, name: "Olivia Martinez", sid: "S002", classId: 1, gender: "Female", phone: "555-0102", status: "Active", academicYear: "2025/2026" },
  { id: 3, name: "Noah Thompson",   sid: "S003", classId: 2, gender: "Male",   phone: "555-0103", status: "Active", academicYear: "2025/2026" },
  { id: 4, name: "Emma Wilson",     sid: "S004", classId: 2, gender: "Female", phone: "555-0104", status: "Active", academicYear: "2025/2026" },
  { id: 5, name: "Aiden Brown",     sid: "S005", classId: 3, gender: "Male",   phone: "555-0105", status: "Active", academicYear: "2025/2026" },
  { id: 6, name: "Sophia Davis",    sid: "S006", classId: 3, gender: "Female", phone: "555-0106", status: "Active", academicYear: "2025/2026" },
  { id: 7, name: "Lucas Garcia",    sid: "S007", classId: 4, gender: "Male",   phone: "555-0107", status: "Active", academicYear: "2025/2026" },
  { id: 8, name: "Isabella White",  sid: "S008", classId: 4, gender: "Female", phone: "555-0108", status: "Active", academicYear: "2025/2026" },
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

// ─── localStorage helpers ─────────────────────────────────────────────────────
function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

const EMPTY_STUDENT = { name: "", sid: "", classId: 1, gender: "Male", phone: "", status: "Active" };
const EMPTY_CLASS   = { name: "", grade: "", room: "", teacher: "", capacity: 25 };

// ─── Grades Seed Data ─────────────────────────────────────────────────────────
const SUBJECT_TEMPLATES = ["Mathematics", "English", "Science", "Arabic", "Art"];

const SEED_SUBJECTS = SEED_CLASSES.flatMap((cls, ci) =>
  SUBJECT_TEMPLATES.slice(0, 4).map((name, si) => ({
    id: ci * 10 + si + 1,
    classId: cls.id,
    name,
    icon: ["📐","📖","🔬","🌙","🎨"][si],
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
  if (score === null) return "—";
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
  "—": { bg: "#f1f5f9", color: "#94a3b8" },
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

// ─── Timetable Constants ──────────────────────────────────────────────────────
const DAYS    = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const PERIODS = [
  { id: 1, label: "Period 1", time: "07:30 – 08:15" },
  { id: 2, label: "Period 2", time: "08:15 – 09:00" },
  { id: 3, label: "Break",    time: "09:00 – 09:20", isBreak: true },
  { id: 4, label: "Period 3", time: "09:20 – 10:05" },
  { id: 5, label: "Period 4", time: "10:05 – 10:50" },
  { id: 6, label: "Break",    time: "10:50 – 11:10", isBreak: true },
  { id: 7, label: "Period 5", time: "11:10 – 11:55" },
  { id: 8, label: "Period 6", time: "11:55 – 12:40" },
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

// ─── Messaging Constants & Seed ───────────────────────────────────────────────
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
    { tag: "event",      subject: "School Trip — Permission Slip", body: "We have an upcoming field trip on April 15th. Please sign and return the permission slip by April 10th.", fromSchool: true },
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

// ─── Exam Scheduler Constants & Seed ─────────────────────────────────────────
const EXAM_TYPES = {
  quiz:    { label: "Quiz",         bg: "#dbeafe", color: "#1d4ed8", icon: "📝" },
  test:    { label: "Chapter Test", bg: "#ede9fe", color: "#6d28d9", icon: "📄" },
  midterm: { label: "Midterm",      bg: "#fef3c7", color: "#b45309", icon: "📋" },
  final:   { label: "Final Exam",   bg: "#fee2e2", color: "#b91c1c", icon: "🎓" },
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
      title: `${EXAM_TYPES[type].label} — ${sub.name}`,
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
  { id: "dashboard",  icon: "⊞", label: "Dashboard"  },
  { id: "students",   icon: "◉", label: "Students"   },
  { id: "teachers", icon: "👤", label: "Teachers" },
  { id: "classes",    icon: "▦", label: "Classes"     },
  { id: "attendance", icon: "✓", label: "Attendance"  },
  { id: "grades",     icon: "★", label: "Grades"      },
  { id: "timetable",  icon: "▦", label: "Timetable"   },
  { id: "messages",   icon: "💬", label: "Messages"   },
  { id: "exams",      icon: "📋", label: "Exams"      },
  { id: "quizzes",    icon: "📝", label: "Quizzes"    },
  { id: "lessonplans",   icon: "📚", label: "Lesson Plans" },
  { id: "evaluations",   icon: "⭐", label: "Evaluations"  },
  { id: "quran",          icon: "🕌", label: "Quran"         },
  { id: "settings",   icon: "⚙️", label: "Settings"   },
];



function Teachers({ userRole, classes = [] }) {
  const [teachers, setTeachers] = useState(() => { try { const v = localStorage.getItem("edu_teachers"); return v ? JSON.parse(v) : SEED_TEACHERS; } catch { return SEED_TEACHERS; } });
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  useEffect(() => { try { localStorage.setItem("edu_teachers", JSON.stringify(teachers)); } catch {} }, [teachers]);

  const printTeacherReport = (teacher) => {
    const today = new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
    const startDate = teacher.startDate ? new Date(teacher.startDate).toLocaleDateString("en-GB") : "N/A";
    const win = window.open("", "_blank");
    win.document.write(`<!DOCTYPE html><html><head><title>Teacher Report - ${teacher.name}</title><style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:'Times New Roman',serif;color:#1a1a1a;background:#fff;padding:60px;max-width:800px;margin:0 auto}
      .header{display:flex;align-items:center;border-bottom:3px solid #0d9488;padding-bottom:16px;margin-bottom:30px}
      .logo{width:70px;height:70px;object-fit:contain;margin-right:20px}
      .school-center{flex:1;text-align:center}
      .school-name{font-size:22px;font-weight:bold;color:#0d9488}
      .school-sub{font-size:12px;color:#64748b;margin-top:3px}
      .date{text-align:left;margin-bottom:24px;font-size:14px}
      .to{margin-bottom:20px;font-size:14px;font-weight:bold}
      .object{font-size:14px;font-weight:bold;border-bottom:2px solid #1a1a1a;padding-bottom:6px;margin-bottom:24px;text-transform:uppercase;letter-spacing:1px}
      .object span{font-weight:normal;margin-left:12px}
      p{font-size:14px;line-height:1.9;margin-bottom:14px}
      table{width:100%;border-collapse:collapse;margin:16px 0}
      td{padding:9px 14px;border:1px solid #d1d5db;font-size:13px}
      td:first-child{background:#f9fafb;font-weight:bold;width:38%}
      .sig{margin-top:50px}
      .sig-line{border-top:1px solid #1a1a1a;width:200px;margin-top:48px;margin-bottom:6px}
      .footer{margin-top:40px;padding-top:12px;border-top:1px solid #e5e7eb;text-align:center;font-size:11px;color:#9ca3af}
      @media print{button{display:none!important}}
    </style></head><body>
    <div class="header">
      <img src="/logo.png" class="logo" onerror="this.style.display='none'" />
      <div class="school-center">
        <div class="school-name">Al-Huffath Academy</div>
        <div class="school-sub">Ilm | Iman | Hifz</div>
        <div class="school-sub">admin@al-huffath.edu</div>
      </div>
    </div>
    <div class="date">${today}</div>
    <div class="to">To Whom It May Concern,</div>
    <div class="object">OBJECT: <span>Confirmation of Employment & Teaching Record</span></div>
    <p>This letter is issued by Al-Huffath Academy administration to confirm the employment and teaching record of the staff member detailed below:</p>
    <table>
      <tr><td>Full Name</td><td>${teacher.name}</td></tr>
      <tr><td>Subject Taught</td><td>${teacher.subject || "-"}</td></tr>
      <tr><td>Email Address</td><td>${teacher.email || "-"}</td></tr>
      <tr><td>Phone Number</td><td>${teacher.phone || "-"}</td></tr>
      <tr><td>Employment Status</td><td>${teacher.status || "-"}</td></tr>
      <tr><td>Start Date</td><td>${startDate}</td></tr>
      <tr><td>Report Issued On</td><td>${today}</td></tr>
    </table>
    <p>This confirmation is provided upon request for administrative and verification purposes.</p>
    <p>If you require any additional information, please contact the school administration.</p>
    <div class="sig">
      <p>Regards,</p>
      <div class="sig-line"></div>
      <p style="font-weight:bold;font-size:13px">School Principal</p>
      <p style="font-size:12px;color:#64748b">Al-Huffath Academy</p>
    </div>
    <div style="margin-top:28px"><button onclick="window.print()" style="padding:10px 28px;background:#0d9488;color:#fff;border:none;border-radius:6px;font-size:14px;cursor:pointer">Print Letter</button></div>
    <div class="footer">Generated by EduManage &nbsp;|&nbsp; Developed by Eng. Ahmad Zouikli &nbsp;|&nbsp; ${today}</div>
    </body></html>`);
    win.document.close();
  };
  const filtered = teachers.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.subject||'').toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const checkedClasses = Array.from(form.querySelectorAll('input[name="classIds"]:checked')).map(cb => parseInt(cb.value));
    const newTeacher = {
      id: editing ? editing.id : Date.now(),
      name: form.name.value,
      subject: form.subject.value,
      phone: form.phone.value,
      email: form.email.value,
      status: form.status.value,
      startDate: form.startDate.value,
      classIds: checkedClasses,
    };
    
    if (editing) {
      setTeachers(teachers.map(t => t.id === editing.id ? newTeacher : t));
    } else {
      setTeachers([...teachers, newTeacher]);
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this teacher?")) {
      setTeachers(teachers.filter(t => t.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">👤 Teachers</h2>
        {userRole === "admin" && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
          >
            + Add Teacher
          </button>
        )}
      </div>

      <input
        type="text"
        placeholder="Search teachers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border rounded-lg mb-4"
      />

      <div className="grid gap-4">
        {filtered.map(teacher => (
          <div key={teacher.id} className="bg-white p-4 rounded-lg shadow border-l-4 border-teal-500">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{teacher.name}</h3>
                <p className="text-teal-600 font-medium">{teacher.subject}</p>
                <p className="text-slate-500 text-sm">{teacher.email}</p>
                <p className="text-slate-400 text-sm">{teacher.phone}</p>
                <span className={teacher.status === "active" ? "inline-block px-2 py-1 rounded text-xs mt-2 bg-green-100 text-green-700" : "inline-block px-2 py-1 rounded text-xs mt-2 bg-gray-100 text-gray-600"}>
                  {teacher.status}
                </span>
              </div>
              {userRole === "admin" && (
                <div className="space-x-2">
                  <button 
                    onClick={() => { setEditing(teacher); setShowForm(true); }}
                    className="text-blue-600 hover:underline"
                  >Edit</button>
                  <button 
                    onClick={() => handleDelete(teacher.id)}
                    className="text-red-600 hover:underline"
                  >Delete</button>
                  <button onClick={() => printTeacherReport(teacher)} className="text-green-600 hover:underline">Report</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form onSubmit={handleSave} className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">{editing ? "Edit" : "Add"} Teacher</h3>
            <input name="name" defaultValue={editing?.name} placeholder="Name" required className="w-full p-2 border rounded mb-3" />
            <input name="subject" defaultValue={editing?.subject} placeholder="Subject" required className="w-full p-2 border rounded mb-3" />
            <input name="email" defaultValue={editing?.email} placeholder="Email" type="email" className="w-full p-2 border rounded mb-3" />
            <input name="phone" defaultValue={editing?.phone} placeholder="Phone" className="w-full p-2 border rounded mb-3" />
            <select name="status" defaultValue={editing?.status || "active"} className="w-full p-2 border rounded mb-3">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <label className="block text-sm font-medium text-slate-600 mb-1">Start Date</label>
            <input name="startDate" type="date" defaultValue={editing?.startDate} className="w-full p-2 border rounded mb-3" />
            {classes.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 mb-2">Assigned Classes</label>
                <div className="border rounded p-2 max-h-36 overflow-y-auto flex flex-col gap-1">
                  {classes.map(cls => (
                    <label key={cls.id} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input type="checkbox" name="classIds" value={cls.id}
                        defaultChecked={(editing?.classIds||[]).map(x=>parseInt(x)).includes(cls.id)} />
                      {cls.name}
                    </label>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-teal-600 text-white py-2 rounded">Save</button>
              <button type="button" onClick={() => {setShowForm(false); setEditing(null);}} className="flex-1 bg-slate-300 py-2 rounded">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}


// ─── Shared Components ────────────────────────────────────────────────────────
function Avatar({ name, size = 34 }) {
  const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const colors = ["#0d9488", "#7c3aed", "#2563eb", "#db2777", "#ea580c", "#16a34a"];
  const bg = colors[name.charCodeAt(0) % colors.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: bg,
      color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 600, flexShrink: 0,
    }}>{initials}</div>
  );
}

function Badge({ status }) {
  const map = {
    Active:   { bg: "#d1fae5", color: "#065f46", dot: "#10b981" },
    Inactive: { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
  };
  const s = map[status] || map.Active;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.color, borderRadius: 20,
      padding: "3px 10px", fontSize: 12, fontWeight: 500,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {status}
    </span>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,15,30,.55)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
    }} onClick={e => e.target === e.currentTarget && onClose && onClose()}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: 28, width: 480,
        maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,.2)",
        animation: "fadeUp .18s ease",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: T.textMain }}>{title}</h3>
          <button onClick={onClose} style={{
            border: "none", background: "#f1f5f9", borderRadius: 8,
            width: 30, height: 30, cursor: "pointer", fontSize: 16, color: T.textSub,
          }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Field accepts an error prop and displays validation message
function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: error ? "#ef4444" : "#475569", marginBottom: 6 }}>
        {label}{error && <span style={{ marginRight: 6, fontWeight: 400, color: "#ef4444" }}>— {error}</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Attendance Module ────────────────────────────────────────────────────────
function Attendance({ students, classes, attendance, setAttendance, teacherClassIds = null }) {
  const visibleClasses = teacherClassIds ? classes.filter(c => teacherClassIds.includes(c.id)) : classes;
  const visibleStudents = teacherClassIds ? students.filter(s => teacherClassIds.includes(s.classId)) : students;
  const todayStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD, no timezone issues
  const [date, setDate]       = useState(todayStr);
  const [classId, setClassId] = useState(classes[0]?.id || 1);
  const [view, setView]       = useState("take");
  const [saved, setSaved]     = useState(false);

  const classStudents = useMemo(
    () => students.filter(s => s.classId === classId && s.status === "Active"),
    [students, classId]
  );

  // FIX 1: Use useEffect to sync draft whenever date, classId, or attendance changes
  const buildDraft = useCallback((d, rec) => {
    const init = {};
    students.forEach(s => { init[s.id] = rec?.[s.id] || "present"; });
    return init;
  }, [students]);

  const [draft, setDraft] = useState(() => buildDraft(date, attendance[date]));

  useEffect(() => {
    setDraft(buildDraft(date, attendance[date]));
    setSaved(!!attendance[date]);
  }, [date, classId, attendance, buildDraft]); // re-syncs on every relevant change

  const markAll = (status) => {
    setDraft(prev => {
      const updated = { ...prev };
      classStudents.forEach(s => { updated[s.id] = status; });
      return updated;
    });
    setSaved(false);
  };

  const toggle = (sid, status) => {
    setDraft(prev => ({ ...prev, [sid]: status }));
    setSaved(false);
  };

  const saveAttendance = () => {
    const dayOfWeek = new Date(date + "T00:00:00").getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      alert("Attendance cannot be recorded on weekends.");
      return;
    }
    setAttendance(prev => ({ ...prev, [date]: { ...(prev[date] || {}), ...draft } }));
    setSaved(true);
  };

  const stats = useMemo(() => {
    const s = { present: 0, absent: 0, late: 0, excused: 0 };
    classStudents.forEach(st => { const v = draft[st.id] || "present"; s[v]++; });
    return s;
  }, [draft, classStudents]);

  const allDates = useMemo(() => Object.keys(attendance).sort(), [attendance]);

  const studentStats = useMemo(() => {
    return students.filter(s => s.classId === classId).map(s => {
      let p = 0, a = 0, l = 0, e = 0, total = 0;
      allDates.forEach(d => {
        const rec = attendance[d]?.[s.id];
        if (!rec) return;
        total++;
        if (rec === "present") p++;
        else if (rec === "absent") a++;
        else if (rec === "late") l++;
        else if (rec === "excused") e++;
      });
      const rate = total ? Math.round((p / total) * 100) : 100;
      return { ...s, present: p, absent: a, late: l, excused: e, total, rate };
    });
  }, [students, classId, allDates, attendance]);

  const StatPill = ({ type, count }) => {
    const cfg = STATUS_CONFIG[type];
    return (
      <div style={{
        background: cfg.bg, borderRadius: 10, padding: "12px 16px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1,
      }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: cfg.color }}>{count}</div>
        <div style={{ fontSize: 11, color: cfg.color, fontWeight: 500 }}>{cfg.label}</div>
      </div>
    );
  };

  return (
    <div>
      <div style={{
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius,
        padding: "16px 20px", marginBottom: 20,
        display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
        boxShadow: T.cardShadow,
      }}>
        <input type="date" value={date} max={todayStr}
          onChange={e => setDate(e.target.value)}
          style={{ ...inputStyle, width: 160 }} />
        <select value={classId} onChange={e => setClassId(parseInt(e.target.value))}
          style={{ ...selectStyle, width: 190 }}>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div style={{ display: "flex", gap: 4, marginRight: "auto" }}>
          {["take", "report"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 13, fontFamily: "inherit", fontWeight: 500,
              background: view === v ? T.navy : "#f1f5f9",
              color: view === v ? "#fff" : T.textSub,
            }}>
              {v === "take" ? "Take Attendance" : "Report"}
            </button>
          ))}
        </div>
        {view === "take" && (
          <button onClick={saveAttendance} style={{
            padding: "9px 22px", borderRadius: 8, border: "none",
            background: saved ? "#d1fae5" : T.primary,
            color: saved ? "#059669" : "#fff",
            fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 7, transition: "all .2s",
          }}>
            {saved ? "✓ Saved" : "Save Attendance"}
          </button>
        )}
      </div>

      {view === "take" ? (
        <>
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            {["present", "absent", "late", "excused"].map(t => (
              <StatPill key={t} type={t} count={stats[t]} />
            ))}
          </div>
          <div style={{
            background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius,
            overflow: "hidden", boxShadow: T.cardShadow,
          }}>
            <div style={{
              padding: "14px 20px", borderBottom: "1px solid #f1f5f9",
              display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10,
            }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: T.textMain }}>
                  {classes.find(c => c.id === classId)?.name}
                </div>
                <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>
                  {new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: T.textMuted }}>Mark all:</span>
                {["present", "absent", "late", "excused"].map(t => {
                  const cfg = STATUS_CONFIG[t];
                  return (
                    <button key={t} onClick={() => markAll(t)} style={{
                      padding: "5px 12px", borderRadius: 6, border: `1px solid ${cfg.color}33`,
                      background: cfg.bg, color: cfg.color, fontSize: 12,
                      fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
                    }}>{cfg.label}</button>
                  );
                })}
              </div>
            </div>
            {classStudents.length === 0 ? (
              <div style={{ padding: 48, textAlign: "center", color: T.textMuted, fontSize: 14 }}>
                No active students in this class
              </div>
            ) : classStudents.map((s, i) => {
              const current = draft[s.id] || "present";
              return (
                <div key={s.id} style={{
                  display: "flex", alignItems: "center", padding: "13px 20px",
                  borderBottom: i < classStudents.length - 1 ? "1px solid #f8fafc" : "none",
                  gap: 14,
                }}>
                  <Avatar name={s.name} size={36} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: T.textMain }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: T.textMuted }}>{s.sid}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                      <button key={key} onClick={() => toggle(s.id, key)} style={{
                        width: 36, height: 36, borderRadius: 8, border: "2px solid",
                        borderColor: current === key ? cfg.color : T.border,
                        background: current === key ? cfg.bg : "#fff",
                        color: current === key ? cfg.color : T.textMuted,
                        fontSize: 12, fontWeight: 700, cursor: "pointer",
                        transition: "all .15s", fontFamily: "inherit",
                      }} title={cfg.label}>{cfg.short}</button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div style={{
          background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius,
          overflow: "hidden", boxShadow: T.cardShadow,
        }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: T.textMain }}>Attendance Report</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>
              {classes.find(c => c.id === classId)?.name} · {allDates.length} school days tracked
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", direction: "ltr" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Student", "Present", "Absent", "Late", "Excused", "Rate", ""].map(h => (
                    <th key={h} style={{
                      padding: "11px 18px", textAlign: "right", fontSize: 11,
                      fontWeight: 600, color: T.textMuted, borderBottom: "1px solid #f1f5f9",
                      whiteSpace: "nowrap", letterSpacing: ".05em", textTransform: "uppercase",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {studentStats.map(s => (
                  <tr key={s.id}
                    onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "13px 18px", borderBottom: "1px solid #f8fafc" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, direction: "rtl" }}>
                        <Avatar name={s.name} size={32} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: T.textMain }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: T.textMuted }}>{s.sid}</div>
                        </div>
                      </div>
                    </td>
                    {["present", "absent", "late", "excused"].map(t => {
                      const cfg = STATUS_CONFIG[t];
                      return (
                        <td key={t} style={{ padding: "13px 18px", borderBottom: "1px solid #f8fafc" }}>
                          <span style={{
                            background: cfg.bg, color: cfg.color,
                            borderRadius: 6, padding: "3px 10px", fontSize: 13, fontWeight: 600,
                          }}>{s[t]}</span>
                        </td>
                      );
                    })}
                    <td style={{ padding: "13px 18px", borderBottom: "1px solid #f8fafc", minWidth: 140 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, direction: "rtl" }}>
                        <div style={{ flex: 1, height: 6, background: "#f1f5f9", borderRadius: 6, overflow: "hidden" }}>
                          <div style={{
                            height: "100%", borderRadius: 6, transition: "width .4s",
                            background: s.rate >= 90 ? "#10b981" : s.rate >= 75 ? "#f59e0b" : "#ef4444",
                            width: s.rate + "%",
                          }} />
                        </div>
                        <span style={{
                          fontSize: 13, fontWeight: 600, minWidth: 36,
                          color: s.rate >= 90 ? "#059669" : s.rate >= 75 ? "#d97706" : "#dc2626",
                        }}>{s.rate}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "13px 18px", borderBottom: "1px solid #f8fafc" }}>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20,
                        background: s.rate >= 90 ? "#d1fae5" : s.rate >= 75 ? "#fef3c7" : "#fee2e2",
                        color: s.rate >= 90 ? "#065f46" : s.rate >= 75 ? "#92400e" : "#991b1b",
                      }}>
                        {s.rate >= 90 ? "Good" : s.rate >= 75 ? "At Risk" : "Critical"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "14px 20px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[
              { label: "≥ 90%  Good", color: "#059669", bg: "#d1fae5" },
              { label: "75–89%  At Risk", color: "#d97706", bg: "#fef3c7" },
              { label: "< 75%  Critical", color: "#dc2626", bg: "#fee2e2" },
            ].map(l => (
              <span key={l.label} style={{
                fontSize: 11, fontWeight: 500, padding: "3px 10px",
                borderRadius: 20, background: l.bg, color: l.color,
              }}>{l.label}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ students, classes, attendance, grades, subjects, timetable, messages, exams, onNavigate }) {
  const todayStr    = new Date().toISOString().split("T")[0];
  const todayDayIdx = (new Date().getDay() + 6) % 7; // Mon=0 … Fri=4
  const isWeekend   = new Date().getDay() === 0 || new Date().getDay() === 6;
  const todayRec   = attendance[todayStr] || {};
  const hasToday   = Object.keys(todayRec).length > 0;
  const todayPresent = Object.values(todayRec).filter(v => v === "present").length;
  const todayAbsent  = Object.values(todayRec).filter(v => v === "absent").length;
  const todayRate    = students.length ? Math.round((todayPresent / students.length) * 100) : 0;

  // Top student by GPA
  const topStudent = useMemo(() => {
    let best = null, bestGpa = -1;
    students.filter(s => s.status === "Active").forEach(s => {
      const subs = (subjects || []).filter(sub => sub.classId === s.classId);
      const scores = subs.map(sub => calcTotal(grades?.[s.id]?.[sub.id])).filter(v => v !== null);
      if (!scores.length) return;
      const gpa = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      if (gpa > bestGpa) { bestGpa = gpa; best = { ...s, gpa }; }
    });
    return best;
  }, [students, grades, subjects]);

  // FIX 2: Use max class count for bar width (so the largest class = 100%)
  const classDist = classes.map(c => ({
    ...c, count: students.filter(s => s.classId === c.id).length
  }));
  const maxCount = Math.max(...classDist.map(c => c.count), 1);

  const StatCard = ({ icon, value, label, sub, subColor }) => (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius,
      padding: "22px 24px", boxShadow: T.cardShadow,
    }}>
      <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 30, fontWeight: 700, color: T.textMain, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: T.textMuted, marginTop: 5 }}>{label}</div>
      {sub && <div style={{
        display: "inline-block", marginTop: 10, fontSize: 11, fontWeight: 500,
        background: subColor + "22", color: subColor, borderRadius: 20, padding: "2px 9px",
      }}>{sub}</div>}
    </div>
  );

  const printMonthlyReport = () => {
    const now = new Date();
    const monthName = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const attendanceDays = Object.keys(attendance);
    const totalPresent = attendanceDays.reduce((sum, day) => sum + Object.values(attendance[day]).filter(v => v === "present").length, 0);
    const totalRecords = attendanceDays.reduce((sum, day) => sum + Object.values(attendance[day]).length, 0);
    const attendanceRate = totalRecords ? Math.round((totalPresent / totalRecords) * 100) : 0;
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>Monthly Report</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#1e1e3a}h1{color:#0d9488;border-bottom:3px solid #0d9488;padding-bottom:10px}table{width:100%;border-collapse:collapse;margin-top:10px}th{background:#0d9488;color:white;padding:10px 14px;text-align:left}td{padding:10px 14px;border-bottom:1px solid #e8ecf2}.stat{display:inline-block;background:#f1f5f9;border-radius:10px;padding:16px 24px;margin:8px;text-align:center}.sv{font-size:28px;font-weight:bold;color:#0d9488}.sl{font-size:12px;color:#64748b}.footer{margin-top:40px;text-align:center;color:#94a3b8;font-size:12px;border-top:1px solid #e8ecf2;padding-top:16px}</style></head><body>
      <h1>Monthly Report - ${monthName}</h1>
      <p>Generated: ${now.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
      <div><div class="stat"><div class="sv">${students.length}</div><div class="sl">Total Students</div></div><div class="stat"><div class="sv">${classes.length}</div><div class="sl">Total Classes</div></div><div class="stat"><div class="sv">${attendanceRate}%</div><div class="sl">Attendance Rate</div></div><div class="stat"><div class="sv">${(messages||[]).filter(m=>!m.read).length}</div><div class="sl">Unread Messages</div></div></div>
      <h2>Students by Class</h2><table><tr><th>Class</th><th>Students</th></tr>${classes.map(c=>`<tr><td>${c.name}</td><td>${students.filter(s=>String(s.classId)===String(c.id)).length}</td></tr>`).join("")}</table>
      <h2>Recent Attendance (Last 10 Days)</h2><table><tr><th>Date</th><th>Present</th><th>Absent</th><th>Late</th></tr>${Object.keys(attendance).sort().slice(-10).map(day=>{const r=attendance[day];const p=Object.values(r).filter(v=>v==="present").length;const a=Object.values(r).filter(v=>v==="absent").length;const l=Object.values(r).filter(v=>v==="late").length;return`<tr><td>${day}</td><td>${p}</td><td>${a}</td><td>${l}</td></tr>`;}).join("")}</table>
      <div class="footer">Al-Huffath Academy - Developed by Eng: Ahmad Zouikli</div>
      </body></html>`);
    w.document.close(); w.print();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button onClick={printMonthlyReport} style={{ padding: "10px 20px", background: "#0d9488", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          🖨️ Monthly Report
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 14, marginBottom: 28 }}>
        <StatCard icon="👥" value={students.length} label="Total Students"  sub="Enrolled"        subColor={T.primary} />
        <StatCard icon="🏫" value={classes.length}  label="Total Classes"   sub="This semester"   subColor="#7c3aed" />
        <StatCard icon="✅" value={hasToday ? todayPresent : "—"} label="Present Today" sub={hasToday ? `${todayRate}% rate` : "Not taken yet"} subColor="#16a34a" />
        <StatCard icon="⚠️" value={hasToday ? todayAbsent  : "—"} label="Absent Today"  sub={hasToday ? "Needs follow-up" : "Not taken yet"}   subColor={T.danger} />
        <StatCard icon="💬" value={(messages || []).filter(m => !m.read).length} label="Unread Messages" sub="From parents" subColor="#7c3aed" />
        <StatCard icon="📋" value={(exams || []).filter(e => getExamStatus(e.date) !== "completed").length} label="Upcoming Exams" sub="Scheduled" subColor="#b45309" />
      </div>
      {topStudent && (
        <div style={{
          background: "linear-gradient(135deg,#1e1e3a,#0d9488)", borderRadius: T.radius,
          padding: "16px 22px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16,
          boxShadow: "0 4px 16px rgba(13,148,136,.3)",
        }}>
          <div style={{ fontSize: 28 }}>🏆</div>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", fontWeight: 500, marginBottom: 2 }}>TOP PERFORMING STUDENT</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{topStudent.name}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>{classes.find(c => c.id === topStudent.classId)?.name}</div>
          </div>
          <div style={{ marginRight: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#5eead4", lineHeight: 1 }}>{topStudent.gpa}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)" }}>GPA Average</div>
          </div>
          <div style={{
            background: GRADE_COLOR[letterGrade(topStudent.gpa)].bg,
            color: GRADE_COLOR[letterGrade(topStudent.gpa)].color,
            borderRadius: 10, padding: "6px 18px", fontSize: 20, fontWeight: 800,
          }}>{letterGrade(topStudent.gpa)}</div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, overflow: "hidden", boxShadow: T.cardShadow }}>
          <div style={{ padding: "18px 22px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: T.textMain }}>Students per Class</div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>Bar width = relative to largest class</div>
          </div>
          <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
            {classDist.map(c => {
              const pct = Math.round((c.count / maxCount) * 100); // FIX 2 applied here
              return (
                <div key={c.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#334155" }}>{c.name}</span>
                    <span style={{ fontSize: 13, color: T.textSub }}>{c.count} / {c.capacity} students</span>
                  </div>
                  <div style={{ height: 8, background: "#f1f5f9", borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 8, background: T.primary, width: pct + "%", transition: "width .4s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, overflow: "hidden", boxShadow: T.cardShadow }}>
          <div style={{ padding: "18px 22px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: T.textMain }}>Today's Attendance</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </div>
          </div>
          <div style={{ padding: "20px 22px" }}>
            {!hasToday ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: T.textMuted, fontSize: 14 }}>
                Attendance not taken yet today
              </div>
            ) : (
              <>
                <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                  {["present", "absent", "late", "excused"].map(t => {
                    const cfg = STATUS_CONFIG[t];
                    const cnt = Object.values(todayRec).filter(v => v === t).length;
                    return (
                      <div key={t} style={{ flex: 1, background: cfg.bg, borderRadius: 10, padding: "12px 8px", textAlign: "center" }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: cfg.color }}>{cnt}</div>
                        <div style={{ fontSize: 10, color: cfg.color, fontWeight: 500, marginTop: 2 }}>{cfg.label}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ height: 10, background: "#f1f5f9", borderRadius: 10, overflow: "hidden", display: "flex" }}>
                  {["present", "absent", "late", "excused"].map(t => {
                    const cfg = STATUS_CONFIG[t];
                    const cnt = Object.values(todayRec).filter(v => v === t).length;
                    const pct = Object.keys(todayRec).length ? (cnt / Object.keys(todayRec).length) * 100 : 0;
                    return pct > 0 ? (
                      <div key={t} style={{ width: pct + "%", background: cfg.dot, transition: "width .4s" }} />
                    ) : null;
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "16px 22px", boxShadow: T.cardShadow, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: T.textMain, marginRight: 4 }}>⚡ Quick Actions</span>
        {[
          { label: "➕ Add Student",     page: "students"   },
          { label: "✅ Take Attendance",  page: "attendance" },
          { label: "📋 Schedule Exam",    page: "exams"      },
          { label: "💬 New Message",      page: "messages"   },
          { label: "★ Enter Grades",     page: "grades"     },
        ].map(a => (
          <button key={a.page} onClick={() => onNavigate(a.page)} style={{
            padding: "8px 16px", borderRadius: 8, border: `1px solid ${T.border}`,
            background: "#f8fafc", color: T.textMain, fontSize: 13, cursor: "pointer",
            fontFamily: "inherit", fontWeight: 500, transition: "all .12s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = T.primary; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = T.primary; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = T.textMain; e.currentTarget.style.borderColor = T.border; }}>
            {a.label}
          </button>
        ))}
      </div>

      {/* Today's Schedule strip */}
      <div style={{
        marginTop: 16, background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: T.radius, overflow: "hidden", boxShadow: T.cardShadow,
      }}>
        <div style={{ padding: "14px 22px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: T.textMain }}>📅 Today's Schedule</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>
              {isWeekend ? "Weekend — no classes" : DAYS[todayDayIdx]}
            </div>
          </div>
        </div>
        {isWeekend ? (
          <div style={{ padding: "24px 22px", color: T.textMuted, fontSize: 14, textAlign: "center" }}>
            🎉 It's the weekend — enjoy the break!
          </div>
        ) : (
          <div style={{ padding: "14px 22px", display: "flex", flexDirection: "column", gap: 8 }}>
            {classes.map(cls => {
              const daySlots = timetable?.[cls.id]?.[todayDayIdx] || {};
              const slots = PERIODS.filter(p => !p.isBreak && daySlots[p.id]?.subjectId);
              if (!slots.length) return null;
              return (
                <div key={cls.id}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, marginBottom: 6, letterSpacing: ".05em" }}>
                    {cls.name.toUpperCase()}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {slots.map(p => {
                      const slot = daySlots[p.id];
                      const subj = subjects.find(s => s.id === slot.subjectId);
                      if (!subj) return null;
                      const clr = subjectColor(subj.name);
                      return (
                        <div key={p.id} style={{
                          background: clr.bg, border: `1px solid ${clr.border}`,
                          borderRadius: 8, padding: "5px 10px",
                          display: "flex", flexDirection: "column", gap: 1,
                        }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: clr.text }}>{subj.icon} {subj.name}</span>
                          <span style={{ fontSize: 10, color: clr.text, opacity: .7 }}>{p.time}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }).filter(Boolean)}
          </div>
        )}
      </div>
    </div>
  );
}
// ─── Toast Notification ───────────────────────────────────────────────────────
function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 999,
      background: T.navy, color: "#fff", borderRadius: 10,
      padding: "12px 20px", fontSize: 13, fontWeight: 500,
      boxShadow: "0 8px 28px rgba(0,0,0,.22)", display: "flex", alignItems: "center", gap: 10,
      animation: "fadeUp .2s ease",
    }}>
      <span style={{ color: "#5eead4", fontSize: 16 }}>✓</span> {msg}
    </div>
  );
}

// GPA color helper
function getGpaColor(gpa) {
  if (gpa === null || gpa === undefined) return T.textMuted;
  if (gpa >= 90) return "#10b981";
  if (gpa >= 75) return "#f59e0b";
  return "#ef4444";
}

// CSV export helper
function exportToCSV(data, filename) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map(r => headers.map(h => JSON.stringify(r[h] ?? "")).join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ─── Student Profile (Rich Tabbed) ───────────────────────────────────────────
const PROFILE_TABS = ["Overview", "Attendance", "Grades", "Exams", "Messages", "Schedule"];

function MiniBar({ value, max, color }) {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div style={{ height: 6, background: "#f1f5f9", borderRadius: 6, overflow: "hidden", flex: 1 }}>
      <div style={{ height: "100%", width: pct + "%", background: color, borderRadius: 6, transition: "width .5s ease" }} />
    </div>
  );
}

function Pill({ label, bg, color }) {
  return <span style={{ display: "inline-block", fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20, background: bg, color }}>{label}</span>;
}

function ProfileCard({ title, action, children }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e8ecf2", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.05)", marginBottom: 18 }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1e1e3a" }}>{title}</div>
        {action}
      </div>
      {children}
    </div>
  );
}

function ParentCompose({ student, messages }) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);
  const send = () => {
    if (!subject.trim() || !body.trim()) return;
    const msg = { id: Date.now(), studentId: student.id, tag: "general", subject, body, fromSchool: false, timestamp: Date.now(), read: false, replies: [] };
    try { const stored = JSON.parse(localStorage.getItem("edu_messages") || "[]"); localStorage.setItem("edu_messages", JSON.stringify([msg, ...stored])); } catch {}
    setSubject(""); setBody(""); setOpen(false); setSent(true);
    setTimeout(() => setSent(false), 3000);
  };
  return (
    <div style={{ marginBottom: 18 }}>
      {sent && <div style={{ background: "#d1fae5", color: "#065f46", padding: "10px 16px", borderRadius: 10, marginBottom: 12, fontSize: 13, fontWeight: 500 }}>Message sent to school successfully!</div>}
      {!open ? (
        <button onClick={() => setOpen(true)} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "2px dashed #0d9488", background: "#f0fdf9", color: "#0d9488", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          Send a Message to School
        </button>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e8ecf2", borderRadius: 14, padding: "18px", marginBottom: 14, boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1e1e3a", marginBottom: 14 }}>New Message to School</div>
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject..." style={{ width: "100%", padding: "9px 12px", border: "1px solid #e8ecf2", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", marginBottom: 10, boxSizing: "border-box" }} />
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Write your message..." rows={4} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e8ecf2", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
          <div style={{ display: "flex", gap: 10, marginTop: 10, justifyContent: "flex-end" }}>
            <button onClick={() => setOpen(false)} style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid #e8ecf2", background: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
            <button onClick={send} disabled={!subject.trim() || !body.trim()} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#0d9488", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: (!subject.trim() || !body.trim()) ? .5 : 1 }}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}



// ─── StudentMessages ──────────────────────────────────────────────────────────
function StudentMessages({ student, messages, setMessages }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState("");

  const myMessages = (messages||[]).filter(m => m.studentId === student.id).sort((a,b) => b.timestamp - a.timestamp);
  const unread = myMessages.filter(m => !m.read).length;

  const fmtTime = (ts) => {
    const d = new Date(ts), now = new Date(), diff = now - d;
    if (diff < 3600000) return Math.floor(diff/60000) + "m ago";
    if (diff < 86400000) return d.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
    return d.toLocaleDateString("en-US",{month:"short",day:"numeric"});
  };

  const selectedMsg = myMessages.find(m => m.id === selected);

  const sendReply = () => {
    if (!replyText.trim()) return;
    const reply = { id: uid(), fromSchool: false, body: replyText, timestamp: Date.now(), senderName: student.name };
    if (setMessages) setMessages(prev => prev.map(m => m.id === selected ? {...m, replies:[...(m.replies||[]),reply]} : m));
    setReplyText("");
  };

  const inp = { width:"100%", padding:"9px 12px", border:"1px solid #e2e8f0", borderRadius:8, fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box" };

  return (
    <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", overflow:"hidden", marginBottom:16 }}>
      <div onClick={() => setOpen(!open)} style={{ padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", borderBottom: open?"1px solid #e2e8f0":"none" }}>
        <div style={{ fontSize:14, fontWeight:700, color:"#1e293b", display:"flex", alignItems:"center", gap:8 }}>
          💬 Messages
          {unread > 0 && <span style={{ background:"#ef4444", color:"#fff", borderRadius:20, fontSize:11, padding:"2px 8px" }}>{unread} new</span>}
        </div>
        <span style={{ fontSize:12, color:"#94a3b8" }}>{open?"▲":"▼"}</span>
      </div>

      {open && (
        <div style={{ padding:16 }}>
          {selected && selectedMsg ? (
            <div>
              <button onClick={() => setSelected(null)} style={{ padding:"6px 12px", borderRadius:7, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", fontSize:12, marginBottom:12 }}>← Back</button>
              <div style={{ fontSize:14, fontWeight:700, color:"#1e293b", marginBottom:12 }}>{selectedMsg.subject}</div>
              <div style={{ background:"#f0fdf9", borderRadius:10, border:"1px solid #99f6e4", padding:14, marginBottom:10 }}>
                <div style={{ fontSize:12, fontWeight:600, color:"#64748b", marginBottom:6 }}>🏫 School · {fmtTime(selectedMsg.timestamp)}</div>
                <div style={{ fontSize:13, color:"#334155" }}>{selectedMsg.body}</div>
                {selectedMsg.image && <img src={selectedMsg.image} style={{ maxWidth:"100%", borderRadius:8, marginTop:8 }} />}
              </div>
              {(selectedMsg.replies||[]).map(r => (
                <div key={r.id} style={{ background: r.fromSchool?"#f0fdf9":"#f8f4ff", borderRadius:10, border:"1px solid " + (r.fromSchool?"#99f6e4":"#ddd6fe"), padding:12, marginBottom:8 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:"#64748b", marginBottom:4 }}>{r.fromSchool?"🏫 School":"🎓 You"} · {fmtTime(r.timestamp)}</div>
                  <div style={{ fontSize:13, color:"#334155" }}>{r.body}</div>
                  {r.image && <img src={r.image} style={{ maxWidth:"100%", borderRadius:8, marginTop:6 }} />}
                </div>
              ))}
              <div style={{ marginTop:12 }}>
                <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write a reply..." rows={3} style={{...inp, resize:"vertical", marginBottom:8}} />
                <button onClick={sendReply} style={{ padding:"8px 18px", borderRadius:8, border:"none", background:"#0d9488", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Send Reply</button>
              </div>
            </div>
          ) : (
            myMessages.length === 0 ? (
              <div style={{ textAlign:"center", padding:24, color:"#94a3b8", fontSize:13 }}>No messages yet</div>
            ) : myMessages.map(msg => (
              <div key={msg.id} onClick={() => { setSelected(msg.id); if(!msg.read && setMessages) setMessages(prev=>prev.map(m=>m.id===msg.id?{...m,read:true}:m)); }} style={{ padding:"12px 14px", borderRadius:10, border:"1px solid " + (msg.read?"#f1f5f9":"#0d9488"), background: msg.read?"#fff":"#f0fdf9", marginBottom:8, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight: msg.read?500:700, color:"#1e293b" }}>{msg.subject}</div>
                  <div style={{ fontSize:11, color:"#94a3b8", marginTop:2 }}>🏫 School · {fmtTime(msg.timestamp)} {msg.image?"📎":""}</div>
                </div>
                {!msg.read && <div style={{ width:8, height:8, borderRadius:"50%", background:"#ef4444" }} />}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Student Dashboard ────────────────────────────────────────────────────────
// StudentQuranPlayer
function StudentQuranPlayer() {
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [reciter,       setReciter]       = useState("ar.alafasy");
  const [displayPage,   setDisplayPage]   = useState(1);
  const [pageAudioPlay, setPageAudioPlay] = useState(false);
  const [currentAyah,   setCurrentAyah]   = useState(null);
  const [ayahs,         setAyahs]         = useState([]);
  const [loadingPage,   setLoadingPage]   = useState(true);

  useEffect(() => { setDisplayPage(SURAH_START_PAGES[selectedSurah] || 1); }, [selectedSurah]);

  useEffect(() => {
    setLoadingPage(true);
    _QAudio.stop(); setPageAudioPlay(false); setCurrentAyah(null);
    fetch("https://api.alquran.cloud/v1/page/" + displayPage + "/quran-uthmani")
      .then(r => r.json())
      .then(data => { if (data.code === 200) setAyahs(data.data.ayahs || []); setLoadingPage(false); })
      .catch(() => setLoadingPage(false));
  }, [displayPage]);

  const playFromIndex = (idx, list) => {
    if (!_QAudio.playing || idx >= list.length) {
      _QAudio.playing = false; setPageAudioPlay(false); setCurrentAyah(null); return;
    }
    const num = list[idx].number;
    const url = "https://cdn.islamic.network/quran/audio/128/" + reciter + "/" + num + ".mp3";
    setCurrentAyah(num);
    _QAudio.play(url,
      () => { if (_QAudio.playing) playFromIndex(idx + 1, list); },
      () => { if (_QAudio.playing) playFromIndex(idx + 1, list); }
    );
  };

  const togglePlay = () => {
    if (pageAudioPlay) { _QAudio.stop(); setPageAudioPlay(false); setCurrentAyah(null); }
    else { _QAudio.playing = true; setPageAudioPlay(true); playFromIndex(0, ayahs); }
  };

  const S = { text:"#0f172a", sub:"#64748b" };
  const inp = { width:"100%", padding:"8px 12px", border:"1px solid #e2e8f0", borderRadius:8, fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box" };

  return (
    <div className="quran-player-grid" style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:16 }}>
      <style>{`
        @media (max-width: 768px) {
          .quran-player-grid { grid-template-columns: 1fr !important; }
          .quran-player-right { order: -1; }
          .quran-dark-card { display: none !important; }
        }
      `}</style>
      <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", overflow:"hidden" }}>
        <div style={{ padding:"12px 16px", borderBottom:"1px solid #e2e8f0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:S.text }}>
              {"\u0635\u0641\u062d\u0629 \u0627\u0644\u0645\u0635\u062d\u0641"}
            </div>
            <div style={{ fontSize:11, color:S.sub }}>
              {"\u062a\u062a\u0632\u0627\u0645\u0646 \u0645\u0639 \u0627\u0644\u0633\u0648\u0631\u0629"}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <button onClick={() => setDisplayPage(p => Math.max(1, p-1))} style={{ width:28, height:28, borderRadius:6, border:"1px solid #e2e8f0", background:"#f8fafc", cursor:"pointer" }}>{"\u203a"}</button>
            <span style={{ fontSize:12, fontWeight:600, color:S.text, minWidth:64, textAlign:"center" }}>{"\u0635\u0641\u062d\u0629 "}{displayPage}</span>
            <button onClick={() => setDisplayPage(p => Math.min(604, p+1))} style={{ width:28, height:28, borderRadius:6, border:"1px solid #e2e8f0", background:"#f8fafc", cursor:"pointer" }}>{"\u2039"}</button>
          </div>
        </div>
        <div style={{ padding:12, minHeight:480, background:"#fafaf8", overflowY:"auto" }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}>
            <button onClick={togglePlay} style={{ padding:"7px 20px", borderRadius:20, border:"none", background:pageAudioPlay?"#ef4444":"#0d9488", color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
              {pageAudioPlay ? "\u23f9 Stop" : "\u25b6 Play Page"}
            </button>
          </div>
          {!loadingPage && ayahs.length > 0 && ayahs[0].numberInSurah === 1 && ayahs[0].surah && ayahs[0].surah.number !== 1 && <div style={{ textAlign:"center", margin:"0 0 12px", padding:"10px 16px", background:"linear-gradient(135deg,#0f172a,#134e4a)", borderRadius:10 }}><div style={{ fontSize:20, fontWeight:700, color:"#fff", fontFamily:"serif" }}>{ayahs[0].surah.name}</div><div style={{ fontSize:11, color:"#5eead4" }}>{ayahs[0].surah.englishName}</div><div style={{ fontSize:18, color:"#fbbf24", marginTop:6 }}>{"\u0628\u0650\u0633\u0652\u0645\u0650 \u0671\u0644\u0644\u0651\u064e\u0647\u0650 \u0671\u0644\u0631\u0651\u064e\u062d\u0652\u0645\u064e\u0670\u0646\u0650 \u0671\u0644\u0631\u0651\u064e\u062d\u0650\u064a\u0645\u0650"}</div></div>}
          {loadingPage ? (
            <div style={{ textAlign:"center", padding:40, color:"#94a3b8", fontSize:13 }}>Loading...</div>
          ) : (
            <div style={{ direction:"rtl", fontFamily:"'Amiri Quran','Amiri Quran','Scheherazade New',serif", lineHeight:2.4, fontSize:20, color:"#1e293b", textAlign:"justify" }}>
              {ayahs.map(a => (
                <span key={a.number}
                  onClick={() => { _QAudio.stop(); _QAudio.playing = true; setPageAudioPlay(true); playFromIndex(ayahs.findIndex(x=>x.number===a.number), ayahs); }}
                  style={{ cursor:"pointer", borderRadius:4, padding:"1px 3px", background:currentAyah===a.number?"#fef9c3":"transparent", boxShadow:currentAyah===a.number?"0 0 0 2px #fbbf24":"none" }}>
                  {(() => { let t = a.text; if (a.numberInSurah===1 && a.surah && a.surah.number!==1 && a.surah.number!==9) { const p=t.split(String.fromCharCode(32)); if(p.length>4) t=p.slice(4).join(String.fromCharCode(32)); } const parts = t.split(/(\u0671\u0644\u0644\u0651\u064e\u0647|\u0627\u0644\u0644\u0651\u064e\u0647|\u0671\u0644\u0644\u0651\u064e\u0647\u064f|\u0627\u0644\u0644\u0651\u064e\u0647\u064f|\u0671\u0644\u0644\u0651\u064e\u0647\u0650|\u0627\u0644\u0644\u0651\u064e\u0647\u0650)/); return parts.map((p,i) => /\u0644\u0644/.test(p) ? <span key={i} style={{color:"#b91c1c",fontWeight:700}}>{p}</span> : p); })()}
                  <span style={{ fontSize:13, color:currentAyah===a.number?"#d97706":"#0d9488", margin:"0 3px" }}>&#x06DD;{a.numberInSurah}&#x06DD;</span>
                </span>
              ))}
            </div>
          )}
          <style>{"@keyframes wave{0%,100%{transform:scaleY(0.4)}50%{transform:scaleY(1)}}"}</style>
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", padding:14 }}>
          <div style={{ fontSize:11, fontWeight:700, color:S.sub, marginBottom:10 }}>{"\u0627\u0644\u0642\u0627\u0631\u0626"}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
            {RECITERS.map(r => (
              <button key={r.id} onClick={() => { setReciter(r.id); _QAudio.stop(); setPageAudioPlay(false); setCurrentAyah(null); }}
                style={{ padding:"7px 8px", borderRadius:8, border:"2px solid "+(reciter===r.id?"#0d9488":"#e2e8f0"), background:reciter===r.id?"#f0fdf9":"#fff", cursor:"pointer", textAlign:"right", fontFamily:"inherit" }}>
                <div style={{ fontSize:11, fontWeight:700, color:reciter===r.id?"#0d9488":S.text }}>{r.arabic}</div>
                <div style={{ fontSize:10, color:S.sub }}>{r.name}</div>
              </button>
            ))}
          </div>
        </div>
        <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", padding:14 }}>
          <div style={{ fontSize:11, fontWeight:700, color:S.sub, marginBottom:10 }}>{"\u0627\u0644\u0633\u0648\u0631\u0629"}</div>
          <select style={inp} value={selectedSurah} onChange={e => { setSelectedSurah(Number(e.target.value)); _QAudio.stop(); setPageAudioPlay(false); }}>
            {SURAHS.map(s => <option key={s.id} value={s.id}>{s.id}. {s.name} - {s.arabic}</option>)}
          </select>
        </div>
        <div className="quran-dark-card" style={{ background:"#0f172a", borderRadius:12, padding:20, textAlign:"center" }}>
          <div style={{ fontSize:24, fontWeight:800, color:"#fff", fontFamily:"'Amiri Quran','Scheherazade New',serif", marginBottom:4 }}>
            {SURAHS.find(s=>s.id===selectedSurah)?.arabic}
          </div>
          <div style={{ fontSize:12, fontWeight:600, color:"#5eead4", marginBottom:2 }}>{SURAHS.find(s=>s.id===selectedSurah)?.name}</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", marginBottom:16 }}>
            {SURAHS.find(s=>s.id===selectedSurah)?.verses} {"\u0622\u064a\u0629"} &middot; {RECITERS.find(r=>r.id===reciter)?.arabic}
          </div>
          {pageAudioPlay && (
            <div style={{ display:"flex", justifyContent:"center", gap:3, height:20, alignItems:"center" }}>
              {[8,14,20,14,8].map((h,i) => (
                <div key={i} style={{ width:3, height:h, borderRadius:2, background:"#5eead4", animation:"wave 0.9s ease-in-out infinite " + (i*0.15).toFixed(2) + "s" }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StudentDashboard({ student, classes, attendance, grades, subjects, exams, examResults, messages, setMessages, timetable, quizzes, quizResults }) {
  const cls      = classes.find(cl => cl.id === student.classId);
  const stdSubjs = (subjects||[]).filter(s => s.classId === student.classId);

  // Attendance
  const attStats = (() => {
    let p=0,a=0,l=0,e=0,total=0;
    Object.keys(attendance||{}).sort().forEach(date => {
      const rec = attendance[date]?.[student.id];
      if (!rec) return; total++;
      if (rec==="present") p++; else if (rec==="absent") a++;
      else if (rec==="late") l++; else if (rec==="excused") e++;
    });
    return { present:p, absent:a, late:l, excused:e, total, rate: total ? Math.round((p/total)*100) : 100 };
  })();

  // Grades
  const gradeStats = (() => {
    const rows = stdSubjs.map(sub => {
      const g = (grades?.[student.id]||{})[sub.id] || {};
      const total = Math.round((g.quiz||0)*0.15+(g.homework||0)*0.15+(g.midterm||0)*0.30+(g.final||0)*0.40);
      return { name: sub.name, total, hasGrade: !!(g.quiz||g.homework||g.midterm||g.final) };
    }).filter(r => r.hasGrade);
    const avg = rows.length ? Math.round(rows.reduce((s,r)=>s+r.total,0)/rows.length) : null;
    return { rows, avg };
  })();

  // Upcoming exams
  const today = new Date().toISOString().split("T")[0];
  const upcomingExams = (exams||[]).filter(e => e.classId===student.classId && e.date >= today).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,3);

  // Quizzes
  const doneQuizIds = (quizResults||[]).filter(r=>r.studentId===student.id).map(r=>r.quizId);
  const pendingQuizzes = (quizzes||[]).filter(q=>q.active && q.classId===student.classId && !doneQuizIds.includes(q.id));

  // Timetable today
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const todayName = days[new Date().getDay()];
  const todayClasses = (Array.isArray(timetable) ? timetable : Object.values(timetable||{})).reduce((acc,t)=>[...acc,...(t.slots||[])],[]).filter(s=>s.classId===student.classId&&s.day===todayName).sort((a,b)=>(a.time||"").localeCompare(b.time||""));

  // Unread messages
  const myMessages = (messages||[]).filter(m=>m.studentId===student.id).sort((a,b)=>b.timestamp-a.timestamp);
  const unread = myMessages.filter(m=>!m.read).length;

  const attColor = attStats.rate>=90 ? "#059669" : attStats.rate>=75 ? "#d97706" : "#dc2626";
  const attBg    = attStats.rate>=90 ? "#d1fae5" : attStats.rate>=75 ? "#fef3c7" : "#fee2e2";
  const gpaColor = gradeStats.avg!==null ? (gradeStats.avg>=80?"#059669":gradeStats.avg>=65?"#d97706":"#dc2626") : "#94a3b8";

  return (
    <div style={{ fontFamily:"system-ui,sans-serif", maxWidth:900, margin:"0 auto" }}>

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#1e1e3a,#0d3330)", borderRadius:16, padding:24, marginBottom:20, color:"#fff", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ width:56, height:56, borderRadius:14, background:"#0d9488", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:800, color:"#fff" }}>
            {student.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
          </div>
          <div>
            <div style={{ fontSize:20, fontWeight:800 }}>{student.name}</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,.6)", marginTop:2 }}>{cls?.name || "—"} · ID: {student.sid}</div>
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:12, color:"rgba(255,255,255,.5)" }}>Academic Year</div>
          <div style={{ fontSize:14, fontWeight:700, color:"#5eead4" }}>{student.academicYear || "2025/2026"}</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        {[
          { icon:"📊", label:"GPA", value: gradeStats.avg !== null ? gradeStats.avg+"%" : "—", color: gpaColor, bg: gradeStats.avg!==null?(gradeStats.avg>=80?"#d1fae5":gradeStats.avg>=65?"#fef3c7":"#fee2e2"):"#f8fafc" },
          { icon:"✅", label:"Attendance", value: attStats.rate+"%", color: attColor, bg: attBg },
          { icon:"📝", label:"Pending Quizzes", value: pendingQuizzes.length, color:"#0d9488", bg:"#f0fdf9" },
          { icon:"💬", label:"Messages", value: unread > 0 ? unread+" new" : "0", color: unread>0?"#7c3aed":"#64748b", bg: unread>0?"#ede9fe":"#f8fafc" },
        ].map((s,i) => (
          <div key={i} style={{ background:s.bg, borderRadius:12, padding:16, border:"1px solid #e2e8f0" }}>
            <div style={{ fontSize:22, marginBottom:6 }}>{s.icon}</div>
            <div style={{ fontSize:22, fontWeight:800, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>

        {/* Grades */}
        <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", overflow:"hidden" }}>
          <div style={{ padding:"14px 18px", borderBottom:"1px solid #e2e8f0", fontSize:14, fontWeight:700, color:"#1e293b" }}>📊 Grades</div>
          {gradeStats.rows.length === 0 ? (
            <div style={{ padding:24, textAlign:"center", color:"#94a3b8", fontSize:13 }}>No grades yet</div>
          ) : gradeStats.rows.map((r,i) => (
            <div key={i} style={{ padding:"10px 18px", borderBottom:"1px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:13, fontWeight:500, color:"#1e293b" }}>{r.name}</div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:80, height:6, background:"#f1f5f9", borderRadius:3, overflow:"hidden" }}>
                  <div style={{ width:r.total+"%", height:"100%", background: r.total>=80?"#0d9488":r.total>=65?"#f59e0b":"#ef4444", borderRadius:3 }} />
                </div>
                <span style={{ fontSize:13, fontWeight:700, color: r.total>=80?"#059669":r.total>=65?"#d97706":"#dc2626", minWidth:36, textAlign:"right" }}>{r.total}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Attendance */}
        <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", overflow:"hidden" }}>
          <div style={{ padding:"14px 18px", borderBottom:"1px solid #e2e8f0", fontSize:14, fontWeight:700, color:"#1e293b" }}>✅ Attendance</div>
          <div style={{ padding:18 }}>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
              <div style={{ width:90, height:90, borderRadius:"50%", background:"conic-gradient("+attColor+" "+attStats.rate+"%, #f1f5f9 0)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ width:68, height:68, borderRadius:"50%", background:"#fff", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                  <div style={{ fontSize:18, fontWeight:800, color:attColor }}>{attStats.rate}%</div>
                  <div style={{ fontSize:9, color:"#94a3b8" }}>Rate</div>
                </div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {[["Present",attStats.present,"#d1fae5","#059669"],["Absent",attStats.absent,"#fee2e2","#dc2626"],["Late",attStats.late,"#fef3c7","#d97706"],["Excused",attStats.excused,"#dbeafe","#2563eb"]].map(([l,v,bg,c])=>(
                <div key={l} style={{ background:bg, borderRadius:8, padding:"8px 12px", textAlign:"center" }}>
                  <div style={{ fontSize:18, fontWeight:800, color:c }}>{v}</div>
                  <div style={{ fontSize:11, color:c }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>

        {/* Upcoming Exams */}
        <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", overflow:"hidden" }}>
          <div style={{ padding:"14px 18px", borderBottom:"1px solid #e2e8f0", fontSize:14, fontWeight:700, color:"#1e293b" }}>📋 Upcoming Exams</div>
          {upcomingExams.length === 0 ? (
            <div style={{ padding:24, textAlign:"center", color:"#94a3b8", fontSize:13 }}>No upcoming exams</div>
          ) : upcomingExams.map(ex => {
            const diff = Math.ceil((new Date(ex.date+"T00:00:00") - new Date()) / 86400000);
            return (
              <div key={ex.id} style={{ padding:"12px 18px", borderBottom:"1px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:"#1e293b" }}>{ex.title}</div>
                  <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>{new Date(ex.date+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div>
                </div>
                <span style={{ fontSize:11, fontWeight:700, background: diff<=1?"#fee2e2":diff<=3?"#fef3c7":"#f0fdf9", color: diff<=1?"#dc2626":diff<=3?"#d97706":"#059669", padding:"3px 10px", borderRadius:20 }}>
                  {diff===0?"Today":diff===1?"Tomorrow":"in "+diff+" days"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Today Timetable */}
        <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", overflow:"hidden" }}>
          <div style={{ padding:"14px 18px", borderBottom:"1px solid #e2e8f0", fontSize:14, fontWeight:700, color:"#1e293b" }}>🗓️ Today — {todayName}</div>
          {todayClasses.length === 0 ? (
            <div style={{ padding:24, textAlign:"center", color:"#94a3b8", fontSize:13 }}>No classes today</div>
          ) : todayClasses.map((s,i) => (
            <div key={i} style={{ padding:"10px 18px", borderBottom:"1px solid #f1f5f9", display:"flex", gap:12, alignItems:"center" }}>
              <div style={{ width:44, height:44, borderRadius:10, background:"#f0fdf9", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#0d9488", flexShrink:0 }}>{s.time||"—"}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:"#1e293b" }}>{s.subject||"—"}</div>
                <div style={{ fontSize:11, color:"#64748b" }}>{s.teacher||""}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <StudentMessages student={student} messages={messages} setMessages={setMessages} />
      {/* Quran Player */}
      <div style={{ marginTop:24, marginBottom:16 }}>
        <div style={{ fontSize:15, fontWeight:800, color:"#0f172a", marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>
          {"\uD83D\uDD4C"} {"\u0645\u0634\u063a\u0651\u0644 \u0627\u0644\u0642\u0631\u0622\u0646"}
        </div>
        <StudentQuranPlayer />
      </div>

      {/* Pending Quizzes */}
      {pendingQuizzes.length > 0 && (
        <div style={{ background:"#f0fdf9", borderRadius:12, border:"1px solid #99f6e4", padding:18, marginBottom:16 }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#0d9488", marginBottom:12 }}>📝 Pending Quizzes ({pendingQuizzes.length})</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {pendingQuizzes.map(q => (
              <div key={q.id} style={{ background:"#fff", borderRadius:10, padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:"#1e293b" }}>{q.title}</div>
                  <div style={{ fontSize:11, color:"#64748b" }}>{q.questions.length} questions {q.duration?"· "+q.duration+" min":""}</div>
                </div>
                <span style={{ fontSize:11, fontWeight:700, background:"#0d9488", color:"#fff", padding:"4px 12px", borderRadius:20 }}>Pending</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

function ParentNotifications({ student, attendance, grades, subjects, exams, messages }) {
  const alerts = [];
  const last7 = Object.keys(attendance || {}).sort().slice(-7);
  last7.forEach(date => {
    const status = attendance[date]?.[student.id];
    if (status === "absent") alerts.push({ type: "danger", label: "AB", title: "Absence Recorded", body: "Marked absent on " + new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }) });
    if (status === "late")   alerts.push({ type: "warning", label: "LT", title: "Late Arrival", body: "Arrived late on " + new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }) });
  });
  const stdSubjs = (subjects || []).filter(s => s.classId === student.classId);
  stdSubjs.forEach(sub => {
    const g = (grades?.[student.id])?.[sub.id];
    if (!g) return;
    const total = Math.round((g.quiz||0)*0.15+(g.homework||0)*0.15+(g.midterm||0)*0.30+(g.final||0)*0.40);
    if (total < 60) alerts.push({ type: "danger", label: "F", title: "Low Grade - " + sub.name, body: "Grade is " + total + "/100 - needs improvement" });
    else if (total < 75) alerts.push({ type: "warning", label: "C-", title: "Grade Warning - " + sub.name, body: "Grade is " + total + "/100 - below average" });
  });
  (exams || []).filter(e => e.classId === student.classId).forEach(ex => {
    const diff = (new Date(ex.date + "T00:00:00") - new Date()) / 86400000;
    if (diff >= 0 && diff <= 3) alerts.push({ type: "info", label: "EX", title: "Exam Soon", body: ex.title + " on " + new Date(ex.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }) });
  });
  const unread = (messages || []).filter(m => m.studentId === student.id && !m.read).length;
  if (unread > 0) alerts.push({ type: "info", label: "MSG", title: "Unread Messages", body: "You have " + unread + " unread message" + (unread > 1 ? "s" : "") + " from school" });
  if (alerts.length === 0) return null;
  const clrs = { danger: { bg: "#fee2e2", border: "#fca5a5", color: "#991b1b", ic: "#dc2626" }, warning: { bg: "#fef3c7", border: "#fcd34d", color: "#92400e", ic: "#d97706" }, info: { bg: "#dbeafe", border: "#93c5fd", color: "#1e40af", ic: "#2563eb" } };
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#1e1e3a", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
        Notifications <span style={{ background: "#ef4444", color: "#fff", borderRadius: 20, fontSize: 11, padding: "1px 8px", fontWeight: 700 }}>{alerts.length}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {alerts.map((a, i) => { const c = clrs[a.type]; return (
          <div key={i} style={{ background: c.bg, border: "1px solid " + c.border, borderRadius: 10, padding: "10px 14px", display: "flex", gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: c.ic, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0 }}>{a.label}</div>
            <div><div style={{ fontSize: 13, fontWeight: 700, color: c.color }}>{a.title}</div><div style={{ fontSize: 12, color: c.color, opacity: .85, marginTop: 2 }}>{a.body}</div></div>
          </div>
        );})}
      </div>
    </div>
  );
}

function StudentProfile({ student, classes, attendance, grades, subjects, exams, examResults, messages, timetable, onClose }) {
  const [tab, setTab] = useState("Overview");

  const cls       = classes.find(c => c.id === student.classId);
  const stdSubjs  = (subjects || []).filter(s => s.classId === student.classId);
  const stdGrades = grades?.[student.id] || {};
  const stdMsgs   = useMemo(() =>
    (messages || []).filter(m => m.studentId === student.id).sort((a, b) => b.timestamp - a.timestamp),
    [messages, student.id]
  );

  // ── Attendance stats ──────────────────────────────────────────────────────
  const attStats = useMemo(() => {
    let p = 0, a = 0, l = 0, e = 0, total = 0;
    const history = [];
    Object.keys(attendance || {}).sort().forEach(date => {
      const rec = attendance[date]?.[student.id];
      if (!rec) return;
      total++;
      if (rec === "present") p++;
      else if (rec === "absent") a++;
      else if (rec === "late") l++;
      else if (rec === "excused") e++;
      history.push({ date, status: rec });
    });
    return { present: p, absent: a, late: l, excused: e, total, rate: total ? Math.round((p / total) * 100) : 100, history };
  }, [attendance, student.id]);

  // ── Grade stats ───────────────────────────────────────────────────────────
  const gradeStats = useMemo(() => {
    const rows = stdSubjs.map(sub => {
      const g = stdGrades[sub.id] || {};
      const total = calcTotal(g);
      return { sub, g, total, letter: letterGrade(total) };
    });
    const scored = rows.filter(r => r.total !== null);
    const gpa = scored.length ? Math.round(scored.reduce((s, r) => s + r.total, 0) / scored.length) : null;
    return { rows, gpa, letter: letterGrade(gpa) };
  }, [stdSubjs, stdGrades]);

  // ── Exam stats ────────────────────────────────────────────────────────────
  const examStats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const list = (exams || []).filter(ex => ex.classId === student.classId).map(ex => {
      const score  = examResults?.[ex.id]?.[student.id] ?? null;
      const pct    = score !== null ? Math.round((score / ex.maxScore) * 100) : null;
      const status = ex.date > today ? "upcoming" : ex.date === today ? "ongoing" : "completed";
      return { ...ex, score, pct, status };
    }).sort((a, b) => b.date.localeCompare(a.date));
    const done   = list.filter(e => e.status === "completed" && e.pct !== null);
    const avgPct = done.length ? Math.round(done.reduce((s, e) => s + e.pct, 0) / done.length) : null;
    return { list, avgPct };
  }, [exams, examResults, student]);

  const attColor = attStats.rate >= 90 ? "#059669" : attStats.rate >= 75 ? "#d97706" : "#dc2626";
  const attBg    = attStats.rate >= 90 ? "#d1fae5" : attStats.rate >= 75 ? "#fef3c7" : "#fee2e2";
  const gpaColor = gradeStats.gpa !== null ? (gradeStats.gpa >= 80 ? "#059669" : gradeStats.gpa >= 65 ? "#d97706" : "#dc2626") : "#94a3b8";

  return (
    <div style={{
      position: onClose ? "fixed" : "relative",
      inset: onClose ? 0 : "auto",
      background: onClose ? "rgba(15,15,30,.6)" : "transparent",
      zIndex: onClose ? 200 : "auto",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      overflowY: "auto", padding: onClose ? "20px 16px 40px" : 0,
    }} onClick={e => e.target === e.currentTarget && onClose && onClose()}>
      <div style={{ width: "100%", maxWidth: 860, fontFamily: "system-ui,-apple-system,sans-serif" }}>
        <style>{`@keyframes profileIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <div style={{ background: "#f1f5f9", borderRadius: 18, overflow: "hidden", animation: "profileIn .22s ease" }}>

          {/* Hero */}
          <div style={{ background: "#1e1e3a", padding: "28px 28px 0", position: "relative" }}>
            {onClose && (<button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,.12)", border: "none", borderRadius: 8, width: 32, height: 32, color: "rgba(255,255,255,.8)", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>)}

            <div style={{ display: "flex", alignItems: "flex-end", gap: 20, flexWrap: "wrap" }}>
              <div style={{ position: "relative" }}>
                <Avatar name={student.name} size={76} />
                <div style={{ position: "absolute", bottom: 2, right: 2, width: 14, height: 14, borderRadius: "50%",
                  border: "2px solid #1e1e3a", background: student.status === "Active" ? "#10b981" : "#ef4444" }} />
              </div>
              <div style={{ flex: 1, paddingBottom: 16 }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-.02em" }}>{student.name}</div>
                <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,.45)", fontFamily: "monospace" }}>{student.sid}</span>
                  <span style={{ color: "rgba(255,255,255,.2)" }}>·</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>{cls?.name || "—"}</span>
                  <span style={{ color: "rgba(255,255,255,.2)" }}>·</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>{student.gender}</span>
                  <span style={{ color: "rgba(255,255,255,.2)" }}>·</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>📞 {student.phone}</span>
                  <Pill label={student.status} bg={student.status === "Active" ? "#d1fae5" : "#fee2e2"} color={student.status === "Active" ? "#065f46" : "#991b1b"} />
                </div>
              </div>
              {/* KPI strip */}
              <div style={{ display: "flex", gap: 2, alignSelf: "flex-end" }}>
                {[
                  { label: "Attendance", value: attStats.rate + "%", color: attColor },
                  { label: "GPA",        value: gradeStats.gpa ?? "—", color: gpaColor },
                  { label: "Exams",      value: examStats.list.length, color: "#7c3aed" },
                  { label: "Messages",   value: stdMsgs.length, color: "#2563eb" },
                ].map(k => (
                  <div key={k.label} style={{ padding: "8px 12px", textAlign: "center", flexShrink: 0 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: k.color }}>{k.value}</div>
                    <div style={{ fontSize: 8, color: "rgba(255,255,255,.38)", marginTop: 2, fontWeight: 600, letterSpacing: ".04em" }}>{k.label.toUpperCase()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", marginTop: 18, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              {PROFILE_TABS.map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  padding: "10px 14px", border: "none", cursor: "pointer", fontFamily: "inherit",
                  fontSize: 12, fontWeight: 500, background: "transparent", whiteSpace: "nowrap", flexShrink: 0,
                  color: tab === t ? "#fff" : "rgba(255,255,255,.42)",
                  borderBottom: tab === t ? "2px solid #0d9488" : "2px solid transparent",
                  transition: "all .15s",
                }}>{t}</button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: "22px 22px 28px" }}>

            {/* ── OVERVIEW ── */}
            {tab === "Overview" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <ProfileCard title="Student Information">
                  <div>
                    {[["Full Name", student.name], ["Student ID", student.sid], ["Class", cls?.name || "—"],
                      ["Teacher", cls?.teacher || "—"], ["Room", cls?.room ? `Room ${cls.room}` : "—"],
                      ["Gender", student.gender], ["Phone", student.phone], ["Status", student.status]].map(([lbl, val]) => (
                      <div key={lbl} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 18px", borderBottom: "1px solid #f8fafc" }}>
                        <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{lbl}</span>
                        <span style={{ fontSize: 13, color: "#1e1e3a", fontWeight: 500 }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </ProfileCard>

                <div>
                  <ProfileCard title="Attendance Summary">
                    <div style={{ padding: "16px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: attBg, flexShrink: 0,
                          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                          <div style={{ fontSize: 19, fontWeight: 700, color: attColor }}>{attStats.rate}%</div>
                          <div style={{ fontSize: 9, color: attColor, fontWeight: 600 }}>RATE</div>
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
                          {["present", "absent", "late", "excused"].map(k => {
                            const cfg = STATUS_CONFIG[k];
                            return (
                              <div key={k} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 10, fontWeight: 600, color: cfg.color, width: 52 }}>{cfg.label}</span>
                                <MiniBar value={attStats[k]} max={attStats.total || 1} color={cfg.dot} />
                                <span style={{ fontSize: 12, color: "#334155", fontWeight: 600, minWidth: 20, textAlign: "right" }}>{attStats[k]}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8", textAlign: "center" }}>{attStats.total} school days tracked</div>
                    </div>
                  </ProfileCard>

                  <ProfileCard title="Academic Performance">
                    <div style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                        <div style={{ width: 50, height: 50, borderRadius: 10, flexShrink: 0,
                          background: GRADE_COLOR[gradeStats.letter]?.bg || "#f1f5f9",
                          display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <div style={{ fontSize: 22, fontWeight: 800, color: GRADE_COLOR[gradeStats.letter]?.color || "#94a3b8", lineHeight: 1 }}>{gradeStats.letter}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 26, fontWeight: 800, color: gpaColor, lineHeight: 1 }}>{gradeStats.gpa ?? "—"}</div>
                          <div style={{ fontSize: 11, color: "#94a3b8" }}>avg · {gradeStats.rows.length} subjects</div>
                        </div>
                      </div>
                      {gradeStats.rows.map(({ sub, total, letter }) => {
                        const gc = GRADE_COLOR[letter];
                        return (
                          <div key={sub.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <span style={{ fontSize: 11, color: "#64748b", flex: 1 }}>{sub.icon} {sub.name}</span>
                            <MiniBar value={total ?? 0} max={100} color={gc?.color || "#94a3b8"} />
                            <span style={{ fontSize: 11, fontWeight: 600, minWidth: 26, textAlign: "right", color: gc?.color || "#94a3b8" }}>{total ?? "—"}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4,
                              background: gc?.bg || "#f1f5f9", color: gc?.color || "#94a3b8", minWidth: 20, textAlign: "center" }}>{letter}</span>
                          </div>
                        );
                      })}
                    </div>
                  </ProfileCard>
                </div>

                <ProfileCard title="Recent Attendance" action={<button onClick={() => setTab("Attendance")} style={{ fontSize: 12, color: "#0d9488", background: "none", border: "none", cursor: "pointer" }}>See all →</button>}>
                  <div>
                    {attStats.history.slice(-7).reverse().map(({ date, status }) => {
                      const cfg = STATUS_CONFIG[status];
                      return (
                        <div key={date} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 18px", borderBottom: "1px solid #f8fafc" }}>
                          <span style={{ fontSize: 13, color: "#334155" }}>{new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
                          <Pill label={cfg.label} bg={cfg.bg} color={cfg.color} />
                        </div>
                      );
                    })}
                    {attStats.history.length === 0 && <div style={{ padding: 24, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No records yet</div>}
                  </div>
                </ProfileCard>

                <ProfileCard title="Upcoming Exams" action={<button onClick={() => setTab("Exams")} style={{ fontSize: 12, color: "#0d9488", background: "none", border: "none", cursor: "pointer" }}>See all →</button>}>
                  <div>
                    {examStats.list.filter(e => e.status === "upcoming").slice(0, 4).map(ex => {
                      const tc = EXAM_TYPES[ex.type];
                      return (
                        <div key={ex.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 18px", borderBottom: "1px solid #f8fafc" }}>
                          <span style={{ fontSize: 18 }}>{tc.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: "#1e1e3a" }}>{ex.title}</div>
                            <div style={{ fontSize: 11, color: "#94a3b8" }}>{new Date(ex.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {ex.duration} min</div>
                          </div>
                          <Pill label={tc.label} bg={tc.bg} color={tc.color} />
                        </div>
                      );
                    })}
                    {examStats.list.filter(e => e.status === "upcoming").length === 0 && <div style={{ padding: 24, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No upcoming exams</div>}
                  </div>
                </ProfileCard>
              </div>
            )}

            {/* ── ATTENDANCE ── */}
            {tab === "Attendance" && (
              <div>
                <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
                  {[
                    { label: "Rate",    value: attStats.rate + "%", color: attColor, bg: attBg },
                    { label: "Present", value: attStats.present,    color: "#059669", bg: "#d1fae5" },
                    { label: "Absent",  value: attStats.absent,     color: "#dc2626", bg: "#fee2e2" },
                    { label: "Late",    value: attStats.late,       color: "#d97706", bg: "#fef3c7" },
                    { label: "Excused", value: attStats.excused,    color: "#7c3aed", bg: "#ede9fe" },
                  ].map(s => (
                    <div key={s.label} style={{ flex: 1, background: s.bg, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: s.color, marginTop: 3 }}>{s.label.toUpperCase()}</div>
                    </div>
                  ))}
                </div>
                <ProfileCard title={`Full History — ${attStats.total} days`}>
                  {attStats.history.length === 0
                    ? <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>No records yet</div>
                    : <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", direction: "ltr" }}>
                        <thead><tr style={{ background: "#f8fafc" }}>
                          {["Date", "Day", "Status"].map(h => <th key={h} style={{ padding: "10px 18px", textAlign: "right", fontSize: 11, fontWeight: 600, color: "#94a3b8", borderBottom: "1px solid #f1f5f9", textTransform: "uppercase", letterSpacing: ".05em" }}>{h}</th>)}
                        </tr></thead>
                        <tbody>
                          {[...attStats.history].reverse().map(({ date, status }) => {
                            const cfg = STATUS_CONFIG[status];
                            const dt  = new Date(date + "T00:00:00");
                            return (
                              <tr key={date} onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                <td style={{ padding: "11px 18px", fontSize: 13, color: "#1e1e3a", borderBottom: "1px solid #f8fafc" }}>{dt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</td>
                                <td style={{ padding: "11px 18px", fontSize: 13, color: "#64748b", borderBottom: "1px solid #f8fafc" }}>{dt.toLocaleDateString("en-US", { weekday: "long" })}</td>
                                <td style={{ padding: "11px 18px", borderBottom: "1px solid #f8fafc" }}><Pill label={cfg.label} bg={cfg.bg} color={cfg.color} /></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>}
                </ProfileCard>
              </div>
            )}

            {/* ── GRADES ── */}
            {tab === "Grades" && (
              <div>
                <div style={{ background: "#fff", border: "1px solid #e8ecf2", borderRadius: 14, padding: "22px 24px", marginBottom: 18, display: "flex", alignItems: "center", gap: 20, boxShadow: "0 1px 4px rgba(0,0,0,.05)", flexWrap: "wrap" }}>
                  <div style={{ width: 76, height: 76, borderRadius: 14, background: GRADE_COLOR[gradeStats.letter]?.bg || "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <div style={{ fontSize: 32, fontWeight: 800, color: GRADE_COLOR[gradeStats.letter]?.color || "#94a3b8", lineHeight: 1 }}>{gradeStats.letter}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 34, fontWeight: 800, color: gpaColor, lineHeight: 1 }}>{gradeStats.gpa ?? "—"}</div>
                    <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Overall Average · {gradeStats.rows.length} subjects</div>
                  </div>
                  <div style={{ flex: 1, display: "flex", gap: 18, justifyContent: "flex-end", flexWrap: "wrap" }}>
                    {Object.entries({ A: "≥90", B: "80–89", C: "70–79", D: "60–69", F: "<60" }).map(([g, rng]) => {
                      const gc = GRADE_COLOR[g];
                      const cnt = gradeStats.rows.filter(r => r.letter === g).length;
                      return (
                        <div key={g} style={{ textAlign: "center" }}>
                          <div style={{ width: 34, height: 34, borderRadius: 8, background: gc.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: gc.color, margin: "0 auto 4px" }}>{cnt}</div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: gc.color }}>{g}</div>
                          <div style={{ fontSize: 9, color: "#94a3b8" }}>{rng}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <ProfileCard title="Subject Breakdown">
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", direction: "ltr" }}>
                      <thead><tr style={{ background: "#f8fafc" }}>
                        {["Subject", "Quiz 15%", "HW 15%", "Midterm 30%", "Final 40%", "Total", "Grade"].map(h => (
                          <th key={h} style={{ padding: "10px 14px", textAlign: "right", fontSize: 11, fontWeight: 600, color: "#94a3b8", borderBottom: "1px solid #f1f5f9", textTransform: "uppercase", letterSpacing: ".04em", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {gradeStats.rows.map(({ sub, g, total, letter }) => {
                          const gc = GRADE_COLOR[letter];
                          return (
                            <tr key={sub.id} onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                              <td style={{ padding: "12px 14px", borderBottom: "1px solid #f8fafc" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <span style={{ fontSize: 16 }}>{sub.icon}</span>
                                  <span style={{ fontSize: 13, fontWeight: 500, color: "#1e1e3a" }}>{sub.name}</span>
                                </div>
                              </td>
                              {[g.quiz, g.homework, g.midterm, g.final].map((v, i) => (
                                <td key={i} style={{ padding: "12px 14px", borderBottom: "1px solid #f8fafc" }}>
                                  {v !== null && v !== undefined
                                    ? <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <MiniBar value={v} max={100} color="#0d9488" />
                                        <span style={{ fontSize: 12, fontWeight: 600, color: "#1e1e3a", minWidth: 26 }}>{v}</span>
                                      </div>
                                    : <span style={{ color: "#94a3b8", fontSize: 12 }}>—</span>}
                                </td>
                              ))}
                              <td style={{ padding: "12px 14px", borderBottom: "1px solid #f8fafc" }}>
                                <span style={{ fontSize: 15, fontWeight: 700, color: gc?.color || "#94a3b8" }}>{total ?? "—"}</span>
                              </td>
                              <td style={{ padding: "12px 14px", borderBottom: "1px solid #f8fafc" }}>
                                <span style={{ display: "inline-block", fontWeight: 700, fontSize: 13, padding: "3px 10px", borderRadius: 6, background: gc?.bg || "#f1f5f9", color: gc?.color || "#94a3b8" }}>{letter}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </ProfileCard>
              </div>
            )}

            {/* ── EXAMS ── */}
            {tab === "Exams" && (
              <div>
                <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
                  {[
                    { label: "Total",     value: examStats.list.length,                                   color: "#1d4ed8", bg: "#dbeafe" },
                    { label: "Completed", value: examStats.list.filter(e => e.status === "completed").length, color: "#059669", bg: "#d1fae5" },
                    { label: "Upcoming",  value: examStats.list.filter(e => e.status === "upcoming").length,  color: "#7c3aed", bg: "#ede9fe" },
                    { label: "Avg Score", value: examStats.avgPct !== null ? examStats.avgPct + "%" : "—",    color: "#d97706", bg: "#fef3c7" },
                  ].map(s => (
                    <div key={s.label} style={{ flex: 1, background: s.bg, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: s.color, marginTop: 3 }}>{s.label.toUpperCase()}</div>
                    </div>
                  ))}
                </div>
                <ProfileCard title="All Exams">
                  <div>
                    {examStats.list.map(ex => {
                      const tc = EXAM_TYPES[ex.type];
                      const scColor = ex.pct === null ? "#94a3b8" : ex.pct >= 80 ? "#059669" : ex.pct >= 60 ? "#d97706" : "#dc2626";
                      const scBg    = ex.pct === null ? "#f1f5f9" : ex.pct >= 80 ? "#d1fae5" : ex.pct >= 60 ? "#fef3c7" : "#fee2e2";
                      return (
                        <div key={ex.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderBottom: "1px solid #f8fafc" }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: tc.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{tc.icon}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: "#1e1e3a" }}>{ex.title}</div>
                            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{new Date(ex.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {ex.duration} min · Room {ex.room}</div>
                          </div>
                          {ex.status === "completed"
                            ? <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 17, fontWeight: 700, color: scColor }}>{ex.score !== null ? `${ex.score}/${ex.maxScore}` : "—"}</div>
                                <div style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: scBg, color: scColor, display: "inline-block", marginTop: 2 }}>{ex.pct !== null ? ex.pct + "%" : "Not recorded"}</div>
                              </div>
                            : <Pill label={ex.status.charAt(0).toUpperCase() + ex.status.slice(1)} bg={ex.status === "upcoming" ? "#ede9fe" : "#fef3c7"} color={ex.status === "upcoming" ? "#6d28d9" : "#b45309"} />}
                        </div>
                      );
                    })}
                    {examStats.list.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>No exams scheduled</div>}
                  </div>
                </ProfileCard>
              </div>
            )}

            {/* ── MESSAGES ── */}

            {tab === "Schedule" && (
              <div>
                <div style={{ marginBottom: 16, fontSize: 13, color: T.textMuted }}>
                  Weekly timetable for <strong style={{ color: T.textMain }}>{cls?.name}</strong>
                </div>
                <div style={{ background: "#fff", border: "1px solid #e8ecf2", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                      <thead>
                        <tr>
                          <th style={{ padding: "12px 16px", background: "#1e1e3a", color: "rgba(255,255,255,.5)", fontSize: 11, fontWeight: 600, textAlign: "left", width: 130, borderRight: "1px solid rgba(255,255,255,.08)" }}>Period</th>
                          {DAYS.map((day, di) => {
                            const todayDi = (new Date().getDay() + 6) % 7;
                            const isToday = di === todayDi;
                            return (<th key={day} style={{ padding: "12px 10px", textAlign: "center", background: isToday ? T.primary : "#1e1e3a", color: isToday ? "#fff" : "rgba(255,255,255,.7)", fontSize: 12, fontWeight: 600, borderRight: di < 4 ? "1px solid rgba(255,255,255,.08)" : "none" }}>{day.slice(0,3)}</th>);
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {PERIODS.map(period => {
                          if (period.isBreak) return (<tr key={period.id}><td colSpan={6} style={{ padding: "7px 16px", background: "#f8fafc", borderTop: "1px solid #e8ecf2", borderBottom: "1px solid #e8ecf2", fontSize: 11, color: T.textMuted, textAlign: "center", fontWeight: 600 }}>Break - {period.time}</td></tr>);
                          const todayDi = (new Date().getDay() + 6) % 7;
                          return (
                            <tr key={period.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                              <td style={{ padding: "10px 16px", background: "#f8fafc", borderRight: "1px solid #e8ecf2" }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}>{period.label}</div>
                                <div style={{ fontSize: 10, color: T.textMuted }}>{period.time}</div>
                              </td>
                              {DAYS.map((day, di) => {
                                const isToday = di === todayDi;
                                const slot = (timetable && student && student.classId && timetable[student.classId] && timetable[student.classId][di]) ? timetable[student.classId][di][period.id] || null : null;
                                const subj = (slot && slot.subjectId) ? (stdSubjs.find(s => s.id === slot.subjectId) || subjects.find(s => s.id === slot.subjectId)) : null;
                                const clr = subj ? subjectColor(subj.name) : { bg: "#f8fafc", border: "#e8ecf2", text: "#94a3b8" };
                                return (
                                  <td key={day} style={{ padding: "6px 8px", textAlign: "center", borderRight: di < 4 ? "1px solid #f1f5f9" : "none", background: isToday ? "#f0fdf9" : "transparent", verticalAlign: "top" }}>
                                    {subj ? (<div style={{ background: clr.bg, border: "1px solid " + clr.border, borderRadius: 7, padding: "5px 8px" }}><div style={{ fontSize: 12, fontWeight: 600, color: clr.text }}>{subj.icon} {subj.name}</div></div>) : (<div style={{ height: 36, display: "flex", alignItems: "center", justifyContent: "center", color: "#e2e8f0" }}>-</div>)}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {tab === "Messages" && (
              <div>
                {!onClose && (<ParentCompose student={student} messages={messages} />)}
                {stdMsgs.length === 0
                  ? <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8", fontSize: 14 }}>No messages for this student</div>
                  : stdMsgs.map(msg => {
                    const tag = MSG_TAGS[msg.tag] || MSG_TAGS.general;
                    return (
                      <div key={msg.id} style={{ background: "#fff", border: "1px solid #e8ecf2", borderRadius: 14, marginBottom: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.04)", borderLeft: `4px solid ${tag.color}` }}>
                        <div style={{ padding: "14px 18px 12px" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, direction: "rtl" }}>
                              <div style={{ width: 30, height: 30, borderRadius: "50%", background: msg.fromSchool ? "#1e1e3a" : "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{msg.fromSchool ? "🏫" : "👤"}</div>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#1e1e3a" }}>{msg.subject}</div>
                                <div style={{ fontSize: 11, color: "#94a3b8" }}>{msg.fromSchool ? "From School" : "From Parent"} · {new Date(msg.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                              <Pill label={tag.label} bg={tag.bg} color={tag.color} />
                              {!msg.read && <Pill label="Unread" bg="#fee2e2" color="#dc2626" />}
                            </div>
                          </div>
                          <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, paddingRight: 40 }}>{msg.body}</div>
                        </div>
                        {msg.replies?.length > 0 && (
                          <div style={{ borderTop: "1px solid #f1f5f9", background: "#f8fafc" }}>
                            {msg.replies.map(r => (
                              <div key={r.id} style={{ padding: "10px 18px 10px 52px", borderBottom: "1px solid #f1f5f9", display: "flex", gap: 10 }}>
                                <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, background: r.fromSchool ? "#1e1e3a" : "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, marginTop: 1 }}>{r.fromSchool ? "🏫" : "👤"}</div>
                                <div>
                                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>{r.fromSchool ? "School" : "Parent"} · {new Date(r.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
                                  <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.55 }}>{r.body}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

function Students({ students, setStudents, classes, attendance, grades, subjects, exams, examResults, messages, teacherClassIds = null, userRole = "admin" }) {
  const visibleStudents = teacherClassIds ? students.filter(s => teacherClassIds.includes(s.classId)) : students;
  const [search, setSearch]           = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [modal, setModal]             = useState(null);
  const [form, setForm]               = useState(EMPTY_STUDENT);
  const [errors, setErrors]           = useState({});
  const [deleteId, setDeleteId]       = useState(null);
  const [selected, setSelected]       = useState(new Set());
  const [toast, setToast]             = useState("");
  const [profile, setProfile]         = useState(null);

  const showToast = (msg) => setToast(msg);

  const filtered = useMemo(() => students.filter(s => {
    const q = search.toLowerCase();
    const m = s.name.toLowerCase().includes(q) || s.sid.toLowerCase().includes(q) || (s.phone || "").toLowerCase().includes(q);
    const c = filterClass === "all" || s.classId === parseInt(filterClass);
    const y = filterYear === "all" || (s.academicYear || CURRENT_YEAR) === filterYear;
    return m && c && y;
  }), [students, search, filterClass, filterYear]);

  const allFilteredSelected = filtered.length > 0 && filtered.every(s => selected.has(s.id));
  const toggleSelect = (id) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const printStudentReport = (s) => {
    const today = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
    const clsName = classes.find(c => c.id === s.classId)?.name || '-';
    const attObj = attendance || {};
    let present = 0, absent = 0, late = 0, excused = 0, total = 0;
    Object.values(attObj).forEach(dayRec => {
      const rec = dayRec[s.id];
      if (rec) { total++; if (rec === 'Present') present++; else if (rec === 'Absent') absent++; else if (rec === 'Late') late++; else if (rec === 'Excused') excused++; }
    });
    const pct = total ? Math.round(present / total * 100) : 0;
    const win = window.open('', '_blank');
    const html = '<!DOCTYPE html><html><head><title>Student Report - ' + s.name + '</title>'
      + '<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Times New Roman,serif;color:#1a1a1a;padding:60px;max-width:800px;margin:0 auto}.header{display:flex;align-items:center;border-bottom:3px solid #0d9488;padding-bottom:16px;margin-bottom:30px}.logo{width:70px;height:70px;object-fit:contain;margin-right:20px}.school-center{flex:1;text-align:center}.school-name{font-size:22px;font-weight:bold;color:#0d9488}.school-sub{font-size:12px;color:#64748b;margin-top:3px}p{font-size:14px;line-height:1.9;margin-bottom:14px}h2{font-size:14px;font-weight:bold;color:#0d9488;margin:20px 0 8px}table{width:100%;border-collapse:collapse;margin:8px 0}td,th{padding:9px 14px;border:1px solid #d1d5db;font-size:13px}td:first-child{background:#f9fafb;font-weight:bold;width:38%}th{background:#f1f5f9;font-weight:600;text-align:left}.sig-line{border-top:1px solid #1a1a1a;width:200px;margin-top:48px;margin-bottom:6px}.footer{margin-top:40px;padding-top:12px;border-top:1px solid #e5e7eb;text-align:center;font-size:11px;color:#9ca3af}@media print{button{display:none!important}}</style></head><body>'
      + '<div class="header"><img src="/logo.png" class="logo" onerror="this.style.display=\'none\';" /><div class="school-center"><div class="school-name">Al-Huffath Academy</div><div class="school-sub">Ilm | Iman | Hifz</div><div class="school-sub">admin@al-huffath.edu</div></div></div>'
      + '<p style="margin-bottom:24px">' + today + '</p>'
      + '<p><b>To Whom It May Concern,</b></p>'
      + '<p style="font-weight:bold;border-bottom:2px solid #1a1a1a;padding-bottom:6px;margin-bottom:24px;text-transform:uppercase;letter-spacing:1px">OBJECT: <span style="font-weight:normal">Student Academic Report</span></p>'
      + '<p>This report is issued by Al-Huffath Academy to provide an official summary of the academic record of the student detailed below:</p>'
      + '<h2>Student Information</h2><table>'
      + '<tr><td>Full Name</td><td>' + s.name + '</td></tr>'
      + '<tr><td>Student ID</td><td>' + s.sid + '</td></tr>'
      + '<tr><td>Class</td><td>' + clsName + '</td></tr>'
      + '<tr><td>Gender</td><td>' + (s.gender||'-') + '</td></tr>'
      + '<tr><td>Phone</td><td>' + (s.phone||'-') + '</td></tr>'
      + '<tr><td>Status</td><td>' + s.status + '</td></tr>'
      + '<tr><td>Report Issued On</td><td>' + today + '</td></tr>'
      + '</table>'
      + '<h2>Attendance Summary</h2><table>'
      + '<tr><td>Present</td><td>' + present + ' days</td></tr>'
      + '<tr><td>Absent</td><td>' + absent + ' days</td></tr>'
      + '<tr><td>Late</td><td>' + late + ' days</td></tr>'
      + '<tr><td>Excused</td><td>' + excused + ' days</td></tr>'
      + '<tr><td>Attendance Rate</td><td><b>' + pct + '%</b></td></tr>'
      + '</table>'
      + '<p style="margin-top:20px">This report is provided upon request for administrative and verification purposes.</p>'
      + '<div style="margin-top:50px"><p>Regards,</p><div class="sig-line"></div><p style="font-weight:bold;font-size:13px">School Principal</p><p style="font-size:12px;color:#64748b">Al-Huffath Academy</p></div>'
      + '<div style="margin-top:28px"><button onclick="window.print()" style="padding:10px 28px;background:#0d9488;color:#fff;border:none;border-radius:6px;font-size:14px;cursor:pointer">Print Report</button></div>'
      + '<div class="footer">Generated by EduManage | Developed by Eng. Ahmad Zouikli | ' + today + '</div>'
      + '</body></html>';
    win.document.write(html);
    win.document.close();
  };
  const toggleAll = () => { if (allFilteredSelected) setSelected(new Set()); else setSelected(new Set(filtered.map(s => s.id))); };

  const deleteSelected = () => {
    const count = selected.size;
    setStudents(prev => prev.filter(s => !selected.has(s.id)));
    setSelected(new Set());
    showToast(`${count} student${count > 1 ? "s" : ""} deleted`);
  };

  const openAdd  = () => { setForm({ ...EMPTY_STUDENT, sid: `S${String(students.length + 1).padStart(3, "0")}` }); setErrors({}); setModal({ mode: "add", data: null }); };
  const openEdit = (s) => { setForm({ ...s }); setErrors({}); setModal({ mode: "edit", data: s }); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.sid.trim())  e.sid  = "Required";
    else if (students.some(s => s.sid === form.sid && s.id !== form.id)) e.sid = "ID already exists";
    return e;
  };

  const saveStudent = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (modal.mode === "add") {
      setStudents(prev => [...prev, { ...form, id: uid() }]);
    } else {
      setStudents(prev => prev.map(s => s.id === form.id ? form : s));
    }
    setModal(null);
    showToast(modal.mode === "add" ? "Student added" : "Student updated");
  };

  const doDelete = (id) => { setStudents(prev => prev.filter(s => s.id !== id)); setDeleteId(null); showToast("Student deleted"); };
  const cls = id => classes.find(c => String(c.id) === String(id))?.name || "—";

  const allDates = Object.keys(attendance || {}).sort();
  const atRiskIds = useMemo(() => {
    const ids = new Set();
    students.forEach(s => {
      let p = 0, total = 0;
      allDates.forEach(d => { const rec = (attendance || {})[d]?.[s.id]; if (rec) { total++; if (rec === "present") p++; } });
      if (total > 0 && Math.round((p / total) * 100) < 75) ids.add(s.id);
    });
    return ids;
  }, [students, attendance, allDates]);

  return (
    <div>
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", boxShadow: T.cardShadow }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: T.textMuted }}>🔍</span>
          <input placeholder="Search name, ID or phone…" value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, paddingRight: 32 }} />
        </div>
        <select value={filterYear} onChange={e => setFilterYear(e.target.value)} style={{ ...selectStyle, width: 155, fontWeight: 600 }}>
          <option value="all">All Years</option>
          {getAcademicYears(students).map(y => <option key={y} value={y}>{y}{y === CURRENT_YEAR ? " ✦" : ""}</option>)}
        </select>
        <select value={filterClass} onChange={e => setFilterClass(e.target.value)} style={{ ...selectStyle, width: 170 }}>
          <option value="all">All Classes</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {selected.size > 0 && (
          <button onClick={deleteSelected} style={{ padding: "9px 16px", borderRadius: 8, border: "none", background: T.danger, color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
            🗑 Delete {selected.size} Selected
          </button>
        )}
        <button onClick={() => exportToCSV(students.map(s => ({ Name: s.name, ID: s.sid, Class: cls(s.classId), Gender: s.gender, Phone: s.phone, Status: s.status })), "students.csv")}
          style={{ padding: "9px 16px", borderRadius: 8, border: `1px solid ${T.border}`, background: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit", color: T.textSub }}>
          ⬇ Export CSV
        </button>
        <button onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: T.primary, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>＋ Add Student</button>
      </div>

      {atRiskIds.size > 0 && (
        <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "10px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10, direction: "rtl" }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <span style={{ fontSize: 13, color: "#9a3412", fontWeight: 500 }}>{atRiskIds.size} student{atRiskIds.size > 1 ? "s" : ""} with attendance below 75% — highlighted below</span>
        </div>
      )}

      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, overflow: "hidden", boxShadow: T.cardShadow }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.textMain }}>All Students</div>
          <div style={{ fontSize: 12, color: T.textMuted, background: "#f1f5f9", padding: "3px 10px", borderRadius: 20 }}>{filtered.length} records</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", direction: "ltr" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ padding: "11px 14px", width: 36 }}>
                  <input type="checkbox" checked={allFilteredSelected} onChange={toggleAll} style={{ cursor: "pointer" }} />
                </th>
                {["Student", "ID", "Year", "Class", "Gender", "Phone", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: "right", fontSize: 11, fontWeight: 600, color: T.textMuted, borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap", letterSpacing: ".05em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: 48, textAlign: "center", color: T.textMuted, fontSize: 14 }}>No students found</td></tr>
              ) : filtered.map(s => {
                const isAtRisk = atRiskIds.has(s.id);
                const isSel    = selected.has(s.id);
                return (
                  <tr key={s.id} style={{ background: isSel ? "#f0fdf9" : isAtRisk ? "#fff1f2" : "transparent" }}>
                    <td style={{ padding: "11px 14px", borderBottom: "1px solid #f8fafc" }}>
                      <input type="checkbox" checked={isSel} onChange={() => toggleSelect(s.id)} style={{ cursor: "pointer" }} />
                    </td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, direction: "rtl" }}>
                        <Avatar name={s.name} />
                        <button onClick={() => setProfile(s)} style={{ fontSize: 14, fontWeight: 500, color: T.primary, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit", textDecoration: "underline dotted" }}>
                          {s.name}
                        </button>
                        {isAtRisk && <span title="Attendance at risk" style={{ fontSize: 12 }}>⚠️</span>}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc", fontSize: 13, color: T.textSub, fontFamily: "monospace" }}>{s.sid}</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc", fontSize: 13, color: T.textSub }}>{s.academicYear || "—"}</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc", fontSize: 13, color: "#334155" }}>{cls(s.classId)}</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc", fontSize: 13, color: T.textSub }}>{s.gender}</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc", fontSize: 13, color: T.textSub }}>{s.phone}</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc" }}><Badge status={s.status} /></td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => openEdit(s)} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${T.border}`, background: "#fff", fontSize: 12, cursor: "pointer", color: "#334155" }}>Edit</button>
                        <button onClick={() => setDeleteId(s.id)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: T.dangerBg, fontSize: 12, cursor: "pointer", color: T.danger }}>Delete</button>
                        <button onClick={() => printStudentReport(s)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: "#d1fae5", fontSize: 12, cursor: "pointer", color: "#065f46" }}>Report</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal.mode === "add" ? "Add New Student" : "Edit Student"} onClose={() => setModal(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Full Name" error={errors.name}>
                <input style={errors.name ? inputErrorStyle : inputStyle} value={form.name}
                  onChange={e => { setForm({ ...form, name: e.target.value }); setErrors(p => ({ ...p, name: "" })); }} placeholder="e.g. John Smith" />
              </Field>
            </div>
            <Field label="Student ID" error={errors.sid}>
              <input style={errors.sid ? inputErrorStyle : inputStyle} value={form.sid}
                onChange={e => { setForm({ ...form, sid: e.target.value }); setErrors(p => ({ ...p, sid: "" })); }} />
            </Field>
            <Field label="Phone">
              <input style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="555-0000" />
            </Field>
            <Field label="Class">
              <select style={selectStyle} value={form.classId} onChange={e => setForm({ ...form, classId: parseInt(e.target.value) })}>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Gender">
              <select style={selectStyle} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                <option>Male</option><option>Female</option>
              </select>
            </Field>
            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Status">
                <select style={selectStyle} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option>Active</option><option>Inactive</option>
                </select>
              </Field>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
            <button onClick={() => setModal(null)} style={{ padding: "9px 18px", borderRadius: 8, border: `1px solid ${T.border}`, background: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
            <button onClick={saveStudent} style={{ padding: "9px 24px", borderRadius: 8, border: "none", background: T.primary, color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
              {modal.mode === "add" ? "Add Student" : "Save Changes"}
            </button>
          </div>
        </Modal>
      )}
      {deleteId && (
        <Modal title="Confirm Delete" onClose={() => setDeleteId(null)}>
          <p style={{ fontSize: 14, color: T.textSub, marginBottom: 24 }}>Are you sure you want to delete <strong>{students.find(s => s.id === deleteId)?.name}</strong>?</p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button onClick={() => setDeleteId(null)} style={{ padding: "9px 18px", borderRadius: 8, border: `1px solid ${T.border}`, background: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
            <button onClick={() => doDelete(deleteId)} style={{ padding: "9px 22px", borderRadius: 8, border: "none", background: T.danger, color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
          </div>
        </Modal>
      )}
      {profile && (
        <StudentProfile student={profile} classes={classes} attendance={attendance || {}} grades={grades || {}} subjects={subjects || []} exams={exams || []} examResults={examResults || {}} messages={messages || []} onClose={() => setProfile(null)} />
      )}
    </div>
  );
}
// ─── Classes ──────────────────────────────────────────────────────────────────
function Classes({ classes, setClasses, students }) {
  // FIX 3: clean modal state
  const [modal, setModal]       = useState(null); // null | { mode: "add"|"edit", data: null|class }
  const [form, setForm]         = useState(EMPTY_CLASS);
  const [errors, setErrors]     = useState({}); // FIX 6
  const [deleteId, setDeleteId] = useState(null);

  const count = id => students.filter(s => s.classId === id).length;

  const openAdd  = () => { setForm(EMPTY_CLASS); setErrors({}); setModal({ mode: "add", data: null }); };
  const openEdit = (c) => { setForm({ ...c }); setErrors({}); setModal({ mode: "edit", data: c }); };

  // FIX 6: validate
  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Required";
    if (!form.teacher.trim()) e.teacher = "Required";
    return e;
  };

  const save = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    modal.mode === "add"
      ? setClasses(prev => [...prev, { ...form, id: uid() }])
      : setClasses(prev => prev.map(c => c.id === form.id ? form : c));
    setModal(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <button onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", background: T.primary, color: "#fff", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>＋ Add Class</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: 16 }}>
        {classes.map(c => {
          const enrolled  = count(c.id);
          const capacity  = c.capacity || 25;
          // FIX 2: use actual capacity as denominator
          const fillPct   = Math.min(Math.round((enrolled / capacity) * 100), 100);
          const fillColor = fillPct >= 90 ? "#ef4444" : fillPct >= 70 ? "#f59e0b" : T.primary;
          return (
            <div key={c.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 22, boxShadow: T.cardShadow, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: T.textMain }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: T.textMuted, marginTop: 3 }}>Room {c.room}</div>
                </div>
                <div style={{ background: "#ede9fe", color: "#6d28d9", borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 600 }}>
                  {enrolled}/{capacity} <span style={{ fontWeight: 400 }}>seats</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Avatar name={c.teacher} size={28} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "#334155" }}>{c.teacher}</div>
                  <div style={{ fontSize: 11, color: T.textMuted }}>Class Teacher</div>
                </div>
              </div>
              {/* FIX 2: progress bar shows enrolled vs capacity, with color warning */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 11, color: T.textMuted }}>
                  <span>Enrollment</span><span style={{ color: fillColor, fontWeight: 600 }}>{fillPct}%</span>
                </div>
                <div style={{ height: 5, background: "#f1f5f9", borderRadius: 5, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: fillColor, borderRadius: 5, width: fillPct + "%", transition: "width .4s" }} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => openEdit(c)} style={{ flex: 1, padding: "7px 0", borderRadius: 7, border: `1px solid ${T.border}`, background: "#fff", fontSize: 12, cursor: "pointer", color: "#334155", fontFamily: "inherit" }}>Edit</button>
                <button onClick={() => setDeleteId(c.id)} style={{ flex: 1, padding: "7px 0", borderRadius: 7, border: "none", background: T.dangerBg, fontSize: 12, cursor: "pointer", color: T.danger, fontFamily: "inherit" }}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <Modal title={modal.mode === "add" ? "Add New Class" : "Edit Class"} onClose={() => setModal(null)}>
          <Field label="Class Name" error={errors.name}>
            <input style={errors.name ? inputErrorStyle : inputStyle} value={form.name}
              onChange={e => { setForm({ ...form, name: e.target.value }); setErrors(p => ({ ...p, name: "" })); }}
              placeholder="e.g. Grade 1 — A" />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Field label="Grade">
              <input style={inputStyle} value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} placeholder="Grade 1" />
            </Field>
            <Field label="Room Number">
              <input style={inputStyle} value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} placeholder="101" />
            </Field>
          </div>
          <Field label="Class Teacher" error={errors.teacher}>
            <input style={errors.teacher ? inputErrorStyle : inputStyle} value={form.teacher}
              onChange={e => { setForm({ ...form, teacher: e.target.value }); setErrors(p => ({ ...p, teacher: "" })); }}
              placeholder="Ms. Jane Doe" />
          </Field>
          <Field label="Capacity">
            <input type="number" min={1} style={inputStyle} value={form.capacity}
              onChange={e => setForm({ ...form, capacity: parseInt(e.target.value) || 25 })} />
          </Field>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
            <button onClick={() => setModal(null)} style={{ padding: "9px 18px", borderRadius: 8, border: `1px solid ${T.border}`, background: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
            <button onClick={save} style={{ padding: "9px 22px", borderRadius: 8, border: "none", background: T.primary, color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Save</button>
          </div>
        </Modal>
      )}
      {deleteId && (
        <Modal title="Delete Class?" onClose={() => setDeleteId(null)}>
          <p style={{ fontSize: 14, color: T.textSub, marginBottom: 24 }}>This class will be permanently deleted.</p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button onClick={() => setDeleteId(null)} style={{ padding: "9px 18px", borderRadius: 8, border: `1px solid ${T.border}`, background: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
            <button onClick={() => { setClasses(prev => prev.filter(c => c.id !== deleteId)); setDeleteId(null); }}
              style={{ padding: "9px 22px", borderRadius: 8, border: "none", background: T.danger, color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Grades Module ───────────────────────────────────────────────────────────
function Grades({ students, classes, subjects, grades, setGrades, teacherClassIds = null }) {
  const visibleClasses = teacherClassIds ? classes.filter(c => teacherClassIds.includes(c.id)) : classes;
  const visibleStudents = teacherClassIds ? students.filter(s => teacherClassIds.includes(s.classId)) : students;
  const [view, setView]       = useState("enter"); // "enter" | "report"
  const [classId, setClassId] = useState(classes[0]?.id || 1);
  const [subjectId, setSubjectId] = useState(null);
  const [saved, setSaved]     = useState(false);

  const classSubjects = useMemo(
    () => subjects.filter(s => s.classId === classId),
    [subjects, classId]
  );

  // Auto-select first subject when class changes
  useEffect(() => {
    setSubjectId(classSubjects[0]?.id || null);
    setSaved(false);
  }, [classId, classSubjects]);

  const classStudents = useMemo(
    () => students.filter(s => s.classId === classId && s.status === "Active"),
    [students, classId]
  );

  // Local draft for the current subject's grades
  const [draft, setDraft] = useState({});

  useEffect(() => {
    if (!subjectId) return;
    const init = {};
    classStudents.forEach(s => {
      init[s.id] = grades[s.id]?.[subjectId]
        ? { ...grades[s.id][subjectId] }
        : { quiz: "", homework: "", midterm: "", final: "" };
    });
    setDraft(init);
    setSaved(false);
  }, [subjectId, classId]); // eslint-disable-line

  const setField = (sid, field, val) => {
    const num = val === "" ? "" : Math.min(100, Math.max(0, parseInt(val) || 0));
    setDraft(prev => ({ ...prev, [sid]: { ...prev[sid], [field]: num } }));
    setSaved(false);
  };

  const saveGrades = () => {
    setGrades(prev => {
      const next = { ...prev };
      classStudents.forEach(s => {
        next[s.id] = { ...(next[s.id] || {}), [subjectId]: { ...draft[s.id] } };
      });
      return next;
    });
    setSaved(true);
  };

  // ── Report helpers ───────────────────────────────────────────────────────
  const reportData = useMemo(() => {
    return classStudents.map(s => {
      const subScores = classSubjects.map(sub => {
        const total = calcTotal(grades[s.id]?.[sub.id]);
        return { subjectId: sub.id, name: sub.name, icon: sub.icon, total };
      });
      const scored   = subScores.filter(x => x.total !== null);
      const gpa      = scored.length
        ? Math.round(scored.reduce((a, x) => a + x.total, 0) / scored.length)
        : null;
      return { ...s, subScores, gpa };
    }).sort((a, b) => (b.gpa ?? -1) - (a.gpa ?? -1));
  }, [classStudents, classSubjects, grades]);

  const GradeChip = ({ score, size = "sm" }) => {
    const letter = letterGrade(score);
    const cfg    = GRADE_COLOR[letter];
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        background: cfg.bg, color: cfg.color,
        borderRadius: 6, padding: size === "lg" ? "4px 14px" : "2px 8px",
        fontSize: size === "lg" ? 15 : 12, fontWeight: 700,
      }}>
        {letter}{score !== null && <span style={{ fontWeight: 400, fontSize: size === "lg" ? 12 : 10 }}>({score})</span>}
      </span>
    );
  };

  const numInput = { width: 60, padding: "7px 8px", border: `1px solid ${T.border}`, borderRadius: 7,
    fontSize: 13, fontFamily: "inherit", textAlign: "center", outline: "none",
    background: T.inputBg, color: T.textMain };

  return (
    <div>
      {/* Toolbar */}
      <div style={{
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius,
        padding: "16px 20px", marginBottom: 20,
        display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
        boxShadow: T.cardShadow,
      }}>
        <select value={classId} onChange={e => setClassId(parseInt(e.target.value))}
          style={{ ...selectStyle, width: 190 }}>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        {view === "enter" && (
          <select value={subjectId ?? ""} onChange={e => setSubjectId(parseInt(e.target.value))}
            style={{ ...selectStyle, width: 180 }}>
            {classSubjects.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
          </select>
        )}

        <div style={{ display: "flex", gap: 4, marginRight: "auto" }}>
          {["enter", "report"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 13, fontFamily: "inherit", fontWeight: 500,
              background: view === v ? T.navy : "#f1f5f9",
              color: view === v ? "#fff" : T.textSub,
            }}>
              {v === "enter" ? "Enter Grades" : "Report Card"}
            </button>
          ))}
        </div>

        {view === "enter" && (
          <button onClick={saveGrades} style={{
            padding: "9px 22px", borderRadius: 8, border: "none",
            background: saved ? "#d1fae5" : T.primary,
            color: saved ? "#059669" : "#fff",
            fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 7, transition: "all .2s",
          }}>
            {saved ? "✓ Saved" : "Save Grades"}
          </button>
        )}
      </div>

      {/* Weight legend */}
      {view === "enter" && (
        <div style={{
          display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap",
        }}>
          {[["Quiz","15%","#7c3aed","#ede9fe"],["Homework","15%","#2563eb","#dbeafe"],
            ["Midterm","30%","#d97706","#fef3c7"],["Final","40%","#059669","#d1fae5"]].map(([lbl, pct, col, bg]) => (
            <span key={lbl} style={{
              fontSize: 11, fontWeight: 500, padding: "3px 10px",
              borderRadius: 20, background: bg, color: col,
            }}>{lbl} — {pct}</span>
          ))}
          <span style={{ fontSize: 11, color: T.textMuted, marginRight: 4, alignSelf: "center" }}>
            All scores out of 100
          </span>
        </div>
      )}

      {/* ── Enter Grades View ── */}
      {view === "enter" && (
        <div style={{
          background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius,
          overflow: "hidden", boxShadow: T.cardShadow,
        }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: T.textMain }}>
                {classSubjects.find(s => s.id === subjectId)?.icon}{" "}
                {classSubjects.find(s => s.id === subjectId)?.name || "—"}
              </div>
              <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>
                {classes.find(c => c.id === classId)?.name}
              </div>
            </div>
            <div style={{ fontSize: 12, color: T.textMuted, background: "#f1f5f9", padding: "3px 10px", borderRadius: 20 }}>
              {classStudents.length} students
            </div>
          </div>

          {classStudents.length === 0 ? (
            <div style={{ padding: 48, textAlign: "center", color: T.textMuted }}>No active students</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", direction: "ltr" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["Student", "Quiz /100", "Homework /100", "Midterm /100", "Final /100", "Total", "Grade"].map(h => (
                      <th key={h} style={{ padding: "11px 16px", textAlign: h === "Student" ? "right" : "center",
                        fontSize: 11, fontWeight: 600, color: T.textMuted, borderBottom: "1px solid #f1f5f9",
                        whiteSpace: "nowrap", letterSpacing: ".05em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {classStudents.map((s, i) => {
                    const row   = draft[s.id] || {};
                    const total = calcTotal({ quiz: row.quiz === "" ? null : row.quiz, homework: row.homework === "" ? null : row.homework, midterm: row.midterm === "" ? null : row.midterm, final: row.final === "" ? null : row.final });
                    return (
                      <tr key={s.id}
                        onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "11px 16px", borderBottom: "1px solid #f8fafc" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, direction: "rtl" }}>
                            <Avatar name={s.name} size={30} />
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 500, color: T.textMain }}>{s.name}</div>
                              <div style={{ fontSize: 11, color: T.textMuted }}>{s.sid}</div>
                            </div>
                          </div>
                        </td>
                        {["quiz", "homework", "midterm", "final"].map(field => (
                          <td key={field} style={{ padding: "11px 16px", borderBottom: "1px solid #f8fafc", textAlign: "center" }}>
                            <input type="number" min={0} max={100}
                              value={row[field] ?? ""}
                              onChange={e => setField(s.id, field, e.target.value)}
                              style={numInput}
                              placeholder="—" />
                          </td>
                        ))}
                        <td style={{ padding: "11px 16px", borderBottom: "1px solid #f8fafc", textAlign: "center" }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: total !== null ? T.textMain : T.textMuted }}>
                            {total !== null ? total : "—"}
                          </span>
                        </td>
                        <td style={{ padding: "11px 16px", borderBottom: "1px solid #f8fafc", textAlign: "center" }}>
                          <GradeChip score={total} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Report Card View ── */}
      {view === "report" && (
        <div style={{
          background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius,
          overflow: "hidden", boxShadow: T.cardShadow,
        }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: T.textMain }}>Report Card</div>
              <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>
                {classes.find(c => c.id === classId)?.name} · sorted by GPA
              </div>
            </div>
            {/* Grade distribution summary */}
            <div style={{ display: "flex", gap: 8 }}>
              {["A","B","C","D","F"].map(letter => {
                const cnt = reportData.filter(s => letterGrade(s.gpa) === letter).length;
                if (!cnt) return null;
                const cfg = GRADE_COLOR[letter];
                return (
                  <span key={letter} style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px",
                    borderRadius: 20, background: cfg.bg, color: cfg.color }}>
                    {letter}: {cnt}
                  </span>
                );
              })}
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", direction: "ltr" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={{ padding: "11px 16px", textAlign: "right", fontSize: 11, fontWeight: 600, color: T.textMuted, borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" }}>RANK</th>
                  <th style={{ padding: "11px 16px", textAlign: "right", fontSize: 11, fontWeight: 600, color: T.textMuted, borderBottom: "1px solid #f1f5f9" }}>STUDENT</th>
                  {classSubjects.map(sub => (
                    <th key={sub.id} style={{ padding: "11px 16px", textAlign: "center", fontSize: 11, fontWeight: 600, color: T.textMuted, borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" }}>
                      {sub.icon} {sub.name}
                    </th>
                  ))}
                  <th style={{ padding: "11px 16px", textAlign: "center", fontSize: 11, fontWeight: 600, color: T.textMuted, borderBottom: "1px solid #f1f5f9" }}>GPA</th>
                  <th style={{ padding: "11px 16px", textAlign: "center", fontSize: 11, fontWeight: 600, color: T.textMuted, borderBottom: "1px solid #f1f5f9" }}>GRADE</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((s, i) => (
                  <tr key={s.id}
                    onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "13px 16px", borderBottom: "1px solid #f8fafc", textAlign: "center" }}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : (
                        <span style={{ fontSize: 13, color: T.textMuted, fontWeight: 500 }}>#{i + 1}</span>
                      )}
                    </td>
                    <td style={{ padding: "13px 16px", borderBottom: "1px solid #f8fafc" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, direction: "rtl" }}>
                        <Avatar name={s.name} size={30} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: T.textMain }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: T.textMuted }}>{s.sid}</div>
                        </div>
                      </div>
                    </td>
                    {s.subScores.map(sub => (
                      <td key={sub.subjectId} style={{ padding: "13px 16px", borderBottom: "1px solid #f8fafc", textAlign: "center" }}>
                        <GradeChip score={sub.total} />
                      </td>
                    ))}
                    <td style={{ padding: "13px 16px", borderBottom: "1px solid #f8fafc", textAlign: "center" }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: T.textMain }}>{s.gpa ?? "—"}</span>
                    </td>
                    <td style={{ padding: "13px 16px", borderBottom: "1px solid #f8fafc", textAlign: "center" }}>
                      <GradeChip score={s.gpa} size="lg" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Grade scale legend */}
          <div style={{ padding: "12px 20px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: T.textMuted, marginRight: 4 }}>Scale:</span>
            {[["A","90-100"],["B","80-89"],["C","70-79"],["D","60-69"],["F","<60"]].map(([l,r]) => {
              const cfg = GRADE_COLOR[l];
              return (
                <span key={l} style={{ fontSize: 11, fontWeight: 600, padding: "2px 9px",
                  borderRadius: 20, background: cfg.bg, color: cfg.color }}>
                  {l} = {r}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Timetable Module ────────────────────────────────────────────────────────
function Timetable({ classes, subjects, timetable, setTimetable, teacherClassIds = null }) {
  const visibleClasses = teacherClassIds ? classes.filter(c => teacherClassIds.includes(c.id)) : classes;
  const [classId,  setClassId]  = useState((teacherClassIds ? classes.filter(c => teacherClassIds.includes(c.id)) : classes)[0]?.id || 1);
  const [modal,    setModal]    = useState(null); // { day, periodId } | null
  const [form,     setForm]     = useState({ subjectId: "", room: "" });
  const todayDayIdx = (new Date().getDay() + 6) % 7; // 0=Mon … 4=Fri

  const classSubjects = useMemo(
    () => subjects.filter(s => s.classId === classId),
    [subjects, classId]
  );

  const getSlot = (dayIdx, periodId) =>
    timetable[classId]?.[dayIdx]?.[periodId] || null;

  const openEdit = (dayIdx, periodId) => {
    if (teacherClassIds) return; // teachers cannot edit timetable
    const slot = getSlot(dayIdx, periodId);
    setForm({
      subjectId: slot?.subjectId ?? "",
      room:      slot?.room ?? (classes.find(c => c.id === classId)?.room || ""),
    });
    setModal({ dayIdx, periodId });
  };

  const saveSlot = () => {
    const { dayIdx, periodId } = modal;
    setTimetable(prev => ({
      ...prev,
      [classId]: {
        ...(prev[classId] || {}),
        [dayIdx]: {
          ...(prev[classId]?.[dayIdx] || {}),
          [periodId]: form.subjectId
            ? { subjectId: parseInt(form.subjectId), room: form.room }
            : null,
        },
      },
    }));
    setModal(null);
  };

  const clearSlot = (dayIdx, periodId) => {
    setTimetable(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      if (next[classId]?.[dayIdx]) next[classId][dayIdx][periodId] = null;
      return next;
    });
  };

  const currentClass = classes.find(c => c.id === classId);

  return (
    <div>
      {/* Toolbar */}
      <div style={{
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius,
        padding: "16px 20px", marginBottom: 20,
        display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
        boxShadow: T.cardShadow,
      }}>
        <select value={classId} onChange={e => setClassId(parseInt(e.target.value))}
          style={{ ...selectStyle, width: 200 }}>
          {visibleClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div style={{ fontSize: 13, color: T.textSub }}>
          👤 {currentClass?.teacher} &nbsp;·&nbsp; 🚪 Room {currentClass?.room}
        </div>
        <div style={{ marginRight: "auto", fontSize: 12, color: T.textMuted }}>
          Click any cell to edit · Today highlighted in teal
        </div>
      </div>

      {/* Grid */}
      <div style={{
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius,
        overflow: "hidden", boxShadow: T.cardShadow,
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead>
              <tr>
                {/* Period header */}
                <th style={{
                  padding: "12px 16px", background: T.navy, color: "rgba(255,255,255,.5)",
                  fontSize: 11, fontWeight: 600, textAlign: "right",
                  borderRight: `1px solid rgba(255,255,255,.08)`, width: 130,
                  letterSpacing: ".05em", textTransform: "uppercase",
                }}>Period</th>
                {DAYS.map((day, di) => {
                  const isToday = di === todayDayIdx;
                  return (
                    <th key={day} style={{
                      padding: "12px 16px", textAlign: "center",
                      background: isToday ? T.primary : T.navy,
                      color: isToday ? "#fff" : "rgba(255,255,255,.7)",
                      fontSize: 13, fontWeight: 600,
                      borderRight: di < 4 ? `1px solid rgba(255,255,255,.08)` : "none",
                      position: "relative",
                    }}>
                      {day}
                      {isToday && (
                        <div style={{
                          position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)",
                          width: 6, height: 6, borderRadius: "50%", background: "#5eead4",
                        }} />
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {PERIODS.map((period, pi) => {
                if (period.isBreak) {
                  return (
                    <tr key={period.id}>
                      <td colSpan={6} style={{
                        padding: "8px 16px", background: "#f8fafc",
                        borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`,
                        fontSize: 11, fontWeight: 600, color: T.textMuted,
                        textAlign: "center", letterSpacing: ".08em",
                      }}>
                        ☕ {period.label.toUpperCase()} &nbsp; {period.time}
                      </td>
                    </tr>
                  );
                }
                return (
                  <tr key={period.id} style={{ borderTop: `1px solid ${T.border}` }}>
                    {/* Period label */}
                    <td style={{
                      padding: "10px 16px", background: "#f8fafc",
                      borderRight: `1px solid ${T.border}`,
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: T.textMain }}>{period.label}</div>
                      <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>{period.time}</div>
                    </td>
                    {DAYS.map((day, di) => {
                      const isToday = di === todayDayIdx;
                      const slot    = getSlot(di, period.id);
                      const subj    = subjects.find(s => s.id === slot?.subjectId);
                      const clr     = subj ? subjectColor(subj.name) : null;
                      return (
                        <td key={day} style={{
                          padding: "8px 10px", verticalAlign: "top",
                          borderRight: di < 4 ? `1px solid ${T.border}` : "none",
                          background: isToday ? "#f0fdf9" : "transparent",
                          cursor: "pointer", transition: "background .12s",
                        }}
                          onClick={() => openEdit(di, period.id)}
                          onMouseEnter={e => e.currentTarget.style.background = isToday ? "#dcfce7" : "#f8fafc"}
                          onMouseLeave={e => e.currentTarget.style.background = isToday ? "#f0fdf9" : "transparent"}
                        >
                          {slot && subj ? (
                            <div style={{
                              background: clr.bg, border: `1px solid ${clr.border}`,
                              borderRadius: 8, padding: "7px 10px",
                              position: "relative",
                            }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: clr.text }}>
                                {subj.icon} {subj.name}
                              </div>
                              {slot.room && (
                                <div style={{ fontSize: 11, color: clr.text, opacity: .7, marginTop: 2 }}>
                                  🚪 Room {slot.room}
                                </div>
                              )}
                              {/* Clear button */}
                              <button
                                onClick={e => { e.stopPropagation(); clearSlot(di, period.id); }}
                                style={{
                                  position: "absolute", top: 4, right: 4,
                                  width: 18, height: 18, borderRadius: "50%",
                                  border: "none", background: clr.border,
                                  color: clr.text, fontSize: 10, cursor: "pointer",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  lineHeight: 1, padding: 0, fontWeight: 700,
                                }}>×</button>
                            </div>
                          ) : (
                            <div style={{
                              height: 52, border: `1.5px dashed ${T.border}`, borderRadius: 8,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: T.textMuted, fontSize: 18, opacity: .4,
                            }}>＋</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subject legend */}
      <div style={{
        marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center",
      }}>
        <span style={{ fontSize: 11, color: T.textMuted }}>Subjects in this class:</span>
        {classSubjects.map(s => {
          const clr = subjectColor(s.name);
          return (
            <span key={s.id} style={{
              fontSize: 12, fontWeight: 500, padding: "3px 10px",
              borderRadius: 20, background: clr.bg, color: clr.text,
              border: `1px solid ${clr.border}`,
            }}>{s.icon} {s.name}</span>
          );
        })}
      </div>

      {/* Edit modal */}
      {modal && (
        <Modal
          title={`Edit Slot — ${DAYS[modal.dayIdx]}, ${PERIODS.find(p => p.id === modal.periodId)?.label}`}
          onClose={() => setModal(null)}
        >
          <Field label="Subject">
            <select style={selectStyle} value={form.subjectId}
              onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))}>
              <option value="">— Free / Empty —</option>
              {classSubjects.map(s => (
                <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Room">
            <input style={inputStyle} value={form.room}
              onChange={e => setForm(f => ({ ...f, room: e.target.value }))}
              placeholder="e.g. 101" />
          </Field>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
            <button onClick={() => setModal(null)} style={{
              padding: "9px 18px", borderRadius: 8, border: `1px solid ${T.border}`,
              background: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit",
            }}>Cancel</button>
            <button onClick={saveSlot} style={{
              padding: "9px 22px", borderRadius: 8, border: "none",
              background: T.primary, color: "#fff", fontSize: 13,
              fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
            }}>Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Messaging Module ─────────────────────────────────────────────────────────

// ─── Enhanced Messaging System ───────────────────────────────────────────────
function EnhancedMessaging({ students, classes, messages, setMessages, teachers, userRole, auth }) {
  const [view, setView] = useState("inbox"); // inbox | compose | broadcast | thread
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyImage, setReplyImage] = useState(null);
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("all");
  const [compose, setCompose] = useState({ studentId: "", subject: "", body: "", tag: "general", image: null });
  const [bcForm, setBcForm] = useState({ classId: "all", subject: "", body: "", tag: "announcement", image: null });

  const isAdmin = userRole === "admin";
  const isTeacher = userRole === "teacher";

  const filtered = useMemo(() => (messages||[]).filter(m => {
    const s = students.find(st => st.id === m.studentId);
    const matchSearch = !search || (s?.name||"").toLowerCase().includes(search.toLowerCase()) || (m.subject||"").toLowerCase().includes(search.toLowerCase());
    const matchTag = filterTag === "all" || m.tag === filterTag;
    return matchSearch && matchTag;
  }).sort((a,b) => b.timestamp - a.timestamp), [messages, students, search, filterTag]);

  const selectedMsg = (messages||[]).find(m => m.id === selected);
  const unread = (messages||[]).filter(m => !m.read).length;

  const fmtTime = (ts) => {
    const d = new Date(ts), now = new Date(), diff = now - d;
    if (diff < 3600000) return Math.floor(diff/60000) + "m ago";
    if (diff < 86400000) return d.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
    return d.toLocaleDateString("en-US",{month:"short",day:"numeric"});
  };

  const openMsg = (msg) => {
    setSelected(msg.id);
    setView("thread");
    setReplyText("");
    setReplyImage(null);
    if (!msg.read) setMessages(prev => prev.map(m => m.id === msg.id ? {...m, read:true} : m));
  };

  const sendReply = () => {
    if (!replyText.trim() && !replyImage) return;
    const reply = { id: uid(), fromSchool: true, body: replyText.trim(), image: replyImage, timestamp: Date.now(), senderName: isTeacher ? (auth?.name||"Teacher") : "Admin" };
    setMessages(prev => prev.map(m => m.id === selected ? {...m, replies:[...(m.replies||[]),reply]} : m));
    setReplyText(""); setReplyImage(null);
  };

  const sendNew = () => {
    if (!compose.studentId || !compose.subject.trim() || !compose.body.trim()) return;
    console.log("IMAGE:", compose.image ? "EXISTS" : "NULL");
    const img = compose.image;
    const msg = { id: uid(), studentId: parseInt(compose.studentId), tag: compose.tag, subject: compose.subject, body: compose.body, image: img, fromSchool: true, timestamp: Date.now(), read: true, replies: [], senderName: auth?.name||"School" };
    setMessages(prev => [msg, ...prev]);
    setView("inbox"); setCompose({ studentId:"", subject:"", body:"", tag:"general", image:null });
  };

  const sendBroadcast = () => {
    if (!bcForm.subject.trim() || !bcForm.body.trim()) return;
    const targets = bcForm.classId === "all" ? students : students.filter(s => s.classId === parseInt(bcForm.classId));
    const newMsgs = targets.map(s => ({ id: uid(), studentId: s.id, tag: bcForm.tag, subject: bcForm.subject, body: bcForm.body, image: bcForm.image, fromSchool: true, timestamp: Date.now(), read: true, replies: [], broadcast: true, senderName: auth?.name||"School" }));
    setMessages(prev => [...newMsgs, ...prev]);
    setView("inbox"); setBcForm({ classId:"all", subject:"", body:"", tag:"announcement", image:null });
  };

  const handleImageUpload = (e, setter) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setter(reader.result);
    reader.readAsDataURL(f);
  };

  const tagColors = { general:"#e0f2fe:#0369a1", announcement:"#fef9c3:#854d0e", urgent:"#fee2e2:#dc2626", homework:"#f0fdf4:#166534", exam:"#ede9fe:#6d28d9" };
  const getTagStyle = (tag) => { const [bg,color] = (tagColors[tag]||"#f1f5f9:#475569").split(":"); return { background:bg, color }; };

  const inp = { width:"100%", padding:"9px 12px", border:"1px solid #e2e8f0", borderRadius:8, fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box" };

  // ── Compose View ──────────────────────────────────────────────────────────
  if (view === "compose") return (
    <div style={{ maxWidth:640, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <button onClick={() => setView("inbox")} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", fontSize:13 }}>← Back</button>
        <div style={{ fontSize:16, fontWeight:700, color:"#1e293b" }}>✉️ New Message</div>
      </div>
      <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", padding:24 }}>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>To (Student) *</label>
          <select style={inp} value={compose.studentId} onChange={e => setCompose({...compose, studentId:e.target.value})}>
            <option value="">Select student...</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name} — {(classes.find(c=>c.id===s.classId)||{}).name||""}</option>)}
          </select>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>Tag</label>
            <select style={inp} value={compose.tag} onChange={e => setCompose({...compose, tag:e.target.value})}>
              {["general","announcement","urgent","homework","exam"].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>Subject *</label>
            <input style={inp} value={compose.subject} onChange={e => setCompose({...compose, subject:e.target.value})} placeholder="Message subject..." />
          </div>
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>Message *</label>
          <textarea style={{...inp, resize:"vertical"}} rows={5} value={compose.body} onChange={e => setCompose({...compose, body:e.target.value})} placeholder="Write your message..." />
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>📎 Attach Image (optional)</label>
          <input type="file" accept="image/*" onChange={e => handleImageUpload(e, img => setCompose(prev => ({...prev, image:img})))} style={{ fontSize:12 }} />
          {compose.image && <img src={compose.image} style={{ maxWidth:"100%", maxHeight:120, borderRadius:8, marginTop:8 }} />}
        </div>
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button onClick={() => setView("inbox")} style={{ padding:"9px 18px", borderRadius:8, border:"1px solid #e2e8f0", background:"#fff", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
          <button onClick={sendNew} style={{ padding:"9px 20px", borderRadius:8, border:"none", background:"#0d9488", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Send Message</button>
        </div>
      </div>
    </div>
  );

  // ── Broadcast View ────────────────────────────────────────────────────────
  if (view === "broadcast") return (
    <div style={{ maxWidth:640, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <button onClick={() => setView("inbox")} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", fontSize:13 }}>← Back</button>
        <div style={{ fontSize:16, fontWeight:700, color:"#1e293b" }}>📢 Broadcast to Class</div>
      </div>
      <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", padding:24 }}>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>Target Class</label>
          <select style={inp} value={bcForm.classId} onChange={e => setBcForm({...bcForm, classId:e.target.value})}>
            <option value="all">All Classes</option>
            {classes.map(cl => <option key={cl.id} value={cl.id}>{cl.name}</option>)}
          </select>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>Tag</label>
            <select style={inp} value={bcForm.tag} onChange={e => setBcForm({...bcForm, tag:e.target.value})}>
              {["announcement","urgent","homework","exam","general"].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>Subject *</label>
            <input style={inp} value={bcForm.subject} onChange={e => setBcForm({...bcForm, subject:e.target.value})} placeholder="Announcement subject..." />
          </div>
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>Message *</label>
          <textarea style={{...inp, resize:"vertical"}} rows={5} value={bcForm.body} onChange={e => setBcForm({...bcForm, body:e.target.value})} placeholder="Write your announcement..." />
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>📎 Attach Image (optional)</label>
          <input type="file" accept="image/*" onChange={e => handleImageUpload(e, img => setBcForm(prev => ({...prev, image:img})))} style={{ fontSize:12 }} />
          {bcForm.image && <img src={bcForm.image} style={{ maxWidth:"100%", maxHeight:120, borderRadius:8, marginTop:8 }} />}
        </div>
        <div style={{ background:"#fef9c3", border:"1px solid #fcd34d", borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:12, color:"#854d0e" }}>
          📢 This will send to {bcForm.classId === "all" ? students.length : students.filter(s=>s.classId===parseInt(bcForm.classId)).length} students
        </div>
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button onClick={() => setView("inbox")} style={{ padding:"9px 18px", borderRadius:8, border:"1px solid #e2e8f0", background:"#fff", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
          <button onClick={sendBroadcast} style={{ padding:"9px 20px", borderRadius:8, border:"none", background:"#d97706", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>📢 Send Broadcast</button>
        </div>
      </div>
    </div>
  );

  // ── Thread View ───────────────────────────────────────────────────────────
  if (view === "thread" && selectedMsg) {
    const student = students.find(s => s.id === selectedMsg.studentId);
    return (
      <div style={{ maxWidth:700, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <button onClick={() => setView("inbox")} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", fontSize:13 }}>← Back</button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:700, color:"#1e293b" }}>{selectedMsg.subject}</div>
            <div style={{ fontSize:12, color:"#64748b" }}>{student?.name} · {fmtTime(selectedMsg.timestamp)}</div>
          </div>
          <span style={{ fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20, ...getTagStyle(selectedMsg.tag) }}>{selectedMsg.tag}</span>
        </div>

        {/* Original Message */}
        <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", padding:20, marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <div style={{ width:36, height:36, borderRadius:10, background: selectedMsg.fromSchool ? "#0d9488" : "#7c3aed", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:13, fontWeight:700 }}>
              {selectedMsg.fromSchool ? "S" : (student?.name||"P")[0]}
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:"#1e293b" }}>{selectedMsg.fromSchool ? (selectedMsg.senderName||"School") : student?.name+"'s Parent"}</div>
              <div style={{ fontSize:11, color:"#94a3b8" }}>{fmtTime(selectedMsg.timestamp)}</div>
            </div>
          </div>
          <div style={{ fontSize:14, color:"#334155", lineHeight:1.6 }}>{selectedMsg.body}</div>
          {selectedMsg.image && <img src={selectedMsg.image} style={{ maxWidth:"100%", borderRadius:8, marginTop:12 }} />}
        </div>

        {/* Replies */}
        {(selectedMsg.replies||[]).map(r => (
          <div key={r.id} style={{ background: r.fromSchool ? "#f0fdf9" : "#f8f4ff", borderRadius:12, border:"1px solid " + (r.fromSchool ? "#99f6e4" : "#ddd6fe"), padding:16, marginBottom:10, marginLeft: r.fromSchool ? 0 : 24 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <div style={{ width:28, height:28, borderRadius:8, background: r.fromSchool ? "#0d9488" : "#7c3aed", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:11, fontWeight:700 }}>
                {r.fromSchool ? "S" : "P"}
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:"#1e293b" }}>{r.fromSchool ? (r.senderName||"School") : "Parent"}</div>
                <div style={{ fontSize:10, color:"#94a3b8" }}>{fmtTime(r.timestamp)}</div>
              </div>
            </div>
            <div style={{ fontSize:13, color:"#334155" }}>{r.body}</div>
            {r.image && <img src={r.image} style={{ maxWidth:"100%", borderRadius:8, marginTop:8 }} />}
          </div>
        ))}

        {/* Reply Box */}
        <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", padding:16, marginTop:12 }}>
          <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write a reply..." rows={3} style={{...inp, resize:"vertical", marginBottom:10}} />
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <label style={{ fontSize:12, color:"#64748b", cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
                📎 <input type="file" accept="image/*" onChange={e => handleImageUpload(e, setReplyImage)} style={{ display:"none" }} />
                {replyImage ? "Image attached ✅" : "Attach image"}
              </label>
            </div>
            <button onClick={sendReply} style={{ padding:"8px 20px", borderRadius:8, border:"none", background:"#0d9488", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Send Reply</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Inbox View ────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <div style={{ fontSize:18, fontWeight:700, color:"#1e293b" }}>💬 Messages {unread > 0 && <span style={{ background:"#ef4444", color:"#fff", borderRadius:20, fontSize:11, padding:"2px 8px", marginLeft:6 }}>{unread}</span>}</div>
          <div style={{ fontSize:13, color:"#64748b" }}>Communicate with parents & students</div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {(isAdmin || isTeacher) && <button onClick={() => setView("broadcast")} style={{ padding:"9px 16px", borderRadius:9, border:"none", background:"#d97706", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>📢 Broadcast</button>}
          <button onClick={() => setView("compose")} style={{ padding:"9px 16px", borderRadius:9, border:"none", background:"#0d9488", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>✉️ New Message</button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search messages..." style={{ padding:"8px 12px", border:"1px solid #e2e8f0", borderRadius:8, fontSize:13, fontFamily:"inherit", outline:"none", flex:1, minWidth:200 }} />
        <div style={{ display:"flex", gap:6 }}>
          {["all","general","announcement","urgent","homework","exam"].map(t => (
            <button key={t} onClick={() => setFilterTag(t)} style={{ padding:"7px 12px", borderRadius:7, border:"1px solid #e2e8f0", background: filterTag===t ? "#0d9488" : "#fff", color: filterTag===t ? "#fff" : "#64748b", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Message List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:60, color:"#94a3b8", background:"#fff", borderRadius:12, border:"1px solid #e2e8f0" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>💬</div>
          <div style={{ fontSize:15, fontWeight:600 }}>No messages</div>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {filtered.map(msg => {
            const student = students.find(s => s.id === msg.studentId);
            const cls = classes.find(c => c.id === student?.classId);
            const tagStyle = getTagStyle(msg.tag);
            return (
              <div key={msg.id} onClick={() => openMsg(msg)} style={{ background:"#fff", borderRadius:12, border:"1px solid " + (msg.read ? "#e2e8f0" : "#0d9488"), padding:"14px 18px", cursor:"pointer", display:"flex", gap:14, alignItems:"center", transition:"box-shadow .15s" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,.08)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow="none"}>
                <div style={{ width:40, height:40, borderRadius:10, background: msg.fromSchool ? "#0d9488" : "#7c3aed", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:14, fontWeight:700, flexShrink:0 }}>
                  {msg.fromSchool ? "S" : (student?.name||"P")[0]}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
                    <div style={{ fontSize:13, fontWeight: msg.read ? 500 : 700, color:"#1e293b", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{msg.subject}</div>
                    <div style={{ fontSize:11, color:"#94a3b8", flexShrink:0, marginLeft:8 }}>{fmtTime(msg.timestamp)}</div>
                  </div>
                  <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                    <span style={{ fontSize:11, color:"#64748b" }}>{student?.name} · {cls?.name||""}</span>
                    {msg.broadcast && <span style={{ fontSize:10, background:"#fef3c7", color:"#854d0e", padding:"1px 6px", borderRadius:10, fontWeight:600 }}>Broadcast</span>}
                    {msg.image && <span style={{ fontSize:10, color:"#94a3b8" }}>📎</span>}
                    {(msg.replies||[]).length > 0 && <span style={{ fontSize:10, color:"#94a3b8" }}>↩ {msg.replies.length}</span>}
                  </div>
                </div>
                <span style={{ fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20, flexShrink:0, background:tagStyle.background, color:tagStyle.color }}>{msg.tag}</span>
                {!msg.read && <div style={{ width:8, height:8, borderRadius:"50%", background:"#0d9488", flexShrink:0 }} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}



function MessageBubble({ fromSchool, body, time, student }) {
  const isRight = fromSchool;
  return (
    <div style={{ display: "flex", flexDirection: isRight ? "row-reverse" : "row", gap: 10, alignItems: "flex-end" }}>
      {student && !isRight && <Avatar name={student.name} size={30} />}
      {isRight && <Avatar name="Admin" size={30} />}
      <div style={{ maxWidth: "70%" }}>
        <div style={{
          background: isRight ? T.primary : "#f1f5f9",
          color: isRight ? "#fff" : T.textMain,
          borderRadius: isRight ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          padding: "11px 15px", fontSize: 13, lineHeight: 1.55,
        }}>{body}</div>
        <div style={{ fontSize: 10, color: T.textMuted, marginTop: 4, textAlign: isRight ? "right" : "left" }}>
          {isRight ? "School Admin" : `${student?.name}'s Parent`} · {time}
        </div>
      </div>
    </div>
  );
}

// ─── Exam Scheduler Module ────────────────────────────────────────────────────
function ExamScheduler({ students, classes, subjects, exams, setExams, examResults, setExamResults }) {
  const [view, setView]         = useState("schedule"); // "schedule" | "results"
  const [filterClass, setFilterClass] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [filterType,  setFilterType]  = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [modal, setModal]       = useState(null); // null | { mode:"add"|"edit", data }
  const [resultsExamId, setResultsExamId] = useState(null);
  const [form, setForm]         = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [scoresDraft, setScoresDraft] = useState({});
  const [scoresSaved, setScoresSaved] = useState(false);

  const EMPTY_EXAM = {
    classId: classes[0]?.id || 1, subjectId: "", type: "quiz",
    title: "", date: new Date().toISOString().split("T")[0],
    duration: 60, maxScore: 100, room: "", notes: "",
  };

  // ── Filtering ──
  const filtered = useMemo(() => exams.filter(e => {
    const matchClass  = filterClass === "all"  || e.classId === parseInt(filterClass);
    const matchType   = filterType  === "all"  || e.type === filterType;
    const matchStatus = filterStatus === "all" || getExamStatus(e.date) === filterStatus;
    return matchClass && matchType && matchStatus;
  }).sort((a, b) => a.date.localeCompare(b.date)), [exams, filterClass, filterType, filterStatus]);

  const upcomingCount = useMemo(() => exams.filter(e => getExamStatus(e.date) === "upcoming" || getExamStatus(e.date) === "ongoing").length, [exams]);

  // ── Modal helpers ──
  const openAdd = () => {
    setForm({ ...EMPTY_EXAM });
    setFormErrors({});
    setModal({ mode: "add", data: null });
  };
  const openEdit = (exam) => {
    setForm({ ...exam });
    setFormErrors({});
    setModal({ mode: "edit", data: exam });
  };

  const autoTitle = (f) => {
    const sub = subjects.find(s => s.id === parseInt(f.subjectId));
    const typ = EXAM_TYPES[f.type];
    return sub && typ ? `${typ.label} — ${sub.name}` : f.title;
  };

  const validate = () => {
    const e = {};
    if (!form.classId)   e.classId   = "Required";
    if (!form.subjectId) e.subjectId = "Required";
    if (!form.date)      e.date      = "Required";
    if (!form.maxScore || form.maxScore < 1) e.maxScore = "Must be > 0";
    return e;
  };

  const saveExam = () => {
    const e = validate();
    if (Object.keys(e).length) { setFormErrors(e); return; }
    const finalForm = { ...form, title: autoTitle(form) || form.title || "Exam", subjectId: parseInt(form.subjectId), classId: parseInt(form.classId), maxScore: parseInt(form.maxScore), duration: parseInt(form.duration) || 60 };
    if (modal.mode === "add") {
      setExams(prev => [...prev, { ...finalForm, id: uid() }]);
    } else {
      setExams(prev => prev.map(ex => ex.id === form.id ? finalForm : ex));
    }
    setModal(null);
  };

  const deleteExam = (id) => {
    setExams(prev => prev.filter(ex => ex.id !== id));
    setExamResults(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  // ── Results helpers ──
  const openResults = (exam) => {
    setResultsExamId(exam.id);
    setView("results");
    const existing = examResults[exam.id] || {};
    const draft = {};
    students.filter(s => s.classId === exam.classId).forEach(s => {
      draft[s.id] = existing[s.id] !== undefined ? String(existing[s.id]) : "";
    });
    setScoresDraft(draft);
    setScoresSaved(false);
  };

  const saveScores = () => {
    const cleaned = {};
    Object.entries(scoresDraft).forEach(([sid, val]) => {
      const n = parseFloat(val);
      if (!isNaN(n)) cleaned[parseInt(sid)] = Math.min(n, selectedExam?.maxScore || 100);
    });
    setExamResults(prev => ({ ...prev, [resultsExamId]: cleaned }));
    setScoresSaved(true);
  };

  const selectedExam = exams.find(e => e.id === resultsExamId);

  // ── Computed stats for results view ──
  const resultsStats = useMemo(() => {
    if (!selectedExam) return null;
    const scores = Object.values(examResults[selectedExam.id] || {}).filter(v => typeof v === "number");
    if (!scores.length) return null;
    const avg  = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const max  = Math.max(...scores);
    const min  = Math.min(...scores);
    const pass = scores.filter(s => s >= selectedExam.maxScore * 0.5).length;
    return { avg, max, min, pass, total: scores.length };
  }, [selectedExam, examResults]);

  const fmtDate = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

  const StatusPill = ({ dateStr }) => {
    const s = getExamStatus(dateStr);
    const map = { upcoming: { bg: "#dbeafe", color: "#1d4ed8", label: "Upcoming" }, ongoing: { bg: "#fef3c7", color: "#b45309", label: "Today" }, completed: { bg: "#d1fae5", color: "#065f46", label: "Completed" } };
    const cfg = map[s];
    return <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>;
  };

  const classSubjects = useMemo(() => subjects.filter(s => s.classId === parseInt(form.classId || 0)), [subjects, form.classId]);

  return (
    <div>
      {/* ── Toolbar ── */}
      <div style={{
        background: "#fff", border: `1px solid ${T.border}`, borderRadius: T.radius,
        padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center",
        gap: 10, flexWrap: "wrap", boxShadow: T.cardShadow,
      }}>
        {/* View switcher */}
        <div style={{ display: "flex", gap: 4 }}>
          {[["schedule","📋 Schedule"],["results","📊 Results"]].map(([id, label]) => (
            <button key={id} onClick={() => setView(id)} style={{
              padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 13, fontFamily: "inherit", fontWeight: 500,
              background: view === id ? T.navy : "#f1f5f9",
              color: view === id ? "#fff" : T.textSub,
            }}>{label}</button>
          ))}
        </div>

        {view === "schedule" && (
          <>
            <select style={{ ...selectStyle, width: 170 }} value={filterClass} onChange={e => setFilterClass(e.target.value)}>
              <option value="all">All Classes</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select style={{ ...selectStyle, width: 160 }} value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              {Object.entries(EXAM_TYPES).map(([k,v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
            </select>
            <select style={{ ...selectStyle, width: 150 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Today</option>
              <option value="completed">Completed</option>
            </select>
            <div style={{ marginRight: "auto" }}>
              <button onClick={openAdd} style={{
                display: "flex", alignItems: "center", gap: 7, padding: "9px 18px",
                background: T.primary, color: "#fff", border: "none", borderRadius: 8,
                fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
              }}>＋ Schedule Exam</button>
            </div>
          </>
        )}

        {view === "results" && selectedExam && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
            <span style={{ fontSize: 13, color: T.textSub }}>Showing results for:</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.textMain }}>{selectedExam.title}</span>
            <span style={{ fontSize: 12, color: T.textMuted }}>· {fmtDate(selectedExam.date)}</span>
            <button onClick={() => { setView("schedule"); setResultsExamId(null); }} style={{
              marginRight: "auto", padding: "7px 14px", borderRadius: 8, border: `1px solid ${T.border}`,
              background: "#fff", fontSize: 12, cursor: "pointer",
            }}>← Back to Schedule</button>
          </div>
        )}

        {view === "results" && !selectedExam && (
          <span style={{ fontSize: 13, color: T.textMuted }}>← Select a completed exam from the Schedule to enter results.</span>
        )}
      </div>

      {/* ── Summary pills ── */}
      {view === "schedule" && (
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Total Exams", value: exams.length, bg: "#f1f5f9", color: T.textMain },
            { label: "Upcoming",    value: exams.filter(e => getExamStatus(e.date) === "upcoming").length, bg: "#dbeafe", color: "#1d4ed8" },
            { label: "Today",       value: exams.filter(e => getExamStatus(e.date) === "ongoing").length,  bg: "#fef3c7", color: "#b45309" },
            { label: "Completed",   value: exams.filter(e => getExamStatus(e.date) === "completed").length,bg: "#d1fae5", color: "#065f46" },
          ].map(p => (
            <div key={p.label} style={{ flex: 1, background: p.bg, borderRadius: 12, padding: "14px 18px", boxShadow: T.cardShadow }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: p.color, lineHeight: 1 }}>{p.value}</div>
              <div style={{ fontSize: 11, color: p.color, opacity: .75, marginTop: 4, fontWeight: 500 }}>{p.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Schedule View ── */}
      {view === "schedule" && (
        <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: T.radius, overflow: "hidden", boxShadow: T.cardShadow }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: T.textMain }}>Exam Calendar</div>
            <div style={{ fontSize: 12, color: T.textMuted, background: "#f1f5f9", padding: "3px 10px", borderRadius: 20 }}>{filtered.length} exams</div>
          </div>
          {filtered.length === 0 ? (
            <div style={{ padding: 56, textAlign: "center", color: T.textMuted }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
              <div style={{ fontSize: 14 }}>No exams match the current filters</div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", direction: "ltr" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["Date", "Exam", "Class", "Subject", "Type", "Duration", "Room", "Status", "Actions"].map(h => (
                      <th key={h} style={{ padding: "11px 16px", textAlign: "right", fontSize: 11, fontWeight: 600, color: T.textMuted, borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap", letterSpacing: ".05em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((exam, i) => {
                    const cls    = classes.find(c  => c.id  === exam.classId);
                    const sub    = subjects.find(s => s.id  === exam.subjectId);
                    const typ    = EXAM_TYPES[exam.type];
                    const status = getExamStatus(exam.date);
                    const hasResults = !!examResults[exam.id] && Object.keys(examResults[exam.id]).length > 0;
                    return (
                      <tr key={exam.id}
                        onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "13px 16px", borderBottom: "1px solid #f8fafc", fontSize: 13, fontWeight: 600, color: T.textMain, whiteSpace: "nowrap" }}>
                          {fmtDate(exam.date)}
                        </td>
                        <td style={{ padding: "13px 16px", borderBottom: "1px solid #f8fafc", fontSize: 13, color: T.textMain, maxWidth: 200 }}>
                          {exam.title}
                        </td>
                        <td style={{ padding: "13px 16px", borderBottom: "1px solid #f8fafc", fontSize: 13, color: T.textSub }}>{cls?.name || "—"}</td>
                        <td style={{ padding: "13px 16px", borderBottom: "1px solid #f8fafc", fontSize: 13, color: T.textSub }}>{sub ? `${sub.icon} ${sub.name}` : "—"}</td>
                        <td style={{ padding: "13px 16px", borderBottom: "1px solid #f8fafc" }}>
                          <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: typ.bg, color: typ.color }}>{typ.icon} {typ.label}</span>
                        </td>
                        <td style={{ padding: "13px 16px", borderBottom: "1px solid #f8fafc", fontSize: 13, color: T.textSub, whiteSpace: "nowrap" }}>{exam.duration} min</td>
                        <td style={{ padding: "13px 16px", borderBottom: "1px solid #f8fafc", fontSize: 13, color: T.textSub }}>{exam.room || "—"}</td>
                        <td style={{ padding: "13px 16px", borderBottom: "1px solid #f8fafc" }}><StatusPill dateStr={exam.date} /></td>
                        <td style={{ padding: "13px 16px", borderBottom: "1px solid #f8fafc" }}>
                          <div style={{ display: "flex", gap: 6, flexWrap: "nowrap" }}>
                            {status === "completed" && (
                              <button onClick={() => openResults(exam)} style={{
                                padding: "5px 10px", borderRadius: 6, border: "none",
                                background: hasResults ? "#d1fae5" : T.primary,
                                color: hasResults ? "#065f46" : "#fff",
                                fontSize: 11, cursor: "pointer", fontWeight: 500,
                              }}>{hasResults ? "✓ Results" : "Enter Results"}</button>
                            )}
                            <button onClick={() => openEdit(exam)} style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${T.border}`, background: "#fff", fontSize: 11, cursor: "pointer", color: "#334155" }}>Edit</button>
                            <button onClick={() => deleteExam(exam.id)} style={{ padding: "5px 10px", borderRadius: 6, border: "none", background: T.dangerBg, fontSize: 11, cursor: "pointer", color: T.danger }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Results View ── */}
      {view === "results" && selectedExam && (
        <>
          {/* Stats row */}
          {resultsStats && (
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              {[
                { label: "Class Average", value: `${resultsStats.avg}/${selectedExam.maxScore}`, pct: `${Math.round((resultsStats.avg/selectedExam.maxScore)*100)}%`, color: T.primary },
                { label: "Highest Score", value: `${resultsStats.max}/${selectedExam.maxScore}`, pct: `${Math.round((resultsStats.max/selectedExam.maxScore)*100)}%`, color: "#059669" },
                { label: "Lowest Score",  value: `${resultsStats.min}/${selectedExam.maxScore}`, pct: `${Math.round((resultsStats.min/selectedExam.maxScore)*100)}%`, color: "#dc2626" },
                { label: "Pass Rate",     value: `${resultsStats.pass}/${resultsStats.total}`,   pct: `${Math.round((resultsStats.pass/resultsStats.total)*100)}%`, color: "#7c3aed" },
              ].map(s => (
                <div key={s.label} style={{ flex: 1, background: "#fff", border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "16px 20px", boxShadow: T.cardShadow }}>
                  <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 500, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".05em" }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ marginTop: 8, height: 4, background: "#f1f5f9", borderRadius: 4 }}>
                    <div style={{ height: "100%", borderRadius: 4, background: s.color, width: s.pct, transition: "width .4s" }} />
                  </div>
                  <div style={{ fontSize: 11, color: s.color, marginTop: 4 }}>{s.pct}</div>
                </div>
              ))}
            </div>
          )}

          {/* Score entry table */}
          <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: T.radius, overflow: "hidden", boxShadow: T.cardShadow }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: T.textMain }}>{selectedExam.title}</div>
                <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>
                  {fmtDate(selectedExam.date)} · {classes.find(c => c.id === selectedExam.classId)?.name} · Max score: <strong>{selectedExam.maxScore}</strong>
                </div>
              </div>
              <button onClick={saveScores} style={{
                padding: "9px 22px", borderRadius: 8, border: "none",
                background: scoresSaved ? "#d1fae5" : T.primary,
                color: scoresSaved ? "#059669" : "#fff",
                fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all .2s",
              }}>{scoresSaved ? "✓ Saved" : "Save Scores"}</button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", direction: "ltr" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Student", "ID", "Score", "Out of", "Percentage", "Grade"].map(h => (
                    <th key={h} style={{ padding: "11px 18px", textAlign: "right", fontSize: 11, fontWeight: 600, color: T.textMuted, borderBottom: "1px solid #f1f5f9", textTransform: "uppercase", letterSpacing: ".05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.filter(s => s.classId === selectedExam.classId).map((s, i, arr) => {
                  const raw = scoresDraft[s.id];
                  const num = parseFloat(raw);
                  const valid = !isNaN(num) && raw !== "";
                  const pct  = valid ? Math.round((num / selectedExam.maxScore) * 100) : null;
                  const gl   = pct !== null ? letterGrade(pct) : "—";
                  const gc   = GRADE_COLOR[gl];
                  return (
                    <tr key={s.id}
                      onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "12px 18px", borderBottom: i < arr.length-1 ? "1px solid #f8fafc" : "none" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, direction: "rtl" }}>
                          <Avatar name={s.name} size={30} />
                          <span style={{ fontSize: 13, fontWeight: 500, color: T.textMain }}>{s.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 18px", borderBottom: i < arr.length-1 ? "1px solid #f8fafc" : "none", fontSize: 12, color: T.textMuted, fontFamily: "monospace" }}>{s.sid}</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc", fontSize: 13, color: T.textSub }}>{s.academicYear || "—"}</td>
                      <td style={{ padding: "12px 18px", borderBottom: i < arr.length-1 ? "1px solid #f8fafc" : "none" }}>
                        <input
                          type="number" min={0} max={selectedExam.maxScore}
                          value={raw} placeholder="—"
                          onChange={e => { setScoresDraft(prev => ({ ...prev, [s.id]: e.target.value })); setScoresSaved(false); }}
                          style={{ ...inputStyle, width: 90, textAlign: "center", padding: "7px 10px" }}
                        />
                      </td>
                      <td style={{ padding: "12px 18px", borderBottom: i < arr.length-1 ? "1px solid #f8fafc" : "none", fontSize: 13, color: T.textMuted }}>{selectedExam.maxScore}</td>
                      <td style={{ padding: "12px 18px", borderBottom: i < arr.length-1 ? "1px solid #f8fafc" : "none" }}>
                        {pct !== null ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ flex: 1, height: 6, background: "#f1f5f9", borderRadius: 6, minWidth: 80 }}>
                              <div style={{ height: "100%", borderRadius: 6, background: pct >= 90 ? "#10b981" : pct >= 70 ? T.primary : pct >= 50 ? "#f59e0b" : "#ef4444", width: pct + "%", transition: "width .3s" }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 600, color: T.textSub, minWidth: 36 }}>{pct}%</span>
                          </div>
                        ) : <span style={{ color: T.textMuted, fontSize: 12 }}>—</span>}
                      </td>
                      <td style={{ padding: "12px 18px", borderBottom: i < arr.length-1 ? "1px solid #f8fafc" : "none" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, padding: "4px 12px", borderRadius: 8, background: gc.bg, color: gc.color }}>{gl}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {view === "results" && !selectedExam && (
        <div style={{ background: "#fff", border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 56, textAlign: "center", color: T.textMuted, boxShadow: T.cardShadow }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.textMain, marginBottom: 8 }}>No Exam Selected</div>
          <div style={{ fontSize: 13 }}>Go to the Schedule tab, find a completed exam, and click "Enter Results".</div>
          <button onClick={() => setView("schedule")} style={{ marginTop: 16, padding: "9px 22px", borderRadius: 8, border: "none", background: T.primary, color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Go to Schedule</button>
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {modal && (
        <Modal title={modal.mode === "add" ? "📋 Schedule New Exam" : "✏️ Edit Exam"} onClose={() => setModal(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Field label="Class" error={formErrors.classId}>
              <select style={formErrors.classId ? { ...selectStyle, border: "1px solid #ef4444" } : selectStyle}
                value={form.classId}
                onChange={e => { setForm(f => ({ ...f, classId: parseInt(e.target.value), subjectId: "" })); setFormErrors(p => ({ ...p, classId: "" })); }}>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Subject" error={formErrors.subjectId}>
              <select style={formErrors.subjectId ? { ...selectStyle, border: "1px solid #ef4444" } : selectStyle}
                value={form.subjectId}
                onChange={e => { setForm(f => ({ ...f, subjectId: e.target.value })); setFormErrors(p => ({ ...p, subjectId: "" })); }}>
                <option value="">— Select subject —</option>
                {classSubjects.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
              </select>
            </Field>
            <Field label="Exam Type">
              <select style={selectStyle} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {Object.entries(EXAM_TYPES).map(([k,v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
              </select>
            </Field>
            <Field label="Date" error={formErrors.date}>
              <input type="date" style={formErrors.date ? inputErrorStyle : inputStyle} value={form.date}
                onChange={e => { setForm(f => ({ ...f, date: e.target.value })); setFormErrors(p => ({ ...p, date: "" })); }} />
            </Field>
            <Field label="Duration (minutes)">
              <input type="number" min={10} style={inputStyle} value={form.duration}
                onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="60" />
            </Field>
            <Field label="Max Score" error={formErrors.maxScore}>
              <input type="number" min={1} style={formErrors.maxScore ? inputErrorStyle : inputStyle} value={form.maxScore}
                onChange={e => { setForm(f => ({ ...f, maxScore: e.target.value })); setFormErrors(p => ({ ...p, maxScore: "" })); }} />
            </Field>
            <Field label="Room">
              <input style={inputStyle} value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))} placeholder="e.g. 101" />
            </Field>
            <div style={{ gridColumn: "1/-1" }}>
              <Field label="Notes (optional)">
                <input style={inputStyle} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any additional info…" />
              </Field>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
            <button onClick={() => setModal(null)} style={{ padding: "9px 18px", borderRadius: 8, border: `1px solid ${T.border}`, background: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
            <button onClick={saveExam} style={{ padding: "9px 24px", borderRadius: 8, border: "none", background: T.primary, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              {modal.mode === "add" ? "Schedule" : "Save Changes"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}


// ─── PDF Helpers ──────────────────────────────────────────────────────────────
function loadJsPDF(cb) {
  if (window.jspdf) { cb(); return; }
  var s1 = document.createElement("script");
  s1.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
  s1.onload = function() {
    var s2 = document.createElement("script");
    s2.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js";
    s2.onload = cb;
    document.head.appendChild(s2);
  };
  document.head.appendChild(s1);
}

function exportStudentReportPDF(student, cls, attendance, grades, subjects, exams, examResults) {
  loadJsPDF(function() {
    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF();
    var N = [30,30,58], P = [13,148,136];
    var W = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(N[0],N[1],N[2]); doc.rect(0,0,W,36,"F");
    doc.setTextColor(255,255,255);
    doc.setFontSize(18); doc.setFont("helvetica","bold");
    doc.text("Al-Huffath Academy", W/2, 14, {align:"center"});
    doc.setFontSize(11); doc.setFont("helvetica","normal");
    doc.text("Student Report Card", W/2, 24, {align:"center"});
    doc.setFontSize(8);
    doc.text(new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}), W/2, 31, {align:"center"});

    var y = 46;
    // Student Info
    doc.setFillColor(240,253,250);
    doc.roundedRect(14,y,W-28,36,3,3,"F");
    doc.setDrawColor(P[0],P[1],P[2]); doc.setLineWidth(0.5);
    doc.roundedRect(14,y,W-28,36,3,3,"S");
    doc.setTextColor(N[0],N[1],N[2]); doc.setFontSize(13); doc.setFont("helvetica","bold");
    doc.text(student.name, 20, y+10);
    doc.setFontSize(8.5); doc.setFont("helvetica","normal"); doc.setTextColor(100,116,139);
    doc.text("ID: " + student.sid, 20, y+18);
    doc.text("Class: " + (cls ? cls.name : "-"), 20, y+25);
    doc.text("Teacher: " + (cls ? cls.teacher : "-"), 20, y+32);
    doc.text("Academic Year: " + (student.academicYear || "-"), 110, y+18);
    doc.text("Gender: " + student.gender, 110, y+25);
    doc.text("Status: " + student.status, 110, y+32);
    y += 44;

    // Attendance
    var allDates = Object.keys(attendance||{}).sort();
    var p=0,ab=0,l=0,ex=0,tot=0;
    allDates.forEach(function(d) {
      var r = (attendance[d]||{})[student.id];
      if (!r) return; tot++;
      if (r==="present") p++; else if (r==="absent") ab++;
      else if (r==="late") l++; else if (r==="excused") ex++;
    });
    var rate = tot ? Math.round((p/tot)*100) : 0;

    doc.setTextColor(N[0],N[1],N[2]); doc.setFontSize(11); doc.setFont("helvetica","bold");
    doc.text("Attendance Summary", 14, y);
    doc.setDrawColor(P[0],P[1],P[2]); doc.setLineWidth(0.7); doc.line(14,y+2,78,y+2);
    y += 8;

    var ac = rate>=90?[5,150,105]:rate>=75?[217,119,6]:[220,38,38];
    doc.setFillColor(ac[0],ac[1],ac[2]); doc.roundedRect(14,y,38,18,2,2,"F");
    doc.setTextColor(255,255,255); doc.setFontSize(15); doc.setFont("helvetica","bold");
    doc.text(rate+"%", 33, y+10, {align:"center"});
    doc.setFontSize(7); doc.text("Rate", 33, y+16, {align:"center"});

    var attItems = [[p,[5,150,105],"Present"],[ab,[220,38,38],"Absent"],[l,[217,119,6],"Late"],[ex,[124,58,237],"Excused"]];
    attItems.forEach(function(item, i) {
      var bx = 58+i*36;
      doc.setFillColor(item[1][0],item[1][1],item[1][2]); doc.roundedRect(bx,y,33,18,2,2,"F");
      doc.setTextColor(255,255,255); doc.setFontSize(14); doc.setFont("helvetica","bold");
      doc.text(String(item[0]), bx+16, y+10, {align:"center"});
      doc.setFontSize(7); doc.text(item[2], bx+16, y+16, {align:"center"});
    });
    y += 26;

    // Grades
    var studentSubs = (subjects||[]).filter(function(s){ return s.classId===student.classId; });
    if (studentSubs.length > 0) {
      doc.setTextColor(N[0],N[1],N[2]); doc.setFontSize(11); doc.setFont("helvetica","bold");
      doc.text("Academic Performance", 14, y);
      doc.setDrawColor(P[0],P[1],P[2]); doc.line(14,y+2,90,y+2);
      y += 8;
      var gradeRows = studentSubs.map(function(sub) {
        var g = ((grades||{})[student.id]||{})[sub.id] || {};
        var q=g.quiz!=null?g.quiz:null, h=g.homework!=null?g.homework:null;
        var m=g.midterm!=null?g.midterm:null, f=g.final!=null?g.final:null;
        var total = (q!==null||h!==null||m!==null||f!==null)
          ? Math.round((q||0)*0.15+(h||0)*0.15+(m||0)*0.30+(f||0)*0.40) : null;
        var letter = total===null?"—":total>=90?"A":total>=80?"B":total>=70?"C":total>=60?"D":"F";
        return [sub.name, q!=null?q:"-", h!=null?h:"-", m!=null?m:"-", f!=null?f:"-", total!=null?total:"-", letter];
      });
      doc.autoTable({
        startY:y, head:[["Subject","Quiz(15%)","HW(15%)","Mid(30%)","Final(40%)","Total","Grade"]],
        body:gradeRows, theme:"grid",
        headStyles:{fillColor:N,textColor:255,fontSize:8,fontStyle:"bold"},
        bodyStyles:{fontSize:8,textColor:N},
        alternateRowStyles:{fillColor:[248,250,252]},
        columnStyles:{6:{fontStyle:"bold",halign:"center"}},
        margin:{left:14,right:14},
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    // Exams
    var studentExams = (exams||[]).filter(function(e){ return e.classId===student.classId && new Date(e.date+"T00:00:00") < new Date(); });
    if (studentExams.length > 0) {
      if (y > 220) { doc.addPage(); y=20; }
      doc.setTextColor(N[0],N[1],N[2]); doc.setFontSize(11); doc.setFont("helvetica","bold");
      doc.text("Exam Results", 14, y);
      doc.setDrawColor(P[0],P[1],P[2]); doc.line(14,y+2,65,y+2); y+=8;
      var examRows = studentExams.map(function(e) {
        var score = ((examResults||{})[e.id]||{})[student.id];
        var pct = score!=null ? Math.round((score/e.maxScore)*100) : null;
        return [e.title,
          new Date(e.date+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),
          score!=null?score+"/"+e.maxScore:"-", pct!=null?pct+"%":"-",
          pct!=null?(pct>=90?"Excellent":pct>=75?"Good":pct>=60?"Pass":"Fail"):"-"];
      });
      doc.autoTable({
        startY:y, head:[["Exam","Date","Score","Pct","Result"]], body:examRows, theme:"grid",
        headStyles:{fillColor:N,textColor:255,fontSize:8,fontStyle:"bold"},
        bodyStyles:{fontSize:8,textColor:N}, alternateRowStyles:{fillColor:[248,250,252]}, margin:{left:14,right:14},
      });
    }

    // Footer
    var pages = doc.internal.getNumberOfPages();
    for (var i=1;i<=pages;i++) {
      doc.setPage(i);
      doc.setFillColor(N[0],N[1],N[2]); doc.rect(0,doc.internal.pageSize.getHeight()-12,W,12,"F");
      doc.setTextColor(255,255,255); doc.setFontSize(7);
      doc.text("Al-Huffath Academy | Student Report", 14, doc.internal.pageSize.getHeight()-5);
      doc.text("Page "+i+" of "+pages, W-14, doc.internal.pageSize.getHeight()-5, {align:"right"});
    }
    doc.save(student.name.replace(/ /g,"_")+"_Report_"+(student.academicYear||"").replace("/","-")+".pdf");
  });
}

function exportExamSchedulePDF(exams, classes, subjects) {
  loadJsPDF(function() {
    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF();
    var N = [30,30,58], P = [13,148,136];
    var W = doc.internal.pageSize.getWidth();
    doc.setFillColor(N[0],N[1],N[2]); doc.rect(0,0,W,36,"F");
    doc.setTextColor(255,255,255);
    doc.setFontSize(18); doc.setFont("helvetica","bold");
    doc.text("Al-Huffath Academy", W/2, 14, {align:"center"});
    doc.setFontSize(11); doc.text("Exam Schedule", W/2, 24, {align:"center"});
    doc.setFontSize(8); doc.setFont("helvetica","normal");
    doc.text(new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}), W/2, 31, {align:"center"});
    var today = new Date().toISOString().split("T")[0];
    var rows = (exams||[]).slice().sort(function(a,b){return a.date.localeCompare(b.date);}).map(function(ex) {
      var cls = (classes||[]).find(function(c){return c.id===ex.classId;});
      var sub = (subjects||[]).find(function(s){return s.id===ex.subjectId;});
      var status = ex.date>today?"Upcoming":ex.date===today?"Today":"Completed";
      return [new Date(ex.date+"T00:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric"}),
        ex.title, cls?cls.name:"-", sub?sub.name:"-",
        ex.type.charAt(0).toUpperCase()+ex.type.slice(1), ex.duration+" min", "Room "+(ex.room||"-"), status];
    });
    doc.autoTable({
      startY:44, head:[["Date","Exam","Class","Subject","Type","Duration","Room","Status"]], body:rows, theme:"grid",
      headStyles:{fillColor:N,textColor:255,fontSize:8,fontStyle:"bold"},
      bodyStyles:{fontSize:7.5,textColor:N}, alternateRowStyles:{fillColor:[248,250,252]}, margin:{left:10,right:10},
      didParseCell:function(d){
        if(d.section==="body"&&d.column.index===7){
          var v=d.cell.raw;
          d.cell.styles.textColor=v==="Upcoming"?P:v==="Today"?[217,119,6]:[100,116,139];
          if(v!=="Completed") d.cell.styles.fontStyle="bold";
        }
      },
    });
    var pages = doc.internal.getNumberOfPages();
    for (var i=1;i<=pages;i++) {
      doc.setPage(i);
      doc.setFillColor(N[0],N[1],N[2]); doc.rect(0,doc.internal.pageSize.getHeight()-12,W,12,"F");
      doc.setTextColor(255,255,255); doc.setFontSize(7);
      doc.text("Al-Huffath Academy | Exam Schedule", 10, doc.internal.pageSize.getHeight()-5);
      doc.text("Page "+i+" of "+pages, W-10, doc.internal.pageSize.getHeight()-5, {align:"right"});
    }
    doc.save("Exam_Schedule_"+new Date().toISOString().split("T")[0]+".pdf");
  });
}



// ─── Quizzes ──────────────────────────────────────────────────────────────────
function Quizzes({ students, classes, subjects, quizzes, setQuizzes, quizResults, setQuizResults, teacherClassIds, userRole }) {
  const [view, setView] = useState("list"); // list | create | results
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: "", classId: "", subjectId: "", duration: "", questions: [] });
  const [qForm, setQForm] = useState({ type: "mcq", text: "", options: ["","","",""], answer: "", blank: "" });
  const visibleClasses = (userRole === "admin" || !teacherClassIds || teacherClassIds.length === 0) ? (classes||[]) : (classes||[]).filter(c => (teacherClassIds||[]).includes(c.id));

  const addQuestion = () => {
    if (!qForm.text.trim()) return;
    const q = { id: uid(), type: qForm.type, text: qForm.text,
      options: qForm.type === "mcq" ? qForm.options.filter(o => o.trim()) : [],
      answer: qForm.type === "tf" ? qForm.answer : qForm.type === "mcq" ? qForm.answer : qForm.blank
    };
    setForm(f => ({ ...f, questions: [...f.questions, q] }));
    setQForm({ type: "mcq", text: "", options: ["","","",""], answer: "", blank: "" });
  };

  const saveQuiz = () => {
    if (!form.title.trim() || !form.classId || form.questions.length === 0) return alert("Fill title, class and add at least 1 question");
    const quiz = { ...form, id: uid(), createdAt: new Date().toISOString(), active: true };
    const updated = [...(quizzes||[]), quiz];
    setQuizzes(updated);
    localStorage.setItem("edu_quizzes", JSON.stringify(updated));
    setView("list"); setForm({ title: "", classId: "", subjectId: "", duration: "", questions: [] });
  };

  const toggleActive = (id) => {
    const updated = (quizzes||[]).map(q => q.id === id ? {...q, active: !q.active} : q);
    setQuizzes(updated); localStorage.setItem("edu_quizzes", JSON.stringify(updated));
  };

  const deleteQuiz = (id) => {
    const updated = (quizzes||[]).filter(q => q.id !== id);
    setQuizzes(updated); localStorage.setItem("edu_quizzes", JSON.stringify(updated));
  };

  const getResults = (quizId) => (quizResults||[]).filter(r => r.quizId === quizId);

  const S2 = { border: "#e2e8f0", bg: "#f8fafc", primary: "#0d9488", text: "#1e293b", sub: "#64748b" };
  const inp = { width:"100%", padding:"9px 12px", border:"1px solid #e2e8f0", borderRadius:8, fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box" };

  if (view === "results" && selected) {
    const quiz = (quizzes||[]).find(q => q.id === selected);
    const results = getResults(selected);
    return (
      <div>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <button onClick={() => setView("list")} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", fontSize:13 }}>← Back</button>
          <div style={{ fontSize:16, fontWeight:700, color:S2.text }}>Results: {quiz?.title}</div>
        </div>
        {results.length === 0 ? (
          <div style={{ textAlign:"center", padding:40, color:S2.sub }}>No submissions yet</div>
        ) : (
          <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", overflow:"hidden" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"#f8fafc" }}>
                  {["Student","Score","Submitted"].map(h => (
                    <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:12, fontWeight:600, color:S2.sub, borderBottom:"1px solid #e2e8f0" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map(r => {
                  const student = students.find(s => s.id === r.studentId);
                  const total = quiz?.questions?.length || 1;
                  const pct = Math.round((r.score / total) * 100);
                  return (
                    <tr key={r.id} style={{ borderBottom:"1px solid #f1f5f9" }}>
                      <td style={{ padding:"12px 16px", fontSize:13, fontWeight:500 }}>{student?.name || "Unknown"}</td>
                      <td style={{ padding:"12px 16px" }}>
                        <span style={{ background: pct >= 60 ? "#d1fae5" : "#fee2e2", color: pct >= 60 ? "#065f46" : "#dc2626", padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600 }}>
                          {r.score}/{total} ({pct}%)
                        </span>
                      </td>
                      <td style={{ padding:"12px 16px", fontSize:12, color:S2.sub }}>{new Date(r.submittedAt).toLocaleDateString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  if (view === "create") return (
    <div style={{ maxWidth:720, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <button onClick={() => setView("list")} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", fontSize:13 }}>← Back</button>
        <div style={{ fontSize:16, fontWeight:700, color:S2.text }}>Create New Quiz</div>
      </div>
      <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", padding:24, marginBottom:16 }}>
        <div style={{ fontSize:14, fontWeight:600, marginBottom:16, color:S2.text }}>Quiz Info</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:S2.sub, display:"block", marginBottom:4 }}>Title *</label>
            <input style={inp} value={form.title} onChange={e => setForm({...form, title:e.target.value})} placeholder="e.g. Math Quiz - Chapter 3" />
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:S2.sub, display:"block", marginBottom:4 }}>Class *</label>
            <select style={inp} value={form.classId} onChange={e => setForm({...form, classId:Number(e.target.value)})}>
              <option value="">Select class...</option>
              {visibleClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:S2.sub, display:"block", marginBottom:4 }}>Subject</label>
            <select style={inp} value={form.subjectId} onChange={e => setForm({...form, subjectId:Number(e.target.value)})}>
              <option value="">Select subject...</option>
              {(subjects||[]).filter(s => !form.classId || s.classId === form.classId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:S2.sub, display:"block", marginBottom:4 }}>Timer (minutes, optional)</label>
            <input style={inp} type="number" value={form.duration} onChange={e => setForm({...form, duration:e.target.value})} placeholder="e.g. 30" />
          </div>
        </div>
      </div>

      <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", padding:24, marginBottom:16 }}>
        <div style={{ fontSize:14, fontWeight:600, marginBottom:16, color:S2.text }}>Add Question</div>
        <div style={{ marginBottom:12 }}>
          <label style={{ fontSize:12, fontWeight:600, color:S2.sub, display:"block", marginBottom:4 }}>Type</label>
          <div style={{ display:"flex", gap:8 }}>
            {[["mcq","Multiple Choice"],["tf","True / False"],["fill","Fill in the Blank"]].map(([val,lbl]) => (
              <button key={val} onClick={() => setQForm({...qForm, type:val, answer:""})} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid #e2e8f0", background: qForm.type===val ? "#0d9488" : "#fff", color: qForm.type===val ? "#fff" : S2.text, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>{lbl}</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom:12 }}>
          <label style={{ fontSize:12, fontWeight:600, color:S2.sub, display:"block", marginBottom:4 }}>Question Text *</label>
          <input style={inp} value={qForm.text} onChange={e => setQForm({...qForm, text:e.target.value})} placeholder="Enter question..." />
        </div>
        {qForm.type === "mcq" && (
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:12, fontWeight:600, color:S2.sub, display:"block", marginBottom:4 }}>Options</label>
            {qForm.options.map((opt,i) => (
              <div key={i} style={{ display:"flex", gap:8, marginBottom:6, alignItems:"center" }}>
                <input type="radio" name="correct" checked={qForm.answer === opt} onChange={() => qForm.options[i].trim() && setQForm({...qForm, answer:qForm.options[i]})} />
                <input style={{...inp, flex:1}} value={opt} onChange={e => { const o=[...qForm.options]; o[i]=e.target.value; setQForm({...qForm, options:o}); }} placeholder={"Option " + (i+1)} />
              </div>
            ))}
            <div style={{ fontSize:11, color:S2.sub, marginTop:4 }}>Select the radio button next to the correct answer</div>
          </div>
        )}
        {qForm.type === "tf" && (
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:12, fontWeight:600, color:S2.sub, display:"block", marginBottom:4 }}>Correct Answer</label>
            <div style={{ display:"flex", gap:8 }}>
              {["True","False"].map(v => (
                <button key={v} onClick={() => setQForm({...qForm, answer:v})} style={{ padding:"7px 20px", borderRadius:8, border:"1px solid #e2e8f0", background: qForm.answer===v ? "#0d9488" : "#fff", color: qForm.answer===v ? "#fff" : S2.text, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>{v}</button>
              ))}
            </div>
          </div>
        )}
        {qForm.type === "fill" && (
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:12, fontWeight:600, color:S2.sub, display:"block", marginBottom:4 }}>Correct Answer</label>
            <input style={inp} value={qForm.blank} onChange={e => setQForm({...qForm, blank:e.target.value})} placeholder="Enter the correct answer..." />
          </div>
        )}
        <button onClick={addQuestion} style={{ padding:"8px 20px", borderRadius:8, border:"none", background:"#0d9488", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>+ Add Question</button>
      </div>

      {form.questions.length > 0 && (
        <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", padding:24, marginBottom:16 }}>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:12, color:S2.text }}>Questions ({form.questions.length})</div>
          {form.questions.map((q,i) => (
            <div key={q.id} style={{ padding:"10px 14px", background:"#f8fafc", borderRadius:8, marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ fontSize:13, fontWeight:500 }}>Q{i+1}: {q.text}</div>
                <div style={{ fontSize:11, color:S2.sub, marginTop:2 }}>
                  {q.type === "mcq" ? "MCQ · Correct: " + q.answer : q.type === "tf" ? "True/False · Answer: " + q.answer : "Fill · Answer: " + q.answer}
                </div>
              </div>
              <button onClick={() => setForm(f => ({...f, questions:f.questions.filter((_,j)=>j!==i)}))} style={{ padding:"3px 10px", borderRadius:6, border:"1px solid #fca5a5", background:"#fee2e2", color:"#dc2626", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>Remove</button>
            </div>
          ))}
        </div>
      )}

      <button onClick={saveQuiz} style={{ width:"100%", padding:"13px 0", borderRadius:10, border:"none", background:"#0d9488", color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
        💾 Save Quiz
      </button>
    </div>
  );

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <div style={{ fontSize:18, fontWeight:700, color:S2.text }}>📝 Quizzes</div>
          <div style={{ fontSize:13, color:S2.sub }}>Create and manage quizzes for students</div>
        </div>
        <button onClick={() => setView("create")} style={{ padding:"9px 18px", borderRadius:9, border:"none", background:"#0d9488", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>+ New Quiz</button>
      </div>
      {(!quizzes || quizzes.length === 0) ? (
        <div style={{ textAlign:"center", padding:60, color:S2.sub, background:"#fff", borderRadius:12, border:"1px solid #e2e8f0" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>📝</div>
          <div style={{ fontSize:15, fontWeight:600 }}>No quizzes yet</div>
          <div style={{ fontSize:13, marginTop:4 }}>Click "New Quiz" to create your first quiz</div>
        </div>
      ) : (
        <div style={{ display:"grid", gap:12 }}>
          {(quizzes||[]).map(quiz => {
            const cls = classes.find(c => c.id === quiz.classId);
            const sub = (subjects||[]).find(s => s.id === quiz.subjectId);
            const results = getResults(quiz.id);
            return (
              <div key={quiz.id} style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", padding:20, display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:S2.text, marginBottom:4 }}>{quiz.title}</div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    <span style={{ fontSize:11, background:"#f0fdf4", color:"#065f46", padding:"2px 8px", borderRadius:20, fontWeight:600 }}>{cls?.name || "—"}</span>
                    {sub && <span style={{ fontSize:11, background:"#eff6ff", color:"#1d4ed8", padding:"2px 8px", borderRadius:20, fontWeight:600 }}>{sub.name}</span>}
                    {quiz.duration && <span style={{ fontSize:11, background:"#fefce8", color:"#854d0e", padding:"2px 8px", borderRadius:20, fontWeight:600 }}>⏱ {quiz.duration} min</span>}
                    <span style={{ fontSize:11, background:"#f8fafc", color:S2.sub, padding:"2px 8px", borderRadius:20 }}>{quiz.questions.length} questions</span>
                    <span style={{ fontSize:11, background:"#f8fafc", color:S2.sub, padding:"2px 8px", borderRadius:20 }}>{results.length} submissions</span>
                  </div>
                </div>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <button onClick={() => toggleActive(quiz.id)} style={{ padding:"5px 12px", borderRadius:7, border:"1px solid #e2e8f0", background: quiz.active ? "#d1fae5" : "#fee2e2", color: quiz.active ? "#065f46" : "#dc2626", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                    {quiz.active ? "✅ Active" : "⏸ Inactive"}
                  </button>
                  <button onClick={() => { setSelected(quiz.id); setView("results"); }} style={{ padding:"5px 12px", borderRadius:7, border:"1px solid #e2e8f0", background:"#fff", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>📊 Results</button>
                  <button onClick={() => deleteQuiz(quiz.id)} style={{ padding:"5px 12px", borderRadius:7, border:"1px solid #fca5a5", background:"#fee2e2", color:"#dc2626", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}



// ─── ParentLessonPlans ────────────────────────────────────────────────────────
function ParentLessonPlans({ student, lessonPlans, subjects, classes }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [weekOffset, setWeekOffset] = useState(0);

  const getWeekStart = (offset = 0) => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) + (offset * 7);
    return new Date(new Date().setDate(diff));
  };
  const weekStart = getWeekStart(weekOffset);
  const weekKey = weekStart.toISOString().split("T")[0];
  const weekLabel = weekStart.toLocaleDateString("en-US",{month:"short",day:"numeric"}) + " – " + new Date(new Date(weekStart).setDate(weekStart.getDate()+6)).toLocaleDateString("en-US",{month:"short",day:"numeric"});

  const myPlans = (lessonPlans||[]).filter(p => String(p.classId) === String(student.classId) && p.week === weekKey);
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];

  const fmtTime = (ts) => new Date(ts).toLocaleDateString("en-US",{month:"short",day:"numeric"});
  const selectedPlan = myPlans.find(p => p.id === selected);

  return (
    <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", overflow:"hidden", marginBottom:16 }}>
      <div onClick={() => setOpen(!open)} style={{ padding:"14px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", borderBottom: open?"1px solid #e2e8f0":"none" }}>
        <div style={{ fontSize:14, fontWeight:700, color:"#0f172a", display:"flex", alignItems:"center", gap:8 }}>
          📚 Lesson Plans
          {myPlans.length > 0 && <span style={{ background:"#0d9488", color:"#fff", borderRadius:20, fontSize:11, padding:"2px 8px" }}>{myPlans.length}</span>}
        </div>
        <span style={{ fontSize:12, color:"#94a3b8" }}>{open?"▲":"▼"}</span>
      </div>

      {open && (
        <div style={{ padding:16 }}>
          {/* Week Navigator */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, background:"#f8fafc", borderRadius:10, padding:"10px 14px" }}>
            <button onClick={() => { setWeekOffset(w=>w-1); setSelected(null); }} style={{ width:28, height:28, borderRadius:6, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer" }}>‹</button>
            <div style={{ flex:1, textAlign:"center", fontSize:13, fontWeight:600, color:"#0f172a" }}>
              {weekLabel}
              {weekOffset === 0 && <span style={{ fontSize:10, color:"#0d9488", marginLeft:6 }}>• This week</span>}
            </div>
            <button onClick={() => { setWeekOffset(w=>w+1); setSelected(null); }} style={{ width:28, height:28, borderRadius:6, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer" }}>›</button>
          </div>

          {selected && selectedPlan ? (
            <div>
              <button onClick={() => setSelected(null)} style={{ padding:"6px 12px", borderRadius:7, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", fontSize:12, marginBottom:12 }}>← Back</button>
              <div style={{ fontSize:15, fontWeight:700, color:"#0f172a", marginBottom:4 }}>{selectedPlan.title}</div>
              <div style={{ fontSize:12, color:"#64748b", marginBottom:14 }}>{selectedPlan.day} · {(subjects||[]).find(s=>s.id===selectedPlan.subjectId)?.name}</div>

              {selectedPlan.objectives?.filter(o=>o.trim()).length > 0 && (
                <div style={{ background:"#eff6ff", borderRadius:10, padding:14, marginBottom:10 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#1d4ed8", marginBottom:8 }}>🎯 Learning Objectives</div>
                  <ul style={{ paddingRight:16, margin:0 }}>
                    {selectedPlan.objectives.filter(o=>o.trim()).map((o,i) => <li key={i} style={{ fontSize:13, color:"#1e40af", marginBottom:4 }}>{o}</li>)}
                  </ul>
                </div>
              )}

              {selectedPlan.homework?.trim() && (
                <div style={{ background:"#ede9fe", borderRadius:10, padding:14, marginBottom:10 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#6d28d9", marginBottom:6 }}>📝 Homework</div>
                  <p style={{ fontSize:13, color:"#5b21b6", margin:0, lineHeight:1.6 }}>{selectedPlan.homework}</p>
                </div>
              )}

              {selectedPlan.activities?.filter(a=>a.trim()).length > 0 && (
                <div style={{ background:"#f0fdf4", borderRadius:10, padding:14, marginBottom:10 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#166534", marginBottom:8 }}>📋 Activities</div>
                  <ul style={{ paddingRight:16, margin:0 }}>
                    {selectedPlan.activities.filter(a=>a.trim()).map((a,i) => <li key={i} style={{ fontSize:13, color:"#166534", marginBottom:4 }}>{a}</li>)}
                  </ul>
                </div>
              )}

              {(selectedPlan.attachments||[]).length > 0 && (
                <div style={{ background:"#fffbeb", borderRadius:10, padding:14 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#854d0e", marginBottom:8 }}>📎 Attachments</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {selectedPlan.attachments.map((att,i) => (
                      att.type.startsWith("image/") ? (
                        <a key={i} href={att.data} target="_blank" rel="noreferrer">
                          <img src={att.data} style={{ width:60, height:60, borderRadius:8, objectFit:"cover" }} />
                        </a>
                      ) : (
                        <a key={i} href={att.data} download={att.name} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 10px", background:"#fff", borderRadius:8, border:"1px solid #fde68a", textDecoration:"none" }}>
                          <span style={{ fontSize:16 }}>{att.name.endsWith(".pdf")?"📄":"📎"}</span>
                          <span style={{ fontSize:11, color:"#854d0e" }}>{att.name}</span>
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : myPlans.length === 0 ? (
            <div style={{ textAlign:"center", padding:24, color:"#94a3b8", fontSize:13 }}>No lesson plans this week</div>
          ) : (
            <div style={{ display:"grid", gap:8 }}>
              {days.map(day => {
                const dayPlans = myPlans.filter(p => p.day === day);
                if (dayPlans.length === 0) return null;
                return dayPlans.map(p => {
                  const sub = (subjects||[]).find(s=>s.id===p.subjectId);
                  return (
                    <div key={p.id} onClick={() => setSelected(p.id)} style={{ padding:"12px 16px", borderRadius:10, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}
                      onMouseEnter={e => e.currentTarget.style.background="#f0fdf9"}
                      onMouseLeave={e => e.currentTarget.style.background="#fff"}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:"#0f172a" }}>{p.title}</div>
                        <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>{day} · {sub?.name} {p.homework?"· 📝 Has homework":""}</div>
                      </div>
                      <span style={{ fontSize:12, color:"#0d9488" }}>›</span>
                    </div>
                  );
                });
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── ParentMessages ───────────────────────────────────────────────────────────
function ParentMessages({ student, messages, setMessages }) {
  const [open, setOpen] = useState(false);
  const [compose, setCompose] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [sent, setSent] = useState(false);
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState("");

  const myMessages = (messages||[]).filter(m => m.studentId === student.id).sort((a,b) => b.timestamp - a.timestamp);
  const unread = myMessages.filter(m => !m.read).length;

  const fmtTime = (ts) => {
    const d = new Date(ts), now = new Date(), diff = now - d;
    if (diff < 3600000) return Math.floor(diff/60000) + "m ago";
    if (diff < 86400000) return d.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
    return d.toLocaleDateString("en-US",{month:"short",day:"numeric"});
  };

  const send = () => {
    if (!subject.trim() || !body.trim()) return;
    const msg = { id: Date.now(), studentId: student.id, tag: "general", subject, body, image, fromSchool: false, timestamp: Date.now(), read: false, replies: [], senderName: student.name + "'s Parent" };
    try { const stored = JSON.parse(localStorage.getItem("edu_messages")||"[]"); localStorage.setItem("edu_messages", JSON.stringify([msg,...stored])); } catch {}
    if (setMessages) setMessages(prev => [msg,...prev]);
    setSubject(""); setBody(""); setImage(null); setCompose(false); setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const sendReply = () => {
    if (!replyText.trim()) return;
    const reply = { id: uid(), fromSchool: false, body: replyText, timestamp: Date.now(), senderName: student.name + "'s Parent" };
    if (setMessages) setMessages(prev => prev.map(m => m.id === selected ? {...m, replies:[...(m.replies||[]),reply]} : m));
    setReplyText("");
  };

  const inp = { width:"100%", padding:"9px 12px", border:"1px solid #e2e8f0", borderRadius:8, fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box" };
  const selectedMsg = myMessages.find(m => m.id === selected);

  return (
    <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", overflow:"hidden", marginBottom:16 }}>
      <div onClick={() => setOpen(!open)} style={{ padding:"14px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", borderBottom: open ? "1px solid #e2e8f0" : "none" }}>
        <div style={{ fontSize:14, fontWeight:700, color:"#1e293b", display:"flex", alignItems:"center", gap:8 }}>
          💬 Messages
          {unread > 0 && <span style={{ background:"#ef4444", color:"#fff", borderRadius:20, fontSize:11, padding:"2px 8px", fontWeight:700 }}>{unread} new</span>}
        </div>
        <span style={{ fontSize:12, color:"#94a3b8" }}>{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div style={{ padding:16 }}>
          {sent && <div style={{ background:"#d1fae5", color:"#065f46", padding:"10px 14px", borderRadius:8, marginBottom:12, fontSize:13 }}>✅ Message sent!</div>}

          {/* Thread View */}
          {selected && selectedMsg ? (
            <div>
              <button onClick={() => setSelected(null)} style={{ padding:"6px 12px", borderRadius:7, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", fontSize:12, marginBottom:12 }}>← Back</button>
              <div style={{ fontSize:14, fontWeight:700, color:"#1e293b", marginBottom:12 }}>{selectedMsg.subject}</div>

              {/* Original */}
              <div style={{ background: selectedMsg.fromSchool ? "#f0fdf9" : "#f8f4ff", borderRadius:10, border:"1px solid " + (selectedMsg.fromSchool?"#99f6e4":"#ddd6fe"), padding:14, marginBottom:10 }}>
                <div style={{ fontSize:12, fontWeight:600, color:"#64748b", marginBottom:6 }}>{selectedMsg.fromSchool ? "🏫 School" : "👨‍👩‍👧 You"} · {fmtTime(selectedMsg.timestamp)}</div>
                <div style={{ fontSize:13, color:"#334155" }}>{selectedMsg.body}</div>
                {selectedMsg.image && <img src={selectedMsg.image} style={{ maxWidth:"100%", borderRadius:8, marginTop:8 }} />}
              </div>

              {/* Replies */}
              {(selectedMsg.replies||[]).map(r => (
                <div key={r.id} style={{ background: r.fromSchool ? "#f0fdf9" : "#f8f4ff", borderRadius:10, border:"1px solid " + (r.fromSchool?"#99f6e4":"#ddd6fe"), padding:14, marginBottom:8, marginLeft: r.fromSchool ? 0 : 20 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:"#64748b", marginBottom:4 }}>{r.fromSchool ? "🏫 School" : "👨‍👩‍👧 You"} · {fmtTime(r.timestamp)}</div>
                  <div style={{ fontSize:13, color:"#334155" }}>{r.body}</div>
                  {r.image && <img src={r.image} style={{ maxWidth:"100%", borderRadius:8, marginTop:6 }} />}
                </div>
              ))}

              {/* Reply Box */}
              <div style={{ marginTop:12 }}>
                <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write a reply..." rows={3} style={{...inp, resize:"vertical", marginBottom:8}} />
                <button onClick={sendReply} style={{ padding:"8px 18px", borderRadius:8, border:"none", background:"#0d9488", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Send Reply</button>
              </div>
            </div>
          ) : (
            <div>
              {/* Compose Button */}
              {!compose ? (
                <button onClick={() => setCompose(true)} style={{ width:"100%", padding:"10px", borderRadius:9, border:"2px dashed #0d9488", background:"#f0fdf9", color:"#0d9488", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", marginBottom:12 }}>
                  + New Message to School
                </button>
              ) : (
                <div style={{ background:"#f8fafc", borderRadius:10, border:"1px solid #e2e8f0", padding:16, marginBottom:12 }}>
                  <input style={{...inp, marginBottom:8}} value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject..." />
                  <textarea style={{...inp, resize:"vertical", marginBottom:8}} rows={4} value={body} onChange={e => setBody(e.target.value)} placeholder="Write your message..." />
                  <div style={{ marginBottom:10 }}>
                    <label style={{ fontSize:12, color:"#64748b", cursor:"pointer" }}>
                      📎 {image ? "Image attached ✅" : "Attach image"}
                      <input type="file" accept="image/*" style={{ display:"none" }} onChange={e => { const f=e.target.files[0]; if(f){const r=new FileReader();r.onload=()=>setImage(r.result);r.readAsDataURL(f);} }} />
                    </label>
                  </div>
                  <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
                    <button onClick={() => setCompose(false)} style={{ padding:"7px 14px", borderRadius:7, border:"1px solid #e2e8f0", background:"#fff", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
                    <button onClick={send} style={{ padding:"7px 16px", borderRadius:7, border:"none", background:"#0d9488", color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Send</button>
                  </div>
                </div>
              )}

              {/* Message List */}
              {myMessages.length === 0 ? (
                <div style={{ textAlign:"center", padding:24, color:"#94a3b8", fontSize:13 }}>No messages yet</div>
              ) : myMessages.map(msg => (
                <div key={msg.id} onClick={() => { setSelected(msg.id); if(!msg.read && setMessages) setMessages(prev=>prev.map(m=>m.id===msg.id?{...m,read:true}:m)); }} style={{ padding:"12px 14px", borderRadius:10, border:"1px solid " + (msg.read?"#f1f5f9":"#0d9488"), background: msg.read?"#fff":"#f0fdf9", marginBottom:8, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight: msg.read?500:700, color:"#1e293b" }}>{msg.subject}</div>
                    <div style={{ fontSize:11, color:"#94a3b8", marginTop:2 }}>{msg.fromSchool?"🏫 School":"👨‍👩‍👧 You"} · {fmtTime(msg.timestamp)} {msg.image?"📎":""} {(msg.replies||[]).length>0?"↩"+msg.replies.length:""}</div>
                  </div>
                  {!msg.read && <div style={{ width:8, height:8, borderRadius:"50%", background:"#0d9488" }} />}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── ParentQuiz ────────────────────────────────────────────────────────────────
function ParentQuiz({ student, quizzes, quizResults, setQuizResults }) {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);

  const available = (quizzes||[]).filter(q => q.active && q.classId === student.classId);
  const done = (quizResults||[]).filter(r => r.studentId === student.id).map(r => r.quizId);
  const pending = available.filter(q => !done.includes(q.id));

  useEffect(() => {
    if (!activeQuiz || !activeQuiz.duration) return;
    setTimeLeft(Number(activeQuiz.duration) * 60);
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(t); handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [activeQuiz]);

  const handleSubmit = () => {
    if (!activeQuiz) return;
    let correct = 0;
    activeQuiz.questions.forEach(q => {
      const ans = (answers[q.id]||"").trim().toLowerCase();
      const correct_ans = (q.answer||"").trim().toLowerCase();
      if (ans === correct_ans) correct++;
    });
    setScore(correct);
    const result = { id: uid(), quizId: activeQuiz.id, studentId: student.id, answers, score: correct, submittedAt: new Date().toISOString() };
    const updated = [...(quizResults||[]), result];
    setQuizResults(updated);
    localStorage.setItem("edu_quiz_results", JSON.stringify(updated));
    setSubmitted(true);
  };

  if (activeQuiz && !submitted) return (
    <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:24, marginBottom:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div style={{ fontSize:16, fontWeight:700, color:"#1e293b" }}>{activeQuiz.title}</div>
        {timeLeft !== null && (
          <div style={{ background: timeLeft < 60 ? "#fee2e2" : "#f0fdf4", color: timeLeft < 60 ? "#dc2626" : "#065f46", padding:"6px 14px", borderRadius:20, fontSize:13, fontWeight:700 }}>
            ⏱ {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,"0")}
          </div>
        )}
      </div>
      {activeQuiz.questions.map((q,i) => (
        <div key={q.id} style={{ marginBottom:20, padding:16, background:"#f8fafc", borderRadius:10 }}>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:12, color:"#1e293b" }}>Q{i+1}: {q.text}</div>
          {q.type === "mcq" && q.options.map(opt => (
            <label key={opt} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, cursor:"pointer" }}>
              <input type="radio" name={"q"+q.id} checked={answers[q.id]===opt} onChange={() => setAnswers({...answers, [q.id]:opt})} />
              <span style={{ fontSize:13 }}>{opt}</span>
            </label>
          ))}
          {q.type === "tf" && ["True","False"].map(v => (
            <label key={v} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, cursor:"pointer" }}>
              <input type="radio" name={"q"+q.id} checked={answers[q.id]===v} onChange={() => setAnswers({...answers, [q.id]:v})} />
              <span style={{ fontSize:13 }}>{v}</span>
            </label>
          ))}
          {q.type === "fill" && (
            <input value={answers[q.id]||""} onChange={e => setAnswers({...answers, [q.id]:e.target.value})} placeholder="Your answer..." style={{ width:"100%", padding:"8px 12px", border:"1px solid #e2e8f0", borderRadius:7, fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }} />
          )}
        </div>
      ))}
      <div style={{ display:"flex", gap:10 }}>
        <button onClick={handleSubmit} style={{ flex:1, padding:"12px 0", borderRadius:9, border:"none", background:"#0d9488", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Submit Quiz</button>
        <button onClick={() => { setActiveQuiz(null); setAnswers({}); }} style={{ padding:"12px 18px", borderRadius:9, border:"1px solid #e2e8f0", background:"#fff", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
      </div>
    </div>
  );

  if (submitted) return (
    <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:32, marginBottom:16, textAlign:"center" }}>
      <div style={{ fontSize:48, marginBottom:12 }}>{score / activeQuiz.questions.length >= 0.6 ? "🎉" : "📚"}</div>
      <div style={{ fontSize:20, fontWeight:800, color:"#1e293b", marginBottom:8 }}>Quiz Completed!</div>
      <div style={{ fontSize:32, fontWeight:700, color: score/activeQuiz.questions.length >= 0.6 ? "#0d9488" : "#dc2626", marginBottom:8 }}>
        {score} / {activeQuiz.questions.length}
      </div>
      <div style={{ fontSize:14, color:"#64748b", marginBottom:20 }}>
        {Math.round(score/activeQuiz.questions.length*100)}% — {score/activeQuiz.questions.length >= 0.8 ? "Excellent!" : score/activeQuiz.questions.length >= 0.6 ? "Good job!" : "Keep practicing!"}
      </div>
      <button onClick={() => { setActiveQuiz(null); setAnswers({}); setSubmitted(false); }} style={{ padding:"10px 24px", borderRadius:9, border:"none", background:"#0d9488", color:"#fff", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Back to Quizzes</button>
    </div>
  );

  return (
    <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", overflow:"hidden", marginBottom:16 }}>
      <div style={{ padding:"16px 20px", borderBottom:"1px solid #e2e8f0", fontSize:14, fontWeight:700, color:"#1e293b" }}>📝 Available Quizzes</div>
      {pending.length === 0 ? (
        <div style={{ padding:32, textAlign:"center", color:"#64748b" }}>
          <div style={{ fontSize:32, marginBottom:8 }}>✅</div>
          <div>All quizzes completed!</div>
        </div>
      ) : pending.map(quiz => (
        <div key={quiz.id} style={{ padding:"16px 20px", borderBottom:"1px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:14, fontWeight:600, color:"#1e293b" }}>{quiz.title}</div>
            <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>
              {quiz.questions.length} questions {quiz.duration ? "· " + quiz.duration + " min" : ""}
            </div>
          </div>
          <button onClick={() => { setActiveQuiz(quiz); setAnswers({}); setSubmitted(false); }} style={{ padding:"8px 18px", borderRadius:8, border:"none", background:"#0d9488", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Start →</button>
        </div>
      ))}
      {done.length > 0 && (
        <div style={{ padding:"10px 20px", background:"#f8fafc" }}>
          <div style={{ fontSize:12, color:"#64748b" }}>✅ {done.length} quiz{done.length > 1 ? "zes" : ""} completed</div>
        </div>
      )}
    </div>
  );
}


// ─── LessonPlans ──────────────────────────────────────────────────────────────
function LessonPlans({ classes, subjects, lessonPlans, setLessonPlans, teacherClassIds, userRole, auth, teachers }) {
  const [view, setView] = useState("list"); // list | create | detail
  const [selected, setSelected] = useState(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [filterClass, setFilterClass] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");
  const emptyForm = { title:"", classId:"", subjectId:"", week:"", day:"Monday", objectives:[""], activities:[""], resources:[""], homework:"", assessment:"", notes:"", attachments:[] };
  const [form, setForm] = useState(emptyForm);

  const visibleClasses = (userRole === "admin" || !teacherClassIds || teacherClassIds.length === 0)
    ? (classes||[])
    : (classes||[]).filter(c => (teacherClassIds||[]).includes(c.id));

  // حساب الأسبوع الحالي
  const getWeekStart = (offset = 0) => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) + (offset * 7);
    return new Date(d.setDate(diff));
  };
  const weekStart = getWeekStart(weekOffset);
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6);
  const weekLabel = weekStart.toLocaleDateString("en-US",{month:"short",day:"numeric"}) + " – " + weekEnd.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});

  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
  const weekKey = weekStart.toISOString().split("T")[0];

  const filtered = (lessonPlans||[]).filter(p => {
    const matchClass = filterClass === "all" || String(p.classId) === String(filterClass);
    const matchSubject = filterSubject === "all" || String(p.subjectId) === String(filterSubject);
    const matchWeek = p.week === weekKey;
    return matchClass && matchSubject && matchWeek;
  });

  const save = () => {
    if (!form.title.trim() || !form.classId || !form.subjectId) return alert("Please fill title, class and subject");
    const plan = { ...form, id: Date.now() + Math.random(), week: weekKey, createdBy: auth?.name || "Teacher", createdAt: new Date().toISOString() };
    const updated = [...(lessonPlans||[]), plan];
    setLessonPlans(updated);
    localStorage.setItem("edu_lesson_plans", JSON.stringify(updated));
    setView("list"); setForm(emptyForm);
  };

  const deletePlan = (id) => {
    const updated = (lessonPlans||[]).filter(p => p.id !== id);
    setLessonPlans(updated); localStorage.setItem("edu_lesson_plans", JSON.stringify(updated));
  };

  const addItem = (field) => setForm(f => ({...f, [field]: [...f[field], ""]}));
  const updateItem = (field, idx, val) => setForm(f => { const arr=[...f[field]]; arr[idx]=val; return {...f,[field]:arr}; });
  const removeItem = (field, idx) => setForm(f => ({...f, [field]: f[field].filter((_,i)=>i!==idx)}));

  const S = { border:"#e2e8f0", primary:"#0d9488", text:"#0f172a", sub:"#64748b" };
  const inp = { width:"100%", padding:"9px 12px", border:"1px solid #e2e8f0", borderRadius:8, fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box" };

  // ── Detail View ───────────────────────────────────────────────────────────
  if (view === "detail" && selected) {
    const plan = (lessonPlans||[]).find(p => p.id === selected);
    if (!plan) { setView("list"); return null; }
    const cls = (classes||[]).find(c => c.id === plan.classId);
    const sub = (subjects||[]).find(s => s.id === plan.subjectId);
    return (
      <div style={{ maxWidth:700, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <button onClick={() => setView("list")} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", fontSize:13 }}>← Back</button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:18, fontWeight:800, color:S.text, fontFamily:"'Plus Jakarta Sans',system-ui" }}>{plan.title}</div>
            <div style={{ fontSize:12, color:S.sub, marginTop:2 }}>{cls?.name} · {sub?.name} · {plan.day} · {plan.week}</div>
          </div>
          <button onClick={() => deletePlan(plan.id)} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid #fca5a5", background:"#fee2e2", color:"#dc2626", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>🗑️ Delete</button>
        </div>

        <div style={{ display:"grid", gap:16 }}>
          {plan.objectives?.filter(o=>o.trim()).length > 0 && (
            <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", padding:20 }}>
              <div style={{ fontSize:13, fontWeight:700, color:S.text, marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ background:"#dbeafe", color:"#1d4ed8", borderRadius:8, padding:"3px 10px", fontSize:11 }}>🎯 Objectives</span>
              </div>
              <ul style={{ paddingRight:20, margin:0 }}>
                {plan.objectives.filter(o=>o.trim()).map((o,i) => (
                  <li key={i} style={{ fontSize:13, color:"#334155", marginBottom:6, lineHeight:1.6 }}>{o}</li>
                ))}
              </ul>
            </div>
          )}

          {plan.activities?.filter(a=>a.trim()).length > 0 && (
            <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", padding:20 }}>
              <div style={{ fontSize:13, fontWeight:700, color:S.text, marginBottom:12 }}>
                <span style={{ background:"#d1fae5", color:"#065f46", borderRadius:8, padding:"3px 10px", fontSize:11 }}>📋 Activities</span>
              </div>
              <ul style={{ paddingRight:20, margin:0 }}>
                {plan.activities.filter(a=>a.trim()).map((a,i) => (
                  <li key={i} style={{ fontSize:13, color:"#334155", marginBottom:6, lineHeight:1.6 }}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {plan.resources?.filter(r=>r.trim()).length > 0 && (
              <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", padding:20 }}>
                <div style={{ fontSize:12, fontWeight:700, color:S.text, marginBottom:10 }}>
                  <span style={{ background:"#fef3c7", color:"#854d0e", borderRadius:8, padding:"3px 10px", fontSize:11 }}>📎 Resources</span>
                </div>
                <ul style={{ paddingRight:16, margin:0 }}>
                  {plan.resources.filter(r=>r.trim()).map((r,i) => <li key={i} style={{ fontSize:12, color:"#334155", marginBottom:4 }}>{r}</li>)}
                </ul>
              </div>
            )}

            {plan.homework?.trim() && (
              <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", padding:20 }}>
                <div style={{ fontSize:12, fontWeight:700, color:S.text, marginBottom:10 }}>
                  <span style={{ background:"#ede9fe", color:"#6d28d9", borderRadius:8, padding:"3px 10px", fontSize:11 }}>📝 Homework</span>
                </div>
                <p style={{ fontSize:13, color:"#334155", lineHeight:1.6, margin:0 }}>{plan.homework}</p>
              </div>
            )}
          </div>

          {plan.assessment?.trim() && (
            <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", padding:20 }}>
              <div style={{ fontSize:12, fontWeight:700, color:S.text, marginBottom:10 }}>
                <span style={{ background:"#fee2e2", color:"#dc2626", borderRadius:8, padding:"3px 10px", fontSize:11 }}>📊 Assessment</span>
              </div>
              <p style={{ fontSize:13, color:"#334155", lineHeight:1.6, margin:0 }}>{plan.assessment}</p>
            </div>
          )}

          {plan.notes?.trim() && (
            <div style={{ background:"#fffbeb", borderRadius:12, border:"1px solid #fde68a", padding:20 }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#854d0e", marginBottom:8 }}>💡 Notes</div>
              <p style={{ fontSize:13, color:"#78350f", lineHeight:1.6, margin:0 }}>{plan.notes}</p>
            </div>
          )}
          {(plan.attachments||[]).length > 0 && (
            <div style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", padding:20 }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#0f172a", marginBottom:12 }}>📎 Attachments</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
                {plan.attachments.map((att,i) => (
                  <div key={i} style={{ border:"1px solid #e2e8f0", borderRadius:10, overflow:"hidden", width:120 }}>
                    {att.type.startsWith("image/") ? (
                      <a href={att.data} target="_blank" rel="noreferrer">
                        <img src={att.data} style={{ width:"100%", height:80, objectFit:"cover", display:"block" }} />
                        <div style={{ padding:"6px 8px", fontSize:10, color:"#64748b", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{att.name}</div>
                      </a>
                    ) : (
                      <a href={att.data} download={att.name} style={{ textDecoration:"none" }}>
                        <div style={{ height:80, background:"#f8fafc", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>
                          {att.name.endsWith(".pdf")?"📄":att.name.endsWith(".ppt")||att.name.endsWith(".pptx")?"📊":att.name.endsWith(".doc")||att.name.endsWith(".docx")?"📝":"📎"}
                        </div>
                        <div style={{ padding:"6px 8px", fontSize:10, color:"#64748b", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{att.name}</div>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Create View ───────────────────────────────────────────────────────────
  if (view === "create") return (
    <div style={{ maxWidth:680, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <button onClick={() => { setView("list"); setForm(emptyForm); }} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", fontSize:13 }}>← Back</button>
        <div style={{ fontSize:16, fontWeight:800, color:S.text, fontFamily:"'Plus Jakarta Sans',system-ui" }}>📚 New Lesson Plan</div>
        <div style={{ marginLeft:"auto", fontSize:12, color:S.sub, background:"#f0fdf9", border:"1px solid #99f6e4", borderRadius:8, padding:"4px 12px" }}>Week of {weekLabel}</div>
      </div>

      {/* Basic Info */}
      <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:24, marginBottom:16 }}>
        <div style={{ fontSize:13, fontWeight:700, color:S.text, marginBottom:16 }}>📋 Basic Information</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
          <div style={{ gridColumn:"1/-1" }}>
            <label style={{ fontSize:12, fontWeight:600, color:S.sub, display:"block", marginBottom:4 }}>Lesson Title *</label>
            <input style={inp} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Introduction to Fractions" />
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:S.sub, display:"block", marginBottom:4 }}>Class *</label>
            <select style={inp} value={form.classId} onChange={e=>setForm({...form,classId:Number(e.target.value),subjectId:""})}>
              <option value="">Select class...</option>
              {visibleClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:S.sub, display:"block", marginBottom:4 }}>Subject *</label>
            <select style={inp} value={form.subjectId} onChange={e=>setForm({...form,subjectId:Number(e.target.value)})}>
              <option value="">Select subject...</option>
              {(subjects||[]).filter(s=>!form.classId||s.classId===form.classId).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:S.sub, display:"block", marginBottom:4 }}>Day</label>
            <select style={inp} value={form.day} onChange={e=>setForm({...form,day:e.target.value})}>
              {days.map(d=><option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Objectives */}
      <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:24, marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={{ fontSize:13, fontWeight:700, color:S.text }}>🎯 Learning Objectives</div>
          <button onClick={()=>addItem("objectives")} style={{ padding:"5px 12px", borderRadius:7, border:"none", background:"#0d9488", color:"#fff", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>+ Add</button>
        </div>
        {form.objectives.map((o,i) => (
          <div key={i} style={{ display:"flex", gap:8, marginBottom:8 }}>
            <input style={{...inp,flex:1}} value={o} onChange={e=>updateItem("objectives",i,e.target.value)} placeholder={"Objective " + (i+1) + "..."} />
            {form.objectives.length > 1 && <button onClick={()=>removeItem("objectives",i)} style={{ padding:"0 10px", borderRadius:7, border:"1px solid #fca5a5", background:"#fee2e2", color:"#dc2626", fontSize:13, cursor:"pointer" }}>×</button>}
          </div>
        ))}
      </div>

      {/* Activities */}
      <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:24, marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={{ fontSize:13, fontWeight:700, color:S.text }}>📋 Classroom Activities</div>
          <button onClick={()=>addItem("activities")} style={{ padding:"5px 12px", borderRadius:7, border:"none", background:"#0d9488", color:"#fff", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>+ Add</button>
        </div>
        {form.activities.map((a,i) => (
          <div key={i} style={{ display:"flex", gap:8, marginBottom:8 }}>
            <input style={{...inp,flex:1}} value={a} onChange={e=>updateItem("activities",i,e.target.value)} placeholder={"Activity " + (i+1) + "..."} />
            {form.activities.length > 1 && <button onClick={()=>removeItem("activities",i)} style={{ padding:"0 10px", borderRadius:7, border:"1px solid #fca5a5", background:"#fee2e2", color:"#dc2626", fontSize:13, cursor:"pointer" }}>×</button>}
          </div>
        ))}
      </div>

      {/* Resources */}
      <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:24, marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={{ fontSize:13, fontWeight:700, color:S.text }}>📎 Resources & Materials</div>
          <button onClick={()=>addItem("resources")} style={{ padding:"5px 12px", borderRadius:7, border:"none", background:"#0d9488", color:"#fff", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>+ Add</button>
        </div>
        {form.resources.map((r,i) => (
          <div key={i} style={{ display:"flex", gap:8, marginBottom:8 }}>
            <input style={{...inp,flex:1}} value={r} onChange={e=>updateItem("resources",i,e.target.value)} placeholder={"Resource " + (i+1) + "..."} />
            {form.resources.length > 1 && <button onClick={()=>removeItem("resources",i)} style={{ padding:"0 10px", borderRadius:7, border:"1px solid #fca5a5", background:"#fee2e2", color:"#dc2626", fontSize:13, cursor:"pointer" }}>×</button>}
          </div>
        ))}
      </div>

      {/* Homework + Assessment */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
        <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:20 }}>
          <div style={{ fontSize:13, fontWeight:700, color:S.text, marginBottom:12 }}>📝 Homework</div>
          <textarea style={{...inp,resize:"vertical"}} rows={3} value={form.homework} onChange={e=>setForm({...form,homework:e.target.value})} placeholder="Homework assignment..." />
        </div>
        <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:20 }}>
          <div style={{ fontSize:13, fontWeight:700, color:S.text, marginBottom:12 }}>📊 Assessment Method</div>
          <textarea style={{...inp,resize:"vertical"}} rows={3} value={form.assessment} onChange={e=>setForm({...form,assessment:e.target.value})} placeholder="How will you assess learning?" />
        </div>
      </div>

      {/* Notes + Attachments */}
      <div style={{ background:"#fffbeb", borderRadius:14, border:"1px solid #fde68a", padding:20, marginBottom:20 }}>
        <div style={{ fontSize:13, fontWeight:700, color:"#854d0e", marginBottom:10 }}>💡 Additional Notes</div>
        <textarea style={{...inp,resize:"vertical",background:"transparent",border:"1px solid #fcd34d"}} rows={2} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Any additional notes..." />
        
        <div style={{ marginTop:14 }}>
          <div style={{ fontSize:12, fontWeight:700, color:"#854d0e", marginBottom:8 }}>📎 Attachments (Images or Files)</div>
          <label style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 16px", borderRadius:8, border:"2px dashed #fcd34d", background:"rgba(253,230,138,.2)", cursor:"pointer", fontSize:12, color:"#854d0e", fontWeight:600 }}>
            📁 Choose Image or File
            <input type="file" accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt" multiple style={{ display:"none" }} onChange={e => {
              const files = Array.from(e.target.files);
              files.forEach(f => {
                const reader = new FileReader();
                reader.onload = () => {
                  setForm(prev => ({
                    ...prev,
                    attachments: [...(prev.attachments||[]), { name: f.name, type: f.type, data: reader.result, size: f.size }]
                  }));
                };
                reader.readAsDataURL(f);
              });
            }} />
          </label>
          
          {(form.attachments||[]).length > 0 && (
            <div style={{ marginTop:12, display:"flex", flexWrap:"wrap", gap:8 }}>
              {form.attachments.map((att,i) => (
                <div key={i} style={{ background:"#fff", border:"1px solid #fde68a", borderRadius:10, padding:"8px 12px", display:"flex", alignItems:"center", gap:8, maxWidth:200 }}>
                  {att.type.startsWith("image/") ? (
                    <img src={att.data} style={{ width:40, height:40, borderRadius:6, objectFit:"cover", flexShrink:0 }} />
                  ) : (
                    <div style={{ width:40, height:40, borderRadius:6, background:"#fef3c7", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                      {att.name.endsWith(".pdf") ? "📄" : att.name.endsWith(".ppt")||att.name.endsWith(".pptx") ? "📊" : att.name.endsWith(".doc")||att.name.endsWith(".docx") ? "📝" : "📎"}
                    </div>
                  )}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:11, fontWeight:600, color:"#854d0e", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{att.name}</div>
                    <div style={{ fontSize:10, color:"#a16207" }}>{(att.size/1024).toFixed(1)} KB</div>
                  </div>
                  <button onClick={() => setForm(prev => ({...prev, attachments: prev.attachments.filter((_,j)=>j!==i)}))} style={{ background:"none", border:"none", cursor:"pointer", color:"#dc2626", fontSize:14, flexShrink:0 }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button onClick={save} style={{ width:"100%", padding:"14px 0", borderRadius:12, border:"none", background:"linear-gradient(135deg,#0d9488,#14b8a6)", color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 16px rgba(13,148,136,.3)" }}>
        💾 Save Lesson Plan
      </button>
    </div>
  );

  // ── List View ─────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <div style={{ fontSize:20, fontWeight:800, color:S.text, fontFamily:"'Plus Jakarta Sans',system-ui" }}>📚 Lesson Plans</div>
          <div style={{ fontSize:13, color:S.sub, marginTop:2 }}>Weekly lesson planning</div>
        </div>
        <button onClick={() => setView("create")} style={{ padding:"10px 20px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#0d9488,#14b8a6)", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 12px rgba(13,148,136,.3)" }}>+ New Lesson Plan</button>
      </div>

      {/* Week Navigator */}
      <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:"14px 20px", marginBottom:16, display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={() => setWeekOffset(w=>w-1)} style={{ width:34, height:34, borderRadius:8, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", fontSize:16 }}>‹</button>
        <div style={{ flex:1, textAlign:"center" }}>
          <div style={{ fontSize:14, fontWeight:700, color:S.text }}>Week of {weekLabel}</div>
          {weekOffset === 0 && <div style={{ fontSize:11, color:"#0d9488", fontWeight:600, marginTop:2 }}>Current Week</div>}
        </div>
        <button onClick={() => setWeekOffset(w=>w+1)} style={{ width:34, height:34, borderRadius:8, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", fontSize:16 }}>›</button>
        {weekOffset !== 0 && <button onClick={() => setWeekOffset(0)} style={{ padding:"6px 14px", borderRadius:8, border:"1px solid #e2e8f0", background:"#f8fafc", cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>Today</button>}
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
        <select style={{...inp, width:"auto", minWidth:160}} value={filterClass} onChange={e=>setFilterClass(e.target.value)}>
          <option value="all">All Classes</option>
          {visibleClasses.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select style={{...inp, width:"auto", minWidth:160}} value={filterSubject} onChange={e=>setFilterSubject(e.target.value)}>
          <option value="all">All Subjects</option>
          {(subjects||[]).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {/* Weekly Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:20 }}>
        {days.map(day => {
          const dayPlans = filtered.filter(p => p.day === day);
          const isToday = new Date().toLocaleDateString("en-US",{weekday:"long"}) === day && weekOffset === 0;
          return (
            <div key={day} style={{ background: isToday ? "#f0fdf9" : "#fff", borderRadius:14, border: isToday ? "2px solid #0d9488" : "1px solid #e2e8f0", padding:14, minHeight:120 }}>
              <div style={{ fontSize:12, fontWeight:700, color: isToday ? "#0d9488" : S.sub, marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                {day.slice(0,3).toUpperCase()}
                {isToday && <span style={{ fontSize:9, background:"#0d9488", color:"#fff", borderRadius:10, padding:"1px 6px" }}>TODAY</span>}
              </div>
              {dayPlans.length === 0 ? (
                <div style={{ fontSize:11, color:"#cbd5e1", textAlign:"center", paddingTop:12 }}>No plans</div>
              ) : dayPlans.map(p => {
                const sub = (subjects||[]).find(s=>s.id===p.subjectId);
                const cls = (classes||[]).find(c=>c.id===p.classId);
                return (
                  <div key={p.id} onClick={() => { setSelected(p.id); setView("detail"); }} style={{ background:"#0d9488", borderRadius:8, padding:"8px 10px", marginBottom:6, cursor:"pointer" }}>
                    <div style={{ fontSize:11, fontWeight:700, color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.title}</div>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,.7)", marginTop:2 }}>{cls?.name} · {sub?.name}</div>
                    {userRole === "admin" && p.createdBy && <div style={{ fontSize:9, color:"rgba(255,255,255,.55)", marginTop:1 }}>👤 {p.createdBy}</div>}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* List */}
      {filtered.length === 0 && (
        <div style={{ textAlign:"center", padding:60, background:"#fff", borderRadius:14, border:"1px solid #e2e8f0" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>📚</div>
          <div style={{ fontSize:15, fontWeight:700, color:S.text }}>No lesson plans this week</div>
          <div style={{ fontSize:13, color:S.sub, marginTop:4 }}>Click "New Lesson Plan" to create one</div>
        </div>
      )}
    </div>
  );
}



// ─── Quran Data ───────────────────────────────────────────────────────────────
const SURAHS = [
  {id:1,name:"Al-Fatihah",arabic:"الفاتحة",verses:7,pages:1},{id:2,name:"Al-Baqarah",arabic:"البقرة",verses:286,pages:49},
  {id:3,name:"Ali 'Imran",arabic:"آل عمران",verses:200,pages:20},{id:4,name:"An-Nisa",arabic:"النساء",verses:176,pages:24},
  {id:5,name:"Al-Ma'idah",arabic:"المائدة",verses:120,pages:16},{id:6,name:"Al-An'am",arabic:"الأنعام",verses:165,pages:21},
  {id:7,name:"Al-A'raf",arabic:"الأعراف",verses:206,pages:24},{id:8,name:"Al-Anfal",arabic:"الأنفال",verses:75,pages:9},
  {id:9,name:"At-Tawbah",arabic:"التوبة",verses:129,pages:16},{id:10,name:"Yunus",arabic:"يونس",verses:109,pages:11},
  {id:11,name:"Hud",arabic:"هود",verses:123,pages:10},{id:12,name:"Yusuf",arabic:"يوسف",verses:111,pages:12},
  {id:13,name:"Ar-Ra'd",arabic:"الرعد",verses:43,pages:6},{id:14,name:"Ibrahim",arabic:"إبراهيم",verses:52,pages:6},
  {id:15,name:"Al-Hijr",arabic:"الحجر",verses:99,pages:6},{id:16,name:"An-Nahl",arabic:"النحل",verses:128,pages:13},
  {id:17,name:"Al-Isra",arabic:"الإسراء",verses:111,pages:12},{id:18,name:"Al-Kahf",arabic:"الكهف",verses:110,pages:12},
  {id:19,name:"Maryam",arabic:"مريم",verses:98,pages:6},{id:20,name:"Ta-Ha",arabic:"طه",verses:135,pages:8},
  {id:21,name:"Al-Anbiya",arabic:"الأنبياء",verses:112,pages:7},{id:22,name:"Al-Hajj",arabic:"الحج",verses:78,pages:10},
  {id:23,name:"Al-Mu'minun",arabic:"المؤمنون",verses:118,pages:7},{id:24,name:"An-Nur",arabic:"النور",verses:64,pages:9},
  {id:25,name:"Al-Furqan",arabic:"الفرقان",verses:77,pages:6},{id:26,name:"Ash-Shu'ara",arabic:"الشعراء",verses:227,pages:11},
  {id:27,name:"An-Naml",arabic:"النمل",verses:93,pages:8},{id:28,name:"Al-Qasas",arabic:"القصص",verses:88,pages:9},
  {id:29,name:"Al-'Ankabut",arabic:"العنكبوت",verses:69,pages:7},{id:30,name:"Ar-Rum",arabic:"الروم",verses:60,pages:6},
  {id:31,name:"Luqman",arabic:"لقمان",verses:34,pages:4},{id:32,name:"As-Sajdah",arabic:"السجدة",verses:30,pages:3},
  {id:33,name:"Al-Ahzab",arabic:"الأحزاب",verses:73,pages:9},{id:34,name:"Saba",arabic:"سبأ",verses:54,pages:6},
  {id:35,name:"Fatir",arabic:"فاطر",verses:45,pages:5},{id:36,name:"Ya-Sin",arabic:"يس",verses:83,pages:4},
  {id:37,name:"As-Saffat",arabic:"الصافات",verses:182,pages:7},{id:38,name:"Sad",arabic:"ص",verses:88,pages:5},
  {id:39,name:"Az-Zumar",arabic:"الزمر",verses:75,pages:8},{id:40,name:"Ghafir",arabic:"غافر",verses:85,pages:9},
  {id:41,name:"Fussilat",arabic:"فصلت",verses:54,pages:8},{id:42,name:"Ash-Shuraa",arabic:"الشورى",verses:53,pages:5},
  {id:43,name:"Az-Zukhruf",arabic:"الزخرف",verses:89,pages:7},{id:44,name:"Ad-Dukhan",arabic:"الدخان",verses:59,pages:3},
  {id:45,name:"Al-Jathiyah",arabic:"الجاثية",verses:37,pages:4},{id:46,name:"Al-Ahqaf",arabic:"الأحقاف",verses:35,pages:4},
  {id:47,name:"Muhammad",arabic:"محمد",verses:38,pages:4},{id:48,name:"Al-Fath",arabic:"الفتح",verses:29,pages:4},
  {id:49,name:"Al-Hujurat",arabic:"الحجرات",verses:18,pages:2},{id:50,name:"Qaf",arabic:"ق",verses:45,pages:3},
  {id:51,name:"Adh-Dhariyat",arabic:"الذاريات",verses:60,pages:3},{id:52,name:"At-Tur",arabic:"الطور",verses:49,pages:3},
  {id:53,name:"An-Najm",arabic:"النجم",verses:62,pages:3},{id:54,name:"Al-Qamar",arabic:"القمر",verses:55,pages:3},
  {id:55,name:"Ar-Rahman",arabic:"الرحمن",verses:78,pages:3},{id:56,name:"Al-Waqi'ah",arabic:"الواقعة",verses:96,pages:3},
  {id:57,name:"Al-Hadid",arabic:"الحديد",verses:29,pages:5},{id:58,name:"Al-Mujadila",arabic:"المجادلة",verses:22,pages:3},
  {id:59,name:"Al-Hashr",arabic:"الحشر",verses:24,pages:3},{id:60,name:"Al-Mumtahanah",arabic:"الممتحنة",verses:13,pages:3},
  {id:61,name:"As-Saf",arabic:"الصف",verses:14,pages:2},{id:62,name:"Al-Jumu'ah",arabic:"الجمعة",verses:11,pages:2},
  {id:63,name:"Al-Munafiqun",arabic:"المنافقون",verses:11,pages:2},{id:64,name:"At-Taghabun",arabic:"التغابن",verses:18,pages:2},
  {id:65,name:"At-Talaq",arabic:"الطلاق",verses:12,pages:2},{id:66,name:"At-Tahrim",arabic:"التحريم",verses:12,pages:2},
  {id:67,name:"Al-Mulk",arabic:"الملك",verses:30,pages:2},{id:68,name:"Al-Qalam",arabic:"القلم",verses:52,pages:2},
  {id:69,name:"Al-Haqqah",arabic:"الحاقة",verses:52,pages:2},{id:70,name:"Al-Ma'arij",arabic:"المعارج",verses:44,pages:2},
  {id:71,name:"Nuh",arabic:"نوح",verses:28,pages:2},{id:72,name:"Al-Jinn",arabic:"الجن",verses:28,pages:2},
  {id:73,name:"Al-Muzzammil",arabic:"المزمل",verses:20,pages:1},{id:74,name:"Al-Muddaththir",arabic:"المدثر",verses:56,pages:2},
  {id:75,name:"Al-Qiyamah",arabic:"القيامة",verses:40,pages:1},{id:76,name:"Al-Insan",arabic:"الإنسان",verses:31,pages:2},
  {id:77,name:"Al-Mursalat",arabic:"المرسلات",verses:50,pages:1},{id:78,name:"An-Naba",arabic:"النبأ",verses:40,pages:1},
  {id:79,name:"An-Nazi'at",arabic:"النازعات",verses:46,pages:1},{id:80,name:"'Abasa",arabic:"عبس",verses:42,pages:1},
  {id:81,name:"At-Takwir",arabic:"التكوير",verses:29,pages:1},{id:82,name:"Al-Infitar",arabic:"الانفطار",verses:19,pages:1},
  {id:83,name:"Al-Mutaffifin",arabic:"المطففين",verses:36,pages:1},{id:84,name:"Al-Inshiqaq",arabic:"الانشقاق",verses:25,pages:1},
  {id:85,name:"Al-Buruj",arabic:"البروج",verses:22,pages:1},{id:86,name:"At-Tariq",arabic:"الطارق",verses:17,pages:1},
  {id:87,name:"Al-A'la",arabic:"الأعلى",verses:19,pages:1},{id:88,name:"Al-Ghashiyah",arabic:"الغاشية",verses:26,pages:1},
  {id:89,name:"Al-Fajr",arabic:"الفجر",verses:30,pages:1},{id:90,name:"Al-Balad",arabic:"البلد",verses:20,pages:1},
  {id:91,name:"Ash-Shams",arabic:"الشمس",verses:15,pages:1},{id:92,name:"Al-Layl",arabic:"الليل",verses:21,pages:1},
  {id:93,name:"Ad-Duhaa",arabic:"الضحى",verses:11,pages:1},{id:94,name:"Ash-Sharh",arabic:"الشرح",verses:8,pages:1},
  {id:95,name:"At-Tin",arabic:"التين",verses:8,pages:1},{id:96,name:"Al-'Alaq",arabic:"العلق",verses:19,pages:1},
  {id:97,name:"Al-Qadr",arabic:"القدر",verses:5,pages:1},{id:98,name:"Al-Bayyinah",arabic:"البينة",verses:8,pages:1},
  {id:99,name:"Az-Zalzalah",arabic:"الزلزلة",verses:8,pages:1},{id:100,name:"Al-'Adiyat",arabic:"العاديات",verses:11,pages:1},
  {id:101,name:"Al-Qari'ah",arabic:"القارعة",verses:11,pages:1},{id:102,name:"At-Takathur",arabic:"التكاثر",verses:8,pages:1},
  {id:103,name:"Al-'Asr",arabic:"العصر",verses:3,pages:1},{id:104,name:"Al-Humazah",arabic:"الهمزة",verses:9,pages:1},
  {id:105,name:"Al-Fil",arabic:"الفيل",verses:5,pages:1},{id:106,name:"Quraysh",arabic:"قريش",verses:4,pages:1},
  {id:107,name:"Al-Ma'un",arabic:"الماعون",verses:7,pages:1},{id:108,name:"Al-Kawthar",arabic:"الكوثر",verses:3,pages:1},
  {id:109,name:"Al-Kafirun",arabic:"الكافرون",verses:6,pages:1},{id:110,name:"An-Nasr",arabic:"النصر",verses:3,pages:1},
  {id:111,name:"Al-Masad",arabic:"المسد",verses:5,pages:1},{id:112,name:"Al-Ikhlas",arabic:"الإخلاص",verses:4,pages:1},
  {id:113,name:"Al-Falaq",arabic:"الفلق",verses:5,pages:1},{id:114,name:"An-Nas",arabic:"الناس",verses:6,pages:1},
];

const RECITERS = [
  { id: "ar.alafasy",       name: "Mishary Alafasy",    arabic: "مشاري العفاسي" },
  { id: "ar.abdurrahmaansudais", name: "Abdurrahman As-Sudais", arabic: "عبد الرحمن السديس" },
  { id: "ar.husary",        name: "Mahmoud Khalil Al-Husary", arabic: "محمود خليل الحصري" },
  { id: "ar.minshawi",      name: "Mohamed Siddiq Al-Minshawi", arabic: "محمد صديق المنشاوي" },
];

const MEMORIZATION_LEVELS = [
  { value: "excellent", label: "Excellent", arabic: "ممتاز", color: "#059669", bg: "#d1fae5", icon: "🌟" },
  { value: "good",      label: "Good",      arabic: "جيد",   color: "#0284c7", bg: "#dbeafe", icon: "✅" },
  { value: "average",   label: "Average",   arabic: "متوسط", color: "#d97706", bg: "#fef3c7", icon: "📖" },
  { value: "weak",      label: "Weak",      arabic: "ضعيف",  color: "#dc2626", bg: "#fee2e2", icon: "⚠️" },
];

// â”€â”€ QuranPageText Component (synchronized player) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Global audio controller - persists across re-renders
const _QAudio = {
  el: null,
  playing: false,
  stop() {
    this.playing = false;
    if (this.el) {
      this.el.onended = null;
      this.el.onerror = null;
      try { this.el.pause(); } catch(e) {}
      try { this.el.src = ""; } catch(e) {}
      this.el = null;
    }
  },
  play(url, onEnd, onErr) {
    this.stop();
    this.playing = true;
    this.el = new Audio(url);
    this.el.onended = onEnd;
    this.el.onerror = onErr;
    this.el.play().catch(onErr);
  }
};

function QuranPageText({ page, reciter, playing, setPlaying, externalAudio, setExternalAudio }) {
  const [ayahs,         setAyahs]        = useState([]);
  const [loading,       setLoading]      = useState(true);
  const [error,         setError]        = useState(false);
  const [currentAyah,  setCurrentAyah]  = useState(null);
  const [pageAudioPlay, setPageAudioPlay] = useState(false);
  const ayahRefs = { current: {} };

  useEffect(() => {
    setLoading(true); setError(false);
    _QAudio.stop();
    setPageAudioPlay(false);
    setCurrentAyah(null);
    fetch(`https://api.alquran.cloud/v1/page/${page}/quran-uthmani`)
      .then(r => r.json())
      .then(data => {
        if (data.code === 200) setAyahs(data.data.ayahs || []);
        else setError(true);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [page]);

  // scroll to highlighted ayah
  useEffect(() => {
    if (currentAyah !== null && ayahRefs.current[currentAyah]) {
      ayahRefs.current[currentAyah].scrollIntoView({ behavior:"smooth", block:"center" });
    }
  }, [currentAyah]);

  const stopPageAudio = () => {
    _QAudio.stop();
    setPageAudioPlay(false);
    setCurrentAyah(null);
  };

  const playFromIndex = (idx, ayahList) => {
    if (!_QAudio.playing || idx >= ayahList.length) {
      _QAudio.playing = false;
      setPageAudioPlay(false); setCurrentAyah(null); return;
    }
    const ayah  = ayahList[idx];
    const num   = ayah.number;
    const recId = reciter || "ar.alafasy";
    const url   = `https://cdn.islamic.network/quran/audio/128/${recId}/${num}.mp3`;
    setCurrentAyah(num);
    _QAudio.play(
      url,
      () => { if (_QAudio.playing) playFromIndex(idx + 1, ayahList); },
      () => { if (_QAudio.playing) playFromIndex(idx + 1, ayahList); }
    );
  };

  const togglePagePlay = () => {
    if (pageAudioPlay) {
      stopPageAudio();
    } else {
      if (externalAudio) { externalAudio.pause(); setExternalAudio(null); setPlaying(false); }
      _QAudio.playing = true;
      setPageAudioPlay(true);
      playFromIndex(0, ayahs);
    }
  };

  if (loading) return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:400 }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:24, marginBottom:8 }}>â³</div>
        <div style={{ fontSize:12, color:"#94a3b8" }}>Loading page {page}...</div>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:400 }}>
      <div style={{ textAlign:"center", color:"#ef4444", fontSize:13 }}>Failed to load page</div>
    </div>
  );

  const surahGroups = [];
  let cur = null;
  ayahs.forEach(a => {
    if (!cur || cur.number !== a.surah.number) {
      cur = { number: a.surah.number, name: a.surah.name, englishName: a.surah.englishName, ayahs: [] };
      surahGroups.push(cur);
    }
    cur.ayahs.push(a);
  });

  return (
    <div>
      {/* Page play button */}
      <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}>
        <button
          onClick={togglePagePlay}
          style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 20px", borderRadius:20, border:"none", background: pageAudioPlay?"#ef4444":"linear-gradient(135deg,#0d9488,#14b8a6)", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 12px rgba(13,148,136,.3)" }}>
          {pageAudioPlay ? "â¹ Stop" : "\u25b6 Play Page"}
        </button>
        {pageAudioPlay && (
          <div style={{ display:"flex", alignItems:"center", gap:3, marginRight:12 }}>
            {[8,14,20,14,8].map((h,i) => (
              <div key={i} style={{ width:3, height:h, borderRadius:2, background:"#0d9488", animation:`wave 0.9s ease-in-out infinite ${(i*0.15).toFixed(2)}s` }} />
            ))}
          </div>
        )}
      </div>
      <style>{"@keyframes wave{0%,100%{transform:scaleY(0.4)}50%{transform:scaleY(1)}}"}</style>

      {/* Page badge */}
      <div style={{ textAlign:"center", marginBottom:12 }}>
        <span style={{ fontSize:11, color:"#94a3b8", background:"#f1f5f9", borderRadius:6, padding:"3px 10px" }}>
          {"\u0635\u0641\u062d\u0629"} {page}
        </span>
      </div>

      {/* Ayahs */}
      <div style={{ direction:"rtl", fontFamily:"'Amiri Quran','Amiri Quran','Scheherazade New',serif" }}>
        {surahGroups.map((surah) => (
          <div key={surah.number} style={{ marginBottom:16 }}>
            {surah.ayahs[0]?.numberInSurah === 1 && (
              <div style={{ textAlign:"center", margin:"8px 0 12px", padding:"10px 20px", background:"linear-gradient(135deg,#0f172a,#134e4a)", borderRadius:10 }}>
                <div style={{ fontSize:20, fontWeight:700, color:"#fff", fontFamily:"'Amiri Quran','Scheherazade New',serif" }}>{surah.name}</div>
                <div style={{ fontSize:11, color:"#5eead4", marginTop:2 }}>{surah.englishName}</div>
                {surah.number !== 1 && surah.number !== 9 && (
                  <div style={{ fontSize:18, color:"#fbbf24", marginTop:6 }}>{"\uFDFD"}</div>
                )}
              </div>
            )}
            <div style={{ lineHeight:2.4, fontSize:22, color:"#1e293b", textAlign:"justify", padding:"0 4px" }}>
              {surah.ayahs.map(a => (
                <span
                  key={a.number}
                  ref={el => ayahRefs.current[a.number] = el}
                  onClick={() => {
                    _QAudio.stop();
                    if (externalAudio) { externalAudio.pause(); setExternalAudio(null); setPlaying(false); }
                    _QAudio.playing = true;
                    setPageAudioPlay(true);
                    playFromIndex(ayahs.findIndex(x => x.number === a.number), ayahs);
                  }}
                  style={{
                    display:"inline",
                    cursor:"pointer",
                    borderRadius:6,
                    padding:"2px 4px",
                    transition:"background .2s",
                    background: currentAyah === a.number ? "#fef9c3" : "transparent",
                    boxShadow: currentAyah === a.number ? "0 0 0 2px #fbbf24" : "none",
                  }}>
                  {(() => { let t = a.text; if (a.numberInSurah===1 && a.surah && a.surah.number!==1 && a.surah.number!==9) { const p=t.split(String.fromCharCode(32)); if(p.length>4) t=p.slice(4).join(String.fromCharCode(32)); } const parts = t.split(/(\u0671\u0644\u0644\u0651\u064e\u0647|\u0627\u0644\u0644\u0651\u064e\u0647|\u0671\u0644\u0644\u0651\u064e\u0647\u064f|\u0627\u0644\u0644\u0651\u064e\u0647\u064f|\u0671\u0644\u0644\u0651\u064e\u0647\u0650|\u0627\u0644\u0644\u0651\u064e\u0647\u0650)/); return parts.map((p,i) => /\u0644\u0644/.test(p) ? <span key={i} style={{color:"#b91c1c",fontWeight:700}}>{p}</span> : p); })()}
                  <span style={{ fontSize:14, color: currentAyah === a.number ? "#d97706":"#0d9488", margin:"0 4px", fontFamily:"serif" }}>
                    &#x06DD;{a.numberInSurah}&#x06DD;
                  </span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const SURAH_START_PAGES = {
  1:1,2:2,3:50,4:77,5:106,6:128,7:151,8:177,9:187,10:208,
  11:221,12:235,13:249,14:255,15:262,16:267,17:282,18:293,
  19:305,20:312,21:322,22:332,23:342,24:350,25:359,26:367,
  27:377,28:385,29:396,30:404,31:411,32:415,33:418,34:428,
  35:434,36:440,37:446,38:453,39:458,40:467,41:477,42:483,
  43:489,44:496,45:499,46:502,47:507,48:511,49:515,50:518,
  51:520,52:523,53:526,54:528,55:531,56:534,57:537,58:542,
  59:545,60:549,61:551,62:553,63:554,64:556,65:558,66:560,
  67:562,68:564,69:566,70:568,71:570,72:572,73:574,74:575,
  75:577,76:578,77:580,78:582,79:583,80:585,81:586,82:587,
  83:587,84:589,85:590,86:591,87:591,88:592,89:593,90:594,
  91:595,92:595,93:596,94:596,95:597,96:597,97:598,98:598,
  99:599,100:599,101:600,102:600,103:601,104:601,105:601,
  106:602,107:602,108:602,109:603,110:603,111:603,112:604,
  113:604,114:604
};

function QuranProgram({ students, classes, quranRecords, setQuranRecords, teacherClassIds, userRole, auth }) {
  const [view, setView] = useState("dashboard"); // dashboard | record | player | student
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filterClass, setFilterClass] = useState("all");
  const [reciter, setReciter] = useState("ar.alafasy");
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [audio, setAudio] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ studentId:"", surahId:1, fromPage:1, toPage:1, level:"good", notes:"", date: new Date().toISOString().split("T")[0] });
  const [hifzRecords, setHifzRecords] = useState(() => { try { return JSON.parse(localStorage.getItem("edu_hifz_records")||"[]"); } catch{return[];} });
  const [hifzView, setHifzView] = useState("list"); // list | add
  const [hifzForm, setHifzForm] = useState({ studentId:"", surahId:1, level:"memorized", notes:"", date: new Date().toISOString().split("T")[0] });
  const [displayPage, setDisplayPage] = useState(1);
  useEffect(() => { setDisplayPage(SURAH_START_PAGES[selectedSurah] || 1); }, [selectedSurah]);

  const visibleClasses = (userRole === "admin" || !teacherClassIds || teacherClassIds.length === 0)
    ? (classes||[]) : (classes||[]).filter(c => (teacherClassIds||[]).includes(c.id));
  const visibleStudents = (students||[]).filter(s => filterClass === "all" || String(s.classId) === String(filterClass));

  const getStudentRecord = (studentId) => (quranRecords||[]).filter(r => r.studentId === studentId).sort((a,b)=>b.date?.localeCompare(a.date||"")||0);
  const getLatestRecord = (studentId) => getStudentRecord(studentId)[0] || null;

  const saveRecord = () => {
    if (!form.studentId) return alert("Please select a student");
    const surah = SURAHS.find(s => s.id === Number(form.surahId));
    const rec = { ...form, id: Date.now(), surahName: surah?.name, surahArabic: surah?.arabic, createdAt: new Date().toISOString() };
    const updated = [...(quranRecords||[]), rec];
    setQuranRecords(updated);
    localStorage.setItem("edu_quran_records", JSON.stringify(updated));
    setView("dashboard");
    setForm({ studentId:"", surahId:1, fromPage:1, toPage:1, level:"good", notes:"", date: new Date().toISOString().split("T")[0] });
  };

  const saveHifz = () => {
    if (!hifzForm.studentId) return alert("Please select a student");
    const surah = SURAHS.find(s => s.id === Number(hifzForm.surahId));
    // Check if already recorded for this student+surah
    const exists = hifzRecords.find(r => String(r.studentId) === String(hifzForm.studentId) && Number(r.surahId) === Number(hifzForm.surahId));
    let updated;
    if (exists) {
      updated = hifzRecords.map(r => String(r.studentId) === String(hifzForm.studentId) && Number(r.surahId) === Number(hifzForm.surahId)
        ? { ...r, level: hifzForm.level, notes: hifzForm.notes, date: hifzForm.date }
        : r);
    } else {
      const rec = { ...hifzForm, id: Date.now(), surahName: surah?.name, surahArabic: surah?.arabic, createdAt: new Date().toISOString() };
      updated = [...hifzRecords, rec];
    }
    setHifzRecords(updated);
    localStorage.setItem("edu_hifz_records", JSON.stringify(updated));
    setHifzView("list");
    setHifzForm({ studentId:"", surahId:1, level:"memorized", notes:"", date: new Date().toISOString().split("T")[0] });
  };

  const deleteHifz = (id) => {
    const updated = hifzRecords.filter(r => r.id !== id);
    setHifzRecords(updated);
    localStorage.setItem("edu_hifz_records", JSON.stringify(updated));
  };

  const getStudentHifz = (studentId) => hifzRecords.filter(r => String(r.studentId) === String(studentId));
  const getHifzProgress = (studentId) => {
    const records = getStudentHifz(studentId);
    const memorized = records.filter(r => r.level === "memorized").length;
    const reviewing = records.filter(r => r.level === "reviewing").length;
    return { memorized, reviewing, total: records.length, percent: Math.round((memorized/114)*100) };
  };

  const playAudio = async (surahId) => {
    if (audio) { audio.pause(); setAudio(null); setPlaying(false); }
    setLoading(true);
    try {
      const url = "https://cdn.islamic.network/quran/audio-surah/128/" + reciter + "/" + surahId + ".mp3";
      const a = new Audio(url);
      a.onended = () => setPlaying(false);
      a.oncanplay = () => setLoading(false);
      a.onerror = () => { setLoading(false); alert("Audio not available for this reciter/surah."); };
      await a.play();
      setAudio(a); setPlaying(true);
    } catch { setLoading(false); }
  };

  const stopAudio = () => { if (audio) { audio.pause(); audio.currentTime = 0; setAudio(null); setPlaying(false); } };

  const S = { border:"#e2e8f0", primary:"#0d9488", text:"#0f172a", sub:"#64748b" };
  const inp = { width:"100%", padding:"9px 12px", border:"1px solid #e2e8f0", borderRadius:8, fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box" };

  // -- Hifz Tracker View
  if (view === "hifz") {
    const HIFZ_LEVELS = [
      { value:"memorized", label:"Memorized", arabic:"محفوظ", color:"#059669", bg:"#d1fae5", icon:"🌟" },
      { value:"reviewing", label:"Reviewing", arabic:"مراجعة", color:"#0284c7", bg:"#dbeafe", icon:"📖" },
      { value:"weak",      label:"Needs Work", arabic:"يحتاج عمل", color:"#dc2626", bg:"#fee2e2", icon:"⚠️" },
    ];

    if (hifzView === "add") return (
      <div style={{ maxWidth:600, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <button onClick={() => setHifzView("list")} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", fontSize:13 }}>← Back</button>
          <div style={{ fontSize:16, fontWeight:800, color:S.text }}>📗 Record Hifz Session</div>
        </div>
        <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:24 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ fontSize:12, fontWeight:600, color:S.sub, display:"block", marginBottom:4 }}>Student *</label>
              <select style={inp} value={hifzForm.studentId} onChange={e=>setHifzForm({...hifzForm,studentId:e.target.value})}>
                <option value="">Select student...</option>
                {visibleStudents.map(s=><option key={s.id} value={s.id}>{s.name} — {(classes.find(c=>c.id===s.classId)||{}).name||""}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:S.sub, display:"block", marginBottom:4 }}>Date</label>
              <input type="date" style={inp} value={hifzForm.date} onChange={e=>setHifzForm({...hifzForm,date:e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:S.sub, display:"block", marginBottom:4 }}>Surah</label>
              <select style={inp} value={hifzForm.surahId} onChange={e=>setHifzForm({...hifzForm,surahId:Number(e.target.value)})}>
                {SURAHS.map(s=><option key={s.id} value={s.id}>{s.id}. {s.name} ({s.arabic})</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:S.sub, display:"block", marginBottom:4 }}>Level</label>
              <select style={inp} value={hifzForm.level} onChange={e=>setHifzForm({...hifzForm,level:e.target.value})}>
                {HIFZ_LEVELS.map(l=><option key={l.value} value={l.value}>{l.icon} {l.label} — {l.arabic}</option>)}
              </select>
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ fontSize:12, fontWeight:600, color:S.sub, display:"block", marginBottom:4 }}>Notes</label>
              <textarea style={{...inp,resize:"vertical"}} rows={3} value={hifzForm.notes} onChange={e=>setHifzForm({...hifzForm,notes:e.target.value})} placeholder="Teacher notes..." />
            </div>
          </div>
          <button onClick={saveHifz} style={{ width:"100%", padding:"13px 0", borderRadius:12, border:"none", background:"linear-gradient(135deg,#0d9488,#14b8a6)", color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            💾 Save Record
          </button>
        </div>
      </div>
    );

    return (
      <div>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div>
            <div style={{ fontSize:20, fontWeight:800, color:S.text }}>📗 Hifz Tracker</div>
            <div style={{ fontSize:13, color:S.sub, marginTop:2 }}>Quran memorization progress</div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => setView("dashboard")} style={{ padding:"9px 18px", borderRadius:9, border:"1px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>← Back</button>
            <button onClick={() => setHifzView("add")} style={{ padding:"9px 18px", borderRadius:9, border:"none", background:"linear-gradient(135deg,#0d9488,#14b8a6)", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>+ Record Session</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
          {[
            { icon:"👥", label:"Total Students", value: visibleStudents.length, dark:true },
            { icon:"🌟", label:"Memorized Surahs", value: hifzRecords.filter(r=>r.level==="memorized").length, color:"#059669" },
            { icon:"📖", label:"Reviewing", value: hifzRecords.filter(r=>r.level==="reviewing").length, color:"#0284c7" },
            { icon:"⚠️", label:"Needs Work", value: hifzRecords.filter(r=>r.level==="weak").length, color:"#dc2626" },
          ].map((s,i)=>(
            <div key={i} style={{ background: s.dark?"linear-gradient(135deg,#0f172a,#1e293b)":"#fff", borderRadius:14, border: s.dark?"none":"1px solid #e2e8f0", padding:"18px 20px" }}>
              <div style={{ fontSize:22, marginBottom:8 }}>{s.icon}</div>
              <div style={{ fontSize:26, fontWeight:800, color: s.dark?"#fff":s.color }}>{s.value}</div>
              <div style={{ fontSize:12, color: s.dark?"rgba(255,255,255,.5)":"#94a3b8", marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{ marginBottom:16 }}>
          <select style={{...inp, width:"auto", minWidth:200}} value={filterClass} onChange={e=>setFilterClass(e.target.value)}>
            <option value="all">All Classes</option>
            {visibleClasses.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Students Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12 }}>
          {visibleStudents.map(student => {
            const progress = getHifzProgress(student.id);
            const records = getStudentHifz(student.id);
            const lastRecord = records.sort((a,b)=>b.date?.localeCompare(a.date||"")||0)[0];
            return (
              <div key={student.id} style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:16 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                  <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#0d9488,#14b8a6)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:14, fontWeight:700, flexShrink:0 }}>
                    {student.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:S.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{student.name}</div>
                    <div style={{ fontSize:11, color:S.sub }}>{progress.memorized} / 114 surahs</div>
                  </div>
                  <button onClick={() => { setHifzForm({...hifzForm, studentId:String(student.id)}); setHifzView("add"); }}
                    style={{ padding:"5px 10px", borderRadius:7, border:"none", background:"#0d9488", color:"#fff", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>+ Add</button>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:S.sub, marginBottom:4 }}>
                    <span>Progress</span>
                    <span>{progress.percent}%</span>
                  </div>
                  <div style={{ height:6, background:"#e2e8f0", borderRadius:3, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:progress.percent+"%", background:"linear-gradient(90deg,#0d9488,#14b8a6)", borderRadius:3, transition:"width .3s" }} />
                  </div>
                </div>

                {/* Level badges */}
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
                  {HIFZ_LEVELS.map(l => {
                    const count = records.filter(r=>r.level===l.value).length;
                    if (!count) return null;
                    return <span key={l.value} style={{ background:l.bg, color:l.color, borderRadius:6, padding:"2px 8px", fontSize:10, fontWeight:700 }}>{l.icon} {count} {l.label}</span>;
                  })}
                </div>

                {/* Last session */}
                {lastRecord && (
                  <div style={{ fontSize:11, color:S.sub, borderTop:"1px solid #f1f5f9", paddingTop:8 }}>
                    Last: <span style={{ fontFamily:"serif", color:S.text }}>{lastRecord.surahArabic}</span> · {lastRecord.date}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // -- Player View -------------------------------------------------------------
  useEffect(() => { setDisplayPage(SURAH_START_PAGES[selectedSurah] || 1); }, [selectedSurah]);

  if (view === "player") return (
    <div className="quran-player-grid" style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:16 }}>
      <style>{`
        @media (max-width: 768px) {
          .quran-player-grid { grid-template-columns: 1fr !important; }
          .quran-player-right { order: -1; }
          .quran-dark-card { display: none !important; }
        }
      `}</style>

      {/* Quran Page Viewer */}
      <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", overflow:"hidden" }}>
        <div style={{ padding:"12px 16px", borderBottom:"1px solid #e2e8f0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:S.text }}>
              {"\u0635\u0641\u062d\u0629 \u0627\u0644\u0645\u0635\u062d\u0641"}
            </div>
            <div style={{ fontSize:11, color:S.sub }}>
              {"\u062a\u062a\u0632\u0627\u0645\u0646 \u0645\u0639 \u0627\u0644\u0633\u0648\u0631\u0629 \u0627\u0644\u0645\u062e\u062a\u0627\u0631\u0629"}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <button onClick={() => setDisplayPage(p => Math.max(1, p - 1))}
              style={{ width:30, height:30, borderRadius:8, border:"1px solid #e2e8f0", background:"#f8fafc", cursor:"pointer", fontSize:16 }}>
              {"\u203a"}
            </button>
            <span style={{ fontSize:12, fontWeight:600, color:S.text, minWidth:72, textAlign:"center" }}>
              {"\u0635\u0641\u062d\u0629 "}{displayPage}
            </span>
            <button onClick={() => setDisplayPage(p => Math.min(604, p + 1))}
              style={{ width:30, height:30, borderRadius:8, border:"1px solid #e2e8f0", background:"#f8fafc", cursor:"pointer", fontSize:16 }}>
              {"\u2039"}
            </button>
          </div>
        </div>
        <div style={{ minHeight:520, background:"#fdfdf8", overflowY:"auto", padding:"16px 20px" }}>
          <QuranPageText page={displayPage} reciter={reciter} playing={playing} setPlaying={setPlaying} externalAudio={audio} setExternalAudio={setAudio} />
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <button onClick={() => { stopAudio(); setView("dashboard"); }}
          style={{ padding:"8px 14px", borderRadius:8, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>
          {"\u2190"} Back
        </button>

        {/* Reciter */}
        <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:14 }}>
          <div style={{ fontSize:11, fontWeight:700, color:S.sub, marginBottom:10 }}>
            {"\u0627\u0644\u0642\u0627\u0631\u0626"}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
            {RECITERS.map(r => (
              <button key={r.id} onClick={() => { setReciter(r.id); stopAudio(); }}
                style={{ padding:"8px 10px", borderRadius:10, border:"2px solid "+(reciter===r.id?"#0d9488":"#e2e8f0"), background:reciter===r.id?"#f0fdf9":"#fff", cursor:"pointer", textAlign:"right", fontFamily:"inherit" }}>
                <div style={{ fontSize:11, fontWeight:700, color:reciter===r.id?"#0d9488":S.text }}>{r.arabic}</div>
                <div style={{ fontSize:10, color:S.sub, marginTop:2 }}>{r.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Surah */}
        <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:14 }}>
          <div style={{ fontSize:11, fontWeight:700, color:S.sub, marginBottom:10 }}>
            {"\u0627\u0644\u0633\u0648\u0631\u0629"}
          </div>
          <select style={inp} value={selectedSurah} onChange={e => { setSelectedSurah(Number(e.target.value)); stopAudio(); }}>
            {SURAHS.map(s => <option key={s.id} value={s.id}>{s.id}. {s.name} - {s.arabic}</option>)}
          </select>
        </div>

        {/* Player */}
        <div className="quran-dark-card" style={{ background:"#0f172a", borderRadius:14, padding:22, textAlign:"center" }}>
          <div style={{ fontSize:26, fontWeight:800, color:"#fff", fontFamily:"'Amiri Quran','Amiri Quran','Scheherazade New',serif", marginBottom:4, lineHeight:1.4 }}>
            {SURAHS.find(s=>s.id===selectedSurah)?.arabic}
          </div>
          <div style={{ fontSize:13, fontWeight:600, color:"#5eead4", marginBottom:2 }}>
            {SURAHS.find(s=>s.id===selectedSurah)?.name}
          </div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", marginBottom:20 }}>
            {SURAHS.find(s=>s.id===selectedSurah)?.verses} {"\u0622\u064a\u0629"} &middot; {RECITERS.find(r=>r.id===reciter)?.arabic}
          </div>
          <button
            onClick={playing ? stopAudio : () => playAudio(selectedSurah)}
            disabled={loading}
            style={{ width:56, height:56, borderRadius:"50%", border:"none", background:playing?"#ef4444":"#0d9488", color:"#fff", fontSize:22, cursor:"pointer", display:"inline-flex", alignItems:"center", justifyContent:"center", opacity:loading?0.6:1 }}>
            {loading ? "\u23f3" : playing ? "\u23f9" : "\u25b6"}
          </button>
          {playing && (
            <div style={{ marginTop:14, display:"flex", justifyContent:"center", gap:3, height:20, alignItems:"center" }}>
              {[8,14,20,14,8].map((h,i) => (
                <div key={i} style={{ width:3, height:h, borderRadius:2, background:"#5eead4",
                  animation:`wave 0.9s ease-in-out infinite ${(i*0.15).toFixed(2)}s` }} />
              ))}
            </div>
          )}
          <style>{"@keyframes wave{0%,100%{transform:scaleY(0.4)}50%{transform:scaleY(1)}}"}</style>
        </div>

      </div>
    </div>
  );

  // ── Student Detail View ───────────────────────────────────────────────────
  if (view === "student" && selectedStudent) {
    const student = students.find(s=>s.id===selectedStudent);
    const records = getStudentRecord(selectedStudent);
    const cls = classes.find(c=>c.id===student?.classId);
    return (
      <div style={{ maxWidth:700, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <button onClick={() => setView("dashboard")} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", fontSize:13 }}>← Back</button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:18, fontWeight:800, color:S.text, fontFamily:"'Plus Jakarta Sans',system-ui" }}>{student?.name}</div>
            <div style={{ fontSize:12, color:S.sub }}>{cls?.name} · {records.length} session{records.length!==1?"s":""}</div>
          </div>
          <button onClick={() => { setForm({...form, studentId:String(selectedStudent)}); setView("record"); }} style={{ padding:"9px 18px", borderRadius:9, border:"none", background:"#0d9488", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>+ Add Session</button>
        </div>

        {records.length === 0 ? (
          <div style={{ textAlign:"center", padding:60, background:"#fff", borderRadius:14, border:"1px solid #e2e8f0" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📖</div>
            <div style={{ fontSize:15, color:S.sub }}>No memorization sessions recorded yet</div>
          </div>
        ) : records.map(r => {
          const level = MEMORIZATION_LEVELS.find(l=>l.value===r.level) || MEMORIZATION_LEVELS[1];
          const surah = SURAHS.find(s=>s.id===Number(r.surahId));
          return (
            <div key={r.id} style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", padding:"16px 20px", marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:18, fontWeight:700, color:"#1e293b", fontFamily:"'Amiri Quran','Amiri Quran','Scheherazade New',serif" }}>{surah?.arabic || r.surahArabic}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:S.text }}>{surah?.name || r.surahName}</div>
                  <div style={{ fontSize:12, color:S.sub, marginTop:4 }}>Pages {r.fromPage} – {r.toPage} · {r.date}</div>
                  {r.notes && <div style={{ fontSize:12, color:S.sub, marginTop:6, fontStyle:"italic" }}>"{r.notes}"</div>}
                </div>
                <div style={{ background:level.bg, color:level.color, borderRadius:10, padding:"6px 14px", fontSize:13, fontWeight:700, flexShrink:0 }}>
                  {level.icon} {level.label}
                </div>
              </div>
              <div style={{ marginTop:10, background:"#f0fdf9", borderRadius:8, padding:"6px 12px", display:"inline-flex", alignItems:"center", gap:8, cursor:"pointer" }} onClick={() => { setSelectedSurah(Number(r.surahId)); setView("player"); }}>
                <span style={{ fontSize:14 }}>🎧</span>
                <span style={{ fontSize:12, color:"#0d9488", fontWeight:600 }}>Listen to {surah?.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <div style={{ fontSize:20, fontWeight:800, color:S.text, fontFamily:"'Plus Jakarta Sans',system-ui" }}>🕌 Quran Program</div>
          <div style={{ fontSize:13, color:S.sub, marginTop:2 }}>Memorization tracking & recitation</div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={() => setView("player")} style={{ padding:"9px 18px", borderRadius:9, border:"1px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:6 }}>🎧 Quran Player</button>
          <button onClick={() => setView("hifz")} style={{ padding:"9px 18px", borderRadius:9, border:"1px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:6 }}>📗 Hifz Tracker</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        {[
          { icon:"👥", label:"Total Students", value: visibleStudents.length, color:"#0f172a", dark:true },
          { icon:"📖", label:"Total Sessions", value: (quranRecords||[]).length, color:"#0d9488" },
          { icon:"🌟", label:"Excellent", value: (quranRecords||[]).filter(r=>r.level==="excellent").length, color:"#059669" },
          { icon:"⚠️", label:"Need Support", value: (quranRecords||[]).filter(r=>r.level==="weak").length, color:"#dc2626" },
        ].map((s,i)=>(
          <div key={i} style={{ background: s.dark?"linear-gradient(135deg,#0f172a,#1e293b)":"#fff", borderRadius:14, border: s.dark?"none":"1px solid #e2e8f0", padding:"18px 20px", boxShadow: s.dark?"0 4px 16px rgba(0,0,0,.15)":"none" }}>
            <div style={{ fontSize:22, marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontSize:26, fontWeight:800, color: s.dark?"#fff":s.color, fontFamily:"'Plus Jakarta Sans',system-ui" }}>{s.value}</div>
            <div style={{ fontSize:12, color: s.dark?"rgba(255,255,255,.5)":"#94a3b8", marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ marginBottom:16 }}>
        <select style={{...inp, width:"auto", minWidth:200}} value={filterClass} onChange={e=>setFilterClass(e.target.value)}>
          <option value="all">All Classes</option>
          {visibleClasses.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Students Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
        {visibleStudents.map(student => {
          const latest = getLatestRecord(student.id);
          const sessions = getStudentRecord(student.id);
          const level = latest ? MEMORIZATION_LEVELS.find(l=>l.value===latest.level) : null;
          const surah = latest ? SURAHS.find(s=>s.id===Number(latest.surahId)) : null;
          return (
            <div key={student.id} onClick={() => { setSelectedStudent(student.id); setView("student"); }} style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:16, cursor:"pointer", transition:"all .15s" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,.08)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#0d9488,#14b8a6)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:14, fontWeight:700, flexShrink:0 }}>
                  {student.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:S.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{student.name}</div>
                  <div style={{ fontSize:10, color:S.sub }}>{sessions.length} session{sessions.length!==1?"s":""}</div>
                </div>
              </div>
              {latest ? (
                <div>
                  <div style={{ fontSize:16, fontWeight:700, color:"#1e293b", fontFamily:"'Amiri Quran','Amiri Quran','Scheherazade New',serif", marginBottom:2 }}>{surah?.arabic}</div>
                  <div style={{ fontSize:11, color:S.sub, marginBottom:8 }}>Pages {latest.fromPage}–{latest.toPage} · {latest.date}</div>
                  <div style={{ background:level?.bg, color:level?.color, borderRadius:8, padding:"4px 10px", fontSize:11, fontWeight:700, display:"inline-block" }}>
                    {level?.icon} {level?.label}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign:"center", padding:"12px 0", color:"#cbd5e1", fontSize:12 }}>No sessions yet</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── TeacherEvaluations ───────────────────────────────────────────────────────
const EVAL_SECTIONS = [
  {
    id: "planning", title: "Planning and Preparation", icon: "📋", color: "#3b82f6",
    criteria: [
      "Clarity of educational objectives and measurability",
      "Variety in activities and teaching strategies",
      "Consideration of individual differences among students",
      "Quality of preparation of educational materials and aids",
    ]
  },
  {
    id: "implementation", title: "Lesson Implementation", icon: "🎯", color: "#0d9488",
    criteria: [
      "Clarity of presentation and logical sequence of ideas",
      "Effective use of technology and educational aids",
      "Student engagement and active participation",
      "Efficient time management",
      "Use of active learning strategies",
    ]
  },
  {
    id: "management", title: "Classroom Management", icon: "🏫", color: "#7c3aed",
    criteria: [
      "Maintaining order and classroom discipline",
      "Creating a positive and motivating learning environment",
      "Handling behaviors with wisdom and fairness",
    ]
  },
  {
    id: "assessment", title: "Assessment and Feedback", icon: "📊", color: "#f59e0b",
    criteria: [
      "Variety of assessment methods (diagnostic, formative, summative)",
      "Providing constructive and immediate feedback",
      "Measuring achievement of educational objectives",
    ]
  },
  {
    id: "professional", title: "Personal and Professional Qualities", icon: "⭐", color: "#ec4899",
    criteria: [
      "Professional appearance and punctuality",
      "Communication skills with students and colleagues",
      "Commitment to professional development",
    ]
  },
];

const LEVELS = [
  { value: 4, label: "Excellent", color: "#059669", bg: "#d1fae5" },
  { value: 3, label: "Very Good", color: "#0284c7", bg: "#dbeafe" },
  { value: 2, label: "Good",      color: "#d97706", bg: "#fef3c7" },
  { value: 1, label: "Needs Improvement", color: "#dc2626", bg: "#fee2e2" },
];

function getPerformanceLevel(pct) {
  if (pct >= 90) return { label: "Excellent", color: "#059669", bg: "#d1fae5" };
  if (pct >= 75) return { label: "Very Good", color: "#0284c7", bg: "#dbeafe" };
  if (pct >= 60) return { label: "Good",      color: "#d97706", bg: "#fef3c7" };
  return { label: "Needs Improvement", color: "#dc2626", bg: "#fee2e2" };
}

function TeacherEvaluations({ teachers, evaluations, setEvaluations, userRole, auth }) {
  const [view, setView] = useState("list"); // list | create | detail
  const [selected, setSelected] = useState(null);
  const [filterTeacher, setFilterTeacher] = useState("all");
  const emptyScores = {};
  EVAL_SECTIONS.forEach(s => s.criteria.forEach((_, i) => { emptyScores[s.id + "_" + i] = null; }));
  const [form, setForm] = useState({
    teacherId: "", visitDate: new Date().toISOString().split("T")[0],
    visitType: "Classroom Visit", lessonTopic: "", evaluatorName: auth?.name || "",
    studentCount: "", scores: {...emptyScores}, observations: "", strengths: "", improvements: ""
  });

  const isAdmin = userRole === "admin";

  const calcSectionScore = (scores, sectionId, count) => {
    let total = 0, filled = 0;
    for (let i = 0; i < count; i++) {
      const v = scores[sectionId + "_" + i];
      if (v !== null && v !== undefined) { total += Number(v); filled++; }
    }
    return filled === count ? { score: total, max: count * 4, pct: Math.round((total/(count*4))*100) } : null;
  };

  const calcTotal = (scores) => {
    let total = 0, max = 0;
    EVAL_SECTIONS.forEach(s => {
      s.criteria.forEach((_, i) => {
        const v = scores[s.id + "_" + i];
        if (v !== null && v !== undefined) { total += Number(v); max += 4; }
      });
    });
    return max > 0 ? { score: total, max, pct: Math.round((total/max)*100) } : null;
  };

  const saveEval = () => {
    const teacher = teachers.find(t => t.id === parseInt(form.teacherId));
    if (!teacher) return alert("Please select a teacher");
    const totalMax = EVAL_SECTIONS.reduce((s, sec) => s + sec.criteria.length * 4, 0);
    let totalScore = 0;
    Object.values(form.scores).forEach(v => { if (v !== null) totalScore += Number(v); });
    const pct = Math.round((totalScore / totalMax) * 100);
    const eval_ = { ...form, id: Date.now(), teacherName: teacher.name, totalScore, totalMax, pct, createdAt: new Date().toISOString() };
    const updated = [...(evaluations||[]), eval_];
    setEvaluations(updated);
    localStorage.setItem("edu_evaluations", JSON.stringify(updated));
    setView("list"); setForm({ teacherId:"", visitDate: new Date().toISOString().split("T")[0], visitType:"Classroom Visit", lessonTopic:"", evaluatorName: auth?.name||"", studentCount:"", scores:{...emptyScores}, observations:"", strengths:"", improvements:"" });
  };

  const deleteEval = (id) => {
    const updated = (evaluations||[]).filter(e => e.id !== id);
    setEvaluations(updated); localStorage.setItem("edu_evaluations", JSON.stringify(updated));
    setView("list");
  };

  const S = { border:"#e2e8f0", primary:"#0d9488", text:"#0f172a", sub:"#64748b" };
  const inp = { width:"100%", padding:"9px 12px", border:"1px solid #e2e8f0", borderRadius:8, fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box" };

  // ── Detail View ───────────────────────────────────────────────────────────
  if (view === "detail" && selected) {
    const ev = (evaluations||[]).find(e => e.id === selected);
    if (!ev) { setView("list"); return null; }
    const perf = getPerformanceLevel(ev.pct);
    return (
      <div style={{ maxWidth:780, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <button onClick={() => setView("list")} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", fontSize:13 }}>← Back</button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:18, fontWeight:800, color:S.text, fontFamily:"'Plus Jakarta Sans',system-ui" }}>Teacher Evaluation Report</div>
            <div style={{ fontSize:12, color:S.sub }}>{ev.teacherName} · {ev.visitDate} · {ev.visitType}</div>
          </div>
          {isAdmin && <button onClick={() => deleteEval(ev.id)} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid #fca5a5", background:"#fee2e2", color:"#dc2626", fontSize:12, cursor:"pointer" }}>🗑️ Delete</button>}
        </div>

        {/* Score Banner */}
        <div style={{ background:"linear-gradient(135deg,#0f172a,#134e4a)", borderRadius:16, padding:24, marginBottom:20, color:"#fff", display:"flex", alignItems:"center", gap:20 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.5)", fontWeight:600, letterSpacing:1, marginBottom:4 }}>OVERALL PERFORMANCE</div>
            <div style={{ fontSize:20, fontWeight:800, fontFamily:"'Plus Jakarta Sans',system-ui" }}>{ev.teacherName}</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,.5)", marginTop:2 }}>{ev.visitType} · {ev.lessonTopic || "—"} · {ev.studentCount ? ev.studentCount + " students" : ""}</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,.4)", marginTop:4 }}>Evaluated by: {ev.evaluatorName}</div>
          </div>
          <div style={{ textAlign:"center", background:"rgba(255,255,255,.08)", borderRadius:14, padding:"16px 24px" }}>
            <div style={{ fontSize:42, fontWeight:800, color:"#5eead4", fontFamily:"'Plus Jakarta Sans',system-ui", lineHeight:1 }}>{ev.pct}%</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.5)", marginTop:4 }}>{ev.totalScore}/{ev.totalMax} pts</div>
          </div>
          <div style={{ background:perf.bg, color:perf.color, borderRadius:12, padding:"10px 20px", fontSize:14, fontWeight:800, textAlign:"center" }}>
            {perf.label}
          </div>
        </div>

        {/* Section Scores */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:20 }}>
          {EVAL_SECTIONS.map(sec => {
            const result = calcSectionScore(ev.scores, sec.id, sec.criteria.length);
            const perf2 = result ? getPerformanceLevel(result.pct) : null;
            return (
              <div key={sec.id} style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", padding:14, textAlign:"center" }}>
                <div style={{ fontSize:20, marginBottom:6 }}>{sec.icon}</div>
                <div style={{ fontSize:11, fontWeight:700, color:S.text, marginBottom:4 }}>{sec.title.split(" ").slice(0,2).join(" ")}</div>
                {result ? (
                  <>
                    <div style={{ fontSize:20, fontWeight:800, color:perf2?.color }}>{result.pct}%</div>
                    <div style={{ fontSize:10, color:S.sub }}>{result.score}/{result.max}</div>
                  </>
                ) : <div style={{ fontSize:12, color:"#94a3b8" }}>—</div>}
              </div>
            );
          })}
        </div>

        {/* Detailed Scores */}
        {EVAL_SECTIONS.map(sec => (
          <div key={sec.id} style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", overflow:"hidden", marginBottom:14 }}>
            <div style={{ padding:"12px 18px", background:sec.color, display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:18 }}>{sec.icon}</span>
              <span style={{ fontSize:14, fontWeight:700, color:"#fff" }}>{sec.title}</span>
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"#f8fafc" }}>
                  <th style={{ padding:"10px 16px", textAlign:"left", fontSize:12, color:S.sub, fontWeight:600, borderBottom:"1px solid #e2e8f0", width:"55%" }}>Indicator</th>
                  {LEVELS.map(l => <th key={l.value} style={{ padding:"10px 8px", fontSize:11, color:S.sub, fontWeight:600, borderBottom:"1px solid #e2e8f0", textAlign:"center" }}>{l.label}<br/>({l.value})</th>)}
                </tr>
              </thead>
              <tbody>
                {sec.criteria.map((cr, i) => {
                  const val = ev.scores[sec.id + "_" + i];
                  return (
                    <tr key={i} style={{ borderBottom:"1px solid #f1f5f9" }}>
                      <td style={{ padding:"10px 16px", fontSize:13, color:S.text }}>{cr}</td>
                      {LEVELS.map(l => (
                        <td key={l.value} style={{ textAlign:"center", padding:"10px 8px" }}>
                          {Number(val) === l.value
                            ? <div style={{ width:24, height:24, borderRadius:"50%", background:l.bg, border:"2px solid "+l.color, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"center" }}>
                                <div style={{ width:10, height:10, borderRadius:"50%", background:l.color }} />
                              </div>
                            : <div style={{ width:24, height:24, borderRadius:"50%", background:"#f1f5f9", margin:"0 auto" }} />
                          }
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}

        {/* Observations */}
        {(ev.observations || ev.strengths || ev.improvements) && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
            {ev.strengths && (
              <div style={{ background:"#f0fdf4", borderRadius:12, border:"1px solid #bbf7d0", padding:16 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#166534", marginBottom:8 }}>✨ Strengths</div>
                <p style={{ fontSize:13, color:"#166534", margin:0, lineHeight:1.6 }}>{ev.strengths}</p>
              </div>
            )}
            {ev.improvements && (
              <div style={{ background:"#eff6ff", borderRadius:12, border:"1px solid #bfdbfe", padding:16 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#1d4ed8", marginBottom:8 }}>📈 Areas for Improvement</div>
                <p style={{ fontSize:13, color:"#1d4ed8", margin:0, lineHeight:1.6 }}>{ev.improvements}</p>
              </div>
            )}
            {ev.observations && (
              <div style={{ gridColumn:"1/-1", background:"#fffbeb", borderRadius:12, border:"1px solid #fde68a", padding:16 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#854d0e", marginBottom:8 }}>💬 Observations & Recommendations</div>
                <p style={{ fontSize:13, color:"#78350f", margin:0, lineHeight:1.6 }}>{ev.observations}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── Create View ───────────────────────────────────────────────────────────
  if (view === "create") return (
    <div style={{ maxWidth:740, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <button onClick={() => setView("list")} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid #e2e8f0", background:"#fff", cursor:"pointer", fontSize:13 }}>← Back</button>
        <div style={{ fontSize:16, fontWeight:800, color:S.text, fontFamily:"'Plus Jakarta Sans',system-ui" }}>⭐ New Teacher Evaluation</div>
      </div>

      {/* Basic Info */}
      <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", padding:24, marginBottom:16 }}>
        <div style={{ fontSize:13, fontWeight:700, color:S.text, marginBottom:16 }}>📋 Evaluation Information</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:S.sub, display:"block", marginBottom:4 }}>Teacher *</label>
            <select style={inp} value={form.teacherId} onChange={e=>setForm({...form,teacherId:e.target.value})}>
              <option value="">Select teacher...</option>
              {(teachers||[]).map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:S.sub, display:"block", marginBottom:4 }}>Visit Date</label>
            <input type="date" style={inp} value={form.visitDate} onChange={e=>setForm({...form,visitDate:e.target.value})} />
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:S.sub, display:"block", marginBottom:4 }}>Visit Type</label>
            <select style={inp} value={form.visitType} onChange={e=>setForm({...form,visitType:e.target.value})}>
              {["Classroom Visit","Follow-up","Final Evaluation"].map(v=><option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:S.sub, display:"block", marginBottom:4 }}>Evaluator Name</label>
            <input style={inp} value={form.evaluatorName} onChange={e=>setForm({...form,evaluatorName:e.target.value})} placeholder="Evaluator name..." />
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:S.sub, display:"block", marginBottom:4 }}>Number of Students</label>
            <input style={inp} type="number" value={form.studentCount} onChange={e=>setForm({...form,studentCount:e.target.value})} placeholder="0" />
          </div>
          <div style={{ gridColumn:"1/-1" }}>
            <label style={{ fontSize:12, fontWeight:600, color:S.sub, display:"block", marginBottom:4 }}>Lesson Topic</label>
            <input style={inp} value={form.lessonTopic} onChange={e=>setForm({...form,lessonTopic:e.target.value})} placeholder="Enter lesson topic..." />
          </div>
        </div>
      </div>

      {/* Evaluation Sections */}
      {EVAL_SECTIONS.map(sec => (
        <div key={sec.id} style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", overflow:"hidden", marginBottom:16 }}>
          <div style={{ padding:"14px 20px", background:sec.color, display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:20 }}>{sec.icon}</span>
            <span style={{ fontSize:14, fontWeight:700, color:"#fff" }}>{sec.title}</span>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#f8fafc" }}>
                <th style={{ padding:"10px 16px", textAlign:"left", fontSize:12, color:S.sub, fontWeight:600, borderBottom:"1px solid #e2e8f0" }}>Indicator</th>
                {LEVELS.map(l => (
                  <th key={l.value} style={{ padding:"10px 8px", fontSize:11, color:S.sub, fontWeight:600, borderBottom:"1px solid #e2e8f0", textAlign:"center", width:90 }}>
                    <div style={{ background:l.bg, color:l.color, borderRadius:6, padding:"3px 6px" }}>{l.label}<br/>({l.value})</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sec.criteria.map((cr, i) => {
                const key = sec.id + "_" + i;
                const val = form.scores[key];
                return (
                  <tr key={i} style={{ borderBottom:"1px solid #f1f5f9", background: val ? "#fafffe" : "#fff" }}>
                    <td style={{ padding:"12px 16px", fontSize:13, color:S.text }}>{cr}</td>
                    {LEVELS.map(l => (
                      <td key={l.value} style={{ textAlign:"center", padding:"12px 8px" }}>
                        <button onClick={() => setForm(f => ({...f, scores:{...f.scores, [key]:l.value}}))} style={{
                          width:32, height:32, borderRadius:"50%", border:"2px solid " + (Number(val)===l.value ? l.color : "#e2e8f0"),
                          background: Number(val)===l.value ? l.bg : "#fff",
                          cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto",
                        }}>
                          {Number(val)===l.value && <div style={{ width:12, height:12, borderRadius:"50%", background:l.color }} />}
                        </button>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}

      {/* Observations */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
        <div style={{ background:"#f0fdf4", borderRadius:14, border:"1px solid #bbf7d0", padding:20 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#166534", marginBottom:10 }}>✨ Strengths</div>
          <textarea style={{...inp,resize:"vertical",background:"transparent",border:"1px solid #86efac"}} rows={3} value={form.strengths} onChange={e=>setForm({...form,strengths:e.target.value})} placeholder="Teacher's strengths..." />
        </div>
        <div style={{ background:"#eff6ff", borderRadius:14, border:"1px solid #bfdbfe", padding:20 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#1d4ed8", marginBottom:10 }}>📈 Areas for Improvement</div>
          <textarea style={{...inp,resize:"vertical",background:"transparent",border:"1px solid #93c5fd"}} rows={3} value={form.improvements} onChange={e=>setForm({...form,improvements:e.target.value})} placeholder="Areas that need development..." />
        </div>
        <div style={{ gridColumn:"1/-1", background:"#fffbeb", borderRadius:14, border:"1px solid #fde68a", padding:20 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#854d0e", marginBottom:10 }}>💬 Observations & Recommendations</div>
          <textarea style={{...inp,resize:"vertical",background:"transparent",border:"1px solid #fcd34d"}} rows={3} value={form.observations} onChange={e=>setForm({...form,observations:e.target.value})} placeholder="General observations and recommendations..." />
        </div>
      </div>

      <button onClick={saveEval} style={{ width:"100%", padding:"14px 0", borderRadius:12, border:"none", background:"linear-gradient(135deg,#0d9488,#14b8a6)", color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 16px rgba(13,148,136,.3)" }}>
        💾 Save Evaluation
      </button>
    </div>
  );

  // ── List View ─────────────────────────────────────────────────────────────
  const filtered = filterTeacher === "all" ? (evaluations||[]) : (evaluations||[]).filter(e=>String(e.teacherId)===String(filterTeacher));
  const sorted = [...filtered].sort((a,b)=>b.createdAt?.localeCompare(a.createdAt||"")||0);

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <div style={{ fontSize:20, fontWeight:800, color:S.text, fontFamily:"'Plus Jakarta Sans',system-ui" }}>⭐ Teacher Evaluations</div>
          <div style={{ fontSize:13, color:S.sub, marginTop:2 }}>Performance evaluation records</div>
        </div>
        {isAdmin && <button onClick={() => setView("create")} style={{ padding:"10px 20px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#0d9488,#14b8a6)", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 12px rgba(13,148,136,.3)" }}>+ New Evaluation</button>}
      </div>

      {/* Filters */}
      <div style={{ marginBottom:16 }}>
        <select style={{...inp, width:"auto", minWidth:200}} value={filterTeacher} onChange={e=>setFilterTeacher(e.target.value)}>
          <option value="all">All Teachers</option>
          {(teachers||[]).map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {/* Summary Cards */}
      {(teachers||[]).length > 0 && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
          {(teachers||[]).slice(0,4).map(t => {
            const tEvals = (evaluations||[]).filter(e=>String(e.teacherId)===String(t.id));
            const avgPct = tEvals.length ? Math.round(tEvals.reduce((s,e)=>s+e.pct,0)/tEvals.length) : null;
            const perf = avgPct !== null ? getPerformanceLevel(avgPct) : null;
            return (
              <div key={t.id} style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", padding:16, cursor:"pointer" }} onClick={() => setFilterTeacher(String(t.id))}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#0d9488,#14b8a6)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:13, fontWeight:700 }}>
                    {t.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:S.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.name}</div>
                    <div style={{ fontSize:10, color:S.sub }}>{tEvals.length} evaluation{tEvals.length!==1?"s":""}</div>
                  </div>
                </div>
                {avgPct !== null ? (
                  <div style={{ background:perf.bg, borderRadius:8, padding:"6px 10px", textAlign:"center" }}>
                    <div style={{ fontSize:18, fontWeight:800, color:perf.color }}>{avgPct}%</div>
                    <div style={{ fontSize:10, color:perf.color }}>{perf.label}</div>
                  </div>
                ) : <div style={{ fontSize:12, color:"#94a3b8", textAlign:"center", padding:"8px" }}>No evaluations yet</div>}
              </div>
            );
          })}
        </div>
      )}

      {/* Evaluations List */}
      {sorted.length === 0 ? (
        <div style={{ textAlign:"center", padding:60, background:"#fff", borderRadius:14, border:"1px solid #e2e8f0" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>⭐</div>
          <div style={{ fontSize:15, fontWeight:700, color:S.text }}>No evaluations yet</div>
          {isAdmin && <div style={{ fontSize:13, color:S.sub, marginTop:4 }}>Click "New Evaluation" to start</div>}
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {sorted.map(ev => {
            const perf = getPerformanceLevel(ev.pct);
            return (
              <div key={ev.id} onClick={() => { setSelected(ev.id); setView("detail"); }} style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e8f0", padding:"16px 20px", cursor:"pointer", display:"flex", alignItems:"center", gap:16 }}
                onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
                onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                <div style={{ width:44, height:44, borderRadius:12, background:"linear-gradient(135deg,#0d9488,#14b8a6)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:16, fontWeight:700, flexShrink:0 }}>
                  {ev.teacherName?.split(" ").map(w=>w[0]).join("").slice(0,2)}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:S.text }}>{ev.teacherName}</div>
                  <div style={{ fontSize:12, color:S.sub, marginTop:2 }}>{ev.visitType} · {ev.visitDate} {ev.lessonTopic?"· "+ev.lessonTopic:""}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:22, fontWeight:800, color:perf.color }}>{ev.pct}%</div>
                    <div style={{ fontSize:11, color:S.sub }}>{ev.totalScore}/{ev.totalMax} pts</div>
                  </div>
                  <div style={{ background:perf.bg, color:perf.color, borderRadius:8, padding:"4px 12px", fontSize:12, fontWeight:700, flexShrink:0 }}>{perf.label}</div>
                </div>
                <span style={{ fontSize:16, color:"#94a3b8" }}>›</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Settings ────────────────────────────────────────────────────────────────
function Settings({ teachers, setTeachers, students, setStudents, classes, subjects, setSubjects }) {
  const [parentEditId, setParentEditId] = useState(null);
  const [parentForm, setParentForm] = useState({ username: "", password: "" });
  const S = { primary: "#0d9488", border: "#e2e8f0", textMain: "#1e293b", textSub: "#64748b", textMuted: "#94a3b8", danger: "#ef4444", dangerBg: "#fee2e2" };
  const [tab, setTab] = useState("school");
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ username: "", password: "" });
  const [saved, setSaved] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("edu_theme") || "light");
  const [schoolForm, setSchoolForm] = useState(() => {
    try {
      const info = JSON.parse(localStorage.getItem("edu_school_info") || "{}");
      const savedLogo = localStorage.getItem("edu_logo") || null;
      return { name: info.name || "Al-Huffath Academy", sub: info.sub || "Ilm | Iman | Hifz", email: info.email || "admin@al-huffath.edu", year: info.year || "2024/2025", adminPassword: "", logoPreview: savedLogo };
    } catch { return { name: "Al-Huffath Academy", sub: "Ilm | Iman | Hifz", email: "admin@al-huffath.edu", year: "2024/2025", adminPassword: "", logoPreview: null }; }
  });

  const showSaved = (msg) => { setSaved(msg); setTimeout(() => setSaved(null), 3000); };

  const saveSchoolInfo = () => {
    const info = { name: schoolForm.name, sub: schoolForm.sub, email: schoolForm.email, year: schoolForm.year };
    localStorage.setItem("edu_school_info", JSON.stringify(info));
    if (schoolForm.adminPassword) localStorage.setItem("edu_admin_password", schoolForm.adminPassword);
    showSaved("School settings saved!");
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showSaved("ERROR: Image must be under 2MB!"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      localStorage.setItem("edu_logo", ev.target.result);
      setSchoolForm(f => ({ ...f, logoPreview: ev.target.result }));
      showSaved("Logo updated! Refresh to see changes.");
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    localStorage.removeItem("edu_logo");
    setSchoolForm(f => ({ ...f, logoPreview: null }));
    showSaved("Logo removed. Using default.");
  };

  const saveTheme = (t) => { setTheme(t); localStorage.setItem("edu_theme", t); showSaved("Theme updated!"); };

  const openEdit = (person) => { setEditId(person.id); setForm({ username: person.username || "", password: person.password || "" }); };

  const saveTeacher = () => {
    setTeachers(prev => prev.map(t => t.id === editId ? { ...t, username: form.username, password: form.password } : t));
    setEditId(null);
    showSaved("Teacher credentials updated!");
  };

  const exportData = () => {
    const keys = ["edu_students","edu_teachers","edu_classes","edu_attendance","edu_grades","edu_messages","edu_exams","edu_exam_results","edu_timetable","edu_subjects"];
    const data = {};
    keys.forEach(k => { try { data[k.replace("edu_","")] = JSON.parse(localStorage.getItem(k) || "null"); } catch {} });
    data.exportedAt = new Date().toISOString();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "edumanage_backup_" + new Date().toISOString().split("T")[0] + ".json";
    a.click(); URL.revokeObjectURL(url);
    showSaved("Data exported successfully!");
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        const map = { students:"edu_students", teachers:"edu_teachers", classes:"edu_classes", attendance:"edu_attendance", grades:"edu_grades", messages:"edu_messages", exams:"edu_exams", exam_results:"edu_exam_results" };
        Object.entries(map).forEach(([k,v]) => { if (data[k]) localStorage.setItem(v, JSON.stringify(data[k])); });
        showSaved("Data imported! Please refresh the page.");
      } catch { showSaved("ERROR: Invalid file format!"); }
    };
    reader.readAsText(file);
  };

  const resetAllData = () => {
    if (!confirmReset) { setConfirmReset(true); return; }
    ["edu_students","edu_teachers","edu_classes","edu_attendance","edu_grades","edu_messages","edu_exams","edu_exam_results","edu_timetable","edu_subjects"].forEach(k => localStorage.removeItem(k));
    setConfirmReset(false);
    showSaved("All data has been reset! Please refresh the page.");
  };

  const tabStyle = (t) => ({ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, background: tab === t ? S.primary : "#f1f5f9", color: tab === t ? "#fff" : S.textSub });
  const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${S.border}`, fontSize: 13, fontFamily: "inherit", outline: "none", marginBottom: 12, boxSizing: "border-box" };

  return (
    <div style={{ maxWidth: 820, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {[["school","🏫","School"],["subjects","📚","Subjects"],["teachers","👨‍🏫","Teachers"],["parents","👨‍👩‍👧","Parents"],["students-pwd","🎓","Students"],["appearance","🎨","Appearance"],["data","📦","Data"]].map(([id,icon,label]) => (
          <button key={id} style={tabStyle(id)} onClick={() => setTab(id)}>{icon} {label}</button>
        ))}
      </div>

      {saved && (
        <div style={{ background: saved.startsWith("ERROR") ? S.dangerBg : "#d1fae5", color: saved.startsWith("ERROR") ? S.danger : "#065f46", padding: "10px 16px", borderRadius: 8, marginBottom: 16, fontSize: 13, fontWeight: 500 }}>
          {saved.startsWith("ERROR") ? "❌" : "✅"} {saved}
        </div>
      )}

      {tab === "school" && (
        <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${S.border}`, padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: S.textMain, marginBottom: 20 }}>🏫 School Information</div>
          {[["School Name","name","text"],["Slogan","sub","text"],["Email","email","email"],["Academic Year","year","text"]].map(([label,key,type]) => (
            <div key={key}>
              <label style={{ fontSize: 12, fontWeight: 600, color: S.textSub, display: "block", marginBottom: 4 }}>{label}</label>
              <input type={type} style={inputStyle} value={schoolForm[key]} onChange={e => setSchoolForm({...schoolForm, [key]: e.target.value})} />
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 16, marginTop: 4 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: S.textMain, marginBottom: 12 }}>🔐 Admin Password</div>
            <label style={{ fontSize: 12, fontWeight: 600, color: S.textSub, display: "block", marginBottom: 4 }}>New Password (leave blank to keep current)</label>
            <input type="password" style={inputStyle} placeholder="••••••••" value={schoolForm.adminPassword} onChange={e => setSchoolForm({...schoolForm, adminPassword: e.target.value})} />
          </div>
                    <div style={{ borderTop: "1px solid " + S.border, paddingTop: 16, marginTop: 4, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: S.textMain, marginBottom: 12 }}>School Logo</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 80, height: 80, borderRadius: 12, border: "2px solid " + S.border, overflow: "hidden", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <img src={schoolForm.logoPreview || "/logo.png"} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: S.textSub, marginBottom: 8 }}>Upload a new logo (PNG, JPG, max 2MB)</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <label style={{ display: "inline-block", padding: "8px 16px", borderRadius: 8, border: "1px solid " + S.border, background: "#f8fafc", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: S.textMain }}>
                    Choose File
                    <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: "none" }} />
                  </label>
                  {schoolForm.logoPreview && (
                    <button onClick={removeLogo} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: S.dangerBg, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: S.danger }}>Remove</button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <button onClick={saveSchoolInfo} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: S.primary, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>💾 Save Settings</button>
        </div>
      )}

      {tab === "teachers" && (
        <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${S.border}`, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${S.border}`, fontSize: 14, fontWeight: 600, color: S.textMain }}>👨‍🏫 Teacher Login Credentials</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Name","Subject","Username","Password","Action"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: S.textSub, borderBottom: `1px solid ${S.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teachers.map(t => (
                <tr key={t.id} style={{ borderBottom: `1px solid ${S.border}` }}>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500 }}>{t.name}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: S.textSub }}>{t.subject}</td>
                  <td style={{ padding: "12px 16px" }}>
                    {editId === t.id
                      ? <input value={form.username} onChange={e => setForm({...form, username: e.target.value})} style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${S.border}`, fontSize: 13, fontFamily: "inherit", width: 130 }} />
                      : <span style={{ fontSize: 13, fontFamily: "monospace", background: "#f1f5f9", padding: "3px 8px", borderRadius: 4 }}>{t.username || "—"}</span>
                    }
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {editId === t.id
                      ? <input value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${S.border}`, fontSize: 13, fontFamily: "inherit", width: 130 }} />
                      : <span style={{ fontSize: 13, fontFamily: "monospace", background: "#f1f5f9", padding: "3px 8px", borderRadius: 4 }}>{t.password ? "••••••••" : "—"}</span>
                    }
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {editId === t.id
                      ? <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={saveTeacher} style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: S.primary, color: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Save</button>
                          <button onClick={() => setEditId(null)} style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${S.border}`, background: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                        </div>
                      : <button onClick={() => openEdit(t)} style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${S.border}`, background: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit", color: S.textMain }}>✏️ Edit</button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "students-pwd" && (
        <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${S.border}`, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${S.border}`, fontSize: 14, fontWeight: 600, color: S.textMain }}>🎓 Student Passwords</div>
          <div style={{ padding: "12px 20px", background: "#f0fdf4", borderBottom: `1px solid ${S.border}`, fontSize: 13, color: "#065f46" }}>
            ℹ️ Students log in using their <b>Student ID</b> + password below. Default: <b>student123</b>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Student Name","Student ID","New Student ID","Password","Action"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: S.textSub, borderBottom: `1px solid ${S.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map(s => {
                const passwords = (() => { try { return JSON.parse(localStorage.getItem("edu_student_passwords") || "{}"); } catch { return {}; } })();
                const pwd = passwords[s.id] || "student123";
                const isEditing = parentEditId === s.id + "_spwd";
                return (
                  <tr key={s.id} style={{ borderBottom: `1px solid ${S.border}`, background: isEditing ? "#f0fdf9" : "transparent" }}>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500 }}>{s.name}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontFamily: "monospace" }}>{s.sid}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13 }}>
                      {isEditing
                        ? <input value={parentForm.username} onChange={e => setParentForm({...parentForm, username: e.target.value})} style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${S.border}`, fontSize: 13, fontFamily: "monospace", width: 100 }} placeholder="New SID" />
                        : <span style={{ color: "#94a3b8", fontSize: 12 }}>—</span>
                      }
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13 }}>
                      {isEditing
                        ? <input value={parentForm.password} onChange={e => setParentForm({...parentForm, password: e.target.value})} style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${S.border}`, fontSize: 13, fontFamily: "inherit", width: 140 }} />
                        : <span style={{ fontFamily: "monospace", background: "#f1f5f9", padding: "3px 8px", borderRadius: 4, fontSize: 12 }}>••••••••</span>
                      }
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {isEditing ? (
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => {
                            const all = (() => { try { return JSON.parse(localStorage.getItem("edu_student_passwords") || "{}"); } catch { return {}; } })();
                            all[s.id] = parentForm.password;
                            localStorage.setItem("edu_student_passwords", JSON.stringify(all));
                            if (parentForm.username && parentForm.username !== s.sid) { setStudents(students.map(st => st.id === s.id ? {...st, sid: parentForm.username} : st)); }
                            setParentEditId(null);
                          }} style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: S.primary, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Save</button>
                          <button onClick={() => setParentEditId(null)} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${S.border}`, background: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => { setParentEditId(s.id + "_spwd"); setParentForm({ username: s.sid, password: pwd }); }} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${S.border}`, background: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>✏️ Edit</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {tab === "parents" && (
        <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${S.border}`, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${S.border}`, fontSize: 14, fontWeight: 600, color: S.textMain }}>👨‍👩‍👧 Parent Access</div>
          <div style={{ padding: "12px 20px", background: "#f0fdf4", borderBottom: `1px solid ${S.border}`, fontSize: 13, color: "#065f46" }}>
            ℹ️ Parents log in using <b>Username</b> + <b>Password</b>. Default: Student ID + Phone Number.
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Student Name","Username","Password","Access","Action"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: S.textSub, borderBottom: `1px solid ${S.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map(s => {
                const savedAccounts = (() => { try { return JSON.parse(localStorage.getItem("edu_parent_accounts") || "{}"); } catch { return {}; } })();
                const acc = savedAccounts[s.id] || { username: s.sid, password: s.phone || "" };
                const isEditing = parentEditId === s.id;
                return (
                  <tr key={s.id} style={{ borderBottom: `1px solid ${S.border}`, background: isEditing ? "#f0fdf9" : "transparent" }}>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500 }}>{s.name}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13 }}>
                      {isEditing
                        ? <input value={parentForm.username} onChange={e => setParentForm({...parentForm, username: e.target.value})} style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${S.border}`, fontSize: 13, fontFamily: "inherit", width: 120 }} />
                        : <span style={{ fontFamily: "monospace", background: "#f1f5f9", padding: "3px 8px", borderRadius: 4, fontSize: 12 }}>{acc.username}</span>
                      }
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13 }}>
                      {isEditing
                        ? <input value={parentForm.password} onChange={e => setParentForm({...parentForm, password: e.target.value})} style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${S.border}`, fontSize: 13, fontFamily: "inherit", width: 120 }} />
                        : <span style={{ fontFamily: "monospace", background: "#f1f5f9", padding: "3px 8px", borderRadius: 4, fontSize: 12 }}>••••••••</span>
                      }
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {acc.password
                        ? <span style={{ background: "#d1fae5", color: "#065f46", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>✅ Active</span>
                        : <span style={{ background: S.dangerBg, color: S.danger, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>❌ No Access</span>
                      }
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {isEditing ? (
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => {
                            const all = (() => { try { return JSON.parse(localStorage.getItem("edu_parent_accounts") || "{}"); } catch { return {}; } })();
                            all[s.id] = { username: parentForm.username, password: parentForm.password };
                            localStorage.setItem("edu_parent_accounts", JSON.stringify(all));
                            setParentEditId(null);
                          }} style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: S.primary, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Save</button>
                          <button onClick={() => setParentEditId(null)} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${S.border}`, background: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => { setParentEditId(s.id); setParentForm({ username: acc.username, password: acc.password }); }} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${S.border}`, background: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>✏️ Edit</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {tab === "subjects" && (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid " + S.border, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid " + S.border, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: S.textMain }}>Manage Subjects</div>
            <button onClick={() => {
              const name = prompt("New subject name:");
              if (!name || !name.trim()) return;
              const icon = prompt("Subject icon (emoji):", "book") || "book";
              const classId = parseInt(prompt("Class ID (1-4):") || "1");
              setSubjects(prev => [...prev, { id: Date.now(), classId, name: name.trim(), icon }]);
            }} style={{ padding: "7px 16px", borderRadius: 8, border: "none", background: S.primary, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              + Add Subject
            </button>
          </div>
          {[1,2,3,4].map(classId => {
            const cls = classes.find(c => c.id === classId);
            const classSubjects = subjects.filter(s => s.classId === classId);
            return (
              <div key={classId} style={{ borderBottom: "1px solid " + S.border }}>
                <div style={{ padding: "10px 20px", background: "#f8fafc", fontSize: 12, fontWeight: 700, color: S.textSub }}>
                  {cls ? cls.name : "Class " + classId}
                </div>
                {classSubjects.length === 0 ? (
                  <div style={{ padding: "12px 20px", fontSize: 12, color: S.textMuted }}>No subjects</div>
                ) : classSubjects.map(sub => (
                  <div key={sub.id} style={{ display: "flex", alignItems: "center", padding: "10px 20px", borderBottom: "1px solid #f8fafc", gap: 12 }}>
                    <span style={{ fontSize: 20, width: 28 }}>{sub.icon}</span>
                    <input
                      value={sub.name}
                      onChange={e => setSubjects(prev => prev.map(s => s.id === sub.id ? { ...s, name: e.target.value } : s))}
                      style={{ flex: 1, padding: "6px 10px", border: "1px solid " + S.border, borderRadius: 7, fontSize: 13, fontFamily: "inherit", outline: "none" }}
                    />
                    <input
                      value={sub.icon}
                      onChange={e => setSubjects(prev => prev.map(s => s.id === sub.id ? { ...s, icon: e.target.value } : s))}
                      style={{ width: 50, padding: "6px 8px", border: "1px solid " + S.border, borderRadius: 7, fontSize: 13, fontFamily: "inherit", outline: "none", textAlign: "center" }}
                    />
                    <button onClick={() => {
                      if (confirm("Delete " + sub.name + "?")) {
                        setSubjects(prev => prev.filter(s => s.id !== sub.id));
                      }
                    }} style={{ padding: "5px 10px", borderRadius: 7, border: "none", background: S.dangerBg, color: S.danger, fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Del</button>
                  </div>
                ))}
              </div>
            );
          })}
          <div style={{ padding: "12px 20px", display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => { showSaved("Subjects saved!"); }} style={{ padding: "9px 24px", borderRadius: 8, border: "none", background: S.primary, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              Save Subjects
            </button>
          </div>
        </div>
      )}

      {tab === "appearance" && (
        <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${S.border}`, padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: S.textMain, marginBottom: 20 }}>🎨 Appearance</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: S.textSub, marginBottom: 12 }}>Theme Mode</div>
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            {[["light","☀️","Light Mode"],["dark","🌙","Dark Mode"]].map(([id,icon,label]) => (
              <div key={id} onClick={() => saveTheme(id)} style={{ flex: 1, padding: 20, borderRadius: 10, border: `2px solid ${theme === id ? S.primary : S.border}`, cursor: "pointer", textAlign: "center", background: theme === id ? "#f0fdfa" : "#f8fafc" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: theme === id ? S.primary : S.textMain }}>{label}</div>
                {theme === id && <div style={{ fontSize: 11, color: S.primary, marginTop: 4, fontWeight: 600 }}>✓ Active</div>}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: S.textMuted, fontStyle: "italic" }}>Note: Full dark mode support coming in a future update.</div>
        </div>
      )}

      {tab === "data" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${S.border}`, padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: S.textMain, marginBottom: 6 }}>📤 Export Data</div>
            <div style={{ fontSize: 13, color: S.textSub, marginBottom: 16 }}>Download all school data as a JSON backup file.</div>
            <button onClick={exportData} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: S.primary, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>📥 Download Backup</button>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${S.border}`, padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: S.textMain, marginBottom: 6 }}>📥 Import Data</div>
            <div style={{ fontSize: 13, color: S.textSub, marginBottom: 16 }}>Restore data from a previously exported backup file.</div>
            <label style={{ display: "inline-block", padding: "10px 24px", borderRadius: 8, border: `1px solid ${S.border}`, background: "#f8fafc", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: S.textMain }}>
              📂 Choose Backup File
              <input type="file" accept=".json" onChange={importData} style={{ display: "none" }} />
            </label>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, border: `2px solid ${confirmReset ? S.danger : S.border}`, padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: S.danger, marginBottom: 6 }}>🗑️ Reset All Data</div>
            <div style={{ fontSize: 13, color: S.textSub, marginBottom: 16 }}>Permanently delete all students, teachers, grades, attendance, and messages. This cannot be undone.</div>
            {confirmReset && (
              <div style={{ background: S.dangerBg, border: `1px solid ${S.danger}`, borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: S.danger, fontWeight: 600 }}>
                ⚠️ WARNING: This will permanently delete ALL data! Click the button again to confirm.
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={resetAllData} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: S.danger, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                {confirmReset ? "⚠️ Confirm — Delete Everything" : "🗑️ Reset All Data"}
              </button>
              {confirmReset && <button onClick={() => setConfirmReset(false)} style={{ padding: "10px 24px", borderRadius: 8, border: `1px solid ${S.border}`, background: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
function LogoutButton() {
  const handleLogout = () => {
    try { localStorage.removeItem("edu_auth") } catch {}
    window.location.href = "/school/login";
  }
  return (
    <button onClick={handleLogout} style={{
      width: "100%", padding: "8px 12px", borderRadius: 8, border: "none",
      background: "rgba(239,68,68,.15)", color: "#fca5a5",
      fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
      display: "flex", alignItems: "center", gap: 8, transition: "all .15s",
    }}
    onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,.3)"}
    onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,.15)"}
    >
      ← Sign Out
    </button>
  )
}
export default function App() {
  const [page, setPage] = useState((() => { try { const a = JSON.parse(localStorage.getItem("edu_auth")||"{}"); return a.role === "teacher" ? "attendance" : "dashboard"; } catch { return "dashboard"; } })());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("edu_auth");
      if (!stored) { window.location.href = "/school/login"; return; }
      setAuth(JSON.parse(stored));
    } catch { localStorage.removeItem("edu_auth"); window.location.href = "/school/login"; }
  }, []);

  const userRole   = auth?.role     || "admin";
  const teacherClassId = auth?.classId || null;   // classId for teacher
  const teacherClassIds = auth?.classIds || (teacherClassId ? [teacherClassId] : null); // all classIds for teacher
  const teacherName    = auth?.name    || "";

  // ─── Teacher: pages allowed ───────────────────────────────────────────────
  const TEACHER_PAGES = ["attendance", "grades", "timetable", "messages", "quizzes", "lessonplans", "quran"];
  const PARENT_PAGES  = ["dashboard"];
  const STUDENT_PAGES = ["dashboard"];

  const allowedPages = userRole === "teacher" ? TEACHER_PAGES
                     : userRole === "student" ? STUDENT_PAGES
                     : userRole === "parent"  ? PARENT_PAGES
                     : null; // admin: all pages

  const effectivePage = allowedPages && !allowedPages.includes(page)
    ? TEACHER_PAGES[0]
    : page;
  const initialPage = userRole === "teacher" ? "attendance" : "dashboard";

  // localStorage persistence — load on mount, save on change
  const [students, setStudents]     = useState(() => load("edu_students", SEED_STUDENTS));
  const [teachers, setTeachers]     = useState(() => load("edu_teachers",   SEED_TEACHERS));
  const [classes,  setClasses]      = useState(() => load("edu_classes", SEED_CLASSES));
  const [attendance, setAttendance] = useState(() => load("edu_attendance", seedAttendance(SEED_STUDENTS)));
  const [subjects, setSubjects]     = useState(() => load("edu_subjects",   SEED_SUBJECTS));
  const [grades,   setGrades]       = useState(() => load("edu_grades",     seedGrades(SEED_STUDENTS, SEED_SUBJECTS)));
  const [timetable, setTimetable]   = useState(() => load("edu_timetable",  seedTimetable(SEED_CLASSES, SEED_SUBJECTS)));
  const [messages,  setMessages]    = useState(() => load("edu_messages",     seedMessages(SEED_STUDENTS)));
  const [exams,     setExams]       = useState(() => load("edu_exams",        seedExams(SEED_CLASSES, SEED_SUBJECTS)));
  const [quizzes,     setQuizzes]     = useState(() => { try { return JSON.parse(localStorage.getItem("edu_quizzes")||"[]"); } catch{return[];} });
  const [quizResults, setQuizResults] = useState(() => { try { return JSON.parse(localStorage.getItem("edu_quiz_results")||"[]"); } catch{return[];} });
  const [lessonPlans,  setLessonPlans]  = useState(() => { try { return JSON.parse(localStorage.getItem("edu_lesson_plans")||"[]");  } catch{return[];} });
  const [evaluations,  setEvaluations]  = useState(() => { try { return JSON.parse(localStorage.getItem("edu_evaluations")||"[]");  } catch{return[];} });
  const [quranRecords, setQuranRecords] = useState(() => { try { return JSON.parse(localStorage.getItem("edu_quran_records")||"[]"); } catch{return[];} });
  const [dbLoaded, setDbLoaded] = useState(false);
  const [examResults, setExamResults] = useState(() => load("edu_exam_results", seedExamResults(seedExams(SEED_CLASSES, SEED_SUBJECTS), SEED_STUDENTS)));

  // Load from Supabase on mount (in background, localStorage is already loaded)
  useEffect(() => {
    Promise.all([sbLoadStudents(), sbLoadTeachers(), sbLoadClasses(), sbLoadAttendance(), sbLoadGrades(), sbLoadSubjects()])
      .then(([s, t, cl, att, gr, sub]) => {
        if (s  && s.length)   setStudents(s);
        if (t  && t.length)   setTeachers(t);
        if (cl && cl.length)  setClasses(cl);
        if (att)              setAttendance(att);
        if (gr)               setGrades(gr);
        if (sub && sub.length) setSubjects(sub);
        setDbLoaded(true);
        console.log('Supabase loaded');
      }).catch(() => setDbLoaded(true));
  }, []);

  // Sync to Supabase when data changes
  useEffect(() => { if (dbLoaded) sbSyncStudents(students); }, [students, dbLoaded]);
  useEffect(() => { if (dbLoaded) sbSyncTeachers(teachers); }, [teachers, dbLoaded]);
  useEffect(() => { if (dbLoaded) sbSyncClasses(classes); },  [classes,  dbLoaded]);
  useEffect(() => { if (dbLoaded) sbSyncAttendance(attendance); }, [attendance, dbLoaded]);
  useEffect(() => { if (dbLoaded) sbSyncGrades(grades); },    [grades,   dbLoaded]);
  useEffect(() => { if (dbLoaded) sbSyncSubjects(subjects); }, [subjects, dbLoaded]);

  useEffect(() => { save("edu_students", students); }, [students]);
  useEffect(() => { save("edu_teachers", teachers); }, [teachers]);
  useEffect(() => { save("edu_classes", classes); }, [classes]);
  useEffect(() => { save("edu_attendance", attendance); }, [attendance]);
  useEffect(() => { save("edu_subjects", subjects); }, [subjects]);
  useEffect(() => { save("edu_grades", grades); }, [grades]);
  useEffect(() => { save("edu_timetable", timetable); }, [timetable]);
  useEffect(() => { save("edu_messages", messages); }, [messages]);
  useEffect(() => { save("edu_exams", exams); }, [exams]);
  useEffect(() => { save("edu_exam_results",examResults); }, [examResults]);

  const PAGE_TITLES = {
    dashboard:  { title: "Dashboard",  sub: "Overview of your school" },
    students:   { title: "Students",   sub: "Manage student records" },
    classes:    { title: "Classes",    sub: "Manage classrooms & teachers" },
    attendance: { title: "Attendance", sub: "Track daily attendance" },
    grades:     { title: "Grades",     sub: "Enter grades & view report cards" },
    timetable:  { title: "Timetable",  sub: "Weekly schedule for each class" },
    messages:   { title: "Messages",    sub: "Communicate with parents & guardians" },
    quizzes:    { title: "Quizzes",     sub: "Create and manage quizzes" },
    lessonplans:  { title: "Lesson Plans",  sub: "Weekly lesson planning for teachers" },
    evaluations:  { title: "Evaluations",   sub: "Teacher performance evaluation" },
    quran:        { title: "Quran Program",  sub: "Quran memorization tracking & recitation" },
    exams:      { title: "Exams",       sub: "Schedule exams & record results" },
    teachers:   { title: "Teachers",    sub: "Manage teaching staff & assignments" },
    settings:   { title: "Settings",    sub: "Manage accounts & access" },
  };

  const [activeChildId, setActiveChildId] = useState(null);

  if (!auth) return null;

function exportParentReportPDF(student, cls, attendance, grades, subjects, exams, examResults) {
  loadJsPDF(function() {
    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF();
    var N = [30,30,58], P = [13,148,136];
    var W = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(N[0],N[1],N[2]); doc.rect(0,0,W,36,"F");
    doc.setTextColor(255,255,255);
    doc.setFontSize(18); doc.setFont("helvetica","bold");
    doc.text("Al-Huffath Academy", W/2, 14, {align:"center"});
    doc.setFontSize(11); doc.setFont("helvetica","normal");
    doc.text("Student Progress Report", W/2, 24, {align:"center"});
    doc.setFontSize(8);
    doc.text(new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}), W/2, 31, {align:"center"});

    var y = 46;

    // Student Info Box
    doc.setFillColor(240,253,250);
    doc.roundedRect(14,y,W-28,36,3,3,"F");
    doc.setDrawColor(P[0],P[1],P[2]); doc.setLineWidth(0.5);
    doc.roundedRect(14,y,W-28,36,3,3,"S");
    doc.setTextColor(N[0],N[1],N[2]); doc.setFontSize(14); doc.setFont("helvetica","bold");
    doc.text(student.name, 20, y+10);
    doc.setFontSize(8.5); doc.setFont("helvetica","normal"); doc.setTextColor(100,116,139);
    doc.text("ID: " + student.sid, 20, y+18);
    doc.text("Class: " + (cls ? cls.name : "-"), 20, y+25);
    doc.text("Teacher: " + (cls ? cls.teacher : "-"), 20, y+32);
    doc.text("Gender: " + student.gender, 110, y+18);
    doc.text("Status: " + student.status, 110, y+25);
    doc.text("Generated: " + new Date().toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}), 110, y+32);
    y += 44;

    // Attendance Section
    var allDates = Object.keys(attendance||{}).sort();
    var p=0,ab=0,l=0,ex=0,tot=0;
    allDates.forEach(function(d) {
      var r = (attendance[d]||{})[student.id];
      if (!r) return; tot++;
      if (r==="present") p++; else if (r==="absent") ab++;
      else if (r==="late") l++; else if (r==="excused") ex++;
    });
    var rate = tot ? Math.round((p/tot)*100) : 100;

    doc.setTextColor(N[0],N[1],N[2]); doc.setFontSize(11); doc.setFont("helvetica","bold");
    doc.text("Attendance Summary", 14, y);
    doc.setDrawColor(P[0],P[1],P[2]); doc.setLineWidth(0.7); doc.line(14,y+2,80,y+2);
    y += 8;

    var ac = rate>=90?[5,150,105]:rate>=75?[217,119,6]:[220,38,38];
    doc.setFillColor(ac[0],ac[1],ac[2]); doc.roundedRect(14,y,38,18,2,2,"F");
    doc.setTextColor(255,255,255); doc.setFontSize(15); doc.setFont("helvetica","bold");
    doc.text(rate+"%", 33, y+10, {align:"center"});
    doc.setFontSize(7); doc.text("Attendance Rate", 33, y+16, {align:"center"});

    var attItems = [[p,[5,150,105],"Present"],[ab,[220,38,38],"Absent"],[l,[217,119,6],"Late"],[ex,[124,58,237],"Excused"]];
    attItems.forEach(function(item, i) {
      var bx = 58+i*36;
      doc.setFillColor(item[1][0],item[1][1],item[1][2]); doc.roundedRect(bx,y,33,18,2,2,"F");
      doc.setTextColor(255,255,255); doc.setFontSize(14); doc.setFont("helvetica","bold");
      doc.text(String(item[0]), bx+16, y+10, {align:"center"});
      doc.setFontSize(7); doc.text(item[2], bx+16, y+16, {align:"center"});
    });
    y += 26;

    // Grades Section
    var studentSubs = (subjects||[]).filter(function(s){ return s.classId===student.classId; });
    if (studentSubs.length > 0) {
      doc.setTextColor(N[0],N[1],N[2]); doc.setFontSize(11); doc.setFont("helvetica","bold");
      doc.text("Academic Performance", 14, y);
      doc.setDrawColor(P[0],P[1],P[2]); doc.line(14,y+2,90,y+2); y+=8;
      var gradeRows = studentSubs.map(function(sub) {
        var g = ((grades||{})[student.id]||{})[sub.id] || {};
        var q=g.quiz!=null?g.quiz:null,h=g.homework!=null?g.homework:null;
        var m=g.midterm!=null?g.midterm:null,f=g.final!=null?g.final:null;
        var total=(q!==null||h!==null||m!==null||f!==null)?Math.round((q||0)*0.15+(h||0)*0.15+(m||0)*0.30+(f||0)*0.40):null;
        var letter=total===null?"--":total>=90?"A":total>=80?"B":total>=70?"C":total>=60?"D":"F";
        return [sub.name, q!=null?q:"-", h!=null?h:"-", m!=null?m:"-", f!=null?f:"-", total!=null?total:"-", letter];
      });
      doc.autoTable({
        startY:y, head:[["Subject","Quiz 15%","HW 15%","Mid 30%","Final 40%","Total","Grade"]],
        body:gradeRows, theme:"grid",
        headStyles:{fillColor:N,textColor:255,fontSize:8,fontStyle:"bold"},
        bodyStyles:{fontSize:8,textColor:N},
        alternateRowStyles:{fillColor:[248,250,252]},
        columnStyles:{6:{fontStyle:"bold",halign:"center"}},
        margin:{left:14,right:14},
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    // Exams Section
    var studentExams = (exams||[]).filter(function(e){ return e.classId===student.classId; });
    if (studentExams.length > 0) {
      if (y > 220) { doc.addPage(); y=20; }
      doc.setTextColor(N[0],N[1],N[2]); doc.setFontSize(11); doc.setFont("helvetica","bold");
      doc.text("Exam Results", 14, y);
      doc.setDrawColor(P[0],P[1],P[2]); doc.line(14,y+2,65,y+2); y+=8;
      var examRows = studentExams.map(function(e) {
        var score = ((examResults||{})[e.id]||{})[student.id];
        var pct = score!=null ? Math.round((score/e.maxScore)*100) : null;
        var result = pct!=null?(pct>=90?"Excellent":pct>=75?"Good":pct>=60?"Pass":"Fail"):"Upcoming";
        return [
          e.title,
          new Date(e.date+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),
          score!=null?score+"/"+e.maxScore:"-",
          pct!=null?pct+"%":"-",
          result
        ];
      });
      doc.autoTable({
        startY:y, head:[["Exam","Date","Score","Pct","Result"]], body:examRows, theme:"grid",
        headStyles:{fillColor:N,textColor:255,fontSize:8,fontStyle:"bold"},
        bodyStyles:{fontSize:8,textColor:N},
        alternateRowStyles:{fillColor:[248,250,252]},
        margin:{left:14,right:14},
      });
    }

    // Footer
    var pages = doc.internal.getNumberOfPages();
    for (var i=1;i<=pages;i++) {
      doc.setPage(i);
      doc.setFillColor(N[0],N[1],N[2]); doc.rect(0,doc.internal.pageSize.getHeight()-12,W,12,"F");
      doc.setTextColor(255,255,255); doc.setFontSize(7); doc.setFont("helvetica","normal");
      doc.text("Al-Huffath Academy | Confidential Student Report", 14, doc.internal.pageSize.getHeight()-5);
      doc.text("Page "+i+" of "+pages, W-14, doc.internal.pageSize.getHeight()-5, {align:"right"});
    }

    doc.save(student.name.replace(/ /g,"_")+"_Report.pdf");
  });
}

  if (auth.role === "student") {
    const student = students.find(s => s.id === auth.studentId);
    if (!student) { localStorage.removeItem("edu_auth"); window.location.href = "/school/login"; return null; }
    return (
      <div style={{minHeight:"100vh",background:"#f1f5f9",fontFamily:"system-ui,sans-serif"}}>
        <div style={{background:"#1e1e3a",padding:"0 16px",display:"flex",alignItems:"center",gap:8,height:52}}>
          <div style={{fontSize:13,fontWeight:700,color:"#5eead4",flexShrink:0}}>EduManage</div>
          <div style={{flex:1}} />
          <span style={{fontSize:11,color:"rgba(255,255,255,.7)",fontWeight:500}}>{student.name}</span>
          <button onClick={()=>{localStorage.removeItem("edu_auth"); window.location.href="/school/login";}} style={{padding:"4px 10px",borderRadius:7,border:"1px solid rgba(255,255,255,.15)",background:"rgba(220,38,38,.2)",color:"#fca5a5",fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:600,marginLeft:8}}>Sign Out</button>
        </div>
        <div style={{padding:"16px 12px",maxWidth:900,margin:"0 auto"}}>
          <StudentDashboard student={student} classes={classes} attendance={attendance} grades={grades} subjects={subjects} exams={exams} examResults={examResults} messages={messages} setMessages={setMessages} timetable={timetable} quizzes={quizzes} quizResults={quizResults} setQuizResults={setQuizResults} />
        </div>
      </div>
    );
  }

  if (auth.role === "parent") {
    const studentIds = auth.studentIds || (auth.studentId ? [auth.studentId] : []);
    const allChildren = students.filter(s => studentIds.includes(s.id));
    const effectiveChildId = activeChildId || auth.studentId || (allChildren[0] && allChildren[0].id);
    const student = students.find(s => s.id === effectiveChildId) || allChildren[0];
    if (!student) { localStorage.removeItem("edu_auth"); window.location.href = "/school/login"; return null; }
    return (
      <div style={{minHeight:"100vh",background:"#f1f5f9",fontFamily:"system-ui,sans-serif"}}>
        <div style={{background:"#1e1e3a",padding:"0 12px",display:"flex",alignItems:"center",gap:8,height:52,flexWrap:"nowrap"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#5eead4",flexShrink:0}}>EduManage</div>
          <div style={{flex:1}} />
          {allChildren.length > 1 && allChildren.map(child => (
            <button key={child.id} onClick={() => setActiveChildId(child.id)} style={{
              padding:"4px 10px", borderRadius:7, flexShrink:0,
              border:"1px solid rgba(255,255,255,.2)",
              background: child.id === effectiveChildId ? "#0d9488" : "rgba(255,255,255,.08)",
              color: child.id === activeChildId ? "#fff" : "rgba(255,255,255,.6)",
              fontSize:12, cursor:"pointer", fontFamily:"inherit", fontWeight:600
            }}>{child.name.split(" ")[0]}</button>
          ))}
          {allChildren.length === 1 && (
            <span style={{fontSize:11,color:"rgba(255,255,255,.7)",fontWeight:500,flexShrink:0}}>{student.name.split(" ")[0]}</span>
          )}
          <button onClick={()=>{localStorage.removeItem("edu_auth"); window.location.href="/school/login";}} style={{padding:"4px 10px",borderRadius:7,border:"1px solid rgba(255,255,255,.15)",background:"rgba(220,38,38,.2)",color:"#fca5a5",fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:600,flexShrink:0}}>Out</button>
        </div>
        {allChildren.length > 1 && (
          <div style={{background:"#0d9488",padding:"8px 24px",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:12,color:"rgba(255,255,255,.7)"}}>Viewing:</span>
            <span style={{fontSize:13,fontWeight:700,color:"#fff"}}>{student.name}</span>
            <span style={{fontSize:11,color:"rgba(255,255,255,.6)",marginRight:8}}>{classes.find(c=>c.id===student.classId)?.name||""}</span>
            <span style={{fontSize:11,color:"rgba(255,255,255,.5)",marginLeft:"auto"}}>{allChildren.length} children linked</span>
          </div>
        )}
        <div style={{padding:"16px 12px",maxWidth:900,margin:"0 auto"}}>
          
          <StudentProfile
            student={student} classes={classes} attendance={attendance}
            grades={grades} subjects={subjects} exams={exams}
            examResults={examResults} messages={messages}
            timetable={timetable}
            onClose={null}
          />
          <ParentNotifications student={student} attendance={attendance} grades={grades} subjects={subjects} exams={exams} messages={messages} />
          <ParentLessonPlans student={student} lessonPlans={lessonPlans} subjects={subjects} classes={classes} />
          <ParentMessages student={student} messages={messages} setMessages={setMessages} />
          <ParentQuiz student={student} quizzes={quizzes} quizResults={quizResults} setQuizResults={setQuizResults} />
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:16}}>
            <button onClick={() => exportParentReportPDF(student, classes.find(c=>c.id===student.classId), attendance, grades, subjects, exams, examResults)} style={{padding:"10px 20px",background:"#1e1e3a",color:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8}}>
              Download PDF Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.bg, fontFamily: "system-ui,-apple-system,sans-serif", direction: "rtl" }}>
      {/* Sidebar */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 999 }} />
      )}
      <div style={{
        width: 220, background: T.navy, display: "flex", flexDirection: "column", flexShrink: 0,
        position: isMobile ? "fixed" : "sticky",
        top: 0, height: "100vh", order: 2,
        right: isMobile ? (sidebarOpen ? 0 : -260) : "auto",
        left: isMobile ? "auto" : "auto",
        zIndex: isMobile ? 1000 : "auto",
        transition: "right .25s ease",
      }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "flex-end" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#5eead4" }}>Al-Huffath Academy</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)", marginTop: 2 }}>Ilm | Iman | Hifz</div>
            </div>
            <img src={(() => { try { return localStorage.getItem("edu_logo") || "/logo.png"; } catch { return "/logo.png"; } })()} style={{ width: 44, height: 44, objectFit: "contain", background: "#fff", borderRadius: 8, padding: 3, flexShrink: 0 }} />
          </div>
        </div>
        <nav style={{ flex: 1, padding: "14px 10px", display: "flex", flexDirection: "column", gap: 3 }}>
          {NAV.filter(n => !allowedPages || allowedPages.includes(n.id)).map(n => {
            const unreadCount = n.id === "messages" ? messages.filter(m => !m.read).length : 0;
            return (
            <button key={n.id} onClick={() => { setPage(n.id); setSidebarOpen(false); }} style={{
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
          {isMobile && (
            <button onClick={() => setSidebarOpen(true)} style={{
              display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
              width: 38, height: 38, borderRadius: 9, border: "1px solid #e8ecf2",
              background: "#fff", cursor: "pointer", flexShrink: 0, gap: 4, padding: 9,
            }}>
              <span style={{ display: "block", width: 16, height: 2, background: T.textMain, borderRadius: 2 }} />
              <span style={{ display: "block", width: 16, height: 2, background: T.textMain, borderRadius: 2 }} />
              <span style={{ display: "block", width: 16, height: 2, background: T.textMain, borderRadius: 2 }} />
            </button>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: T.textMain }}>{PAGE_TITLES[page].title}</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>{PAGE_TITLES[page].sub}</div>
          </div>
        </div>
        <div className="edu-content" style={{ padding: 28, flex: 1 }}>
          {page === "dashboard"  && <Dashboard  students={students} classes={classes} attendance={attendance} grades={grades} subjects={subjects} timetable={timetable} messages={messages} exams={exams} onNavigate={setPage} />}
          {effectivePage === "teachers"  && userRole === "admin" && <Teachers userRole={userRole} teachers={teachers} setTeachers={setTeachers} classes={classes} subjects={subjects} />}
          {page === "students"   && <Students   students={students} setStudents={setStudents} classes={classes} attendance={attendance} grades={grades} subjects={subjects} exams={exams} examResults={examResults} messages={messages} teacherClassIds={teacherClassIds} userRole={userRole} />}
          {page === "classes"    && <Classes    classes={classes}   setClasses={setClasses}   students={students} />}
          {page === "attendance" && <Attendance students={students} classes={classes} attendance={attendance} setAttendance={setAttendance} teacherClassIds={teacherClassIds} />}
          {page === "grades"     && <Grades     students={students} classes={classes} subjects={subjects} grades={grades} setGrades={setGrades} teacherClassIds={teacherClassIds} />}
          {page === "timetable"  && <Timetable  classes={classes} subjects={subjects} timetable={timetable} setTimetable={setTimetable} teacherClassIds={teacherClassIds} />}
          {page === "messages"   && <EnhancedMessaging students={students} classes={classes} messages={messages} setMessages={setMessages} teachers={teachers} userRole={userRole} auth={auth} />}
          {page === "settings"  && userRole === "admin" && <Settings teachers={teachers} setTeachers={setTeachers} students={students} setStudents={setStudents} classes={classes} subjects={subjects} setSubjects={setSubjects} />}
          {page === "exams"      && <ExamScheduler students={students} classes={classes} subjects={subjects} exams={exams} setExams={setExams} examResults={examResults} setExamResults={setExamResults} />}
          {page === "quizzes"    && <Quizzes students={students} classes={classes} subjects={subjects} quizzes={quizzes} setQuizzes={setQuizzes} quizResults={quizResults} setQuizResults={setQuizResults} teacherClassIds={teacherClassIds} userRole={userRole} />}
          {page === "lessonplans"  && <LessonPlans classes={classes} subjects={subjects} lessonPlans={lessonPlans} setLessonPlans={setLessonPlans} teacherClassIds={teacherClassIds} userRole={userRole} auth={auth} teachers={teachers} />}
          {page === "evaluations"  && <TeacherEvaluations teachers={teachers} evaluations={evaluations} setEvaluations={setEvaluations} userRole={userRole} auth={auth} />}
          {page === "quran"         && <QuranProgram students={students} classes={classes} quranRecords={quranRecords} setQuranRecords={setQuranRecords} teacherClassIds={teacherClassIds} userRole={userRole} />}
        </div>
      </div>
    </div>
  );
}













