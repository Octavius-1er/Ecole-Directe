import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">

      <h2 className="sidebar-title">École Direct</h2>

      <nav className="sidebar-menu">
        <Link to="/">Dashboard</Link>
        <Link to="/vie-scolaire">Vie scolaire</Link>
        <Link to="/notes">Notes</Link>
        <Link to="/notes-comparatives">Notes comparatives</Link>
        <Link to="/competences">Compétences</Link>
        <Link to="/messagerie">Messagerie</Link>
        <Link to="/emploi-du-temps">Emploi du temps</Link>
        <Link to="/cahier-de-textes">Cahier de textes</Link>
      </nav>

    </div>
  );
}
