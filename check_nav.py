path = "src/components/SchoolApp.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find("const NAV")
if idx != -1:
    print("NAV found:")
    print(repr(content[idx:idx+500]))
else:
    print("NAV not found!")

idx2 = content.find("teachers")
print("\nFirst mention of teachers:", idx2)
if idx2 != -1:
    print(repr(content[idx2:idx2+100]))
