import { useState, useMemo } from "react";

// ─── Seed Data ────────────────────────────────────────────────────────────────
const CLASSES = [
  { id: 1, name: "Grade 1 — A", grade: "Grade 1", room: "101", teacher: "Ms. Sarah Johnson" },
  { id: 2, name: "Grade 1 — B", grade: "Grade 1", room: "102", teacher: "Mr. David Lee" },
  { id: 3, name: "Grade 2 — A", grade: "Grade 2", room: "201", teacher: "Ms. Emily Carter" },
  { id: 4, name: "Grade 3 — A", grade: "Grade 3", room: "301", teacher: "Mr. James Miller" },
];

const INIT_STUDENTS = [
  { id: 1, name: "Liam Anderson",   sid: "S001", classId: 1, gender: "Male",   phone: "555-0101", status: "Active" },
  { id: 2, name: "Olivia Martinez", sid: "S002", classId: 1, gender: "Female", phone: "555-0102", status: "Active" },
  { id: 3, name: "Noah Thompson",   sid: "S003", classId: 2, gender: "Male",   phone: "555-0103", status: "Active" },
  { id: 4, name: "Emma Wilson",     sid: "S004", classId: 2, gender: "Female", phone: "555-0104", status: "Active" },
  { id: 5, name: "Aiden Brown",     sid: "S005", classId: 3, gender: "Male",   phone: "555-0105", status: "Active" },
  { id: 6, name: "Sophia Davis",    sid: "S006", classId: 3, gender: "Female", phone: "555-0106", status: "Active" },
  { id: 7, name: "Lucas Garcia",    sid: "S007", classId: 4, gender: "Male",   phone: "555-0107", status: "Active" },
  { id: 8, name: "Isabella White",  sid: "S008", classId: 4, gender: "Female", phone: "555-0108", status: "Active" },
];

// Pre-seed some attendance history for the past 7 days
function seedAttendance(students) {
  const records = {};
  const statuses = ["present", "present", "present", "present", "absent", "late", "excused"];
  const today = new Date();
  for (let d = 6; d >= 1; d--) {
    const date = new Date(today); date.setDate(today.getDate() - d);
    const dateStr = date.toISOString().split("T")[0];
    if (date.getDay() === 0 || date.getDay() === 6) continue; // skip weekends
    records[dateStr] = {};
    students.forEach(s => {
      records[dateStr][s.id] = statuses[Math.floor(Math.random() * statuses.length)];
    });
  }
  return records;
}

const INIT_ATTENDANCE = seedAttendance(INIT_STUDENTS);

const NAV = [
  { id: "dashboard",  icon: "⊞", label: "Dashboard" },
  { id: "students",   icon: "◉", label: "Students" },
  { id: "classes",    icon: "▦", label: "Classes" },
  { id: "attendance", icon: "✓", label: "Attendance" },
];

const EMPTY_STUDENT = { name: "", sid: "", classId: 1, gender: "Male", phone: "", status: "Active" };
const EMPTY_CLASS   = { name: "", grade: "", room: "", teacher: "" };

const STATUS_CONFIG = {
  present: { label: "Present", color: "#059669", bg: "#d1fae5", dot: "#10b981", short: "P" },
  absent:  { label: "Absent",  color: "#dc2626", bg: "#fee2e2", dot: "#ef4444", short: "A" },
  late:    { label: "Late",    color: "#d97706", bg: "#fef3c7", dot: "#f59e0b", short: "L" },
  excused: { label: "Excused", color: "#7c3aed", bg: "#ede9fe", dot: "#8b5cf6", short: "E" },
};

// ─── Shared Components ───────────────────────────────────────────────────────
function Avatar({ name, size = 34 }) {
  const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const colors = ["#0d9488","#7c3aed","#2563eb","#db2777","#ea580c","#16a34a"];
  const bg = colors[name.charCodeAt(0) % colors.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: bg,
      color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 600, flexShrink: 0,
    }}>{initials}</div>
  );
}

