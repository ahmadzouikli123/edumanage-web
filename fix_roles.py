path = "src/components/SchoolApp.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# ─── Fix 1: استبدل userRole الثابت بقراءة من auth ───────────────────────────
old_app = '''export default function App() {
  const userRole = "admin";
  const [page, setPage] = useState("dashboard");

  const [auth, setAuth] = useState(null);
  useEffect(() => {
    try {
      const stored = localStorage.getItem("edu_auth");
      if (!stored) { localStorage.clear(); window.location.href = "/school/login"; return; }
      setAuth(JSON.parse(stored));
    } catch { localStorage.clear(); window.location.href = "/school/login"; }
  }, []);'''

new_app = '''export default function App() {
  const [page, setPage] = useState("dashboard");
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("edu_auth");
      if (!stored) { localStorage.clear(); window.location.href = "/school/login"; return; }
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
    : page;'''

content = content.replace(old_app, new_app)

# ─── Fix 2: فلتر الـ NAV حسب الـ role ────────────────────────────────────────
# Find the nav render section and update it
old_nav_render = '''        <nav style={{ flex: 1, padding: "14px 10px", display: "flex", flexDirection: "column", gap: 3 }}>
          {NAV.map(n => {
            const unreadCount = n.id === "messages" ? messages.filter(m => !m.read).length : 0;
            return (
            <button key={n.id} onClick={() => setPage(n.id)} style={{'''

new_nav_render = '''        <nav style={{ flex: 1, padding: "14px 10px", display: "flex", flexDirection: "column", gap: 3 }}>
          {NAV.filter(n => !allowedPages || allowedPages.includes(n.id)).map(n => {
            const unreadCount = n.id === "messages" ? messages.filter(m => !m.read).length : 0;
            return (
            <button key={n.id} onClick={() => setPage(n.id)} style={{'''

content = content.replace(old_nav_render, new_nav_render)

# ─── Fix 3: فلتر البيانات للمعلم ─────────────────────────────────────────────
# Update page renders to pass filtered data for teacher
old_pages = '''          {page === "dashboard"  && <Dashboard  students={students} classes={classes} attendance={attendance} grades={grades} subjects={subjects} timetable={timetable} messages={messages} exams={exams} onNavigate={setPage} />}
          {page === "students"   && <Students   students={students} setStudents={setStudents} classes={classes} attendance={attendance} grades={grades} subjects={subjects} exams={exams} examResults={examResults} />}
          {page === "classes"    && <Classes    classes={classes}   setClasses={setClasses}   students={students} />}
          {page === "attendance" && <Attendance students={students} classes={classes} attendance={attendance} setAttendance={setAttendance} />}
          {page === "grades"     && <Grades     students={students} classes={classes} subjects={subjects} grades={grades} setGrades={setGrades} />}
          {page === "timetable"  && <Timetable  classes={classes} subjects={subjects} timetable={timetable} setTimetable={setTimetable} />}
          {page === "messages"   && <Messaging  students={students} classes={classes} messages={messages} setMessages={setMessages} />}'''

new_pages = '''          {(() => {
            // فلترة البيانات حسب دور المعلم
            const visStudents = userRole === "teacher" && teacherClassId
              ? students.filter(s => s.classId === teacherClassId)
              : students;
            const visClasses = userRole === "teacher" && teacherClassId
              ? classes.filter(c => c.id === teacherClassId)
              : classes;
            return (<>
          {effectivePage === "dashboard"  && <Dashboard  students={visStudents} classes={visClasses} attendance={attendance} grades={grades} subjects={subjects} timetable={timetable} messages={messages} exams={exams} onNavigate={setPage} userRole={userRole} teacherName={teacherName} />}
          {effectivePage === "students"   && <Students   students={visStudents} setStudents={setStudents} classes={visClasses} attendance={attendance} grades={grades} subjects={subjects} exams={exams} examResults={examResults} />}
          {effectivePage === "classes"    && <Classes    classes={visClasses}   setClasses={setClasses}   students={visStudents} />}
          {effectivePage === "attendance" && <Attendance students={visStudents} classes={visClasses} attendance={attendance} setAttendance={setAttendance} />}
          {effectivePage === "grades"     && <Grades     students={visStudents} classes={visClasses} subjects={subjects} grades={grades} setGrades={setGrades} />}
          {effectivePage === "timetable"  && <Timetable  classes={visClasses} subjects={subjects} timetable={timetable} setTimetable={setTimetable} />}
          {effectivePage === "messages"   && <Messaging  students={visStudents} classes={visClasses} messages={messages} setMessages={setMessages} />}
            </>);
          })()}'''

content = content.replace(old_pages, new_pages)

# ─── Fix 4: حذف التكرار في Teachers render ───────────────────────────────────
import re
# Keep only one Teachers render
content = re.sub(
    r'(\{(?:page|effectivePage) === "teachers"[^\n]+\})\s*\n\s*\{(?:page|effectivePage) === "teachers"[^\n]+\}',
    r'\1',
    content
)

# ─── Fix 5: تحديث Teachers render ────────────────────────────────────────────
content = content.replace(
    '{page === "teachers"  && <Teachers userRole={userRole} />}',
    '{effectivePage === "teachers"  && userRole === "admin" && <Teachers userRole={userRole} teachers={teachers} setTeachers={setTeachers} classes={classes} subjects={subjects} />}'
)

# ─── Fix 6: إظهار معلومات المعلم في الـ sidebar ──────────────────────────────
old_sidebar_user = '''          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <Avatar name="Admin User" size={30} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,.8)" }}>Admin</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)" }}>admin@school.edu</div>
            </div>
          </div>'''

new_sidebar_user = '''          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <Avatar name={auth?.name || "User"} size={30} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,.8)" }}>{auth?.name || "User"}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)", textTransform: "capitalize" }}>{userRole}</div>
            </div>
          </div>
          <button onClick={() => { localStorage.removeItem("edu_auth"); window.location.href = "/school/login"; }}
            style={{ marginTop: 8, width: "100%", padding: "7px 0", borderRadius: 8, border: "1px solid rgba(255,255,255,.1)", background: "transparent", color: "rgba(255,255,255,.4)", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
            Sign Out
          </button>'''

content = content.replace(old_sidebar_user, new_sidebar_user)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Done!")

# Verify
print("userRole hardcoded:", 'const userRole = "admin"' in content)
print("effectivePage:", 'effectivePage' in content)
print("allowedPages:", 'allowedPages' in content)
print("visStudents:", 'visStudents' in content)
