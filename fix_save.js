const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

// Step 2: update handleSave
const oldSave = "    const newTeacher = {\r\n      id: editing ? editing.id : Date.now(),\r\n      name: form.name.value,\r\n      subject: form.subject.value,\r\n      phone: form.phone.value,\r\n      email: form.email.value,\r\n      status: form.status.value,\r\n    };";
const newSave = "    const checkedClasses = Array.from(form.querySelectorAll('input[name=\"classIds\"]:checked')).map(cb => parseInt(cb.value));\r\n    const newTeacher = {\r\n      id: editing ? editing.id : Date.now(),\r\n      name: form.name.value,\r\n      subject: form.subject.value,\r\n      phone: form.phone.value,\r\n      email: form.email.value,\r\n      status: form.status.value,\r\n      startDate: form.startDate.value,\r\n      classIds: checkedClasses,\r\n    };";

if (content.includes(oldSave)) { content = content.replace(oldSave, newSave); console.log('Step 2 fixed!'); }
else { console.log('ERROR step 2'); }

fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');