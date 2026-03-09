import React from "react";
import "./Competences.css";

export default function Competences() {
  return (
    <div className="comp-container">

      <h1>Compétences</h1>

      <table className="comp-table">
        <thead>
          <tr>
            <th>Discipline</th>
            <th>Éléments de programme</th>
            <th>Non atteints</th>
            <th>Partiellement atteints</th>
            <th>Atteints</th>
            <th>Dépassés</th>
          </tr>
        </thead>

        <tbody>

          {/* FRANÇAIS */}
          <tr>
            <td rowSpan="4" className="matiere">Français</td>
            <td>Construire les notions permettant l’analyse et l’élaboration des textes</td>
            <td></td><td></td><td>●</td><td></td>
          </tr>

          <tr>
            <td>Exploiter les principales fonctions de l’écrit</td>
            <td></td><td>●</td><td></td><td></td>
          </tr>

          <tr>
            <td>Adopter des stratégies d’écriture efficaces</td>
            <td></td><td></td><td>●</td><td></td>
          </tr>

          <tr>
            <td>Contrôler sa compréhension, devenir un lecteur autonome</td>
            <td></td><td></td><td>●</td><td></td>
          </tr>

          {/* ANGLAIS */}
          <tr>
            <td rowSpan="4" className="matiere">Anglais LV1</td>
            <td>Mobiliser les outils pour écrire, corriger, modifier son écrit</td>
            <td></td><td></td><td>●</td><td></td>
          </tr>

          <tr>
            <td>Mettre en voix son discours</td>
            <td></td><td></td><td>●</td><td></td>
          </tr>

          <tr>
            <td>Mobiliser connaissances lexicales, culturelles, grammaticales</td>
            <td></td><td></td><td>●</td><td></td>
          </tr>

          <tr>
            <td>Niveau A2 — Interagir avec aisance raisonnable</td>
            <td></td><td></td><td>●</td><td></td>
          </tr>

          {/* EPS */}
          <tr>
            <td rowSpan="2" className="matiere">EPS</td>
            <td>S’adapter au changement défenseur / attaquant</td>
            <td></td><td></td><td>●</td><td></td>
          </tr>

          <tr>
            <td>Co‑animer une séquence de match</td>
            <td></td><td></td><td>●</td><td></td>
          </tr>

        </tbody>
      </table>

    </div>
  );
}
