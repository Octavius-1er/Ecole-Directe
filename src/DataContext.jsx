import React, { createContext, useContext, useState, useEffect } from "react";

const DataContext = createContext(null);

function load(key, def) {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : def; } catch { return def; }
}

// ─── DEFAULTS ───────────────────────────────────────────────────
const DEFAULT_CLASSES = {
  "c5f": { id: "c5f", nom: "5ème F", niveau: "5ème" },
};

const DEFAULT_NOTES_PAR_ELEVE = {
  "3": {
    r2: {
      conseil: "Conseil de classe de CINQUIÈME F EUROP. le vendredi 13 mars 2026 à 16:45",
      notes: [
        { matiere: "Français",             prof: "Mme Fischer N.",     moyenne: "14,7",  evals: ["6,5/10","15","15","13,5","17"] },
        { matiere: "Mathématiques",        prof: "Mme David S.",       moyenne: "15,58", evals: ["17","18,5","8,5/10","12","13"] },
        { matiere: "Anglais LV1",          prof: "M. Guellec L.",      moyenne: "17,5",  evals: ["16","8/10","18,5","15","20"] },
        { matiere: "Éducation Physique",   prof: "M. Chapelot B.",     moyenne: "13,33", evals: ["12,5","15"] },
        { matiere: "Arts Plastiques",      prof: "Mme Decroix C.",     moyenne: "15",    evals: ["15","16"] },
        { matiere: "Éducation Musicale",   prof: "Mme Cornier C.",     moyenne: "16,5",  evals: ["4,5/5","15"] },
        { matiere: "Physique-Chimie",      prof: "Mme Bredel M.",      moyenne: "19,33", evals: ["19","15/15","14,75"] },
        { matiere: "Sciences Vie & Terre", prof: "Mme Tlich Z.",       moyenne: "11,5",  evals: ["11,5","7/10","9/10"] },
        { matiere: "Technologie",          prof: "M. Olivares D.",     moyenne: "19,67", evals: ["20","20"] },
        { matiere: "LCA Latin",            prof: "Mme Langlois S.",    moyenne: "18,5",  evals: ["7/10","9/10"] },
        { matiere: "Allemand LV2",         prof: "Mme Bourguignon A.", moyenne: "14,17", evals: ["10,5","16","8,5/10","18,5","5/5"] },
        { matiere: "Histoire-Géo",         prof: "Mme Hemet I.",       moyenne: "11,88", evals: ["Abs","7/10","12,25","5,75/10","13,75","8"] },
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
  },
};

const DEFAULT_DEVOIRS_PAR_CLASSE = {
  "c5f": {
    10: { label: "MARDI 10 MARS", items: [
      { matiere: "MATHEMATIQUES", effectue: false, description: "leçon + Ex 24 et 26 p.159", donne: "Donné le 9 mars par Mme DAVID S." },
      { matiere: "HIST.GEO",      effectue: false, description: "Bien apprendre les cours d'EMC", donne: "Donné le 5 mars par Mme HEMET I." },
      { matiere: "FRANCAIS",      effectue: false, description: "Lire Les Fourberies de Scapin de Molière", donne: "Donné le 13 février par Mme FISCHER N." },
      { matiere: "ANGLAIS LV1",   effectue: false, description: "Vocabulary list p.48 — learn words", donne: "Donné le 6 mars par M. GUELLEC L." },
    ]},
    11: { label: "MERCREDI 11 MARS", items: [
      { matiere: "SCIENCES VIE & TERRE", effectue: false, description: "Evaluation flash: apprendre le tableau des 9 sens\n+ Chercher dans le dictionnaire le sens des mots \"percevoir\" et \"stimulus\".", donne: "Donné le 5 mars par Mme TLICH Z." },
      { matiere: "FRANCAIS",             effectue: false, description: "Choisir une scène à jouer (un personnage)", donne: "Donné le 10 mars par Mme FISCHER N." },
    ]},
    12: { label: "JEUDI 12 MARS", items: [
      { matiere: "FRANCAIS",           effectue: false, description: "Apprendre la tirade du nez (Cyrano de Bergerac)", donne: "Donné le mardi 10 mars par Mme FISCHER N." },
      { matiere: "EDUCATION MUSICALE", effectue: false, description: "Réviser les notes de la gamme de Do", donne: "Donné le dimanche 8 mars par Mme CORNIER C." },
    ]},
    13: { label: "VENDREDI 13 MARS", items: [
      { matiere: "ALLEMAND LV2", effectue: false, description: "Wortschatz Seite 52 lernen", donne: "Donné le mardi 10 mars par Mme BOURGUIGNON A." },
    ]},
  },
};

const DEFAULT_EDT_PAR_CLASSE = {
  "c5f": {
    9:  { label: "Lundi 9",     items: [{ heure: "08:05 - 09:55", matiere: "EPS", prof: "Chapelot B.", salle: "Gym" },{ heure: "10:10 - 11:05", matiere: "Allemand LV2", prof: "Bourguignon A.", salle: "A12" },{ heure: "11:05 - 12:00", matiere: "Arts Plastiques", prof: "Decroix C.", salle: "B08" }] },
    10: { label: "Mardi 10",    items: [{ heure: "08:05 - 09:00", matiere: "Anglais LV1", prof: "Guellec L.", salle: "A04" },{ heure: "09:00 - 09:55", matiere: "Français", prof: "Fischer N.", salle: "B11" },{ heure: "10:10 - 11:05", matiere: "Allemand LV2", prof: "Bourguignon A.", salle: "A12" },{ heure: "11:05 - 12:00", matiere: "Technologie", prof: "Olivares D.", salle: "C03" }] },
    11: { label: "Mercredi 11", items: [{ heure: "08:05 - 09:00", matiere: "Histoire-Géo", prof: "Hemet I.", salle: "A09" },{ heure: "09:00 - 09:55", matiere: "Sciences Vie & Terre", prof: "Tlich Z.", salle: "B06" },{ heure: "10:10 - 11:05", matiere: "Français", prof: "Fischer N.", salle: "B11" }] },
    12: { label: "Jeudi 12",    items: [{ heure: "08:05 - 09:00", matiere: "Français", prof: "Fischer N.", salle: "B11" },{ heure: "09:00 - 09:55", matiere: "Éducation Musicale", prof: "Cornier C.", salle: "D01" },{ heure: "10:10 - 11:05", matiere: "Mathématiques", prof: "David S.", salle: "A07" },{ heure: "11:05 - 12:00", matiere: "Histoire-Géo", prof: "Hemet I.", salle: "A09" }] },
    13: { label: "Vendredi 13", items: [{ heure: "09:00 - 09:55", matiere: "Français", prof: "Fischer N.", salle: "B11" },{ heure: "10:10 - 11:30", matiere: "Physique-Chimie", prof: "Bredel M.", salle: "C07" }] },
    14: { label: "Samedi 14",   items: [] },
  },
};

const DEFAULT_ABSENCES  = { "3": [{ id:"1", date:"Du 5 janv 2026 08:00 au 7 janv 2026 12:00", duree:"5 demi-journées", justifiee:"Oui", motif:"Conditions météorologiques" },{ id:"2", date:"Le 17 nov 2025 — 08:00 à 16:30", duree:"2 demi-journées", justifiee:"Oui", motif:"Maladie" }] };
const DEFAULT_PUNITIONS = {};
const DEFAULT_MESSAGES  = [
  { id:"1", sujet:"Soirée Louanges", auteur:"M. O. Chaput", date:"Mardi 3 mars 2026 — 18:24", lu:false, corps:"Chers jeunes, Chères familles\n\n✨ Laetare : Réjouissez-vous ! ✨\n\nDans 10 jours... nous vivrons le milieu de notre marche vers Pâques !\n\nPour vivre et partager un vendredi soir pas comme les autres...\nnous vous convions à notre prochaine Soirée Louange !\n\n📅 Vendredi 13 mars 2026" },
  { id:"2", sujet:"Nouvelles évaluations", auteur:"Mme David S.", date:"Lundi 2 mars 2026", lu:true, corps:"Bonjour,\n\nDe nouvelles évaluations ont été ajoutées en Mathématiques.\n\nCordialement,\nMme David S." },
  { id:"3", sujet:"Partenariat Librairie Colbert", auteur:"Direction", date:"Lundi 2 mars 2026", lu:true, corps:"Chers parents,\n\nNous avons le plaisir de vous annoncer notre nouveau partenariat avec la Librairie Colbert.\n\nCordialement,\nLa Direction" },
];

// ─── HELPERS ────────────────────────────────────────────────────
function parseVal(v) {
  const s = String(v).replace(",", ".");
  const m = s.match(/^([\d.]+)\/([\d.]+)$/);
  if (m) return (parseFloat(m[1]) / parseFloat(m[2])) * 20;
  return parseFloat(s);
}
function calcMoy(evals) {
  const vals = evals.map(parseVal).filter(v => !isNaN(v));
  if (!vals.length) return "—";
  return (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(2).replace(".",",");
}

// ─── PROVIDER ───────────────────────────────────────────────────
export function DataProvider({ children }) {
  const [classes,     setClasses]     = useState(()=>load("ed_classes",     DEFAULT_CLASSES));
  const [notesPE,     setNotesPE]     = useState(()=>load("ed_notes_pe",    DEFAULT_NOTES_PAR_ELEVE));
  const [devoirsPC,   setDevoirsPC]   = useState(()=>load("ed_devoirs_pc",  DEFAULT_DEVOIRS_PAR_CLASSE));
  const [edtPC,       setEdtPC]       = useState(()=>load("ed_edt_pc",      DEFAULT_EDT_PAR_CLASSE));
  const [absencesPE,  setAbsencesPE]  = useState(()=>load("ed_absences_pe", DEFAULT_ABSENCES));
  const [punitionsPE, setPunitionsPE] = useState(()=>load("ed_punitions_pe",DEFAULT_PUNITIONS));
  const [messages,    setMessages]    = useState(()=>load("ed_messages",     DEFAULT_MESSAGES));

  useEffect(()=>{localStorage.setItem("ed_classes",     JSON.stringify(classes))},     [classes]);
  useEffect(()=>{localStorage.setItem("ed_notes_pe",    JSON.stringify(notesPE))},     [notesPE]);
  useEffect(()=>{localStorage.setItem("ed_devoirs_pc",  JSON.stringify(devoirsPC))},   [devoirsPC]);
  useEffect(()=>{localStorage.setItem("ed_edt_pc",      JSON.stringify(edtPC))},       [edtPC]);
  useEffect(()=>{localStorage.setItem("ed_absences_pe", JSON.stringify(absencesPE))},  [absencesPE]);
  useEffect(()=>{localStorage.setItem("ed_punitions_pe",JSON.stringify(punitionsPE))}, [punitionsPE]);
  useEffect(()=>{localStorage.setItem("ed_messages",    JSON.stringify(messages))},    [messages]);

  // ── CLASSES ──
  function addClass(nom, niveau) {
    const id = "c"+Date.now();
    setClasses(p=>({...p,[id]:{id,nom,niveau}}));
    return id;
  }
  function updateClass(id,updates){ setClasses(p=>({...p,[id]:{...p[id],...updates}})); }
  function deleteClass(id){ setClasses(p=>{const n={...p};delete n[id];return n;}); }

  // ── NOTES PAR ÉLÈVE ──
  function getNotesEleve(eleveId,releveId){ return notesPE[eleveId]?.[releveId]||null; }

  function addNoteEleve(eleveId,releveId,matiere,valeur,profLabel){
    setNotesPE(prev=>{
      const ed=prev[eleveId]||{};
      const rel=ed[releveId]||{conseil:"",notes:[],competences:[]};
      let notes=rel.notes;
      if(notes.find(n=>n.matiere===matiere)){
        notes=notes.map(n=>{
          if(n.matiere!==matiere)return n;
          const ev=[...n.evals,String(valeur)];
          return{...n,evals:ev,moyenne:calcMoy(ev)};
        });
      } else {
        notes=[...notes,{matiere,prof:profLabel||"",evals:[String(valeur)],moyenne:calcMoy([String(valeur)])}];
      }
      return{...prev,[eleveId]:{...ed,[releveId]:{...rel,notes}}};
    });
  }

  function removeNoteEleve(eleveId,releveId,matiere,idx){
    setNotesPE(prev=>{
      const rel=prev[eleveId]?.[releveId]; if(!rel)return prev;
      const notes=rel.notes.map(n=>{
        if(n.matiere!==matiere)return n;
        const ev=n.evals.filter((_,i)=>i!==idx);
        return{...n,evals:ev,moyenne:calcMoy(ev)};
      });
      return{...prev,[eleveId]:{...prev[eleveId],[releveId]:{...rel,notes}}};
    });
  }

  // Calcule stats de classe: { [matiere]: { moyenneClasse, min, max } }
  function computeClassStats(eleveIds,releveId){
    const map={};
    eleveIds.forEach(eid=>{
      const rel=notesPE[eid]?.[releveId]; if(!rel)return;
      rel.notes.forEach(n=>{
        const v=parseFloat(n.moyenne.replace(",",".")); if(isNaN(v))return;
        if(!map[n.matiere])map[n.matiere]=[];
        map[n.matiere].push(v);
      });
    });
    const res={};
    Object.entries(map).forEach(([mat,vals])=>{
      res[mat]={
        moyenneClasse:(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(2).replace(".",","),
        min:Math.min(...vals).toFixed(2).replace(".",","),
        max:Math.max(...vals).toFixed(2).replace(".",","),
      };
    });
    return res;
  }

  // ── DEVOIRS PAR CLASSE ──
  function getDevoirsClasse(cid){ return devoirsPC[cid]||{}; }
  function addDevoirClasse(cid,day,label,item){
    setDevoirsPC(p=>{
      const cd=p[cid]||{};
      const dd=cd[day]||{label,items:[]};
      return{...p,[cid]:{...cd,[day]:{...dd,items:[...dd.items,item]}}};
    });
  }
  function removeDevoirClasse(cid,day,idx){
    setDevoirsPC(p=>{
      const cd=p[cid]||{};const dd=cd[day];if(!dd)return p;
      return{...p,[cid]:{...cd,[day]:{...dd,items:dd.items.filter((_,i)=>i!==idx)}}};
    });
  }
  function updateDevoirEffectue(cid,day,idx,val){
    setDevoirsPC(p=>{
      const cd=p[cid]||{};const dd=cd[day];if(!dd)return p;
      const items=dd.items.map((it,i)=>i===idx?{...it,effectue:val}:it);
      return{...p,[cid]:{...cd,[day]:{...dd,items}}};
    });
  }

  // ── EDT PAR CLASSE ──
  function getEdtClasse(cid){ return edtPC[cid]||{}; }
  function addEdtItem(cid,day,label,item){
    setEdtPC(p=>{
      const ce=p[cid]||{};
      const dd=ce[day]||{label,items:[]};
      const items=[...dd.items,item].sort((a,b)=>a.heure.localeCompare(b.heure));
      return{...p,[cid]:{...ce,[day]:{...dd,items}}};
    });
  }
  function removeEdtItem(cid,day,idx){
    setEdtPC(p=>{
      const ce=p[cid]||{};const dd=ce[day];if(!dd)return p;
      return{...p,[cid]:{...ce,[day]:{...dd,items:dd.items.filter((_,i)=>i!==idx)}}};
    });
  }

  // ── ABSENCES / PUNITIONS ──
  function getAbsencesEleve(eid){ return absencesPE[eid]||[]; }
  function getPunitionsEleve(eid){ return punitionsPE[eid]||[]; }
  function addAbsence(eid,a){ setAbsencesPE(p=>({...p,[eid]:[...(p[eid]||[]),{...a,id:Date.now().toString()}]})); }
  function removeAbsence(eid,id){ setAbsencesPE(p=>({...p,[eid]:(p[eid]||[]).filter(a=>a.id!==id)})); }
  function addPunition(eid,a){ setPunitionsPE(p=>({...p,[eid]:[...(p[eid]||[]),{...a,id:Date.now().toString()}]})); }
  function removePunition(eid,id){ setPunitionsPE(p=>({...p,[eid]:(p[eid]||[]).filter(a=>a.id!==id)})); }

  // ── MESSAGES ──
  function sendMessage(msg){ setMessages(p=>[{...msg,id:Date.now().toString(),lu:false},...p]); }
  function markRead(id){ setMessages(p=>p.map(m=>m.id===id?{...m,lu:true}:m)); }
  function deleteMessage(id){ setMessages(p=>p.filter(m=>m.id!==id)); }

  return (
    <DataContext.Provider value={{
      classes, addClass, updateClass, deleteClass,
      getNotesEleve, addNoteEleve, removeNoteEleve, computeClassStats,
      getDevoirsClasse, addDevoirClasse, removeDevoirClasse, updateDevoirEffectue,
      getEdtClasse, addEdtItem, removeEdtItem,
      getAbsencesEleve, getPunitionsEleve, addAbsence, removeAbsence, addPunition, removePunition,
      messages, sendMessage, markRead, deleteMessage,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData(){ return useContext(DataContext); }
