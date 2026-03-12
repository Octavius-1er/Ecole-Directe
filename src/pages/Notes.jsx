import React, { useState, useMemo } from "react";
import { useAuth } from "../AuthContext";
import { useData } from "../DataContext";
import "./Notes.css";

const MATIERES=["Français","Mathématiques","Anglais LV1","Allemand LV2","Histoire-Géo","Sciences Vie & Terre","Physique-Chimie","Technologie","EPS","Arts Plastiques","Éducation Musicale","LCA Latin"];
const TRIMESTRES = [
  { id:"t1", label:"1er Trimestre",  releves:[{id:"r1",label:"Relevé 1"},{id:"r2",label:"Relevé 2"}] },
  { id:"t2", label:"2ème Trimestre", releves:[{id:"r3",label:"Relevé 3"},{id:"r4",label:"Relevé 4"}] },
  { id:"t3", label:"3ème Trimestre", releves:[{id:"r5",label:"Relevé 5"},{id:"r6",label:"Relevé 6"}] },
  { id:"annee", label:"Année",       releves:[] },
];

function parseVal(v){
  const s=String(v).replace(",",".");
  const m=s.match(/^([\d.]+)\/([\d.]+)$/);
  if(m) return(parseFloat(m[1])/parseFloat(m[2]))*20;
  return parseFloat(s);
}

