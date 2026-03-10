import React, { useState } from "react";
import "./Notes.css";

const TRIMESTRES = [
  { id: "t1",    label: "1er Trimestre" },
  { id: "r1",    label: "Relevé 1" },
  { id: "r2",    label: "Relevé 2" },
  { id: "t2",    label: "2ème Trimestre" },
  { id: "r3",    label: "Relevé" },
  { id: "r4",    label: "Relevé" },
  { id: "t3",    label: "3ème Trimestre" },
  { id: "r5",    label: "Relevé" },
  { id: "r6",    label: "Relevé" },
  { id: "annee", label: "Année" },
];

// Seul le Relevé 2 du 2ème trimestre a des données pour l'instant
const DATA = {
  r2: {
    conseil: "Conseil de classe de CINQUIÈME F EUROP. le vendredi 13 mars 2026 à 16:45",
    moyenneGenerale: "16,01",
    moyenneClasse: "14,95",
    moyenneMin: "12,84",
    moyenneMax: "17,66",
    notes: [
      { matiere: "Français",            prof: "Mme Fischer N.",     moyenne: "14,7",  evals: ["6,5/10", "15", "15", "13,5", "17"] },
      { matiere: "Mathématiques",       prof: "Mme David S.",       moyenne: "15,58", evals: ["17", "18,5", "8,5/10", "12", "13"] },
      { matiere: "Anglais LV1",         prof: "M. Guellec L.",      moyenne: "17,5",  evals: ["16", "8/10", "18,5", "15", "20"] },
      { matiere: "Éducation Physique",  prof: "M. Chapelot B.",     moyenne: "13,33", evals: ["12,5", "15"] },
      { matiere: "Arts Plastiques",     prof: "Mme Decroix C.",     moyenne: "15",    evals: ["15", "16"] },
      { matiere: "Éducation Musicale",  prof: "Mme Cornier C.",     moyenne: "16,5",  evals: ["4,5/5", "15"] },
      { matiere: "Physique-Chimie",     prof: "Mme Bredel M.",      moyenne: "19,33", evals: ["19", "15/15", "14,75"] },
      { matiere: "Sciences Vie & Terre",prof: "Mme Tlich Z.",       moyenne: "11,5",  evals: ["11,5", "7/10", "9/10"] },
      { matiere: "Technologie",         prof: "M. Olivares D.",     moyenne: "19,67", evals: ["20", "20"] },
      { matiere: "LCA Latin",           prof: "Mme Langlois S.",    moyenne: "18,5",  evals: ["7/10", "9/10"] },
      { matiere: "Allemand LV2",        prof: "Mme Bourguignon A.", moyenne: "14,17", evals: ["10,5", "16", "8,5/10", "18,5", "5/5"] },
      { matiere: "Histoire-Géo",        prof: "Mme Hemet I.",       moyenne: "11,88", evals: ["Abs", "7/10", "12,25", "5,75/10", "13,75", "8"] },
    ],
    moyennes: [
      { matiere: "Français",            eleve: "14,7",  classe: "15,43", min: "12,7",  max: "19,4" },
      { matiere: "Mathématiques",       eleve: "15,58", classe: "14,2",  min: "9,75",  max: "17,75" },
      { matiere: "Anglais LV1",         eleve: "17,5",  classe: "13,54", min: "9,7",   max: "17,5" },
      { matiere: "EPS",                 eleve: "13,33", classe: "14,86", min: "11,67", max: "16,67" },
      { matiere: "Arts Plastiques",     eleve: "15",    classe: "16,08", min: "10",    max: "20" },
      { matiere: "Éducation Musicale",  eleve: "16,5",  classe: "16,04", min: "11,5",  max: "19" },
      { matiere: "Physique-Chimie",     eleve: "19,33", classe: "14,6",  min: "9,22",  max: "20" },
      { matiere: "SVT",                 eleve: "19,67", classe: "18,39", min: "17",    max: "20" },
      { matiere: "Technologie",         eleve: "18,5",  classe: "18,18", min: "14,5",  max: "20" },
      { matiere: "Latin",               eleve: "14,17", classe: "14,67", min: "13,83", max: "16" },
      { matiere: "Allemand LV2",        eleve: "11,88", classe: "11,98", min: "8,44",  max: "17,05" },
    ],
    competences: [
      { matiere: "Français", items: [
        { label: "Construire les notions permettant l'analyse et l'élaboration des textes", level: "atteints" },
        { label: "Exploiter les principales fonctions de l'écrit", level: "partiellement" },
        { label: "Adopter des stratégies d'écriture efficaces", level: "atteints" },
        { label: "Contrôler sa compréhension, devenir un lecteur autonome", level: "atteints" },
      ]},
      { matiere: "Anglais LV1", items: [
        { label: "Mobiliser les outils pour écrire, corriger, modifier son écrit", level: "atteints" },
        { label: "Mettre en voix son discours", level: "atteints" },
        { label: "Mobiliser connaissances lexicales, culturelles, grammaticales", level: "atteints" },
        { label: "Niveau A2 — Interagir avec aisance raisonnable", level: "atteints" },
      ]},
      { matiere: "EPS", items: [
        { label: "S'adapter au changement défenseur / attaquant", level: "atteints" },
        { label: "Co‑animer une séquence de match", level: "atteints" },
      ]},
    ],
  },
};

