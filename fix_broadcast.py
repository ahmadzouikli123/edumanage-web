# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

# 1. Update form state to include recipientType
old_form_state = '  const [form, setForm]             = useState({ studentId: students[0]?.id || "", tag: "general", subject: "", body: "" });'
new_form_state = '  const [form, setForm]             = useState({ recipientType: "student", studentId: students[0]?.id || "", classId: "", tag: "general", subject: "", body: "" });'

# 2. Update sendNew to handle class/school broadcast
old_send = '''    supabase.from("messages").insert([{
      student_id: parseInt(form.studentId),
      tag: form.tag,
      subject: form.subject,
      body: form.body,
      from_school: true,
      read: true,
      replies: [],
    }]).select().then(({ data, error }) => {
      if (error) { alert("Send failed: " + error.message); return; }
      if (data && data.length > 0) {
        const r = data[0];
        const msg = { id: r.id, studentId: r.student_id, tag: r.tag, subject: r.subject, body: r.body, fromSchool: r.from_school, timestamp: new Date(r.created_at).getTime(), read: r.read, replies: r.replies || [] };
        setMessages(prev => [msg, ...prev]);
        setSelected(msg.id);
      }
    });
    setCompose(false);
    setForm({ studentId: students[0]?.id || "", tag: "general", subject: "", body: "" });
    setFormErrors({});
  };'''

new_send = '''    // Determine recipients
    let recipients = [];
    if (form.recipientType === "student") {
      recipients = [parseInt(form.studentId)];
    } else if (form.recipientType === "class") {
      recipients = students.filter(s => s.classId === parseInt(form.classId)).map(s => s.id);
    } else if (form.recipientType === "school") {
      recipients = students.map(s => s.id);
    }
    if (!recipients.length) { alert("No recipients found!"); return; }
    const records = recipients.map(sid => ({
      student_id: sid, tag: form.tag, subject: form.subject,
      body: form.body, from_school: true, read: true, replies: [],
    }));
    supabase.from("messages").insert(records).select().then(({ data, error }) => {
      if (error) { alert("Send failed: " + error.message); return; }
      if (data) {
        const newMsgs = data.map(r => ({ id: r.id, studentId: r.student_id, tag: r.tag, subject: r.subject, body: r.body, fromSchool: r.from_school, timestamp: new Date(r.created_at).getTime(), read: r.read, replies: r.replies || [] }));
        setMessages(prev => [...newMsgs, ...prev]);
        if (newMsgs.length === 1) setSelected(newMsgs[0].id);
      }
    });
    setCompose(false);
    setForm({ recipientType: "student", studentId: students[0]?.id || "", classId: "", tag: "general", subject: "", body: "" });
    setFormErrors({});
  };'''

# 3. Update compose form UI - replace Student selector with recipient type
old_compose_ui = '''<Field label="Student" error={formErrors.studentId}>
                <select style={formErrors.studentId ? { ...selectStyle, border: "1px solid #ef4444" } : selectStyle}
                  value={form.studentId} onChange={e => { setForm(f => ({ ...f, studentId: e.target.value })); setFormErrors(p => ({ ...p, studentId: "" })); }}>
                  <option value="">— Select student —</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} ({classes.find(c => c.id === s.classId)?.name || ""})</option>)}
                </select>
              </Field>'''

new_compose_ui = '''<Field label="Send To">
                <select style={selectStyle} value={form.recipientType} onChange={e => setForm(f => ({ ...f, recipientType: e.target.value }))}>
                  <option value="student">Individual Student</option>
                  <option value="class">Entire Class</option>
                  <option value="school">Whole School</option>
                </select>
              </Field>
              {form.recipientType === "student" && (
                <Field label="Student" error={formErrors.studentId}>
                  <select style={formErrors.studentId ? { ...selectStyle, border: "1px solid #ef4444" } : selectStyle}
                    value={form.studentId} onChange={e => { setForm(f => ({ ...f, studentId: e.target.value })); setFormErrors(p => ({ ...p, studentId: "" })); }}>
                    <option value="">— Select student —</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.name} ({classes.find(c => c.id === s.classId)?.name || ""})</option>)}
                  </select>
                </Field>
              )}
              {form.recipientType === "class" && (
                <Field label="Class">
                  <select style={selectStyle} value={form.classId} onChange={e => setForm(f => ({ ...f, classId: e.target.value }))}>
                    <option value="">— Select class —</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name} ({students.filter(s => s.classId === c.id).length} students)</option>)}
                  </select>
                </Field>
              )}
              {form.recipientType === "school" && (
                <Field label="Recipients">
                  <div style={{ ...inputStyle, color: "#0d9488", fontWeight: 600 }}>All {students.length} students in the school</div>
                </Field>
              )}'''

# 4. Update validate to handle recipientType
old_validate = '''  const validateCompose = () => {
    const e = {};
    if (!form.studentId) e.studentId = "Required";
    if (!form.subject.trim()) e.subject = "Required";
    if (!form.body.trim())    e.body    = "Required";
    return e;
  };'''

new_validate = '''  const validateCompose = () => {
    const e = {};
    if (form.recipientType === "student" && !form.studentId) e.studentId = "Required";
    if (form.recipientType === "class" && !form.classId) e.classId = "Required";
    if (!form.subject.trim()) e.subject = "Required";
    if (!form.body.trim())    e.body    = "Required";
    return e;
  };'''

fixes = [
    (old_form_state,   new_form_state,   'Form state updated!'),
    (old_send,         new_send,         'sendNew updated!'),
    (old_compose_ui,   new_compose_ui,   'Compose UI updated!'),
    (old_validate,     new_validate,     'Validate updated!'),
]

for old, new, msg in fixes:
    if old in content:
        content = content.replace(old, new)
        print(msg)
    else:
        print(f'ERROR: not found -> {msg}')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
