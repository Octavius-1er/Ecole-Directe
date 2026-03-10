import React, { createContext, useContext, useState, useEffect } from "react";

const DataContext = createContext(null);

const DEFAULT_NOTES = {
  r2: {
    conseil: "Conseil de classe de CINQUIÈME F EUROP. le vendredi 13 mars 2026 à 16:45",
    moyenneGenerale: "16,01",
    moyenneClasse: "14,95",
    moyenneMin: "12,84",
    moyenneMax: "17,66",
    notes: [
      { matiere: "Français",            prof: "Mme Fischer N.",     moyenne: "14,7",  evals: ["6,5/10", "15", "15", "13,5", "17"] },
      { matiere: "Mathématiques",       prof: "Mme David S.",       moyenne: "15,58", evals: ["17", "18,5", "8,5/10", "12", "13"] },
      { matiere: "Anglais LV1",         prof: "M. Guellec L.",      moyenne: "17,5",  evals: ["16", "8/10", "18,5", "15", "20"] },
      { matiere: "Éducation Physique",  prof: "M. Chapelot B.",     moyenne: "13,33", evals: ["12,5", "15"] },
      { matiere: "Arts Plastiques",     prof: "Mme Decroix C.",     moyenne: "15",    evals: ["15", "16"] },
      { matiere: "Éducation Musicale",  prof: "Mme Cornier C.",     moyenne: "16,5",  evals: ["4,5/5", "15"] },
      { matiere: "Physique-Chimie",     prof: "Mme Bredel M.",      moyenne: "19,33", evals: ["19", "15/15", "14,75"] },
      { matiere: "Sciences Vie & Terre",prof: "Mme Tlich Z.",       moyenne: "11,5",  evals: ["11,5", "7/10", "9/10"] },
      { matiere: "Technologie",         prof: "M. Olivares D.",     moyenne: "19,67", evals: ["20", "20"] },
      { matiere: "LCA Latin",           prof: "Mme Langlois S.",    moyenne: "18,5",  evals: ["7/10", "9/10"] },
      { matiere: "Allemand LV2",        prof: "Mme Bourguignon A.", moyenne: "14,17", evals: ["10,5", "16", "8,5/10", "18,5", "5/5"] },
      { matiere: "Histoire-Géo",        prof: "Mme Hemet I.",       moyenne: "11,88", evals: ["Abs", "7/10", "12,25", "5,75/10", "13,75", "8"] },
    ],
    moyennes: [
      { matiere: "Français",            eleve: "14,7",  classe: "15,43", min: "12,7",  max: "19,4" },
      { matiere: "Mathématiques",       eleve: "15,58", classe: "14,2",  min: "9,75",  max: "17,75" },
      { matiere: "Anglais LV1",         eleve: "17,5",  classe: "13,54", min: "9,7",   max: "17,5" },
      { matiere: "EPS",                 eleve: "13,33", classe: "14,86", min: "11,67", max: "16,67" },
      { matiere: "Arts Plastiques",     eleve: "15",    classe: "16,08", min: "10",    max: "20" },
      { matiere: "Éducation Musicale",  eleve: "16,5",  classe: "16,04", min: "11,5",  max: "19" },
      { matiere: "Physique-Chimie",     eleve: "19,33", classe: "14,6",  min: "9,22",  max: "20" },
      { matiere: "SVT",                 eleve: "19,67", classe: "18,39", min: "17",    max: "20" },
      { matiere: "Technologie",         eleve: "18,5",  classe: "18,18", min: "14,5",  max: "20" },
      { matiere: "Latin",               eleve: "14,17", classe: "14,67", min: "13,83", max: "16" },
      { matiere: "Allemand LV2",        eleve: "11,88", classe: "11,98", min: "8,44",  max: "17,05" },
    ],
    competences: [
      { matiere: "Français", items: [
        { label: "Construire les notions permettant l'analyse et l'élaboration des textes", level: "atteints" },
        { label: "Exploiter les principales fonctions de l'écrit", level: "partiellement" },
        { label: "Adopter des stratégies d'écriture efficaces", level: "atteints" },
        { label: "Contrôler sa compréhension, devenir un lecteur autonome", level: "atteints" },
      ]},
      { matiere: "Anglais LV1", items: [
        { label: "Mobiliser les outils pour écrire, corriger, modifier son écrit", level: "atteints" },
        { label: "Mettre en voix son discours", level: "atteints" },
        { label: "Mobiliser connaissances lexicales, culturelles, grammaticales", level: "atteints" },
        { label: "Niveau A2 — Interagir avec aisance raisonnable", level: "atteints" },
      ]},
      { matiere: "EPS", items: [
        { label: "S'adapter au changement défenseur / attaquant", level: "atteints" },
        { label: "Co‑animer une séquence de match", level: "atteints" },
      ]},
    ],
  },
};

