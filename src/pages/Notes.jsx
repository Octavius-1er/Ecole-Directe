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

function fmt(n) { return n == null ? "—" : (typeof n === "number" ? n.toFixed(2).replace(".",",") : n); }
function parseVal(v) {
  const s = String(v).replace(",",".");
  const m = s.match(/^([\d.]+)\/([\d.]+)$/);
  if (m) return (parseFloat(m[1])/parseFloat(m[2]))*20;
  return parseFloat(s);
}

export default function Notes() {
  const { user, accounts } = useAuth();
  const { classes, evals, getEvalsEleve, getEvalsClasse, getMoyenneEleve, getStatsMatiere, addEval, deleteEval } = useData();
  const canEdit = user?.role === "admin" || user?.role === "prof";

  // Sélection classe / élève
  const [selectedClasse, setSelectedClasse] = useState("");
  useEffect(() => {
    if (!selectedClasse && Object.keys(classes).length > 0) setSelectedClasse(Object.keys(classes)[0]);
  }, [classes]);
  const classeId = user?.role === "eleve" ? (user?.classeId || "") : selectedClasse;
  const elevesClasse = accounts.filter(a => a.role === "eleve" && (!classeId || a.classeId === classeId));
  const [selectedEleve, setSelectedEleve] = useState(null);
  const targetEleveId = user?.role === "eleve" ? user.id : selectedEleve;
  const targetAccount = accounts.find(a => a.id === targetEleveId);

  // Trimestre / relevé
  const [activeTrimestre, setActiveTrimestre] = useState("t1");
  const [activeReleve,    setActiveReleve]    = useState("r1");
  const isAnnee = activeTrimestre === "annee";
  const trimestre = TRIMESTRES.find(t => t.id === activeTrimestre);

  // Modal détail
  const [detailEval, setDetailEval] = useState(null);

  // Formulaire nouvelle éval
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nom:"", matiere:"", type:"Contrôle", date:"", notes:{}, competences:[] });
  const [compInput, setCompInput] = useState({ label:"", desc:"" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // Évals pour l'affichage
  const evalsReleve = useMemo(() => {
    if (!classeId || !activeReleve || !evals) return [];
    try { return getEvalsClasse(classeId, activeReleve); } catch(e) { return []; }
  }, [evals, classeId, activeReleve]);

  // Matières distinctes dans ce relevé pour l'élève
  const matieresDansReleve = useMemo(() => {
    if (!targetEleveId || !classeId || !activeReleve || !evals) return [];
    try { const evs = getEvalsEleve(targetEleveId, classeId, activeReleve); return [...new Set(evs.map(e => e.matiere))]; } catch(e) { return []; }
  }, [evals, targetEleveId, classeId, activeReleve]);

  // Moyenne générale élève sur le relevé
  const moyGenReleve = useMemo(() => {
    if (!targetEleveId || !classeId || !activeReleve || !evals) return null;
    try { return getMoyenneEleve(targetEleveId, classeId, activeReleve); } catch(e) { return null; }
  }, [evals, targetEleveId, classeId, activeReleve]);

  // Moyenne générale sur l'année
  const moyAnnee = useMemo(() => {
    if (!targetEleveId || !classeId || !evals) return null;
    try {
    const allVals = ["r1","r2","r3","r4","r5","r6"]
      .map(rid => getMoyenneEleve(targetEleveId, classeId, rid))
      .filter(v => v != null);
    if (!allVals.length) return null;
    return allVals.reduce((a,b)=>a+b,0)/allVals.length;
    } catch(e) { return null; }
  }, [evals, targetEleveId, classeId]);

  function handleTrimestreChange(t) {
    setActiveTrimestre(t.id);
    if (t.releves.length > 0) setActiveReleve(t.releves[0].id);
  }

  async function handleSubmitEval(e) {
    e.preventDefault();
    if (!form.nom || !form.matiere || !classeId) return;
    setSaving(true);
    await addEval({ ...form, classeId, releveId: activeReleve });
    setForm({ nom:"", matiere:"", type:"Contrôle", date:"", notes:{}, competences:[] });
    setCompInput({ label:"", desc:"" });
    setShowForm(false);
    setMsg("Évaluation ajoutée ✓");
    setTimeout(() => setMsg(""), 3000);
    setSaving(false);
  }

  function addComp() {
    if (!compInput.label) return;
    setForm(f => ({ ...f, competences: [...f.competences, { ...compInput, niveau:"" }] }));
    setCompInput({ label:"", desc:"" });
  }

  return (
    <div className="notes-container">
      <h1 className="notes-title">Notes et Moyennes</h1>

      {/* ── Sélecteurs classe / élève ── */}
      {canEdit && (
        <div className="notes-selector-bar">
          <div className="selector-group">
            <label>Classe</label>
            <select value={selectedClasse} onChange={e => { setSelectedClasse(e.target.value); setSelectedEleve(null); }}>
              <option value="">— Toutes —</option>
              {Object.values(classes).map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>
          </div>
          <div className="selector-group">
            <label>Élève</label>
            <select value={selectedEleve||""} onChange={e => setSelectedEleve(e.target.value||null)}>
              <option value="">— Choisir —</option>
              {elevesClasse.map(a => <option key={a.id} value={a.id}>{a.prenom} {a.nom}</option>)}
            </select>
          </div>
          {targetAccount && <div className="selector-eleve-chip">👤 {targetAccount.prenom} {targetAccount.nom}</div>}
        </div>
      )}

      {/* ── Onglets trimestres ── */}
      <div className="notes-tabs">
        {TRIMESTRES.map(t => (
          <button key={t.id} className={`notes-tab ${activeTrimestre===t.id?"active":""}`}
            onClick={() => handleTrimestreChange(t)}>{t.label}</button>
        ))}
      </div>

      {/* ── Onglets relevés ── */}
      {!isAnnee && trimestre?.releves.length > 0 && (
        <div className="notes-releves">
          {trimestre.releves.map(r => (
            <button key={r.id} className={`releve-tab ${activeReleve===r.id?"active":""}`}
              onClick={() => setActiveReleve(r.id)}>{r.label}</button>
          ))}
        </div>
      )}

      {/* ── Bouton ajouter éval (prof/admin) ── */}
      {canEdit && !isAnnee && classeId && (
        <div className="notes-actions">
          <button className="btn-add-note" onClick={() => setShowForm(v => !v)}>
            {showForm ? "✕ Fermer" : "➕ Saisir une évaluation"}
          </button>
          {msg && <span className="add-success">{msg}</span>}
        </div>
      )}

      {/* ── Formulaire nouvelle éval ── */}
      {canEdit && showForm && !isAnnee && classeId && (
        <form className="eval-form" onSubmit={handleSubmitEval}>
          <h3 className="eval-form-title">Nouvelle évaluation — {classes[classeId]?.nom}</h3>

          <div className="eval-form-grid">
            <div className="eval-field">
              <label>Nom de l'évaluation *</label>
              <input type="text" placeholder="ex: Questions No et Moi" value={form.nom}
                onChange={e => setForm(f=>({...f,nom:e.target.value}))} required />
            </div>
            <div className="eval-field">
              <label>Matière *</label>
              <select value={form.matiere} onChange={e => setForm(f=>({...f,matiere:e.target.value}))} required>
                <option value="">— Choisir —</option>
                {MATIERES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="eval-field">
              <label>Type</label>
              <select value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))}>
                {TYPES_EVAL.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="eval-field">
              <label>Date</label>
              <input type="date" value={form.date} onChange={e => setForm(f=>({...f,date:e.target.value}))} />
            </div>
          </div>

          {/* Notes de tous les élèves */}
          <div className="eval-notes-section">
            <h4>Notes des élèves</h4>
            <div className="eval-notes-grid">
              {elevesClasse.map(eleve => (
                <div key={eleve.id} className="eval-note-row">
                  <span className="eval-eleve-name">{eleve.prenom} {eleve.nom}</span>
                  <input type="text" placeholder="—" className="eval-note-input"
                    value={form.notes[eleve.id] || ""}
                    onChange={e => setForm(f => ({ ...f, notes: { ...f.notes, [eleve.id]: e.target.value } }))} />
                </div>
              ))}
            </div>
          </div>

          {/* Compétences */}
          <div className="eval-comp-section">
            <h4>Compétences <span className="optional">(optionnel)</span></h4>
            <div className="eval-comp-add">
              <input type="text" placeholder="Intitulé (ex: Lire)" value={compInput.label}
                onChange={e => setCompInput(c=>({...c,label:e.target.value}))} />
              <input type="text" placeholder="Description (ex: Contrôler sa compréhension...)" value={compInput.desc}
                onChange={e => setCompInput(c=>({...c,desc:e.target.value}))} />
              <button type="button" className="btn-add-note" onClick={addComp}>+ Ajouter</button>
            </div>
            {form.competences.map((c,i) => (
              <div key={i} className="comp-chip">
                <span>{c.label} {c.desc && `— ${c.desc}`}</span>
                <button type="button" onClick={() => setForm(f=>({...f,competences:f.competences.filter((_,j)=>j!==i)}))}>×</button>
              </div>
            ))}
          </div>

          <div className="eval-form-footer">
            <button type="submit" className="btn-primary-sm" disabled={saving}>
              {saving ? "Enregistrement..." : "✓ Enregistrer l'évaluation"}
            </button>
          </div>
        </form>
      )}

      {/* ── Vue élève / vue prof ── */}
      {!targetEleveId && canEdit && (
        <div className="empty-state"><span className="empty-icon">👆</span><p>Sélectionnez un élève pour voir ses notes</p></div>
      )}

      {/* Vue ANNÉE */}
      {isAnnee && targetEleveId && (
        <div className="notes-card">
          <table className="notes-table">
            <thead><tr><th>Trimestre</th><th>Moyenne générale</th></tr></thead>
            <tbody>
              {["t1","t2","t3"].map(tid => {
                const rels = TRIMESTRES.find(t=>t.id===tid)?.releves||[];
                const vals = rels.map(r=>getMoyenneEleve(targetEleveId,classeId,r.id)).filter(v=>v!=null);
                const moy = vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : null;
                return <tr key={tid}><td>{TRIMESTRES.find(t=>t.id===tid)?.label}</td><td><strong>{fmt(moy)}</strong></td></tr>;
              })}
              <tr className="annee-row"><td><strong>Moyenne annuelle</strong></td><td><strong style={{color:"#1a4fa0",fontSize:17}}>{fmt(moyAnnee)}</strong></td></tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Vue RELEVÉ — par matière */}
      {!isAnnee && targetEleveId && classeId && (
        <div className="notes-card">
          {matieresDansReleve.length === 0
            ? <div className="empty-state"><span className="empty-icon">📭</span><p>Aucune note pour ce relevé.</p></div>
            : <>
              <table className="notes-table">
                <thead>
                  <tr>
                    <th>Discipline</th>
                    <th>Moy. élève</th>
                    <th>Moy. classe</th>
                    <th>Évaluations</th>
                  </tr>
                </thead>
                <tbody>
                  {matieresDansReleve.map(mat => {
                    const evsMat = getEvalsEleve(targetEleveId, classeId, activeReleve).filter(e=>e.matiere===mat);
                    const moy = getMoyenneEleve(targetEleveId, classeId, activeReleve);
                    const stats = getStatsMatiere(mat, classeId, activeReleve);
                    const moyMat = evsMat.length ? evsMat.map(e=>parseVal(e.noteEleve)).filter(v=>!isNaN(v)) : [];
                    const moyEleveMat = moyMat.length ? moyMat.reduce((a,b)=>a+b,0)/moyMat.length : null;
                    return (
                      <tr key={mat}>
                        <td className="td-matiere">{mat}</td>
                        <td><strong>{fmt(moyEleveMat)}</strong></td>
                        <td className="td-muted">{stats.moyenneClasse}</td>
                        <td>
                          <div className="eval-chips">
                            {evsMat.map(ev => (
                              <button key={ev.id} className="eval-chip" onClick={() => setDetailEval(ev)}>
                                {ev.noteEleve}
                                {canEdit && <span className="chip-del" onClick={e=>{e.stopPropagation();deleteEval(ev.id);}}>×</span>}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="moy-generale">
                Moyenne générale : <strong>{fmt(moyGenReleve)}</strong>
              </div>
            </>
          }
        </div>
      )}

      {/* Vue prof — liste des évals du relevé */}
      {!isAnnee && canEdit && !targetEleveId && classeId && (
        <div className="notes-card">
          <h3 className="card-subtitle">Évaluations saisies — {classes[classeId]?.nom}</h3>
          {evalsReleve.length === 0
            ? <div className="empty-state"><span className="empty-icon">📭</span><p>Aucune évaluation pour ce relevé.</p></div>
            : <div className="eval-list">
              {evalsReleve.map(ev => (
                <div key={ev.id} className="eval-list-item">
                  <div className="eval-list-left">
                    <span className="eval-list-nom">{ev.nom}</span>
                    <span className="eval-list-meta">{ev.matiere} · {ev.type}{ev.date ? ` · ${new Date(ev.date).toLocaleDateString("fr-FR")}` : ""}</span>
                    <span className="eval-list-meta">{Object.keys(ev.notes||{}).length} élève(s) noté(s)</span>
                  </div>
                  <button className="btn-del-sm" onClick={() => deleteEval(ev.id)}>🗑 Supprimer</button>
                </div>
              ))}
            </div>
          }
        </div>
      )}

      {/* ── Modal détail évaluation ── */}
      {detailEval && (
        <div className="modal-overlay" onClick={() => setDetailEval(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{detailEval.nom}</h2>
              <button className="modal-close" onClick={() => setDetailEval(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-info-grid">
                <div className="modal-info-item"><span className="info-label">Matière</span><span>{detailEval.matiere}</span></div>
                <div className="modal-info-item"><span className="info-label">Type</span><span>{detailEval.type}</span></div>
                {detailEval.date && <div className="modal-info-item"><span className="info-label">Date</span><span>{new Date(detailEval.date).toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</span></div>}
                <div className="modal-info-item"><span className="info-label">Note de l'élève</span><span className="info-note">{detailEval.noteEleve} / 20</span></div>
              </div>

              {/* Stats classe */}
              {classeId && (() => {
                const stats = getStatsMatiere(detailEval.matiere, classeId, activeReleve);
                return (
                  <div className="modal-stats">
                    <div className="stat-item"><span className="stat-label">Moy. classe</span><strong>{stats.moyenneClasse}</strong></div>
                    <div className="stat-item"><span className="stat-label">Min</span><strong>{stats.min}</strong></div>
                    <div className="stat-item"><span className="stat-label">Max</span><strong>{stats.max}</strong></div>
                  </div>
                );
              })()}

              {/* Compétences */}
              {detailEval.competences?.length > 0 && (
                <div className="modal-comps">
                  <h4>Compétences</h4>
                  {detailEval.competences.map((c, i) => (
                    <div key={i} className="modal-comp-row">
                      <div className="comp-info">
                        <strong>{c.label}</strong>
                        {c.desc && <span className="comp-desc">{c.desc}</span>}
                      </div>
                      <div className="comp-niveaux">
                        {["Non atteints","Partiellement","Atteints","Dépassés"].map(n => (
                          <span key={n} className={`comp-niveau ${c.niveau===n?"active":""}`}>{n}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
