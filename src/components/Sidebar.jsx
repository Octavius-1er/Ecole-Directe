import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useData } from "../DataContext";
import { ROLE_LABELS } from "../roles";
import "./Sidebar.css";

const MENU_FAMILLE = [
  { to: "/", icon: "⌂", label: "Accueil" },
  { to: "/vie-scolaire", icon: "◉", label: "Vie scolaire" },
  { to: "/notes", icon: "▦", label: "Notes" },
  { to: "/messagerie", icon: "✎", label: "Messagerie" },
  { to: "/emploi-du-temps", icon: "▤", label: "Emploi du temps" },
  { to: "/cahier-de-texte", icon: "☰", label: "Cahier de textes" },
];

const MENU_PROF = [
  { to: "/", icon: "⌂", label: "Accueil" },
  { to: "/notes", icon: "▦", label: "Notes" },
  { to: "/messagerie", icon: "✎", label: "Messagerie" },
  { to: "/emploi-du-temps", icon: "▤", label: "Emploi du temps" },
  { to: "/cahier-de-texte", icon: "☰", label: "Cahier de textes" },
];

const MENU_ADMIN = [
  ...MENU_FAMILLE,
  { to: "/classes", icon: "▣", label: "Gestion classes" },
  { to: "/periode", icon: "◷", label: "Période scolaire" },
  { to: "/admin", icon: "⚙", label: "Gestion comptes" },
];

const MENUS = { admin: MENU_ADMIN, prof: MENU_PROF, parent: MENU_FAMILLE, eleve: MENU_FAMILLE };

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { messages } = useData();
  const menu = MENUS[user?.role] || MENU_FAMILLE;
  const initials = user ? (user.prenom[0] + (user.nom[0] || "")).toUpperCase() : "?";
  const unread = messages?.filter(m => !m.lu).length || 0;
  const detail = user?.role === "prof"
    ? user.matiere || "Professeur"
    : user?.role === "eleve" || user?.role === "parent"
      ? user.classe || ROLE_LABELS[user.role]
      : ROLE_LABELS[user?.role] || "";

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">É</div>
        <div>
          <div className="brand-name">École Direct</div>
          <div className="brand-place">Collège Privé Bobée</div>
        </div>
      </div>

      <div className="sidebar-avatar">
        <div className="avatar-circle">{initials}</div>
        <div className="avatar-name">
          <span>{user?.prenom} {user?.nom}</span>
          <span className="avatar-role">{ROLE_LABELS[user?.role]} · {detail}</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        {menu.map((item) => {
          const active = location.pathname === item.to;
          const notif = item.to === "/messagerie" && unread > 0;
          return (
            <Link key={item.to} to={item.to} className={`sidebar-item ${active ? "active" : ""}`}>
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
              {notif && <span className="sidebar-count">{unread}</span>}
            </Link>
          );
        })}
      </nav>

      <button className="sidebar-logout" onClick={logout}>
        <span className="sidebar-icon">↩</span>
        <span className="sidebar-label">Déconnexion</span>
      </button>
    </aside>
  );
}
