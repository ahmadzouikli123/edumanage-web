const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

// Sync students
content = content.replace(
  'useEffect(() => { save("edu_students", students); if (dbReady) syncStudents(students); }, [students]);',
  'useEffect(() => { save("edu_students", students); if (dbReady) syncStudents(students); }, [students]);'
);

// Fix save effects
content = content.replace(
  'useEffect(() => { save("edu_students",    students);    }, [students]);\r\n  useEffect(() => { save("edu_teachers",     teachers);     }, [teachers]);',
  'useEffect(() => { save("edu_students", students); if (dbReady) syncStudents(students); }, [students]);\r\n  useEffect(() => { save("edu_teachers", teachers); if (dbReady) syncTeachers(teachers); }, [teachers]);'
);
content = content.replace(
  'useEffect(() => { save("edu_classes",     classes);     }, [classes]);',
  'useEffect(() => { save("edu_classes", classes); if (dbReady) syncClasses(classes); }, [classes]);'
);
content = content.replace(
  'useEffect(() => { save("edu_attendance",  attendance);  }, [attendance]);',
  'useEffect(() => { save("edu_attendance", attendance); if (dbReady) syncAttendance(attendance); }, [attendance]);'
);
content = content.replace(
  'useEffect(() => { save("edu_messages",    messages);    }, [messages]);',
  'useEffect(() => { save("edu_messages", messages); if (dbReady) syncMessages(messages); }, [messages]);'
);

fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');
console.log('Sync effects added!');