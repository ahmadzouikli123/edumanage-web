"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ userRole }) {
  const pathname = usePathname();

  const menuItems = {
    admin: [
      { href: "/dashboard/admin", label: "الرئيسية", icon: "🏠" },
      { href: "/dashboard/admin/students", label: "الطلاب", icon: "👨‍🎓" },
    ],
    teacher: [
      { href: "/dashboard/teacher", label: "الرئيسية", icon: "🏠" },
    ],
    parent: [
      { href: "/dashboard/parent", label: "الرئيسية", icon: "🏠" },
    ],
  };

  const items = menuItems[userRole] || [];

  return (
    <aside style={{
      width: "250px",
      minHeight: "100vh",
      background: "#1e293b",
      borderLeft: "1px solid #334155",
      position: "fixed",
      right: 0,
      top: 0,
      padding: "24px 16px",
    }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>🎓 EduManage</h2>
        <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>نظام إدارة المدرسة</p>
      </div>

      <nav>
        {items.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={index}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                marginBottom: "8px",
                borderRadius: "8px",
                textDecoration: "none",
                color: isActive ? "white" : "#94a3b8",
                background: isActive ? "#10b981" : "transparent",
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => {
          localStorage.removeItem("userRole");
          localStorage.removeItem("userName");
          window.location.href = "/login";
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          width: "100%",
          padding: "12px 16px",
          marginTop: "32px",
          borderRadius: "8px",
          background: "transparent",
          border: "none",
          color: "#ef4444",
          cursor: "pointer",
          borderTop: "1px solid #334155",
        }}
      >
        <span>🚪</span>
        <span>تسجيل الخروج</span>
      </button>
    </aside>
  );
}
