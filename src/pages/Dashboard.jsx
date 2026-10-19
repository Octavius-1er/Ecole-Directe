import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { ROLE_LABELS } from "../roles";
import "./Dashboard.css";

const CARDS = [
  { to: "/notes", icon: "▦", label: "Notes", desc: "Moyennes, relevés et compétences" },
  { to: "/cahier-de-texte", icon: "☰", label: "Cahier de textes", desc: "Travail à faire et contenus de séance" },
  { to: "/emploi-du-temps", icon: "▤", label: "Emploi du temps", desc: "Planning de la semaine" },
  { to: "/messagerie", icon: "✎", label: "Messagerie", desc: "Messages de l'établissement" },
  { to: "/vie-scolaire", icon: "◉", label: "Vie scolaire", desc: "Absences, retards et sanctions" },
];

const ADMIN_CARDS = [
  { to: "/classes", icon: "▣", label: "Gestion classes", desc: "Classes et affectation des élèves" },
  { to: "/periode", icon: "◷", label: "Période scolaire", desc: "Trimestre et relevé ouverts" },
  { to: "/admin", icon: "⚙", label: "Gestion comptes", desc: "Élèves, parents, professeurs" },
];

export default function Dashboard() {
  const { user, accounts } = useAuth();
  const child = user?.role === "parent" ? accounts.find(a => a.id === user.enfantId) : null;
  const cards = user?.role === "prof"
    ? CARDS.filter(c => c.to !== "/vie-scolaire")
    : user?.role === "admin"
      ? [...CARDS, ...ADMIN_CARDS]
      : CARDS;

  const line = user?.role === "eleve"
    ? `Élève · ${user.classe || "Classe non affectée"}`
    : user?.role === "parent"
      ? `Parent de ${child ? `${child.prenom} ${child.nom}` : "votre enfant"} · ${user.classe || ""}`
      : user?.role === "prof"
        ? `Professeur de ${user.matiere || "—"}`
        : "Direction de l'établissement";

  return (
    <div className="dashboard-container">
      <div className="dashboard-hero">
        <p className="dashboard-kicker">{ROLE_LABELS[user?.role]}</p>
        <h1>Bonjour, {user?.prenom}</h1>
        <p className="dashboard-sub">{line}</p>
      </div>
      <div className="dashboard-cards">
        {cards.map(card => (
          <Link key={card.to} to={card.to} className="dashboard-card">
            <span className="card-icon">{card.icon}</span>
            <div>
              <div className="card-label">{card.label}</div>
              <div className="card-desc">{card.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