function computeAnnee(notesPE, eleveId){
  const releves=["r1","r2","r3","r4","r5","r6"].map(id=>notesPE?.[eleveId]?.[id]).filter(Boolean);
  if(!releves.length) return null;
  const map={};
  releves.forEach(r=>r.notes.forEach(n=>{
    if(!map[n.matiere]) map[n.matiere]={matiere:n.matiere,prof:n.prof,sum:0,cnt:0,evals:[]};
    const v=parseFloat(n.moyenne.replace(",","."));
    if(!isNaN(v)){map[n.matiere].sum+=v;map[n.matiere].cnt+=1;}
    map[n.matiere].evals.push(...n.evals);
  }));
  const notes=Object.values(map).map(m=>({
    matiere:m.matiere,prof:m.prof,evals:m.evals,
    moyenne:m.cnt?(m.sum/m.cnt).toFixed(2).replace(".",","):"—"
  }));
  const vals=notes.map(n=>parseFloat(n.moyenne.replace(",","."))).filter(v=>!isNaN(v));
  const mg=vals.length?(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(2).replace(".",","):"—";
  return{conseil:"Moyenne annuelle — tous relevés confondus",notes,competences:releves[0]?.competences||[],moyenneGenerale:mg,moyenneClasse:"—",moyenneMin:"—",moyenneMax:"—"};
}

function EmptyState({label}){
  return<div className="empty-state"><span className="empty-icon">📭</span><p>Aucune donnée pour <strong>{label}</strong></p></div>;
}

export default function Notes(){
  const {user,accounts}=useAuth();
  const {classes,getNotesEleve,addNoteEleve,removeNoteEleve,computeClassStats}=useData();
  const canEdit=user?.role==="admin"||user?.role==="prof";

  // Sélecteur de classe (prof/admin)
  const [selectedClasse, setSelectedClasse]=useState(Object.keys(classes)[0]||"");
  // Sélecteur d'élève (prof/admin : voir notes d'un élève)
  const elevesDeClasse=accounts.filter(a=>a.role==="eleve"&&(!selectedClasse||a.classeId===selectedClasse));
  const [selectedEleve, setSelectedEleve]=useState(null);

  // Élève courant : si élève connecté → lui-même ; si prof/admin → selectedEleve
  const targetEleveId = user?.role==="eleve" ? user.id : selectedEleve;
  const targetAccount = accounts.find(a=>a.id===targetEleveId);

  const [activeTrimestre,setActiveTrimestre]=useState("t1");
  const [activeReleve,setActiveReleve]=useState("r2");
  const [activeTab,setActiveTab]=useState("evaluations");
  const [showAdd,setShowAdd]=useState(false);
  const [newNote,setNewNote]=useState({matiere:"",valeur:""});
  const [msg,setMsg]=useState("");

  const trimestre=TRIMESTRES.find(t=>t.id===activeTrimestre);
  const isAnnee=activeTrimestre==="annee";

  // Notes de l'élève cible — reconstruit via getNotesEleve
  const allNotesPE = (() => {
    // On a besoin d'accéder à notesPE brut pour computeAnnee — on le reconstruit via getNotesEleve
    const result={};
    ["r1","r2","r3","r4","r5","r6"].forEach(rid=>{
      const r=getNotesEleve(targetEleveId,rid);
      if(r) result[rid]=r;
    });
    return result;
  })();

  const current = isAnnee
    ? computeAnnee({[targetEleveId]:allNotesPE},targetEleveId)
    : (targetEleveId ? getNotesEleve(targetEleveId, activeReleve) : null);

  // Stats de classe pour le relevé actif
  const eleveIdsClasse = accounts.filter(a=>a.role==="eleve"&&a.classeId===selectedClasse).map(a=>a.id);
  const classStats = useMemo(()=>{
    if(isAnnee||!activeReleve) return{};
    return computeClassStats(eleveIdsClasse,activeReleve);
  },[eleveIdsClasse,activeReleve,isAnnee]);

  const activeLabel=isAnnee?"Année":(trimestre?.releves.find(r=>r.id===activeReleve)?.label||trimestre?.label);

  function handleAddNote(e){
    e.preventDefault();
    if(!newNote.matiere||!newNote.valeur||!targetEleveId) return;
    addNoteEleve(targetEleveId,activeReleve,newNote.matiere,newNote.valeur,`${user.prenom} ${user.nom}`);
    setMsg(`Note ${newNote.valeur} ajoutée ✓`);
    setNewNote({matiere:"",valeur:""});
    setTimeout(()=>setMsg(""),3000);
  }

  function handleTrimestreChange(t){
    setActiveTrimestre(t.id);
    if(t.releves.length>0) setActiveReleve(t.releves[0].id);
  }

  return(
    <div className="notes-container">
      <h1 className="notes-title">Notes et Moyennes</h1>

      {/* ── Sélecteur classe + élève (prof/admin) ── */}
      {canEdit&&(
        <div className="notes-selector-bar">
          <div className="selector-group">
            <label>Classe</label>
            <select value={selectedClasse} onChange={e=>{setSelectedClasse(e.target.value);setSelectedEleve(null);}}>
              <option value="">— Choisir —</option>
              {Object.values(classes).map(c=><option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>
          </div>
          <div className="selector-group">
            <label>Élève</label>
            <select value={selectedEleve||""} onChange={e=>setSelectedEleve(e.target.value||null)} disabled={!selectedClasse}>
              <option value="">— Choisir un élève —</option>
              {elevesDeClasse.map(e=><option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
            </select>
          </div>
          {targetAccount&&<div className="selector-eleve-chip">👤 {targetAccount.prenom} {targetAccount.nom}</div>}
        </div>
      )}

      {/* ── Trimestres ── */}
      <div className="trimestre-tabs">
        {TRIMESTRES.map(t=>(
          <button key={t.id} className={`trimestre-tab ${activeTrimestre===t.id?"active":""}`} onClick={()=>handleTrimestreChange(t)}>{t.label}</button>
        ))}
      </div>

      {trimestre?.releves.length>0&&(
        <div className="releve-tabs">
          {trimestre.releves.map(r=>(
            <button key={r.id} className={`releve-tab ${activeReleve===r.id?"active":""}`} onClick={()=>setActiveReleve(r.id)}>{r.label}</button>
          ))}
        </div>
      )}

      {current&&<p className="conseil-info">{current.conseil}</p>}

      <div className="notes-topbar">
        <div className="sub-tabs">
          {[{id:"evaluations",label:"Evaluations"},{id:"moyennes",label:"Moyennes"},{id:"competences",label:"Compétences"},{id:"graphiques",label:"Graphiques"}].map(tab=>(
            <button key={tab.id} className={`sub-tab ${activeTab===tab.id?"active":""}`} onClick={()=>setActiveTab(tab.id)}>{tab.label}</button>
          ))}
        </div>
        {canEdit&&!isAnnee&&targetEleveId&&(
          <button className="btn-add-note" onClick={()=>setShowAdd(v=>!v)}>
            {showAdd?"✕ Fermer":"➕ Ajouter une note"}
          </button>
        )}
      </div>

      {/* ── Formulaire ajout ── */}
      {canEdit&&showAdd&&!isAnnee&&targetEleveId&&(
        <form className="add-note-form" onSubmit={handleAddNote}>
          <select value={newNote.matiere} onChange={e=>setNewNote(p=>({...p,matiere:e.target.value}))} required>
            <option value="">— Matière —</option>
            {MATIERES.map(m=><option key={m} value={m}>{m}</option>)}
          </select>
          <input type="text" placeholder="Note (ex: 15 ou 8/10)" value={newNote.valeur} onChange={e=>setNewNote(p=>({...p,valeur:e.target.value}))} required />
          <button type="submit" className="btn-primary-sm">Ajouter</button>
          {msg&&<span className="add-success">{msg}</span>}
        </form>
      )}

      {!targetEleveId&&canEdit&&<div className="empty-state"><span className="empty-icon">👆</span><p>Sélectionnez une classe et un élève pour voir les notes</p></div>}
      {targetEleveId&&!current&&<EmptyState label={activeLabel}/>}

      {/* ── ÉVALUATIONS ── */}
      {current&&activeTab==="evaluations"&&(
        <div className="tab-content">
          <table className="notes-table">
            <thead><tr><th>Disciplines</th><th>Moyenne élève</th>{!isAnnee&&<th>Moy. classe</th>}<th>Évaluations</th>{canEdit&&!isAnnee&&<th></th>}</tr></thead>
            <tbody>
              {current.notes.map((row,i)=>{
                const cs=classStats[row.matiere];
                return(
                  <tr key={i}>
                    <td><span className="matiere-name">{row.matiere.toUpperCase()}</span><span className="prof-name">{row.prof}</span></td>
                    <td className="center bold">{row.moyenne}</td>
                    {!isAnnee&&<td className="center muted">{cs?.moyenneClasse||"—"}</td>}
                    <td>
                      <div className="evals-cell">
                        {row.evals.map((ev,j)=>(
                          <span key={j} className="eval-pill">
                            {ev}
                            {canEdit&&!isAnnee&&<button className="eval-del" onClick={()=>removeNoteEleve(targetEleveId,activeReleve,row.matiere,j)}>×</button>}
                          </span>
                        ))}
                      </div>
                    </td>
                    {canEdit&&!isAnnee&&<td></td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="moyenne-generale">
            Moyenne générale élève : <strong>{current.notes.length?((current.notes.map(n=>parseFloat(n.moyenne.replace(",","."))).filter(v=>!isNaN(v)).reduce((a,b)=>a+b,0))/(current.notes.map(n=>parseFloat(n.moyenne.replace(",","."))).filter(v=>!isNaN(v)).length||1)).toFixed(2).replace(".",","):"—"}</strong>
            {eleveIdsClasse.length>1&&!isAnnee&&<span className="muted" style={{marginLeft:16}}>· Moy. classe calculée sur {eleveIdsClasse.length} élèves</span>}
          </div>
        </div>
      )}

      {/* ── MOYENNES ── */}
      {current&&activeTab==="moyennes"&&(
        <div className="tab-content">
          <table className="notes-table">
            <thead><tr><th>Discipline</th><th>Élève</th><th>Classe</th><th>Min</th><th>Max</th></tr></thead>
            <tbody>
              {current.notes.map((row,i)=>{
                const cs=classStats[row.matiere];
                return(
                  <tr key={i}>
                    <td><span className="matiere-name">{row.matiere.toUpperCase()}</span></td>
                    <td className="center bold">{row.moyenne}</td>
                    <td className="center">{cs?.moyenneClasse||"—"}</td>
                    <td className="center muted">{cs?.min||"—"}</td>
                    <td className="center muted">{cs?.max||"—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── COMPÉTENCES ── */}
      {current&&activeTab==="competences"&&(
        <div className="tab-content">
          {current.competences.length===0
            ?<EmptyState label="compétences"/>
            :(
              <table className="notes-table comp-table">
                <thead><tr><th>Discipline</th><th>Éléments de programme</th><th>Non atteints</th><th>Part. atteints</th><th>Atteints</th><th>Dépassés</th></tr></thead>
                <tbody>
                  {current.competences.map(groupe=>groupe.items.map((item,j)=>(
                    <tr key={`${groupe.matiere}-${j}`}>
                      {j===0&&<td rowSpan={groupe.items.length} className="matiere-cell">{groupe.matiere.toUpperCase()}</td>}
                      <td>{item.label}</td>
                      <td className="center">{item.level==="non"?"●":""}</td>
                      <td className="center">{item.level==="partiellement"?"●":""}</td>
                      <td className="center">{item.level==="atteints"?"●":""}</td>
                      <td className="center">{item.level==="depasses"?"●":""}</td>
                    </tr>
                  )))}
                </tbody>
              </table>
            )
          }
        </div>
      )}

      {/* ── GRAPHIQUES ── */}
      {current&&activeTab==="graphiques"&&(
        <div className="tab-content graphiques">
          <h3 style={{marginBottom:20,color:"#1e3a8a"}}>Évolution des moyennes</h3>
          <div className="graph-bars">
            {current.notes.map((row,i)=>{
              const val=parseFloat(row.moyenne.replace(",","."));
              const pct=(val/20)*100;
              const color=val>=16?"#22c55e":val>=12?"#3b82f6":"#f97316";
              return(
                <div key={i} className="graph-row">
                  <span className="graph-label">{row.matiere}</span>
                  <div className="graph-bar-bg"><div className="graph-bar-fill bar-grow" style={{width:`${pct}%`,background:color,animationDelay:`${i*0.06}s`}}/></div>
                  <span className="graph-value">{row.moyenne}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