function Badge({ status }) {
  const map = {
    Active:   { bg: "#d1fae5", color: "#065f46", dot: "#10b981" },
    Inactive: { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
  };
  const s = map[status] || map.Active;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      background:s.bg, color:s.color, borderRadius:20,
      padding:"3px 10px", fontSize:12, fontWeight:500,
    }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:s.dot, display:"inline-block" }} />
      {status}
    </span>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(15,15,30,.55)",
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:100,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background:"#fff", borderRadius:16, padding:28, width:480,
        maxWidth:"90vw", boxShadow:"0 20px 60px rgba(0,0,0,.2)",
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
          <h3 style={{ fontSize:17, fontWeight:600, color:"#1e1e3a" }}>{title}</h3>
          <button onClick={onClose} style={{
            border:"none", background:"#f1f5f9", borderRadius:8,
            width:30, height:30, cursor:"pointer", fontSize:16, color:"#64748b",
          }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:"block", fontSize:12, fontWeight:500, color:"#475569", marginBottom:6 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle  = { width:"100%", padding:"9px 12px", border:"1px solid #e2e8f0", borderRadius:8, fontSize:13, fontFamily:"inherit", outline:"none", color:"#1e1e3a", background:"#f8fafc", boxSizing:"border-box" };
const selectStyle = { ...inputStyle, cursor:"pointer" };

// ─── Attendance Module ───────────────────────────────────────────────────────
function Attendance({ students, classes, attendance, setAttendance }) {
  const todayStr = new Date().toISOString().split("T")[0];
  const [date, setDate]       = useState(todayStr);
  const [classId, setClassId] = useState(classes[0]?.id || 1);
  const [view, setView]       = useState("take"); // "take" | "report"
  const [saved, setSaved]     = useState(false);

  const classStudents = useMemo(
    () => students.filter(s => s.classId === classId && s.status === "Active"),
    [students, classId]
  );

  const dayRecord = attendance[date] || {};

  // Initialize all students as present if no record yet
  const [draft, setDraft] = useState(() => {
    const rec = attendance[date] || {};
    const init = {};
    students.forEach(s => { init[s.id] = rec[s.id] || "present"; });
    return init;
  });

  // When date or class changes, reload draft
  const reloadDraft = (newDate, newClassId) => {
    const rec = attendance[newDate] || {};
    const init = {};
    students.forEach(s => { init[s.id] = rec[s.id] || "present"; });
    setDraft(init);
    setSaved(!!attendance[newDate]);
  };

  const handleDate = (d)  => { setDate(d);       reloadDraft(d, classId); };
  const handleClass = (c) => { setClassId(c);    reloadDraft(date, c); };

  const markAll = (status) => {
    const updated = { ...draft };
    classStudents.forEach(s => { updated[s.id] = status; });
    setDraft(updated);
    setSaved(false);
  };

  const toggle = (sid, status) => {
    setDraft(prev => ({ ...prev, [sid]: status }));
    setSaved(false);
  };

  const save = () => {
    setAttendance(prev => ({ ...prev, [date]: { ...(prev[date] || {}), ...draft } }));
    setSaved(true);
  };

  // Stats for current class & date
  const stats = useMemo(() => {
    const s = { present:0, absent:0, late:0, excused:0 };
    classStudents.forEach(st => { const v = draft[st.id] || "present"; s[v]++; });
    return s;
  }, [draft, classStudents]);

  // ── Report view ──────────────────────────────────────────────────────────
  const allDates = useMemo(() => {
    const days = Object.keys(attendance).sort();
    return days;
  }, [attendance]);

  const studentStats = useMemo(() => {
    return students.filter(s => s.classId === classId).map(s => {
      let p=0, a=0, l=0, e=0, total=0;
      allDates.forEach(d => {
        const rec = attendance[d]?.[s.id];
        if (!rec) return;
        total++;
        if (rec === "present") p++;
        else if (rec === "absent") a++;
        else if (rec === "late") l++;
        else if (rec === "excused") e++;
      });
      const rate = total ? Math.round((p / total) * 100) : 100;
      return { ...s, present:p, absent:a, late:l, excused:e, total, rate };
    });
  }, [students, classId, allDates, attendance]);

  const StatPill = ({ type, count }) => {
    const cfg = STATUS_CONFIG[type];
    return (
      <div style={{
        background: cfg.bg, borderRadius:10, padding:"12px 16px",
        display:"flex", flexDirection:"column", alignItems:"center", gap:4, flex:1,
      }}>
        <div style={{ fontSize:22, fontWeight:700, color: cfg.color }}>{count}</div>
        <div style={{ fontSize:11, color: cfg.color, fontWeight:500 }}>{cfg.label}</div>
      </div>
    );
  };

  return (
    <div>
      {/* Header controls */}
      <div style={{
        background:"#fff", border:"1px solid #e8ecf2", borderRadius:14,
        padding:"16px 20px", marginBottom:20,
        display:"flex", alignItems:"center", gap:12, flexWrap:"wrap",
        boxShadow:"0 1px 4px rgba(0,0,0,.06)",
      }}>
        <input type="date" value={date} max={todayStr}
          onChange={e => handleDate(e.target.value)}
          style={{ ...inputStyle, width:160 }} />
        <select value={classId} onChange={e => handleClass(parseInt(e.target.value))}
          style={{ ...selectStyle, width:190 }}>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div style={{ display:"flex", gap:4, marginRight:"auto" }}>
          {["take","report"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding:"8px 16px", borderRadius:8, border:"none", cursor:"pointer",
              fontSize:13, fontFamily:"inherit", fontWeight:500,
              background: view === v ? "#1e1e3a" : "#f1f5f9",
              color: view === v ? "#fff" : "#64748b",
            }}>
              {v === "take" ? "Take Attendance" : "Report"}
            </button>
          ))}
        </div>
        {view === "take" && (
          <button onClick={save} style={{
            padding:"9px 22px", borderRadius:8, border:"none",
            background: saved ? "#d1fae5" : "#0d9488",
            color: saved ? "#059669" : "#fff",
            fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"inherit",
            display:"flex", alignItems:"center", gap:7, transition:"all .2s",
          }}>
            {saved ? "✓ Saved" : "Save Attendance"}
          </button>
        )}
      </div>

      {view === "take" ? (
        <>
          {/* Stats row */}
          <div style={{ display:"flex", gap:12, marginBottom:20 }}>
            {["present","absent","late","excused"].map(t => (
              <StatPill key={t} type={t} count={stats[t]} />
            ))}
          </div>

          {/* Quick mark all */}
          <div style={{
            background:"#fff", border:"1px solid #e8ecf2", borderRadius:14,
            overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.06)",
          }}>
            <div style={{
              padding:"14px 20px", borderBottom:"1px solid #f1f5f9",
              display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10,
            }}>
              <div>
                <div style={{ fontSize:15, fontWeight:600, color:"#1e1e3a" }}>
                  {classes.find(c=>c.id===classId)?.name}
                </div>
                <div style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>
                  {new Date(date + "T00:00:00").toLocaleDateString("en-US",{ weekday:"long", year:"numeric", month:"long", day:"numeric" })}
                </div>
              </div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <span style={{ fontSize:12, color:"#94a3b8" }}>Mark all:</span>
                {["present","absent","late","excused"].map(t => {
                  const cfg = STATUS_CONFIG[t];
                  return (
                    <button key={t} onClick={() => markAll(t)} style={{
                      padding:"5px 12px", borderRadius:6, border:`1px solid ${cfg.color}33`,
                      background: cfg.bg, color: cfg.color, fontSize:12,
                      fontWeight:500, cursor:"pointer", fontFamily:"inherit",
                    }}>{cfg.label}</button>
                  );
                })}
              </div>
            </div>

            {classStudents.length === 0 ? (
              <div style={{ padding:48, textAlign:"center", color:"#94a3b8", fontSize:14 }}>
                No active students in this class
              </div>
            ) : classStudents.map((s, i) => {
              const current = draft[s.id] || "present";
              return (
                <div key={s.id} style={{
                  display:"flex", alignItems:"center", padding:"13px 20px",
                  borderBottom: i < classStudents.length-1 ? "1px solid #f8fafc" : "none",
                  gap:14,
                }}>
                  <Avatar name={s.name} size={36} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:500, color:"#1e1e3a" }}>{s.name}</div>
                    <div style={{ fontSize:12, color:"#94a3b8" }}>{s.sid}</div>
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                      <button key={key} onClick={() => toggle(s.id, key)} style={{
                        width:36, height:36, borderRadius:8, border:"2px solid",
                        borderColor: current === key ? cfg.color : "#e2e8f0",
                        background: current === key ? cfg.bg : "#fff",
                        color: current === key ? cfg.color : "#94a3b8",
                        fontSize:12, fontWeight:700, cursor:"pointer",
                        transition:"all .15s", fontFamily:"inherit",
                      }} title={cfg.label}>{cfg.short}</button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Report View */
        <div style={{
          background:"#fff", border:"1px solid #e8ecf2", borderRadius:14,
          overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.06)",
        }}>
          <div style={{ padding:"16px 20px", borderBottom:"1px solid #f1f5f9" }}>
            <div style={{ fontSize:15, fontWeight:600, color:"#1e1e3a" }}>Attendance Report</div>
            <div style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>
              {classes.find(c=>c.id===classId)?.name} · {allDates.length} school days tracked
            </div>
          </div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"#f8fafc" }}>
                  {["Student","Present","Absent","Late","Excused","Rate",""].map(h => (
                    <th key={h} style={{
                      padding:"11px 18px", textAlign:"left", fontSize:11,
                      fontWeight:600, color:"#94a3b8", borderBottom:"1px solid #f1f5f9",
                      whiteSpace:"nowrap", letterSpacing:".05em", textTransform:"uppercase",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {studentStats.map(s => (
                  <tr key={s.id}
                    onMouseEnter={e => e.currentTarget.style.background="#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                    <td style={{ padding:"13px 18px", borderBottom:"1px solid #f8fafc" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <Avatar name={s.name} size={32} />
                        <div>
                          <div style={{ fontSize:13, fontWeight:500, color:"#1e1e3a" }}>{s.name}</div>
                          <div style={{ fontSize:11, color:"#94a3b8" }}>{s.sid}</div>
                        </div>
                      </div>
                    </td>
                    {["present","absent","late","excused"].map(t => {
                      const cfg = STATUS_CONFIG[t];
                      return (
                        <td key={t} style={{ padding:"13px 18px", borderBottom:"1px solid #f8fafc" }}>
                          <span style={{
                            background: cfg.bg, color: cfg.color,
                            borderRadius:6, padding:"3px 10px", fontSize:13, fontWeight:600,
                          }}>{s[t]}</span>
                        </td>
                      );
                    })}
                    <td style={{ padding:"13px 18px", borderBottom:"1px solid #f8fafc", minWidth:140 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ flex:1, height:6, background:"#f1f5f9", borderRadius:6, overflow:"hidden" }}>
                          <div style={{
                            height:"100%", borderRadius:6, transition:"width .4s",
                            background: s.rate >= 90 ? "#10b981" : s.rate >= 75 ? "#f59e0b" : "#ef4444",
                            width: s.rate + "%",
                          }} />
                        </div>
                        <span style={{
                          fontSize:13, fontWeight:600, minWidth:36,
                          color: s.rate >= 90 ? "#059669" : s.rate >= 75 ? "#d97706" : "#dc2626",
                        }}>{s.rate}%</span>
                      </div>
                    </td>
                    <td style={{ padding:"13px 18px", borderBottom:"1px solid #f8fafc" }}>
                      <span style={{
                        fontSize:11, fontWeight:600, padding:"3px 8px", borderRadius:20,
                        background: s.rate >= 90 ? "#d1fae5" : s.rate >= 75 ? "#fef3c7" : "#fee2e2",
                        color:      s.rate >= 90 ? "#065f46" : s.rate >= 75 ? "#92400e" : "#991b1b",
                      }}>
                        {s.rate >= 90 ? "Good" : s.rate >= 75 ? "At Risk" : "Critical"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Legend */}
          <div style={{
            padding:"14px 20px", borderTop:"1px solid #f1f5f9",
            display:"flex", gap:20, flexWrap:"wrap",
          }}>
            {[
              { label:"≥ 90%  Good",     color:"#059669", bg:"#d1fae5" },
              { label:"75–89%  At Risk",  color:"#d97706", bg:"#fef3c7" },
              { label:"< 75%  Critical",  color:"#dc2626", bg:"#fee2e2" },
            ].map(l => (
              <span key={l.label} style={{
                fontSize:11, fontWeight:500, padding:"3px 10px",
                borderRadius:20, background:l.bg, color:l.color,
              }}>{l.label}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
function Dashboard({ students, classes, attendance }) {
  const todayStr = new Date().toISOString().split("T")[0];
  const todayRec = attendance[todayStr] || {};
  const hasToday = Object.keys(todayRec).length > 0;

  const todayPresent  = Object.values(todayRec).filter(v => v === "present").length;
  const todayAbsent   = Object.values(todayRec).filter(v => v === "absent").length;
  const todayRate     = students.length ? Math.round((todayPresent / students.length) * 100) : 0;

  const classDist = classes.map(c => ({
    ...c, count: students.filter(s => s.classId === c.id).length
  }));

  const StatCard = ({ icon, value, label, sub, subColor }) => (
    <div style={{
      background:"#fff", border:"1px solid #e8ecf2", borderRadius:14,
      padding:"22px 24px", boxShadow:"0 1px 4px rgba(0,0,0,.06)",
    }}>
      <div style={{ fontSize:22, marginBottom:10 }}>{icon}</div>
      <div style={{ fontSize:30, fontWeight:700, color:"#1e1e3a", lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:12, color:"#94a3b8", marginTop:5 }}>{label}</div>
      {sub && <div style={{
        display:"inline-block", marginTop:10, fontSize:11, fontWeight:500,
        background: subColor + "22", color: subColor, borderRadius:20, padding:"2px 9px",
      }}>{sub}</div>}
    </div>
  );

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 }}>
        <StatCard icon="👥" value={students.length} label="Total Students"   sub="Enrolled"        subColor="#0d9488" />
        <StatCard icon="🏫" value={classes.length}  label="Total Classes"    sub="This semester"   subColor="#7c3aed" />
        <StatCard icon="✅" value={hasToday ? todayPresent : "—"} label="Present Today"  sub={hasToday ? `${todayRate}% rate` : "Not taken yet"} subColor="#16a34a" />
        <StatCard icon="⚠️" value={hasToday ? todayAbsent : "—"}  label="Absent Today"   sub={hasToday ? "Needs follow-up" : "Not taken yet"}   subColor="#dc2626" />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div style={{
          background:"#fff", border:"1px solid #e8ecf2", borderRadius:14,
          overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.06)",
        }}>
          <div style={{ padding:"18px 22px", borderBottom:"1px solid #f1f5f9" }}>
            <div style={{ fontSize:15, fontWeight:600, color:"#1e1e3a" }}>Students per Class</div>
          </div>
          <div style={{ padding:"20px 22px", display:"flex", flexDirection:"column", gap:14 }}>
            {classDist.map(c => {
              const pct = students.length ? Math.round((c.count / students.length) * 100) : 0;
              return (
                <div key={c.id}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontSize:13, fontWeight:500, color:"#334155" }}>{c.name}</span>
                    <span style={{ fontSize:13, color:"#64748b" }}>{c.count} students</span>
                  </div>
                  <div style={{ height:8, background:"#f1f5f9", borderRadius:8, overflow:"hidden" }}>
                    <div style={{ height:"100%", borderRadius:8, background:"#0d9488", width:pct+"%" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{
          background:"#fff", border:"1px solid #e8ecf2", borderRadius:14,
          overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.06)",
        }}>
          <div style={{ padding:"18px 22px", borderBottom:"1px solid #f1f5f9" }}>
            <div style={{ fontSize:15, fontWeight:600, color:"#1e1e3a" }}>Today's Attendance</div>
            <div style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>
              {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
            </div>
          </div>
          <div style={{ padding:"20px 22px" }}>
            {!hasToday ? (
              <div style={{ textAlign:"center", padding:"24px 0", color:"#94a3b8", fontSize:14 }}>
                Attendance not taken yet today
              </div>
            ) : (
              <>
                <div style={{ display:"flex", gap:10, marginBottom:20 }}>
                  {["present","absent","late","excused"].map(t => {
                    const cfg = STATUS_CONFIG[t];
                    const cnt = Object.values(todayRec).filter(v=>v===t).length;
                    return (
                      <div key={t} style={{
                        flex:1, background:cfg.bg, borderRadius:10, padding:"12px 8px",
                        textAlign:"center",
                      }}>
                        <div style={{ fontSize:20, fontWeight:700, color:cfg.color }}>{cnt}</div>
                        <div style={{ fontSize:10, color:cfg.color, fontWeight:500, marginTop:2 }}>{cfg.label}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ height:10, background:"#f1f5f9", borderRadius:10, overflow:"hidden", display:"flex" }}>
                  {["present","absent","late","excused"].map(t => {
                    const cfg = STATUS_CONFIG[t];
                    const cnt = Object.values(todayRec).filter(v=>v===t).length;
                    const pct = Object.keys(todayRec).length ? (cnt/Object.keys(todayRec).length)*100 : 0;
                    return pct > 0 ? (
                      <div key={t} style={{ width:pct+"%", background:cfg.dot, transition:"width .4s" }} />
                    ) : null;
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Students ────────────────────────────────────────────────────────────────
function Students({ students, setStudents, classes }) {
  const [search, setSearch]     = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [modal, setModal]       = useState(null);
  const [form, setForm]         = useState(EMPTY_STUDENT);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = useMemo(() => students.filter(s => {
    const m = s.name.toLowerCase().includes(search.toLowerCase()) || s.sid.toLowerCase().includes(search.toLowerCase());
    const c = filterClass === "all" || s.classId === parseInt(filterClass);
    return m && c;
  }), [students, search, filterClass]);

  const openAdd  = () => { setForm({ ...EMPTY_STUDENT, sid:`S${String(students.length+1).padStart(3,"0")}` }); setModal("add"); };
  const openEdit = (s) => { setForm({...s}); setModal(s); };
  const save = () => {
    if (!form.name.trim()) return;
    modal === "add"
      ? setStudents(prev => [...prev, {...form, id:Date.now()}])
      : setStudents(prev => prev.map(s => s.id===form.id ? form : s));
    setModal(null);
  };
  const cls = id => classes.find(c=>c.id===id)?.name || "—";

  return (
    <div>
      <div style={{
        background:"#fff", border:"1px solid #e8ecf2", borderRadius:14,
        padding:"16px 20px", marginBottom:20,
        display:"flex", alignItems:"center", gap:12, flexWrap:"wrap",
        boxShadow:"0 1px 4px rgba(0,0,0,.06)",
      }}>
        <div style={{ position:"relative", flex:1, minWidth:180 }}>
          <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", fontSize:13, color:"#94a3b8" }}>🔍</span>
          <input placeholder="Search by name or ID…" value={search} onChange={e=>setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft:32 }} />
        </div>
        <select value={filterClass} onChange={e=>setFilterClass(e.target.value)} style={{ ...selectStyle, width:180 }}>
          <option value="all">All Classes</option>
          {classes.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={openAdd} style={{
          display:"flex", alignItems:"center", gap:7, padding:"9px 18px",
          background:"#0d9488", color:"#fff", border:"none", borderRadius:8,
          fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"inherit",
        }}>＋ Add Student</button>
      </div>

      <div style={{ background:"#fff", border:"1px solid #e8ecf2", borderRadius:14, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
        <div style={{ padding:"16px 20px", borderBottom:"1px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:15, fontWeight:600, color:"#1e1e3a" }}>All Students</div>
          <div style={{ fontSize:12, color:"#94a3b8", background:"#f1f5f9", padding:"3px 10px", borderRadius:20 }}>{filtered.length} records</div>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#f8fafc" }}>
                {["Student","ID","Class","Gender","Phone","Status","Actions"].map(h=>(
                  <th key={h} style={{ padding:"11px 18px", textAlign:"left", fontSize:11, fontWeight:600, color:"#94a3b8", borderBottom:"1px solid #f1f5f9", whiteSpace:"nowrap", letterSpacing:".05em", textTransform:"uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length===0 ? (
                <tr><td colSpan={7} style={{ padding:48, textAlign:"center", color:"#94a3b8", fontSize:14 }}>No students found</td></tr>
              ) : filtered.map(s=>(
                <tr key={s.id} onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"13px 18px", borderBottom:"1px solid #f8fafc" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <Avatar name={s.name} />
                      <span style={{ fontSize:14, fontWeight:500, color:"#1e1e3a" }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:"13px 18px", borderBottom:"1px solid #f8fafc", fontSize:13, color:"#64748b", fontFamily:"monospace" }}>{s.sid}</td>
                  <td style={{ padding:"13px 18px", borderBottom:"1px solid #f8fafc", fontSize:13, color:"#334155" }}>{cls(s.classId)}</td>
                  <td style={{ padding:"13px 18px", borderBottom:"1px solid #f8fafc", fontSize:13, color:"#64748b" }}>{s.gender}</td>
                  <td style={{ padding:"13px 18px", borderBottom:"1px solid #f8fafc", fontSize:13, color:"#64748b" }}>{s.phone}</td>
                  <td style={{ padding:"13px 18px", borderBottom:"1px solid #f8fafc" }}><Badge status={s.status}/></td>
                  <td style={{ padding:"13px 18px", borderBottom:"1px solid #f8fafc" }}>
                    <div style={{ display:"flex", gap:6 }}>
                      <button onClick={()=>openEdit(s)} style={{ padding:"5px 12px", borderRadius:6, border:"1px solid #e2e8f0", background:"#fff", fontSize:12, cursor:"pointer", color:"#334155" }}>Edit</button>
                      <button onClick={()=>setDeleteId(s.id)} style={{ padding:"5px 12px", borderRadius:6, border:"none", background:"#fee2e2", fontSize:12, cursor:"pointer", color:"#dc2626" }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal==="add" ? "Add New Student" : "Edit Student"} onClose={()=>setModal(null)}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
            <div style={{ gridColumn:"1/-1" }}>
              <Field label="Full Name"><input style={inputStyle} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. John Smith"/></Field>
            </div>
            <Field label="Student ID"><input style={inputStyle} value={form.sid} onChange={e=>setForm({...form,sid:e.target.value})}/></Field>
            <Field label="Phone"><input style={inputStyle} value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="555-0000"/></Field>
            <Field label="Class">
              <select style={selectStyle} value={form.classId} onChange={e=>setForm({...form,classId:parseInt(e.target.value)})}>
                {classes.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Gender">
              <select style={selectStyle} value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}>
                <option>Male</option><option>Female</option>
              </select>
            </Field>
            <div style={{ gridColumn:"1/-1" }}>
              <Field label="Status">
                <select style={selectStyle} value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                  <option>Active</option><option>Inactive</option>
                </select>
              </Field>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:8 }}>
            <button onClick={()=>setModal(null)} style={{ padding:"9px 18px", borderRadius:8, border:"1px solid #e2e8f0", background:"#fff", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
            <button onClick={save} style={{ padding:"9px 22px", borderRadius:8, border:"none", background:"#0d9488", color:"#fff", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"inherit" }}>Save</button>
          </div>
        </Modal>
      )}
      {deleteId && (
        <Modal title="Delete Student?" onClose={()=>setDeleteId(null)}>
          <p style={{ fontSize:14, color:"#64748b", marginBottom:24 }}>This action cannot be undone.</p>
          <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
            <button onClick={()=>setDeleteId(null)} style={{ padding:"9px 18px", borderRadius:8, border:"1px solid #e2e8f0", background:"#fff", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
            <button onClick={()=>{ setStudents(prev=>prev.filter(s=>s.id!==deleteId)); setDeleteId(null); }} style={{ padding:"9px 22px", borderRadius:8, border:"none", background:"#dc2626", color:"#fff", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"inherit" }}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Classes ─────────────────────────────────────────────────────────────────
function Classes({ classes, setClasses, students }) {
  const [modal, setModal]   = useState(null);
  const [form, setForm]     = useState(EMPTY_CLASS);
  const [deleteId, setDeleteId] = useState(null);
  const count = id => students.filter(s=>s.classId===id).length;
  const openAdd  = () => { setForm(EMPTY_CLASS); setModal("add"); };
  const openEdit = (c) => { setForm({...c}); setModal(c); };
  const save = () => {
    if (!form.name.trim()) return;
    modal==="add"
      ? setClasses(prev=>[...prev,{...form,id:Date.now()}])
      : setClasses(prev=>prev.map(c=>c.id===form.id?form:c));
    setModal(null);
  };
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:20 }}>
        <button onClick={openAdd} style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 20px", background:"#0d9488", color:"#fff", border:"none", borderRadius:9, fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"inherit" }}>＋ Add Class</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px,1fr))", gap:16 }}>
        {classes.map(c=>(
          <div key={c.id} style={{ background:"#fff", border:"1px solid #e8ecf2", borderRadius:14, padding:22, boxShadow:"0 1px 4px rgba(0,0,0,.06)", display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:15, fontWeight:600, color:"#1e1e3a" }}>{c.name}</div>
                <div style={{ fontSize:12, color:"#94a3b8", marginTop:3 }}>Room {c.room}</div>
              </div>
              <div style={{ background:"#ede9fe", color:"#6d28d9", borderRadius:8, padding:"4px 10px", fontSize:12, fontWeight:600 }}>{count(c.id)} <span style={{ fontWeight:400 }}>students</span></div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <Avatar name={c.teacher} size={28}/>
              <div>
                <div style={{ fontSize:12, fontWeight:500, color:"#334155" }}>{c.teacher}</div>
                <div style={{ fontSize:11, color:"#94a3b8" }}>Class Teacher</div>
              </div>
            </div>
            <div style={{ height:5, background:"#f1f5f9", borderRadius:5, overflow:"hidden" }}>
              <div style={{ height:"100%", background:"#0d9488", borderRadius:5, width:students.length?(count(c.id)/students.length*100)+"%":"0%" }} />
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>openEdit(c)} style={{ flex:1, padding:"7px 0", borderRadius:7, border:"1px solid #e2e8f0", background:"#fff", fontSize:12, cursor:"pointer", color:"#334155", fontFamily:"inherit" }}>Edit</button>
              <button onClick={()=>setDeleteId(c.id)} style={{ flex:1, padding:"7px 0", borderRadius:7, border:"none", background:"#fee2e2", fontSize:12, cursor:"pointer", color:"#dc2626", fontFamily:"inherit" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal title={modal==="add"?"Add New Class":"Edit Class"} onClose={()=>setModal(null)}>
          <Field label="Class Name"><input style={inputStyle} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Grade 1 — A"/></Field>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
            <Field label="Grade"><input style={inputStyle} value={form.grade} onChange={e=>setForm({...form,grade:e.target.value})} placeholder="Grade 1"/></Field>
            <Field label="Room Number"><input style={inputStyle} value={form.room} onChange={e=>setForm({...form,room:e.target.value})} placeholder="101"/></Field>
          </div>
          <Field label="Class Teacher"><input style={inputStyle} value={form.teacher} onChange={e=>setForm({...form,teacher:e.target.value})} placeholder="Ms. Jane Doe"/></Field>
          <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:8 }}>
            <button onClick={()=>setModal(null)} style={{ padding:"9px 18px", borderRadius:8, border:"1px solid #e2e8f0", background:"#fff", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
            <button onClick={save} style={{ padding:"9px 22px", borderRadius:8, border:"none", background:"#0d9488", color:"#fff", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"inherit" }}>Save</button>
          </div>
        </Modal>
      )}
      {deleteId && (
        <Modal title="Delete Class?" onClose={()=>setDeleteId(null)}>
          <p style={{ fontSize:14, color:"#64748b", marginBottom:24 }}>This class will be permanently deleted.</p>
          <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
            <button onClick={()=>setDeleteId(null)} style={{ padding:"9px 18px", borderRadius:8, border:"1px solid #e2e8f0", background:"#fff", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
            <button onClick={()=>{ setClasses(prev=>prev.filter(c=>c.id!==deleteId)); setDeleteId(null); }} style={{ padding:"9px 22px", borderRadius:8, border:"none", background:"#dc2626", color:"#fff", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"inherit" }}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]         = useState("dashboard");
  const [students, setStudents] = useState(INIT_STUDENTS);
  const [classes, setClasses]   = useState(CLASSES);
  const [attendance, setAttendance] = useState(INIT_ATTENDANCE);

  const PAGE_TITLES = {
    dashboard:  { title:"Dashboard",        sub:"Overview of your school" },
    students:   { title:"Students",         sub:"Manage student records" },
    classes:    { title:"Classes",          sub:"Manage classrooms & teachers" },
    attendance: { title:"Attendance",       sub:"Track daily attendance" },
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#f1f5f9", fontFamily:"system-ui,-apple-system,sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width:220, background:"#1e1e3a", display:"flex", flexDirection:"column", flexShrink:0, position:"sticky", top:0, height:"100vh" }}>
        <div style={{ padding:"24px 20px 18px", borderBottom:"1px solid rgba(255,255,255,.07)" }}>
          <div style={{ fontSize:15, fontWeight:700, color:"#5eead4" }}>EduManage</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", marginTop:3 }}>School Management</div>
        </div>
        <nav style={{ flex:1, padding:"14px 10px", display:"flex", flexDirection:"column", gap:3 }}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setPage(n.id)} style={{
              display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:8,
              cursor:"pointer", fontSize:13, border:"none", width:"100%", textAlign:"left",
              background: page===n.id ? "#0d9488" : "transparent",
              color: page===n.id ? "#fff" : "rgba(255,255,255,.55)",
              fontFamily:"inherit", transition:"all .15s",
            }}>
              <span style={{ fontSize:15 }}>{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding:"14px 20px", borderTop:"1px solid rgba(255,255,255,.07)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <Avatar name="Admin User" size={30}/>
            <div>
              <div style={{ fontSize:12, fontWeight:500, color:"rgba(255,255,255,.8)" }}>Admin</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,.35)" }}>admin@school.edu</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        <div style={{ background:"#fff", borderBottom:"1px solid #e8ecf2", padding:"16px 28px", position:"sticky", top:0, zIndex:10, boxShadow:"0 1px 3px rgba(0,0,0,.05)" }}>
          <div style={{ fontSize:19, fontWeight:700, color:"#1e1e3a" }}>{PAGE_TITLES[page].title}</div>
          <div style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>{PAGE_TITLES[page].sub}</div>
        </div>
        <div style={{ padding:28, flex:1 }}>
          {page==="dashboard"  && <Dashboard  students={students} classes={classes} attendance={attendance}/>}
          {page==="students"   && <Students   students={students} setStudents={setStudents} classes={classes}/>}
          {page==="classes"    && <Classes    classes={classes}   setClasses={setClasses}   students={students}/>}
          {page==="attendance" && <Attendance students={students} classes={classes} attendance={attendance} setAttendance={setAttendance}/>}
        </div>
      </div>
    </div>
  );
}
