# -*- coding: utf-8 -*-
path = "src/components/SchoolApp.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

SUPABASE_URL = "https://mhrtzppoiinpnbnximuf.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ocnR6cHBvaWlucG5ibnhpbXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4OTE3MDEsImV4cCI6MjA5MDQ2NzcwMX0.933qWXp0vslGHmt06eKgPuihMOVh4NzGUiHXY4iDNSQ"

# Replace process.env with hardcoded values
content = content.replace(
    'const supabase = createClient(\n  process.env.NEXT_PUBLIC_SUPABASE_URL,\n  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY\n);',
    f'const supabase = createClient("{SUPABASE_URL}", "{SUPABASE_KEY}");'
)

# Also fix any other placeholder references
content = content.replace(
    "process.env.NEXT_PUBLIC_SUPABASE_URL",
    f'"{SUPABASE_URL}"'
)
content = content.replace(
    "process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY",
    f'"{SUPABASE_KEY}"'
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Done!")
