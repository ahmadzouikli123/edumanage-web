const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolApp.jsx', 'utf8');

// Step 1: add classes prop
const oldFn = "function Teachers({ userRole }) {";
const newFn = "function Teachers({ userRole, classes = [] }) {";
if (content.includes(oldFn)) { content = content.replace(oldFn, newFn); console.log('Step 1: classes prop added!'); }
else { console.log('ERROR step 1'); }

// Step 2: update handleSave to include startDate and classIds
const oldSave = `    const newTeacher = {
      id: editing ? editing.id : Date.now(),
      name: form.name.value,
      subject: form.subject.value,
      phone: form.phone.value,
      email: form.email.value,
      status: form.status.value,
    };`;
const newSave = `    const checkedClasses = Array.from(form.querySelectorAll('input[name="classIds"]:checked')).map(cb => parseInt(cb.value));
    const newTeacher = {
      id: editing ? editing.id : Date.now(),
      name: form.name.value,
      subject: form.subject.value,
      phone: form.phone.value,
      email: form.email.value,
      status: form.status.value,
      startDate: form.startDate.value,
      classIds: checkedClasses,
    };`;
if (content.includes(oldSave)) { content = content.replace(oldSave, newSave); console.log('Step 2: handleSave updated!'); }
else { console.log('ERROR step 2'); }

// Step 3: update form UI
const oldForm = `            <select name="status" defaultValue={editing?.status || "active"} className="w-full p-2 border rounded mb-4">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="flex gap-2">`;
const newForm = `            <select name="status" defaultValue={editing?.status || "active"} className="w-full p-2 border rounded mb-3">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <label className="block text-sm font-medium text-slate-600 mb-1">Start Date</label>
            <input name="startDate" type="date" defaultValue={editing?.startDate} className="w-full p-2 border rounded mb-3" />
            {classes.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 mb-2">Assigned Classes</label>
                <div className="border rounded p-2 max-h-36 overflow-y-auto flex flex-col gap-1">
                  {classes.map(cls => (
                    <label key={cls.id} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input type="checkbox" name="classIds" value={cls.id}
                        defaultChecked={(editing?.classIds||[]).map(x=>parseInt(x)).includes(cls.id)} />
                      {cls.name}
                    </label>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2">`;
if (content.includes(oldForm)) { content = content.replace(oldForm, newForm); console.log('Step 3: form UI updated!'); }
else { console.log('ERROR step 3'); }

fs.writeFileSync('src/components/SchoolApp.jsx', content, 'utf8');