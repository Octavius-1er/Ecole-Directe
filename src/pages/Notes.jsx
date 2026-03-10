import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useData } from "../DataContext";
import "./Notes.css";

const TRIMESTRES = [
  { id: "t1", label: "1er Trimestre", releves: [{ id: "r1", label: "Relevé 1" }, { id: "r2", label: "Relevé 2" }] },
  { id: "t2", label: "2ème Trimestre", releves: [{ id: "r3", label: "Relevé 3" }, { id: "r4", label: "Relevé 4" }] },
  { id: "t3", label: "3ème Trimestre", releves: [{ id: "r5", label: "Relevé 5" }, { id: "r6", label: "Relevé 6" }] },
  { id: "annee", label: "Année", releves: [] },
];

function computeAnnee(data) {
  const allReleves = Object.values(data);
  if (!allReleves.length) return null;
  const matiereMap = {};
  allReleves.forEach(r => r.notes.forEach(n => {
    if (!matiereMap[n.matiere]) matiereMap[n.matiere] = { matiere: n.matiere, prof: n.prof, sum: 0, count: 0, evals: [] };
    matiereMap[n.matiere].sum += parseFloat(n.moyenne.replace(",", ".")) || 0;
    matiereMap[n.matiere].count += 1;
    matiereMap[n.matiere].evals.push(...n.evals);
  }));
  const notes = Object.values(matiereMap).map(m => ({
    matiere: m.matiere, prof: m.prof, evals: m.evals,
    moyenne: (m.sum / m.count).toFixed(2).replace(".", ","),
  }));
  const mg = (notes.reduce((s, n) => s + parseFloat(n.moyenne.replace(",", ".")), 0) / notes.length).toFixed(2).replace(".", ",");
  return { conseil: "Moyenne annuelle — tous relevés confondus", moyenneGenerale: mg, moyenneClasse: "—", moyenneMin: "—", moyenneMax: "—", notes, moyennes: notes.map(n => ({ matiere: n.matiere, eleve: n.moyenne, classe: "—", min: "—", max: "—" })), competences: allReleves[0]?.competences || [] };
}

function EmptyState({ label }) {
  return <div className="empty-state"><span className="empty-icon">📭</span><p>Aucune donnée pour <strong>{label}</strong></p></div>;
}

