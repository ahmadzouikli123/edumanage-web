path = "src/components/SchoolApp.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

old = '    const g = (grades || []).filter(x => x.studentId === s.id);'
new = '    const gradesArr = Array.isArray(grades) ? grades : Object.values(grades || {}).flat();\n    const g = gradesArr.filter(x => x.studentId === s.id || x.student_id === s.id);'

if old in content:
    content = content.replace(old, new)
    print("Fixed!")
else:
    print("ERROR: not found!")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Done!")
