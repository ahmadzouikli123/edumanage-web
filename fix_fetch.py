path = 'src/components/SchoolApp.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old = 'function Teachers({ userRole }) {\n  const [teachers, setTeachers] = useState(SEED_TEACHERS);\n  const [search, setSearch] = useState("");\n  const [showForm, setShowForm] = useState(false);\n  const [editing, setEditing] = useState(null);'

new = 'function Teachers({ userRole }) {\n  const [teachers, setTeachers] = useState([]);\n  const [search, setSearch] = useState("");\n  const [showForm, setShowForm] = useState(false);\n  const [editing, setEditing] = useState(null);\n\n  useEffect(() => {\n    supabase.from("teachers").select("*").then(({ data, error }) => {\n      if (error) { console.error(error); return; }\n      if (data) setTeachers(data.map(t => ({\n        id: t.id, name: t.name, username: t.username,\n        password: t.password, subject: t.subject,\n        classIds: t.class_ids || [], phone: t.phone,\n        email: t.email, status: t.status\n      })));\n    });\n  }, []);'

if old in content:
    content = content.replace(old, new)
    print('Fetch fix applied!')
else:
    print('ERROR: pattern not found!')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
