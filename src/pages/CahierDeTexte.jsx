import React, { useState } from "react";
import "./CahierDeTexte.css";

const DEVOIRS = {
  10: {
    label: "MARDI 10 MARS",
    items: [
      {
        matiere: "MATHEMATIQUES",
        effectue: true,
        description: "leçon + Ex 24 et 26 p.159",
        donne: "Donné le 9 mars par Mme DAVID S.",
        contenuSeance: true,
      },
      {
        matiere: "HIST.GEO",
        effectue: true,
        description: "Bien apprendre les cours d'EMC",
        donne: "Donné le 5 mars par Mme HEMET I.",
        contenuSeance: true,
      },
      {
        matiere: "FRANCAIS",
        effectue: true,
        description: "Lire Les Fourberies de Scapin de Molière\nDes comédiens viendront jouer la pièce devant les élèves",
        donne: "Donné le 13 février par Mme FISCHER N.",
        contenuSeance: true,
      },
      {
        matiere: "ANGLAIS LV1",
        effectue: false,
        description: "Vocabulary list p.48 — learn words",
        donne: "Donné le 6 mars par M. GUELLEC L.",
        contenuSeance: false,
      },
    ],
  },
  11: {
    label: "MERCREDI 11 MARS",
    items: [
      {
        matiere: "SCIENCES VIE & TERRE",
        effectue: true,
        description: "Evaluation flash: apprendre le tableau des 9 sens\n+ Chercher dans le dictionnaire le sens des mots \"percevoir\" et \"stimulus\".",
        donne: "Donné le 5 mars par Mme TLICH Z.",
        contenuSeance: false,
      },
      {
        matiere: "FRANCAIS",
        effectue: true,
        description: "Choisir une scène à jouer (un personnage)",
        donne: "Donné le 10 mars par Mme FISCHER N.",
        contenuSeance: true,
      },
    ],
  },
  12: {
    label: "JEUDI 12 MARS",
    items: [
      {
        matiere: "FRANCAIS",
        effectue: false,
        description: "Apprendre la tirade du nez (Cyrano de Bergerac)",
        donne: "Donné le mardi 10 mars par Mme FISCHER N.",
        contenuSeance: true,
      },
      {
        matiere: "EDUCATION MUSICALE",
        effectue: true,
        description: "Réviser les notes de la gamme de Do",
        donne: "Donné le dimanche 8 mars par Mme CORNIER C.",
        contenuSeance: false,
      },
    ],
  },
  13: {
    label: "VENDREDI 13 MARS",
    items: [
      {
        matiere: "ALLEMAND LV2",
        effectue: false,
        description: "Wortschatz Seite 52 lernen",
        donne: "Donné le mardi 10 mars par Mme BOURGUIGNON A.",
        contenuSeance: false,
      },
    ],
  },
};

const DAYS_HEADER = ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."];
const WEEK_NAV = [
  { day: 9,  label: "Lundi 9" },
  { day: 10, label: "Mardi 10" },
  { day: 11, label: "Mercredi 11" },
  { day: 12, label: "Jeudi 12" },
  { day: 13, label: "Vendredi 13" },
  { day: 14, label: "Samedi 14" },
];

function buildMarsCalendar() {
  const offset = 6;
  const days = [];
  for (let i = 0; i < offset; i++) days.push({ day: 23 + i, currentMonth: false });
  for (let i = 1; i <= 31; i++) days.push({ day: i, currentMonth: true });
  let next = 1;
  while (days.length < 42) days.push({ day: next++, currentMonth: false });
  return days;
}

const calendarDays = buildMarsCalendar();

export default function CahierDeTexte() {
  const [selectedDay, setSelectedDay] = useState(10);
  const [checked, setChecked] = useState({});

  const dayData = DEVOIRS[selectedDay];

  function toggleChecked(dayKey, idx) {
    const key = `${dayKey}-${idx}`;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function isChecked(dayKey, idx, defaultVal) {
    const key = `${dayKey}-${idx}`;
    return key in checked ? checked[key] : defaultVal;
  }

  return (
    <div className="cdt-container">
      <h1 className="cdt-title">
        Cahier de textes
        <span className="cdt-subtitle"> (OCTAVE — CINQUIÈME F EUROP.)</span>
      </h1>

      <div className="cdt-layout">

        {/* ── Colonne gauche ── */}
        <div className="cdt-left">
          <div className="cdt-calendar">
            <div className="cal-header">
              <button className="cal-nav">‹</button>
              <span className="cal-month">mars <strong>2026</strong></span>
              <button className="cal-nav">›</button>
            </div>
            <div className="cal-grid">
              {DAYS_HEADER.map(d => (
                <span key={d} className="cal-dayname">{d}</span>
              ))}
              {calendarDays.map((d, i) => (
                <span
                  key={i}
                  onClick={() => d.currentMonth && DEVOIRS[d.day] && setSelectedDay(d.day)}
                  className={`cal-day
                    ${!d.currentMonth ? "other-month" : ""}
                    ${d.currentMonth && d.day === 10 ? "today" : ""}
                    ${d.currentMonth && d.day === selectedDay ? "selected" : ""}
                    ${d.currentMonth && DEVOIRS[d.day] ? "has-devoirs" : ""}
                  `}
                >
                  {d.day}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Colonne centrale : devoirs ── */}
        <div className="cdt-center">
          <div className="cdt-toolbar">
            <div className="cdt-tabs">
              <button className="cdt-tab active">Travail à faire</button>
              <button className="cdt-tab">Contenus de séances</button>
            </div>
            <button className="cdt-print">🖨</button>
          </div>

          {dayData ? (
            <>
              <h2 className="cdt-day-title">{dayData.label}</h2>
              <div className="cdt-cards">
                {dayData.items.map((item, idx) => (
                  <div key={idx} className="cdt-card">
                    <div className="cdt-card-header">
                      <div className="cdt-card-bar" />
                      <div className="cdt-card-top">
                        {item.contenuSeance && (
                          <button className="cdt-seance-btn">Contenu de la séance</button>
                        )}
                        <span className="cdt-card-matiere">{item.matiere}</span>
                        <label className="cdt-effectue">
                          <input
                            type="checkbox"
                            checked={isChecked(selectedDay, idx, item.effectue)}
                            onChange={() => toggleChecked(selectedDay, idx)}
                          />
                          <span>Effectué</span>
                        </label>
                      </div>
                    </div>
                    <div className="cdt-card-body">
                      {item.description.split("\n").map((line, l) => (
                        <p key={l}>{line}</p>
                      ))}
                      <p className="cdt-card-donne">{item.donne}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="cdt-empty">
              <p>Aucun devoir pour ce jour.</p>
            </div>
          )}
        </div>

        {/* ── Barre verticale droite ── */}
        <div className="cdt-weeknav">
          <button className="cdt-weeknav-arrow">▲</button>
          {WEEK_NAV.map(w => (
            <button
              key={w.day}
              className={`cdt-weeknav-day ${selectedDay === w.day ? "active" : ""} ${DEVOIRS[w.day] ? "has-devoirs" : ""}`}
              onClick={() => DEVOIRS[w.day] && setSelectedDay(w.day)}
            >
              <span>{w.label}</span>
            </button>
          ))}
          <button className="cdt-weeknav-arrow">▼</button>
          <button className="cdt-weeknav-label">À venir</button>
          <button className="cdt-weeknav-label">Devoirs de la semaine</button>
        </div>

      </div>
    </div>
  );
}
