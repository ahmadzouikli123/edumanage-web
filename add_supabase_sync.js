const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

// Step 1: Add import at top
const oldImport = `import { useState, useMemo, useEffect, useCallback } from "react";`;
const newImport = `import { useState, useMemo, useEffect, useCallback } from "react";
import { syncStudents, loadStudents, syncTeachers, loadTeachers, syncClasses, loadClasses, syncAttendance, loadAttendance, syncMessages, loadMessages } from "../lib/db";`;

if (content.includes(oldImport)) {
  content = content.replace(oldImport, newImport);
  console.log('Step 1: import added!');
} else { console.log('ERROR step 1'); }

fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');
console.log('Done!');
