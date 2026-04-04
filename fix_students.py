path = "src/components/SchoolApp.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add functions after cls definition
old_cls = "const cls = id => classes.find(c => c.id === id)?.name || " + chr(34) + "\u2014" + chr(34) + ";"
new_cls = old_cls + """

  const printReport = (s) => {
    const g = (grades || []).filter(x => x.studentId === s.id);
    const att = Object.entries(attendance || {}).map(([d, r]) => ({ d, st: r[s.id] || "-" }));
    const present = att.filter(a => a.st === "present").length;
    const total = att.filter(a => a.st !== "-").length;
    const pct = total ? Math.round((present / total) * 100) + "%" : "N/A";
    const win = window.open("", "_blank");
    win.document.write("<html><head><title>Report</title><style>body{font-family:Arial;padding:30px}h1{color:#1e40af}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ddd;padding:8px}th{background:#f1f5f9}@media print{button{display:none}}</style></head><body><h1>Student Report</h1><p><b>Name:</b> " + s.name + " | <b>ID:</b> " + s.sid + " | <b>Class:</b> " + cls(s.classId) + " | <b>Gender:</b> " + (s.gender||"-") + "</p><p><b>Phone:</b> " + (s.phone||"-") + " | <b>Status:</b> " + s.status + "</p><h2>Attendance: " + pct + " (" + present + "/" + total + " days)</h2><h2>Grades</h2><table><tr><th>Subject</th><th>Score</th></tr>" + g.map(x => "<tr><td>" + (x.subject||x.subjectId||"-") + "</td><td>" + x.score + "</td></tr>").join("") + "</table><br><button onclick='window.print()'>Print</button></body></html>");
    win.document.close();
  };

  const printExam = (s) => {
    const rows = Array.from({length:10},(_,i)=>"<p><b>Q"+(i+1)+".</b><div style='border-bottom:1px solid #aaa;height:28px;margin:8px 0'></div></p>").join("");
    const win = window.open("", "_blank");
    win.document.write("<html><head><title>Exam</title><style>body{font-family:Arial;padding:30px}@media print{button{display:none}}</style></head><body><h1>Exam Paper</h1><p><b>Student:</b> " + s.name + " | <b>ID:</b> " + s.sid + " | <b>Class:</b> " + cls(s.classId) + "</p><p><b>Date:</b> ___________ | <b>Subject:</b> ___________ | <b>Score:</b> ___/100</p><hr>" + rows + "<button onclick='window.print()'>Print</button></body></html>");
    win.document.close();
  };

  const promoteSelected = () => {
    if (!selected.size) { showToast("No students selected"); return; }
    const yr = CURRENT_YEAR || "2024-2025";
    const p = yr.split("-");
    const nextYear = (parseInt(p[0])+1) + "-" + (parseInt(p[1]||p[0])+1);
    if (!confirm("Promote " + selected.size + " student(s) to " + nextYear + "?")) return;
    const ids = [...selected];
    Promise.all(ids.map(id => supabase.from("students").update({academic_year: nextYear}).eq("id", id))).then(() => {
      setStudents(prev => prev.map(s => selected.has(s.id) ? {...s, academicYear: nextYear} : s));
      setSelected(new Set());
      showToast(ids.length + " student(s) promoted to " + nextYear);
    });
  };"""

# 2. Add print buttons in Actions
old_actions = 'background: "#fff", fontSize: 12, cursor: "pointer", color: "#334155" }}>Edit</button>\n                        <button onClick={() => setDeleteId(s.id)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: T.dangerBg, fontSize: 12, cursor: "pointer", color: T.danger }}>Delete</button>'
new_actions = 'background: "#fff", fontSize: 12, cursor: "pointer", color: "#334155" }}>Edit</button>\n                        <button onClick={() => setDeleteId(s.id)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: T.dangerBg, fontSize: 12, cursor: "pointer", color: T.danger }}>Delete</button>\n                        <button onClick={() => printReport(s)} style={{ padding: "5px 10px", borderRadius: 6, border: "none", background: "#dbeafe", fontSize: 12, cursor: "pointer", color: "#1e40af" }}>Report</button>\n                        <button onClick={() => printExam(s)} style={{ padding: "5px 10px", borderRadius: 6, border: "none", background: "#d1fae5", fontSize: 12, cursor: "pointer", color: "#065f46" }}>Exam</button>'

# 3. Add Promote button before Add Student
old_add = '>+ Add Student</button>'
new_add = '>+ Add Student</button>'
old_addbtn = "fontFamily: " + chr(34) + "inherit" + chr(34) + " }}>+ Add Student</button>"
new_addbtn = "fontFamily: " + chr(34) + "inherit" + chr(34) + " }}>+ Add Student</button>"

if old_cls in content:
    content = content.replace(old_cls, new_cls)
    print("Functions added!")
else:
    print("ERROR: cls not found!")

if old_actions in content:
    content = content.replace(old_actions, new_actions)
    print("Print buttons added!")
else:
    print("ERROR: actions not found!")

# Find and add Promote button before Add Student
import re
pattern = r'(<button onClick=\{openAdd\}[^>]*>)[^<]*Add Student</button>'
match = re.search(pattern, content)
if match:
    promote_btn = '<button onClick={promoteSelected} style={{ padding: "9px 16px", borderRadius: 8, border: "none", background: "#7c3aed", color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Promote Year</button>\n        '
    content = content[:match.start()] + promote_btn + content[match.start():]
    print("Promote button added!")
else:
    print("ERROR: Add Student button not found!")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Done!")