const DEFAULT_DEVOIRS = {
  10: { label: "MARDI 10 MARS", items: [
    { matiere: "MATHEMATIQUES",  effectue: true,  description: "leçon + Ex 24 et 26 p.159",                      donne: "Donné le 9 mars par Mme DAVID S." },
    { matiere: "HIST.GEO",       effectue: true,  description: "Bien apprendre les cours d'EMC",                  donne: "Donné le 5 mars par Mme HEMET I." },
    { matiere: "FRANCAIS",       effectue: true,  description: "Lire Les Fourberies de Scapin de Molière",        donne: "Donné le 13 février par Mme FISCHER N." },
    { matiere: "ANGLAIS LV1",    effectue: false, description: "Vocabulary list p.48 — learn words",              donne: "Donné le 6 mars par M. GUELLEC L." },
  ]},
  11: { label: "MERCREDI 11 MARS", items: [
    { matiere: "SCIENCES VIE & TERRE", effectue: true,  description: "Evaluation flash: apprendre le tableau des 9 sens\n+ Chercher dans le dictionnaire le sens des mots \"percevoir\" et \"stimulus\".", donne: "Donné le 5 mars par Mme TLICH Z." },
    { matiere: "FRANCAIS",             effectue: true,  description: "Choisir une scène à jouer (un personnage)", donne: "Donné le 10 mars par Mme FISCHER N." },
  ]},
  12: { label: "JEUDI 12 MARS", items: [
    { matiere: "FRANCAIS",           effectue: false, description: "Apprendre la tirade du nez (Cyrano de Bergerac)", donne: "Donné le mardi 10 mars par Mme FISCHER N." },
    { matiere: "EDUCATION MUSICALE", effectue: true,  description: "Réviser les notes de la gamme de Do",             donne: "Donné le dimanche 8 mars par Mme CORNIER C." },
  ]},
  13: { label: "VENDREDI 13 MARS", items: [
    { matiere: "ALLEMAND LV2", effectue: false, description: "Wortschatz Seite 52 lernen", donne: "Donné le mardi 10 mars par Mme BOURGUIGNON A." },
  ]},
};

const DEFAULT_ABSENCES = [
  { id: "1", date: "Du 5 janv 2026 08:00 au 7 janv 2026 12:00", duree: "5 demi-journées", justifiee: "Oui", motif: "Conditions météorologiques" },
  { id: "2", date: "Le 17 nov 2025 — 08:00 à 16:30",            duree: "2 demi-journées", justifiee: "Oui", motif: "Maladie" },
];

const DEFAULT_PUNITIONS = [];

const DEFAULT_MESSAGES = [
  { id: "1", sujet: "Soirée Louanges",              auteur: "M. O. Chaput",  date: "Mardi 3 mars 2026 — 18:24", lu: false, corps: "Chers jeunes, Chères familles\n\n✨ Laetare : Réjouissez-vous ! ✨\n\nDans 10 jours... nous vivrons le milieu de notre marche vers Pâques !\n\nPour vivre et partager un vendredi soir pas comme les autres...\nnous vous convions à notre prochaine Soirée Louange !\n\n📅 Vendredi 13 mars 2026" },
  { id: "2", sujet: "Nouvelles évaluations",         auteur: "Mme David S.",  date: "Lundi 2 mars 2026",         lu: true,  corps: "Bonjour,\n\nDe nouvelles évaluations ont été ajoutées en Mathématiques.\n\nCordialement,\nMme David S." },
  { id: "3", sujet: "Partenariat Librairie Colbert", auteur: "Direction",     date: "Lundi 2 mars 2026",         lu: true,  corps: "Chers parents,\n\nNous avons le plaisir de vous annoncer notre nouveau partenariat avec la Librairie Colbert.\n\nCordialement,\nLa Direction" },
];

