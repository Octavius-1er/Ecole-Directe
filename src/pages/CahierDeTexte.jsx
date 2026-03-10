import React from "react";
import "./CahierDeTexte.css";

export default function CahierDeTextes() {
  return (
    <div className="cdt-container">

      <h1>Cahier de textes</h1>
      <p className="subtitle">Mardi 10 mars 2026</p>

      <div className="cdt-layout">

        {/* Colonne gauche : calendrier */}
        <div className="cdt-calendar">
          <h2>Mars 2026</h2>

          <div className="calendar-grid">
            <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
            <span>8</span><span className="active">9</span><span className="active">10</span><span>11</span><span>12</span><span>13</span><span>14</span>
            <span>15</span><span>16</span><span>17</span><span>18</span><span>19</span><span>20</span><span>21</span>
            <span>22</span><span>23</span><span>24</span><span>25</span><span>26</span><span>27</span><span>28</span>
            <span>29</span><span>30</span><span>31</span>
          </div>
        </div>

        {/* Colonne droite : devoirs */}
        <div className="cdt-homework">

          <div className="hw-card">
            <h3>Mathématiques</h3>
            <p>Leçon + Ex 24 et 26 p.159</p>
            <p className="hw-meta">Donné le 9 mars — Mme David S.</p>
            <label className="checkbox">
              <input type="checkbox" /> Effectué
            </label>
          </div>

          <div className="hw-card">
            <h3>Histoire-Géo</h3>
            <p>Bien apprendre les cours d'EMC</p>
            <p className="hw-meta">Donné le 5 mars — Mme Hemet I.</p>
            <label className="checkbox">
              <input type="checkbox" /> Effectué
            </label>
          </div>

        </div>

      </div>

    </div>
  );
}
