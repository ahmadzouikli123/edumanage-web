"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

function load(key: string, fb: any) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fb; } catch { return fb; } }
function save(key: string, val: any) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

const CLS = [
  { id:1, name:"Ms. Sarah Johnson", u:"sarah.johnson" },
  { id:2, name:"Mr. David Lee",     u:"david.lee" },
  { id:3, name:"Ms. Emily Carter",  u:"emily.carter" },
  { id:4, name:"Mr. James Miller",  u:"james.miller" },
]

export default function Login() {
  const router = useRouter()
  const [role, setRole] = useState("admin")
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [err,  setErr]  = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => { if (load("edu_auth", null)) router.replace("/school") }, [])

  const go = () => {
    setErr(""); setBusy(true)
    setTimeout(() => {
      setBusy(false)
      if (role === "admin") {
        if (user === "admin" && pass === "admin123") { save("edu_auth",{role:"admin",name:"Admin User"}); router.replace("/school") }
        else setErr("Invalid credentials")
      } else if (role === "teacher") {
        const c = CLS.find(x => x.u === user.toLowerCase().trim())
        if (c && pass === "teacher") { save("edu_auth",{role:"teacher",name:c.name,classId:c.id}); router.replace("/school") }
        else setErr("Invalid credentials")
      } else {
        const ss = load("edu_students", [])
        const s = ss.find((x:any) => x.sid.toLowerCase()===user.toLowerCase().trim() && x.phone.replace(/\D/g,"")===pass.replace(/\D/g,""))
        if (s) { save("edu_auth",{role:"parent",name:s.name,studentId:s.id}); router.replace("/school") }
        else setErr("Invalid Student ID or phone")
      }
    }, 500)
  }

  const inp: any = { width:"100%", padding:"11px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,.15)", background:"rgba(255,255,255,.07)", color:"#fff", fontSize:14, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f172a,#1e1e3a,#0d3330)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui,sans-serif",padding:20}}>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:52,marginBottom:10}}>🏫</div>
          <div style={{fontSize:24,fontWeight:800,color:"#fff"}}>EduManage</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,.4)",marginTop:4}}>School Management System</div>
        </div>
        <div style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:20,padding:32}}>
          <div style={{display:"flex",gap:4,background:"rgba(0,0,0,.3)",borderRadius:10,padding:4,marginBottom:24}}>
            {[["admin","Admin"],["teacher","Teacher"],["parent","Parent"]].map(([r,l])=>(
              <button key={r} onClick={()=>{setRole(r);setUser("");setPass("");setErr("")}} style={{flex:1,padding:"9px 0",borderRadius:7,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit",background:role===r?"#0d9488":"transparent",color:role===r?"#fff":"rgba(255,255,255,.45)"}}>
                {l}
              </button>
            ))}
          </div>
          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:12,color:"rgba(255,255,255,.5)",marginBottom:6}}>{role==="parent"?"Student ID":"Username"}</label>
            <input style={inp} value={user} onChange={e=>setUser(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder={role==="admin"?"admin":role==="teacher"?"sarah.johnson":"S001"} />
          </div>
          <div style={{marginBottom:20}}>
            <label style={{display:"block",fontSize:12,color:"rgba(255,255,255,.5)",marginBottom:6}}>{role==="parent"?"Phone Number":"Password"}</label>
            <input type="password" style={inp} value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder={role==="parent"?"555-0101":"••••••••"} />
          </div>
          {err && <div style={{background:"rgba(220,38,38,.15)",border:"1px solid rgba(220,38,38,.3)",borderRadius:8,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#fca5a5"}}>! {err}</div>}
          <button onClick={go} disabled={busy} style={{width:"100%",padding:"13px 0",borderRadius:10,border:"none",background:"#0d9488",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            {busy?"Signing in...":"Sign In"}
          </button>
          <div style={{marginTop:18,padding:"12px 14px",background:"rgba(13,148,136,.08)",border:"1px solid rgba(13,148,136,.2)",borderRadius:10,fontSize:11,color:"rgba(255,255,255,.45)"}}>
            <div style={{fontWeight:600,color:"#5eead4",marginBottom:6}}>Demo credentials</div>
            {role==="admin" && <div>Username: admin / Password: admin123</div>}
            {role==="teacher" && <div>Username: sarah.johnson / Password: teacher</div>}
            {role==="parent" && <div>Student ID: S001 / Phone: 555-0101</div>}
          </div>
        </div>
      </div>
    </div>
  )
}