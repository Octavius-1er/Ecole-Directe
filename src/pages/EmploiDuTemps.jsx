import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useData } from "../DataContext";
import "./EmploiDuTemps.css";

const MATIERES = ["Français","Mathématiques","Anglais LV1","Allemand LV2","Histoire-Géo","SVT","Physique-Chimie","Technologie","EPS","Arts Plastiques","Éducation Musicale","LCA Latin"];
const DAYS = [
  { day: 9,  key: "9",  label: "Lundi 9" },
  { day: 10, key: "10", label: "Mardi 10" },
  { day: 11, key: "11", label: "Mercredi 11" },
  { day: 12, key: "12", label: "Jeudi 12" },
  { day: 13, key: "13", label: "Vendredi 13" },
  { day: 14, key: "14", label: "Samedi 14" },
];

const MAT_COLORS = {
  "Français":          "#3b82f6",
  "Mathématiques":     "#8b5cf6",
  "Anglais LV1":       "#0ea5e9",
  "Allemand LV2":      "#f59e0b",
  "Histoire-Géo":      "#10b981",
  "SVT":               "#22c55e",
  "Physique-Chimie":   "#f97316",
  "Technologie":       "#6366f1",
  "EPS":               "#ef4444",
  "Arts Plastiques":   "#ec4899",
  "Éducation Musicale":"#14b8a6",
  "LCA Latin":         "#a16207",
};

export default function EmploiDuTemps() {
  const { user } = useAuth();
  const { edt, addEdtItem, removeEdtItem } = useData();
  const canEdit = user?.role === "admin" || user?.role === "prof";

  const [activeDay, setActiveDay] = useState("10");
  const [showAdd, setShowAdd] = useState(false);
  const [newCours, setNewCours] = useState({ heure: "", heureFin: "", matiere: "", prof: "", salle: "" });
  const [msg, setMsg] = useState("");

  const dayData = edt[activeDay] || { label: DAYS.find(d => d.key === activeDay)?.label, items: [] };

  function handleAdd(e) {
    e.preventDefault();
    if (!newCours.heure || !newCours.heureFin || !newCours.matiere) return;
    addEdtItem(activeDay, dayData.label, {
      heure: `${newCours.heure} - ${newCours.heureFin}`,
      matiere: newCours.matiere,
      prof: newCours.prof,
      salle: newCours.salle,
    });
    setMsg("Cours ajouté ✓");
    setNewCours({ heure: "", heureFin: "", matiere: "", prof: "", salle: "" });
    setTimeout(() => setMsg(""), 3000);
  }

  return (
    <div className="edt-container">
      <h1 className="edt-title">Emploi du temps — Semaine du 9 mars</h1>

      <div className="edt-days-nav">
        {DAYS.map(d => (
          <button key={d.key} className={`edt-day-btn ${activeDay === d.key ? "active" : ""}`} onClick={() => setActiveDay(d.key)}>
            {d.label}
          </button>
        ))}
      </div>

      {canEdit && (
        <div className="edt-actions">
          <button className="btn-add-note" onClick={() => setShowAdd(v => !v)}>
            {showAdd ? "✕ Fermer" : "➕ Ajouter un cours"}
          </button>
        </div>
      )}

      {canEdit && showAdd && (
        <form className="add-note-form" onSubmit={handleAdd}>
          <input type="time" value={newCours.heure} onChange={e => setNewCours(p => ({ ...p, heure: e.target.value }))} required title="Heure début" />
          <input type="time" value={newCours.heureFin} onChange={e => setNewCours(p => ({ ...p, heureFin: e.target.value }))} required title="Heure fin" />
          <select value={newCours.matiere} onChange={e => setNewCours(p => ({ ...p, matiere: e.target.value }))} required>
            <option value="">— Matière —</option>
            {MATIERES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <input type="text" placeholder="Professeur" value={newCours.prof} onChange={e => setNewCours(p => ({ ...p, prof: e.target.value }))} />
          <input type="text" placeholder="Salle (ex: B104)" value={newCours.salle} onChange={e => setNewCours(p => ({ ...p, salle: e.target.value }))} />
          <button type="submit" className="btn-primary-sm">Ajouter</button>
          {msg && <span className="add-success">{msg}</span>}
        </form>
      )}

      <div className="edt-day-content">
        <h2 className="edt-day-label">{dayData.label}</h2>
        {dayData.items.length === 0 ? (
          <div className="edt-empty">Pas de cours ce jour.</div>
        ) : (
          <div className="edt-slots">
            {dayData.items.map((item, i) => {
              const color = MAT_COLORS[item.matiere] || "#64748b";
              return (
                <div key={i} className="edt-slot" style={{ borderLeftColor: color }}>
                  <div className="edt-slot-time">{item.heure}</div>
                  <div className="edt-slot-body">
                    <span className="edt-slot-matiere" style={{ color }}>{item.matiere}</span>
                    {item.prof && <span className="edt-slot-prof">{item.prof}</span>}
                    {item.salle && <span className="edt-slot-salle">Salle {item.salle}</span>}
                  </div>
                  {canEdit && (
                    <button className="btn-del-sm" onClick={() => removeEdtItem(activeDay, i)}>✕</button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
