import { useState } from "react"

// ─── COULEURS ─────────────────────────────────────────────────────────────────
const C = {
  pr: "#1e73be", dk: "#0f2d5e", mu: "#64748b", tx: "#1e293b",
  bd: "#dbe4f3", wh: "#fff", bg: "#f0f4fb",
  ok: "#22c55e", er: "#ef4444", wa: "#f59e0b",
  adm: "#0f172a", admSf: "#1e293b", admAc: "#f97316",
}
const DC = { b: "#1e73be", y: "#f59e0b", g: "#22c55e", r: "#ef4444" }
const NIV = ["Non atteints", "Partiellement atteints", "Atteints", "Dépassés"]
const NC = { "Non atteints": "#ef4444", "Partiellement atteints": "#f59e0b", "Atteints": "#22c55e", "Dépassés": "#1e73be" }
const gc = n => n >= 16 ? C.ok : n >= 12 ? C.pr : n >= 10 ? C.wa : C.er
const toMin = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m }

// ─── DONNÉES ──────────────────────────────────────────────────────────────────
const MD = [
  { id: 1, mat: "FRANCAIS", prof: "Mme FISCHER N.", coef: 1, moy: 14.7, evals: [
    { t: "Dictée", type: "Contrôle écrit", date: "5 jan 2026", n: 6.5, b: 10, c: 1, d: "y", min: 3, max: 9.5, cm: 6.1, comps: [{ nom: "Orthographe", desc: "Respecter les règles orthographiques et grammaticales", niv: "Partiellement atteints" }] },
    { t: "Commentaire", type: "Devoir maison", date: "23 jan 2026", n: 15, b: 20, c: 1, d: "b", min: 8, max: 18, cm: 13.2, comps: [{ nom: "Lire et comprendre", desc: "Analyser un texte littéraire avec pertinence", niv: "Atteints" }] },
    { t: "Expression écrite", type: "Contrôle écrit", date: "9 fév 2026", n: 15, b: 20, c: 1, d: "by", min: 7, max: 18.5, cm: 13.8, comps: [] },
    { t: "Versification", type: "Interrogation", date: "1 déc 2025", n: 6.5, b: 10, c: 1, d: "y", min: 4, max: 10, cm: 8.77, comps: [{ nom: "Fonctionnement de la langue", desc: "Construire les notions permettant l'analyse et l'élaboration des textes", niv: "Partiellement atteints" }] },
    { t: "Lecture linéaire", type: "Interrogation", date: "11 mar 2026", n: 17, b: 20, c: 1, d: "b", min: 10, max: 20, cm: 15.3, comps: [{ nom: "Analyser un texte", desc: "Identifier les procédés littéraires avec précision", niv: "Dépassés" }] },
  ]},
  { id: 2, mat: "MATHEMATIQUES", prof: "Mme DAVID S.", coef: 1, moy: 15.58, evals: [
    { t: "Calcul littéral", type: "Contrôle écrit", date: "7 jan 2026", n: 17, b: 20, c: 1, d: "b", min: 6, max: 20, cm: 13.4, comps: [{ nom: "Calculer", desc: "Développer et factoriser des expressions algébriques", niv: "Dépassés" }] },
    { t: "Statistiques", type: "Contrôle écrit", date: "6 fév 2026", n: 18.5, b: 20, c: 0.5, d: "b", min: 9, max: 20, cm: 15.1, comps: [] },
    { t: "Fractions", type: "Interrogation", date: "25 fév 2026", n: 8.5, b: 10, c: 0.5, d: "b", min: 3, max: 10, cm: 6.8, comps: [] },
    { t: "Géométrie", type: "Contrôle écrit", date: "2 mar 2026", n: 12, b: 20, c: 1, d: "b", min: 5, max: 20, cm: 11.2, comps: [{ nom: "Raisonner", desc: "Démontrer des propriétés sur les triangles et quadrilatères", niv: "Partiellement atteints" }] },
    { t: "Devoir commun", type: "Devoir commun", date: "4 mar 2026", n: 1, b: 2, c: 0.25, d: "b", min: 0.5, max: 2, cm: 1.4, comps: [] },
    { t: "Bilan", type: "Contrôle écrit", date: "6 mar 2026", n: 13, b: 20, c: 2, d: "b", min: 6, max: 20, cm: 12.1, comps: [{ nom: "Résoudre des problèmes", desc: "Mobiliser ses connaissances en situation complexe", niv: "Atteints" }] },
  ]},
  { id: 3, mat: "ANGLAIS LV1", prof: "M. GUELLEC L.", coef: 1, moy: 17.5, evals: [
    { t: "Compréhension", type: "Contrôle écrit", date: "12 jan 2026", n: 16, b: 20, c: 1, d: "b", min: 8, max: 20, cm: 13.5, comps: [] },
    { t: "Vocabulaire", type: "Interrogation", date: "28 jan 2026", n: 8, b: 10, c: 0.5, d: "b", min: 4, max: 10, cm: 7.2, comps: [] },
    { t: "IT'S BREAKFAST TIME", type: "Interrogation", date: "18 fév 2026", n: 18.5, b: 20, c: 1, d: "b", min: 10, max: 20, cm: 15.6, comps: [{ nom: "Réagir et dialoguer", desc: "Interagir avec aisance dans des situations courtes", niv: "Atteints" }] },
    { t: "Grammaire", type: "Contrôle écrit", date: "2 mar 2026", n: 15, b: 20, c: 1, d: "b", min: 7, max: 20, cm: 13.8, comps: [] },
    { t: "Listening", type: "Contrôle écrit", date: "6 mar 2026", n: 20, b: 20, c: 1, d: "b", min: 10, max: 20, cm: 16.2, comps: [{ nom: "Écouter et comprendre", desc: "Comprendre un message oral en anglais courant", niv: "Dépassés" }] },
    { t: "Dictée", type: "Contrôle écrit", date: "11 mar 2026", n: 10, b: 10, c: 0.5, d: "g", min: 5, max: 10, cm: 7.9, comps: [] },
  ]},
  { id: 4, mat: "ED.PHYSIQUE & SPORT.", prof: "M. CHAPELOT B.", coef: 1, moy: 13.33, evals: [
    { t: "Course endurance", type: "Éval pratique", date: "19 jan 2026", n: 12.5, b: 20, c: 2, d: "y", min: 8, max: 18, cm: 13.1, comps: [{ nom: "S'engager", desc: "Fournir un effort prolongé en course d'endurance", niv: "Partiellement atteints" }] },
    { t: "Basket", type: "Éval pratique", date: "27 fév 2026", n: 15, b: 20, c: 1, d: "b", min: 9, max: 20, cm: 13.6, comps: [] },
    { t: "Natation", type: "Éval pratique", date: "6 mar 2026", n: 15, b: 20, c: 1, d: "b", min: 8, max: 20, cm: 14.2, comps: [] },
    { t: "Résultat collectif", type: "Résultat collectif", date: "27 fév 2026", n: 15, b: 20, c: 1, d: "b", min: 9, max: 20, cm: 13.6, comps: [] },
  ]},
  { id: 5, mat: "ARTS PLASTIQUES", prof: "Mme DECROIX C.", coef: 1, moy: 15, evals: [
    { t: "Ombre et lumière", type: "Production", date: "26 jan 2026", n: 15, b: 20, c: 2, d: "b", min: 8, max: 20, cm: 13.4, comps: [{ nom: "Expérimenter", desc: "Utiliser les effets de la lumière dans une composition", niv: "Atteints" }] },
    { t: "Portrait expressif", type: "Production", date: "6 mar 2026", n: 16, b: 20, c: 2, d: "b", min: 9, max: 20, cm: 14.2, comps: [] },
  ]},
  { id: 6, mat: "EDUCATION MUSICALE", prof: "Mme CORNIER C.", coef: 1, moy: 16.5, evals: [
    { t: "Chant choral", type: "Éval pratique", date: "9 fév 2026", n: 4.5, b: 5, c: 1, d: "b", min: 2, max: 5, cm: 3.8, comps: [{ nom: "Chanter", desc: "Interpréter un chant en groupe avec justesse", niv: "Atteints" }] },
    { t: "Culture musicale", type: "Contrôle écrit", date: "6 mar 2026", n: 15, b: 20, c: 1, d: "b", min: 8, max: 20, cm: 13.5, comps: [] },
  ]},
  { id: 7, mat: "PHYSIQUE-CHIMIE", prof: "Mme BREDEL M.", coef: 1, moy: 19.33, evals: [
    { t: "Transformations chimiques", type: "Contrôle écrit", date: "14 jan 2026", n: 19, b: 20, c: 1, d: "g", min: 10, max: 20, cm: 15.8, comps: [{ nom: "Réactions chimiques", desc: "Identifier les réactifs et produits d'une transformation", niv: "Dépassés" }] },
    { t: "Électricité TP", type: "TP noté", date: "9 fév 2026", n: 15, b: 15, c: 0.5, d: "g", min: 8, max: 15, cm: 12.3, comps: [] },
    { t: "Bilan séquence", type: "Contrôle écrit", date: "6 mar 2026", n: 14.75, b: 20, c: 1, d: "b", min: 7, max: 20, cm: 13.1, comps: [] },
  ]},
  { id: 8, mat: "SCIENCES VIE & TERRE", prof: "Mme TLICH Z.", coef: 1, moy: null, evals: [
    { t: "La cellule", type: "Contrôle écrit", date: "19 jan 2026", n: 11.5, b: 15, c: 1, d: "g", min: 5, max: 15, cm: 10.2, comps: [] },
    { t: "Digestion", type: "Interrogation", date: "6 fév 2026", n: 7, b: 10, c: 2, d: "b", min: 3, max: 10, cm: 6.5, comps: [] },
    { t: "Respiration", type: "Contrôle écrit", date: "6 mar 2026", n: 9, b: 10, c: 2, d: "g", min: 4, max: 10, cm: 7.8, comps: [] },
  ]},
  { id: 9, mat: "TECHNOLOGIE", prof: "M. OLIVARES D.", coef: 1, moy: 19.67, evals: [
    { t: "Programmation Scratch", type: "TP noté", date: "26 jan 2026", n: 20, b: 20, c: 2, d: "g", min: 12, max: 20, cm: 17.4, comps: [{ nom: "Programmer", desc: "Créer un algorithme simple avec Scratch", niv: "Dépassés" }] },
    { t: "Projet objet connecté", type: "Projet", date: "6 mar 2026", n: 19, b: 20, c: 1, d: "g", min: 13, max: 20, cm: 17.9, comps: [] },
  ]},
  { id: 10, mat: "LCA LATIN", prof: "Mme LANGLOIS S.", coef: 1, moy: 18.5, evals: [
    { t: "Déclinaisons", type: "Interrogation", date: "12 jan 2026", n: 7, b: 10, c: 1, d: "b", min: 3, max: 10, cm: 6.2, comps: [] },
    { t: "Traduction César", type: "Contrôle écrit", date: "4 fév 2026", n: 10, b: 10, c: 2, d: "b", min: 5, max: 10, cm: 7.8, comps: [] },
    { t: "Vocabulaire latin", type: "Interrogation", date: "2 mar 2026", n: 10, b: 10, c: 1, d: "b", min: 4, max: 10, cm: 7.1, comps: [] },
    { t: "Civilisation", type: "Contrôle écrit", date: "6 mar 2026", n: 9, b: 10, c: 1, d: "b", min: 4, max: 10, cm: 7.4, comps: [] },
  ]},
  { id: 11, mat: "ALLEMAND LV2", prof: "Mme BOURGUIGNON A.", coef: 1, moy: 14.17, evals: [
    { t: "Vocabulaire", type: "Interrogation", date: "12 jan 2026", n: 10.5, b: 20, c: 0.5, d: "y", min: 5, max: 20, cm: 11.2, comps: [] },
    { t: "Expression écrite", type: "Contrôle écrit", date: "30 jan 2026", n: 16, b: 20, c: 1, d: "g", min: 8, max: 20, cm: 13.4, comps: [{ nom: "Écrire en allemand", desc: "Produire un texte simple et cohérent", niv: "Atteints" }] },
    { t: "Compréhension", type: "Contrôle écrit", date: "13 fév 2026", n: 8.5, b: 10, c: 1, d: "g", min: 4, max: 10, cm: 6.9, comps: [] },
    { t: "Oral", type: "Interro orale", date: "2 mar 2026", n: 8.5, b: 10, c: 1, d: "g", min: 4, max: 10, cm: 7.1, comps: [] },
    { t: "Bilan lexical", type: "Contrôle écrit", date: "4 mar 2026", n: 18.5, b: 20, c: 1, d: "g", min: 9, max: 20, cm: 14.8, comps: [] },
    { t: "Dictée", type: "Contrôle écrit", date: "6 mar 2026", n: 5, b: 5, c: 1, d: "g", min: 2, max: 5, cm: 3.9, comps: [] },
  ]},
  { id: 12, mat: "HIST.GEO.EN.MOR.CIVIQUE", prof: "Mme HEMET I.", coef: 1, moy: 11.88, evals: [
    { t: "Révolution française", type: "Contrôle écrit", date: "5 jan 2026", n: null, abs: true, b: 20, c: 1, d: "r", min: 5, max: 20, cm: 12.4, comps: [] },
    { t: "Croquis géographique", type: "Contrôle écrit", date: "23 jan 2026", n: 7.75, b: 10, c: 0.5, d: "b", min: 3, max: 10, cm: 6.9, comps: [{ nom: "Réaliser un croquis", desc: "Représenter une organisation spatiale avec légende", niv: "Partiellement atteints" }] },
    { t: "Dissertation", type: "Devoir maison", date: "2 mar 2026", n: 12.25, b: 20, c: 0.5, d: "y", min: 7, max: 19, cm: 13.1, comps: [] },
    { t: "EMC", type: "Interrogation", date: "6 mar 2026", n: 5.75, b: 10, c: 0.5, d: "y", min: 2, max: 10, cm: 6.4, comps: [] },
    { t: "Bilan séquence", type: "Contrôle écrit", date: "11 mar 2026", n: 13.75, b: 20, c: 1, d: "b", min: 6, max: 20, cm: 12.8, comps: [] },
    { t: "Carte mentale", type: "Travail perso", date: "13 mar 2026", n: 8, b: 20, c: 1, d: "b", min: 4, max: 20, cm: 10.3, comps: [] },
  ]},
]

