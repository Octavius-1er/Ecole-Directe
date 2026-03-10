import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useData } from "../DataContext";
import "./Messagerie.css";

export default function Messagerie() {
  const { user } = useAuth();
  const { messages, sendMessage, markRead, deleteMessage } = useData();
  const canSend = user?.role === "admin" || user?.role === "prof";

  const [selected, setSelected] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [newMsg, setNewMsg] = useState({ sujet: "", corps: "" });
  const [msg, setMsg] = useState("");

  function handleRead(m) {
    setSelected(m);
    if (!m.lu) markRead(m.id);
  }

  function handleSend(e) {
    e.preventDefault();
    if (!newMsg.sujet || !newMsg.corps) return;
    const now = new Date();
    sendMessage({
      sujet: newMsg.sujet,
      corps: newMsg.corps,
      auteur: `${user.prenom} ${user.nom}`,
      date: now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    });
    setMsg("Message envoyé ✓");
    setNewMsg({ sujet: "", corps: "" });
    setShowCompose(false);
    setTimeout(() => setMsg(""), 3000);
  }

  const unread = messages.filter(m => !m.lu).length;

  return (
    <div className="mail-page">
      {/* ── LISTE ── */}
      <div className="mail-sidebar">
        <div className="mail-sidebar-header">
          <h2>Messagerie {unread > 0 && <span className="mail-unread-count">{unread}</span>}</h2>
          {canSend && (
            <button className="btn-compose" onClick={() => { setShowCompose(v => !v); setSelected(null); }}>
              {showCompose ? "✕" : "✏️ Nouveau"}
            </button>
          )}
        </div>
        {msg && <div className="mail-success">{msg}</div>}
        <div className="mail-list">
          {messages.map(m => (
            <div
              key={m.id}
              className={`mail-item ${selected?.id === m.id ? "active" : ""} ${!m.lu ? "unread" : ""}`}
              onClick={() => handleRead(m)}
            >
              <div className="mail-item-top">
                <span className="mail-from">{m.auteur}</span>
                <span className="mail-date">{m.date}</span>
              </div>
              <div className="mail-subject">{m.sujet}</div>
              <div className="mail-preview">{m.corps.slice(0, 60)}…</div>
            </div>
          ))}
          {messages.length === 0 && <div className="mail-empty">Aucun message.</div>}
        </div>
      </div>

      {/* ── LECTURE / COMPOSITION ── */}
      <div className="mail-content">
        {showCompose ? (
          <form className="mail-compose" onSubmit={handleSend}>
            <h2 className="compose-title">Nouveau message</h2>
            <div className="compose-field">
              <label>Sujet</label>
              <input type="text" value={newMsg.sujet} onChange={e => setNewMsg(p => ({ ...p, sujet: e.target.value }))} required />
            </div>
            <div className="compose-field">
              <label>Message</label>
              <textarea rows={10} value={newMsg.corps} onChange={e => setNewMsg(p => ({ ...p, corps: e.target.value }))} required />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" className="btn-primary-sm">Envoyer</button>
              <button type="button" className="btn-secondary-sm" onClick={() => setShowCompose(false)}>Annuler</button>
            </div>
          </form>
        ) : selected ? (
          <div className="mail-reader">
            <div className="mail-reader-header">
              <h2>{selected.sujet}</h2>
              <div style={{ display: "flex", gap: 8 }}>
                {canSend && (
                  <button className="btn-del-sm" onClick={() => { deleteMessage(selected.id); setSelected(null); }}>🗑 Supprimer</button>
                )}
              </div>
            </div>
            <div className="mail-reader-meta">
              <span>De : <strong>{selected.auteur}</strong></span>
              <span>{selected.date}</span>
            </div>
            <div className="mail-reader-body">
              {selected.corps.split("\n").map((l, i) => <p key={i}>{l || <br />}</p>)}
            </div>
          </div>
        ) : (
          <div className="mail-placeholder">
            <span>📨</span>
            <p>Sélectionnez un message pour le lire</p>
          </div>
        )}
      </div>
    </div>
  );
}
