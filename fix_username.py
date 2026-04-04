path = 'src/components/SchoolApp.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old = 'username: newTeacher.name.toLowerCase().replace(/[^a-z]/g, ".").replace(/[.]+/g, "."),'
new = 'username: newTeacher.name.toLowerCase().replace(/[^a-z]/g, ".").replace(/[.]+/g, ".") + "." + Date.now().toString().slice(-4),'

if old in content:
    content = content.replace(old, new)
    print('Username fix applied!')
else:
    print('ERROR: pattern not found!')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