const DEFAULT_EDT = {
  9:  { label: "Lundi 9",      items: [{ heure: "08:05 - 09:55", matiere: "ED. PHYSIQUE & SPORT.", prof: "Chapelot B." }, { heure: "10:10 - 11:05", matiere: "Allemand LV2", prof: "Bourguignon A." }, { heure: "11:05 - 12:00", matiere: "Arts Plastiques", prof: "Decroix C." }] },
  10: { label: "Mardi 10",     items: [{ heure: "08:05 - 09:00", matiere: "Anglais LV1", prof: "Guellec L." }, { heure: "09:00 - 09:55", matiere: "Français", prof: "Fischer N." }, { heure: "10:10 - 11:05", matiere: "Allemand LV2", prof: "Bourguignon A." }, { heure: "11:05 - 12:00", matiere: "Technologie", prof: "Olivares D." }] },
  11: { label: "Mercredi 11",  items: [{ heure: "08:05 - 09:00", matiere: "Histoire-Géo", prof: "Hemet I." }, { heure: "09:00 - 09:55", matiere: "SVT", prof: "Tlich Z." }, { heure: "10:10 - 11:05", matiere: "Français", prof: "Fischer N." }] },
  12: { label: "Jeudi 12",     items: [{ heure: "08:05 - 09:00", matiere: "Français", prof: "Fischer N." }, { heure: "09:00 - 09:55", matiere: "Éducation Musicale", prof: "Cornier C." }, { heure: "10:10 - 11:05", matiere: "Mathématiques", prof: "David S." }, { heure: "11:05 - 12:00", matiere: "Histoire-Géo", prof: "Hemet I." }] },
  13: { label: "Vendredi 13",  items: [{ heure: "09:00 - 09:55", matiere: "Français", prof: "Fischer N." }, { heure: "10:10 - 11:30", matiere: "Physique-Chimie", prof: "Bredel M." }] },
  14: { label: "Samedi 14",    items: [] },
};

function load(key, def) {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : def; } catch { return def; }
}

