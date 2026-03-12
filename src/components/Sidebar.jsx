import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useData } from "../DataContext";
import "./Sidebar.css";

const MENU_ELEVE = [
  { to: "/",                icon: "⊞",  label: "Accueil" },
  { to: "/vie-scolaire",    icon: "👤", label: "Vie scolaire" },
  { to: "/notes",           icon: "📊", label: "Notes",           hasNotif: true },
  { to: "/messagerie",      icon: "💬", label: "Messagerie",      hasNotif: true },
  { to: "/emploi-du-temps", icon: "📅", label: "Emploi du temps" },
  { to: "/cahier-de-texte", icon: "📋", label: "Cahier de textes" },
];

const MENU_PROF = [
  { to: "/",                icon: "⊞",  label: "Accueil" },
  { to: "/notes",           icon: "📊", label: "Notes" },
  { to: "/messagerie",      icon: "💬", label: "Messagerie",      hasNotif: true },
  { to: "/emploi-du-temps", icon: "📅", label: "Emploi du temps" },
  { to: "/cahier-de-texte", icon: "📋", label: "Cahier de textes" },
];

const MENU_ADMIN = [
  { to: "/",                icon: "⊞",  label: "Accueil" },
  { to: "/vie-scolaire",    icon: "👤", label: "Vie scolaire" },
  { to: "/notes",           icon: "📊", label: "Notes" },
  { to: "/messagerie",      icon: "💬", label: "Messagerie",      hasNotif: true },
  { to: "/emploi-du-temps", icon: "📅", label: "Emploi du temps" },
  { to: "/cahier-de-texte", icon: "📋", label: "Cahier de textes" },
  { to: "/classes",         icon: "🏫", label: "Gestion classes" },
  { to: "/periode",         icon: "📅", label: "Période scolaire" },
  { to: "/admin",           icon: "⚙️", label: "Gestion comptes" },
];

const MENUS = { admin: MENU_ADMIN, prof: MENU_PROF, eleve: MENU_ELEVE };

export default function Sidebar({ expanded, onEnter, onLeave }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { messages } = useData();

  // Pages visitées — on persiste dans localStorage
  const [visited, setVisited] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ed_visited") || "[]"); }
    catch { return []; }
  });

  // Marquer la page courante comme visitée
  useEffect(() => {
    const path = location.pathname;
    setVisited(prev => {
      if (prev.includes(path)) return prev;
      const next = [...prev, path];
      localStorage.setItem("ed_visited", JSON.stringify(next));
      return next;
    });
  }, [location.pathname]);

  // Calcule si une route a une vraie notif non lue
  function hasUnread(to) {
    if (visited.includes(to)) return false;
    if (to === "/messagerie") return messages?.some(m => !m.lu);
    if (to === "/notes") return true; // 2 nouvelles notes non consultées
    return false;
  }

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
          <span className="avatar-role">
            {user?.role === "admin" ? "Administrateur"
              : user?.role === "prof" ? `Prof. ${user?.matiere || ""}`
              : user?.classe || "Élève"}
          </span>
        </div>
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">
        {menu.map((item) => {
          const active = location.pathname === item.to;
          const notif = item.hasNotif && hasUnread(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`sidebar-item ${active ? "active" : ""}`}
            >
              <span className="sidebar-icon-wrap">
                <span className="sidebar-icon">{item.icon}</span>
                {notif && <span className="sidebar-dot" />}
              </span>
              <span className="sidebar-label">{item.label}</span>
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
