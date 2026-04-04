# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

# 1. Fix saveExam to use Supabase
old_save = '''    if (modal.mode === "add") {
      setExams(prev => [...prev, { ...finalForm, id: uid() }]);
    } else {
      setExams(prev => prev.map(ex => ex.id === form.id ? finalForm : ex));
    }
    setModal(null);
  };

  const deleteExam = (id) => {
    setExams(prev => prev.filter(ex => ex.id !== id));
    setExamResults(prev => { const n = { ...prev }; delete n[id]; return n; });
  };'''

new_save = '''    if (modal.mode === "add") {
      supabase.from("exams").insert([{
        class_id: finalForm.classId, subject_id: finalForm.subjectId,
        type: finalForm.type, title: finalForm.title, date: finalForm.date,
        duration: finalForm.duration, max_score: finalForm.maxScore,
        room: finalForm.room || "", notes: finalForm.notes || "",
      }]).select().then(({ data, error }) => {
        if (error) { alert("Save failed: " + error.message); return; }
        if (data && data.length > 0) {
          const r = data[0];
          setExams(prev => [...prev, { id: r.id, classId: r.class_id, subjectId: r.subject_id, type: r.type, title: r.title, date: r.date, duration: r.duration, maxScore: r.max_score, room: r.room, notes: r.notes }]);
        }
      });
    } else {
      supabase.from("exams").update({
        class_id: finalForm.classId, subject_id: finalForm.subjectId,
        type: finalForm.type, title: finalForm.title, date: finalForm.date,
        duration: finalForm.duration, max_score: finalForm.maxScore,
        room: finalForm.room || "", notes: finalForm.notes || "",
      }).eq("id", form.id).then(({ error }) => {
        if (error) { alert("Update failed: " + error.message); return; }
        setExams(prev => prev.map(ex => ex.id === form.id ? finalForm : ex));
      });
    }
    setModal(null);
  };

  const deleteExam = (id) => {
    supabase.from("exams").delete().eq("id", id).then(({ error }) => {
      if (error) { alert("Delete failed: " + error.message); return; }
      setExams(prev => prev.filter(ex => ex.id !== id));
      setExamResults(prev => { const n = { ...prev }; delete n[id]; return n; });
    });
  };'''

# 2. Add useEffect to fetch exams from Supabase
old_func = 'function ExamScheduler({ students, classes, subjects, exams, setExams, examResults, setExamResults }) {'
new_func = '''function ExamScheduler({ students, classes, subjects, exams, setExams, examResults, setExamResults }) {
  useEffect(() => {
    supabase.from("exams").select("*").then(({ data, error }) => {
      if (error) { console.error(error); return; }
      if (!data) return;
      setExams(data.map(r => ({
        id: r.id, classId: r.class_id, subjectId: r.subject_id,
        type: r.type, title: r.title, date: r.date,
        duration: r.duration, maxScore: r.max_score,
        room: r.room || "", notes: r.notes || "",
      })));
    });
  }, []);'''

if old_save in content:
    content = content.replace(old_save, new_save)
    print('saveExam fixed!')
else:
    print('ERROR: saveExam not found!')

if old_func in content:
    content = content.replace(old_func, new_func)
    print('Exams fetch added!')
else:
    print('ERROR: function not found!')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
