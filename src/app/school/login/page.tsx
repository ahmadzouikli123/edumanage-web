"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

function load(key: string, fb: any) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fb; } catch { return fb; } }
function save(key: string, val: any) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

const SEED_TEACHERS = [
  {username:"sarah.johnson", password:"teacher", name:"Ms. Sarah Johnson", class_ids:[1]},
  {username:"david.lee",     password:"teacher", name:"Mr. David Lee",     class_ids:[2]},
  {username:"emily.carter",  password:"teacher", name:"Ms. Emily Carter",  class_ids:[3]},
  {username:"james.miller",  password:"teacher", name:"Mr. James Miller",  class_ids:[4]},
]

const SEED_STUDENTS = [
  { id:1, sid:"S001", name:"Liam Anderson",   phone:"555-0101" },
  { id:2, sid:"S002", name:"Olivia Martinez", phone:"555-0102" },
  { id:3, sid:"S003", name:"Noah Thompson",   phone:"555-0103" },
  { id:4, sid:"S004", name:"Emma Wilson",     phone:"555-0104" },
  { id:5, sid:"S005", name:"Aiden Brown",     phone:"555-0105" },
  { id:6, sid:"S006", name:"Sophia Davis",    phone:"555-0106" },
]

export default function Login() {
  const router = useRouter()
  const [role, setRole] = useState("parent")
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [err,  setErr]  = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => { if (load("edu_auth", null)) router.replace("/school") }, [])

  const go = async () => {
    setErr(""); setBusy(true)
    try {
      if (role === "admin") {
        const storedPass = localStorage.getItem("edu_admin_password") || "admin123"
        if (user === "admin" && pass === storedPass) {
          save("edu_auth", {role:"admin", name:"Admin User"})
          router.replace("/school")
        } else {
          setErr("Invalid credentials")
        }

      } else if (role === "teacher") {
        const storedTeachers = (() => { try { return JSON.parse(localStorage.getItem("edu_teachers") || "[]"); } catch { return []; } })()
        const allTeachers = [...SEED_TEACHERS, ...storedTeachers.filter((t: any) => t.username && !SEED_TEACHERS.find((s: any) => s.username === t.username))]
        const t = allTeachers.find((x: any) => x.username === user.toLowerCase().trim() && x.password === pass)
        if (t) {
          save("edu_auth", {role:"teacher", name:t.name, classIds:t.class_ids||[], classId:(t.class_ids||[])[0]})
          router.replace("/school")
        } else {
          setErr("Invalid credentials")
        }

      } else if (role === "student") {
        const stored = load("edu_students", [])
        const SEED_STUDENTS = [
          { id:1, sid:"S001", name:"Liam Anderson",   phone:"555-0101" },
          { id:2, sid:"S002", name:"Olivia Martinez", phone:"555-0102" },
          { id:3, sid:"S003", name:"Noah Thompson",   phone:"555-0103" },
          { id:4, sid:"S004", name:"Emma Wilson",     phone:"555-0104" },
          { id:5, sid:"S005", name:"Aiden Brown",     phone:"555-0105" },
          { id:6, sid:"S006", name:"Sophia Davis",    phone:"555-0106" },
        ]
        const allStudents = stored.length > 0 ? stored : SEED_STUDENTS
        const s = allStudents.find((x: any) => x.sid.toLowerCase() === user.toLowerCase().trim())
        if (!s) { setErr("Student not found"); setBusy(false); return; }
        // تحقق من كلمة المرور
        const studentPasswords = load("edu_student_passwords", {})
        const expectedPass = studentPasswords[s.id] || "student123"
        if (pass !== expectedPass) { setErr("Invalid password"); setBusy(false); return; }
        save("edu_auth", { role:"student", name:s.name, studentId:s.id, sid:s.sid })
        router.replace("/school")

      } else {
        // Parent login - محلي بدون Supabase
        // تحقق من الحسابات المخصصة أولاً
        const customAccounts = load("edu_parent_accounts", {})
        const stored = load("edu_students", [])
        const allStudents = stored.length > 0 ? stored : SEED_STUDENTS

        // ابحث في الحسابات المخصصة
        const customEntry = Object.entries(customAccounts).find(([id, acc]: any) =>
          acc.username.toLowerCase() === user.toLowerCase().trim() && acc.password === pass
        )
        if (customEntry) {
          const s = allStudents.find((x: any) => x.id === parseInt(customEntry[0]))
          if (s) {
            save("edu_auth", { role:"parent", name:s.name, phone:s.phone, studentId:s.id, studentIds:[s.id] })
            router.replace("/school")
            return
          }
        }

        // Fallback: Student ID + Phone
        const s = allStudents.find((x: any) =>
          x.sid.toLowerCase() === user.toLowerCase().trim() &&
          x.phone.replace(/\D/g,"") === pass.replace(/\D/g,"")
        )
        if (s) {
          save("edu_auth", { role:"parent", name:s.name, phone:s.phone, studentId:s.id, studentIds:[s.id] })
          router.replace("/school")
        } else {
          setErr("Invalid username or password")
        }
      }
    } catch(e) {
      setErr("Connection error. Please try again.")
    }
    setBusy(false)
  }

  const inp: any = {width:"100%",padding:"11px 14px",borderRadius:10,border:"1px solid rgba(255,255,255,.15)",background:"rgba(255,255,255,.07)",color:"#fff",fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f172a,#1e1e3a,#0d3330)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui,sans-serif",padding:20}}>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <img src="/logo.png" style={{width:130,height:130,objectFit:"contain",display:"block",margin:"0 auto 12px"}} />
          <div style={{fontSize:22,fontWeight:800,color:"#fff"}}>Al-Huffath Academy</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,.5)",marginTop:4}}>Ilm | Iman | Hifz</div>
        </div>
        <div style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:20,padding:32}}>
          <div style={{display:"flex",gap:4,background:"rgba(0,0,0,.3)",borderRadius:10,padding:4,marginBottom:24}}>
            {[["parent","Parent"],["student","Student"],["teacher","Teacher"],["admin","Admin"]].map(([r,l])=>(
              <button key={r} onClick={()=>{setRole(r);setUser("");setPass("");setErr("")}} style={{flex:1,padding:"9px 0",borderRadius:7,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit",background:role===r?"#0d9488":"transparent",color:role===r?"#fff":"rgba(255,255,255,.45)"}}>
                {l}
              </button>
            ))}
          </div>
          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:12,color:"rgba(255,255,255,.5)",marginBottom:6}}>Username</label>
            <input style={inp} value={user} onChange={e=>setUser(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder={role==="admin"?"admin":role==="teacher"?"sarah.johnson":role==="student"?"S001":"S001"} />
          </div>
          <div style={{marginBottom:20}}>
            <label style={{display:"block",fontSize:12,color:"rgba(255,255,255,.5)",marginBottom:6}}>Password</label>
            <input type="password" style={inp} value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="••••••••" />
          </div>
          {err && <div style={{background:"rgba(220,38,38,.15)",border:"1px solid rgba(220,38,38,.3)",borderRadius:8,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#fca5a5"}}>{err}</div>}
          <button onClick={go} disabled={busy} style={{width:"100%",padding:"13px 0",borderRadius:10,border:"none",background:"#0d9488",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            {busy?"Signing in...":"Sign In"}
          </button>
          <div style={{marginTop:18,padding:"12px 14px",background:"rgba(13,148,136,.08)",border:"1px solid rgba(13,148,136,.2)",borderRadius:10,fontSize:11,color:"rgba(255,255,255,.45)"}}>
            <div style={{fontWeight:600,color:"#5eead4",marginBottom:6}}>Demo credentials</div>
            {role==="admin"   && <div>Username: admin / Password: admin123</div>}
            {role==="teacher" && <div>Username: sarah.johnson / Password: teacher</div>}
            {role==="parent"  && <div>Username: S001 / Password: 555-0101</div>}
            {role==="student" && <div>Username: S001 / Password: student123</div>}
          </div>
        </div>
        <div style={{textAlign:"center",marginTop:24,fontSize:12,color:"rgba(255,255,255,.6)"}}>
          © 2025 Al-Huffath Academy · Developed by <span style={{color:"#5eead4",fontWeight:600}}>Eng. Ahmad Zouikli</span>
        </div>
      </div>
    </div>
  )
}

