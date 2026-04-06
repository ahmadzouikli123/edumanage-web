"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

function load(key: string, fb: any) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fb; } catch { return fb; } }
function save(key: string, val: any) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

const SUPABASE_URL = "https://mhrtzppoiinpnbnximuf.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ocnR6cHBvaWlucG5ibnhpbXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4OTE3MDEsImV4cCI6MjA5MDQ2NzcwMX0.933qWXp0vslGHmt06eKgPuihMOVh4NzGUiHXY4iDNSQ"

async function supabaseGet(table: string, filters: string) {
  const res = await fetch(SUPABASE_URL + "/rest/v1/" + table + "?" + filters, {
    headers: { "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY }
  })
  return res.json()
}

const SEED_TEACHERS = [
  {username:"sarah.johnson", password:"teacher", name:"Ms. Sarah Johnson", class_ids:[1]},
  {username:"david.lee",     password:"teacher", name:"Mr. David Lee",     class_ids:[2]},
  {username:"emily.carter",  password:"teacher", name:"Ms. Emily Carter",  class_ids:[3]},
  {username:"james.miller",  password:"teacher", name:"Mr. James Miller",  class_ids:[4]},
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

      } else {
        // Parent login - username + password من Supabase
        const accounts = await supabaseGet("parent_accounts", "username=eq." + encodeURIComponent(user.trim()) + "&password=eq." + encodeURIComponent(pass) + "&select=id,name,username")
        
        if (accounts && accounts.length > 0) {
          const account = accounts[0]
          // جلب الطلاب المرتبطين
          const links = await supabaseGet("parent_students", "parent_id=eq." + account.id + "&select=student_id")
          const studentIds = (links || []).map((l: any) => l.student_id)
          
          // جلب بيانات الطلاب
          const allStudents = load("edu_students", [])
          const children = allStudents.filter((s: any) => studentIds.includes(s.id))
          
          save("edu_auth", {
            role: "parent",
            name: account.name,
            username: account.username,
            phone: children[0]?.phone || "",
            studentId: children[0]?.id || null,
            studentIds: studentIds,
          })
          router.replace("/school")
        } else {
          // Fallback: الطريقة القديمة (Student ID + Phone)
          const stored = load("edu_students", [])
          const s = stored.find((x: any) => x.sid.toLowerCase() === user.toLowerCase().trim() && x.phone.replace(/\D/g,"") === pass.replace(/\D/g,""))
          if (s) {
            save("edu_auth", {role:"parent", name:s.name, phone:s.phone, studentId:s.id, studentIds:[s.id]})
            router.replace("/school")
          } else {
            setErr("Invalid username or password")
          }
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
            {[["parent","Parent"],["teacher","Teacher"],["admin","Admin"]].map(([r,l])=>(
              <button key={r} onClick={()=>{setRole(r);setUser("");setPass("");setErr("")}} style={{flex:1,padding:"9px 0",borderRadius:7,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit",background:role===r?"#0d9488":"transparent",color:role===r?"#fff":"rgba(255,255,255,.45)"}}>
                {l}
              </button>
            ))}
          </div>
          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:12,color:"rgba(255,255,255,.5)",marginBottom:6}}>{role==="parent"?"Username":"Username"}</label>
            <input style={inp} value={user} onChange={e=>setUser(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder={role==="admin"?"admin":role==="teacher"?"sarah.johnson":"parent1"} />
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
            {role==="parent"  && <div>Username: parent1 / Password: parent123</div>}
          </div>
        </div>
        <div style={{textAlign:"center",marginTop:24,fontSize:12,color:"rgba(255,255,255,.6)"}}>
          © 2025 Al-Huffath Academy · Developed by <span style={{color:"#5eead4",fontWeight:600}}>Eng. Ahmad Zouikli</span>
        </div>
      </div>
    </div>
  )
}
