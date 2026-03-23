"use client";
import { useState } from "react";
import Now from "./components/Now";
import Channels from "./components/Channels";
import TaskBoard from "./components/TaskBoard";
import Calendar from "./components/Calendar";
import Projects from "./components/Projects";
import GHLPipeline from "./components/GHLPipeline";
import Team from "./components/Team";
import Docs from "./components/Docs";
import Memory from "./components/Memory";
import DataStatus from "./components/DataStatus";
import Office from "./components/Office";
import SidebarStatus from "./components/SidebarStatus";
import ActivityFeed from "./components/ActivityFeed";

const NAV = [
  { id: "now",      icon: "⚡", label: "Now" },
  { id: "channels", icon: "💬", label: "Agent Channels" },
  { id: "tasks",    icon: "⬛", label: "Task Board" },
  { id: "calendar", icon: "📅", label: "Calendar" },
  { id: "projects", icon: "🗂️", label: "Projects" },
  { id: "ghl",      icon: "🔥", label: "GHL Pipeline" },
  { id: "team",     icon: "👥", label: "Team" },
  { id: "office",   icon: "🏢", label: "Office" },
  { id: "data",     icon: "📡", label: "Data Status" },
  { id: "docs",     icon: "📄", label: "Docs" },
  { id: "memory",   icon: "🧠", label: "Memory" },
];

export default function Home() {
  const [active, setActive] = useState("now");

  const renderScreen = () => {
    switch (active) {
      case "now":      return <Now />;
      case "activity": return <ActivityFeed />;
      case "channels": return <Channels />;
      case "tasks":    return <TaskBoard />;
      case "calendar": return <Calendar />;
      case "projects": return <Projects />;
      case "ghl":      return <GHLPipeline />;
      case "team":     return <Team />;
      case "office":   return <Office />;
      case "data":     return <DataStatus />;
      case "docs":     return <Docs />;
      case "memory":   return <Memory />;
      default:         return <Now />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <aside style={{
        width: 220,
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>🏎️</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>FTH Mission Control</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Fast Track Homes LLC</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "8px 0" }}>
          {NAV.map(n => (
            <button
              key={n.id}
              onClick={() => setActive(n.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "8px 16px",
                background: active === n.id ? "var(--accent-dim)" : "transparent",
                border: "none",
                borderLeft: active === n.id ? "2px solid var(--accent)" : "2px solid transparent",
                color: active === n.id ? "var(--text)" : "var(--text-muted)",
                cursor: "pointer",
                fontSize: 13,
                textAlign: "left",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 14 }}>{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>

        <SidebarStatus />
        <form action="/auth/logout" method="post" style={{ padding: 16, borderTop: "1px solid var(--border)" }}>
          <button
            type="submit"
            style={{ width: "100%", background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", fontWeight: 700, cursor: "pointer" }}
          >
            Sign out
          </button>
        </form>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: "auto", background: "var(--background)" }}>
        {renderScreen()}
      </main>
    </div>
  );
}
 );
}
