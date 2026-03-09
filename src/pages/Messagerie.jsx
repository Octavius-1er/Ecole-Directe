import React from "react";
import "./Messagerie.css";

export default function Messagerie() {
  return (
    <div className="msg-container">

      <h1>Messagerie</h1>
      <p className="subtitle">44 messages non lus</p>

      <div className="msg-layout">

        {/* Liste des messages */}
        <div className="msg-list">

          <div className="msg-item active">
            <h3>Soirée Louanges</h3>
            <p className="msg-author">M. O. Chaput</p>
            <p className="msg-date">Mardi 3 mars 2026 — 18:24</p>
          </div>

          <div className="msg-item">
            <h3>Nouvelles évaluations</h3>
            <p className="msg-author">Mme David S.</p>
            <p className="msg-date">Lundi 2 mars 2026</p>
          </div>

          <div className="msg-item">
            <h3>Partenariat Librairie Colbert</h3>
            <p className="msg-author">Direction</p>
            <p className="msg-date">Lundi 2 mars 2026</p>
          </div>

        </div>

        {/* Message ouvert */}
        <div className="msg-content">
          <h2>Soirée Louanges</h2>
          <p className="msg-meta">M. O. Chaput — Mardi 3 mars 2026 à 18:24</p>

          <div className="msg-body">
            <p>Chers jeunes, Chères familles</p>

            <p>✨ Laetare : Réjouissez-vous ! ✨</p>

            <p>
              Dans 10 jours... nous vivrons le milieu de notre marche vers Pâques !
              Une invitation toute particulière à la joie !
            </p>

            <p>
              Pour vivre et partager un vendredi soir pas comme les autres...
              nous vous convions à notre prochaine Soirée Louange !
            </p>

            <p><strong>📅 Vendredi 13 mars 2026</strong></p>
          </div>
        </div>

      </div>

    </div>
  );
}
