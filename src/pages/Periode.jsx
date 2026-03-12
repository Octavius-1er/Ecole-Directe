import React, { useState, useEffect } from "react";
import { useData } from "../DataContext";
import "./Periode.css";

const TRIMESTRES = [
  { id:"t1", label:"1er Trimestre", releves:[{id:"r1",label:"Relevé 1"},{id:"r2",label:"Relevé 2"}] },
  { id:"t2", label:"2ème Trimestre", releves:[{id:"r3",label:"Relevé 3"},{id:"r4",label:"Relevé 4"}] },
  { id:"t3", label:"3ème Trimestre", releves:[{id:"r5",label:"Relevé 5"},{id:"r6",label:"Relevé 6"}] },
];

// Ordre linéaire de tous les relevés
const RELEVES_ORDER = ["r1","r2","r3","r4","r5","r6"];

function getTrimestreOfReleve(rid) {
  return TRIMESTRES.find(t => t.releves.some(r => r.id === rid));
}
function getReleveLabel(rid) {
  for (const t of TRIMESTRES) {
    const r = t.releves.find(r => r.id === rid);
    if (r) return `${r.label} — ${t.label}`;
  }
  return rid;
}

export default function Periode() {
  const { periode, savePeriode } = useData();
  const [selected, setSelected] = useState(periode?.releveId || "r5");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setSelected(periode?.releveId || "r5");
  }, [periode?.releveId]);

  async function handleSave() {
    const trimestre = getTrimestreOfReleve(selected);
    setSaving(true);
    await savePeriode({ releveId: selected, trimestreId: trimestre?.id || "t3" });
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  const currentIdx = RELEVES_ORDER.indexOf(selected);

  return (
    <div className="periode-container">
      <h1 className="periode-title">Période scolaire en cours</h1>
      <p className="periode-subtitle">
        Définit le relevé actif. Les professeurs ne peuvent saisir des notes que sur le relevé en cours.
      </p>

      <div className="periode-card">
        <div className="periode-current">
          <span className="periode-current-label">Période active</span>
          <span className="periode-current-value">{getReleveLabel(periode?.releveId || "r5")}</span>
        </div>

        <div className="periode-selector">
          <h3>Changer la période</h3>

          {TRIMESTRES.map(t => (
            <div key={t.id} className="periode-trimestre-block">
              <div className="periode-trimestre-label">{t.label}</div>
              <div className="periode-releves-row">
                {t.releves.map(r => {
                  const idx = RELEVES_ORDER.indexOf(r.id);
                  const isPast = idx < RELEVES_ORDER.indexOf(selected);
                  const isCurrent = r.id === selected;
                  const isFuture = idx > RELEVES_ORDER.indexOf(selected);
                  return (
                    <button
                      key={r.id}
                      className={`periode-releve-btn ${isCurrent ? "current" : ""} ${isPast ? "past" : ""} ${isFuture ? "future" : ""}`}
                      onClick={() => setSelected(r.id)}
                    >
                      <span className="releve-btn-label">{r.label}</span>
                      <span className="releve-btn-status">
                        {isCurrent ? "● En cours" : isPast ? "✓ Terminé" : "○ À venir"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {selected !== (periode?.releveId || "r5") && (
          <div className="periode-warning">
            ⚠️ Vous allez passer à <strong>{getReleveLabel(selected)}</strong>. Les professeurs ne pourront plus saisir sur les relevés précédents.
          </div>
        )}

        <div className="periode-footer">
          <button
            className="btn-save-periode"
            onClick={handleSave}
            disabled={saving || selected === (periode?.releveId || "r5")}
          >
            {saving ? "Enregistrement..." : "✓ Enregistrer la période"}
          </button>
          {success && <span className="periode-success">✓ Période mise à jour !</span>}
        </div>
      </div>

      {/* Timeline visuelle */}
      <div className="periode-timeline-card">
        <h3>Calendrier de l'année</h3>
        <div className="periode-timeline">
          {RELEVES_ORDER.map((rid, idx) => {
            const t = getTrimestreOfReleve(rid);
            const r = t?.releves.find(r => r.id === rid);
            const currentActiveIdx = RELEVES_ORDER.indexOf(periode?.releveId || "r5");
            const state = idx < currentActiveIdx ? "past" : idx === currentActiveIdx ? "current" : "future";
            return (
              <div key={rid} className={`timeline-item ${state}`}>
                <div className="timeline-dot" />
                {idx < RELEVES_ORDER.length - 1 && <div className="timeline-line" />}
                <div className="timeline-label">
                  <span className="tl-releve">{r?.label}</span>
                  <span className="tl-trim">{t?.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
