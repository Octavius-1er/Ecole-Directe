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

function parseVal(v) {
  const s = String(v).replace(",",".");
  const m = s.match(/^([\d.]+)\/([\d.]+)$/);
  if (m) return (parseFloat(m[1])/parseFloat(m[2]))*20;
  return parseFloat(s);
}
function fmt(n) {
  if (n == null || isNaN(n)) return "—";
  return typeof n === "number" ? n.toFixed(2).replace(".",",") : n;
}

export default function Notes() {
  const { user, accounts } = useAuth();
  const { classes, evals, getEvalsEleve, getEvalsClasse, getMoyenneEleve, getStatsMatiere, addEval, deleteEval } = useData();
  const canEdit = user?.role === "admin" || user?.role === "prof";

  // ── Classe sélectionnée ──
  const classeIds = Object.keys(classes || {});
  const [selectedClasse, setSelectedClasse] = useState("");
  useEffect(() => {
    if (!selectedClasse && classeIds.length > 0) setSelectedClasse(classeIds[0]);
  }, [classeIds.join(",")]);

  const classeId = user?.role === "eleve" ? (user?.classeId || "") : selectedClasse;
  const elevesClasse = (accounts || []).filter(a => a.role === "eleve" && a.classeId === classeId);

  // ── Élève sélectionné (prof/admin) ──
  const [selectedEleve, setSelectedEleve] = useState("");
  const targetEleveId = user?.role === "eleve" ? user.id : selectedEleve;

  // ── Trimestre / relevé ──
  const [activeTrimestre, setActiveTrimestre] = useState("t1");
  const [activeReleve, setActiveReleve] = useState("r1");
  const isAnnee = activeTrimestre === "annee";
  const trimestre = TRIMESTRES.find(t => t.id === activeTrimestre);

  function handleTrimestreChange(t) {
    setActiveTrimestre(t.id);
    if (t.releves.length > 0) setActiveReleve(t.releves[0].id);
  }

  // ── Modal détail éval ──
  const [detailEval, setDetailEval] = useState(null);

  // ── Formulaire nouvelle éval ──
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nom:"", matiere:"", type:"Contrôle", date:"", notes:{}, competences:[] });
  const [compInput, setCompInput] = useState({ label:"", desc:"" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // ── Données calculées ──
  const evalsReleve = useMemo(() => {
    if (!classeId || !activeReleve || !Array.isArray(evals)) return [];
    return evals.filter(e => e.classeId === classeId && e.releveId === activeReleve);
  }, [evals, classeId, activeReleve]);

  const matieresDansReleve = useMemo(() => {
    if (!targetEleveId || !classeId || !activeReleve || !Array.isArray(evals)) return [];
    const evs = evals.filter(e => e.classeId === classeId && e.releveId === activeReleve && e.notes?.[targetEleveId] != null);
    return [...new Set(evs.map(e => e.matiere))];
  }, [evals, targetEleveId, classeId, activeReleve]);

  const moyGenReleve = useMemo(() => {
    if (!targetEleveId || !classeId || !activeReleve || !Array.isArray(evals)) return null;
    const vals = evals
      .filter(e => e.classeId === classeId && e.releveId === activeReleve && e.notes?.[targetEleveId] != null)
      .map(e => parseVal(e.notes[targetEleveId]))
      .filter(v => !isNaN(v));
    return vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : null;
  }, [evals, targetEleveId, classeId, activeReleve]);

  // ── Handlers ──
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

  // ── RENDER ──
  return (
    <div className="notes-container">
      <h1 className="notes-title">Notes et Moyennes</h1>

      {/* ── Sélecteur classe + élève (prof/admin) ── */}
      {canEdit && (
        <div className="notes-selector-bar">
          <div className="selector-group">
            <label>Classe</label>
            <select value={selectedClasse} onChange={e => { setSelectedClasse(e.target.value); setSelectedEleve(""); setShowForm(false); }}>
              <option value="">— Choisir —</option>
              {classeIds.map(cid => <option key={cid} value={cid}>{classes[cid]?.nom}</option>)}
            </select>
          </div>
          {classeId && (
            <div className="selector-group">
              <label>Voir les notes d'un élève</label>
              <select value={selectedEleve} onChange={e => setSelectedEleve(e.target.value)}>
                <option value="">— Vue liste évals —</option>
                {elevesClasse.map(a => <option key={a.id} value={a.id}>{a.prenom} {a.nom}</option>)}
              </select>
            </div>
          )}
        </div>
      )}

      {/* ── Onglets trimestres ── */}
      <div className="notes-tabs">
        {TRIMESTRES.map(t => (
          <button key={t.id} className={`notes-tab ${activeTrimestre===t.id?"active":""}`}
            onClick={() => handleTrimestreChange(t)}>{t.label}</button>
        ))}
      </div>

      {/* ── Sous-onglets relevés ── */}
      {!isAnnee && trimestre?.releves.length > 0 && (
        <div className="notes-releves">
          {trimestre.releves.map(r => (
            <button key={r.id} className={`releve-tab ${activeReleve===r.id?"active":""}`}
              onClick={() => setActiveReleve(r.id)}>{r.label}</button>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════
          VUE PROF / ADMIN — pas d'élève choisi
          Affiche le formulaire + liste des évals
      ═══════════════════════════════════════ */}
      {canEdit && !targetEleveId && (
        <>
          {!classeId ? (
            <div className="empty-state"><span className="empty-icon">🏫</span><p>Sélectionnez une classe pour commencer.</p></div>
          ) : !isAnnee ? (
            <>
              {/* Bouton saisir éval */}
              <div className="notes-actions">
                <button className="btn-add-note" onClick={() => setShowForm(v => !v)}>
                  {showForm ? "✕ Annuler" : "➕ Saisir une évaluation"}
                </button>
                {msg && <span className="add-success">{msg}</span>}
              </div>

              {/* ── FORMULAIRE SAISIE ÉVAL ── */}
              {showForm && (
                <form className="eval-form" onSubmit={handleSubmitEval}>
                  <h3 className="eval-form-title">
                    Nouvelle évaluation — <span style={{color:"#2563eb"}}>{classes[classeId]?.nom}</span>
                  </h3>

                  {/* Infos éval */}
                  <div className="eval-form-grid">
                    <div className="eval-field">
                      <label>Nom de l'évaluation *</label>
                      <input type="text" placeholder="ex: Questions No et Moi"
                        value={form.nom} onChange={e => setForm(f=>({...f,nom:e.target.value}))} required />
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
                    <h4>Notes des élèves <span className="optional">— saisir sur 20 ou fraction (ex: 14/20)</span></h4>
                    {elevesClasse.length === 0
                      ? <p className="no-eleves">Aucun élève dans cette classe.</p>
                      : <div className="eval-notes-grid">
                          {elevesClasse.map(eleve => (
                            <div key={eleve.id} className="eval-note-row">
                              <span className="eval-eleve-name">{eleve.prenom} {eleve.nom}</span>
                              <input type="text" placeholder="—" className="eval-note-input"
                                value={form.notes[eleve.id] || ""}
                                onChange={e => setForm(f => ({ ...f, notes: { ...f.notes, [eleve.id]: e.target.value } }))} />
                            </div>
                          ))}
                        </div>
                    }
                  </div>

                  {/* Compétences */}
                  <div className="eval-comp-section">
                    <h4>Compétences <span className="optional">(optionnel)</span></h4>
                    <div className="eval-comp-add">
                      <input type="text" placeholder="Intitulé (ex: Lire)"
                        value={compInput.label} onChange={e => setCompInput(c=>({...c,label:e.target.value}))} />
                      <input type="text" placeholder="Description (ex: Contrôler sa compréhension...)"
                        value={compInput.desc} onChange={e => setCompInput(c=>({...c,desc:e.target.value}))} />
                      <button type="button" className="btn-add-note" onClick={addComp}>+ Ajouter</button>
                    </div>
                    {form.competences.map((c,i) => (
                      <div key={i} className="comp-chip">
                        <span><strong>{c.label}</strong>{c.desc ? ` — ${c.desc}` : ""}</span>
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

              {/* Liste des évals saisies */}
              <div className="notes-card">
                <h3 className="card-subtitle">Évaluations du relevé — {classes[classeId]?.nom}</h3>
                {evalsReleve.length === 0
                  ? <div className="empty-state"><span className="empty-icon">📭</span><p>Aucune évaluation saisie pour ce relevé.</p></div>
                  : <div className="eval-list">
                      {evalsReleve.map(ev => {
                        const notees = Object.keys(ev.notes||{}).length;
                        return (
                          <div key={ev.id} className="eval-list-item">
                            <div className="eval-list-left">
                              <span className="eval-list-nom">{ev.nom}</span>
                              <span className="eval-list-meta">{ev.matiere} · {ev.type}{ev.date ? ` · ${new Date(ev.date).toLocaleDateString("fr-FR")}` : ""}</span>
                              <span className="eval-list-meta">{notees} élève{notees>1?"s":""} noté{notees>1?"s":""}</span>
                            </div>
                            <button className="btn-del-sm" onClick={() => deleteEval(ev.id)}>🗑 Supprimer</button>
                          </div>
                        );
                      })}
                    </div>
                }
              </div>
            </>
          ) : (
            <div className="empty-state"><span className="empty-icon">📅</span><p>Vue annuelle non disponible sans élève sélectionné.</p></div>
          )}
        </>
      )}

      {/* ═══════════════════════════════════════
          VUE ÉLÈVE ou prof ayant choisi un élève
      ═══════════════════════════════════════ */}
      {targetEleveId && (
        <>
          {/* Vue ANNÉE */}
          {isAnnee ? (
            <div className="notes-card">
              <table className="notes-table">
                <thead><tr><th>Trimestre</th><th>Moyenne générale</th></tr></thead>
                <tbody>
                  {["t1","t2","t3"].map(tid => {
                    const rels = TRIMESTRES.find(t=>t.id===tid)?.releves||[];
                    const vals = rels.flatMap(r =>
                      (evals||[]).filter(e=>e.classeId===classeId&&e.releveId===r.id&&e.notes?.[targetEleveId]!=null)
                        .map(e=>parseVal(e.notes[targetEleveId])).filter(v=>!isNaN(v))
                    );
                    const moy = vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : null;
                    return <tr key={tid}><td>{TRIMESTRES.find(t=>t.id===tid)?.label}</td><td><strong>{fmt(moy)}</strong></td></tr>;
                  })}
                  <tr className="annee-row">
                    <td><strong>Moyenne annuelle</strong></td>
                    <td><strong style={{color:"#1a4fa0",fontSize:17}}>{fmt(
                      (() => {
                        const allVals = ["r1","r2","r3","r4","r5","r6"].flatMap(rid =>
                          (evals||[]).filter(e=>e.classeId===classeId&&e.releveId===rid&&e.notes?.[targetEleveId]!=null)
                            .map(e=>parseVal(e.notes[targetEleveId])).filter(v=>!isNaN(v))
                        );
                        return allVals.length ? allVals.reduce((a,b)=>a+b,0)/allVals.length : null;
                      })()
                    )}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            /* Vue RELEVÉ */
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
                          const evsMat = (evals||[]).filter(e =>
                            e.classeId===classeId && e.releveId===activeReleve &&
                            e.matiere===mat && e.notes?.[targetEleveId]!=null
                          ).map(e => ({ ...e, noteEleve: e.notes[targetEleveId] }));

                          const valsEleve = evsMat.map(e=>parseVal(e.noteEleve)).filter(v=>!isNaN(v));
                          const moyEleveMat = valsEleve.length ? valsEleve.reduce((a,b)=>a+b,0)/valsEleve.length : null;

                          const allValsClasse = (evals||[])
                            .filter(e=>e.classeId===classeId&&e.releveId===activeReleve&&e.matiere===mat)
                            .flatMap(e=>Object.values(e.notes||{}).map(v=>parseVal(v)).filter(v=>!isNaN(v)));
                          const moyClasse = allValsClasse.length ? allValsClasse.reduce((a,b)=>a+b,0)/allValsClasse.length : null;

                          return (
                            <tr key={mat}>
                              <td className="td-matiere">{mat}</td>
                              <td><strong>{fmt(moyEleveMat)}</strong></td>
                              <td className="td-muted">{fmt(moyClasse)}</td>
                              <td>
                                <div className="eval-chips">
                                  {evsMat.map(ev => (
                                    <button key={ev.id} className="eval-chip" onClick={() => setDetailEval(ev)}>
                                      {ev.noteEleve}
                                      {canEdit && (
                                        <span className="chip-del" onClick={e=>{e.stopPropagation();deleteEval(ev.id);}}>×</span>
                                      )}
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
        </>
      )}

      {/* ═══════════════════════════════════════
          MODAL DÉTAIL ÉVALUATION
      ═══════════════════════════════════════ */}
      {detailEval && (
        <div className="modal-overlay" onClick={() => setDetailEval(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{detailEval.nom}</h2>
              <button className="modal-close" onClick={() => setDetailEval(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-info-grid">
                <div className="modal-info-item">
                  <span className="info-label">Matière</span>
                  <span>{detailEval.matiere}</span>
                </div>
                <div className="modal-info-item">
                  <span className="info-label">Type</span>
                  <span>{detailEval.type}</span>
                </div>
                {detailEval.date && (
                  <div className="modal-info-item">
                    <span className="info-label">Date</span>
                    <span>{new Date(detailEval.date).toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</span>
                  </div>
                )}
                <div className="modal-info-item">
                  <span className="info-label">Note de l'élève</span>
                  <span className="info-note">{detailEval.noteEleve}{/\//.test(String(detailEval.noteEleve)) ? "" : " / 20"}</span>
                </div>
              </div>

              {/* Stats classe */}
              {classeId && (() => {
                const allVals = Object.values(detailEval.notes||{}).map(v=>parseVal(v)).filter(v=>!isNaN(v));
                if (!allVals.length) return null;
                const moy = allVals.reduce((a,b)=>a+b,0)/allVals.length;
                return (
                  <div className="modal-stats">
                    <div className="stat-item"><span className="stat-label">Moy. classe</span><strong>{fmt(moy)}</strong></div>
                    <div className="stat-item"><span className="stat-label">Min</span><strong>{fmt(Math.min(...allVals))}</strong></div>
                    <div className="stat-item"><span className="stat-label">Max</span><strong>{fmt(Math.max(...allVals))}</strong></div>
                  </div>
                );
              })()}

              {/* Compétences */}
              {detailEval.competences?.length > 0 && (
                <div className="modal-comps">
                  <h4>Compétences</h4>
                  {detailEval.competences.map((c,i) => (
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
