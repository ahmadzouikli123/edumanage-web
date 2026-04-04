# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

# 1. Fix sendNew to save to Supabase
old_send = '''    const msg = {
      id: uid(), studentId: parseInt(form.studentId),
      tag: form.tag, subject: form.subject, body: form.body,
      fromSchool: true, timestamp: Date.now(), read: true, replies: [],
    };
    setMessages(prev => [msg, ...prev]);
    setCompose(false);
    setSelected(msg.id);
    setForm({ studentId: students[0]?.id || "", tag: "general", subject: "", body: "" });
    setFormErrors({});
  };'''

new_send = '''    supabase.from("messages").insert([{
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

# 2. Fix markRead to save to Supabase
old_mark = '''  const markRead = (id) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };'''

new_mark = '''  const markRead = (id) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    supabase.from("messages").update({ read: true }).eq("id", id).then(({ error }) => {
      if (error) console.error("markRead error:", error.message);
    });
  };'''

# 3. Fix sendReply to save to Supabase
old_reply = '''  const sendReply = () => {
    if (!replyText.trim()) return;
    const reply = { id: uid(), fromSchool: true, body: replyText.trim(), timestamp: Date.now() };
    setMessages(prev => prev.map(m => m.id === selected
      ? { ...m, replies: [...m.replies, reply] }
      : m
    ));
    setReplyText("");
  };'''

new_reply = '''  const sendReply = () => {
    if (!replyText.trim()) return;
    const reply = { id: uid(), fromSchool: true, body: replyText.trim(), timestamp: Date.now() };
    const updatedReplies = [...(selectedMsg?.replies || []), reply];
    setMessages(prev => prev.map(m => m.id === selected ? { ...m, replies: updatedReplies } : m));
    supabase.from("messages").update({ replies: updatedReplies }).eq("id", selected).then(({ error }) => {
      if (error) console.error("reply error:", error.message);
    });
    setReplyText("");
  };'''

# 4. Add useEffect to fetch messages from Supabase
old_func = 'function Messaging({ students, classes, messages, setMessages }) {'
new_func = '''function Messaging({ students, classes, messages, setMessages, userRole, teacherName }) {
  useEffect(() => {
    supabase.from("messages").select("*").order("created_at", { ascending: false }).then(({ data, error }) => {
      if (error) { console.error(error); return; }
      if (!data) return;
      setMessages(data.map(r => ({
        id: r.id, studentId: r.student_id, tag: r.tag,
        subject: r.subject, body: r.body, fromSchool: r.from_school,
        timestamp: new Date(r.created_at).getTime(),
        read: r.read, replies: r.replies || [],
      })));
    });
  }, []);'''

fixes = [
    (old_send,  new_send,  'sendNew fixed!'),
    (old_mark,  new_mark,  'markRead fixed!'),
    (old_reply, new_reply, 'sendReply fixed!'),
    (old_func,  new_func,  'Messaging fetch added!'),
]

for old, new, msg in fixes:
    if old in content:
        content = content.replace(old, new)
        print(msg)
    else:
        print(f'ERROR: not found -> {msg}')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