function EmptyState({ label }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">📭</span>
      <p>Aucune donnée disponible pour <strong>{label}</strong></p>
    </div>
  );
}

export default function Notes() {
  const [activeTrimestre, setActiveTrimestre] = useState("r2");
  const [activeTab, setActiveTab] = useState("evaluations");

  const current = DATA[activeTrimestre] || null;
  const activeLabel = TRIMESTRES.find(t => t.id === activeTrimestre)?.label;

  return (
    <div className="notes-container">
      <h1 className="notes-title">Notes et Moyennes</h1>

      {/* Onglets trimestres */}
      <div className="trimestre-tabs">
        {TRIMESTRES.map((t) => (
          <button
            key={t.id}
            className={`trimestre-tab ${activeTrimestre === t.id ? "active" : ""}`}
            onClick={() => setActiveTrimestre(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {current && <p className="conseil-info">{current.conseil}</p>}

      {/* Sous-onglets */}
      <div className="sub-tabs">
        {[
          { id: "evaluations", label: "Evaluations" },
          { id: "moyennes",    label: "Moyennes" },
          { id: "competences", label: "Compétences" },
          { id: "graphiques",  label: "Graphiques" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`sub-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Aucune donnée */}
      {!current && <EmptyState label={activeLabel} />}

      {/* ÉVALUATIONS */}
      {current && activeTab === "evaluations" && (
        <div className="tab-content">
          <table className="notes-table">
            <thead>
              <tr>
                <th>Disciplines</th>
                <th>Moyennes</th>
                <th>Évaluations</th>
              </tr>
            </thead>
            <tbody>
              {current.notes.map((row, i) => (
                <tr key={i}>
                  <td>
                    <span className="matiere-name">{row.matiere.toUpperCase()}</span>
                    <span className="prof-name">{row.prof}</span>
                  </td>
                  <td className="center bold">{row.moyenne}</td>
                  <td>
                    <div className="evals-cell">
                      {row.evals.map((e, j) => (
                        <span key={j} className="eval-pill">{e}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="moyenne-generale">
            Moyenne générale : <strong>{current.moyenneGenerale}</strong>
          </div>
        </div>
      )}

      {/* MOYENNES */}
      {current && activeTab === "moyennes" && (
        <div className="tab-content">
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
              {current.moyennes.map((row, i) => (
                <tr key={i}>
                  <td><span className="matiere-name">{row.matiere.toUpperCase()}</span></td>
                  <td className="center bold">{row.eleve}</td>
                  <td className="center">{row.classe}</td>
                  <td className="center muted">{row.min}</td>
                  <td className="center muted">{row.max}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="moyenne-box">
            <h3>Moyenne générale</h3>
            <div className="moyenne-row"><span>Élève</span><strong>{current.moyenneGenerale}</strong></div>
            <div className="moyenne-row"><span>Classe</span><span>{current.moyenneClasse}</span></div>
            <div className="moyenne-row"><span>Min</span><span>{current.moyenneMin}</span></div>
            <div className="moyenne-row"><span>Max</span><span>{current.moyenneMax}</span></div>
          </div>
        </div>
      )}

      {/* COMPÉTENCES */}
      {current && activeTab === "competences" && (
        <div className="tab-content">
          <table className="notes-table comp-table">
            <thead>
              <tr>
                <th>Discipline</th>
                <th>Éléments de programme</th>
                <th>Non atteints</th>
                <th>Part. atteints</th>
                <th>Atteints</th>
                <th>Dépassés</th>
              </tr>
            </thead>
            <tbody>
              {current.competences.map((groupe) =>
                groupe.items.map((item, j) => (
                  <tr key={`${groupe.matiere}-${j}`}>
                    {j === 0 && (
                      <td rowSpan={groupe.items.length} className="matiere-cell">
                        {groupe.matiere.toUpperCase()}
                      </td>
                    )}
                    <td>{item.label}</td>
                    <td className="center">{item.level === "non" ? "●" : ""}</td>
                    <td className="center">{item.level === "partiellement" ? "●" : ""}</td>
                    <td className="center">{item.level === "atteints" ? "●" : ""}</td>
                    <td className="center">{item.level === "depasses" ? "●" : ""}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* GRAPHIQUES */}
      {current && activeTab === "graphiques" && (
        <div className="tab-content graphiques">
          <h3 style={{ marginBottom: "20px", color: "#1e3a8a" }}>Évolution des moyennes</h3>
          <div className="graph-bars">
            {current.notes.map((row, i) => {
              const val = parseFloat(row.moyenne.replace(",", "."));
              const pct = (val / 20) * 100;
              const color = val >= 16 ? "#22c55e" : val >= 12 ? "#3b82f6" : "#f97316";
              return (
                <div key={i} className="graph-row">
                  <span className="graph-label">{row.matiere}</span>
                  <div className="graph-bar-bg">
                    <div
                      className="graph-bar-fill bar-grow"
                      style={{ width: `${pct}%`, background: color, animationDelay: `${i * 0.06}s` }}
                    />
                  </div>
                  <span className="graph-value">{row.moyenne}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
