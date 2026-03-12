import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useData } from "../DataContext";
import "./Notes.css";

const MATIERES = ["Français","Mathématiques","Anglais LV1","Allemand LV2","Histoire-Géo","Sciences Vie & Terre","Physique-Chimie","Technologie","EPS","Arts Plastiques","Éducation Musicale","LCA Latin"];
const TYPES_EVAL = ["Contrôle","Devoir maison","Interrogation","Examen blanc","TP","Oral","Projet"];
const TRIMESTRES = [
  { id:"t1", label:"1er Trimestre", releves:[{id:"r1",label:"Relevé 1"},{id:"r2",label:"Relevé 2"}] },
  { id:"t2", label:"2ème Trimestre", releves:[{id:"r3",label:"Relevé 3"},{id:"r4",label:"Relevé 4"}] },
  { id:"t3", label:"3ème Trimestre", releves:[{id:"r5",label:"Relevé 5"},{id:"r6",label:"Relevé 6"}] },
  { id:"annee", label:"Année", releves:[] },
];
const NIVEAUX = [
  { id:"non",  label:"Non atteints",  color:"#ef4444" },
  { id:"part", label:"Partiellement", color:"#eab308" },
  { id:"att",  label:"Atteints",      color:"#3b82f6" },
  { id:"dep",  label:"Dépassés",      color:"#22c55e" },
];
const RELEVES_ORDER = ["r1","r2","r3","r4","r5","r6"];
const BAR_COLORS = ["#3b82f6","#22c55e","#f59e0b","#8b5cf6","#ef4444","#06b6d4","#ec4899","#10b981","#f97316","#6366f1","#84cc16","#14b8a6"];

function parseVal(v) {
  const s = String(v).replace(",",".");
  const m = s.match(/^([\d.]+)\/([\d.]+)$/);
  if (m) return (parseFloat(m[1])/parseFloat(m[2]))*20;
  return parseFloat(s);
}
function fmt(n) {
  if (n == null || isNaN(n)) return "—";
  return (typeof n==="number" ? n : parseFloat(n)).toFixed(2).replace(".",",");
}

