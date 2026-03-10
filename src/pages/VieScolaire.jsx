import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useData } from "../DataContext";
import "./VieScolaire.css";

export default function VieScolaire() {
  const { user } = useAuth();
  const { absences, addAbsence, removeAbsence, punitions, addPunition, removePunition } = useData();
  const canEdit = user?.role === "admin";

  const [tab, setTab] = useState("absences");
  const [showAddA, setShowAddA] = useState(false);
  const [showAddP, setShowAddP] = useState(false);
  const [newA, setNewA] = useState({ date: "", duree: "", justifiee: "Oui", motif: "" });
  const [newP, setNewP] = useState({ date: "", type: "Retenue", motif: "", prof: "" });
  const [msg, setMsg] = useState("");

  function handleAddAbsence(e) {
    e.preventDefault();
    addAbsence(newA);
    setMsg("Absence ajoutée ✓");
    setNewA({ date: "", duree: "", justifiee: "Oui", motif: "" });
    setTimeout(() => setMsg(""), 3000);
  }

  function handleAddPunition(e) {
    e.preventDefault();
    addPunition(newP);
    setMsg("Punition ajoutée ✓");
    setNewP({ date: "", type: "Retenue", motif: "", prof: "" });
    setTimeout(() => setMsg(""), 3000);
  }

  return (
    <div className="vs-container">
      <h1 className="vs-title">Vie scolaire</h1>

      <div className="vs-tabs">
        <button className={`vs-tab ${tab === "absences" ? "active" : ""}`} onClick={() => setTab("absences")}>
          Absences <span className="vs-badge">{absences.length}</span>
        </button>
        <button className={`vs-tab ${tab === "punitions" ? "active" : ""}`} onClick={() => setTab("punitions")}>
          Punitions <span className="vs-badge red">{punitions.length}</span>
        </button>
      </div>

      {/* ── ABSENCES ── */}
      {tab === "absences" && (
        <div className="vs-section">
          {canEdit && (
            <div className="vs-actions">
              <button className="btn-add-note" onClick={() => setShowAddA(v => !v)}>
                {showAddA ? "✕ Fermer" : "➕ Ajouter une absence"}
              </button>
            </div>
          )}

          {canEdit && showAddA && (
            <form className="add-note-form" onSubmit={handleAddAbsence}>
              <input type="text" placeholder="Date (ex: Le 10 mars 2026 — 08:00 à 12:00)" value={newA.date} onChange={e => setNewA(p => ({ ...p, date: e.target.value }))} required />
              <input type="text" placeholder="Durée (ex: 2 demi-journées)" value={newA.duree} onChange={e => setNewA(p => ({ ...p, duree: e.target.value }))} />
              <select value={newA.justifiee} onChange={e => setNewA(p => ({ ...p, justifiee: e.target.value }))}>
                <option value="Oui">Justifiée : Oui</option>
                <option value="Non">Justifiée : Non</option>
                <option value="En attente">En attente</option>
              </select>
              <input type="text" placeholder="Motif" value={newA.motif} onChange={e => setNewA(p => ({ ...p, motif: e.target.value }))} />
              <button type="submit" className="btn-primary-sm">Ajouter</button>
              {msg && <span className="add-success">{msg}</span>}
            </form>
          )}

          {absences.length === 0 ? (
            <div className="vs-empty">✓ Aucune absence enregistrée.</div>
          ) : (
            <table className="vs-table">
              <thead><tr><th>Période</th><th>Durée</th><th>Justifiée</th><th>Motif</th>{canEdit && <th>Actions</th>}</tr></thead>
              <tbody>
                {absences.map(a => (
                  <tr key={a.id}>
                    <td>{a.date}</td>
                    <td>{a.duree}</td>
                    <td><span className={`justif-badge ${a.justifiee === "Oui" ? "green" : a.justifiee === "Non" ? "red" : "orange"}`}>{a.justifiee}</span></td>
                    <td>{a.motif}</td>
                    {canEdit && <td><button className="btn-del-sm" onClick={() => removeAbsence(a.id)}>✕</button></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── PUNITIONS ── */}
      {tab === "punitions" && (
        <div className="vs-section">
          {canEdit && (
            <div className="vs-actions">
              <button className="btn-add-note" onClick={() => setShowAddP(v => !v)}>
                {showAddP ? "✕ Fermer" : "➕ Ajouter une punition"}
              </button>
            </div>
          )}

          {canEdit && showAddP && (
            <form className="add-note-form" onSubmit={handleAddPunition}>
              <input type="text" placeholder="Date (ex: 10 mars 2026)" value={newP.date} onChange={e => setNewP(p => ({ ...p, date: e.target.value }))} required />
              <select value={newP.type} onChange={e => setNewP(p => ({ ...p, type: e.target.value }))}>
                <option>Retenue</option>
                <option>Avertissement</option>
                <option>Exclusion</option>
                <option>Travail supplémentaire</option>
              </select>
              <input type="text" placeholder="Motif" value={newP.motif} onChange={e => setNewP(p => ({ ...p, motif: e.target.value }))} required />
              <input type="text" placeholder="Professeur" value={newP.prof} onChange={e => setNewP(p => ({ ...p, prof: e.target.value }))} />
              <button type="submit" className="btn-primary-sm">Ajouter</button>
              {msg && <span className="add-success">{msg}</span>}
            </form>
          )}

          {punitions.length === 0 ? (
            <div className="vs-empty">✓ Aucune punition enregistrée.</div>
          ) : (
            <table className="vs-table">
              <thead><tr><th>Date</th><th>Type</th><th>Motif</th><th>Professeur</th>{canEdit && <th>Actions</th>}</tr></thead>
              <tbody>
                {punitions.map(p => (
                  <tr key={p.id}>
                    <td>{p.date}</td>
                    <td><span className="justif-badge red">{p.type}</span></td>
                    <td>{p.motif}</td>
                    <td>{p.prof}</td>
                    {canEdit && <td><button className="btn-del-sm" onClick={() => removePunition(p.id)}>✕</button></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
