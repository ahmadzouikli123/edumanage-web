# -*- coding: utf-8 -*-
content = open('src/components/SchoolApp.jsx', encoding='utf-8').read()

old = '  const [form, setForm] = React.useState(() => {'
new = '  const [form, setForm] = useState(() => {'

old2 = '  const [saved, setSaved] = React.useState(false);'
new2 = '  const [saved, setSaved] = useState(false);'

if old in content:
    content = content.replace(old, new)
    print('Fixed useState 1!')
else:
    print('ERROR 1 not found')

if old2 in content:
    content = content.replace(old2, new2)
    print('Fixed useState 2!')
else:
    print('ERROR 2 not found')

open('src/components/SchoolApp.jsx', 'w', encoding='utf-8').write(content)
print('Done!')
