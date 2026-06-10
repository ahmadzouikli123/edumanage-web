﻿"use client"
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

  useEffect(() => { if (load("edu_auth", null)) window.location.href = "/school" }, [])

  const go = async () => {
    setErr(""); setBusy(true)
    try {
      if (role === "principal") {
        const storedPass = localStorage.getItem("edu_principal_password") || "principal123"
        if (user === "principal" && pass === storedPass) {
          save("edu_auth", {role:"principal", name:"School Principal"})
          window.location.href = "/school"
        } else { setErr("Invalid credentials") }

      } else if (role === "supervisor") {
        const storedPass = localStorage.getItem("edu_supervisor_password") || "supervisor123"
        if (user === "supervisor" && pass === storedPass) {
          save("edu_auth", {role:"supervisor", name:"Supervisor"})
          window.location.href = "/school"
        } else { setErr("Invalid credentials") }

      } else if (role === "admin") {
        const storedPass = localStorage.getItem("edu_admin_password") || "admin123"
        if (user === "admin" && pass === storedPass) {
          save("edu_auth", {role:"admin", name:"Admin User"})
          window.location.href = "/school"
        } else {
          setErr("Invalid credentials")
        }

      } else if (role === "teacher") {
        const storedTeachers = (() => { try { return JSON.parse(localStorage.getItem("edu_teachers") || "[]"); } catch { return []; } })()
        const allTeachers = [...SEED_TEACHERS, ...storedTeachers.filter((t: any) => t.username && !SEED_TEACHERS.find((s: any) => s.username === t.username))]
        const t = allTeachers.find((x: any) => x.username === user.toLowerCase().trim() && x.password === pass)
        if (t) {
          const tClassIds = t.classIds || t.class_ids || []; save("edu_auth", {role:"teacher", name:t.name, classIds:tClassIds, classId:tClassIds[0]})
          window.location.href = "/school"
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
        const expectedPass = studentPasswords[s.id] || studentPasswords[String(s.id)] || "student123"
        if (pass !== expectedPass) { setErr("Invalid password"); setBusy(false); return; }
        save("edu_auth", { role:"student", name:s.name, studentId:s.id, sid:s.sid })
        window.location.href = "/school"

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
          const s = allStudents.find((x: any) => String(x.id) === String(customEntry[0]))
          if (s) {
            save("edu_auth", { role:"parent", name:s.name, phone:s.phone, studentId:s.id, studentIds:[s.id] })
            window.location.href = "/school"
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
          window.location.href = "/school"
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

  const features = [
    { icon: "✅", title: "Attendance Tracking", desc: "Real-time daily attendance with instant parent notifications" },
    { icon: "📊", title: "Grades & Reports", desc: "Comprehensive grade management and PDF report generation" },
    { icon: "📝", title: "Interactive Quizzes", desc: "MCQ, True/False and Fill-in-the-blank quizzes for students" },
    { icon: "💬", title: "Smart Messaging", desc: "Direct messaging and broadcast announcements" },
    { icon: "🗓️", title: "Timetable", desc: "Weekly class schedule for teachers and students" },
    { icon: "📋", title: "Exam Scheduler", desc: "Schedule exams and track results with analytics" },
  ]

  const mobileStyles = `
    @media (max-width: 768px) {
      .login-container { flex-direction: column !important; }
      .hero-section { display: none !important; }
      .login-section {
        width: 100% !important;
        border-left: none !important;
        padding: 24px 20px !important;
        min-height: 100vh;
        align-items: flex-start !important;
      }
      .features-grid { grid-template-columns: 1fr !important; }
    }
    @media (min-width: 769px) {
      .login-container { flex-direction: row !important; }
    }
  `
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0a0a1a,#0f172a,#0d3330)",fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",display:"flex",flexDirection:"column"}}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" />
      <style dangerouslySetInnerHTML={{__html: mobileStyles}} />

      {/* Glow effects */}
      <div style={{position:"fixed",top:-100,left:-100,width:500,height:500,borderRadius:"50%",background:"rgba(13,148,136,.1)",filter:"blur(80px)",pointerEvents:"none",zIndex:0}} />
      <div style={{position:"fixed",bottom:-100,right:-100,width:500,height:500,borderRadius:"50%",background:"rgba(124,58,237,.08)",filter:"blur(80px)",pointerEvents:"none",zIndex:0}} />

      <div style={{flex:1,display:"flex",minHeight:"100vh",position:"relative",zIndex:1,flexDirection:"column" as any} as any} className="login-container">

        {/* Left - Hero + Features */}
        <div className="hero-section" style={{flex:1,padding:"48px 56px",display:"flex",flexDirection:"column",justifyContent:"center",color:"#fff"}}>

          {/* Logo */}
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:56}}>
            <div style={{width:42,height:42,borderRadius:12,background:"linear-gradient(135deg,#14b8a6,#0d9488)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
              <img src="/logo.png" style={{width:"100%",height:"100%",objectFit:"contain"}} onError={(e:any)=>e.target.style.display="none"} />
            </div>
            <div>
              <div style={{fontSize:16,fontWeight:800,color:"#fff"}}>EduManage</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>Al-Huffath Academy</div>
            </div>
          </div>

          {/* Hero Text */}
          <div style={{marginBottom:48}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(13,148,136,.15)",border:"1px solid rgba(13,148,136,.3)",borderRadius:20,padding:"5px 14px",fontSize:11,color:"#5eead4",fontWeight:600,marginBottom:20}}>
              ✨ School Management System
            </div>
            <h1 style={{fontSize:"clamp(28px,3.5vw,48px)",fontWeight:800,lineHeight:1.2,marginBottom:16,color:"#fff"}}>
              The Smartest Way to{" "}
              <span style={{background:"linear-gradient(135deg,#0d9488,#5eead4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Manage</span>
              {" "}Your{" "}
              <span style={{background:"linear-gradient(135deg,#7c3aed,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>School</span>
            </h1>
            <p style={{fontSize:15,color:"rgba(255,255,255,.5)",lineHeight:1.7,maxWidth:480}}>
              One platform for <strong style={{color:"#fff"}}>teachers</strong>, <strong style={{color:"#fff"}}>parents</strong>, <strong style={{color:"#fff"}}>students</strong> and school admins — real-time attendance, grades, messaging and more.
            </p>
          </div>

          {/* Features Grid */}
          <div className="features-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {features.map((f,i) => (
              <div key={i} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)",borderRadius:14,padding:"16px 14px",display:"flex",gap:12,alignItems:"flex-start"}}>
                <span style={{fontSize:20,flexShrink:0}}>{f.icon}</span>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:"#fff",marginBottom:3}}>{f.title}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,.4)",lineHeight:1.5}}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{marginTop:"auto",paddingTop:32,fontSize:12,color:"rgba(255,255,255,.25)"}}>
            © 2025 Al-Huffath Academy · Developed by <span style={{color:"#5eead4",fontWeight:600}}>Eng. Ahmad Zouikli</span>
          </div>
        </div>

        {/* Right - Login Form */}
        <div className="login-section" style={{width:440,display:"flex",alignItems:"center",justifyContent:"center",padding:"32px 40px",borderLeft:"1px solid rgba(255,255,255,.06)"}}>
          <div style={{width:"100%"}}>
            <div style={{textAlign:"center",marginBottom:32}}>
              <img src="/logo.png" style={{width:80,height:80,objectFit:"contain",display:"block",margin:"0 auto 12px"}} />
              <div style={{fontSize:20,fontWeight:800,color:"#fff"}}>Al-Huffath Academy</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.4)",marginTop:4}}>Ilm | Iman | Hifz</div>
            </div>
            <div style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:20,padding:28}}>
              <div style={{display:"flex",gap:4,background:"rgba(0,0,0,.3)",borderRadius:10,padding:4,marginBottom:24}}>
                {[["parent","Parent"],["student","Student"],["teacher","Teacher"],["principal","Principal"],["supervisor","Supervisor"],["admin","Admin"]].map(([r,l])=>(
                  <button key={r} onClick={()=>{setRole(r);setUser("");setPass("");setErr("")}} style={{flex:1,padding:"8px 0",borderRadius:7,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"inherit",background:role===r?"#0d9488":"transparent",color:role===r?"#fff":"rgba(255,255,255,.45)"}}>
                    {l}
                  </button>
                ))}
              </div>
              <form onSubmit={e=>{e.preventDefault();go();}} autoComplete="on">
              <div style={{marginBottom:14}}>
                <label style={{display:"block",fontSize:12,color:"rgba(255,255,255,.5)",marginBottom:6}}>Username</label>
                <input name="username" style={inp} value={user} onChange={e=>setUser(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder={role==="admin"?"admin":role==="teacher"?"sarah.johnson":"S001"} autoComplete="username" />
              </div>
              <div style={{marginBottom:20}}>
                <label style={{display:"block",fontSize:12,color:"rgba(255,255,255,.5)",marginBottom:6}}>Password</label>
                <input name="password" type="password" style={inp} value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="••••••••" autoComplete="current-password" />
              </div>
              {err && <div style={{background:"rgba(220,38,38,.15)",border:"1px solid rgba(220,38,38,.3)",borderRadius:8,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#fca5a5"}}>{err}</div>}
              <button onClick={go} disabled={busy} style={{width:"100%",padding:"13px 0",borderRadius:10,border:"none",background:"linear-gradient(135deg,#0d9488,#14b8a6)",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 16px rgba(13,148,136,.4)"}}>
                {busy?"Signing in...":"Sign In →"}
              </button>
              </form>
              <div style={{marginTop:16,padding:"12px 14px",background:"rgba(13,148,136,.08)",border:"1px solid rgba(13,148,136,.2)",borderRadius:10,fontSize:11,color:"rgba(255,255,255,.45)"}}>
                <div style={{fontWeight:600,color:"#5eead4",marginBottom:6}}>Demo credentials</div>
                {role==="admin"   && <div>Username: admin / Password: admin123</div>}
                {role==="principal" && <div>Username: principal / Password: principal123</div>}
                {role==="supervisor" && <div>Username: supervisor / Password: supervisor123</div>}
                {role==="teacher" && <div>Username: sarah.johnson / Password: teacher</div>}
                {role==="parent"  && <div>Username: S001 / Password: 555-0101</div>}
                {role==="student" && <div>Username: S001 / Password: student123</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

















