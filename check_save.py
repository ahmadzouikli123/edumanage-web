# -*- coding: utf-8 -*-
path = "src/components/SchoolApp.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find("Student added")
print(repr(content[idx-500:idx+100]))
