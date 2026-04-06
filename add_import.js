const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

const oldImport = 'import { useState, useMemo, useEffect, useCallback } from "react";';
const newImport = 'import { useState, useMemo, useEffect, useCallback } from "react";\nimport { syncStudents, loadStudents, syncTeachers, loadTeachers, syncClasses, loadClasses, syncAttendance, loadAttendance, syncMessages, loadMessages } from "../lib/db";';

if (content.includes(oldImport)) { content = content.replace(oldImport, newImport); console.log('Import added!'); }
else { console.log('ERROR'); }

fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');