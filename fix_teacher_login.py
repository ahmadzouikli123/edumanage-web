# -*- coding: utf-8 -*-
content = open('src/app/school/login/page.tsx', encoding='utf-8').read()

old = '''} else if (role === "teacher") {
        const c = CLS.find(x => x.u === user.toLowerCase().trim())
        if (c && pass === "teacher") { save("edu_auth",{role:"teacher",name:c.name,classId:c.id}); router.replace("/school") }
        else setErr("Invalid credentials")'''

new = '''} else if (role === "teacher") {
        // Fetch teacher from Supabase
        fetch(`https://${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://","")}/rest/v1/teachers?username=eq.${encodeURIComponent(user.toLowerCase().trim())}&select=*`, {
          headers: {
            "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""}`,
          }
        }).then(r => r.json()).then((data: any[]) => {
          setBusy(false);
          if (!data || data.length === 0 || data[0].password !== pass) {
            setErr("Invalid credentials");
            return;
          }
          const t = data[0];
          // Determine teacher type: subject teacher (has subject) or class teacher (has class_ids)
          const teacherType = t.subject ? "subject" : "class";
          save("edu_auth", {
            role: "teacher",
            name: t.name,
            classId: t.class_ids?.[0] || null,
            classIds: t.class_ids || [],
            subject: t.subject || null,
            teacherType,
          });
          router.replace("/school");
        }).catch(() => { setBusy(false); setErr("Connection error"); });
        return;'''

if old in content:
    content = content.replace(old, new)
    print('Login fixed!')
else:
    print('ERROR: not found!')

open('src/app/school/login/page.tsx', 'w', encoding='utf-8').write(content)
print('Done!')
