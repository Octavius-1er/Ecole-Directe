import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useData } from "../DataContext";
import "./CahierDeTexte.css";

const MONTH_NAMES = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const DAY_NAMES   = ["L","M","M","J","V","S","D"];
const MATIERES    = ["Français","Mathématiques","Anglais LV1","Allemand LV2","Histoire-Géo","SVT","Physique-Chimie","Technologie","EPS","Arts Plastiques","Éducation Musicale","LCA Latin"];

// Génère les jours Lun→Sam d'une semaine à partir d'une date (lundi)
function getWeekDays(mondayDate) {
  const days = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(mondayDate);
    d.setDate(d.getDate() + i);
    const LABELS = ["Lun","Mar","Mer","Jeu","Ven","Sam"];
    days.push({
      day:   d.getDate(),
      month: d.getMonth(),
      year:  d.getFullYear(),
      label: `${LABELS[i]}\n${d.getDate()}`,
      date:  new Date(d),
    });
  }
  return days;
}

// Retourne le lundi de la semaine contenant `date`
function getMondayOf(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=dim
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  d.setHours(0,0,0,0);
  return d;
}

function buildCalendar(year, month) {
  const firstDay    = new Date(year, month, 1).getDay();
  const offset      = (firstDay === 0 ? 6 : firstDay - 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev  = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = offset - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, currentMonth: false });
  for (let d = 1; d <= daysInMonth; d++)  cells.push({ day: d, currentMonth: true });
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - daysInMonth - offset + 1, currentMonth: false });
  return cells;
}