export default function Notes() {
  const { user, accounts } = useAuth();
  const { classes, evals, addEval, deleteEval, periode } = useData();
  const canEdit = user?.role==="admin" || user?.role==="prof";

  const classeIds = Object.keys(classes||{});
  const [selectedClasse, setSelectedClasse] = useState("");
  useEffect(()=>{ if(!selectedClasse && classeIds.length>0) setSelectedClasse(classeIds[0]); },[classeIds.join(",")]);
  const classeId = user?.role==="eleve" ? (user?.classeId||"") : selectedClasse;
  const elevesClasse = (accounts||[]).filter(a=>a.role==="eleve"&&a.classeId===classeId);
  const [selectedEleve, setSelectedEleve] = useState("");
  const targetEleveId = user?.role==="eleve" ? user.id : selectedEleve;
  const targetAccount = (accounts||[]).find(a=>a.id===targetEleveId);

  const [activeTrimestre, setActiveTrimestre] = useState(periode?.trimestreId||"t3");
  const [activeReleve,    setActiveReleve]    = useState(periode?.releveId||"r5");
  const isAnnee = activeTrimestre==="annee";
  const trimestre = TRIMESTRES.find(t=>t.id===activeTrimestre);
  useEffect(()=>{
    if(periode?.trimestreId) setActiveTrimestre(periode.trimestreId);
    if(periode?.releveId)    setActiveReleve(periode.releveId);
  },[periode?.releveId]);

  const [activeTab,   setActiveTab]   = useState("evaluations");
  const [detailEval,  setDetailEval]  = useState(null);
  const [showForm,    setShowForm]    = useState(false);
  const [form,        setForm]        = useState({nom:"",matiere:"",type:"Contrôle",date:"",notes:{},competences:[]});
  const [compInput,   setCompInput]   = useState({label:"",desc:""});
  const [saving,      setSaving]      = useState(false);
  const [msg,         setMsg]         = useState("");

  function handleTrimestreChange(t) {
    setActiveTrimestre(t.id);
    if(t.releves.length>0) setActiveReleve(t.releves[0].id);
  }

  const evalsReleve = useMemo(()=>{
    if(!classeId||!activeReleve||!Array.isArray(evals)) return [];
    return evals.filter(e=>e.classeId===classeId&&e.releveId===activeReleve);
  },[evals,classeId,activeReleve]);

  const evalsEleve = useMemo(()=>{
    if(!targetEleveId||!classeId||!activeReleve||!Array.isArray(evals)) return [];
    return evals.filter(e=>e.classeId===classeId&&e.releveId===activeReleve&&e.notes?.[targetEleveId]!=null).map(e=>({...e,noteEleve:e.notes[targetEleveId]}));
  },[evals,targetEleveId,classeId,activeReleve]);

  const matieres = useMemo(()=>[...new Set(evalsEleve.map(e=>e.matiere))],[evalsEleve]);

  function getStatsMat(mat) {
    const eV = evalsEleve.filter(e=>e.matiere===mat).map(e=>parseVal(e.noteEleve)).filter(v=>!isNaN(v));
    const aC = evalsReleve.filter(e=>e.matiere===mat).flatMap(e=>Object.values(e.notes||{}).map(parseVal).filter(v=>!isNaN(v)));
    return {
      moyEleve:  eV.length ? eV.reduce((a,b)=>a+b)/eV.length : null,
      moyClasse: aC.length ? aC.reduce((a,b)=>a+b)/aC.length : null,
      min:       aC.length ? Math.min(...aC) : null,
      max:       aC.length ? Math.max(...aC) : null,
    };
  }

  const moyGenEleve  = useMemo(()=>{ const v=evalsEleve.map(e=>parseVal(e.noteEleve)).filter(v=>!isNaN(v)); return v.length?v.reduce((a,b)=>a+b)/v.length:null; },[evalsEleve]);
  const moyGenClasse = useMemo(()=>{ const v=evalsReleve.flatMap(e=>Object.values(e.notes||{}).map(parseVal).filter(v=>!isNaN(v))); return v.length?v.reduce((a,b)=>a+b)/v.length:null; },[evalsReleve]);
  const minGen = useMemo(()=>{ const v=evalsReleve.flatMap(e=>Object.values(e.notes||{}).map(parseVal).filter(v=>!isNaN(v))); return v.length?Math.min(...v):null; },[evalsReleve]);
  const maxGen = useMemo(()=>{ const v=evalsReleve.flatMap(e=>Object.values(e.notes||{}).map(parseVal).filter(v=>!isNaN(v))); return v.length?Math.max(...v):null; },[evalsReleve]);

  const competencesReleve = useMemo(()=>{
    const rows=[];
    for(const mat of matieres){
      const comps=evalsEleve.filter(e=>e.matiere===mat).flatMap(e=>(e.competences||[]).map(c=>({...c,matiere:mat})));
      if(comps.length) rows.push({matiere:mat,comps});
    }
    return rows;
  },[evalsEleve,matieres]);

  async function handleSubmitEval(e) {
    e.preventDefault();
    if(!form.nom||!form.matiere||!classeId) return;
    setSaving(true);
    await addEval({...form,classeId,releveId:activeReleve});
    setForm({nom:"",matiere:"",type:"Contrôle",date:"",notes:{},competences:[]});
    setCompInput({label:"",desc:""});
    setShowForm(false);
    setMsg("Évaluation ajoutée ✓");
    setTimeout(()=>setMsg(""),3000);
    setSaving(false);
  }
  function addComp(){ if(!compInput.label) return; setForm(f=>({...f,competences:[...f.competences,{...compInput,niveau:""}]})); setCompInput({label:"",desc:""}); }

  return (
    <div className="notes-wrap">
      <div className="notes-header">
        <h1 className="notes-title">Notes et Moyennes {targetAccount && <span className="notes-eleve-chip">({targetAccount.prenom?.toUpperCase()})</span>}</h1>
        {canEdit && (
          <div className="notes-selector-bar">
            <div className="selector-group"><label>Classe</label>
              <select value={selectedClasse} onChange={e=>{setSelectedClasse(e.target.value);setSelectedEleve("");setShowForm(false);}}>
                <option value="">— Choisir —</option>{classeIds.map(cid=><option key={cid} value={cid}>{classes[cid]?.nom}</option>)}
              </select>
            </div>
            {classeId && <div className="selector-group"><label>Élève</label>
              <select value={selectedEleve} onChange={e=>setSelectedEleve(e.target.value)}>
                <option value="">— Vue évals —</option>{elevesClasse.map(a=><option key={a.id} value={a.id}>{a.prenom} {a.nom}</option>)}
              </select>
            </div>}
          </div>
        )}
      </div>

      <div className="trim-tabs">
        {TRIMESTRES.map(t=><button key={t.id} className={`trim-tab ${activeTrimestre===t.id?"active":""}`} onClick={()=>handleTrimestreChange(t)}>{t.label}</button>)}
      </div>
      {!isAnnee && trimestre?.releves.length>0 && (
        <div className="releve-tabs">
          {trimestre.releves.map(r=><button key={r.id} className={`releve-tab ${activeReleve===r.id?"active":""}`} onClick={()=>setActiveReleve(r.id)}>{r.label}</button>)}
        </div>
      )}

      {/* VUE PROF */}
      {canEdit && !targetEleveId && !isAnnee && classeId && (
        <div className="notes-body">
          {(()=>{
            const idx=RELEVES_ORDER.indexOf(activeReleve), cur=RELEVES_ORDER.indexOf(periode?.releveId||"r5");
            if(idx===cur) return <div className="notes-actions"><button className="btn-saisir" onClick={()=>setShowForm(v=>!v)}>{showForm?"✕ Annuler":"➕ Saisir une évaluation"}</button>{msg&&<span className="add-success">{msg}</span>}</div>;
            if(idx<cur) return <div className="releve-locked">🔒 Relevé clôturé — saisie impossible</div>;
            return <div className="releve-locked future">📅 Ce relevé n'est pas encore ouvert</div>;
          })()}
          {showForm && (
            <form className="eval-form" onSubmit={handleSubmitEval}>
              <h3 className="eval-form-title">Nouvelle évaluation — <span>{classes[classeId]?.nom}</span></h3>
              <div className="eval-form-grid">
                <div className="eval-field"><label>Nom *</label><input type="text" placeholder="ex: Questions No et Moi" value={form.nom} onChange={e=>setForm(f=>({...f,nom:e.target.value}))} required/></div>
                <div className="eval-field"><label>Matière *</label><select value={form.matiere} onChange={e=>setForm(f=>({...f,matiere:e.target.value}))} required><option value="">— Choisir —</option>{MATIERES.map(m=><option key={m} value={m}>{m}</option>)}</select></div>
                <div className="eval-field"><label>Type</label><select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>{TYPES_EVAL.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
                <div className="eval-field"><label>Date</label><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></div>
              </div>
              <div className="eval-notes-section">
                <h4>Notes des élèves <span className="optional">— sur 20 ou fraction (ex: 14/20)</span></h4>
                {elevesClasse.length===0 ? <p className="no-eleves">Aucun élève dans cette classe.</p>
                  : <div className="eval-notes-grid">{elevesClasse.map(el=><div key={el.id} className="eval-note-row"><span className="eval-eleve-name">{el.prenom} {el.nom}</span><input type="text" placeholder="—" className="eval-note-input" value={form.notes[el.id]||""} onChange={e=>setForm(f=>({...f,notes:{...f.notes,[el.id]:e.target.value}}))}/></div>)}</div>}
              </div>
              <div className="eval-comp-section">
                <h4>Compétences <span className="optional">(optionnel)</span></h4>
                <div className="eval-comp-add">
                  <input type="text" placeholder="Intitulé (ex: Lire)" value={compInput.label} onChange={e=>setCompInput(c=>({...c,label:e.target.value}))}/>
                  <input type="text" placeholder="Description" value={compInput.desc} onChange={e=>setCompInput(c=>({...c,desc:e.target.value}))}/>
                  <button type="button" className="btn-saisir sm" onClick={addComp}>+ Ajouter</button>
                </div>
                {form.competences.map((c,i)=>(
                  <div key={i} className="comp-chip-full">
                    <div className="comp-chip-top"><span><strong>{c.label}</strong>{c.desc?` — ${c.desc}`:""}</span><button type="button" className="comp-del" onClick={()=>setForm(f=>({...f,competences:f.competences.filter((_,j)=>j!==i)}))}>×</button></div>
                    <div className="comp-niveau-selector">
                      {NIVEAUX.map(n=><button key={n.id} type="button" className={`comp-niveau-btn ${c.niveau===n.id?"selected":""}`} style={c.niveau===n.id?{background:n.color,borderColor:n.color,color:"white"}:{borderColor:n.color}} onClick={()=>setForm(f=>({...f,competences:f.competences.map((cc,j)=>j===i?{...cc,niveau:n.id}:cc)}))}>
                        <span className="niveau-dot" style={{background:n.color}}/>{n.label}</button>)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="eval-form-footer"><button type="submit" className="btn-primary-sm" disabled={saving}>{saving?"Enregistrement...":"✓ Enregistrer l'évaluation"}</button></div>
            </form>
          )}
          <div className="ed-card">
            <h3 className="card-subtitle">Évaluations saisies — {classes[classeId]?.nom}</h3>
            {evalsReleve.length===0 ? <div className="empty-state"><span className="empty-icon">📭</span><p>Aucune évaluation saisie.</p></div>
              : <div className="eval-list">{evalsReleve.map(ev=><div key={ev.id} className="eval-list-item"><div className="eval-list-left"><span className="eval-list-nom">{ev.nom}</span><span className="eval-list-meta">{ev.matiere} · {ev.type}{ev.date?` · ${new Date(ev.date).toLocaleDateString("fr-FR")}`:""}</span><span className="eval-list-meta">{Object.keys(ev.notes||{}).length} élève(s) noté(s)</span></div><button className="btn-del-sm" onClick={()=>deleteEval(ev.id)}>🗑</button></div>)}</div>}
          </div>
        </div>
      )}

      {/* VUE ÉLÈVE */}
      {targetEleveId && (
        <div className="notes-body">
          {isAnnee ? (
            <div className="ed-card">
              <table className="ed-table">
                <thead><tr><th>Trimestre</th><th>Moyenne générale</th></tr></thead>
                <tbody>
  {["t1","t2","t3"].map(tid => {
    const rels = TRIMESTRES.find(t => t.id === tid)?.releves || [];

    const v = rels.flatMap(r =>
      (evals || [])
        .filter(e =>
          e.classeId === classeId &&
          e.releveId === r.id &&
          e.notes?.[targetEleveId] != null
        )
        .map(e => parseVal(e.notes[targetEleveId]))
        .filter(v => !isNaN(v))
    );

    const moyenne = v.length ? v.reduce((a,b)=>a+b)/v.length : null;

    return (
      <tr key={tid}>
        <td>{TRIMESTRES.find(t=>t.id===tid)?.label}</td>
        <td>
          <strong>{fmt(moyenne)}</strong>
        </td>
      </tr>
    );
  })}

  <tr className="annee-row">
    <td>
      <strong>Moyenne annuelle</strong>
    </td>
    <td>
      <strong style={{color:"#1a4fa0",fontSize:17}}>
        {fmt((() => {
          const v = RELEVES_ORDER.flatMap(rid =>
            (evals || [])
              .filter(e =>
                e.classeId === classeId &&
                e.releveId === rid &&
                e.notes?.[targetEleveId] != null
              )
              .map(e => parseVal(e.notes[targetEleveId]))
              .filter(v => !isNaN(v))
          );

          return v.length ? v.reduce((a,b)=>a+b)/v.length : null;
        })())}
      </strong>
    </td>
  </tr>
</tbody>
              </table>
            </div>
          ) : (
            <>
              <div className="content-tabs-bar">
                {[["evaluations","Evaluations"],["moyennes","Moyennes"],["competences","Compétences"],["graphiques","Graphiques"]].map(([id,label])=>(
                  <button key={id} className={`content-tab ${activeTab===id?"active":""}`} onClick={()=>setActiveTab(id)}>{label}</button>
                ))}
              </div>

              {/* ÉVALUATIONS */}
              {activeTab==="evaluations" && (
                <div className="ed-card-scroll">
                  {matieres.length===0 ? <div className="empty-state"><span className="empty-icon">📭</span><p>Aucune note pour ce relevé.</p></div>
                    : <table className="ed-table ed-table-evals">
                        <thead><tr className="thead-blue"><th className="col-discipline">DISCIPLINES</th><th className="col-coef">COEF.</th><th className="col-moy-h">MOYENNES</th><th className="col-evals">ÉVALUATIONS</th></tr></thead>
                        <tbody>
                          {matieres.map(mat=>{ const evsMat=evalsEleve.filter(e=>e.matiere===mat); const s=getStatsMat(mat); return (
                            <tr key={mat} className="tr-matiere">
                              <td className="td-discipline">{mat}</td>
                              <td className="td-coef">1</td>
                              <td className="td-moy-inline">{s.moyEleve!=null && <>{fmt(s.moyEleve)}<span className="moy-dot-inline" style={{background:s.moyEleve>=10?"#eab308":"#ef4444"}}/></>}</td>
                              <td className="td-evals"><div className="eval-chips-row">{evsMat.map(ev=><button key={ev.id} className="eval-chip" onClick={()=>setDetailEval(ev)}>{ev.noteEleve}{canEdit&&<span className="chip-del" onClick={e=>{e.stopPropagation();deleteEval(ev.id);}}>×</span>}</button>)}</div></td>
                            </tr>
                          ); })}
                          <tr className="tr-moy-gen-inline"><td colSpan={2}><span className="moy-gen-label">MOYENNE GÉNÉRALE</span></td><td className="td-moy-inline bold">{fmt(moyGenEleve)}</td><td/></tr>
                        </tbody>
                      </table>}
                </div>
              )}

              {/* MOYENNES */}
              {activeTab==="moyennes" && (
                <div className="ed-card-scroll">
                  {matieres.length===0 ? <div className="empty-state"><span className="empty-icon">📭</span><p>Aucune note pour ce relevé.</p></div>
                    : <table className="ed-table ed-table-moyennes">
                        <thead>
                          <tr className="thead-blue"><th rowSpan={2} className="col-discipline">DISCIPLINE</th><th colSpan={4} className="col-moy-header">MOYENNE</th><th rowSpan={2} className="col-apprec">APPRÉCIATION</th></tr>
                          <tr className="thead-sub-blue"><th>ÉLÈVE</th><th>CLASSE</th><th>MIN</th><th>MAX</th></tr>
                        </thead>
                        <tbody>
                          {matieres.map(mat=>{ const s=getStatsMat(mat); return (
                            <tr key={mat} className="tr-matiere">
                              <td className="td-discipline">{mat}</td>
                              <td className="td-moy-num eleve"><strong>{fmt(s.moyEleve)}</strong></td>
                              <td className="td-moy-num">{fmt(s.moyClasse)}</td>
                              <td className="td-moy-num">{fmt(s.min)}</td>
                              <td className="td-moy-num">{fmt(s.max)}</td>
                              <td className="td-apprec"/>
                            </tr>
                          ); })}
                          <tr className="tr-moy-gen">
                            <td><strong style={{color:"#1a4fa0"}}>Moyenne générale</strong></td>
                            <td className="td-moy-num eleve"><strong style={{color:"#1a4fa0"}}>{fmt(moyGenEleve)}</strong></td>
                            <td className="td-moy-num">{fmt(moyGenClasse)}</td>
                            <td className="td-moy-num">{fmt(minGen)}</td>
                            <td className="td-moy-num">{fmt(maxGen)}</td>
                            <td/>
                          </tr>
                        </tbody>
                      </table>}
                </div>
              )}

              {/* COMPÉTENCES */}
              {activeTab==="competences" && (
                <div className="ed-card-scroll">
                  {competencesReleve.length===0 ? <div className="empty-state"><span className="empty-icon">🎯</span><p>Aucune compétence renseignée pour ce relevé.</p></div>
                    : <div className="comp-table-wrap">
                        <table className="ed-table ed-table-comp">
                          <thead>
                            <tr className="thead-blue">
                              <th className="col-disc-comp">DISCIPLINES</th>
                              <th className="col-prog">ÉLÉMENTS DE PROGRAMME</th>
                              {NIVEAUX.map(n=><th key={n.id} className="col-niveau"><div className="niveau-th"><span className="niveau-th-dot" style={{background:n.color}}/><span>{n.label}</span></div></th>)}
                            </tr>
                          </thead>
                          <tbody>
                            {competencesReleve.map(({matiere,comps})=>comps.map((c,i)=>(
                              <tr key={`${matiere}-${i}`} className="tr-comp">
                                {i===0 && <td className="td-disc-comp" rowSpan={comps.length}><strong>{matiere}</strong></td>}
                                <td className="td-prog">{c.desc||c.label}</td>
                                {NIVEAUX.map(n=><td key={n.id} className="td-niveau">{c.niveau===n.id&&<span className="niveau-circle" style={{background:n.color}}/>}</td>)}
                              </tr>
                            )))}
                          </tbody>
                        </table>
                      </div>}
                </div>
              )}

              {/* GRAPHIQUES */}
              {activeTab==="graphiques" && (
                <div className="ed-card">
                  {matieres.length===0 ? <div className="empty-state"><span className="empty-icon">📊</span><p>Aucune donnée à afficher.</p></div>
                    : <>
                        <h4 className="graph-title">Moyennes par matière</h4>
                        <div className="graph-bars">
                          {matieres.map((mat,i)=>{ const s=getStatsMat(mat); const pE=s.moyEleve!=null?Math.min(s.moyEleve/20*100,100):0; const pC=s.moyClasse!=null?Math.min(s.moyClasse/20*100,100):0; const col=BAR_COLORS[i%BAR_COLORS.length]; return (
                            <div key={mat} className="graph-bar-row">
                              <div className="graph-bar-label">{mat}</div>
                              <div className="graph-bar-tracks">
                                <div className="graph-bar-track"><div className="graph-bar-fill" style={{width:`${pE}%`,background:col}}/><span className="graph-bar-val" style={{color:col}}>{fmt(s.moyEleve)}</span></div>
                                <div className="graph-bar-track classe"><div className="graph-bar-fill" style={{width:`${pC}%`,background:"#cbd5e1"}}/><span className="graph-bar-val muted">{fmt(s.moyClasse)}</span></div>
                              </div>
                            </div>
                          ); })}
                        </div>
                        <div className="graph-legend">
                          <span className="legend-item"><span className="legend-dot" style={{background:"#3b82f6"}}/>Élève</span>
                          <span className="legend-item"><span className="legend-dot" style={{background:"#cbd5e1"}}/>Classe</span>
                        </div>
                        {matieres.length>=3 && <>
                          <h4 className="graph-title" style={{marginTop:32}}>Profil de l'élève</h4>
                          <div className="graph-radar-wrap">
                            <svg viewBox="0 0 320 320" className="graph-radar-svg">
                              {[20,40,60,80,100].map(r=><circle key={r} cx={160} cy={160} r={r} fill="none" stroke="#e2e8f0" strokeWidth={1}/>)}
                              {matieres.map((_,i)=>{ const a=(i/matieres.length)*Math.PI*2-Math.PI/2; return <line key={i} x1={160} y1={160} x2={160+Math.cos(a)*100} y2={160+Math.sin(a)*100} stroke="#e2e8f0" strokeWidth={1}/>; })}
                              <polygon points={matieres.map((_,i)=>{ const s=getStatsMat(matieres[i]); const r=(s.moyClasse!=null?Math.min(s.moyClasse/20,1):0)*100; const a=(i/matieres.length)*Math.PI*2-Math.PI/2; return `${160+Math.cos(a)*r},${160+Math.sin(a)*r}`; }).join(" ")} fill="#94a3b815" stroke="#94a3b8" strokeWidth={1.5}/>
                              <polygon points={matieres.map((_,i)=>{ const s=getStatsMat(matieres[i]); const r=(s.moyEleve!=null?Math.min(s.moyEleve/20,1):0)*100; const a=(i/matieres.length)*Math.PI*2-Math.PI/2; return `${160+Math.cos(a)*r},${160+Math.sin(a)*r}`; }).join(" ")} fill="#3b82f625" stroke="#3b82f6" strokeWidth={2}/>
                              {matieres.map((mat,i)=>{ const a=(i/matieres.length)*Math.PI*2-Math.PI/2; const x=160+Math.cos(a)*122; const y=160+Math.sin(a)*122; const words=mat.split(" ").slice(0,2); return <text key={i} x={x} y={y} textAnchor="middle" fontSize={8} fill="#475569" fontFamily="Outfit,sans-serif">{words.map((w,j)=><tspan key={j} x={x} dy={j===0?0:10}>{w}</tspan>)}</text>; })}
                            </svg>
                          </div>
                        </>}
                      </>}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {canEdit && !targetEleveId && !classeId && <div className="empty-state mt"><span className="empty-icon">🏫</span><p>Sélectionnez une classe pour commencer.</p></div>}

      {/* MODAL */}
      {detailEval && (
        <div className="modal-overlay" onClick={()=>setDetailEval(null)}>
          <div className="modal-card" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h2>{detailEval.nom}</h2><button className="modal-close" onClick={()=>setDetailEval(null)}>✕</button></div>
            <div className="modal-body">
              <div className="modal-info-grid">
                <div className="modal-info-item"><span className="info-label">Matière</span><span>{detailEval.matiere}</span></div>
                <div className="modal-info-item"><span className="info-label">Type</span><span>{detailEval.type}</span></div>
                {detailEval.date && <div className="modal-info-item"><span className="info-label">Date</span><span>{new Date(detailEval.date).toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</span></div>}
                <div className="modal-info-item"><span className="info-label">Note de l'élève</span><span className="info-note">{detailEval.noteEleve}{/\//.test(String(detailEval.noteEleve))?"":" / 20"}</span></div>
              </div>
              {(()=>{ const v=Object.values(detailEval.notes||{}).map(parseVal).filter(v=>!isNaN(v)); if(!v.length) return null; return <div className="modal-stats"><div className="stat-item"><span className="stat-label">Moy. classe</span><strong>{fmt(v.reduce((a,b)=>a+b)/v.length)}</strong></div><div className="stat-item"><span className="stat-label">Min</span><strong>{fmt(Math.min(...v))}</strong></div><div className="stat-item"><span className="stat-label">Max</span><strong>{fmt(Math.max(...v))}</strong></div></div>; })()}
              {detailEval.competences?.length>0 && <div className="modal-comps"><h4>Compétences</h4>{detailEval.competences.map((c,i)=><div key={i} className="modal-comp-row"><div className="comp-info"><strong>{c.label}</strong>{c.desc&&<span className="comp-desc">{c.desc}</span>}</div><div className="comp-niveaux">{NIVEAUX.map(n=><span key={n.id} className={`comp-niveau-display ${c.niveau===n.id?"active":""}`} style={c.niveau===n.id?{background:n.color+"22",borderColor:n.color,color:n.color}:{}}><span className="niveau-dot" style={{background:c.niveau===n.id?n.color:"#cbd5e1"}}/>{n.label}</span>)}</div></div>)}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
