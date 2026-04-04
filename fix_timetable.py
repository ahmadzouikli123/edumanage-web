# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

# 1. Fix saveSlot to save to Supabase
old_save = '''  const saveSlot = () => {
    const { dayIdx, periodId } = modal;
    setTimetable(prev => ({
      ...prev,
      [classId]: {
        ...(prev[classId] || {}),
        [dayIdx]: {
          ...(prev[classId]?.[dayIdx] || {}),
          [periodId]: form.subjectId
            ? { subjectId: parseInt(form.subjectId), room: form.room }
            : null,
        },
      },
    }));
    setModal(null);
  };'''

new_save = '''  const saveSlot = () => {
    const { dayIdx, periodId } = modal;
    setTimetable(prev => ({
      ...prev,
      [classId]: {
        ...(prev[classId] || {}),
        [dayIdx]: {
          ...(prev[classId]?.[dayIdx] || {}),
          [periodId]: form.subjectId
            ? { subjectId: parseInt(form.subjectId), room: form.room }
            : null,
        },
      },
    }));
    // Save to Supabase
    if (form.subjectId) {
      supabase.from("timetable").upsert({
        class_id: classId,
        day_idx: dayIdx,
        period_id: periodId,
        subject_id: parseInt(form.subjectId),
        room: form.room || "",
      }, { onConflict: "class_id,day_idx,period_id" }).then(({ error }) => {
        if (error) console.error("Timetable save error:", error.message);
      });
    } else {
      supabase.from("timetable").delete()
        .eq("class_id", classId)
        .eq("day_idx", dayIdx)
        .eq("period_id", periodId)
        .then(({ error }) => {
          if (error) console.error("Timetable delete error:", error.message);
        });
    }
    setModal(null);
  };'''

# 2. Fix clearSlot to delete from Supabase
old_clear = '''  const clearSlot = (dayIdx, periodId) => {
    setTimetable(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      if (next[classId]?.[dayIdx]) next[classId][dayIdx][periodId] = nul'''

new_clear = '''  const clearSlot = (dayIdx, periodId) => {
    supabase.from("timetable").delete()
      .eq("class_id", classId).eq("day_idx", dayIdx).eq("period_id", periodId)
      .then(({ error }) => { if (error) console.error(error.message); });
    setTimetable(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      if (next[classId]?.[dayIdx]) next[classId][dayIdx][periodId] = nul'''

# 3. Add useEffect to fetch timetable from Supabase
old_func = 'function Timetable({ classes, subjects, timetable, setTimetable }) {'
new_func = '''function Timetable({ classes, subjects, timetable, setTimetable }) {
  useEffect(() => {
    supabase.from("timetable").select("*").then(({ data, error }) => {
      if (error) { console.error(error); return; }
      if (!data) return;
      const next = {};
      data.forEach(r => {
        if (!next[r.class_id]) next[r.class_id] = {};
        if (!next[r.class_id][r.day_idx]) next[r.class_id][r.day_idx] = {};
        next[r.class_id][r.day_idx][r.period_id] = { subjectId: r.subject_id, room: r.room || "" };
      });
      setTimetable(next);
    });
  }, []);'''

fixes = [
    (old_save,  new_save,  'saveSlot fixed!'),
    (old_clear, new_clear, 'clearSlot fixed!'),
    (old_func,  new_func,  'Timetable fetch added!'),
]

for old, new, msg in fixes:
    if old in content:
        content = content.replace(old, new)
        print(msg)
    else:
        print(f'ERROR: not found -> {msg}')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
