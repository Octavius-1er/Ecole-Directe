import React, { useState } from "react";
import "./Notes.css";

export default function Notes() {
  const [activeTab, setActiveTab] = useState("evaluations");

  return (
    <div className="notes-container">

      <h1>Notes et Moyennes</h1>
      <p className="subtitle">
        Conseil de classe de CINQUIÈME F EUROP. — Vendredi 13 mars 2026 à 16:45
      </p>

      {/* Tabs */}
      <div className="notes-tabs">
        <button
          className={activeTab === "evaluations" ? "tab active" : "tab"}
          onClick={() => setActiveTab("evaluations")}
        >
          Évaluations
        </button>
        <button
          className={activeTab === "moyenne" ? "tab active" : "tab"}
          onClick={() => setActiveTab("moyenne")}
        >
          Moyenne
        </button>
        <button
          className={activeTab === "competences" ? "tab active" : "tab"}
          onClick={() => setActiveTab("competences")}
        >
          Compétences
        </button>
      </div>

      {/* ÉVALUATIONS */}
      {activeTab === "evaluations" && (
        <div>
          <table className="notes-table">
            <thead>
              <tr>
                <th>Discipline</th>
                <th>Coef.</th>
                <th>Moyenne</th>
                <th>Évaluations</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Français — Mme Fischer N.</td><td>1</td><td>14,7</td><td>6,5/10 • 15 • 15 • 13,5 • 17</td></tr>
              <tr><td>Mathématiques — Mme David S.</td><td>1</td><td>15,58</td><td>17 • 18,5 • 8,5/10 • 12 • 13</td></tr>
              <tr><td>Anglais LV1 — M. Guellec L.</td><td>1</td><td>17,5</td><td>16 • 8/10 • 18,5 • 15 • 20</td></tr>
              <tr><td>Éducation Physique — M. Chapelot B.</td><td>1</td><td>13,33</td><td>12,5 • 15</td></tr>
              <tr><td>Arts Plastiques — Mme Decroix C.</td><td>1</td><td>15</td><td>15 • 16</td></tr>
              <tr><td>Éducation Musicale — Mme Cornier C.</td><td>1</td><td>16,5</td><td>4,5/5 • 15</td></tr>
              <tr><td>Physique-Chimie — Mme Bredel M.</td><td>1</td><td>19,33</td><td>19 • 15/15 • 14,75</td></tr>
              <tr><td>Sciences Vie & Terre — Mme Tlich Z.</td><td>1</td><td>11,5</td><td>11,5 • 7/10 • 9/10</td></tr>
              <tr><td>Technologie — M. Olivares D.</td><td>1</td><td>19,67</td><td>20 • 20</td></tr>
              <tr><td>LCA Latin — Mme Langlois S.</td><td>1</td><td>18,5</td><td>7/10 • 9/10</td></tr>
              <tr><td>Allemand LV2 — Mme Bourguignon A.</td><td>1</td><td>14,17</td><td>10,5 • 16 • 8,5/10 • 18,5 • 5/5</td></tr>
              <tr><td>Histoire-Géo — Mme Hemet I.</td><td>1</td><td>11,88</td><td>Abs • 7/10 • 12,25 • 5,75/10 • 13,75 • 8</td></tr>
            </tbody>
          </table>
          <div className="moyenne-generale">
            <h2>Moyenne générale : 16,01</h2>
          </div>
        </div>
      )}

      {/* MOYENNE */}
      {activeTab === "moyenne" && (
        <div>
          <table className="notes-table">
            <thead>
              <tr>
                <th>Discipline</th>
                <th>Élève</th>
                <th>Classe</th>
                <th>Min</th>
                <th>Max</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Français</td><td>14,7</td><td>15,43</td><td>12,7</td><td>19,4</td></tr>
              <tr><td>Mathématiques</td><td>15,58</td><td>14,2</td><td>9,75</td><td>17,75</td></tr>
              <tr><td>Anglais LV1</td><td>17,5</td><td>13,54</td><td>9,7</td><td>17,5</td></tr>
              <tr><td>EPS</td><td>13,33</td><td>14,86</td><td>11,67</td><td>16,67</td></tr>
              <tr><td>Arts Plastiques</td><td>15</td><td>16,08</td><td>10</td><td>20</td></tr>
              <tr><td>Éducation Musicale</td><td>16,5</td><td>16,04</td><td>11,5</td><td>19</td></tr>
              <tr><td>Physique-Chimie</td><td>19,33</td><td>14,6</td><td>9,22</td><td>20</td></tr>
              <tr><td>SVT</td><td>19,67</td><td>18,39</td><td>17</td><td>20</td></tr>
              <tr><td>Technologie</td><td>18,5</td><td>18,18</td><td>14,5</td><td>20</td></tr>
              <tr><td>Latin</td><td>14,17</td><td>14,67</td><td>13,83</td><td>16</td></tr>
              <tr><td>Allemand LV2</td><td>11,88</td><td>11,98</td><td>8,44</td><td>17,05</td></tr>
            </tbody>
          </table>
          <div className="moyenne-box">
            <h2>Moyenne générale</h2>
            <p>Élève : <strong>16,01</strong></p>
            <p>Classe : <strong>14,95</strong></p>
            <p>Min : <strong>12,84</strong></p>
            <p>Max : <strong>17,66</strong></p>
          </div>
        </div>
      )}

      {/* COMPÉTENCES */}
      {activeTab === "competences" && (
        <div>
          <table className="notes-table comp-table">
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
              <tr>
                <td rowSpan="4" className="matiere">Français</td>
                <td>Construire les notions permettant l'analyse et l'élaboration des textes</td>
                <td></td><td></td><td>●</td><td></td>
              </tr>
              <tr><td>Exploiter les principales fonctions de l'écrit</td><td></td><td>●</td><td></td><td></td></tr>
              <tr><td>Adopter des stratégies d'écriture efficaces</td><td></td><td></td><td>●</td><td></td></tr>
              <tr><td>Contrôler sa compréhension, devenir un lecteur autonome</td><td></td><td></td><td>●</td><td></td></tr>

              <tr>
                <td rowSpan="4" className="matiere">Anglais LV1</td>
                <td>Mobiliser les outils pour écrire, corriger, modifier son écrit</td>
                <td></td><td></td><td>●</td><td></td>
              </tr>
              <tr><td>Mettre en voix son discours</td><td></td><td></td><td>●</td><td></td></tr>
              <tr><td>Mobiliser connaissances lexicales, culturelles, grammaticales</td><td></td><td></td><td>●</td><td></td></tr>
              <tr><td>Niveau A2 — Interagir avec aisance raisonnable</td><td></td><td></td><td>●</td><td></td></tr>

              <tr>
                <td rowSpan="2" className="matiere">EPS</td>
                <td>S'adapter au changement défenseur / attaquant</td>
                <td></td><td></td><td>●</td><td></td>
              </tr>
              <tr><td>Co‑animer une séquence de match</td><td></td><td></td><td>●</td><td></td></tr>
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