const INIT_DEVOIRS = [
  { id: 1, mat: "THEATRE", prof: "M. GUELLEC L.", desc: "Evaluation Verbes Irréguliers: 15 de ton choix en dehors de 15 verbes déjà évalués.", date: "2026-03-09", ok: true, donne: "6 mars" },
  { id: 2, mat: "ANGLAIS LV1", prof: "M. GUELLEC L.", desc: "Apprendre le vocabulaire Unit 8 pages 45-46. Revoir les formes du prétérit irrégulier.", date: "2026-03-10", ok: false, donne: "8 mars", taf: true },
  { id: 3, mat: "MATHEMATIQUES", prof: "Mme DAVID S.", desc: "Exercices 5, 6, 7 page 124 — Chapitre statistiques. Calculer moyenne et médiane.", date: "2026-03-10", ok: false, donne: "9 mars", taf: true },
  { id: 4, mat: "FRANCAIS", prof: "Mme FISCHER N.", desc: "Lire le chapitre 6 de Germinal. Répondre aux questions de compréhension p.87.", date: "2026-03-11", ok: true, donne: "9 mars" },
  { id: 5, mat: "HISTOIRE-GEO", prof: "Mme HEMET I.", desc: "Fiche de révision sur la Révolution française (dates clés, personnages, événements).", date: "2026-03-12", ok: false, donne: "10 mars", taf: true },
  { id: 6, mat: "PHYSIQUE-CHIMIE", prof: "Mme BREDEL M.", desc: "Compte rendu du TP sur les circuits électriques. Schéma à compléter + questions.", date: "2026-03-13", ok: false, donne: "11 mars" },
]

const INIT_MSGS = [
  { id: 1, sujet: "Réunion parents-professeurs", corps: "Bonjour, la réunion parents-professeurs aura lieu le vendredi 22 mars à 18h00 dans la salle polyvalente. Votre présence est souhaitée.", date: "07/03/2026", lu: false, imp: true },
  { id: 2, sujet: "Sortie scolaire — Musée d'Orsay", corps: "La sortie scolaire au Musée d'Orsay est confirmée pour le 25 mars. Le départ sera à 8h30 devant l'établissement. Merci de signer l'autorisation parentale.", date: "05/03/2026", lu: true, imp: false },
]

const EDT = [
  { j: "Lun", h: "08:05", f: "09:55", m: "ED.PHYSIQUE & SPORT.", p: "CHAPELOT B.", c: "#c084fc" },
  { j: "Lun", h: "10:10", f: "11:05", m: "ALLEMAND LV2", p: "BOURGUIGNON A.", c: "#fcd34d" },
  { j: "Lun", h: "11:05", f: "12:00", m: "ARTS PLASTIQUES", p: "DECROIX C.", c: "#6ee7b7", al: true },
  { j: "Mar", h: "08:05", f: "09:00", m: "ANGLAIS LV1", p: "GUELLEC L.", c: "#fcd34d" },
  { j: "Mar", h: "09:00", f: "09:55", m: "FRANCAIS", p: "FISCHER N.", c: "#93c5fd" },
  { j: "Mar", h: "10:10", f: "11:05", m: "ALLEMAND LV2", p: "BOURGUIGNON A.", c: "#fcd34d" },
  { j: "Mar", h: "11:05", f: "11:30", m: "EDUCATION MUSICALE", p: "CORNIER C.", c: "#93c5fd", tag: "E" },
  { j: "Mar", h: "11:30", f: "12:00", m: "CANTINE", p: "", c: "#94a3b8" },
  { j: "Mer", h: "08:05", f: "09:00", m: "KT", p: "HEMET I.", c: "#86efac" },
  { j: "Mer", h: "09:00", f: "09:55", m: "SCIENCES VIE & TERRE", p: "TLICH Z.", c: "#86efac" },
  { j: "Mer", h: "10:10", f: "11:05", m: "FRANCAIS", p: "FISCHER N.", c: "#93c5fd" },
  { j: "Mer", h: "11:05", f: "12:00", m: "ED.PHYSIQUE & SPORT.", p: "CHAPELOT B.", c: "#c084fc" },
  { j: "Jeu", h: "08:05", f: "09:00", m: "FRANCAIS", p: "FISCHER N.", c: "#93c5fd" },
  { j: "Jeu", h: "09:00", f: "09:55", m: "EDUCATION MUSICALE", p: "CORNIER C.", c: "#93c5fd" },
  { j: "Jeu", h: "10:10", f: "11:05", m: "MATHEMATIQUES", p: "DAVID S.", c: "#f9a8d4" },
  { j: "Jeu", h: "11:05", f: "12:00", m: "HIST.GEO", p: "HEMET I.", c: "#94a3b8" },
  { j: "Ven", h: "08:05", f: "09:00", m: "EMI", p: "HENNETIER H.", c: "#94a3b8" },
  { j: "Ven", h: "09:00", f: "09:55", m: "FRANCAIS", p: "FISCHER N.", c: "#93c5fd" },
  { j: "Ven", h: "10:10", f: "11:30", m: "PHYSIQUE-CHIMIE", p: "BREDEL M.", c: "#fca5a5" },
  { j: "Ven", h: "11:30", f: "12:00", m: "CANTINE", p: "", c: "#94a3b8" },
]

const MATIERES_LIST = ["FRANCAIS", "MATHEMATIQUES", "ANGLAIS LV1", "ED.PHYSIQUE & SPORT", "PHYSIQUE-CHIMIE", "TECHNOLOGIE", "HISTOIRE-GEO", "SVT", "ARTS PLASTIQUES", "ALLEMAND LV2", "THEATRE", "EDUCATION MUSICALE", "LCA LATIN"]
const COLORS_EDT = ["#c084fc", "#fcd34d", "#6ee7b7", "#93c5fd", "#86efac", "#f9a8d4", "#fca5a5", "#94a3b8", "#67e8f9", "#fde68a"]
const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
const DATE_LABELS = ["Lun 9 Mar", "Mar 10 Mar", "Mer 11 Mar", "Jeu 12 Mar", "Ven 13 Mar", "Sam 14 Mar", "Dim 15 Mar"]
const HEURES = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

// ─── COMPOSANTS PARTAGÉS ──────────────────────────────────────────────────────
function EvalDot({ d, onClick }) {
  const base = { width: 13, height: 13, borderRadius: "50%", display: "inline-block", cursor: "pointer", verticalAlign: "middle", flexShrink: 0, transition: "transform .15s" }
  if (d === "by") return <span onClick={onClick} style={{ ...base, background: "linear-gradient(135deg,#1e73be 50%,#f59e0b 50%)" }} onMouseEnter={e => e.target.style.transform = "scale(1.5)"} onMouseLeave={e => e.target.style.transform = "scale(1)"} />
  return <span onClick={onClick} style={{ ...base, background: DC[d] || C.pr }} onMouseEnter={e => e.target.style.transform = "scale(1.5)"} onMouseLeave={e => e.target.style.transform = "scale(1)"} />
}

