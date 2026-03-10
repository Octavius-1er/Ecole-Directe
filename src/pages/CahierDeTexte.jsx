import React, { useState } from "react";
import "./CahierDeTexte.css";

const DEVOIRS = {
  10: {
    label: "MARDI 10 MARS",
    items: [
      { matiere: "MATHEMATIQUES",  effectue: true,  description: "leçon + Ex 24 et 26 p.159",                      donne: "Donné le 9 mars par Mme DAVID S." },
      { matiere: "ALLEMAND LV2",   effectue: true,  description: "Vocabulaire p.52 — apprendre les mots",           donne: "Donné le 9 mars par Mme BOURGUIGNON A." },
      { matiere: "HIST.GEO",       effectue: true,  description: "Bien apprendre les cours d'EMC",                  donne: "Donné le 5 mars par Mme HEMET I." },
      { matiere: "FRANCAIS",       effectue: true,  description: "Lire Les Fourberies de Scapin de Molière\nDes comédiens viendront jouer la pièce devant les élèves", donne: "Donné le 13 février par Mme FISCHER N." },
      { matiere: "ANGLAIS LV1",    effectue: false, description: "Vocabulary list p.48 — learn words",              donne: "Donné le 6 mars par M. GUELLEC L." },
    ],
  },
  11: {
    label: "MERCREDI 11 MARS",
    items: [
      { matiere: "SCIENCES VIE & TERRE", effectue: true,  description: "Evaluation flash: apprendre le tableau des 9 sens\n+ Chercher dans le dictionnaire le sens des mots \"percevoir\" et \"stimulus\".", donne: "Donné le 5 mars par Mme TLICH Z." },
      { matiere: "FRANCAIS",             effectue: true,  description: "Choisir une scène à jouer (un personnage)", donne: "Donné le 10 mars par Mme FISCHER N." },
    ],
  },
  12: {
    label: "JEUDI 12 MARS",
    items: [
      { matiere: "FRANCAIS",          effectue: false, description: "Apprendre la tirade du nez (Cyrano de Bergerac)", donne: "Donné le mardi 10 mars par Mme FISCHER N." },
      { matiere: "EDUCATION MUSICALE",effectue: true,  description: "Réviser les notes de la gamme de Do",             donne: "Donné le dimanche 8 mars par Mme CORNIER C." },
    ],
  },
  13: {
    label: "VENDREDI 13 MARS",
    items: [
      { matiere: "ALLEMAND LV2", effectue: false, description: "Wortschatz Seite 52 lernen", donne: "Donné le mardi 10 mars par Mme BOURGUIGNON A." },
    ],
  },
};

// Génère tous les jours d'un mois donné
// month: 0-indexed, year: full year
function buildCalendar(year, month) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=dim
  const offset = (firstDay + 6) % 7; // lundi=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const days = [];
  for (let i = 0; i < offset; i++)
    days.push({ day: daysInPrev - offset + 1 + i, currentMonth: false });
  for (let i = 1; i <= daysInMonth; i++)
    days.push({ day: i, currentMonth: true });
  let next = 1;
  while (days.length < 42)
    days.push({ day: next++, currentMonth: false });
  return days;
}

const MONTH_NAMES = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const DAY_NAMES = ["lun.","mar.","mer.","jeu.","ven.","sam.","dim."];

// Jours de la semaine courante (9–14 mars)
const WEEK_NAV = [
  { day: 9,  label: "Lundi 9" },
  { day: 10, label: "Mardi 10" },
  { day: 11, label: "Mercredi 11" },
  { day: 12, label: "Jeudi 12" },
  { day: 13, label: "Vendredi 13" },
  { day: 14, label: "Samedi 14" },
];

