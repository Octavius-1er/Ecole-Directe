import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useData } from "../DataContext";
import "./EmploiDuTemps.css";

const MATIERES = ["Français","Mathématiques","Anglais LV1","Allemand LV2","Histoire-Géo","Sciences Vie & Terre","Physique-Chimie","Technologie","EPS","Arts Plastiques","Éducation Musicale","LCA Latin"];

const MAT_COLORS = {
  "Français":"#3b82f6","Mathématiques":"#8b5cf6","Anglais LV1":"#0ea5e9",
  "Allemand LV2":"#f59e0b","Histoire-Géo":"#10b981","Sciences Vie & Terre":"#22c55e",
  "Physique-Chimie":"#f97316","Technologie":"#6366f1","EPS":"#ef4444",
  "Arts Plastiques":"#ec4899","Éducation Musicale":"#14b8a6","LCA Latin":"#a16207",
};

const DAYS = [
  { key:"lun", label:"Lundi" },
  { key:"mar", label:"Mardi" },
  { key:"mer", label:"Mercredi" },
  { key:"jeu", label:"Jeudi" },
  { key:"ven", label:"Vendredi" },
  { key:"sam", label:"Samedi" },
];

export default function EmploiDuTemps() {
  const { user } = useAuth();
  const { classes, getEdtClasse, addEdtItem, removeEdtItem } = useData();
  const canEdit = user?.role === "admin" || user?.role === "prof";

  const eleveClasse = user?.role === "eleve" ? user?.classeId : null;
  const [selectedClasse, setSelectedClasse] = useState(eleveClasse || Object.keys(classes)[0] || "");
  const classeId = user?.role === "eleve" ? eleveClasse : selectedClasse;

  const [activeDay, setActiveDay] = useState("lun");
  const [showAdd,   setShowAdd]   = useState(false);
  const [newCours,  setNewCours]  = useState({ heure:"", heureFin:"", matiere:"", prof:"", salle:"" });
  const [msg,       setMsg]       = useState("");

  const edtClasse = classeId ? getEdtClasse(classeId) : {};
  const dayData   = edtClasse[activeDay] || { label: DAYS.find(d => d.key === activeDay)?.label, items: [] };

  function handleAdd(e) {
    e.preventDefault();
    if (!newCours.heure || !newCours.heureFin || !newCours.matiere || !classeId) return;
    addEdtItem(classeId, activeDay, dayData.label, {
      heure:   `${newCours.heure} - ${newCours.heureFin}`,
      matiere: newCours.matiere,
      prof:    newCours.prof,
      salle:   newCours.salle,
    });
    setMsg("Cours ajouté ✓");
    setNewCours({ heure:"", heureFin:"", matiere:"", prof:"", salle:"" });
    setTimeout(() => setMsg(""), 3000);
  }

  return (
    <div className="edt-container">
      <h1 className="edt-title">Emploi du temps</h1>

      {/* Sélecteur classe */}
      {canEdit && (
        <div className="edt-class-selector">
          <label>Classe :</label>
          <select value={selectedClasse} onChange={e => setSelectedClasse(e.target.value)}>
            <option value="">— Choisir —</option>
            {Object.values(classes).map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
          {classes[selectedClasse] && <span className="selector-chip">📅 {classes[selectedClasse].nom}</span>}
        </div>
      )}

      {/* Navigation jours */}
      <div className="edt-days-nav">
        {DAYS.map(d => (
          <button key={d.key}
            className={`edt-day-btn ${activeDay === d.key ? "active" : ""}`}
            onClick={() => setActiveDay(d.key)}>
            {d.label}
          </button>
        ))}
      </div>

      {/* Bouton ajouter */}
      {canEdit && classeId && (
        <div className="edt-actions">
          <button className="btn-add-note" onClick={() => setShowAdd(v => !v)}>
            {showAdd ? "✕ Fermer" : "➕ Ajouter un cours"}
          </button>
        </div>
      )}

      {/* Formulaire */}
      {canEdit && showAdd && classeId && (
        <form className="add-note-form edt-form" onSubmit={handleAdd}>
          <div className="edt-form-row">
            <div className="edt-form-field">
              <label>Début</label>
              <input type="time" value={newCours.heure}    onChange={e => setNewCours(p => ({...p, heure:e.target.value}))}    required />
            </div>
            <div className="edt-form-field">
              <label>Fin</label>
              <input type="time" value={newCours.heureFin} onChange={e => setNewCours(p => ({...p, heureFin:e.target.value}))} required />
            </div>
          </div>
          <div className="edt-form-row">
            <div className="edt-form-field" style={{flex:2}}>
              <label>Matière</label>
              <select value={newCours.matiere} onChange={e => setNewCours(p => ({...p, matiere:e.target.value}))} required>
                <option value="">— Choisir —</option>
                {MATIERES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="edt-form-field">
              <label>Salle</label>
              <input type="text" placeholder="ex: 204" value={newCours.salle} onChange={e => setNewCours(p => ({...p, salle:e.target.value}))} />
            </div>
          </div>
          <div className="edt-form-row">
            <div className="edt-form-field" style={{flex:1}}>
              <label>Professeur</label>
              <input type="text" placeholder="Nom du prof" value={newCours.prof} onChange={e => setNewCours(p => ({...p, prof:e.target.value}))} />
            </div>
            <div className="edt-form-field" style={{alignSelf:"flex-end"}}>
              <button type="submit" className="btn-primary-sm">Ajouter</button>
            </div>
          </div>
          {msg && <span className="add-success">{msg}</span>}
        </form>
      )}

      {/* Contenu du jour */}
      {!classeId && <div className="edt-empty-state">Sélectionnez une classe.</div>}

      {classeId && (
        <div className="edt-day-content">
          <div className="edt-day-label">{dayData.label}</div>

          {!dayData.items || dayData.items.length === 0
            ? <div className="edt-empty">Aucun cours ce jour.</div>
            : (
              <div className="edt-slots">
                {dayData.items.map((slot, idx) => {
                  const color = MAT_COLORS[slot.matiere] || "#64748b";
                  return (
                    <div key={idx} className="edt-slot" style={{ borderLeftColor: color }}>
                      <div className="edt-slot-time">{slot.heure}</div>
                      <div className="edt-slot-body">
                        <span className="edt-slot-matiere" style={{ color }}>{slot.matiere}</span>
                        {slot.prof  && <span className="edt-slot-prof">👤 {slot.prof}</span>}
                        {slot.salle && <span className="edt-slot-salle">📍 Salle {slot.salle}</span>}
                      </div>
                      {canEdit && (
                        <button className="btn-del-sm" onClick={() => removeEdtItem(classeId, activeDay, idx)}>✕</button>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          }
        </div>
      )}
    </div>
  );
}
