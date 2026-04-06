const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

const oldLoad = "  useEffect(() => {\r\n    supabase.from(\"classes\").select(\"*\").then(({ data }) => {\r\n      if (data && data.length > 0) {\r\n        const mapped = data.map(c => ({\r\n          id: c.id, name: c.name, grade: c.grade,\r\n          room: c.room, teacher: c.teacher, capacity: c.capacity || 25,\r\n        }));\r\n        setClasses(mapped);\r\n        save(\"edu_classes\", mapped);\r\n      }\r\n    });\r\n  }, []);";

const newLoad = "  useEffect(() => {\r\n    async function loadFromDb() {\r\n      try {\r\n        const [dbStudents, dbTeachers, dbClasses, dbAttendance, dbMessages] = await Promise.all([\r\n          loadStudents(), loadTeachers(), loadClasses(), loadAttendance(), loadMessages()\r\n        ]);\r\n        if (dbStudents && dbStudents.length > 0) { setStudents(dbStudents); save('edu_students', dbStudents); }\r\n        if (dbTeachers && dbTeachers.length > 0) { setTeachers(dbTeachers); save('edu_teachers', dbTeachers); }\r\n        if (dbClasses && dbClasses.length > 0) { setClasses(dbClasses); save('edu_classes', dbClasses); }\r\n        if (dbAttendance && Object.keys(dbAttendance).length > 0) { setAttendance(dbAttendance); save('edu_attendance', dbAttendance); }\r\n        if (dbMessages && dbMessages.length > 0) { setMessages(dbMessages); save('edu_messages', dbMessages); }\r\n        setDbReady(true);\r\n      } catch(e) { console.error('Supabase load error:', e); setDbReady(true); }\r\n    }\r\n    loadFromDb();\r\n  }, []);";

if (content.includes(oldLoad)) { content = content.replace(oldLoad, newLoad); console.log('Load fixed!'); }
else { console.log('ERROR: not found!'); }

fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');