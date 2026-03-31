# -*- coding: utf-8 -*-
path = "src/components/SchoolApp.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove the misplaced import and supabase init
content = content.replace(
    'const supabase = createClient(\n  process.env.NEXT_PUBLIC_SUPABASE_URL,\n  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY\n);\nimport { useRouter as useNextRouter } from "next/navigation";',
    'import { useRouter as useNextRouter } from "next/navigation";\n\nconst supabase = createClient(\n  process.env.NEXT_PUBLIC_SUPABASE_URL,\n  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY\n);'
)

# Also fix the duplicate createClient import if exists
import re
imports = re.findall(r'import \{ createClient \}[^\n]+', content)
print("createClient imports:", imports)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Done!")
