# -*- coding: utf-8 -*-
path = "src/components/SchoolApp.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Check if supabase is defined
idx = content.find("const supabase")
print("supabase defined at:", idx)
print(repr(content[idx:idx+200]))

# Check saveStudent
idx2 = content.find("supabase.from")
print("\nFirst supabase.from at:", idx2)
print(repr(content[idx2:idx2+150]))

# Check how many times supabase.from appears
import re
count = len(re.findall(r'supabase\.from', content))
print(f"\nTotal supabase.from calls: {count}")
