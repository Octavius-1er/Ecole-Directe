import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./Sidebar.css";

const MENU_ELEVE = [
  { to: "/",                icon: "⊞",  label: "Accueil" },
  { to: "/vie-scolaire",    icon: "👤", label: "Vie scolaire" },
  { to: "/notes",           icon: "📊", label: "Notes",           badge: "2" },
  { to: "/messagerie",      icon: "💬", label: "Messagerie",      badge: "3" },
  { to: "/emploi-du-temps", icon: "📅", label: "Emploi du temps" },
  { to: "/cahier-de-texte", icon: "📋", label: "Cahier de textes" },
];

const MENU_PROF = [
  { to: "/",                icon: "⊞",  label: "Accueil" },
  { to: "/notes",           icon: "📊", label: "Notes" },
  { to: "/messagerie",      icon: "💬", label: "Messagerie",      badge: "3" },
  { to: "/emploi-du-temps", icon: "📅", label: "Emploi du temps" },
  { to: "/cahier-de-texte", icon: "📋", label: "Cahier de textes" },
];

const MENU_ADMIN = [
  { to: "/",                icon: "⊞",  label: "Accueil" },
  { to: "/vie-scolaire",    icon: "👤", label: "Vie scolaire" },
  { to: "/notes",           icon: "📊", label: "Notes" },
  { to: "/messagerie",      icon: "💬", label: "Messagerie",      badge: "3" },
  { to: "/emploi-du-temps", icon: "📅", label: "Emploi du temps" },
  { to: "/cahier-de-texte", icon: "📋", label: "Cahier de textes" },
  { to: "/admin",           icon: "⚙️", label: "Gestion comptes" },
];

const MENUS = { admin: MENU_ADMIN, prof: MENU_PROF, eleve: MENU_ELEVE };

export default function Sidebar({ expanded, onEnter, onLeave }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menu = MENUS[user?.role] || MENU_ELEVE;
  const initials = user ? (user.prenom[0] + (user.nom[0] || "")).toUpperCase() : "?";

  return (
    <div
      className={`sidebar ${expanded ? "expanded" : ""}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Avatar */}
      <div className="sidebar-avatar">
        <div className="avatar-circle">{initials}</div>
        <div className="avatar-name">
          <span>{user?.prenom} {user?.nom}</span>
          <span className="avatar-role">{user?.role === "admin" ? "Administrateur" : user?.role === "prof" ? `Prof. ${user?.matiere || ""}` : user?.classe || "Élève"}</span>
        </div>
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">
        {menu.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`sidebar-item ${active ? "active" : ""}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
              {item.badge && <span className="sidebar-badge">{item.badge}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Déconnexion */}
      <button className="sidebar-logout" onClick={logout}>
        <span className="sidebar-icon">🚪</span>
        <span className="sidebar-label">Déconnexion</span>
      </button>
    </div>
  );
}