export default function CahierDeTexte() {
  const [calYear, setCalYear]   = useState(2026);
  const [calMonth, setCalMonth] = useState(2); // 0-indexed → mars
  const [selectedDay, setSelectedDay] = useState(11);
  const [checked, setChecked]   = useState({});

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  }

  function toggleChecked(dayKey, idx, defaultVal) {
    const key = `${dayKey}-${idx}`;
    setChecked(prev => ({ ...prev, [key]: key in prev ? !prev[key] : !defaultVal }));
  }
  function isChecked(dayKey, idx, defaultVal) {
    const key = `${dayKey}-${idx}`;
    return key in checked ? checked[key] : defaultVal;
  }

  const calDays = buildCalendar(calYear, calMonth);
  const dayData = DEVOIRS[selectedDay];
  const dayLabel = dayData?.label || `JOUR ${selectedDay} MARS`;

  return (
    <div className="cdt-container">
      <h1 className="cdt-title">
        Cahier de textes
        <span className="cdt-subtitle"> (OCTAVE — CINQUIÈME F EUROP.)</span>
      </h1>

      <div className="cdt-layout">

        {/* ── Calendrier ── */}
        <div className="cdt-left">
          <div className="cdt-calendar">
            <div className="cal-header">
              <button className="cal-nav" onClick={prevMonth}>‹</button>
              <span className="cal-month">{MONTH_NAMES[calMonth]} <strong>{calYear}</strong></span>
              <button className="cal-nav" onClick={nextMonth}>›</button>
            </div>
            <div className="cal-grid">
              {DAY_NAMES.map(d => <span key={d} className="cal-dayname">{d}</span>)}
              {calDays.map((d, i) => (
                <span
                  key={i}
                  onClick={() => d.currentMonth && setSelectedDay(d.day)}
                  className={[
                    "cal-day",
                    !d.currentMonth          ? "other-month" : "",
                    d.currentMonth && d.day === 10 && calMonth === 2 && calYear === 2026 ? "today" : "",
                    d.currentMonth && d.day === selectedDay && calMonth === 2 && calYear === 2026 ? "selected" : "",
                    d.currentMonth && DEVOIRS[d.day] && calMonth === 2 && calYear === 2026 ? "has-devoirs" : "",
                  ].join(" ")}
                >
                  {d.day}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Devoirs du jour ── */}
        <div className="cdt-center">
          <div className="cdt-toolbar">
            <button className="cdt-tab active">Travail à faire</button>
            <button className="cdt-print">🖨</button>
          </div>

          <h2 className="cdt-day-title">{dayLabel}</h2>

          {!dayData || dayData.items.length === 0 ? (
            <div className="cdt-empty">Aucun devoir pour ce jour.</div>
          ) : (
            <div className="cdt-cards">
              {dayData.items.map((item, idx) => (
                <div key={idx} className="cdt-card">
                  <div className="cdt-card-head">
                    <div className="cdt-card-bar" />
                    <div className="cdt-card-title-row">
                      <span className="cdt-matiere">{item.matiere}</span>
                      <label className="cdt-effectue">
                        <input
                          type="checkbox"
                          checked={isChecked(selectedDay, idx, item.effectue)}
                          onChange={() => toggleChecked(selectedDay, idx, item.effectue)}
                        />
                        <span>Effectué</span>
                      </label>
                    </div>
                  </div>
                  <div className="cdt-card-body">
                    {item.description.split("\n").map((line, l) => (
                      <p key={l} className="cdt-desc">{line}</p>
                    ))}
                    <p className="cdt-donne">{item.donne}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Nav verticale droite ── */}
        <div className="cdt-weeknav">
          <button className="cdt-nav-arrow">▲</button>
          {WEEK_NAV.map(w => (
            <button
              key={w.day}
              onClick={() => setSelectedDay(w.day)}
              className={[
                "cdt-nav-day",
                selectedDay === w.day ? "active" : "",
                DEVOIRS[w.day]?.items.length > 0 ? "has-items" : "",
              ].join(" ")}
            >
              {w.label}
            </button>
          ))}
          <button className="cdt-nav-arrow">▼</button>
          <button className="cdt-nav-label">À venir</button>
          <button className="cdt-nav-label">Devoirs de la semaine</button>
        </div>

      </div>
    </div>
  );
}