export default function Notes() {
  const { user } = useAuth();
  const { notes: DATA, addNote, removeNote } = useData();
  const canEdit = user?.role === "admin" || user?.role === "prof";

  const [activeTrimestre, setActiveTrimestre] = useState("t1");
  const [activeReleve, setActiveReleve] = useState("r2");
  const [activeTab, setActiveTab] = useState("evaluations");
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState({ matiere: "", valeur: "" });
  const [msg, setMsg] = useState("");

  const trimestre = TRIMESTRES.find(t => t.id === activeTrimestre);
  const isAnnee = activeTrimestre === "annee";
  const currentId = trimestre?.releves.length > 0 ? activeReleve : activeTrimestre;
  const current = isAnnee ? computeAnnee(DATA) : (DATA[currentId] || null);
  const activeLabel = isAnnee ? "Année" : (trimestre?.releves.find(r => r.id === activeReleve)?.label || trimestre?.label);

  function handleAddNote(e) {
    e.preventDefault();
    if (!newNote.matiere || !newNote.valeur) return;
    addNote(currentId, newNote.matiere, newNote.valeur);
    setMsg(`Note ${newNote.valeur} ajoutée en ${newNote.matiere} ✓`);
    setNewNote({ matiere: "", valeur: "" });
    setTimeout(() => setMsg(""), 3000);
  }

  function handleTrimestreChange(t) {
    setActiveTrimestre(t.id);
    if (t.releves.length > 0) setActiveReleve(t.releves[0].id);
  }

  return (
    <div className="notes-container">
      <h1 className="notes-title">Notes et Moyennes</h1>

      <div className="trimestre-tabs">
        {TRIMESTRES.map(t => (
          <button key={t.id} className={`trimestre-tab ${activeTrimestre === t.id ? "active" : ""}`} onClick={() => handleTrimestreChange(t)}>{t.label}</button>
        ))}
      </div>

      {trimestre?.releves.length > 0 && (
        <div className="releve-tabs">
          {trimestre.releves.map(r => (
            <button key={r.id} className={`releve-tab ${activeReleve === r.id ? "active" : ""}`} onClick={() => setActiveReleve(r.id)}>{r.label}</button>
          ))}
        </div>
      )}

      {current && <p className="conseil-info">{current.conseil}</p>}

      <div className="notes-topbar">
        <div className="sub-tabs">
          {[{ id: "evaluations", label: "Evaluations" }, { id: "moyennes", label: "Moyennes" }, { id: "competences", label: "Compétences" }, { id: "graphiques", label: "Graphiques" }].map(tab => (
            <button key={tab.id} className={`sub-tab ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
          ))}
        </div>
        {canEdit && !isAnnee && current && (
          <button className="btn-add-note" onClick={() => setShowAddNote(v => !v)}>
            {showAddNote ? "✕ Fermer" : "➕ Ajouter une note"}
          </button>
        )}
      </div>

      {/* Formulaire ajout note */}
      {canEdit && showAddNote && !isAnnee && current && (
        <form className="add-note-form" onSubmit={handleAddNote}>
          <select value={newNote.matiere} onChange={e => setNewNote(p => ({ ...p, matiere: e.target.value }))} required>
            <option value="">— Choisir la matière —</option>
            {current.notes.map(n => <option key={n.matiere} value={n.matiere}>{n.matiere}</option>)}
          </select>
          <input type="text" placeholder="Note (ex: 15 ou 8/10)" value={newNote.valeur} onChange={e => setNewNote(p => ({ ...p, valeur: e.target.value }))} required />
          <button type="submit" className="btn-primary-sm">Ajouter</button>
          {msg && <span className="add-success">{msg}</span>}
        </form>
      )}

      {!current && <EmptyState label={activeLabel} />}

      {/* ÉVALUATIONS */}
      {current && activeTab === "evaluations" && (
        <div className="tab-content">
          <table className="notes-table">
            <thead><tr><th>Disciplines</th><th>Moyennes</th><th>Évaluations</th>{canEdit && !isAnnee && <th>Actions</th>}</tr></thead>
            <tbody>
              {current.notes.map((row, i) => (
                <tr key={i}>
                  <td><span className="matiere-name">{row.matiere.toUpperCase()}</span><span className="prof-name">{row.prof}</span></td>
                  <td className="center bold">{row.moyenne}</td>
                  <td>
                    <div className="evals-cell">
                      {row.evals.map((e, j) => (
                        <span key={j} className="eval-pill">
                          {e}
                          {canEdit && !isAnnee && (
                            <button className="eval-del" onClick={() => removeNote(currentId, row.matiere, j)} title="Supprimer">×</button>
                          )}
                        </span>
                      ))}
                    </div>
                  </td>
                  {canEdit && !isAnnee && <td></td>}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="moyenne-generale">Moyenne générale : <strong>{current.moyenneGenerale}</strong></div>
        </div>
      )}

      {/* MOYENNES */}
      {current && activeTab === "moyennes" && (
        <div className="tab-content">
          <table className="notes-table">
            <thead><tr><th>Discipline</th><th>Élève</th><th>Classe</th><th>Min</th><th>Max</th></tr></thead>
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
            <thead><tr><th>Discipline</th><th>Éléments de programme</th><th>Non atteints</th><th>Part. atteints</th><th>Atteints</th><th>Dépassés</th></tr></thead>
            <tbody>
              {current.competences.map(groupe => groupe.items.map((item, j) => (
                <tr key={`${groupe.matiere}-${j}`}>
                  {j === 0 && <td rowSpan={groupe.items.length} className="matiere-cell">{groupe.matiere.toUpperCase()}</td>}
                  <td>{item.label}</td>
                  <td className="center">{item.level === "non" ? "●" : ""}</td>
                  <td className="center">{item.level === "partiellement" ? "●" : ""}</td>
                  <td className="center">{item.level === "atteints" ? "●" : ""}</td>
                  <td className="center">{item.level === "depasses" ? "●" : ""}</td>
                </tr>
              )))}
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
                  <div className="graph-bar-bg"><div className="graph-bar-fill bar-grow" style={{ width: `${pct}%`, background: color, animationDelay: `${i * 0.06}s` }} /></div>
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