export default function CahierDeTextes() {
  const { user }  = useAuth();
  const { classes, getDevoirsClasse, addDevoirClasse, removeDevoirClasse, updateDevoirEffectue } = useData();
  const canEdit   = user?.role === "admin" || user?.role === "prof";

  // Classe
  const eleveClasse = user?.role === "eleve" ? user?.classeId : null;
  const [selectedClasse, setSelectedClasse] = useState(eleveClasse || Object.keys(classes)[0] || "");
  const classeId = user?.role === "eleve" ? eleveClasse : selectedClasse;

  // Calendrier
  const [calMonth, setCalMonth] = useState(2);
  const [calYear,  setCalYear]  = useState(2026);

  // Sélection jour
  const [selected, setSelected] = useState({ day: 10, month: 2, year: 2026 });

  // Semaine courante (lundi de la semaine)
  const [weekMonday, setWeekMonday] = useState(() => getMondayOf(new Date(2026, 2, 9)));
  const weekDays = getWeekDays(weekMonday);

  function prevWeek() {
    setWeekMonday(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  }
  function nextWeek() {
    setWeekMonday(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  }

  function selectDay(dayObj) {
    setSelected({ day: dayObj.day, month: dayObj.month, year: dayObj.year });
    setCalMonth(dayObj.month);
    setCalYear(dayObj.year);
  }

  // Formulaire
  const [showAdd,   setShowAdd]   = useState(false);
  const [newDevoir, setNewDevoir] = useState({ matiere: "", description: "", donne: "" });
  const [msg,       setMsg]       = useState("");

  function prevMonth() { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }
  function nextMonth() { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }

  const calDays      = buildCalendar(calYear, calMonth);
  const devoirsClasse = classeId ? getDevoirsClasse(classeId) : {};

  // Clé unique par date pour les devoirs
  function dayKey(d) { return `${d.year}-${d.month}-${d.day}`; }
  const selKey  = dayKey(selected);
  const dayData = devoirsClasse[selKey] || devoirsClasse[selected.day] || null; // compat ancienne clé
  const dayLabel = dayData?.label || `${selected.day} ${MONTH_NAMES[selected.month]} ${selected.year}`;

  // Vérif si un jour de la semaine a des devoirs
  function hasDevoirsOnDay(dObj) {
    return !!(devoirsClasse[dayKey(dObj)]?.items?.length || devoirsClasse[dObj.day]?.items?.length);
  }

  function handleAdd(e) {
    e.preventDefault();
    if (!newDevoir.matiere || !newDevoir.description || !classeId) return;
    const DAY_NAMES_FR = ["DIMANCHE","LUNDI","MARDI","MERCREDI","JEUDI","VENDREDI","SAMEDI"];
    const dn    = new Date(selected.year, selected.month, selected.day);
    const label = `${DAY_NAMES_FR[dn.getDay()]} ${selected.day} ${MONTH_NAMES[selected.month].toUpperCase()}`;
    addDevoirClasse(classeId, selKey, label, {
      matiere:     newDevoir.matiere.toUpperCase(),
      description: newDevoir.description,
      donne:       newDevoir.donne || `Donné le ${selected.day} ${MONTH_NAMES[selected.month]} par ${user.prenom} ${user.nom}`,
      effectue:    false,
    });
    setMsg("Devoir ajouté ✓");
    setNewDevoir({ matiere: "", description: "", donne: "" });
    setTimeout(() => setMsg(""), 3000);
  }

  // Label de semaine
  const wStart = weekDays[0];
  const wEnd   = weekDays[5];
  const weekLabel = `${wStart.day} ${MONTH_NAMES[wStart.month].slice(0,3)}. — ${wEnd.day} ${MONTH_NAMES[wEnd.month].slice(0,3)}. ${wEnd.year}`;

  return (
    <div className="cdt-page">
      <h1 className="cdt-title">Cahier de textes</h1>

      {/* Sélecteur classe */}
      {canEdit && (
        <div className="cdt-class-selector">
          <label>Classe :</label>
          <select value={selectedClasse} onChange={e => setSelectedClasse(e.target.value)}>
            <option value="">— Choisir —</option>
            {Object.values(classes).map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
          {classes[selectedClasse] && <span className="selector-eleve-chip">📚 {classes[selectedClasse].nom}</span>}
        </div>
      )}

      <div className="cdt-layout">

        {/* ── CALENDRIER ── */}
        <div className="cdt-calendar">
          <div className="cal-header">
            <button className="cal-nav" onClick={prevMonth}>‹</button>
            <span className="cal-month">{MONTH_NAMES[calMonth]} {calYear}</span>
            <button className="cal-nav" onClick={nextMonth}>›</button>
          </div>
          <div className="cal-grid">
            {DAY_NAMES.map((d, i) => <span key={i} className="cal-dayname">{d}</span>)}
            {calDays.map((d, i) => {
              const isSelected = d.currentMonth && d.day === selected.day && calMonth === selected.month && calYear === selected.year;
              const isToday    = d.currentMonth && d.day === 10 && calMonth === 2 && calYear === 2026;
              const hasDev     = d.currentMonth && (devoirsClasse[`${calYear}-${calMonth}-${d.day}`]?.items?.length || devoirsClasse[d.day]?.items?.length);
              return (
                <span key={i}
                  onClick={() => d.currentMonth && setSelected({ day: d.day, month: calMonth, year: calYear })}
                  className={["cal-day", !d.currentMonth ? "other-month" : "", isToday ? "today" : "", isSelected ? "selected" : "", hasDev ? "has-devoirs" : ""].filter(Boolean).join(" ")}
                >{d.day}</span>
              );
            })}
          </div>
        </div>

        {/* ── DEVOIRS ── */}
        <div className="cdt-devoirs">
          <div className="cdt-devoirs-header">
            <div className="cdt-tab active">Travail à faire</div>
            {canEdit && classeId && (
              <button className="btn-add-note" onClick={() => setShowAdd(v => !v)}>
                {showAdd ? "✕ Fermer" : "➕ Ajouter un devoir"}
              </button>
            )}
          </div>

          {canEdit && showAdd && classeId && (
            <form className="add-note-form" onSubmit={handleAdd}>
              <select value={newDevoir.matiere} onChange={e => setNewDevoir(p => ({ ...p, matiere: e.target.value }))} required>
                <option value="">— Matière —</option>
                {MATIERES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <textarea placeholder="Description du devoir..." value={newDevoir.description} onChange={e => setNewDevoir(p => ({ ...p, description: e.target.value }))} rows={2} required />
              <input type="text" placeholder={`Donné le ${selected.day} ${MONTH_NAMES[selected.month]} par ${user.prenom} ${user.nom}`} value={newDevoir.donne} onChange={e => setNewDevoir(p => ({ ...p, donne: e.target.value }))} />
              <button type="submit" className="btn-primary-sm">Ajouter</button>
              {msg && <span className="add-success">{msg}</span>}
            </form>
          )}

          {!classeId && <div className="cdt-empty">Sélectionnez une classe pour voir les devoirs.</div>}

          {classeId && (
            <>
              <div className="cdt-day-title">{dayLabel}</div>
              {!dayData || dayData.items.length === 0
                ? <div className="cdt-empty">Aucun devoir pour ce jour.</div>
                : (
                  <div className="cdt-cards">
                    {dayData.items.map((item, idx) => (
                      <div key={idx} className="cdt-card">
                        <div className="cdt-card-head">
                          <div className="cdt-card-bar" />
                          <div className="cdt-card-title-row">
                            <span className="cdt-matiere">{item.matiere}</span>
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                              <label className="cdt-effectue">
                                <input type="checkbox" checked={item.effectue}
                                  onChange={e => updateDevoirEffectue(classeId, selKey, idx, e.target.checked)} />
                                <span>Effectué</span>
                              </label>
                              {canEdit && (
                                <button style={{ background: "#fee2e2", color: "#dc2626", borderRadius: 6, padding: "3px 8px", border: "none", cursor: "pointer", fontSize: 12 }}
                                  onClick={() => removeDevoirClasse(classeId, selKey, idx)}>✕ Supprimer</button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="cdt-card-body">
                          {item.description.split("\n").map((line, l) => <p key={l} className="cdt-desc">{line}</p>)}
                          <p className="cdt-donne">{item.donne}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              }
            </>
          )}
        </div>

        {/* ── NAV SEMAINE ── */}
        <div className="cdt-week-nav">
          <button className="cdt-nav-arrow" onClick={prevWeek} title="Semaine précédente">▲</button>
          <div className="cdt-nav-week-label">{weekLabel}</div>
          {weekDays.map(w => (
            <button key={`${w.year}-${w.month}-${w.day}`}
              onClick={() => selectDay(w)}
              className={[
                "cdt-nav-day",
                selected.day === w.day && selected.month === w.month && selected.year === w.year ? "active" : "",
                hasDevoirsOnDay(w) ? "has-items" : "",
              ].filter(Boolean).join(" ")}
            >
              {w.label.split("\n").map((l, i) => <span key={i}>{l}</span>)}
            </button>
          ))}
          <button className="cdt-nav-arrow" onClick={nextWeek} title="Semaine suivante">▼</button>
        </div>

      </div>
    </div>
  );
}
