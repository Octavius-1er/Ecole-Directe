import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useData } from "../DataContext";
import "./CahierDeTexte.css";

const MONTH_NAMES=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const DAY_NAMES=["L","M","M","J","V","S","D"];
const WEEK_NAV=[{day:9,label:"Lun\n9"},{day:10,label:"Mar\n10"},{day:11,label:"Mer\n11"},{day:12,label:"Jeu\n12"},{day:13,label:"Ven\n13"},{day:14,label:"Sam\n14"}];
const MATIERES=["Français","Mathématiques","Anglais LV1","Allemand LV2","Histoire-Géo","SVT","Physique-Chimie","Technologie","EPS","Arts Plastiques","Éducation Musicale","LCA Latin"];

function buildCalendar(year,month){
  const firstDay=new Date(year,month,1).getDay();
  const offset=(firstDay===0?6:firstDay-1);
  const daysInMonth=new Date(year,month+1,0).getDate();
  const daysInPrev=new Date(year,month,0).getDate();
  const cells=[];
  for(let i=offset-1;i>=0;i--) cells.push({day:daysInPrev-i,currentMonth:false});
  for(let d=1;d<=daysInMonth;d++) cells.push({day:d,currentMonth:true});
  while(cells.length%7!==0) cells.push({day:cells.length-daysInMonth-offset+1,currentMonth:false});
  return cells;
}