function DetailModal({ ev, onClose }) {
  const pct = ev.abs ? 0 : (ev.n / ev.b) * 100
  const mp = (ev.cm / ev.b) * 100
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.wh, borderRadius: 12, width: 660, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 30px 80px rgba(0,0,0,.3)", fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: C.tx, textTransform: "uppercase", letterSpacing: ".5px" }}>Détail de l'évaluation</span>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: "#f1f5f9", cursor: "pointer", fontSize: 14, color: "#475569" }}>✕</button>
        </div>
        <div style={{ margin: "16px 20px", border: "1.5px solid #c5ddf7", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ background: "#e8f3ff", padding: "8px 14px", borderBottom: "1px solid #c5ddf7" }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: C.pr, textTransform: "uppercase", letterSpacing: ".5px" }}>{ev.t}</span>
          </div>
          <div style={{ padding: "14px 16px" }}>
            {[["Type d'évaluation", ev.type], ["Date", ev.date], ["Note de l'élève", ev.abs ? "Absent" : `${ev.n} / ${ev.b}${ev.c !== 1 ? ` (coef. ${ev.c})` : ""}`], ["Moyenne de la classe", `${ev.cm} / ${ev.b} , Min : ${ev.min} / ${ev.b} , Max : ${ev.max} / ${ev.b}`]].map(([k, v]) => (
              <div key={k} style={{ marginBottom: 6, fontSize: 13 }}><b style={{ color: C.tx }}>{k} : </b><span style={{ color: "#475569" }}>{v}</span></div>
            ))}
            <div style={{ marginTop: 10 }}>
              {[{ l: "Ta note", p: pct, v: ev.abs ? "Abs" : `${ev.n}/${ev.b}`, col: C.pr, bg: "#e0efff" }, { l: "Moyenne classe", p: mp, v: `${ev.cm}/${ev.b}`, col: "#94a3b8", bg: "#f1f5f9" }].map(b => (
                <div key={b.l} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ fontSize: 11, fontWeight: 600, color: b.col }}>{b.l}</span><span style={{ fontSize: 11, fontWeight: 700, color: b.col }}>{b.v}</span></div>
                  <div style={{ height: 9, background: b.bg, borderRadius: 5, overflow: "hidden" }}><div style={{ height: "100%", width: `${b.p}%`, background: b.col, borderRadius: 5, transition: "width .9s ease" }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {ev.comps && ev.comps.length > 0 && (
          <div style={{ margin: "0 20px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: C.pr, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10 }}>Compétences</div>
            <div style={{ border: "1.5px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr repeat(4,80px)", background: C.pr }}>
                <div style={{ height: 90 }} />
                {NIV.map(n => (
                  <div key={n} style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "6px 4px", borderLeft: "1px solid rgba(255,255,255,.2)" }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "white", writingMode: "vertical-rl", transform: "rotate(180deg)", lineHeight: 1.2, textAlign: "center" }}>{n}</span>
                  </div>
                ))}
              </div>
              {ev.comps.map((comp, ci) => (
                <div key={ci} style={{ display: "grid", gridTemplateColumns: "1fr repeat(4,80px)", borderTop: "1px solid #e2e8f0" }}>
                  <div style={{ padding: "10px 12px" }}><div style={{ fontSize: 12, fontWeight: 700, color: C.tx, marginBottom: 2 }}>{comp.nom}</div><div style={{ fontSize: 11, color: C.mu, lineHeight: 1.5 }}>{comp.desc}</div></div>
                  {NIV.map(n => (
                    <div key={n} style={{ borderLeft: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", background: comp.niv === n ? "#f0f9ff" : C.wh }}>
                      {comp.niv === n && <span style={{ width: 14, height: 14, borderRadius: "50%", background: NC[n], display: "inline-block", boxShadow: `0 0 0 3px ${NC[n]}30` }} />}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{ padding: "12px 20px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "8px 22px", background: C.pr, color: "white", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>Fermer</button>
        </div>
      </div>
    </div>
  )
}

// ─── SECTION NOTES ────────────────────────────────────────────────────────────
function Notes({ dark }) {
  const [sel, setSel] = useState(null)
  const [tab, setTab] = useState("Evaluations")
  const [trim, setTrim] = useState(1)
  const tous = MD.flatMap(m => m.evals.filter(e => !e.abs && e.n != null).map(e => ({ n: e.n * e.c, c: e.c })))
  const moy = (tous.reduce((a, e) => a + e.n, 0) / tous.reduce((a, e) => a + e.c, 0)).toFixed(2)
  const rowBg = (i) => dark ? (i % 2 ? C.admSf : "#263347") : (i % 2 ? C.bg : C.wh)
  return (
    <div style={{ flex: 1, overflowY: "auto", background: dark ? C.adm : C.bg, fontFamily: "'Outfit',sans-serif" }}>
      <div style={{ padding: "16px 22px" }}>
        <div style={{ display: "flex", gap: 0, borderBottom: `2px solid ${dark ? "#334155" : C.bd}`, marginBottom: 8, flexWrap: "wrap" }}>
          {["1er Trimestre", "2ème Trimestre", "3ème Trimestre"].map((t, i) => (
            <button key={t} onClick={() => setTrim(i)} style={{ padding: "8px 16px", border: "none", background: "transparent", cursor: "pointer", fontSize: 12, fontWeight: 700, color: trim === i ? C.pr : C.mu, borderBottom: trim === i ? `3px solid ${C.pr}` : "3px solid transparent", fontFamily: "'Outfit',sans-serif" }}>{t}</button>
          ))}
          <div style={{ flex: 1 }} />
          {["Evaluations", "Moyennes", "Compétences"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "5px 11px", border: `1px solid ${dark ? "#334155" : C.bd}`, borderRadius: 5, background: tab === t ? "#e0efff" : "transparent", color: tab === t ? C.pr : C.mu, fontSize: 11, fontWeight: 700, cursor: "pointer", margin: "4px 2px", fontFamily: "'Outfit',sans-serif" }}>{t}</button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: C.mu, fontStyle: "italic", marginBottom: 12 }}>Conseil de classe de <b style={{ fontStyle: "normal", color: dark ? "#f1f5f9" : C.tx }}>CINQUIEME F EUROP.</b> le vendredi 13 mars 2026 à 16:45</div>
        <div style={{ background: dark ? C.admSf : C.wh, borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,.1)", border: `1px solid ${dark ? "#334155" : C.bd}` }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: `linear-gradient(90deg,${C.dk},${C.pr})` }}>
                {["DISCIPLINES", "COEF.", "MOYENNES", "ÉVALUATIONS", ""].map((h, i) => (
                  <th key={i} style={{ padding: "10px 14px", textAlign: i === 1 || i === 2 ? "center" : "left", fontSize: 10, fontWeight: 800, color: "white", letterSpacing: ".5px", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MD.map((m, mi) => (
                <tr key={m.id} style={{ borderBottom: `1px solid ${dark ? "#334155" : C.bd}`, background: rowBg(mi) }}>
                  <td style={{ padding: "9px 14px" }}><div style={{ fontSize: 12, fontWeight: 800, color: dark ? "#f1f5f9" : C.tx }}>{m.mat}</div><div style={{ fontSize: 10, color: C.mu }}>{m.prof}</div></td>
                  <td style={{ padding: "9px 10px", textAlign: "center", fontSize: 12, color: C.mu, fontWeight: 600 }}>{m.coef}</td>
                  <td style={{ padding: "9px 10px", textAlign: "center" }}>
                    {m.moy != null ? <span style={{ fontSize: 14, fontWeight: 900, color: gc(m.moy) }}>{m.moy}</span> : <span style={{ color: C.bd }}>—</span>}
                  </td>
                  <td style={{ padding: "7px 14px" }}>
                    {tab === "Evaluations" && (
                      <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                        {m.evals.map((ev, ei) => (
                          <span key={ei} style={{ display: "inline-flex", alignItems: "center", gap: 2, marginRight: 2 }}>
                            <span onClick={() => setSel(ev)} style={{ fontSize: 12, fontWeight: 700, cursor: "pointer", color: dark ? "#f1f5f9" : C.tx, whiteSpace: "nowrap" }}
                              onMouseEnter={e => e.target.style.color = C.pr} onMouseLeave={e => e.target.style.color = dark ? "#f1f5f9" : C.tx}>
                              {ev.abs ? <span style={{ color: C.er }}>Abs</span> : <>{ev.n}<span style={{ fontSize: 9, color: C.mu }}> /{ev.b}</span>{ev.c !== 1 && <sup style={{ fontSize: 8, color: C.mu }}> ({ev.c})</sup>}</>}
                            </span>
                            <EvalDot d={ev.d} onClick={() => setSel(ev)} />
                          </span>
                        ))}
                      </div>
                    )}
                    {tab === "Moyennes" && m.moy != null && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, maxWidth: 200, height: 8, background: dark ? "#334155" : "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${m.moy / 20 * 100}%`, background: gc(m.moy), borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: dark ? "#f1f5f9" : C.tx }}>{m.moy}/20</span>
                      </div>
                    )}
                    {tab === "Compétences" && (
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {m.evals.flatMap(ev => ev.comps || []).map((comp, ci) => (
                          <span key={ci} style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 20, background: NC[comp.niv] + "20", color: NC[comp.niv], border: `1px solid ${NC[comp.niv]}40` }}>{comp.niv}</span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "0 8px", textAlign: "center" }}><span style={{ fontSize: 13, color: C.pr, cursor: "pointer", opacity: .5 }}>📊</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: C.pr, textTransform: "uppercase", letterSpacing: ".5px" }}>Moyenne Générale</span>
          <span style={{ fontSize: 18, fontWeight: 900, color: C.pr }}>{moy}</span>
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: C.mu, fontStyle: "italic" }}>Moyennes calculées le jeudi 5 mars à 12:03 — Certaines notes ont pu être saisies depuis.</div>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, background: dark ? C.admSf : C.wh, borderRadius: 8, padding: "12px 16px", border: `1px solid ${dark ? "#334155" : C.bd}` }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: dark ? "#f1f5f9" : C.tx, marginBottom: 5 }}>Légende des notes</div>
            {[["note (x)", "Note coeffientée"], ["note /x", "Note sur X"]].map(([k, v]) => <div key={k} style={{ display: "flex", gap: 8, fontSize: 11, color: C.mu, marginBottom: 2 }}><b style={{ width: 55, color: dark ? "#94a3b8" : C.tx }}>{k}</b>{v}</div>)}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: dark ? "#f1f5f9" : C.tx, marginBottom: 5 }}>Légende des compétences</div>
            {Object.entries(NC).map(([k, v]) => <div key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.mu, marginBottom: 2 }}><span style={{ width: 9, height: 9, borderRadius: "50%", background: v, display: "inline-block" }} />{k}</div>)}
          </div>
        </div>
      </div>
      {sel && <DetailModal ev={sel} onClose={() => setSel(null)} />}
    </div>
  )
}

// ─── CALENDRIER MINI ──────────────────────────────────────────────────────────
function CalMini({ sel, onSel, devoirs }) {
  const [mo, setMo] = useState(new Date(2026, 2, 1))
  const dIM = new Date(mo.getFullYear(), mo.getMonth() + 1, 0).getDate()
  const fd = new Date(mo.getFullYear(), mo.getMonth(), 1).getDay()
  const off = fd === 0 ? 6 : fd - 1
  const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
  const dSet = new Set(devoirs.map(d => d.date))
  const [sY, sM, sD] = sel.split("-").map(Number)
  const cells = []; for (let i = 0; i < off; i++) cells.push(null); for (let d = 1; d <= dIM; d++) cells.push(d)
  return (
    <div style={{ background: C.wh, borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,.07)" }}>
      <div style={{ background: C.pr, padding: "9px 13px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => setMo(new Date(mo.getFullYear(), mo.getMonth() - 1, 1))} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 18 }}>‹</button>
        <span style={{ color: "white", fontWeight: 800, fontSize: 13 }}>{MONTHS[mo.getMonth()]} <span style={{ fontWeight: 400 }}>{mo.getFullYear()}</span></span>
        <button onClick={() => setMo(new Date(mo.getFullYear(), mo.getMonth() + 1, 1))} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 18 }}>›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", background: "#e8f3ff", padding: "4px 6px 0" }}>
        {["l.", "m.", "m.", "j.", "v.", "s.", "d."].map((d, i) => <div key={i} style={{ textAlign: "center", fontSize: 9, fontWeight: 700, color: C.pr, padding: "2px 0" }}>{d}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "3px 6px 7px" }}>
        {cells.map((d, i) => {
          if (!d) return <div key={i} />
          const ds = `${mo.getFullYear()}-${String(mo.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
          const isSel = d === sD && mo.getMonth() === sM - 1 && mo.getFullYear() === sY
          const isToday = d === 9 && mo.getMonth() === 2 && mo.getFullYear() === 2026
          const hasDev = dSet.has(ds)
          return (
            <div key={i} style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
              <div onClick={() => onSel(ds)} style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, cursor: "pointer", background: isSel ? C.pr : isToday ? "#e8f3ff" : "transparent", color: isSel ? "white" : isToday ? C.pr : C.tx, fontWeight: isSel || isToday ? 800 : 400, border: isToday && !isSel ? "2px solid #93c5fd" : "2px solid transparent" }}>{d}</div>
              {hasDev && !isSel && <span style={{ width: 4, height: 4, borderRadius: "50%", background: C.pr, display: "block" }} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── CAHIER DE TEXTES ─────────────────────────────────────────────────────────
function Cahier({ devoirs, setDevoirs }) {
  const [sel, setSel] = useState("2026-03-09")
  const WD = [{ l: "Lundi 9", d: "2026-03-09" }, { l: "Mardi 10", d: "2026-03-10" }, { l: "Mercredi 11", d: "2026-03-11" }, { l: "Jeudi 12", d: "2026-03-12" }, { l: "Vendredi 13", d: "2026-03-13" }, { l: "Samedi 14", d: "2026-03-14" }]
  const jour = devoirs.filter(d => d.date === sel)
  const cnt = {}; devoirs.forEach(d => { cnt[d.date] = (cnt[d.date] || 0) + 1 })
  const lbl = WD.find(d => d.d === sel)?.l || ""
  const toggle = id => setDevoirs(devoirs.map(d => d.id === id ? { ...d, ok: !d.ok } : d))
  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", fontFamily: "'Outfit',sans-serif" }}>
      <div style={{ width: 285, padding: "14px 11px", borderRight: `1px solid ${C.bd}`, flexShrink: 0, overflowY: "auto", background: C.wh }}>
        <CalMini sel={sel} onSel={setSel} devoirs={devoirs} />
        <div style={{ marginTop: 14, paddingTop: 13, borderTop: `1px solid ${C.bd}` }}>
          <div style={{ fontSize: 11, color: C.mu, fontWeight: 600, marginBottom: 7 }}>📖 Manuels scolaires</div>
          <div style={{ background: `linear-gradient(135deg,${C.pr},${C.dk})`, borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#c53030", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 900, fontSize: 13, flexShrink: 0 }}>~R</div>
            <div><div style={{ color: "white", fontWeight: 800, fontSize: 12 }}>le Robert</div><div style={{ color: "rgba(255,255,255,.65)", fontSize: 10 }}>DICO EN LIGNE</div></div>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            <input placeholder="Rechercher un mot..." style={{ flex: 1, padding: "7px 9px", border: `1.5px solid ${C.bd}`, borderRadius: 7, fontSize: 12, outline: "none", fontFamily: "'Outfit',sans-serif" }} />
            <button style={{ padding: "7px 10px", background: C.pr, color: "white", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 12 }}>🔍</button>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "0 16px", borderBottom: `2px solid ${C.bd}`, background: C.wh, flexShrink: 0 }}>
          {[["travail", "Travail à faire"], ["contenu", "Contenu du cours"]].map(([k, l], i) => (
            <button key={k} style={{ padding: "9px 16px", border: "none", background: "transparent", cursor: "pointer", fontSize: 12, fontWeight: 700, color: i === 0 ? C.pr : C.mu, borderBottom: i === 0 ? `3px solid ${C.pr}` : "3px solid transparent", fontFamily: "'Outfit',sans-serif" }}>{l}</button>
          ))}
          <div style={{ flex: 1 }} />
          <button style={{ padding: "4px 8px", background: C.wh, border: `1px solid ${C.bd}`, borderRadius: 6, cursor: "pointer", color: C.mu, fontSize: 12, margin: "4px 0" }}>🖨</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", background: "#f8faff" }}>
          <div style={{ textAlign: "center", fontSize: 13, fontWeight: 800, color: C.tx, marginBottom: 16, letterSpacing: ".8px" }}>{lbl.toUpperCase()} MARS</div>
          {jour.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: C.mu }}><div style={{ fontSize: 34, marginBottom: 9 }}>📚</div><div style={{ fontWeight: 600, fontSize: 13 }}>Aucun devoir pour ce jour</div></div>
          ) : jour.map(d => (
            <div key={d.id} style={{ background: C.wh, borderRadius: 10, border: `1px solid ${C.bd}`, marginBottom: 12, overflow: "hidden", borderLeft: `4px solid ${d.ok ? C.ok : C.pr}`, boxShadow: "0 2px 8px rgba(0,0,0,.05)" }}>
              <div style={{ padding: "7px 13px", borderBottom: `1px solid ${C.bd}`, background: d.ok ? "#f0fdf4" : "#f0f7ff" }}>
                <span style={{ fontSize: 12, fontWeight: 900, color: d.ok ? "#16a34a" : C.pr }}>{d.mat}</span>
              </div>
              <div style={{ padding: "12px 14px" }}>
                <label onClick={() => toggle(d.id)} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 8 }}>
                  <div style={{ width: 16, height: 16, borderRadius: 3, border: `2px solid ${d.ok ? C.ok : C.bd}`, background: d.ok ? C.ok : C.wh, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {d.ok && <span style={{ color: "white", fontSize: 10, fontWeight: 900 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: d.ok ? "#16a34a" : C.tx }}>{d.ok ? "Effectué" : "À faire"}</span>
                </label>
                <p style={{ fontSize: 13, color: C.tx, lineHeight: 1.7, marginBottom: 9 }}>{d.desc}</p>
                <div style={{ textAlign: "right", fontSize: 11, color: C.mu, fontStyle: "italic" }}>Donné le {d.donne} par {d.prof}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ width: 24, display: "flex", flexDirection: "column", borderLeft: `1px solid ${C.bd}`, background: C.wh, flexShrink: 0 }}>
        {WD.map(d => {
          const c = cnt[d.d] || 0; const isA = d.d === sel
          return (
            <div key={d.d} onClick={() => setSel(d.d)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative", background: isA ? C.pr : "transparent", borderBottom: `1px solid ${C.bd}`, minHeight: 50 }}>
              <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: 9, fontWeight: isA ? 800 : 600, color: isA ? "white" : C.mu, userSelect: "none" }}>{d.l}</span>
              {c > 0 && !isA && <span style={{ position: "absolute", top: 3, right: 1, width: 12, height: 12, background: C.er, borderRadius: "50%", fontSize: 7, color: "white", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{c}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── EMPLOI DU TEMPS ──────────────────────────────────────────────────────────
function EmploiDuTemps({ edt }) {
  const RH = 56, ST = 7 * 60
  const gt = h => (toMin(h) - ST) / 60 * RH
  const gh = (h1, h2) => (toMin(h2) - toMin(h1)) / 60 * RH
  const TH = (toMin("18:00") - ST) / 60 * RH
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "'Outfit',sans-serif" }}>
      <div style={{ padding: "9px 16px", background: C.wh, borderBottom: `1px solid ${C.bd}`, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", flexShrink: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.tx }}>9 Mar – 15 Mar 2026 <span style={{ color: C.mu, fontWeight: 400 }}>(Semaine 11)</span></span>
        <div style={{ flex: 1 }} />
        <button style={{ padding: "5px 12px", border: `1px solid ${C.bd}`, borderRadius: 6, background: C.wh, cursor: "pointer", fontSize: 12, fontWeight: 700, color: C.pr }}>Aujourd'hui</button>
        <div style={{ display: "flex" }}>{["‹", "›"].map((a, i) => <button key={a} style={{ width: 28, height: 28, border: `1px solid ${C.bd}`, borderRadius: i === 0 ? "5px 0 0 5px" : "0 5px 5px 0", background: C.wh, cursor: "pointer", fontSize: 15, color: C.tx }}>{a}</button>)}</div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", overflowX: "auto" }}>
        <div style={{ minWidth: 780, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "grid", gridTemplateColumns: "48px repeat(7,1fr)", position: "sticky", top: 0, zIndex: 20 }}>
            <div style={{ background: C.wh, borderBottom: `2px solid ${C.pr}`, borderRight: `1px solid ${C.bd}` }} />
            {DATE_LABELS.map((l, i) => <div key={l} style={{ background: i >= 5 ? "#fffde7" : C.wh, borderBottom: `2px solid ${C.pr}`, borderLeft: `1px solid ${C.bd}`, padding: "8px 4px", textAlign: "center", fontSize: 11, fontWeight: 700, color: i >= 5 ? C.mu : C.tx }}>{l}</div>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "48px repeat(7,1fr)" }}>
            <div style={{ borderRight: `1px solid ${C.bd}` }}>
              {HEURES.map(h => <div key={h} style={{ height: RH, borderBottom: `1px solid #f1f5f9`, display: "flex", alignItems: "flex-start", justifyContent: "flex-end", paddingRight: 4, paddingTop: 3, fontSize: 10, color: C.mu, fontWeight: 600 }}>{h}</div>)}
            </div>
            {JOURS.map((j, ji) => {
              const cr = edt.filter(c => c.j === j && c.m)
              return (
                <div key={j} style={{ position: "relative", borderLeft: `1px solid ${C.bd}`, background: ji >= 5 ? "#fffde7" : C.wh, height: TH }}>
                  {HEURES.map((h, hi) => <div key={h} style={{ position: "absolute", top: hi * RH, left: 0, right: 0, borderBottom: `1px solid #f1f5f9`, height: RH, pointerEvents: "none" }} />)}
                  {cr.map((c, ci) => {
                    const top = gt(c.h); const height = Math.max(gh(c.h, c.f), 22)
                    return (
                      <div key={ci} style={{ position: "absolute", left: 2, right: 2, top, height, background: c.c, borderRadius: 5, padding: "3px 5px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.1)", cursor: "pointer", transition: "transform .14s" }}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.025)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                        <div style={{ fontSize: 8, fontWeight: 700, color: "rgba(0,0,0,.6)" }}>{c.h}-{c.f}</div>
                        <div style={{ fontSize: 9, fontWeight: 900, color: "rgba(0,0,0,.8)", lineHeight: 1.2 }}>{c.m}</div>
                        {height > 36 && <div style={{ fontSize: 8, color: "rgba(0,0,0,.6)" }}>{c.p}</div>}
                        {c.tag && <div style={{ position: "absolute", top: 2, right: 2, width: 13, height: 13, borderRadius: "50%", background: "rgba(0,0,0,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 800, color: "white" }}>{c.tag}</div>}
                        {c.al && <span style={{ position: "absolute", top: 2, right: 2, fontSize: 10 }}>⚠</span>}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── MESSAGERIE ───────────────────────────────────────────────────────────────
function Messagerie({ msgs, setMsgs, dark }) {
  const [sel, setSel] = useState(null)
  const mark = m => { if (!m.lu) setMsgs(msgs.map(x => x.id === m.id ? { ...x, lu: true } : x)); setSel(m) }
  const bg = dark ? C.adm : C.wh
  const sf = dark ? C.admSf : C.wh
  const bdc = dark ? "#334155" : C.bd
  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden", fontFamily: "'Outfit',sans-serif" }}>
      <div style={{ width: 300, borderRight: `1px solid ${bdc}`, overflowY: "auto", flexShrink: 0, background: sf }}>
        <div style={{ padding: "11px 14px", background: dark ? "#1e3a5f" : "#e8f3ff", borderBottom: `1px solid ${bdc}`, fontSize: 11, fontWeight: 700, color: C.pr }}>✉ DIRECTION — {msgs.length} message{msgs.length !== 1 ? "s" : ""}</div>
        {msgs.map(m => (
          <div key={m.id} onClick={() => mark(m)} style={{ padding: "12px 14px", cursor: "pointer", borderBottom: `1px solid ${bdc}`, background: sel?.id === m.id ? "#1e3a5f22" : !m.lu ? "#fffde7" : "transparent", borderLeft: sel?.id === m.id ? `3px solid ${C.pr}` : !m.lu ? `3px solid ${C.wa}` : "3px solid transparent" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <div style={{ fontSize: 12, fontWeight: !m.lu ? 800 : 600, color: dark ? "#f1f5f9" : C.tx }}>{m.sujet}</div>
              {m.imp && <span style={{ background: "#fef2f2", color: C.er, fontSize: 9, fontWeight: 800, padding: "2px 5px", borderRadius: 4 }}>!</span>}
            </div>
            <div style={{ fontSize: 11, color: C.mu }}>{m.date}{!m.lu && <span style={{ color: C.wa, marginLeft: 6 }}>● non lu</span>}</div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: "20px", overflowY: "auto", background: bg }}>
        {sel ? (<>
          <div style={{ fontSize: 16, fontWeight: 800, color: dark ? "#f1f5f9" : C.tx, marginBottom: 9 }}>{sel.sujet}</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <span style={{ background: "#e8f3ff", color: C.pr, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>Direction</span>
            <span style={{ fontSize: 12, color: C.mu }}>📅 {sel.date}</span>
            {sel.imp && <span style={{ background: "#fef2f2", color: C.er, fontSize: 12, fontWeight: 700, padding: "3px 9px", borderRadius: 6 }}>⚠ Important</span>}
            <span style={{ fontSize: 12, color: C.ok }}>✓ Lu</span>
          </div>
          <div style={{ height: 1, background: dark ? "#334155" : C.bd, marginBottom: 14 }} />
          <div style={{ fontSize: 14, color: dark ? "#cbd5e1" : C.tx, lineHeight: 1.8 }}>{sel.corps}</div>
        </>) : (
          <div style={{ textAlign: "center", paddingTop: 70, color: C.mu }}><div style={{ fontSize: 42, marginBottom: 10 }}>✉️</div><div style={{ fontSize: 13, fontWeight: 600 }}>Sélectionnez un message</div></div>
        )}
      </div>
    </div>
  )
}

// ─── APP ÉLÈVE ────────────────────────────────────────────────────────────────
function AppEleve({ onLogout, devoirs, setDevoirs, msgs, setMsgs }) {
  const [act, setAct] = useState("dashboard")
  const [edt] = useState(EDT)
  const unread = msgs.filter(m => !m.lu).length
  const ITEMS = [{ id: "dashboard", icon: "⊞" }, { id: "notes", icon: "★" }, { id: "messages", icon: "✉", badge: unread }, { id: "emploi", icon: "▦" }, { id: "devoirs", icon: "✎" }]
  const TITLES = { dashboard: "Tableau de bord", notes: "Notes et Moyennes", devoirs: "Cahier de textes", emploi: "Emploi du temps", messages: "Messagerie" }
  const moy = (MD.reduce((s, m) => s + (m.moy || 0), 0) / MD.filter(m => m.moy != null).length).toFixed(2)
  const taf = devoirs.filter(d => d.taf && !d.ok).length

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", fontFamily: "'Outfit',sans-serif" }}>
      {/* Topbar */}
      <div style={{ background: `linear-gradient(90deg,${C.dk},${C.pr})`, padding: "0 18px", display: "flex", alignItems: "center", height: 44, flexShrink: 0 }}>
        <div style={{ color: "white", fontWeight: 900, fontSize: 13 }}>COLLÈGE PRIVÉ BOBÉE</div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,.13)", borderRadius: 20, padding: "4px 13px" }}>
          <span>👤</span><span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>Mme ALEXANDRA LE CHATELIER</span>
        </div>
      </div>
      <div style={{ background: "#1e3a5f", padding: "0 18px", height: 32, display: "flex", alignItems: "center", flexShrink: 0 }}>
        <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>{TITLES[act]} <span style={{ color: "rgba(255,255,255,.6)", fontWeight: 400 }}>(OCTAVE - CINQUIEME F EUROP.)</span></span>
      </div>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{ width: 58, background: C.dk, display: "flex", flexDirection: "column", alignItems: "center", padding: "6px 0", gap: 2, flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: `linear-gradient(135deg,${C.pr},#f97316)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 2 }}><span style={{ color: "white", fontWeight: 900, fontSize: 14 }}>É</span></div>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#2563d4", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 12, border: "2px solid #3b9eff" }}>OC</div>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,.5)", marginBottom: 2 }}>OCTAVE</div>
          <div style={{ background: C.pr, borderRadius: 6, padding: "2px 6px", marginBottom: 4 }}><div style={{ color: "white", fontWeight: 900, fontSize: 11 }}>18<span style={{ fontSize: 8 }}>/20</span></div></div>
          {ITEMS.map(item => (
            <div key={item.id} onClick={() => setAct(item.id)} style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 9, background: act === item.id ? "rgba(255,255,255,.15)" : "transparent", color: act === item.id ? "white" : "rgba(255,255,255,.5)", fontSize: 16, position: "relative", cursor: "pointer" }}>
              {item.icon}
              {item.badge > 0 && <span style={{ position: "absolute", top: 4, right: 4, minWidth: 13, height: 13, background: C.er, borderRadius: 7, fontSize: 8, color: "white", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 2px" }}>{item.badge}</span>}
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div onClick={onLogout} style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,.4)", fontSize: 16, cursor: "pointer" }}>↩</div>
        </div>
        {/* Contenu */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {act === "dashboard" && (
            <div style={{ flex: 1, overflowY: "auto", padding: "18px", background: C.bg }}>
              <div style={{ background: `linear-gradient(135deg,${C.dk},${C.pr})`, borderRadius: 14, padding: "18px 20px", marginBottom: 14, color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><div style={{ fontSize: 18, fontWeight: 900, marginBottom: 3 }}>Bonjour, Octave 👋</div><div style={{ opacity: .8, fontSize: 13 }}>Collège Privé Bobée — 5ème F EUROP.</div></div>
                <div style={{ fontSize: 40, opacity: .3 }}>🏫</div>
              </div>
              <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
                {[{ l: "Moyenne générale", v: moy, col: C.pr, p: "notes" }, { l: "Devoirs à faire", v: taf, col: taf > 0 ? C.er : C.ok, p: "devoirs" }, { l: "Messages non lus", v: unread, col: unread > 0 ? C.wa : C.ok, p: "messages" }, { l: "Matières", v: MD.length, col: "#8b5cf6" }].map(s => (
                  <div key={s.l} onClick={() => s.p && setAct(s.p)} style={{ flex: 1, minWidth: 120, background: C.wh, borderRadius: 12, padding: "13px 15px", boxShadow: "0 2px 10px rgba(0,0,0,.06)", borderTop: `4px solid ${s.col}`, cursor: s.p ? "pointer" : "default" }}>
                    <div style={{ fontSize: 10, color: C.mu, fontWeight: 700, marginBottom: 4 }}>{s.l.toUpperCase()}</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: s.col }}>{s.v}</div>
                  </div>
                ))}
              </div>
              {unread > 0 && <div onClick={() => setAct("messages")} style={{ background: "#fffde7", border: `1px solid ${C.wa}40`, borderRadius: 10, padding: "11px 15px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 18 }}>📬</span><span style={{ fontSize: 13, fontWeight: 700, color: C.tx }}>{unread} nouveau{unread > 1 ? "x" : ""} message{unread > 1 ? "s" : ""} de la Direction</span>
                <span style={{ marginLeft: "auto", color: C.pr, fontWeight: 700, fontSize: 12 }}>Ouvrir →</span>
              </div>}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: C.wh, borderRadius: 12, padding: "13px 15px", boxShadow: "0 2px 10px rgba(0,0,0,.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 9 }}><span style={{ fontSize: 13, fontWeight: 800, color: C.tx }}>Dernières notes</span><span onClick={() => setAct("notes")} style={{ fontSize: 11, color: C.pr, cursor: "pointer", fontWeight: 700 }}>Voir tout →</span></div>
                  {MD.slice(0, 5).map((m, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: i < 4 ? `1px solid ${C.bd}` : "none" }}>
                      <div style={{ fontSize: 12, color: C.tx, fontWeight: 600 }}>{m.mat}</div>
                      {m.moy != null && <span style={{ background: gc(m.moy), color: "white", borderRadius: 6, padding: "2px 8px", fontSize: 12, fontWeight: 800 }}>{m.moy}</span>}
                    </div>
                  ))}
                </div>
                <div style={{ background: C.wh, borderRadius: 12, padding: "13px 15px", boxShadow: "0 2px 10px rgba(0,0,0,.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 9 }}><span style={{ fontSize: 13, fontWeight: 800, color: C.tx }}>Prochains devoirs</span><span onClick={() => setAct("devoirs")} style={{ fontSize: 11, color: C.pr, cursor: "pointer", fontWeight: 700 }}>Voir tout →</span></div>
                  {devoirs.filter(d => !d.ok).slice(0, 4).map((d, i, arr) => (
                    <div key={i} style={{ padding: "5px 0", borderBottom: i < arr.length - 1 ? `1px solid ${C.bd}` : "none" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.pr, marginBottom: 1 }}>{d.mat}</div>
                      <div style={{ fontSize: 11, color: C.mu, lineHeight: 1.4 }}>{d.desc.slice(0, 55)}...</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {act === "notes" && <Notes />}
          {act === "devoirs" && <Cahier devoirs={devoirs} setDevoirs={setDevoirs} />}
          {act === "emploi" && <EmploiDuTemps edt={edt} />}
          {act === "messages" && <Messagerie msgs={msgs} setMsgs={setMsgs} />}
        </div>
      </div>
    </div>
  )
}

// ─── APP ADMIN ────────────────────────────────────────────────────────────────
function AppAdmin({ onLogout, devoirs, setDevoirs, msgs, setMsgs, users, setUsers, user }) {
  const [act, setAct] = useState("dashboard")
  const [edt, setEdt] = useState(EDT)
  const [newDev, setNewDev] = useState({ mat: MATIERES_LIST[0], prof: "", desc: "", date: "2026-03-09", donne: "", taf: true })
  const [newMsg, setNewMsg] = useState({ sujet: "", corps: "", imp: false })
  const [newSlot, setNewSlot] = useState({ j: "Lun", h: "08:05", f: "09:00", m: MATIERES_LIST[0], p: "", c: COLORS_EDT[0], al: false })
  const [showDevModal, setShowDevModal] = useState(false)
  const [showMsgModal, setShowMsgModal] = useState(false)
  const [showSlotModal, setShowSlotModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [selMsg, setSelMsg] = useState(null)
  const [newUser, setNewUser] = useState({ type: "eleve", login: "", password: "", nom: "", classe: "", parent: "", role: "" })

  const addDev = () => {
    if (!newDev.prof || !newDev.desc) return
    setDevoirs([...devoirs, { ...newDev, id: Date.now(), ok: false }])
    setShowDevModal(false)
    setNewDev({ mat: MATIERES_LIST[0], prof: "", desc: "", date: "2026-03-09", donne: "", taf: true })
  }
  const addMsg = () => {
    if (!newMsg.sujet || !newMsg.corps) return
    const d = new Date(); const dateStr = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`
    setMsgs([{ ...newMsg, id: Date.now(), lu: false, date: dateStr }, ...msgs])
    setShowMsgModal(false)
    setNewMsg({ sujet: "", corps: "", imp: false })
  }
  const addSlot = () => {
    if (!newSlot.p || !newSlot.h || !newSlot.f) return
    setEdt([...edt, { ...newSlot, id: Date.now() }])
    setShowSlotModal(false)
  }
  const delDev = id => setDevoirs(devoirs.filter(d => d.id !== id))
  const delMsg = id => { setMsgs(msgs.filter(m => m.id !== id)); if (selMsg?.id === id) setSelMsg(null) }
  const delSlot = idx => setEdt(edt.filter((_, i) => i !== idx))
  const addUser = () => {
    if (!newUser.login || !newUser.password || !newUser.nom) return
    if (users.find(u => u.login === newUser.login)) return
    setUsers([...users, { ...newUser, id: Date.now() }])
    setShowUserModal(false)
    setNewUser({ type: "eleve", login: "", password: "", nom: "", classe: "", parent: "", role: "" })
  }
  const delUser = id => setUsers(users.filter(u => u.id !== id))

  const ITEMS = [{ id: "dashboard", icon: "⊞", lbl: "Tableau de bord" }, { id: "notes", icon: "★", lbl: "Notes" }, { id: "devoirs", icon: "✎", lbl: "Cahier de textes" }, { id: "emploi", icon: "▦", lbl: "Emploi du temps" }, { id: "messagerie", icon: "✉", lbl: "Messagerie" }, { id: "comptes", icon: "👥", lbl: "Comptes" }]
  const inp = (label, val, set, ph = "", type = "text") => (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 4 }}>{label}</label>
      <input type={type} value={val} onChange={e => set(e.target.value)} placeholder={ph} style={{ width: "100%", background: C.adm, border: "1.5px solid #334155", borderRadius: 7, padding: "9px 11px", color: "#f1f5f9", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'Outfit',sans-serif" }} />
    </div>
  )
  const selEl = (label, val, set, options) => (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 4 }}>{label}</label>
      <select value={val} onChange={e => set(e.target.value)} style={{ width: "100%", background: C.adm, border: "1.5px solid #334155", borderRadius: 7, padding: "9px 11px", color: "#f1f5f9", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'Outfit',sans-serif" }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
  const Mdl = ({ title, onClose, children }) => (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.admSf, borderRadius: 14, padding: 22, width: 500, maxHeight: "88vh", overflowY: "auto", border: "1px solid #334155", boxShadow: "0 30px 80px rgba(0,0,0,.5)", fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#f1f5f9" }}>{title}</div>
          <div onClick={onClose} style={{ cursor: "pointer", color: "#94a3b8", fontSize: 18 }}>✕</div>
        </div>
        {children}
      </div>
    </div>
  )

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "'Outfit',sans-serif" }}>
      {/* Sidebar admin */}
      <div style={{ width: 210, background: "#0a1628", display: "flex", flexDirection: "column", borderRight: "1px solid #1e293b", flexShrink: 0 }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg,${C.admAc},#f59e0b)`, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "white", fontWeight: 900, fontSize: 14 }}>A</span></div>
          <div><div style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 13 }}>Admin Panel</div><div style={{ color: "#64748b", fontSize: 11 }}>École Direct</div></div>
        </div>
        <div style={{ padding: "10px 9px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${C.admAc},#f59e0b)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 12 }}>{(user?.nom||"A")[0]}</div>
          <div><div style={{ color: "#f1f5f9", fontSize: 12, fontWeight: 700 }}>{user?.role||"Admin"}</div><div style={{ color: "#64748b", fontSize: 10 }}>{user?.nom||""}</div></div>
        </div>
        <nav style={{ flex: 1, padding: "9px 7px" }}>
          {ITEMS.map(item => (
            <div key={item.id} onClick={() => setAct(item.id)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 11px", borderRadius: 9, cursor: "pointer", marginBottom: 2, background: act === item.id ? C.admAc + "22" : "transparent", color: act === item.id ? C.admAc : "#64748b", fontWeight: act === item.id ? 700 : 400, fontSize: 13, borderLeft: act === item.id ? `3px solid ${C.admAc}` : "3px solid transparent" }}>
              <span style={{ fontSize: 14, width: 16, textAlign: "center" }}>{item.icon}</span>{item.lbl}
            </div>
          ))}
        </nav>
        <div style={{ padding: "10px 7px", borderTop: "1px solid #1e293b" }}>
          <div onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 11px", borderRadius: 9, cursor: "pointer", color: "#64748b", fontSize: 12 }}>↩ Déconnexion</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "12px 24px", background: C.admSf, borderBottom: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>{ITEMS.find(i => i.id === act)?.lbl}</div>
          <div style={{ fontSize: 11, color: "#64748b", border: "1px solid #334155", borderRadius: 20, padding: "3px 12px" }}>Collège Privé Bobée — 5ème F EUROP.</div>
        </div>
        <div style={{ flex: 1, display: "flex", overflow: "hidden", background: C.adm }}>
          {/* Dashboard */}
          {act === "dashboard" && (
            <div style={{ flex: 1, overflowY: "auto", padding: "22px 26px" }}>
              <div style={{ marginBottom: 20 }}><div style={{ fontSize: 19, fontWeight: 900, color: "#f1f5f9", marginBottom: 3 }}>Bonjour, {user?.nom||"Admin"} 👋</div><div style={{ fontSize: 13, color: "#64748b" }}>Panneau d'administration — Collège Privé Bobée</div></div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 13, marginBottom: 20 }}>
                {[{ l: "Notes enregistrées", v: MD.reduce((a, m) => a + m.evals.length, 0), c: "#3b82f6" }, { l: "Devoirs publiés", v: devoirs.length, c: C.ok }, { l: "Messages envoyés", v: msgs.length, c: C.admAc }, { l: "Matières", v: MD.length, c: "#f59e0b" }, { l: "Comptes utilisateurs", v: users.length, c: "#8b5cf6", p: "comptes" }].map(s => (
                  <div key={s.l} onClick={() => s.p && setAct(s.p)} style={{ background: C.admSf, borderRadius: 12, padding: "16px 18px", border: "1px solid #334155", borderTop: `3px solid ${s.c}`, cursor: s.p ? "pointer" : "default" }}>
                    <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700, marginBottom: 4 }}>{s.l.toUpperCase()}</div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: s.c }}>{s.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ background: C.admSf, borderRadius: 12, padding: "16px 18px", border: "1px solid #334155" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#f1f5f9", marginBottom: 12 }}>Moyennes par matière</div>
                  {MD.slice(0, 6).map((m, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < 5 ? "1px solid #334155" : "none" }}>
                      <div style={{ fontSize: 12, color: "#f1f5f9" }}>{m.mat}</div>
                      {m.moy != null ? <span style={{ background: gc(m.moy) + "22", color: gc(m.moy), border: `1px solid ${gc(m.moy)}44`, borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 700 }}>{m.moy}/20</span> : <span style={{ color: "#64748b", fontSize: 11 }}>—</span>}
                    </div>
                  ))}
                </div>
                <div style={{ background: C.admSf, borderRadius: 12, padding: "16px 18px", border: "1px solid #334155" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#f1f5f9", marginBottom: 12 }}>Messages récents</div>
                  {msgs.slice(0, 4).map((m, i) => (
                    <div key={i} style={{ padding: "7px 0", borderBottom: i < msgs.length - 1 ? "1px solid #334155" : "none" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#f1f5f9" }}>{m.sujet}</div>
                      <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{m.date} — {m.lu ? <span style={{ color: C.ok }}>✓ Lu</span> : <span style={{ color: C.wa }}>Non lu</span>}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Notes admin */}
          {act === "notes" && <Notes dark />}
          {/* Devoirs admin */}
          {act === "devoirs" && (
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>Cahier de textes</div>
                <button onClick={() => setShowDevModal(true)} style={{ padding: "8px 16px", background: C.admAc, color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>+ Ajouter un devoir</button>
              </div>
              {devoirs.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>Aucun devoir.</div>}
              {Object.entries(devoirs.reduce((g, d) => { if (!g[d.date]) g[d.date] = []; g[d.date].push(d); return g }, {})).sort().map(([date, items]) => {
                const [y, m, d] = date.split("-")
                return (
                  <div key={date} style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: C.admAc, marginBottom: 9, textTransform: "uppercase", letterSpacing: ".5px" }}>📅 {d}/{m}/{y}</div>
                    {items.map(dev => (
                      <div key={dev.id} style={{ background: C.admSf, borderRadius: 10, border: "1px solid #334155", marginBottom: 9, overflow: "hidden", borderLeft: `4px solid ${dev.taf ? C.admAc : "#3b82f6"}`, padding: "13px 16px" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", gap: 7, marginBottom: 6, flexWrap: "wrap" }}>
                              <span style={{ background: C.admAc + "22", color: C.admAc, border: `1px solid ${C.admAc}44`, borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 700 }}>{dev.mat}</span>
                              {dev.taf && <span style={{ background: C.wa + "22", color: C.wa, border: `1px solid ${C.wa}44`, borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 700 }}>Travail à faire</span>}
                            </div>
                            <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6, marginBottom: 5 }}>{dev.desc}</div>
                            <div style={{ fontSize: 11, color: "#64748b", fontStyle: "italic" }}>Donné le {dev.donne} par {dev.prof}</div>
                          </div>
                          <button onClick={() => delDev(dev.id)} style={{ padding: "4px 10px", background: "transparent", border: `1px solid ${C.er}`, color: C.er, borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })}
              {showDevModal && (
                <Mdl title="Ajouter un devoir" onClose={() => setShowDevModal(false)}>
                  {selEl("Matière", newDev.mat, v => setNewDev({ ...newDev, mat: v }), MATIERES_LIST)}
                  {inp("Professeur", newDev.prof, v => setNewDev({ ...newDev, prof: v }), "Mme FISCHER N.")}
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 4 }}>Description</label>
                    <textarea value={newDev.desc} onChange={e => setNewDev({ ...newDev, desc: e.target.value })} rows={4} placeholder="Exercices page 45..." style={{ width: "100%", background: C.adm, border: "1.5px solid #334155", borderRadius: 7, padding: "9px 11px", color: "#f1f5f9", fontSize: 13, outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "'Outfit',sans-serif" }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {inp("Date du cours", newDev.date, v => setNewDev({ ...newDev, date: v }), "", "date")}
                    {inp("Donné le", newDev.donne, v => setNewDev({ ...newDev, donne: v }), "9 mars")}
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#f1f5f9", fontSize: 13, marginBottom: 18 }}>
                    <input type="checkbox" checked={newDev.taf} onChange={e => setNewDev({ ...newDev, taf: e.target.checked })} /> Travail à faire
                  </label>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button onClick={() => setShowDevModal(false)} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #334155", color: "#94a3b8", borderRadius: 7, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>Annuler</button>
                    <button onClick={addDev} style={{ padding: "8px 16px", background: C.admAc, color: "white", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>Publier</button>
                  </div>
                </Mdl>
              )}
            </div>
          )}
          {/* EDT admin */}
          {act === "emploi" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ padding: "14px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155", flexShrink: 0 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#f1f5f9" }}>Emploi du temps</span>
                <button onClick={() => setShowSlotModal(true)} style={{ padding: "7px 15px", background: C.admAc, color: "white", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>+ Ajouter un créneau</button>
              </div>
              <div style={{ flex: 1, overflowY: "auto", overflowX: "auto" }}>
                <div style={{ minWidth: 780, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "48px repeat(7,1fr)", position: "sticky", top: 0, zIndex: 20 }}>
                    <div style={{ background: C.adm, borderBottom: `2px solid ${C.admAc}`, borderRight: "1px solid #334155" }} />
                    {DATE_LABELS.map((l, i) => <div key={l} style={{ background: i >= 5 ? "#1a1a0a" : C.admSf, borderBottom: `2px solid ${C.admAc}`, borderLeft: "1px solid #334155", padding: "8px 4px", textAlign: "center", fontSize: 11, fontWeight: 700, color: i >= 5 ? "#64748b" : "#f1f5f9" }}>{l}</div>)}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "48px repeat(7,1fr)" }}>
                    <div style={{ borderRight: "1px solid #334155" }}>
                      {HEURES.map(h => <div key={h} style={{ height: 56, borderBottom: "1px solid #1e293b", display: "flex", alignItems: "flex-start", justifyContent: "flex-end", paddingRight: 4, paddingTop: 3, fontSize: 10, color: "#64748b", fontWeight: 600 }}>{h}</div>)}
                    </div>
                    {JOURS.map((j, ji) => {
                      const cr = edt.map((c, idx) => ({ ...c, idx })).filter(c => c.j === j && c.m)
                      const TH = (toMin("18:00") - 7 * 60) / 60 * 56
                      return (
                        <div key={j} style={{ position: "relative", borderLeft: "1px solid #334155", background: ji >= 5 ? "#1a1a0a" : C.admSf, height: TH }}>
                          {HEURES.map((h, hi) => <div key={h} style={{ position: "absolute", top: hi * 56, left: 0, right: 0, borderBottom: "1px solid #1e293b22", height: 56, pointerEvents: "none" }} />)}
                          {cr.map(c => {
                            const top = (toMin(c.h) - 7 * 60) / 60 * 56
                            const height = Math.max((toMin(c.f) - toMin(c.h)) / 60 * 56, 22)
                            return (
                              <div key={c.idx} style={{ position: "absolute", left: 2, right: 2, top, height, background: c.c, borderRadius: 5, padding: "3px 5px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.3)", cursor: "pointer" }}>
                                <div style={{ fontSize: 8, fontWeight: 700, color: "rgba(0,0,0,.6)" }}>{c.h}-{c.f}</div>
                                <div style={{ fontSize: 9, fontWeight: 900, color: "rgba(0,0,0,.85)", lineHeight: 1.2 }}>{c.m}</div>
                                {height > 36 && <div style={{ fontSize: 8, color: "rgba(0,0,0,.6)" }}>{c.p}</div>}
                                <div onClick={e => { e.stopPropagation(); delSlot(c.idx) }} style={{ position: "absolute", top: 2, right: 2, width: 13, height: 13, borderRadius: "50%", background: "rgba(0,0,0,.25)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 8, color: "white", fontWeight: 900 }}>✕</div>
                                {c.al && <span style={{ position: "absolute", bottom: 2, right: 2, fontSize: 9 }}>⚠</span>}
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              {showSlotModal && (
                <Mdl title="Ajouter un créneau" onClose={() => setShowSlotModal(false)}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    {selEl("Jour", newSlot.j, v => setNewSlot({ ...newSlot, j: v }), JOURS)}
                    {inp("Début", newSlot.h, v => setNewSlot({ ...newSlot, h: v }), "08:05")}
                    {inp("Fin", newSlot.f, v => setNewSlot({ ...newSlot, f: v }), "09:00")}
                  </div>
                  {selEl("Matière", newSlot.m, v => setNewSlot({ ...newSlot, m: v }), MATIERES_LIST)}
                  {inp("Professeur", newSlot.p, v => setNewSlot({ ...newSlot, p: v }), "FISCHER N.")}
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 6 }}>Couleur</label>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {COLORS_EDT.map(col => <div key={col} onClick={() => setNewSlot({ ...newSlot, c: col })} style={{ width: 24, height: 24, borderRadius: 6, background: col, cursor: "pointer", border: newSlot.c === col ? "2px solid white" : "2px solid transparent", boxShadow: newSlot.c === col ? `0 0 0 2px ${C.admAc}` : "none" }} />)}
                    </div>
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#f1f5f9", fontSize: 13, marginBottom: 18 }}>
                    <input type="checkbox" checked={newSlot.al} onChange={e => setNewSlot({ ...newSlot, al: e.target.checked })} /> Ajouter une alerte ⚠
                  </label>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button onClick={() => setShowSlotModal(false)} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #334155", color: "#94a3b8", borderRadius: 7, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>Annuler</button>
                    <button onClick={addSlot} style={{ padding: "8px 16px", background: C.admAc, color: "white", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>Ajouter</button>
                  </div>
                </Mdl>
              )}
            </div>
          )}
          {/* Messagerie admin */}
          {act === "messagerie" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ padding: "14px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155", flexShrink: 0 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#f1f5f9" }}>Messagerie — Direction</span>
                <button onClick={() => setShowMsgModal(true)} style={{ padding: "7px 15px", background: C.admAc, color: "white", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>✉ Nouveau message</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "290px 1fr", flex: 1, overflow: "hidden", minHeight: 0 }}>
                <div style={{ borderRight: "1px solid #334155", overflowY: "auto", background: C.admSf }}>
                  <div style={{ padding: "10px 13px", borderBottom: "1px solid #334155", fontSize: 11, fontWeight: 700, color: "#64748b" }}>BOÎTE D'ENVOI — {msgs.length}</div>
                  {msgs.map(m => (
                    <div key={m.id} onClick={() => setSelMsg(m)} style={{ padding: "11px 13px", cursor: "pointer", borderBottom: "1px solid #334155", background: selMsg?.id === m.id ? C.admAc + "15" : "transparent", borderLeft: selMsg?.id === m.id ? `3px solid ${C.admAc}` : "3px solid transparent" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#f1f5f9" }}>{m.sujet}</div>
                        {m.imp && <span style={{ background: C.er + "22", color: C.er, fontSize: 9, fontWeight: 800, padding: "2px 5px", borderRadius: 4 }}>!</span>}
                      </div>
                      <div style={{ fontSize: 10, color: "#64748b" }}>{m.date} — {m.lu ? <span style={{ color: C.ok }}>✓ Lu</span> : <span style={{ color: C.wa }}>Non lu</span>}</div>
                    </div>
                  ))}
                </div>
                <div style={{ overflowY: "auto", padding: "20px", background: C.adm }}>
                  {selMsg ? (<>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 13 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>{selMsg.sujet}</div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ background: C.admAc + "22", color: C.admAc, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>Direction</span>
                          <span style={{ fontSize: 12, color: "#64748b" }}>{selMsg.date}</span>
                          {selMsg.imp && <span style={{ background: C.er + "22", color: C.er, fontSize: 12, fontWeight: 700, padding: "3px 9px", borderRadius: 6 }}>⚠ Important</span>}
                        </div>
                      </div>
                      <button onClick={() => delMsg(selMsg.id)} style={{ padding: "6px 13px", background: "transparent", border: `1px solid ${C.er}`, color: C.er, borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>Supprimer</button>
                    </div>
                    <div style={{ height: 1, background: "#334155", marginBottom: 14 }} />
                    <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.8 }}>{selMsg.corps}</div>
                  </>) : <div style={{ textAlign: "center", paddingTop: 70, color: "#64748b" }}><div style={{ fontSize: 42, marginBottom: 10 }}>✉️</div><div style={{ fontSize: 13 }}>Sélectionnez un message</div></div>}
                </div>
              </div>
              {showMsgModal && (
                <Mdl title="Nouveau message" onClose={() => setShowMsgModal(false)}>
                  <div style={{ background: C.admAc + "18", borderRadius: 8, padding: "9px 13px", marginBottom: 13, fontSize: 12, color: C.admAc }}>📢 Ce message sera visible dans la messagerie élève.</div>
                  {inp("Sujet", newMsg.sujet, v => setNewMsg({ ...newMsg, sujet: v }), "Réunion parents-professeurs...")}
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 4 }}>Corps du message</label>
                    <textarea value={newMsg.corps} onChange={e => setNewMsg({ ...newMsg, corps: e.target.value })} rows={5} placeholder="Bonjour..." style={{ width: "100%", background: C.adm, border: "1.5px solid #334155", borderRadius: 7, padding: "9px 11px", color: "#f1f5f9", fontSize: 13, outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "'Outfit',sans-serif" }} />
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#f1f5f9", fontSize: 13, marginBottom: 18 }}>
                    <input type="checkbox" checked={newMsg.imp} onChange={e => setNewMsg({ ...newMsg, imp: e.target.checked })} /> Marquer comme important
                  </label>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button onClick={() => setShowMsgModal(false)} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #334155", color: "#94a3b8", borderRadius: 7, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>Annuler</button>
                    <button onClick={addMsg} disabled={!newMsg.sujet || !newMsg.corps} style={{ padding: "8px 16px", background: C.admAc, color: "white", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: !newMsg.sujet || !newMsg.corps ? 0.5 : 1, fontFamily: "'Outfit',sans-serif" }}>Envoyer</button>
                  </div>
                </Mdl>
              )}
            </div>
          )}
          {/* Comptes */}
          {act === "comptes" && (
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>Gestion des comptes</div>
                <button onClick={() => setShowUserModal(true)} style={{ padding: "8px 16px", background: "#8b5cf6", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>+ Nouveau compte</button>
              </div>
              {["eleve", "admin"].map(type => (
                <div key={type} style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: type === "eleve" ? C.pr : C.admAc, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                    <span>{type === "eleve" ? "🎒 Élèves" : "🔐 Administrateurs"}</span>
                    <span style={{ background: (type === "eleve" ? C.pr : C.admAc) + "22", color: type === "eleve" ? C.pr : C.admAc, borderRadius: 20, padding: "1px 9px", fontSize: 11 }}>{users.filter(u => u.type === type).length}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 10 }}>
                    {users.filter(u => u.type === type).map(u => (
                      <div key={u.id} style={{ background: C.admSf, borderRadius: 11, border: "1px solid #334155", borderLeft: `4px solid ${type === "eleve" ? C.pr : C.admAc}`, padding: "13px 15px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${type === "eleve" ? C.pr : C.admAc},${type === "eleve" ? "#2563d4" : "#f59e0b"})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                              {u.nom.split(" ").filter(w => /^[A-ZÀÂÉÈÊËÎÏÔÙÛÜ]/.test(w)).slice(0, 2).map(w => w[0]).join("").slice(0, 2) || u.login[0].toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 800, color: "#f1f5f9" }}>{u.nom}</div>
                              {type === "eleve" && u.classe && <div style={{ fontSize: 11, color: "#64748b" }}>{u.classe}</div>}
                              {type === "admin" && u.role && <div style={{ fontSize: 11, color: "#64748b" }}>{u.role}</div>}
                            </div>
                          </div>
                          {u.id !== 1 && u.id !== 2 && (
                            <button onClick={() => delUser(u.id)} style={{ padding: "3px 9px", background: "transparent", border: `1px solid ${C.er}`, color: C.er, borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: "'Outfit',sans-serif" }}>✕</button>
                          )}
                        </div>
                        <div style={{ background: C.adm, borderRadius: 7, padding: "8px 11px", fontSize: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                            <span style={{ color: "#64748b" }}>Identifiant</span>
                            <span style={{ color: "#f1f5f9", fontWeight: 700, fontFamily: "monospace" }}>{u.login}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#64748b" }}>Mot de passe</span>
                            <span style={{ color: "#f1f5f9", fontWeight: 700, fontFamily: "monospace" }}>{u.password}</span>
                          </div>
                        </div>
                        {type === "eleve" && u.parent && <div style={{ marginTop: 8, fontSize: 11, color: "#64748b", fontStyle: "italic" }}>Parent : {u.parent}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {showUserModal && (
                <Mdl title="Créer un compte" onClose={() => setShowUserModal(false)}>
                  {selEl("Type de compte", newUser.type, v => setNewUser({ ...newUser, type: v }), ["eleve", "admin"])}
                  {inp("Nom complet", newUser.nom, v => setNewUser({ ...newUser, nom: v }), newUser.type === "eleve" ? "Prénom Nom" : "M. Dupont")}
                  {inp("Identifiant de connexion", newUser.login, v => setNewUser({ ...newUser, login: v }), newUser.type === "eleve" ? "prenom.nom" : "admin2")}
                  {inp("Mot de passe", newUser.password, v => setNewUser({ ...newUser, password: v }), "••••••")}
                  {newUser.type === "eleve" && <>
                    {inp("Classe", newUser.classe, v => setNewUser({ ...newUser, classe: v }), "5ème F EUROP.")}
                    {inp("Parent / Tuteur", newUser.parent, v => setNewUser({ ...newUser, parent: v }), "Mme / M. ...")}
                  </>}
                  {newUser.type === "admin" && inp("Rôle", newUser.role, v => setNewUser({ ...newUser, role: v }), "Directeur adjoint...")}
                  {users.find(u => u.login === newUser.login) && <div style={{ color: C.er, fontSize: 12, background: "#fef2f222", borderRadius: 7, padding: "7px 11px", marginBottom: 10 }}>⚠ Cet identifiant existe déjà.</div>}
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 6 }}>
                    <button onClick={() => setShowUserModal(false)} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #334155", color: "#94a3b8", borderRadius: 7, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>Annuler</button>
                    <button onClick={addUser} disabled={!newUser.login || !newUser.password || !newUser.nom || !!users.find(u => u.login === newUser.login)} style={{ padding: "8px 16px", background: "#8b5cf6", color: "white", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: (!newUser.login || !newUser.password || !newUser.nom || !!users.find(u => u.login === newUser.login)) ? 0.5 : 1, fontFamily: "'Outfit',sans-serif" }}>Créer le compte</button>
                  </div>
                </Mdl>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── ÉCRAN DE CONNEXION ───────────────────────────────────────────────────────
function LoginScreen({ onLogin, users }) {
  const [mode, setMode] = useState("choose") // choose | eleve | admin
  const [u, setU] = useState("")
  const [p, setP] = useState("")
  const [err, setErr] = useState(false)
  const [ld, setLd] = useState(false)

  const doLogin = () => {
    setLd(true)
    setTimeout(() => {
      const found = users.find(usr => usr.type === mode && usr.login === u && usr.password === p)
      if (found) onLogin(mode, u)
      else { setErr(true); setLd(false) }
    }, 700)
  }

  const reset = () => { setMode("choose"); setU(""); setP(""); setErr(false) }

  if (mode === "choose") return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg,${C.dk} 0%,${C.pr} 50%,#f97316 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif" }}>
      <div style={{ textAlign: "center", maxWidth: 480, width: "100%", padding: "0 20px" }}>
        <div style={{ width: 70, height: 70, borderRadius: 18, background: "rgba(255,255,255,.15)", backdropFilter: "blur(10px)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14, border: "1px solid rgba(255,255,255,.3)" }}>
          <span style={{ color: "white", fontSize: 30, fontWeight: 900 }}>É</span>
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, color: "white", marginBottom: 6 }}>École Direct</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,.7)", marginBottom: 40 }}>Collège Privé Bobée — Qui êtes-vous ?</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { id: "eleve", icon: "🎒", title: "Espace Élève", sub: `${users.filter(u=>u.type==="eleve").length} élève(s)`, hint: users.filter(u=>u.type==="eleve").slice(0,1).map(u=>`${u.login} / ${u.password}`).join(""), grad: `linear-gradient(135deg,${C.pr},#2563d4)` },
            { id: "admin", icon: "🔐", title: "Espace Admin", sub: `${users.filter(u=>u.type==="admin").length} admin(s)`, hint: users.filter(u=>u.type==="admin").slice(0,1).map(u=>`${u.login} / ${u.password}`).join(""), grad: `linear-gradient(135deg,#f97316,#f59e0b)` },
          ].map(card => (
            <div key={card.id} onClick={() => setMode(card.id)}
              style={{ background: "rgba(255,255,255,.12)", backdropFilter: "blur(10px)", borderRadius: 16, padding: "28px 20px", cursor: "pointer", border: "1px solid rgba(255,255,255,.2)", transition: "all .2s", textAlign: "center" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.22)"; e.currentTarget.style.transform = "translateY(-4px)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.12)"; e.currentTarget.style.transform = "none" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{card.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "white", marginBottom: 5 }}>{card.title}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", marginBottom: 10 }}>{card.sub}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", fontStyle: "italic" }}>{card.hint}</div>
              <div style={{ marginTop: 16, padding: "8px 20px", background: card.grad, borderRadius: 8, color: "white", fontSize: 12, fontWeight: 700 }}>Se connecter →</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const isEleve = mode === "eleve"
  return (
    <div style={{ minHeight: "100vh", background: isEleve ? `linear-gradient(135deg,${C.dk},${C.pr})` : `linear-gradient(135deg,#0a1628,#1e293b)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif" }}>
      <div style={{ background: isEleve ? C.wh : C.admSf, borderRadius: 18, padding: "38px 36px", width: 400, boxShadow: "0 25px 60px rgba(0,0,0,.35)", border: isEleve ? "none" : "1px solid #334155" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 24 }}>
          <button onClick={reset} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: isEleve ? "#94a3b8" : "#64748b", padding: 0 }}>←</button>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: isEleve ? C.dk : "#f1f5f9" }}>{isEleve ? "Espace Élève" : "Espace Admin"}</div>
            <div style={{ fontSize: 12, color: isEleve ? C.mu : "#64748b", marginTop: 2 }}>{isEleve ? "Collège Privé Bobée" : "École Direct — Administration"}</div>
          </div>
        </div>
        {[["Identifiant", isEleve ? "octave.lechatelier" : "admin", "text", u, setU], ["Mot de passe", "••••••", "password", p, setP]].map(([lbl, ph, tp, val, set]) => (
          <div key={lbl} style={{ marginBottom: 13 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: isEleve ? C.mu : "#94a3b8", marginBottom: 4 }}>{lbl}</label>
            <input type={tp} value={val} onChange={e => set(e.target.value)} placeholder={ph} onKeyDown={e => e.key === "Enter" && doLogin()}
              style={{ width: "100%", padding: "10px 12px", border: `2px solid ${err ? C.er : isEleve ? C.bd : "#334155"}`, borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "'Outfit',sans-serif", background: isEleve ? C.wh : C.adm, color: isEleve ? C.tx : "#f1f5f9" }} />
          </div>
        ))}
        {err && <div style={{ color: C.er, fontSize: 12, background: "#fef2f2", borderRadius: 7, padding: "7px 11px", marginBottom: 12 }}>⚠️ Identifiants incorrects. Réessayez.</div>}
        <button onClick={doLogin} disabled={ld} style={{ width: "100%", padding: 12, background: isEleve ? `linear-gradient(135deg,${C.pr},#2563d4)` : `linear-gradient(135deg,#f97316,#f59e0b)`, color: "white", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Outfit',sans-serif", marginTop: 4 }}>
          {ld ? "Connexion..." : "Se connecter"}
        </button>
        <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: isEleve ? C.mu : "#64748b" }}>
          {users.filter(x=>x.type===mode).slice(0,1).map(x=><span key={x.id}><b>{x.login}</b> / <b>{x.password}</b></span>)}
        </div>
      </div>
    </div>
  )
}

// ─── DONNÉES INITIALES COMPTES ────────────────────────────────────────────────
const INIT_USERS = [
  { id: 1, type: "eleve", login: "octave.lechatelier", password: "1234", nom: "Octave Le Chatelier", classe: "5ème F EUROP.", parent: "Mme Alexandra Le Chatelier" },
  { id: 2, type: "admin", login: "admin", password: "admin", nom: "M. Moreau", role: "Directeur" },
]

// ─── APP PRINCIPALE ───────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(null)
  const [devoirs, setDevoirs] = useState(INIT_DEVOIRS)
  const [msgs, setMsgs] = useState(INIT_MSGS)
  const [users, setUsers] = useState(INIT_USERS)

  const handleLogin = (type, login) => setSession({ type, login })

  if (!session) return <LoginScreen onLogin={handleLogin} users={users} />
  if (session.type === "eleve") return <AppEleve onLogout={() => setSession(null)} devoirs={devoirs} setDevoirs={setDevoirs} msgs={msgs} setMsgs={setMsgs} user={users.find(u => u.login === session.login)} />
  if (session.type === "admin") return <AppAdmin onLogout={() => setSession(null)} devoirs={devoirs} setDevoirs={setDevoirs} msgs={msgs} setMsgs={setMsgs} users={users} setUsers={setUsers} user={users.find(u => u.login === session.login)} />
}
