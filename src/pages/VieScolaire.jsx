import React from "react";
import "./VieScolaire.css";

export default function VieScolaire() {
  return (
    <div className="vie-container">

      <h1>Vie scolaire</h1>

      {/* Résumé */}
      <div className="resume-box">
        <div className="resume-item blue">
          <h2>2</h2>
          <p>Absences</p>
        </div>

        <div className="resume-item yellow">
          <h2>3</h2>
          <p>Absences restaurant scolaire</p>
        </div>
      </div>

      {/* Tableau des absences */}
      <table className="abs-table">
        <thead>
          <tr>
            <th>Absence / Retard</th>
            <th>Durée</th>
            <th>Justifiée ?</th>
            <th>Motif</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Du 5 janv 2026 08:00 au 7 janv 2026 12:00</td>
            <td>5 demi-journées</td>
            <td>Oui</td>
            <td>Conditions météorologiques</td>
          </tr>

          <tr>
            <td>Le 6 janv 2026</td>
            <td>Cantine</td>
            <td>Oui</td>
            <td>Conditions météorologiques</td>
          </tr>

          <tr>
            <td>Le 5 janv 2026</td>
            <td>Cantine</td>
            <td>Oui</td>
            <td>Conditions météorologiques</td>
          </tr>

          <tr>
            <td>Le 17 nov 2025 — 08:00 à 16:30</td>
            <td>2 demi-journées</td>
            <td>Oui</td>
            <td>Maladie</td>
          </tr>

          <tr>
            <td>Le 17 nov 2025</td>
            <td>Cantine</td>
            <td>Oui</td>
            <td>Maladie</td>
          </tr>
        </tbody>
      </table>

      {/* Sanctions */}
      <div className="sanction-box">
        <h2>Sanction / Punition / Incident</h2>
        <p>Aucune sanction / punition / incident</p>
      </div>

    </div>
  );
}
