export const dynamic = 'force-dynamic'
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const roles = [
    {
      id: "admin",
      title: "مسؤول النظام",
      icon: "🏛️",
      desc: "إدارة المدرسة والتقارير والإحصائيات",
      color: "from-emerald-500 to-teal-600",
      email: "admin@edumanage.com",
      password: "admin123"
    },
    {
      id: "teacher",
      title: "المعلم",
      icon: "👨‍🏫",
      desc: "إدارة الفصول والحضور والدرجات",
      color: "from-blue-500 to-indigo-600",
      email: "teacher@edumanage.com",
      password: "teacher123"
    },
    {
      id: "parent",
      title: "ولي الأمر",
      icon: "👨‍👩‍👧",
      desc: "متابعة تقدم الطالب والتواصل",
      color: "from-purple-500 to-pink-600",
      email: "parent@edumanage.com",
      password: "parent123"
    }
  ];

  const handleRoleSelect = (role: any) => {
    setSelectedRole(role);
    setEmail(role.email);
    setPassword(role.password);
    setError("");
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    
    // التحقق البسيط من البيانات
    const role = roles.find(r => r.email === email && r.password === password);
    
    if (role) {
      // حفظ الدور في localStorage
      localStorage.setItem("userRole", role.id);
      localStorage.setItem("userName", role.title);
      
      // التوجيه إلى لوحة التحكم
      router.push(`/dashboard/${role.id}`);
    } else {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <div style={{ width: "100%", maxWidth: "900px" }}>
        {!selectedRole ? (
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "48px", fontWeight: "bold", color: "white", marginBottom: "16px" }}>
              🎓 EduManage
            </h1>
            <p style={{ color: "#94a3b8", marginBottom: "48px", fontSize: "20px" }}>
              اختر نوع الحساب للدخول إلى النظام
            </p>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "24px"
            }}>
              {roles.map((role: any) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  style={{
                    background: "rgba(30, 41, 59, 0.5)",
                    border: "1px solid #334155",
                    borderRadius: "16px",
                    padding: "32px",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    backdropFilter: "blur(10px)",
                    color: "white",
                    textAlign: "center"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(16, 185, 129, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    width: "64px",
                    height: "64px",
                    margin: "0 auto 16px",
                    borderRadius: "12px",
                    background: `linear-gradient(to bottom right, ${role.color.includes("emerald") ? "#10b981, #0d9488" : role.color.includes("blue") ? "#3b82f6, #4f46e5" : "#a855f7, #ec4899"})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "32px"
                  }}>
                    {role.icon}
                  </div>
                  <h3 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>{role.title}</h3>
                  <p style={{ color: "#94a3b8", fontSize: "14px" }}>{role.desc}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: "400px", margin: "0 auto" }}>
            <button
              onClick={() => setSelectedRole(null)}
              style={{
                marginBottom: "24px",
                color: "#94a3b8",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              ← رجوع
            </button>

            <div style={{
              background: "rgba(30, 41, 59, 0.5)",
              border: "1px solid #334155",
              borderRadius: "16px",
              padding: "32px",
              backdropFilter: "blur(10px)"
            }}>
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <div style={{
                  width: "80px",
                  height: "80px",
                  margin: "0 auto 16px",
                  borderRadius: "12px",
                  background: `linear-gradient(to bottom right, ${selectedRole.color.includes("emerald") ? "#10b981, #0d9488" : selectedRole.color.includes("blue") ? "#3b82f6, #4f46e5" : "#a855f7, #ec4899"})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "40px"
                }}>
                  {selectedRole.icon}
                </div>
                <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>
                  تسجيل الدخول كـ {selectedRole.title}
                </h2>
              </div>

              {error && (
                <div style={{
                  marginBottom: "16px",
                  padding: "12px",
                  background: "rgba(239, 68, 68, 0.2)",
                  border: "1px solid rgba(239, 68, 68, 0.5)",
                  borderRadius: "8px",
                  color: "#fca5a5",
                  textAlign: "center",
                  fontSize: "14px"
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", color: "#cbd5e1", fontSize: "14px", marginBottom: "8px" }}>
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "rgba(15, 23, 42, 0.5)",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                      color: "white",
                      fontSize: "16px",
                      outline: "none"
                    }}
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label style={{ display: "block", color: "#cbd5e1", fontSize: "14px", marginBottom: "8px" }}>
                    كلمة المرور
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "rgba(15, 23, 42, 0.5)",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                      color: "white",
                      fontSize: "16px",
                      outline: "none"
                    }}
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "linear-gradient(to right, #10b981, #0d9488)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                    marginTop: "8px"
                  }}
                >
                  تسجيل الدخول
                </button>
              </form>

              <div style={{
                marginTop: "24px",
                padding: "16px",
                background: "rgba(15, 23, 42, 0.5)",
                borderRadius: "8px"
              }}>
                <p style={{ color: "#94a3b8", fontSize: "14px", textAlign: "center", marginBottom: "8px" }}>
                  🔑 بيانات تجريبية:
                </p>
                <p style={{ color: "#34d399", fontSize: "14px", textAlign: "center", fontFamily: "monospace" }}>
                  {selectedRole.email} / {selectedRole.password}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
