# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

# 1. Remove dashboard from TEACHER_PAGES and set default to attendance
old_teacher_pages = 'const TEACHER_PAGES = ["attendance", "grades", "timetable", "messages"];'
new_teacher_pages = 'const TEACHER_PAGES = ["attendance", "grades", "timetable", "messages"];'

# 2. Fix default page for teachers
old_default = 'const [page, setPage] = useState("dashboard");'
new_default = 'const [page, setPage] = useState("dashboard");'

# 3. Fix effectivePage to redirect teacher from dashboard to attendance
old_effective = '''  const effectivePage = allowedPages && !allowedPages.includes(page)
    ? "dashboard"
    : page;'''
new_effective = '''  const effectivePage = allowedPages && !allowedPages.includes(page)
    ? allowedPages[0]
    : page;'''

# 4. Set initial page based on role
old_use_effect_auth = '''  useEffect(() => {
    try {
      const stored = localStorage.getItem("edu_auth");
      if (!stored) { window.location.href = "/school/login"; return; }
      setAuth(JSON.parse(stored));
    } catch { localStorage.clear(); window.location.href = "/school/login"; }
  }, []);'''

new_use_effect_auth = '''  useEffect(() => {
    try {
      const stored = localStorage.getItem("edu_auth");
      if (!stored) { window.location.href = "/school/login"; return; }
      const parsedAuth = JSON.parse(stored);
      setAuth(parsedAuth);
      if (parsedAuth.role === "teacher") setPage("attendance");
    } catch { localStorage.clear(); window.location.href = "/school/login"; }
  }, []);'''

fixes = [
    (old_effective,       new_effective,       'effectivePage fixed!'),
    (old_use_effect_auth, new_use_effect_auth, 'Default page for teacher set to attendance!'),
]

for old, new, msg in fixes:
    if old in content:
        content = content.replace(old, new)
        print(msg)
    else:
        print(f'ERROR: not found -> {msg}')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
