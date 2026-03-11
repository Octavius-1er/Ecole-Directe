import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();

  const cards = [
    { to: "/notes",           icon: "📊", label: "Notes",            desc: "Consulter vos notes et moyennes" },
    { to: "/cahier-de-texte", icon: "📋", label: "Cahier de textes", desc: "Devoirs et travail à faire" },
    { to: "/emploi-du-temps", icon: "📅", label: "Emploi du temps",  desc: "Planning de la semaine" },
    { to: "/messagerie",      icon: "💬", label: "Messagerie",       desc: "Messages et communications" },
    { to: "/vie-scolaire",    icon: "👤", label: "Vie scolaire",     desc: "Absences et sanctions" },
  ];

  if (user?.role === "admin") {
    cards.push({ to: "/classes", icon: "🏫", label: "Gestion classes", desc: "Créer et gérer les classes" });
    cards.push({ to: "/admin",   icon: "⚙️", label: "Gestion comptes", desc: "Créer et gérer les comptes" });
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Bonjour, {user?.prenom} 👋</h1>
        <p className="dashboard-sub">
          {user?.role === "eleve" && `Classe : ${user?.classe || "Non affectée"}`}
          {user?.role === "prof"  && `Professeur de ${user?.matiere || ""}`}
          {user?.role === "admin" && "Administrateur"}
        </p>
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
