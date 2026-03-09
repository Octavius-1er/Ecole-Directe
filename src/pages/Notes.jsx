import React from "react";
import "./Notes.css";

export default function Notes() {
  return (
    <div className="notes-container">

      <h1>Notes et Moyennes</h1>
      <p className="subtitle">
        Conseil de classe de CINQUIÈME F EUROP. — Vendredi 13 mars 2026 à 16:45
      </p>

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
          <tr>
            <td>Français — Mme Fischer N.</td>
            <td>1</td>
            <td>14,7</td>
            <td>6,5/10 • 15 • 15 • 13,5 • 17</td>
          </tr>

          <tr>
            <td>Mathématiques — Mme David S.</td>
            <td>1</td>
            <td>15,58</td>
            <td>17 • 18,5 • 8,5/10 • 12 • 13</td>
          </tr>

          <tr>
            <td>Anglais LV1 — M. Guellec L.</td>
            <td>1</td>
            <td>17,5</td>
            <td>16 • 8/10 • 18,5 • 15 • 20</td>
          </tr>

          <tr>
            <td>Éducation Physique — M. Chapelot B.</td>
            <td>1</td>
            <td>13,33</td>
            <td>12,5 • 15</td>
          </tr>

          <tr>
            <td>Arts Plastiques — Mme Decroix C.</td>
            <td>1</td>
            <td>15</td>
            <td>15 • 16</td>
          </tr>

          <tr>
            <td>Éducation Musicale — Mme Cornier C.</td>
            <td>1</td>
            <td>16,5</td>
            <td>4,5/5 • 15</td>
          </tr>

          <tr>
            <td>Physique-Chimie — Mme Bredel M.</td>
            <td>1</td>
            <td>19,33</td>
            <td>19 • 15/15 • 14,75</td>
          </tr>

          <tr>
            <td>Sciences Vie & Terre — Mme Tlich Z.</td>
            <td>1</td>
            <td>11,5</td>
            <td>11,5 • 7/10 • 9/10</td>
          </tr>

          <tr>
            <td>Technologie — M. Olivares D.</td>
            <td>1</td>
            <td>19,67</td>
            <td>20 • 20</td>
          </tr>

          <tr>
            <td>LCA Latin — Mme Langlois S.</td>
            <td>1</td>
            <td>18,5</td>
            <td>7/10 • 9/10</td>
          </tr>

          <tr>
            <td>Allemand LV2 — Mme Bourguignon A.</td>
            <td>1</td>
            <td>14,17</td>
            <td>10,5 • 16 • 8,5/10 • 18,5 • 5/5</td>
          </tr>

          <tr>
            <td>Histoire-Géo — Mme Hemet I.</td>
            <td>1</td>
            <td>11,88</td>
            <td>Abs • 7/10 • 12,25 • 5,75/10 • 13,75 • 8</td>
          </tr>
        </tbody>
      </table>

      <div className="moyenne-generale">
        <h2>Moyenne générale : 16,01</h2>
      </div>

    </div>
  );
}
