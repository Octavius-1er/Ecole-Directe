import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useData } from "../DataContext";
import "./VieScolaire.css";

export default function VieScolaire(){
  const {user,accounts}=useAuth();
  const {classes,getAbsencesEleve,getPunitionsEleve,addAbsence,removeAbsence,addPunition,removePunition}=useData();
  const canEdit=user?.role==="admin";

  // Sélecteur de classe + élève
  const [selectedClasse,setSelectedClasse]=useState(
    user?.role==="eleve" ? (accounts.find(a=>a.id===user.id)?.classeId||"") : Object.keys(classes)[0]||""
  );
  const elevesDeClasse=accounts.filter(a=>a.role==="eleve"&&a.classeId===selectedClasse);
  const [selectedEleve,setSelectedEleve]=useState(user?.role==="eleve"?user.id:null);
  const targetId=user?.role==="eleve"?user.id:selectedEleve;

  const absences=targetId?getAbsencesEleve(targetId):[];
  const punitions=targetId?getPunitionsEleve(targetId):[];

  const [tab,setTab]=useState("absences");
  const [showAddA,setShowAddA]=useState(false);
  const [showAddP,setShowAddP]=useState(false);
  const [newA,setNewA]=useState({date:"",duree:"",justifiee:"Oui",motif:""});
  const [newP,setNewP]=useState({date:"",type:"Retenue",motif:"",prof:""});
  const [msg,setMsg]=useState("");

  function flash(m){setMsg(m);setTimeout(()=>setMsg(""),3000);}

  function handleAddAbsence(e){
    e.preventDefault();if(!targetId)return;
    addAbsence(targetId,newA);
    flash("Absence ajoutée ✓");
    setNewA({date:"",duree:"",justifiee:"Oui",motif:""});
  }
  function handleAddPunition(e){
    e.preventDefault();if(!targetId)return;
    addPunition(targetId,newP);
    flash("Punition ajoutée ✓");
    setNewP({date:"",type:"Retenue",motif:"",prof:""});
  }

  const targetAccount=accounts.find(a=>a.id===targetId);

  return(
    <div className="vs-container">
      <h1 className="vs-title">Vie scolaire</h1>

      {/* Sélecteur élève pour admin */}
      {canEdit&&(
        <div className="vs-selector">
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
          {targetAccount&&<span className="selector-eleve-chip">👤 {targetAccount.prenom} {targetAccount.nom}</span>}
        </div>
      )}

      {!targetId&&canEdit&&<div className="vs-empty">Sélectionnez un élève pour voir sa vie scolaire.</div>}

      {targetId&&(
        <>
          <div className="vs-tabs">
            <button className={`vs-tab ${tab==="absences"?"active":""}`} onClick={()=>setTab("absences")}>
              Absences <span className="vs-badge">{absences.length}</span>
            </button>
            <button className={`vs-tab ${tab==="punitions"?"active":""}`} onClick={()=>setTab("punitions")}>
              Punitions <span className="vs-badge red">{punitions.length}</span>
            </button>
          </div>

          {msg&&<div className="vs-flash">{msg}</div>}

          {tab==="absences"&&(
            <div className="vs-section">
              {canEdit&&<div className="vs-actions"><button className="btn-add-note" onClick={()=>setShowAddA(v=>!v)}>{showAddA?"✕ Fermer":"➕ Ajouter une absence"}</button></div>}
              {canEdit&&showAddA&&(
                <form className="add-note-form" onSubmit={handleAddAbsence}>
                  <input type="text" placeholder="Date (ex: Le 10 mars 2026)" value={newA.date} onChange={e=>setNewA(p=>({...p,date:e.target.value}))} required/>
                  <input type="text" placeholder="Durée (ex: 2 demi-journées)" value={newA.duree} onChange={e=>setNewA(p=>({...p,duree:e.target.value}))}/>
                  <select value={newA.justifiee} onChange={e=>setNewA(p=>({...p,justifiee:e.target.value}))}>
                    <option value="Oui">Justifiée : Oui</option>
                    <option value="Non">Justifiée : Non</option>
                    <option value="En attente">En attente</option>
                  </select>
                  <input type="text" placeholder="Motif" value={newA.motif} onChange={e=>setNewA(p=>({...p,motif:e.target.value}))}/>
                  <button type="submit" className="btn-primary-sm">Ajouter</button>
                </form>
              )}
              {absences.length===0
                ?<div className="vs-empty">✓ Aucune absence enregistrée.</div>
                :(
                  <table className="vs-table">
                    <thead><tr><th>Période</th><th>Durée</th><th>Justifiée</th><th>Motif</th>{canEdit&&<th>Actions</th>}</tr></thead>
                    <tbody>
                      {absences.map(a=>(
                        <tr key={a.id}>
                          <td>{a.date}</td><td>{a.duree}</td>
                          <td><span className={`justif-badge ${a.justifiee==="Oui"?"green":a.justifiee==="Non"?"red":"orange"}`}>{a.justifiee}</span></td>
                          <td>{a.motif}</td>
                          {canEdit&&<td><button className="btn-del-sm" onClick={()=>removeAbsence(targetId,a.id)}>✕</button></td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              }
            </div>
          )}

          {tab==="punitions"&&(
            <div className="vs-section">
              {canEdit&&<div className="vs-actions"><button className="btn-add-note" onClick={()=>setShowAddP(v=>!v)}>{showAddP?"✕ Fermer":"➕ Ajouter une punition"}</button></div>}
              {canEdit&&showAddP&&(
                <form className="add-note-form" onSubmit={handleAddPunition}>
                  <input type="text" placeholder="Date (ex: 10 mars 2026)" value={newP.date} onChange={e=>setNewP(p=>({...p,date:e.target.value}))} required/>
                  <select value={newP.type} onChange={e=>setNewP(p=>({...p,type:e.target.value}))}>
                    <option>Retenue</option><option>Avertissement</option><option>Exclusion</option><option>Travail supplémentaire</option>
                  </select>
                  <input type="text" placeholder="Motif" value={newP.motif} onChange={e=>setNewP(p=>({...p,motif:e.target.value}))} required/>
                  <input type="text" placeholder="Professeur" value={newP.prof} onChange={e=>setNewP(p=>({...p,prof:e.target.value}))}/>
                  <button type="submit" className="btn-primary-sm">Ajouter</button>
                </form>
              )}
              {punitions.length===0
                ?<div className="vs-empty">✓ Aucune punition enregistrée.</div>
                :(
                  <table className="vs-table">
                    <thead><tr><th>Date</th><th>Type</th><th>Motif</th><th>Professeur</th>{canEdit&&<th>Actions</th>}</tr></thead>
                    <tbody>
                      {punitions.map(p=>(
                        <tr key={p.id}>
                          <td>{p.date}</td>
                          <td><span className="justif-badge red">{p.type}</span></td>
                          <td>{p.motif}</td><td>{p.prof}</td>
                          {canEdit&&<td><button className="btn-del-sm" onClick={()=>removePunition(targetId,p.id)}>✕</button></td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              }
            </div>
          )}
        </>
      )}
    </div>
  );
}
