import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const DataContext = createContext(null);

function parseVal(v) {
  const s = String(v).replace(",", ".");
  const m = s.match(/^([\d.]+)\/([\d.]+)$/);
  if (m) return (parseFloat(m[1]) / parseFloat(m[2])) * 20;
  return parseFloat(s);
}
function calcMoy(vals) {
  const v = vals.map(parseVal).filter(v => !isNaN(v));
  if (!v.length) return null;
  return (v.reduce((a, b) => a + b, 0) / v.length);
}
function fmt(n) { return n == null ? "—" : n.toFixed(2).replace(".", ","); }

export function DataProvider({ children }) {
  const [classes,     setClasses]     = useState({});
  const [evals,       setEvals]       = useState([]); // toutes les évaluations
  const [devoirsPC,   setDevoirsPC]   = useState({});
  const [edtPC,       setEdtPC]       = useState({});
  const [absencesPE,  setAbsencesPE]  = useState({});
  const [punitionsPE, setPunitionsPE] = useState({});
  const [messages,    setMessages]    = useState([]);
  const [periode,     setPeriode]     = useState({ releveId:"r5", trimestreId:"t3" });
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    let loaded = 0; const total = 8;
    function tick() { loaded++; if (loaded >= total) setLoading(false); }
    const unsubs = [
      onSnapshot(doc(db,"app","classes"),     s => { setClasses(s.exists()     ? s.data().data||{} : {}); tick(); }),
      onSnapshot(doc(db,"app","evals"),       s => { setEvals(s.exists()       ? s.data().data||[] : []); tick(); }),
      onSnapshot(doc(db,"app","devoirsPC"),   s => { setDevoirsPC(s.exists()   ? s.data().data||{} : {}); tick(); }),
      onSnapshot(doc(db,"app","edtPC"),       s => { setEdtPC(s.exists()       ? s.data().data||{} : {}); tick(); }),
      onSnapshot(doc(db,"app","absencesPE"),  s => { setAbsencesPE(s.exists()  ? s.data().data||{} : {}); tick(); }),
      onSnapshot(doc(db,"app","punitionsPE"), s => { setPunitionsPE(s.exists() ? s.data().data||{} : {}); tick(); }),
      onSnapshot(doc(db,"app","messages"),    s => { setMessages(s.exists()    ? s.data().data||[] : []); tick(); }),
      onSnapshot(doc(db,"app","periode"),     s => { setPeriode(s.exists()     ? s.data().data||{ releveId:"r5", trimestreId:"t3" } : { releveId:"r5", trimestreId:"t3" }); tick(); }),
    ];
    return () => unsubs.forEach(u => u());
  }, []);

  async function save(key, data) {
    await setDoc(doc(db, "app", key), { data, updatedAt: serverTimestamp() });
  }

  async function savePeriode(p) {
    await save("periode", p);
  }

  // ── CLASSES ──
  async function addClass(nom, niveau) {
    const id = "c" + Date.now();
    await save("classes", { ...classes, [id]: { id, nom, niveau } });
    return id;
  }
  async function updateClass(id, updates) {
    await save("classes", { ...classes, [id]: { ...classes[id], ...updates } });
  }
  async function deleteClass(id) {
    const next = { ...classes }; delete next[id];
    await save("classes", next);
  }

  // ── ÉVALUATIONS ──
  // eval = { id, nom, matiere, type, date, releveId, classeId, notes:{[eleveId]:valeur}, competences:[{label,desc,niveau}] }

  function getEvalsClasse(classeId, releveId) {
    return evals.filter(e => e.classeId === classeId && e.releveId === releveId);
  }

  function getEvalsEleve(eleveId, classeId, releveId) {
    return evals
      .filter(e => e.classeId === classeId && e.releveId === releveId && e.notes?.[eleveId] != null)
      .map(e => ({ ...e, noteEleve: e.notes[eleveId] }));
  }

  // Calcule la moyenne d'un élève pour un relevé à partir des évals
  function getMoyenneEleve(eleveId, classeId, releveId) {
    const ev = getEvalsEleve(eleveId, classeId, releveId);
    if (!ev.length) return null;
    return calcMoy(ev.map(e => e.noteEleve));
  }

  // Calcule les stats d'une matière pour une classe/relevé
  function getStatsMatiere(matiere, classeId, releveId) {
    const evsMat = evals.filter(e => e.classeId === classeId && e.releveId === releveId && e.matiere === matiere);
    const allNotes = evsMat.flatMap(e => Object.values(e.notes || {}).map(parseVal).filter(v => !isNaN(v)));
    if (!allNotes.length) return { moyenneClasse: "—", min: "—", max: "—" };
    return {
      moyenneClasse: fmt(calcMoy(allNotes.map(String))),
      min: fmt(Math.min(...allNotes)),
      max: fmt(Math.max(...allNotes)),
    };
  }

  async function addEval(evalData) {
    const newEval = { ...evalData, id: Date.now().toString() };
    await save("evals", [...evals, newEval]);
    return newEval.id;
  }

  async function updateEval(id, updates) {
    await save("evals", evals.map(e => e.id === id ? { ...e, ...updates } : e));
  }

  async function deleteEval(id) {
    await save("evals", evals.filter(e => e.id !== id));
  }

  // ── DEVOIRS ──
  function getDevoirsClasse(cid) { return devoirsPC[cid] || {}; }
  async function addDevoirClasse(cid, day, label, item) {
    const cd = devoirsPC[cid]||{}, dd = cd[day]||{label,items:[]};
    await save("devoirsPC", {...devoirsPC,[cid]:{...cd,[day]:{...dd,items:[...dd.items,item]}}});
  }
  async function removeDevoirClasse(cid, day, idx) {
    const cd = devoirsPC[cid]||{}, dd = cd[day]; if(!dd) return;
    await save("devoirsPC", {...devoirsPC,[cid]:{...cd,[day]:{...dd,items:dd.items.filter((_,i)=>i!==idx)}}});
  }
  async function updateDevoirEffectue(cid, day, idx, val) {
    const cd = devoirsPC[cid]||{}, dd = cd[day]; if(!dd) return;
    await save("devoirsPC", {...devoirsPC,[cid]:{...cd,[day]:{...dd,items:dd.items.map((it,i)=>i===idx?{...it,effectue:val}:it)}}});
  }

  // ── EDT ──
  function getEdtClasse(cid) { return edtPC[cid] || {}; }
  async function addEdtItem(cid, day, label, item) {
    const ce = edtPC[cid]||{}, dd = ce[day]||{label,items:[]};
    const items = [...dd.items, item].sort((a,b)=>a.heure.localeCompare(b.heure));
    await save("edtPC", {...edtPC,[cid]:{...ce,[day]:{...dd,items}}});
  }
  async function removeEdtItem(cid, day, idx) {
    const ce = edtPC[cid]||{}, dd = ce[day]; if(!dd) return;
    await save("edtPC", {...edtPC,[cid]:{...ce,[day]:{...dd,items:dd.items.filter((_,i)=>i!==idx)}}});
  }

  // ── ABSENCES / PUNITIONS ──
  function getAbsencesEleve(eid)  { return absencesPE[eid]  || []; }
  function getPunitionsEleve(eid) { return punitionsPE[eid] || []; }
  async function addAbsence(eid, a) {
    await save("absencesPE", {...absencesPE,[eid]:[...(absencesPE[eid]||[]),{...a,id:Date.now().toString()}]});
  }
  async function removeAbsence(eid, id) {
    await save("absencesPE", {...absencesPE,[eid]:(absencesPE[eid]||[]).filter(a=>a.id!==id)});
  }
  async function addPunition(eid, p) {
    await save("punitionsPE", {...punitionsPE,[eid]:[...(punitionsPE[eid]||[]),{...p,id:Date.now().toString()}]});
  }
  async function removePunition(eid, id) {
    await save("punitionsPE", {...punitionsPE,[eid]:(punitionsPE[eid]||[]).filter(p=>p.id!==id)});
  }

  // ── MESSAGES ──
  async function sendMessage(msg) {
    await save("messages", [{...msg,id:Date.now().toString(),lu:false},...messages]);
  }
  async function markRead(id) {
    await save("messages", messages.map(m=>m.id===id?{...m,lu:true}:m));
  }
  async function deleteMessage(id) {
    await save("messages", messages.filter(m=>m.id!==id));
  }

  if (loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",flexDirection:"column",gap:16,fontFamily:"Outfit,sans-serif",color:"#1a4fa0"}}>
      <div style={{width:40,height:40,border:"4px solid #bfdbfe",borderTop:"4px solid #1a4fa0",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
      <p style={{fontWeight:600}}>Connexion en cours...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <DataContext.Provider value={{
      classes, addClass, updateClass, deleteClass,
      evals, getEvalsClasse, getEvalsEleve, getMoyenneEleve, getStatsMatiere, addEval, updateEval, deleteEval,
      getDevoirsClasse, addDevoirClasse, removeDevoirClasse, updateDevoirEffectue,
      getEdtClasse, addEdtItem, removeEdtItem,
      getAbsencesEleve, getPunitionsEleve, addAbsence, removeAbsence, addPunition, removePunition,
      messages, sendMessage, markRead, deleteMessage,
      periode, savePeriode,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() { return useContext(DataContext); }
