import { useState, useMemo, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://mhrtzppoiinpnbnximuf.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ocnR6cHBvaWlucG5ibnhpbXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4OTE3MDEsImV4cCI6MjA5MDQ2NzcwMX0.933qWXp0vslGHmt06eKgPuihMOVh4NzGUiHXY4iDNSQ");
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

const uid = () => Date.now() + Math.random(); // collision-safe unique ID

// ─── Academic Year ────────────────────────────────────────────────────────────
function getCurrentAcademicYear() {
  const now = new Date();
  const y = now.getFullYear();
  return now.getMonth() >= 8 ? `${y}/${y+1}` : `${y-1}/${y}`;
}

const CURRENT_YEAR = getCurrentAcademicYear();

function getAcademicYears(students) {
  const years = [...new Set(students.map(s => s.academicYear).filter(Boolean))];
  if (!years.includes(CURRENT_YEAR)) years.unshift(CURRENT_YEAR);
  return years.sort().reverse();
}



const inputStyle = {
  width: "100%", padding: "9px 12px", border: `1px solid ${T.border}`,
  borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none",
  color: T.textMain, background: T.inputBg, boxSizing: "border-box",
  transition: "border-color .15s",
};
const inputErrorStyle = { ...inputStyle, border: "1px solid #ef4444", background: "#fff5f5" };
const selectStyle = { ...inputStyle, cursor: "pointer" };

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
  { id: 1, name: "Liam Anderson",   sid: "S001", classId: 1, gender: "Male",   phone: "555-0101", status: "Active", academicYear: CURRENT_YEAR },
  { id: 2, name: "Olivia Martinez", sid: "S002", classId: 1, gender: "Female", phone: "555-0102", status: "Active", academicYear: CURRENT_YEAR },
  { id: 3, name: "Noah Thompson",   sid: "S003", classId: 2, gender: "Male",   phone: "555-0103", status: "Active", academicYear: CURRENT_YEAR },
  { id: 4, name: "Emma Wilson",     sid: "S004", classId: 2, gender: "Female", phone: "555-0104", status: "Active", academicYear: CURRENT_YEAR },
  { id: 5, name: "Aiden Brown",     sid: "S005", classId: 3, gender: "Male",   phone: "555-0105", status: "Active", academicYear: CURRENT_YEAR },
  { id: 6, name: "Sophia Davis",    sid: "S006", classId: 3, gender: "Female", phone: "555-0106", status: "Active", academicYear: CURRENT_YEAR },
  { id: 7, name: "Lucas Garcia",    sid: "S007", classId: 4, gender: "Male",   phone: "555-0107", status: "Active", academicYear: CURRENT_YEAR },
  { id: 8, name: "Isabella White",  sid: "S008", classId: 4, gender: "Female", phone: "555-0108", status: "Active", academicYear: CURRENT_YEAR },
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

const EMPTY_STUDENT = { name: "", sid: "", classId: 1, gender: "Male", phone: "", status: "Active", academicYear: CURRENT_YEAR };
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
];



