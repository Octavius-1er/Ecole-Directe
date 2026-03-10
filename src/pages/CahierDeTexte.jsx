import React, { useState } from "react";
import "./CahierDeTexte.css";

const DEVOIRS = [
  {
    date: "MARDI 10 MARS",
    dateKey: "2026-03-10",
    items: [
      { matiere: "MATHEMATIQUES",    donne: "Donné le lundi 9 mars" },
      { matiere: "ALLEMAND LV2",     donne: "Donné le lundi 9 mars" },
      { matiere: "HIST.GEO",         donne: "Donné le jeudi 5 mars" },
      { matiere: "FRANCAIS",         donne: "Donné le vendredi 13 février" },
      { matiere: "ANGLAIS LV1",      donne: "Donné le vendredi 6 mars" },
    ],
  },
  {
    date: "MERCREDI 11 MARS",
    dateKey: "2026-03-11",
    items: [
      { matiere: "SCIENCES VIE & TERRE", donne: "Donné le jeudi 5 mars" },
      { matiere: "FRANCAIS",             donne: "Donné le mardi 10 mars" },
    ],
  },
  {
    date: "JEUDI 12 MARS",
    dateKey: "2026-03-12",
    items: [
      { matiere: "FRANCAIS",          donne: "Donné le mardi 10 mars" },
      { matiere: "EDUCATION MUSICALE",donne: "Donné le dimanche 8 mars" },
    ],
  },
  {
    date: "VENDREDI 13 MARS",
    dateKey: "2026-03-13",
    items: [
      { matiere: "ALLEMAND LV2", donne: "Donné le mardi 10 mars" },
    ],
  },
];

const DAYS = ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."];

// Jours de mars 2026 (1er mars = dimanche → offset 6)
function buildMarsCalendar() {
  const offset = 6; // lundi=0, ..., dimanche=6 → 1er mars est un dimanche
  const days = [];
  // Jours du mois précédent
  for (let i = 0; i < offset; i++) {
    days.push({ day: 23 + i, currentMonth: false });
  }
  // Jours de mars
  for (let i = 1; i <= 31; i++) {
    days.push({ day: i, currentMonth: true });
  }
  // Compléter jusqu'à 42
  let next = 1;
  while (days.length < 42) {
    days.push({ day: next++, currentMonth: false });
  }
  return days;
}

const calendarDays = buildMarsCalendar();

export default function CahierDeTexte() {
  const [selectedDay, setSelectedDay] = useState(10);

  return (
    <div className="cdt-container">
      <h1 className="cdt-title">
        Cahier de textes
        <span className="cdt-subtitle"> (OCTAVE — CINQUIÈME F EUROP.)</span>
      </h1>

      <div className="cdt-layout">

        {/* Colonne gauche */}
        <div className="cdt-left">

          {/* Calendrier */}
          <div className="cdt-calendar">
            <div className="cal-header">
              <button className="cal-nav">‹</button>
              <span className="cal-month">mars <strong>2026</strong></span>
              <button className="cal-nav">›</button>
            </div>

            <div className="cal-grid">
              {DAYS.map(d => (
                <span key={d} className="cal-dayname">{d}</span>
              ))}
              {calendarDays.map((d, i) => (
                <span
                  key={i}
                  className={`cal-day
                    ${!d.currentMonth ? "other-month" : ""}
                    ${d.currentMonth && d.day === selectedDay ? "selected" : ""}
                    ${d.currentMonth && d.day === 10 ? "today" : ""}
                  `}
                  onClick={() => d.currentMonth && setSelectedDay(d.day)}
                >
                  {d.day}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Colonne droite : devoirs */}
        <div className="cdt-right">
          <h2 className="cdt-devoirs-title">TOUS LES DEVOIRS À VENIR</h2>

          {DEVOIRS.map((group, i) => (
            <div key={i} className="cdt-group">
              <div className="cdt-group-header">
                <div className="cdt-bar" />
                <span className="cdt-date">{group.date}</span>
              </div>

              <div className="cdt-group-body">
                {group.items.map((item, j) => (
                  <div key={j} className="cdt-item">
                    <span className="cdt-matiere">{item.matiere}</span>
                    <span className="cdt-donne">{item.donne}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
