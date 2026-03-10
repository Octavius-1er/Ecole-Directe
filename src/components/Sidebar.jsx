import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const MENU = [
  { to: "/",                icon: "⊞",  label: "Accueil" },
  { to: "/vie-scolaire",    icon: "👤", label: "Vie scolaire" },
  { to: "/notes",           icon: "📊", label: "Notes",        badge: "18/20" },
  { to: "/messagerie",      icon: "💬", label: "Messagerie",   badge: "44" },
  { to: "/emploi-du-temps", icon: "📅", label: "Emploi du temps" },
  { to: "/cahier-de-texte", icon: "📋", label: "Cahier de textes" },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  return (
    <div
      className={`sidebar ${expanded ? "expanded" : ""}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Avatar */}
      <div className="sidebar-avatar">
        <div className="avatar-circle">OL</div>
        {expanded && (
          <div className="avatar-name">
            <span>OCTAVE LE</span>
            <span>CHATELIER</span>
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">
        {MENU.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`sidebar-item ${active ? "active" : ""}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {expanded && <span className="sidebar-label">{item.label}</span>}
              {item.badge && (
                <span className="sidebar-badge">{item.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