function Teachers({ userRole }) {
  const [teachers, setTeachers] = useState(SEED_TEACHERS);
  useEffect(() => {
    supabase.from("teachers").select("*").order("id").then(({ data }) => {
      if (data && data.length > 0) {
        setTeachers(data.map(t => ({ id: t.id, name: t.name, username: t.username || "", password: t.password || "teacher", subject: t.subject, classIds: t.class_ids || [], phone: t.phone || "", email: t.email || "", status: t.status || "Active" })));
      }
    });
  }, []);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = teachers.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const newTeacher = {
      id: editing ? editing.id : Date.now(),
      name: form.name.value,
      subject: form.subject.value,
      phone: form.phone.value,
      email: form.email.value,
      status: form.status.value,
    };
    
    if (editing) {
      dbSaveTeacher({ ...newTeacher, classIds: newTeacher.classIds || [] }, false);
      setTeachers(teachers.map(t => t.id === editing.id ? newTeacher : t));
    } else {
      supabase.from("teachers").insert([{ name: newTeacher.name, username: newTeacher.name.toLowerCase().replace(/[^a-z]/g, ".").replace(/\.+/g,"."), password: "teacher", subject: newTeacher.subject, class_ids: [], phone: newTeacher.phone || "", email: newTeacher.email || "", status: newTeacher.status || "Active" }]).select().then(({ data }) => {
        if (data && data.length > 0) {
          const t = data[0];
          setTeachers(prev => [...prev, { id: t.id, name: t.name, username: t.username, password: t.password, subject: t.subject, classIds: t.class_ids || [], phone: t.phone, email: t.email, status: t.status }]);
        }
      });
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this teacher?")) {
      supabase.from("teachers").delete().eq("id", id).then(() => {
        setTeachers(teachers.filter(t => t.id !== id));
      });
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
            <select name="status" defaultValue={editing?.status || "active"} className="w-full p-2 border rounded mb-4">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
function Attendance({ students, classes, attendance, setAttendance }) {
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

  return (
    <div>
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
      background: "#1e1e3a", color: "#fff", borderRadius: 10,
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

// ─── Student Profile Modal ────────────────────────────────────────────────────
function StudentProfile({ student, classes, attendance, grades, subjects, exams, examResults, onClose }) {
  const cls = classes.find(c => c.id === student.classId);
  const allDates = Object.keys(attendance).sort();
  let p = 0, total = 0;
  allDates.forEach(d => {
    const rec = attendance[d]?.[student.id];
    if (!rec) return; total++;
    if (rec === "present") p++;
  });
  const attRate = total ? Math.round((p / total) * 100) : null;
  const studentSubs = (subjects || []).filter(s => s.classId === student.classId);
  const gpaScores = studentSubs.map(sub => calcTotal(grades?.[student.id]?.[sub.id])).filter(v => v !== null);
  const gpa = gpaScores.length ? Math.round(gpaScores.reduce((a, b) => a + b, 0) / gpaScores.length) : null;
  const studentExams = (exams || []).filter(e => e.classId === student.classId && getExamStatus(e.date) === "completed");
  return (
    <Modal title="" onClose={onClose}>
      <div style={{ marginTop: -8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, padding: "0 0 18px", borderBottom: `1px solid ${T.border}` }}>
          <Avatar name={student.name} size={52} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.textMain }}>{student.name}</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginTop: 3 }}>{student.sid} · {cls?.name || "—"}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 5 }}>
              <Badge status={student.status} />
              {student.academicYear && (
                <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: "#dbeafe", color: "#1d4ed8" }}>📅 {student.academicYear}</span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
          {[
            { label: "Attendance", value: attRate !== null ? `${attRate}%` : "—", color: attRate >= 90 ? "#059669" : attRate >= 75 ? "#d97706" : "#dc2626", icon: "✅" },
            { label: "GPA Average", value: gpa !== null ? `${gpa}` : "—", color: getGpaColor(gpa), icon: "⭐" },
            { label: "Grade", value: letterGrade(gpa), color: GRADE_COLOR[letterGrade(gpa)]?.color || T.textMuted, icon: "🎓" },
          ].map(s => (
            <div key={s.label} style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 18 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: s.color, lineHeight: 1.2 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: T.textMuted, marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
        {studentSubs.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: ".05em" }}>Grades by Subject</div>
            {studentSubs.map(sub => {
              const score = calcTotal(grades?.[student.id]?.[sub.id]);
              const gl = letterGrade(score); const gc = GRADE_COLOR[gl];
              return (
                <div key={sub.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 13, flex: 1, color: T.textMain }}>{sub.icon} {sub.name}</span>
                  <div style={{ width: 110, height: 6, background: "#f1f5f9", borderRadius: 6 }}>
                    <div style={{ height: "100%", borderRadius: 6, background: getGpaColor(score), width: (score || 0) + "%" }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: T.textSub, minWidth: 28, textAlign: "right" }}>{score ?? "—"}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: gc.bg, color: gc.color }}>{gl}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}

// ─── Academic Year Stats ──────────────────────────────────────────────────────
function AcademicYearStats({ students, year }) {
  const yearStudents = students.filter(s => (s.academicYear || CURRENT_YEAR) === year);
  const active = yearStudents.filter(s => s.status === "Active").length;
  return (
    <div style={{ background: "#f0fdf9", border: "1px solid #99f6e4", borderRadius: 10, padding: "12px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: "#0f766e" }}>📅 {year}</span>
      <span style={{ fontSize: 13, color: "#0f766e" }}>{yearStudents.length} students enrolled</span>
      <span style={{ fontSize: 13, color: "#059669" }}>✅ {active} active</span>
      <span style={{ fontSize: 13, color: "#dc2626" }}>❌ {yearStudents.length - active} inactive</span>
    </div>
  );
}

function Students({ students, setStudents, classes, attendance, grades, subjects, exams, examResults }) {
  const [search, setSearch]             = useState("");
  const [filterClass, setFilterClass]   = useState("all");
  const [filterYear, setFilterYear]     = useState(CURRENT_YEAR);
  const [modal, setModal]               = useState(null);
  const [form, setForm]                 = useState({ ...EMPTY_STUDENT, academicYear: CURRENT_YEAR });
  const [errors, setErrors]             = useState({});
  const [deleteId, setDeleteId]         = useState(null);
  const [selected, setSelected]         = useState(new Set());
  const [toast, setToast]               = useState("");
  const [profile, setProfile]           = useState(null);
  const [showPromote, setShowPromote]   = useState(false);
  const [promoteYear, setPromoteYear]   = useState("");

  const showToast = (msg) => setToast(msg);
  const academicYears = getAcademicYears(students);

  const filtered = useMemo(() => students.filter(s => {
    const q = search.toLowerCase();
    const m = s.name.toLowerCase().includes(q) || s.sid.toLowerCase().includes(q) || (s.phone || "").toLowerCase().includes(q);
    const c = filterClass === "all" || s.classId === parseInt(filterClass);
    const y = filterYear === "all" || (s.academicYear || CURRENT_YEAR) === filterYear;
    return m && c && y;
  }), [students, search, filterClass, filterYear]);

  const allFilteredSelected = filtered.length > 0 && filtered.every(s => selected.has(s.id));
  const toggleSelect = (id) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => { if (allFilteredSelected) setSelected(new Set()); else setSelected(new Set(filtered.map(s => s.id))); };

  const deleteSelected = () => {
    const count = selected.size;
    setStudents(prev => prev.filter(s => !selected.has(s.id)));
    setSelected(new Set());
    showToast(`${count} student${count > 1 ? "s" : ""} deleted`);
  };

  const promoteAll = () => {
    if (!promoteYear.trim()) return;
    const ids = new Set(filtered.map(s => s.id));
    setStudents(prev => prev.map(s => ids.has(s.id) ? { ...s, academicYear: promoteYear } : s));
    setShowPromote(false);
    setPromoteYear("");
    showToast(`${ids.size} students promoted to ${promoteYear}`);
  };

  const openAdd  = () => { setForm({ ...EMPTY_STUDENT, academicYear: filterYear === "all" ? CURRENT_YEAR : filterYear, sid: `S${String(students.length + 1).padStart(3, "0")}` }); setErrors({}); setModal({ mode: "add" }); };
  const openEdit = (s) => { setForm({ ...s }); setErrors({}); setModal({ mode: "edit" }); };

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
      const _ns = { ...form, id: uid() };
      setStudents(prev => [...prev, _ns]);
      dbSaveStudent(_ns, true);
    } else {
      setStudents(prev => prev.map(s => s.id === form.id ? form : s));
      dbSaveStudent(form, false);
    }
    setModal(null);
    showToast(modal.mode === "add" ? "Student added" : "Student updated");
  };

  const doDelete = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    dbDelete("students", id);
    setDeleteId(null);
    showToast("Student deleted");
  };

  const cls = id => classes.find(c => c.id === id)?.name || "—";

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

  const yearStudents = filterYear === "all" ? students : students.filter(s => (s.academicYear || CURRENT_YEAR) === filterYear);

  return (
    <div>
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}

      {/* Academic Year Stats */}
      {filterYear !== "all" && <AcademicYearStats students={students} year={filterYear} />}

      {/* Toolbar */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", boxShadow: T.cardShadow }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: T.textMuted }}>🔍</span>
          <input placeholder="Search name, ID or phone…" value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: 32 }} />
        </div>

        {/* Academic Year Filter */}
        <select value={filterYear} onChange={e => setFilterYear(e.target.value)} style={{ ...selectStyle, width: 150, fontWeight: 600 }}>
          <option value="all">All Years</option>
          {academicYears.map(y => <option key={y} value={y}>{y}{y === CURRENT_YEAR ? " (Current)" : ""}</option>)}
        </select>

        <select value={filterClass} onChange={e => setFilterClass(e.target.value)} style={{ ...selectStyle, width: 160 }}>
          <option value="all">All Classes</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        {selected.size > 0 && (
          <button onClick={deleteSelected} style={{ padding: "9px 16px", borderRadius: 8, border: "none", background: T.danger, color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
            🗑 Delete {selected.size}
          </button>
        )}

        {filtered.length > 0 && filterYear !== "all" && (
          <button onClick={() => setShowPromote(true)} style={{ padding: "9px 14px", borderRadius: 8, border: `1px solid #0d9488`, background: "#f0fdf9", color: "#0f766e", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
            🔄 Promote All
          </button>
        )}

        <button onClick={() => exportToCSV(filtered.map(s => ({ Name: s.name, ID: s.sid, Class: cls(s.classId), Year: s.academicYear || CURRENT_YEAR, Gender: s.gender, Phone: s.phone, Status: s.status })), `students_${filterYear}.csv`)}
          style={{ padding: "9px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit", color: T.textSub }}>
          ⬇ CSV
        </button>

        <button onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: T.primary, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
          ＋ Add Student
        </button>
      </div>

      {atRiskIds.size > 0 && (
        <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "10px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <span style={{ fontSize: 13, color: "#9a3412", fontWeight: 500 }}>{atRiskIds.size} student{atRiskIds.size > 1 ? "s" : ""} with attendance below 75%</span>
        </div>
      )}

      {/* Table */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, overflow: "hidden", boxShadow: T.cardShadow }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.textMain }}>
            Students {filterYear !== "all" ? `— ${filterYear}` : "— All Years"}
          </div>
          <div style={{ fontSize: 12, color: T.textMuted, background: "#f1f5f9", padding: "3px 10px", borderRadius: 20 }}>{filtered.length} records</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ padding: "11px 14px", width: 36 }}>
                  <input type="checkbox" checked={allFilteredSelected} onChange={toggleAll} style={{ cursor: "pointer" }} />
                </th>
                {["Student", "ID", "Year", "Class", "Gender", "Phone", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: T.textMuted, borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap", letterSpacing: ".05em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: 48, textAlign: "center", color: T.textMuted }}>No students found</td></tr>
              ) : filtered.map(s => {
                const isAtRisk = atRiskIds.has(s.id);
                const isSel    = selected.has(s.id);
                return (
                  <tr key={s.id} style={{ background: isSel ? "#f0fdf9" : isAtRisk ? "#fff1f2" : "transparent" }}>
                    <td style={{ padding: "11px 14px", borderBottom: "1px solid #f8fafc" }}>
                      <input type="checkbox" checked={isSel} onChange={() => toggleSelect(s.id)} style={{ cursor: "pointer" }} />
                    </td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar name={s.name} />
                        <button onClick={() => setProfile(s)} style={{ fontSize: 14, fontWeight: 500, color: T.primary, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit", textDecoration: "underline dotted" }}>
                          {s.name}
                        </button>
                        {isAtRisk && <span title="Attendance at risk">⚠️</span>}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc", fontSize: 12, color: T.textSub, fontFamily: "monospace" }}>{s.sid}</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: "#dbeafe", color: "#1d4ed8" }}>{s.academicYear || CURRENT_YEAR}</span>
                    </td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc", fontSize: 13, color: "#334155" }}>{cls(s.classId)}</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc", fontSize: 13, color: T.textSub }}>{s.gender}</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc", fontSize: 13, color: T.textSub }}>{s.phone}</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc" }}><Badge status={s.status} /></td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #f8fafc" }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "nowrap" }}>
                        <button onClick={() => openEdit(s)} style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${T.border}`, background: "#fff", fontSize: 11, cursor: "pointer", color: "#334155" }}>Edit</button>
                        <button onClick={() => setDeleteId(s.id)} style={{ padding: "5px 10px", borderRadius: 6, border: "none", background: T.dangerBg, fontSize: 11, cursor: "pointer", color: T.danger }}>Delete</button>
                        <button onClick={() => exportStudentReportPDF(s, classes.find(c=>c.id===s.classId), attendance, grades, subjects, exams||[], examResults||{})} style={{ padding: "5px 10px", borderRadius: 6, border: "none", background: "#dbeafe", fontSize: 11, cursor: "pointer", color: "#1d4ed8", fontWeight: 500 }}>📄 PDF</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
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
            <Field label="Academic Year">
              <select style={selectStyle} value={form.academicYear || CURRENT_YEAR} onChange={e => setForm({ ...form, academicYear: e.target.value })}>
                {academicYears.map(y => <option key={y} value={y}>{y}{y === CURRENT_YEAR ? " (Current)" : ""}</option>)}
                <option value={CURRENT_YEAR}>{CURRENT_YEAR} (Current)</option>
              </select>
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

      {/* Delete Confirm */}
      {deleteId && (
        <Modal title="Confirm Delete" onClose={() => setDeleteId(null)}>
          <p style={{ fontSize: 14, color: T.textSub, marginBottom: 24 }}>Are you sure you want to delete <strong>{students.find(s => s.id === deleteId)?.name}</strong>?</p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button onClick={() => setDeleteId(null)} style={{ padding: "9px 18px", borderRadius: 8, border: `1px solid ${T.border}`, background: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
            <button onClick={() => doDelete(deleteId)} style={{ padding: "9px 22px", borderRadius: 8, border: "none", background: T.danger, color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
          </div>
        </Modal>
      )}

      {/* Promote Modal */}
      {showPromote && (
        <Modal title="🔄 Promote Students to New Year" onClose={() => setShowPromote(false)}>
          <p style={{ fontSize: 14, color: T.textSub, marginBottom: 16 }}>
            Move <strong>{filtered.length}</strong> students from <strong>{filterYear}</strong> to a new academic year.
          </p>
          <Field label="New Academic Year (e.g. 2025/2026)">
            <input style={inputStyle} value={promoteYear} onChange={e => setPromoteYear(e.target.value)} placeholder="e.g. 2025/2026" />
          </Field>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
            <button onClick={() => setShowPromote(false)} style={{ padding: "9px 18px", borderRadius: 8, border: `1px solid ${T.border}`, background: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
            <button onClick={promoteAll} style={{ padding: "9px 22px", borderRadius: 8, border: "none", background: T.primary, color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Promote All</button>
          </div>
        </Modal>
      )}

      {/* Student Profile */}
      {profile && (
        <StudentProfile student={profile} classes={classes} attendance={attendance || {}} grades={grades || {}} subjects={subjects || []} exams={exams || []} examResults={examResults || {}} onClose={() => setProfile(null)} />
      )}
    </div>
  );
}


// ─── Classes ──────────────────────────────────────────────────────────────────
function Classes({ classes, setClasses, students }) {
  useEffect(() => {
    supabase.from("classes").select("*").order("id").then(({ data }) => {
      if (data && data.length > 0)
        setClasses(data.map(c => ({ id: c.id, name: c.name, grade: c.grade || "", room: c.room || "", teacher: c.teacher || "", capacity: c.capacity || 25 })));
    });
  }, []);
  useEffect(() => {
    supabase.from("classes").select("*").order("id").then(({ data }) => {
      if (data && data.length > 0) {
        setClasses(data.map(c => ({ id: c.id, name: c.name, grade: c.grade || "", room: c.room || "", teacher: c.teacher || "", capacity: c.capacity || 25 })));
      }
    });
  }, []);
  useEffect(() => {
    supabase.from("classes").select("*").order("id").then(({ data }) => {
      if (data && data.length > 0) {
        setClasses(data.map(c => ({ id: c.id, name: c.name, grade: c.grade || "", room: c.room || "", teacher: c.teacher || "", capacity: c.capacity || 25 })));
      }
    });
  }, []);
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
    if (modal.mode === "add") {
      supabase.from("classes").insert([{
        name: form.name, grade: form.grade, room: form.room,
        teacher: form.teacher, capacity: form.capacity || 25
      }]).select().then(({ data }) => {
        if (data && data.length > 0) {
          const c = data[0];
          setClasses(prev => [...prev, { id: c.id, name: c.name, grade: c.grade || "", room: c.room || "", teacher: c.teacher || "", capacity: c.capacity || 25 }]);
        }
      });
    } else {
      supabase.from("classes").update({
        name: form.name, grade: form.grade, room: form.room,
        teacher: form.teacher, capacity: form.capacity || 25
      }).eq("id", form.id).then(() => {
        setClasses(prev => prev.map(c => c.id === form.id ? form : c));
      });
    }
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
            <button onClick={() => { supabase.from("classes").delete().eq("id", deleteId).then(() => {
      setClasses(prev => prev.filter(c => c.id !== deleteId));
      setDeleteId(null);
    }); }}
              style={{ padding: "9px 22px", borderRadius: 8, border: "none", background: T.danger, color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Grades Module ───────────────────────────────────────────────────────────
function Grades({ students, classes, subjects, grades, setGrades }) {
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
function Timetable({ classes, subjects, timetable, setTimetable }) {
  const [classId,  setClassId]  = useState(classes[0]?.id || 1);
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
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
function Messaging({ students, classes, messages, setMessages }) {
  const [selected, setSelected]     = useState(null); // selected message id
  const [compose, setCompose]       = useState(false);
  const [replyText, setReplyText]   = useState("");
  const [filterTag, setFilterTag]   = useState("all");
  const [search, setSearch]         = useState("");
  const [form, setForm]             = useState({ studentId: students[0]?.id || "", tag: "general", subject: "", body: "" });
  const [formErrors, setFormErrors] = useState({});

  const filtered = useMemo(() => messages.filter(m => {
    const s = students.find(st => st.id === m.studentId);
    const matchSearch = !search || (s?.name || "").toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase());
    const matchTag = filterTag === "all" || m.tag === filterTag;
    return matchSearch && matchTag;
  }).sort((a, b) => b.timestamp - a.timestamp), [messages, students, search, filterTag]);

  const selectedMsg = messages.find(m => m.id === selected);

  const markRead = (id) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const openMsg = (msg) => {
    setSelected(msg.id);
    setCompose(false);
    setReplyText("");
    if (!msg.read) markRead(msg.id);
  };

  const sendReply = () => {
    if (!replyText.trim()) return;
    const reply = { id: uid(), fromSchool: true, body: replyText.trim(), timestamp: Date.now() };
    setMessages(prev => prev.map(m => m.id === selected
      ? { ...m, replies: [...m.replies, reply] }
      : m
    ));
    setReplyText("");
  };

  const validateCompose = () => {
    const e = {};
    if (!form.studentId) e.studentId = "Required";
    if (!form.subject.trim()) e.subject = "Required";
    if (!form.body.trim())    e.body    = "Required";
    return e;
  };

  const sendNew = () => {
    const e = validateCompose();
    if (Object.keys(e).length) { setFormErrors(e); return; }
    const msg = {
      id: uid(), studentId: parseInt(form.studentId),
      tag: form.tag, subject: form.subject, body: form.body,
      fromSchool: true, timestamp: Date.now(), read: true, replies: [],
    };
    setMessages(prev => [msg, ...prev]);
    setCompose(false);
    setSelected(msg.id);
    setForm({ studentId: students[0]?.id || "", tag: "general", subject: "", body: "" });
    setFormErrors({});
  };

  const unread = messages.filter(m => !m.read).length;

  const fmtTime = (ts) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now - d;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div style={{ display: "flex", gap: 0, background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, overflow: "hidden", boxShadow: T.cardShadow, height: "calc(100vh - 160px)", minHeight: 520 }}>

      {/* ── Left Panel: message list ── */}
      <div style={{ width: 320, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {/* Toolbar */}
        <div style={{ padding: "14px 14px 10px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.textMain }}>
              Inbox
              {unread > 0 && (
                <span style={{ marginRight: 8, background: T.primary, color: "#fff", borderRadius: 20, fontSize: 11, fontWeight: 700, padding: "2px 8px" }}>{unread}</span>
              )}
            </div>
            <button onClick={() => { setCompose(true); setSelected(null); }} style={{
              display: "flex", alignItems: "center", gap: 5, padding: "7px 14px",
              background: T.primary, color: "#fff", border: "none", borderRadius: 8,
              fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
            }}>✏️ Compose</button>
          </div>
          <div style={{ position: "relative", marginBottom: 8 }}>
            <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: T.textMuted }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search messages…" style={{ ...inputStyle, paddingRight: 28, fontSize: 12, padding: "7px 10px 7px 28px" }} />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["all", ...Object.keys(MSG_TAGS)].map(k => (
              <button key={k} onClick={() => setFilterTag(k)} style={{
                padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 500,
                border: "none", cursor: "pointer", fontFamily: "inherit",
                background: filterTag === k ? T.navy : "#f1f5f9",
                color: filterTag === k ? "#fff" : T.textSub,
              }}>{k === "all" ? "All" : MSG_TAGS[k].label}</button>
            ))}
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: T.textMuted, fontSize: 13 }}>No messages found</div>
          ) : filtered.map(msg => {
            const student = students.find(s => s.id === msg.studentId);
            const tag = MSG_TAGS[msg.tag];
            const isActive = selected === msg.id;
            return (
              <div key={msg.id} onClick={() => openMsg(msg)} style={{
                padding: "13px 14px", borderBottom: `1px solid ${T.border}`, cursor: "pointer",
                background: isActive ? "#f0fdf9" : msg.read ? "#fff" : "#f8faff",
                borderLeft: isActive ? `3px solid ${T.primary}` : "3px solid transparent",
                transition: "background .12s",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  {student && <Avatar name={student.name} size={34} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: msg.read ? 500 : 700, color: T.textMain, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {student?.name || "Unknown"}
                      </span>
                      <span style={{ fontSize: 10, color: T.textMuted, flexShrink: 0, marginRight: 6 }}>{fmtTime(msg.timestamp)}</span>
                    </div>
                    <div style={{ fontSize: 12, color: msg.read ? T.textSub : T.textMain, fontWeight: msg.read ? 400 : 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 4 }}>
                      {msg.subject}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 7px", borderRadius: 10, background: tag.bg, color: tag.color }}>{tag.label}</span>
                      <span style={{ fontSize: 10, color: T.textMuted }}>{msg.fromSchool ? "Sent by school" : "From parent"}{msg.replies.length > 0 ? ` · ${msg.replies.length} replies` : ""}</span>
                    </div>
                  </div>
                  {!msg.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.primary, marginTop: 4, flexShrink: 0 }} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right Panel: detail or compose ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, order: 1 }}>
        {compose ? (
          /* Compose Panel */
          <div style={{ flex: 1, padding: 28, overflowY: "auto" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.textMain, marginBottom: 20 }}>✉️ New Message to Parent</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <Field label="Student" error={formErrors.studentId}>
                <select style={formErrors.studentId ? { ...selectStyle, border: "1px solid #ef4444" } : selectStyle}
                  value={form.studentId} onChange={e => { setForm(f => ({ ...f, studentId: e.target.value })); setFormErrors(p => ({ ...p, studentId: "" })); }}>
                  <option value="">— Select student —</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} ({classes.find(c => c.id === s.classId)?.name || ""})</option>)}
                </select>
              </Field>
              <Field label="Tag / Category">
                <select style={selectStyle} value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}>
                  {Object.entries(MSG_TAGS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </Field>
              <div style={{ gridColumn: "1/-1" }}>
                <Field label="Subject" error={formErrors.subject}>
                  <input style={formErrors.subject ? inputErrorStyle : inputStyle} value={form.subject}
                    placeholder="e.g. Absence Notice"
                    onChange={e => { setForm(f => ({ ...f, subject: e.target.value })); setFormErrors(p => ({ ...p, subject: "" })); }} />
                </Field>
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <Field label="Message" error={formErrors.body}>
                  <textarea rows={7} style={{ ...(formErrors.body ? inputErrorStyle : inputStyle), resize: "vertical" }}
                    value={form.body} placeholder="Type your message here…"
                    onChange={e => { setForm(f => ({ ...f, body: e.target.value })); setFormErrors(p => ({ ...p, body: "" })); }} />
                </Field>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
              <button onClick={() => setCompose(false)} style={{
                padding: "9px 20px", borderRadius: 8, border: `1px solid ${T.border}`,
                background: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit",
              }}>Cancel</button>
              <button onClick={sendNew} style={{
                padding: "9px 24px", borderRadius: 8, border: "none",
                background: T.primary, color: "#fff", fontSize: 13,
                fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              }}>Send Message</button>
            </div>
          </div>
        ) : selectedMsg ? (
          /* Message Detail Panel */
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{ padding: "18px 24px", borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                      background: MSG_TAGS[selectedMsg.tag].bg, color: MSG_TAGS[selectedMsg.tag].color,
                    }}>{MSG_TAGS[selectedMsg.tag].label}</span>
                    <span style={{ fontSize: 12, color: T.textMuted }}>{fmtTime(selectedMsg.timestamp)}</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: T.textMain }}>{selectedMsg.subject}</div>
                  <div style={{ fontSize: 12, color: T.textMuted, marginTop: 4 }}>
                    {selectedMsg.fromSchool ? "From: School Administration" : `From: ${students.find(s => s.id === selectedMsg.studentId)?.name}'s Parent`}
                    {" · To: "}{students.find(s => s.id === selectedMsg.studentId)?.name}
                    {" · "}{classes.find(c => c.id === students.find(s => s.id === selectedMsg.studentId)?.classId)?.name}
                  </div>
                </div>
                <button onClick={() => setMessages(prev => prev.filter(m => m.id !== selectedMsg.id))}
                  style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: "#fff", fontSize: 12, cursor: "pointer", color: T.danger }}>
                  🗑 Delete
                </button>
              </div>
            </div>

            {/* Conversation thread */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Original message */}
              <MessageBubble fromSchool={selectedMsg.fromSchool} body={selectedMsg.body} time={fmtTime(selectedMsg.timestamp)}
                student={students.find(s => s.id === selectedMsg.studentId)} />
              {/* Replies */}
              {selectedMsg.replies.map(r => (
                <MessageBubble key={r.id} fromSchool={r.fromSchool} body={r.body} time={fmtTime(r.timestamp)}
                  student={students.find(s => s.id === selectedMsg.studentId)} />
              ))}
            </div>

            {/* Reply box */}
            <div style={{ borderTop: `1px solid ${T.border}`, padding: "14px 24px", flexShrink: 0 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                <textarea rows={2} value={replyText} onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                  placeholder="Type a reply… (Enter to send)"
                  style={{ ...inputStyle, flex: 1, resize: "none", fontSize: 13 }} />
                <button onClick={sendReply} disabled={!replyText.trim()} style={{
                  padding: "10px 20px", borderRadius: 8, border: "none",
                  background: replyText.trim() ? T.primary : "#e2e8f0",
                  color: replyText.trim() ? "#fff" : T.textMuted,
                  fontSize: 13, fontWeight: 600, cursor: replyText.trim() ? "pointer" : "default",
                  fontFamily: "inherit", transition: "all .15s",
                }}>Send ↑</button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, color: T.textMuted }}>
            <div style={{ fontSize: 52 }}>💬</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: T.textMain }}>Parent Messaging</div>
            <div style={{ fontSize: 13, textAlign: "center", maxWidth: 300 }}>Select a message to read it, or compose a new message to a parent.</div>
            <button onClick={() => { setCompose(true); setSelected(null); }} style={{
              padding: "10px 22px", borderRadius: 8, border: "none",
              background: T.primary, color: "#fff", fontSize: 13,
              fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
            }}>✏️ New Message</button>
          </div>
        )}
      </div>
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
              <button onClick={() => exportExamSchedulePDF(exams, classes, subjects)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: '#dbeafe', color: '#1d4ed8', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>📥 Export PDF</button>
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
function loadJsPDF(callback) {
  if (window.jspdf) { callback(); return; }
  const s1 = document.createElement("script");
  s1.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
  s1.onload = () => {
    const s2 = document.createElement("script");
    s2.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js";
    s2.onload = callback;
    document.head.appendChild(s2);
  };
  document.head.appendChild(s1);
}

function exportStudentReportPDF(student, cls, attendance, grades, subjects, exams, examResults) {
  loadJsPDF(() => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const P = [13,148,136], N = [30,30,58];
    const W = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(...N); doc.rect(0,0,W,36,"F");
    doc.setTextColor(255,255,255);
    doc.setFontSize(18); doc.setFont("helvetica","bold");
    doc.text("Al-Huffath Academy", W/2, 14, {align:"center"});
    doc.setFontSize(11); doc.setFont("helvetica","normal");
    doc.text("Student Report Card", W/2, 24, {align:"center"});
    doc.setFontSize(8);
    doc.text(new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}), W/2, 31, {align:"center"});

    let y = 46;

    // Student Info
    doc.setFillColor(240,253,250);
    doc.roundedRect(14,y,W-28,34,3,3,"F");
    doc.setDrawColor(...P); doc.setLineWidth(0.5);
    doc.roundedRect(14,y,W-28,34,3,3,"S");
    doc.setTextColor(...N); doc.setFontSize(13); doc.setFont("helvetica","bold");
    doc.text(student.name, 20, y+10);
    doc.setFontSize(8.5); doc.setFont("helvetica","normal"); doc.setTextColor(100,116,139);
    doc.text("ID: " + student.sid, 20, y+18);
    doc.text("Class: " + (cls?.name||"-"), 20, y+25);
    doc.text("Teacher: " + (cls?.teacher||"-"), 20, y+32);
    doc.text("Gender: " + student.gender, 110, y+18);
    doc.text("Phone: " + student.phone, 110, y+25);
    doc.text("Status: " + student.status, 110, y+32);
    y += 42;

    // Attendance
    const allDates = Object.keys(attendance).sort();
    let p=0,a=0,l=0,ex=0,tot=0;
    allDates.forEach(d => {
      const r = attendance[d]?.[student.id];
      if (!r) return; tot++;
      if (r==="present") p++; else if (r==="absent") a++;
      else if (r==="late") l++; else if (r==="excused") ex++;
    });
    const rate = tot ? Math.round((p/tot)*100) : 0;

    doc.setTextColor(...N); doc.setFontSize(11); doc.setFont("helvetica","bold");
    doc.text("Attendance Summary", 14, y);
    doc.setDrawColor(...P); doc.setLineWidth(0.7); doc.line(14,y+2,78,y+2);
    y += 8;

    const ac = rate>=90?[5,150,105]:rate>=75?[217,119,6]:[220,38,38];
    doc.setFillColor(...ac); doc.roundedRect(14,y,38,18,2,2,"F");
    doc.setTextColor(255,255,255); doc.setFontSize(15); doc.setFont("helvetica","bold");
    doc.text(rate+"%", 33, y+10, {align:"center"});
    doc.setFontSize(7); doc.text("Rate", 33, y+16, {align:"center"});

    [[p,[5,150,105],"Present"],[a,[220,38,38],"Absent"],[l,[217,119,6],"Late"],[ex,[124,58,237],"Excused"]].forEach(([v,c,lb],i) => {
      const bx = 58+i*36;
      doc.setFillColor(...c,20); doc.roundedRect(bx,y,33,18,2,2,"F");
      doc.setTextColor(...c); doc.setFontSize(14); doc.setFont("helvetica","bold");
      doc.text(String(v), bx+16, y+10, {align:"center"});
      doc.setFontSize(7); doc.text(lb, bx+16, y+16, {align:"center"});
    });
    y += 26;

    // Grades
    doc.setTextColor(...N); doc.setFontSize(11); doc.setFont("helvetica","bold");
    doc.text("Academic Performance", 14, y);
    doc.setDrawColor(...P); doc.line(14,y+2,88,y+2);
    y += 8;

    const studentSubs = subjects.filter(s => s.classId===student.classId);
    const gradeRows = studentSubs.map(sub => {
      const g = grades?.[student.id]?.[sub.id] || {};
      const q=g.quiz??null,h=g.homework??null,m=g.midterm??null,f=g.final??null;
      const total = (q!==null||h!==null||m!==null||f!==null)
        ? Math.round((q||0)*0.15+(h||0)*0.15+(m||0)*0.30+(f||0)*0.40) : null;
      const letter = total===null?"—":total>=90?"A":total>=80?"B":total>=70?"C":total>=60?"D":"F";
      return [sub.name, q??"-", h??"-", m??"-", f??"-", total??"-", letter];
    });

    if (gradeRows.length > 0) {
      doc.autoTable({
        startY: y,
        head:[["Subject","Quiz(15%)","HW(15%)","Midterm(30%)","Final(40%)","Total","Grade"]],
        body: gradeRows,
        theme:"grid",
        headStyles:{fillColor:N,textColor:255,fontSize:8,fontStyle:"bold"},
        bodyStyles:{fontSize:8,textColor:N},
        alternateRowStyles:{fillColor:[248,250,252]},
        columnStyles:{6:{fontStyle:"bold",halign:"center"}},
        margin:{left:14,right:14},
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    // Exam Results
    const studentExams = (exams||[]).filter(e => e.classId===student.classId && new Date(e.date+"T00:00:00") < new Date());
    if (studentExams.length > 0) {
      if (y > 220) { doc.addPage(); y=20; }
      doc.setTextColor(...N); doc.setFontSize(11); doc.setFont("helvetica","bold");
      doc.text("Exam Results", 14, y);
      doc.setDrawColor(...P); doc.line(14,y+2,65,y+2);
      y += 8;
      const examRows = studentExams.map(e => {
        const score = examResults?.[e.id]?.[student.id];
        const pct = score!=null ? Math.round((score/e.maxScore)*100) : null;
        return [
          e.title,
          new Date(e.date+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),
          score!=null ? score+"/"+e.maxScore : "-",
          pct!=null ? pct+"%" : "-",
          pct!=null?(pct>=90?"Excellent":pct>=75?"Good":pct>=60?"Pass":"Fail"):"-",
        ];
      });
      doc.autoTable({
        startY:y,
        head:[["Exam","Date","Score","Percentage","Result"]],
        body:examRows,
        theme:"grid",
        headStyles:{fillColor:N,textColor:255,fontSize:8,fontStyle:"bold"},
        bodyStyles:{fontSize:8,textColor:N},
        alternateRowStyles:{fillColor:[248,250,252]},
        margin:{left:14,right:14},
      });
    }

    // Footer
    const pages = doc.internal.getNumberOfPages();
    for (let i=1;i<=pages;i++) {
      doc.setPage(i);
      doc.setFillColor(...N); doc.rect(0,doc.internal.pageSize.getHeight()-12,W,12,"F");
      doc.setTextColor(255,255,255); doc.setFontSize(7);
      doc.text("Al-Huffath Academy | Confidential Student Report", 14, doc.internal.pageSize.getHeight()-5);
      doc.text("Page "+i+" of "+pages, W-14, doc.internal.pageSize.getHeight()-5, {align:"right"});
    }
    doc.save(student.name.replace(/ /g,"_")+"_Report.pdf");
  });
}

function exportExamSchedulePDF(exams, classes, subjects) {
  loadJsPDF(() => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const N = [30,30,58], P = [13,148,136];
    const W = doc.internal.pageSize.getWidth();

    doc.setFillColor(...N); doc.rect(0,0,W,36,"F");
    doc.setTextColor(255,255,255);
    doc.setFontSize(18); doc.setFont("helvetica","bold");
    doc.text("Al-Huffath Academy", W/2, 14, {align:"center"});
    doc.setFontSize(11); doc.text("Exam Schedule", W/2, 24, {align:"center"});
    doc.setFontSize(8); doc.setFont("helvetica","normal");
    doc.text(new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}), W/2, 31, {align:"center"});

    const today = new Date().toISOString().split("T")[0];
    const rows = [...exams].sort((a,b)=>a.date.localeCompare(b.date)).map(ex => {
      const cls = classes.find(c=>c.id===ex.classId);
      const sub = subjects.find(s=>s.id===ex.subjectId);
      const status = ex.date>today?"Upcoming":ex.date===today?"Today":"Completed";
      return [
        new Date(ex.date+"T00:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric"}),
        ex.title, cls?.name||"-", sub?.name||"-",
        ex.type.charAt(0).toUpperCase()+ex.type.slice(1),
        ex.duration+" min", "Room "+ex.room, status
      ];
    });

    doc.autoTable({
      startY:44,
      head:[["Date","Exam","Class","Subject","Type","Duration","Room","Status"]],
      body:rows,
      theme:"grid",
      headStyles:{fillColor:N,textColor:255,fontSize:8,fontStyle:"bold"},
      bodyStyles:{fontSize:7.5,textColor:N},
      alternateRowStyles:{fillColor:[248,250,252]},
      margin:{left:10,right:10},
      didParseCell:(d)=>{
        if(d.section==="body"&&d.column.index===7){
          const v=d.cell.raw;
          d.cell.styles.textColor=v==="Upcoming"?P:v==="Today"?[217,119,6]:[100,116,139];
          if(v!=="Completed") d.cell.styles.fontStyle="bold";
        }
      },
    });

    const pages = doc.internal.getNumberOfPages();
    for (let i=1;i<=pages;i++) {
      doc.setPage(i);
      doc.setFillColor(...N); doc.rect(0,doc.internal.pageSize.getHeight()-12,W,12,"F");
      doc.setTextColor(255,255,255); doc.setFontSize(7);
      doc.text("Al-Huffath Academy | Exam Schedule", 10, doc.internal.pageSize.getHeight()-5);
      doc.text("Page "+i+" of "+pages, W-10, doc.internal.pageSize.getHeight()-5, {align:"right"});
    }
    doc.save("Exam_Schedule_"+new Date().toISOString().split("T")[0]+".pdf");
  });
}