export default function CahierDeTextes(){
  const {user,accounts}=useAuth();
  const {classes,getDevoirsClasse,addDevoirClasse,removeDevoirClasse,updateDevoirEffectue}=useData();
  const canEdit=user?.role==="admin"||user?.role==="prof";

  // Classe cible : si élève → sa classe ; si prof/admin → sélecteur
  const eleveClasse = user?.role==="eleve" ? user?.classeId : null;
  const [selectedClasse,setSelectedClasse]=useState(eleveClasse||Object.keys(classes)[0]||"");
  const classeId = user?.role==="eleve" ? eleveClasse : selectedClasse;

  const [calMonth,setCalMonth]=useState(2);
  const [calYear,setCalYear]=useState(2026);
  const [selected,setSelected]=useState({day:10,month:2,year:2026});
  const [showAdd,setShowAdd]=useState(false);
  const [newDevoir,setNewDevoir]=useState({matiere:"",description:"",donne:""});
  const [msg,setMsg]=useState("");

  const isMars2026=calMonth===2&&calYear===2026;
  const calDays=buildCalendar(calYear,calMonth);
  const devoirsClasse=classeId?getDevoirsClasse(classeId):{};
  const dayData=selected.month===2&&selected.year===2026?devoirsClasse[selected.day]:null;
  const dayLabel=dayData?.label||`${selected.day} ${MONTH_NAMES[selected.month]} ${selected.year}`;

  function prevMonth(){if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1);}
  function nextMonth(){if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1);}

  function handleAdd(e){
    e.preventDefault();
    if(!newDevoir.matiere||!newDevoir.description||!classeId) return;
    const dn=new Date(selected.year,selected.month,selected.day);
    const dayNames=["DIMANCHE","LUNDI","MARDI","MERCREDI","JEUDI","VENDREDI","SAMEDI"];
    const label=`${dayNames[dn.getDay()]} ${selected.day} ${MONTH_NAMES[selected.month].toUpperCase()}`;
    addDevoirClasse(classeId,selected.day,label,{
      matiere:newDevoir.matiere.toUpperCase(),
      description:newDevoir.description,
      donne:newDevoir.donne||`Donné le ${selected.day} ${MONTH_NAMES[selected.month]} par ${user.prenom} ${user.nom}`,
      effectue:false,
    });
    setMsg("Devoir ajouté ✓");
    setNewDevoir({matiere:"",description:"",donne:""});
    setTimeout(()=>setMsg(""),3000);
  }

  return(
    <div className="cdt-page">
      <h1 className="cdt-title">Cahier de textes</h1>

      {/* Sélecteur classe prof/admin */}
      {canEdit&&(
        <div className="cdt-class-selector">
          <label>Classe :</label>
          <select value={selectedClasse} onChange={e=>setSelectedClasse(e.target.value)}>
            <option value="">— Choisir —</option>
            {Object.values(classes).map(c=><option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
          {classes[selectedClasse]&&<span className="selector-eleve-chip">📚 {classes[selectedClasse].nom}</span>}
        </div>
      )}

      <div className="cdt-layout">
        {/* ── CALENDRIER ── */}
        <div className="cdt-calendar">
          <div className="cal-header">
            <button className="cal-nav" onClick={prevMonth}>‹</button>
            <span className="cal-month">{MONTH_NAMES[calMonth]} {calYear}</span>
            <button className="cal-nav" onClick={nextMonth}>›</button>
          </div>
          <div className="cal-grid">
            {DAY_NAMES.map((d,i)=><span key={i} className="cal-dayname">{d}</span>)}
            {calDays.map((d,i)=>(
              <span key={i}
                onClick={()=>d.currentMonth&&setSelected({day:d.day,month:calMonth,year:calYear})}
                className={["cal-day",!d.currentMonth?"other-month":"",d.currentMonth&&d.day===10&&isMars2026?"today":"",d.currentMonth&&d.day===selected.day&&calMonth===selected.month&&calYear===selected.year?"selected":"",d.currentMonth&&devoirsClasse[d.day]?.items?.length>0&&isMars2026?"has-devoirs":""].filter(Boolean).join(" ")}
              >{d.day}</span>
            ))}
          </div>
        </div>

        {/* ── DEVOIRS ── */}
        <div className="cdt-devoirs">
          <div className="cdt-devoirs-header">
            <div className="cdt-tab active">Travail à faire</div>
            {canEdit&&classeId&&(
              <button className="btn-add-note" onClick={()=>setShowAdd(v=>!v)}>
                {showAdd?"✕ Fermer":"➕ Ajouter un devoir"}
              </button>
            )}
          </div>

          {canEdit&&showAdd&&classeId&&(
            <form className="add-note-form" onSubmit={handleAdd}>
              <select value={newDevoir.matiere} onChange={e=>setNewDevoir(p=>({...p,matiere:e.target.value}))} required>
                <option value="">— Matière —</option>
                {MATIERES.map(m=><option key={m} value={m}>{m}</option>)}
              </select>
              <textarea placeholder="Description du devoir..." value={newDevoir.description} onChange={e=>setNewDevoir(p=>({...p,description:e.target.value}))} rows={2} required/>
              <input type="text" placeholder={`Donné le ${selected.day} ${MONTH_NAMES[selected.month]} par ${user.prenom} ${user.nom}`} value={newDevoir.donne} onChange={e=>setNewDevoir(p=>({...p,donne:e.target.value}))}/>
              <button type="submit" className="btn-primary-sm">Ajouter</button>
              {msg&&<span className="add-success">{msg}</span>}
            </form>
          )}

          {!classeId&&<div className="cdt-empty">Sélectionnez une classe pour voir les devoirs.</div>}

          {classeId&&(
            <>
              <div className="cdt-day-title">{dayLabel}</div>
              {!dayData||dayData.items.length===0
                ?<div className="cdt-empty">Aucun devoir pour ce jour.</div>
                :(
                  <div className="cdt-cards">
                    {dayData.items.map((item,idx)=>(
                      <div key={idx} className="cdt-card">
                        <div className="cdt-card-head">
                          <div className="cdt-card-bar"/>
                          <div className="cdt-card-title-row">
                            <span className="cdt-matiere">{item.matiere}</span>
                            <div style={{display:"flex",gap:8,alignItems:"center"}}>
                              <label className="cdt-effectue">
                                <input type="checkbox" checked={item.effectue} onChange={e=>updateDevoirEffectue(classeId,selected.day,idx,e.target.checked)}/>
                                <span>Effectué</span>
                              </label>
                              {canEdit&&(
                                <button style={{background:"#fee2e2",color:"#dc2626",borderRadius:6,padding:"3px 8px",border:"none",cursor:"pointer",fontSize:12}} onClick={()=>removeDevoirClasse(classeId,selected.day,idx)}>✕ Supprimer</button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="cdt-card-body">
                          {item.description.split("\n").map((line,l)=><p key={l} className="cdt-desc">{line}</p>)}
                          <p className="cdt-donne">{item.donne}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              }
            </>
          )}
        </div>

        {/* ── NAV SEMAINE ── */}
        <div className="cdt-week-nav">
          <button className="cdt-nav-arrow">▲</button>
          <div className="cdt-nav-label">À venir</div>
          {WEEK_NAV.map(w=>(
            <button key={w.day}
              onClick={()=>{setSelected({day:w.day,month:2,year:2026});setCalMonth(2);setCalYear(2026);}}
              className={["cdt-nav-day",selected.day===w.day&&selected.month===2&&selected.year===2026?"active":"",devoirsClasse[w.day]?.items?.length>0?"has-items":""].filter(Boolean).join(" ")}
            >
              {w.label.split("\n").map((l,i)=><span key={i}>{l}</span>)}
            </button>
          ))}
          <div className="cdt-nav-label">Devoirs</div>
          <button className="cdt-nav-arrow">▼</button>
        </div>
      </div>
    </div>
  );
}
