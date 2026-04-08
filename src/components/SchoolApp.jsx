const supabase = {
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
};import { useState, useMemo, useEffect, useCallback } from "react";
import * as DB from "../lib/db";


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
  { id: "settings",   icon: "⚙️", label: "Settings"   },
];



function Teachers({ userRole, classes = [] }) {
  const [teachers, setTeachers] = useState(() => { try { const v = localStorage.getItem("edu_teachers"); return v ? JSON.parse(v) : SEED_TEACHERS; } catch { return SEED_TEACHERS; } });
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  useEffect(() => {
    async function loadFromSupabase() {
      try {
        const [dbClasses, dbStudents, dbSubjects, dbAttendance, dbGrades, dbMessages, dbExams, dbExamResults] = await Promise.all([
          DB.getClasses(), DB.getStudents(), DB.getSubjects(),
          DB.getAttendance(), DB.getGrades(), DB.getMessages(),
          DB.getExams(), DB.getExamResults()
        ]);
        if (dbClasses.length)                  setClasses(dbClasses);
        if (dbStudents.length)                 setStudents(dbStudents.map(s => ({ ...s, classId: s.class_id || s.classId })));
        if (dbSubjects.length)                 setSubjects(dbSubjects.map(s => ({ ...s, classId: s.class_id || s.classId })));
        if (Object.keys(dbAttendance).length)  setAttendance(dbAttendance);
        if (Object.keys(dbGrades).length)      setGrades(dbGrades);
        if (dbMessages.length)                 setMessages(dbMessages);
        if (dbExams.length)                    setExams(dbExams);
        if (Object.keys(dbExamResults).length) setExamResults(dbExamResults);
        if (!dbClasses.length)  { for (const c of SEED_CLASSES)  await DB.saveClass(c); }
        if (!dbStudents.length) { for (const s of SEED_STUDENTS) await DB.saveStudent(s); }
        if (!dbSubjects.length) { for (const s of SEED_SUBJECTS) await DB.saveSubject(s); }
      } catch(e) { console.error('Supabase load error:', e); }
      setDbReady(true);
    }
    loadFromSupabase();
  }, []);
  const [attendance, setAttendance] = useState(() => load("edu_attendance", seedAttendance(SEED_STUDENTS)));
  const [subjects, setSubjects]     = useState(() => load("edu_subjects",   SEED_SUBJECTS));
  const [grades,   setGrades]       = useState(() => load("edu_grades",     seedGrades(SEED_STUDENTS, SEED_SUBJECTS)));
  const [timetable, setTimetable]   = useState(() => load("edu_timetable",  seedTimetable(SEED_CLASSES, SEED_SUBJECTS)));
  const [messages,  setMessages]    = useState(() => load("edu_messages",     seedMessages(SEED_STUDENTS)));
  const [exams,     setExams]       = useState(() => load("edu_exams",        seedExams(SEED_CLASSES, SEED_SUBJECTS)));
  const [examResults, setExamResults] = useState(() => load("edu_exam_results", seedExamResults(seedExams(SEED_CLASSES, SEED_SUBJECTS), SEED_STUDENTS)));

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
          <ParentNotifications student={student} attendance={attendance} grades={grades} subjects={subjects} exams={exams} messages={messages} />
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:16}}>
            <button onClick={() => exportParentReportPDF(student, classes.find(c=>c.id===student.classId), attendance, grades, subjects, exams, examResults)} style={{padding:"10px 20px",background:"#1e1e3a",color:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8}}>
              Download PDF Report
            </button>
          </div>
          <StudentProfile
            student={student} classes={classes} attendance={attendance}
            grades={grades} subjects={subjects} exams={exams}
            examResults={examResults} messages={messages}
            timetable={timetable}
            onClose={null}
          />
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
          {page === "messages"   && <Messaging  students={students} classes={classes} messages={messages} setMessages={setMessages} />}
          {page === "settings"  && userRole === "admin" && <Settings teachers={teachers} setTeachers={setTeachers} students={students} classes={classes} subjects={subjects} setSubjects={setSubjects} />}
          {page === "exams"      && <ExamScheduler students={students} classes={classes} subjects={subjects} exams={exams} setExams={setExams} examResults={examResults} setExamResults={setExamResults} />}
        </div>
      </div>
    </div>
  );
}












