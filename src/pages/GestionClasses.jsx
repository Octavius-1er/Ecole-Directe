import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useData } from "../DataContext";
import "./GestionClasses.css";

const NIVEAUX = ["6ème","5ème","4ème","3ème","2nde","1ère","Terminale"];

export default function GestionClasses() {
  const { accounts, updateAccount } = useAuth();
  const { classes, addClass, updateClass, deleteClass } = useData();

  const [newClasse, setNewClasse] = useState({ nom: "", niveau: "5ème" });
  const [editId, setEditId]  = useState(null);
  const [editNom, setEditNom] = useState("");
  const [selectedClasse, setSelectedClasse] = useState(Object.keys(classes)[0] || null);
  const [msg, setMsg] = useState("");

  const eleves = accounts.filter(a => a.role === "eleve");
  const classeList = Object.values(classes);

  function flash(m){ setMsg(m); setTimeout(()=>setMsg(""),3000); }

  function handleAddClasse(e){
    e.preventDefault();
    if(!newClasse.nom.trim()) return;
    addClass(newClasse.nom.trim(), newClasse.niveau);
    flash(`Classe "${newClasse.nom}" créée ✓`);
    setNewClasse({nom:"",niveau:"5ème"});
  }

  function handleDeleteClasse(id){
    if(!window.confirm("Supprimer cette classe ? Les élèves ne seront plus assignés.")) return;
    // Désassigner les élèves
    eleves.filter(e=>e.classeId===id).forEach(e=>updateAccount(e.id,{classeId:null}));
    deleteClass(id);
    if(selectedClasse===id) setSelectedClasse(Object.keys(classes).find(k=>k!==id)||null);
    flash("Classe supprimée.");
  }

  function handleStartEdit(c){ setEditId(c.id); setEditNom(c.nom); }
  function handleSaveEdit(id){
    if(!editNom.trim()) return;
    updateClass(id,{nom:editNom.trim()});
    setEditId(null);
    flash("Classe renommée ✓");
  }

  function handleAssign(eleveId, classeId){
    updateAccount(eleveId, { classeId: classeId || null });
    flash("Affectation mise à jour ✓");
  }

  const elevesInClasse = selectedClasse ? eleves.filter(e=>e.classeId===selectedClasse) : [];
  const elevesUnassigned = eleves.filter(e=>!e.classeId);

  return (
    <div className="gc-container">
      <h1 className="gc-title">Gestion des classes</h1>

      {msg && <div className="gc-flash">{msg}</div>}

      <div className="gc-grid">
        {/* ── Colonne gauche : liste + création des classes ── */}
        <div className="gc-left">
          <div className="gc-card">
            <h2>Créer une classe</h2>
            <form className="gc-form" onSubmit={handleAddClasse}>
              <input
                type="text"
                placeholder="Nom (ex: 5ème F EUROP.)"
                value={newClasse.nom}
                onChange={e=>setNewClasse(p=>({...p,nom:e.target.value}))}
                required
              />
              <select value={newClasse.niveau} onChange={e=>setNewClasse(p=>({...p,niveau:e.target.value}))}>
                {NIVEAUX.map(n=><option key={n}>{n}</option>)}
              </select>
              <button type="submit" className="btn-primary-sm">Créer</button>
            </form>
          </div>

          <div className="gc-card">
            <h2>Classes ({classeList.length})</h2>
            {classeList.length===0 && <p className="gc-empty">Aucune classe créée.</p>}
            <div className="gc-class-list">
              {classeList.map(c=>{
                const count = eleves.filter(e=>e.classeId===c.id).length;
                return (
                  <div
                    key={c.id}
                    className={`gc-class-item ${selectedClasse===c.id?"active":""}`}
                    onClick={()=>setSelectedClasse(c.id)}
                  >
                    {editId===c.id ? (
                      <div className="gc-edit-row" onClick={e=>e.stopPropagation()}>
                        <input value={editNom} onChange={e=>setEditNom(e.target.value)} className="gc-edit-input" />
                        <button className="btn-save-sm" onClick={()=>handleSaveEdit(c.id)}>✓</button>
                        <button className="btn-cancel-sm" onClick={()=>setEditId(null)}>✕</button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <div className="gc-class-name">{c.nom}</div>
                          <div className="gc-class-meta">{c.niveau} · {count} élève{count>1?"s":""}</div>
                        </div>
                        <div className="gc-class-actions" onClick={e=>e.stopPropagation()}>
                          <button className="btn-edit-sm" onClick={()=>handleStartEdit(c)}>✏️</button>
                          <button className="btn-del-sm" onClick={()=>handleDeleteClasse(c.id)}>🗑</button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Colonne droite : élèves de la classe sélectionnée ── */}
        <div className="gc-right">
          {selectedClasse && classes[selectedClasse] ? (
            <>
              <div className="gc-card">
                <h2>Élèves de <span className="gc-classe-highlight">{classes[selectedClasse].nom}</span></h2>
                {elevesInClasse.length===0
                  ? <p className="gc-empty">Aucun élève dans cette classe.</p>
                  : (
                    <table className="gc-table">
                      <thead><tr><th>Élève</th><th>Identifiant</th><th>Retirer</th></tr></thead>
                      <tbody>
                        {elevesInClasse.map(e=>(
                          <tr key={e.id}>
                            <td>{e.prenom} {e.nom}</td>
                            <td><code>{e.username}</code></td>
                            <td>
                              <button className="btn-del-sm" onClick={()=>handleAssign(e.id,null)}>Retirer</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                }
              </div>

              <div className="gc-card">
                <h2>Ajouter des élèves à <span className="gc-classe-highlight">{classes[selectedClasse].nom}</span></h2>
                {/* Tous les élèves, avec select classe */}
                <table className="gc-table">
                  <thead><tr><th>Élève</th><th>Classe actuelle</th><th>Affecter à cette classe</th></tr></thead>
                  <tbody>
                    {eleves.filter(e=>e.classeId!==selectedClasse).map(e=>(
                      <tr key={e.id}>
                        <td>{e.prenom} {e.nom}</td>
                        <td>{e.classeId && classes[e.classeId] ? classes[e.classeId].nom : <span className="muted">Non affecté</span>}</td>
                        <td>
                          <button className="btn-assign-sm" onClick={()=>handleAssign(e.id,selectedClasse)}>
                            ➕ Ajouter
                          </button>
                        </td>
                      </tr>
                    ))}
                    {eleves.filter(e=>e.classeId!==selectedClasse).length===0 &&
                      <tr><td colSpan={3} className="gc-empty">Tous les élèves sont déjà dans cette classe.</td></tr>
                    }
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="gc-card gc-placeholder">
              <span>👈</span>
              <p>Sélectionnez une classe pour gérer ses élèves</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