// ─── App Root ─────────────────────────────────────────────────────────────────
function LogoutButton() {
  const handleLogout = () => {
    try { localStorage.removeItem("edu_auth") } catch {}
    localStorage.clear(); window.location.href = "/school/login";
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
  const [page, setPage] = useState("dashboard");
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("edu_auth");
      if (!stored) { window.location.href = "/school/login"; return; }
      setAuth(JSON.parse(stored));
    } catch { localStorage.clear(); window.location.href = "/school/login"; }
  }, []);

  const userRole   = auth?.role     || "admin";
  const teacherClassId = auth?.classId || null;   // classId for teacher
  const teacherName    = auth?.name    || "";

  // ─── Teacher: pages allowed ───────────────────────────────────────────────
  const TEACHER_PAGES = ["dashboard", "attendance", "grades", "timetable", "messages"];
  const PARENT_PAGES  = ["dashboard"];

  const allowedPages = userRole === "teacher" ? TEACHER_PAGES
                     : userRole === "parent"  ? PARENT_PAGES
                     : null; // admin: all pages

  const effectivePage = allowedPages && !allowedPages.includes(page)
    ? "dashboard"
    : page;

  // localStorage persistence — load on mount, save on change
  const [students, setStudents] = useState(SEED_STUDENTS);
  useEffect(() => {
    supabase.from("students").select("*").order("id").then(({ data }) => {
      if (data && data.length > 0)
        setStudents(data.map(s => ({ id: s.id, name: s.name, sid: s.sid, classId: s.class_id, gender: s.gender, phone: s.phone, status: s.status })));
    });
  }, []);
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