export function DataProvider({ children }) {
  const [notes,     setNotes]     = useState(() => load("ed_notes",     DEFAULT_NOTES));
  const [devoirs,   setDevoirs]   = useState(() => load("ed_devoirs",   DEFAULT_DEVOIRS));
  const [absences,  setAbsences]  = useState(() => load("ed_absences",  DEFAULT_ABSENCES));
  const [punitions, setPunitions] = useState(() => load("ed_punitions", DEFAULT_PUNITIONS));
  const [messages,  setMessages]  = useState(() => load("ed_messages",  DEFAULT_MESSAGES));
  const [edt,       setEdt]       = useState(() => load("ed_edt",       DEFAULT_EDT));

  useEffect(() => { localStorage.setItem("ed_notes",     JSON.stringify(notes));     }, [notes]);
  useEffect(() => { localStorage.setItem("ed_devoirs",   JSON.stringify(devoirs));   }, [devoirs]);
  useEffect(() => { localStorage.setItem("ed_absences",  JSON.stringify(absences));  }, [absences]);
  useEffect(() => { localStorage.setItem("ed_punitions", JSON.stringify(punitions)); }, [punitions]);
  useEffect(() => { localStorage.setItem("ed_messages",  JSON.stringify(messages));  }, [messages]);
  useEffect(() => { localStorage.setItem("ed_edt",       JSON.stringify(edt));       }, [edt]);

  // ── NOTES ──
  function addNote(releveId, matiere, note) {
    setNotes(prev => {
      const releve = prev[releveId];
      if (!releve) return prev;
      const notes2 = releve.notes.map(n => {
        if (n.matiere === matiere) {
          const newEvals = [...n.evals, String(note)];
          const avg = newEvals.map(e => parseFloat(e.replace(",", ".").replace(/\/\d+/, ""))).filter(v => !isNaN(v));
          const moyenne = avg.length ? (avg.reduce((a, b) => a + b, 0) / avg.length).toFixed(2).replace(".", ",") : n.moyenne;
          return { ...n, evals: newEvals, moyenne };
        }
        return n;
      });
      // Recalcule moyenne générale
      const avgs = notes2.map(n => parseFloat(n.moyenne.replace(",", "."))).filter(v => !isNaN(v));
      const mg = avgs.length ? (avgs.reduce((a, b) => a + b, 0) / avgs.length).toFixed(2).replace(".", ",") : releve.moyenneGenerale;
      return { ...prev, [releveId]: { ...releve, notes: notes2, moyenneGenerale: mg } };
    });
  }

  function removeNote(releveId, matiere, evalIdx) {
    setNotes(prev => {
      const releve = prev[releveId];
      if (!releve) return prev;
      const notes2 = releve.notes.map(n => {
        if (n.matiere === matiere) {
          const newEvals = n.evals.filter((_, i) => i !== evalIdx);
          const avg = newEvals.map(e => parseFloat(e.replace(",", ".").replace(/\/\d+/, ""))).filter(v => !isNaN(v));
          const moyenne = avg.length ? (avg.reduce((a, b) => a + b, 0) / avg.length).toFixed(2).replace(".", ",") : "—";
          return { ...n, evals: newEvals, moyenne };
        }
        return n;
      });
      const avgs = notes2.map(n => parseFloat(n.moyenne.replace(",", "."))).filter(v => !isNaN(v));
      const mg = avgs.length ? (avgs.reduce((a, b) => a + b, 0) / avgs.length).toFixed(2).replace(".", ",") : releve.moyenneGenerale;
      return { ...prev, [releveId]: { ...releve, notes: notes2, moyenneGenerale: mg } };
    });
  }

  // ── DEVOIRS ──
  function addDevoir(day, label, item) {
    setDevoirs(prev => {
      const existing = prev[day] || { label, items: [] };
      return { ...prev, [day]: { ...existing, items: [...existing.items, item] } };
    });
  }

  function removeDevoir(day, idx) {
    setDevoirs(prev => {
      const existing = prev[day];
      if (!existing) return prev;
      return { ...prev, [day]: { ...existing, items: existing.items.filter((_, i) => i !== idx) } };
    });
  }

  function updateDevoirEffectue(day, idx, val) {
    setDevoirs(prev => {
      const existing = prev[day];
      if (!existing) return prev;
      const items = existing.items.map((it, i) => i === idx ? { ...it, effectue: val } : it);
      return { ...prev, [day]: { ...existing, items } };
    });
  }

  // ── ABSENCES ──
  function addAbsence(absence) {
    setAbsences(prev => [...prev, { ...absence, id: Date.now().toString() }]);
  }
  function removeAbsence(id) {
    setAbsences(prev => prev.filter(a => a.id !== id));
  }

  // ── PUNITIONS ──
  function addPunition(punition) {
    setPunitions(prev => [...prev, { ...punition, id: Date.now().toString() }]);
  }
  function removePunition(id) {
    setPunitions(prev => prev.filter(p => p.id !== id));
  }

  // ── MESSAGES ──
  function sendMessage(msg) {
    setMessages(prev => [{ ...msg, id: Date.now().toString(), lu: false }, ...prev]);
  }
  function markRead(id) {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, lu: true } : m));
  }
  function deleteMessage(id) {
    setMessages(prev => prev.filter(m => m.id !== id));
  }

  // ── EDT ──
  function addEdtItem(day, label, item) {
    setEdt(prev => {
      const existing = prev[day] || { label, items: [] };
      const items = [...existing.items, item].sort((a, b) => a.heure.localeCompare(b.heure));
      return { ...prev, [day]: { ...existing, items } };
    });
  }
  function removeEdtItem(day, idx) {
    setEdt(prev => {
      const existing = prev[day];
      if (!existing) return prev;
      return { ...prev, [day]: { ...existing, items: existing.items.filter((_, i) => i !== idx) } };
    });
  }

  return (
    <DataContext.Provider value={{
      notes, addNote, removeNote,
      devoirs, addDevoir, removeDevoir, updateDevoirEffectue,
      absences, addAbsence, removeAbsence,
      punitions, addPunition, removePunition,
      messages, sendMessage, markRead, deleteMessage,
      edt, addEdtItem, removeEdtItem,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
