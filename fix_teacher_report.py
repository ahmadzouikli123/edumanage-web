# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

# 1. Add start_date field to form
old_form_inputs = '''            <input name="name" defaultValue={editing?.name} placeholder="Name" required className="w-full p-2 border rounded mb-3" />
            <input name="subject" defaultValue={editing?.subject} placeholder="Subject" required className="w-full p-2 border rounded mb-3" />
            <input name="email" defaultValue={editing?.email} placeholder="Email" type="email" className="w-full p-2 border rounded mb-3" />
            <input name="phone" defaultValue={editing?.phone} placeholder="Phone" className="w-full p-2 border rounded mb-3" />'''

new_form_inputs = '''            <input name="name" defaultValue={editing?.name} placeholder="Name" required className="w-full p-2 border rounded mb-3" />
            <input name="subject" defaultValue={editing?.subject} placeholder="Subject" required className="w-full p-2 border rounded mb-3" />
            <input name="email" defaultValue={editing?.email} placeholder="Email" type="email" className="w-full p-2 border rounded mb-3" />
            <input name="phone" defaultValue={editing?.phone} placeholder="Phone" className="w-full p-2 border rounded mb-3" />
            <label className="block text-sm text-gray-600 mb-1">Start Date</label>
            <input name="startDate" defaultValue={editing?.startDate} type="date" className="w-full p-2 border rounded mb-3" />'''

# 2. Update handleSave to include start_date
old_update = '''      supabase.from("teachers").update({
        name: newTeacher.name, subject: newTeacher.subject,
        phone: newTeacher.phone, email: newTeacher.email, status: newTeacher.status,
        class_ids: classIds,
      }).eq("id", editing.id).then(() => {
        setTeachers(teachers.map(t => t.id === editing.id ? { ...newTeacher, classIds } : t));
      });'''

new_update = '''      const checkboxes2 = Array.from(e.target.querySelectorAll('input[name="classIds"]:checked'));
      const classIds2 = checkboxes2.map(cb => parseInt(cb.value));
      supabase.from("teachers").update({
        name: newTeacher.name, subject: newTeacher.subject,
        phone: newTeacher.phone, email: newTeacher.email, status: newTeacher.status,
        class_ids: classIds2, start_date: form.target?.startDate?.value || newTeacher.startDate || null,
      }).eq("id", editing.id).then(() => {
        setTeachers(teachers.map(t => t.id === editing.id ? { ...newTeacher, classIds: classIds2 } : t));
      });'''

# 3. Update newTeacher to include startDate
old_new_teacher = '''    const newTeacher = {
      id: editing ? editing.id : Date.now(),
      name: form.name.value,
      subject: form.subject.value,
      phone: form.phone.value,
      email: form.email.value,
      status: form.status.value,
    };'''

new_new_teacher = '''    const newTeacher = {
      id: editing ? editing.id : Date.now(),
      name: form.name.value,
      subject: form.subject.value,
      phone: form.phone.value,
      email: form.email.value,
      status: form.status.value,
      startDate: form.startDate?.value || "",
    };'''

# 4. Update fetch to include start_date
old_fetch = '''        id: t.id, name: t.name, username: t.username,
        password: t.password, subject: t.subject,
        classIds: t.class_ids || [], phone: t.phone,
        email: t.email, status: t.status'''

new_fetch = '''        id: t.id, name: t.name, username: t.username,
        password: t.password, subject: t.subject,
        classIds: t.class_ids || [], phone: t.phone,
        email: t.email, status: t.status,
        startDate: t.start_date || ""'''

# 5. Add report button to teacher card
old_edit_btn = '''                  <button 
                    onClick={() => { setEditing(teacher); setShowForm(true); }}
                    className="text-blue-600 hover:underline"
                  >Edit</button>
                  <button 
                    onClick={() => handleDelete(teacher.id)}
                    className="text-red-600 hover:underline"
                  >Delete</button>'''

new_edit_btn = '''                  <button 
                    onClick={() => { setEditing(teacher); setShowForm(true); }}
                    className="text-blue-600 hover:underline"
                  >Edit</button>
                  <button 
                    onClick={() => handleDelete(teacher.id)}
                    className="text-red-600 hover:underline"
                  >Delete</button>
                  <button
                    onClick={() => {
                      const today = new Date().toLocaleDateString("en-GB");
                      const startDate = teacher.startDate ? new Date(teacher.startDate).toLocaleDateString("en-GB") : "N/A";
                      const clsNames = (teacher.classIds || []).map(id => {
                        const cls = (classes || []).find(c => c.id === parseInt(id));
                        return cls ? cls.name : id;
                      }).join(", ") || "Not assigned";
                      const win = window.open("", "_blank");
                      win.document.write(
                        "<html><head><title>Teacher Report</title>" +
                        "<style>body{font-family:Arial;padding:30px;color:#1e1e3a}h1{color:#0d9488;border-bottom:2px solid #0d9488;padding-bottom:8px}table{width:100%;border-collapse:collapse;margin-top:16px}td,th{border:1px solid #e2e8f0;padding:10px 14px;text-align:left}th{background:#f1f5f9;font-weight:600;width:40%}@media print{button{display:none}}</style>" +
                        "</head><body>" +
                        "<h1>Teacher Report</h1>" +
                        "<table>" +
                        "<tr><th>Full Name</th><td>" + teacher.name + "</td></tr>" +
                        "<tr><th>Subject</th><td>" + (teacher.subject || "-") + "</td></tr>" +
                        "<tr><th>Email</th><td>" + (teacher.email || "-") + "</td></tr>" +
                        "<tr><th>Phone</th><td>" + (teacher.phone || "-") + "</td></tr>" +
                        "<tr><th>Status</th><td>" + (teacher.status || "-") + "</td></tr>" +
                        "<tr><th>Start Date</th><td>" + startDate + "</td></tr>" +
                        "<tr><th>Assigned Classes</th><td>" + clsNames + "</td></tr>" +
                        "<tr><th>Report Date</th><td>" + today + "</td></tr>" +
                        "</table>" +
                        "<br><button onclick='window.print()' style='padding:10px 24px;background:#0d9488;color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer'>Print Report</button>" +
                        "<p style='margin-top:40px;font-size:11px;color:#94a3b8;text-align:center'>Generated by EduManage | Developed by Eng. Ahmad Zouikli | " + today + "</p>" +
                        "</body></html>"
                      );
                      win.document.close();
                    }}
                    className="text-green-600 hover:underline"
                  >Report</button>'''

fixes = [
    (old_form_inputs, new_form_inputs, 'Start date field added!'),
    (old_new_teacher, new_new_teacher, 'newTeacher updated!'),
    (old_fetch,       new_fetch,       'Fetch updated!'),
    (old_edit_btn,    new_edit_btn,    'Report button added!'),
]

for old, new, msg in fixes:
    if old in content:
        content = content.replace(old, new)
        print(msg)
    else:
        print(f'ERROR: not found -> {msg}')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
