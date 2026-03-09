import React from "react";
import "./NotesComparatives.css";

export default function NotesComparatives() {
  return (
    <div className="notescomp-container">

      <h1>Notes comparatives</h1>
      <p className="subtitle">
        Comparaison Élève / Classe / Min / Max — Trimestre 2
      </p>

      <table className="notescomp-table">
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
          <tr>
            <td>Français</td>
            <td>14,7</td>
            <td>15,43</td>
            <td>12,7</td>
            <td>19,4</td>
          </tr>

          <tr>
            <td>Mathématiques</td>
            <td>15,58</td>
            <td>14,2</td>
            <td>9,75</td>
            <td>17,75</td>
          </tr>

          <tr>
            <td>Anglais LV1</td>
            <td>17,5</td>
            <td>13,54</td>
            <td>9,7</td>
            <td>17,5</td>
          </tr>

          <tr>
            <td>EPS</td>
            <td>13,33</td>
            <td>14,86</td>
            <td>11,67</td>
            <td>16,67</td>
          </tr>

          <tr>
            <td>Arts Plastiques</td>
            <td>15</td>
            <td>16,08</td>
            <td>10</td>
            <td>20</td>
          </tr>

          <tr>
            <td>Éducation Musicale</td>
            <td>16,5</td>
            <td>16,04</td>
            <td>11,5</td>
            <td>19</td>
          </tr>

          <tr>
            <td>Physique-Chimie</td>
            <td>19,33</td>
            <td>14,6</td>
            <td>9,22</td>
            <td>20</td>
          </tr>

          <tr>
            <td>SVT</td>
            <td>19,67</td>
            <td>18,39</td>
            <td>17</td>
            <td>20</td>
          </tr>

          <tr>
            <td>Technologie</td>
            <td>18,5</td>
            <td>18,18</td>
            <td>14,5</td>
            <td>20</td>
          </tr>

          <tr>
            <td>Latin</td>
            <td>14,17</td>
            <td>14,67</td>
            <td>13,83</td>
            <td>16</td>
          </tr>

          <tr>
            <td>Allemand LV2</td>
            <td>11,88</td>
            <td>11,98</td>
            <td>8,44</td>
            <td>17,05</td>
          </tr>
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
  );
}
