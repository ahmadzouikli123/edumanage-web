path = 'src/components/SchoolApp.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old = '].select().then(({ data }) => {\n        if (data && data.length > 0) {\n          const t = data[0];\n          setTeachers(prev => [...prev, {\n            id: t.id, name: t.name, username: t.username,\n            password: t.password, subject: t.subject,\n            classIds: t.class_ids || [], phone: t.phone,\n            email: t.email, status: t.status\n          }]);\n        }\n      });'

new = '].select().then(({ data, error }) => {\n        if (error) { alert("Insert failed: " + error.message); return; }\n        if (data && data.length > 0) {\n          const t = data[0];\n          setTeachers(prev => [...prev, {\n            id: t.id, name: t.name, username: t.username,\n            password: t.password, subject: t.subject,\n            classIds: t.class_ids || [], phone: t.phone,\n            email: t.email, status: t.status\n          }]);\n        }\n      }).catch(err => alert("Error: " + err.message));'

old2 = '  const handleDelete = (id) => {\n    if (confirm("Delete this teacher?")) {\n      setTeachers(teachers.filter(t => t.id !== id));\n    }\n  };'

new2 = '  const handleDelete = (id) => {\n    if (confirm("Delete this teacher?")) {\n      supabase.from("teachers").delete().eq("id", id).then(({ error }) => {\n        if (error) { alert("Delete failed: " + error.message); return; }\n        setTeachers(teachers.filter(t => t.id !== id));\n      });\n    }\n  };'

if old in content:
    content = content.replace(old, new)
    print('Insert fix applied!')
else:
    print('ERROR: insert pattern not found!')

if old2 in content:
    content = content.replace(old2, new2)
    print('Delete fix applied!')
else:
    print('ERROR: delete pattern not found!')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
