import React from "react";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">

      {/* Colonne gauche : Quoi de neuf */}
      <div className="dashboard-column">
        <h2>Quoi de neuf ?</h2>

        <div className="news-card">
          <h3>18/20 — Nouvelles évaluations</h3>
          <p><strong>Mercredi 4 mars</strong></p>
          <ul>
            <li>Sciences Vie & Terre</li>
            <li>LCA Latin</li>
          </ul>
        </div>

        <div className="news-card">
          <h3>Soirée Louanges</h3>
          <p>Mardi 3 mars</p>
        </div>

        <div className="news-card">
          <h3>Partenariat Librairie Colbert</h3>
          <p>Lundi 2 mars</p>
        </div>
      </div>

      {/* Colonne centrale : Informations */}
      <div className="dashboard-column">
        <h2>Informations</h2>

        <div className="info-card">
          <h3>Les Portes Ouvertes</h3>
          <p>
            Pour les élèves de 5ème et 4ème : projets agricoles, bois, paysagers…
          </p>
          <p>
            Pour les élèves de 4ème : projet 3ème Prépa-Métiers.
          </p>

          <h4>Mercredi 4 mars :</h4>
          <ul>
            <li>Lycée de la coiffure Albert Pourrière (Rouen)</li>
          </ul>

          <h4>Samedi 7 mars :</h4>
          <ul>
            <li>Lycée Raymond Queneau (Yvetot)</li>
            <li>Lycée Agricole et CFA (Yvetot)</li>
          </ul>
        </div>
      </div>

      {/* Colonne droite : Emploi du temps */}
      <div className="dashboard-column">
        <h2>Emploi du temps</h2>

        <div className="edt-card">
          <p><strong>9 mars 2026</strong></p>

          <div className="edt-item">
            <span>08:05 - 09:55</span>
            <strong>ED. PHYSIQUE & SPORT.</strong>
            <small>Chapelot B.</small>
          </div>

          <div className="edt-item">
            <span>10:10 - 11:05</span>
            <strong>Allemand LV2</strong>
            <small>Bourguignon A.</small>
          </div>

          <div className="edt-item">
            <span>11:05 - 12:00</span>
            <strong>Arts Plastiques</strong>
            <small>Decroix C.</small>
          </div>
        </div>
      </div>

    </div>
  );
}
