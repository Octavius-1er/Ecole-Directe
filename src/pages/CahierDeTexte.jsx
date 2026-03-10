import React, { useState } from "react";
import "./CahierDeTexte.css";

// Devoirs par jour (clé = numéro du jour dans le mois)
const DEVOIRS = {
  9: {
    label: "LUNDI 9 MARS",
    items: [],
  },
  10: {
    label: "MARDI 10 MARS",
    items: [
      {
        matiere: "MATHEMATIQUES",
        effectue: true,
        description: "leçon + Ex 24 et 26 p.159",
        donne: "Donné le 9 mars par Mme DAVID S.",
      },
      {
        matiere: "ALLEMAND LV2",
        effectue: true,
        description: "Vocabulaire p.52 — apprendre les mots",
        donne: "Donné le 9 mars par Mme BOURGUIGNON A.",
      },
      {
        matiere: "HIST.GEO",
        effectue: true,
        description: "Bien apprendre les cours d'EMC",
        donne: "Donné le 5 mars par Mme HEMET I.",
      },
      {
        matiere: "FRANCAIS",
        effectue: true,
        description: "Lire Les Fourberies de Scapin de Molière\nDes comédiens viendront jouer la pièce devant les élèves",
        donne: "Donné le 13 février par Mme FISCHER N.",
      },
      {
        matiere: "ANGLAIS LV1",
        effectue: false,
        description: "Vocabulary list p.48 — learn words",
        donne: "Donné le 6 mars par M. GUELLEC L.",
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
      },
      {
        matiere: "FRANCAIS",
        effectue: true,
        description: "Choisir une scène à jouer (un personnage)",
        donne: "Donné le 10 mars par Mme FISCHER N.",
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
      },
      {
        matiere: "EDUCATION MUSICALE",
        effectue: true,
        description: "Réviser les notes de la gamme de Do",
        donne: "Donné le dimanche 8 mars par Mme CORNIER C.",
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
      },
    ],
  },
  14: { label: "SAMEDI 14 MARS", items: [] },
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
  const days = [];
  for (let i = 0; i < 6; i++) days.push({ day: 23 + i, currentMonth: false });
  for (let i = 1; i <= 31; i++) days.push({ day: i, currentMonth: true });
  let next = 1;
  while (days.length < 42) days.push({ day: next++, currentMonth: false });
  return days;
}

const calendarDays = buildMarsCalendar();

export default function CahierDeTexte() {
  const [selectedDay, setSelectedDay] = useState(11);
  const [checked, setChecked] = useState({});

  function toggleChecked(dayKey, idx, defaultVal) {
    const key = `${dayKey}-${idx}`;
    setChecked(prev => ({
      ...prev,
      [key]: key in prev ? !prev[key] : !defaultVal,
    }));
  }

  function isChecked(dayKey, idx, defaultVal) {
    const key = `${dayKey}-${idx}`;
    return key in checked ? checked[key] : defaultVal;
  }

  const dayData = DEVOIRS[selectedDay];

  return (
    <div className="cdt-container">
      <h1 className="cdt-title">
        Cahier de textes
        <span className="cdt-subtitle"> (OCTAVE — CINQUIÈME F EUROP.)</span>
      </h1>

      <div className="cdt-layout">

        {/* ── Gauche : calendrier ── */}
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
                  className={[
                    "cal-day",
                    !d.currentMonth ? "other-month" : "",
                    d.currentMonth && d.day === 10 ? "today" : "",
                    d.currentMonth && d.day === selectedDay ? "selected" : "",
                    d.currentMonth && DEVOIRS[d.day] ? "has-devoirs" : "",
                  ].join(" ")}
                >
                  {d.day}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Centre : devoirs du jour ── */}
        <div className="cdt-center">

          <div className="cdt-toolbar">
            <div className="cdt-tabs">
              <button className="cdt-tab active">Travail à faire</button>
              <button className="cdt-tab">Contenus de séances</button>
            </div>
            <button className="cdt-print">🖨</button>
          </div>

          <h2 className="cdt-day-title">{dayData?.label}</h2>

          {dayData?.items.length === 0 ? (
            <div className="cdt-empty">Aucun devoir pour ce jour.</div>
          ) : (
            <div className="cdt-cards">
              {dayData.items.map((item, idx) => (
                <div key={idx} className="cdt-card">

                  {/* Barre bleue + matière + case effectué */}
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

                  {/* Corps de la carte */}
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

        {/* ── Droite : nav verticale ── */}
        <div className="cdt-weeknav">
          <button className="cdt-nav-arrow up">▲</button>
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
          <button className="cdt-nav-arrow down">▼</button>
          <button className="cdt-nav-label">À venir</button>
          <button className="cdt-nav-label">Devoirs de la semaine</button>
        </div>

      </div>
    </div>
  );
}
