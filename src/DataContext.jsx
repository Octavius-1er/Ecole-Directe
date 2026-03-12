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
function calcMoy(evals) {
  const vals = evals.map(parseVal).filter(v => !isNaN(v));
  if (!vals.length) return "—";
  return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2).replace(".", ",");
}

export function DataProvider({ children }) {
  const [classes,     setClasses]     = useState({});
  const [notesPE,     setNotesPE]     = useState({});
  const [devoirsPC,   setDevoirsPC]   = useState({});
  const [edtPC,       setEdtPC]       = useState({});
  const [absencesPE,  setAbsencesPE]  = useState({});
  const [punitionsPE, setPunitionsPE] = useState({});
  const [messages,    setMessages]    = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    let loaded = 0;
    const total = 7;
    function tick() { loaded++; if (loaded >= total) setLoading(false); }

    const unsubs = [
      onSnapshot(doc(db, "app", "classes"),     s => { setClasses(s.exists()     ? s.data().data || {} : {}); tick(); }),
      onSnapshot(doc(db, "app", "notesPE"),     s => { setNotesPE(s.exists()     ? s.data().data || {} : {}); tick(); }),
      onSnapshot(doc(db, "app", "devoirsPC"),   s => { setDevoirsPC(s.exists()   ? s.data().data || {} : {}); tick(); }),
      onSnapshot(doc(db, "app", "edtPC"),       s => { setEdtPC(s.exists()       ? s.data().data || {} : {}); tick(); }),
      onSnapshot(doc(db, "app", "absencesPE"),  s => { setAbsencesPE(s.exists()  ? s.data().data || {} : {}); tick(); }),
      onSnapshot(doc(db, "app", "punitionsPE"), s => { setPunitionsPE(s.exists() ? s.data().data || {} : {}); tick(); }),
      onSnapshot(doc(db, "app", "messages"),    s => { setMessages(s.exists()    ? s.data().data || [] : []); tick(); }),
    ];
    return () => unsubs.forEach(u => u());
  }, []);

  async function save(key, data) {
    await setDoc(doc(db, "app", key), { data, updatedAt: serverTimestamp() });
  }

  // ── CLASSES ──
  async function addClass(nom, niveau) {
    const id   = "c" + Date.now();
    const next = { ...classes, [id]: { id, nom, niveau } };
    await save("classes", next);
    return id;
  }
  async function updateClass(id, updates) {
    await save("classes", { ...classes, [id]: { ...classes[id], ...updates } });
  }
  async function deleteClass(id) {
    const next = { ...classes }; delete next[id];
    await save("classes", next);
  }

  // ── NOTES ──
  function getNotesEleve(eleveId, releveId) { return notesPE[eleveId]?.[releveId] || null; }

  async function addNoteEleve(eleveId, releveId, matiere, valeur, profLabel) {
    const ed  = notesPE[eleveId] || {};
    const rel = ed[releveId] || { conseil: "", notes: [], competences: [] };
    let notes = rel.notes;
    if (notes.find(n => n.matiere === matiere)) {
      notes = notes.map(n => {
        if (n.matiere !== matiere) return n;
        const ev = [...n.evals, String(valeur)];
        return { ...n, evals: ev, moyenne: calcMoy(ev) };
      });
    } else {
      notes = [...notes, {
        matiere, prof: profLabel || "",
        evals: [String(valeur)],
        moyenne: calcMoy([String(valeur)])
      }];
    }
    await save("notesPE", { ...notesPE, [eleveId]: { ...ed, [releveId]: { ...rel, notes } } });
  }

  async function removeNoteEleve(eleveId, releveId, matiere, idx) {
    const rel = notesPE[eleveId]?.[releveId]; if (!rel) return;
    const notes = rel.notes.map(n => {
      if (n.matiere !== matiere) return n;
      const ev = n.evals.filter((_, i) => i !== idx);
      return { ...n, evals: ev, moyenne: calcMoy(ev) };
    });
    await save("notesPE", { ...notesPE, [eleveId]: { ...notesPE[eleveId], [releveId]: { ...rel, notes } } });
  }

  function computeClassStats(eleveIds, releveId) {
    const map = {};
    eleveIds.forEach(eid => {
      const rel = notesPE[eid]?.[releveId]; if (!rel) return;
      rel.notes.forEach(n => {
        const v = parseFloat(n.moyenne.replace(",", ".")); if (isNaN(v)) return;
        if (!map[n.matiere]) map[n.matiere] = [];
        map[n.matiere].push(v);
      });
    });
    const res = {};
    Object.entries(map).forEach(([mat, vals]) => {
      res[mat] = {
        moyenneClasse: (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(2).replace(".",","),
        min: Math.min(...vals).toFixed(2).replace(".",","),
        max: Math.max(...vals).toFixed(2).replace(".",","),
      };
    });
    return res;
  }

  // ── DEVOIRS ──
  function getDevoirsClasse(cid) { return devoirsPC[cid] || {}; }

  async function addDevoirClasse(cid, day, label, item) {
    const cd = devoirsPC[cid] || {}, dd = cd[day] || { label, items: [] };
    await save("devoirsPC", { ...devoirsPC, [cid]: { ...cd, [day]: { ...dd, items: [...dd.items, item] } } });
  }
  async function removeDevoirClasse(cid, day, idx) {
    const cd = devoirsPC[cid] || {}, dd = cd[day]; if (!dd) return;
    await save("devoirsPC", { ...devoirsPC, [cid]: { ...cd, [day]: { ...dd, items: dd.items.filter((_,i)=>i!==idx) } } });
  }
  async function updateDevoirEffectue(cid, day, idx, val) {
    const cd = devoirsPC[cid] || {}, dd = cd[day]; if (!dd) return;
    const items = dd.items.map((it,i) => i===idx ? {...it,effectue:val} : it);
    await save("devoirsPC", { ...devoirsPC, [cid]: { ...cd, [day]: { ...dd, items } } });
  }

  // ── EDT ──
  function getEdtClasse(cid) { return edtPC[cid] || {}; }

  async function addEdtItem(cid, day, label, item) {
    const ce = edtPC[cid] || {}, dd = ce[day] || { label, items: [] };
    const items = [...dd.items, item].sort((a,b)=>a.heure.localeCompare(b.heure));
    await save("edtPC", { ...edtPC, [cid]: { ...ce, [day]: { ...dd, items } } });
  }
  async function removeEdtItem(cid, day, idx) {
    const ce = edtPC[cid] || {}, dd = ce[day]; if (!dd) return;
    await save("edtPC", { ...edtPC, [cid]: { ...ce, [day]: { ...dd, items: dd.items.filter((_,i)=>i!==idx) } } });
  }

  // ── ABSENCES / PUNITIONS ──
  function getAbsencesEleve(eid)  { return absencesPE[eid]  || []; }
  function getPunitionsEleve(eid) { return punitionsPE[eid] || []; }

  async function addAbsence(eid, a) {
    await save("absencesPE", { ...absencesPE, [eid]: [...(absencesPE[eid]||[]), {...a, id:Date.now().toString()}] });
  }
  async function removeAbsence(eid, id) {
    await save("absencesPE", { ...absencesPE, [eid]: (absencesPE[eid]||[]).filter(a=>a.id!==id) });
  }
  async function addPunition(eid, p) {
    await save("punitionsPE", { ...punitionsPE, [eid]: [...(punitionsPE[eid]||[]), {...p, id:Date.now().toString()}] });
  }
  async function removePunition(eid, id) {
    await save("punitionsPE", { ...punitionsPE, [eid]: (punitionsPE[eid]||[]).filter(p=>p.id!==id) });
  }

  // ── MESSAGES ──
  async function sendMessage(msg) {
    await save("messages", [{ ...msg, id: Date.now().toString(), lu: false }, ...messages]);
  }
  async function markRead(id) {
    await save("messages", messages.map(m => m.id===id ? {...m,lu:true} : m));
  }
  async function deleteMessage(id) {
    await save("messages", messages.filter(m => m.id!==id));
  }

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", flexDirection:"column", gap:16, fontFamily:"Outfit,sans-serif", color:"#1a4fa0" }}>
      <div style={{ width:40, height:40, border:"4px solid #bfdbfe", borderTop:"4px solid #1a4fa0", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
      <p style={{fontWeight:600}}>Connexion en cours...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

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

export function useData() { return useContext(DataContext); }
