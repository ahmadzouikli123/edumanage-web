# -*- coding: utf-8 -*-
path = "src/components/SchoolApp.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Add supabase import at top
old_import = 'import { useState, useMemo, useEffect, useCallback } from "react";'
new_import = '''import { useState, useMemo, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);'''

content = content.replace(old_import, new_import)

# Replace localStorage students load with Supabase fetch
old_students = '  const [students, setStudents]     = useState(() => load("edu_students",   SEED_STUDENTS));'
new_students = '''  const [students, setStudents]     = useState(SEED_STUDENTS);
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
  }, []);'''

content = content.replace(old_students, new_students)

# Replace localStorage classes load with Supabase fetch
old_classes = '  const [classes,  setClasses]      = useState(() => load("edu_classes",    SEED_CLASSES));'
new_classes = '''  const [classes,  setClasses]      = useState(SEED_CLASSES);
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
  }, []);'''

content = content.replace(old_classes, new_classes)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Done!")
