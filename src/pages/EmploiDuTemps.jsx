import React from "react";
import "./EmploiDuTemps.css";

export default function EmploiDuTemps() {
  return (
    <div className="edt-container">

      <h1>Emploi du temps</h1>
      <p className="subtitle">Semaine du 9 au 15 mars 2026 — Semaine 11</p>

      <div className="edt-grid">

        {/* LUNDI */}
        <div className="edt-day">
          <h2>Lundi 9 Mar</h2>

          <div className="edt-item">
            <span>08:05 - 09:55</span>
            <strong>ED. PHYSIQUE & SPORT.</strong>
            <small>Chapelot B.</small>
          </div>

          <div className="edt-item">
            <span>10:10 - 11:05</span>
            <strong>Allemand LV2</strong>
            <small>Bourguignon A.</small>
          </div>

          <div className="edt-item">
            <span>11:05 - 12:00</span>
            <strong>Arts Plastiques</strong>
            <small>Decroix C.</small>
          </div>
        </div>

        {/* MARDI */}
        <div className="edt-day">
          <h2>Mardi 10 Mar</h2>

          <div className="edt-item">
            <span>08:05 - 09:00</span>
            <strong>Anglais LV1</strong>
            <small>Guellec L.</small>
          </div>

          <div className="edt-item">
            <span>09:00 - 09:55</span>
            <strong>Français</strong>
            <small>Fischer N.</small>
          </div>

          <div className="edt-item">
            <span>10:10 - 11:05</span>
            <strong>Allemand LV2</strong>
            <small>Bourguignon A.</small>
          </div>

          <div className="edt-item">
            <span>11:05 - 12:00</span>
            <strong>Technologie</strong>
            <small>Olivares D.</small>
          </div>
        </div>

        {/* MERCREDI */}
        <div className="edt-day">
          <h2>Mercredi 11 Mar</h2>

          <div className="edt-item">
            <span>08:05 - 09:00</span>
            <strong>Histoire-Géo</strong>
            <small>Hemet I.</small>
          </div>

          <div className="edt-item">
            <span>09:00 - 09:55</span>
            <strong>SVT</strong>
            <small>Tlich Z.</small>
          </div>

          <div className="edt-item">
            <span>10:10 - 11:05</span>
            <strong>Français</strong>
            <small>Fischer N.</small>
          </div>

          <div className="edt-item">
            <span>11:05 - 12:00</span>
            <strong>ED. PHYSIQUE & SPORT.</strong>
            <small>Chapelot B.</small>
          </div>
        </div>

        {/* JEUDI */}
        <div className="edt-day">
          <h2>Jeudi 12 Mar</h2>

          <div className="edt-item">
            <span>08:05 - 09:00</span>
            <strong>Français</strong>
            <small>Fischer N.</small>
          </div>

          <div className="edt-item">
            <span>09:00 - 09:55</span>
            <strong>Éducation Musicale</strong>
            <small>Cornier C.</small>
          </div>

          <div className="edt-item">
            <span>10:10 - 11:05</span>
            <strong>Mathématiques</strong>
            <small>David S.</small>
          </div>

          <div className="edt-item">
            <span>11:05 - 12:00</span>
            <strong>Histoire-Géo</strong>
            <small>Hemet I.</small>
          </div>
        </div>

        {/* VENDREDI */}
        <div className="edt-day">
          <h2>Vendredi 13 Mar</h2>

          <div className="edt-item">
            <span>08:05 - 09:00</span>
            <strong>Étude</strong>
          </div>

          <div className="edt-item">
            <span>09:00 - 09:55</span>
            <strong>Français</strong>
            <small>Fischer N.</small>
          </div>

          <div className="edt-item">
            <span>10:10 - 11:30</span>
            <strong>Physique-Chimie</strong>
            <small>Bredel M.</small>
          </div>

          <div className="edt-item">
            <span>11:30 - 12:00</span>
            <strong>Cantine</strong>
          </div>
        </div>

        {/* SAMEDI */}
        <div className="edt-day">
          <h2>Samedi 14 Mar</h2>
          <p className="no-class">Aucun cours</p>
        </div>

        {/* DIMANCHE */}
        <div className="edt-day">
          <h2>Dimanche 15 Mar</h2>
          <p className="no-class">Aucun cours</p>
        </div>

      </div>

    </div>
  );
}
