import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import VieScolaire from "./pages/VieScolaire";
import Notes from "./pages/Notes";
import NotesComparatives from "./pages/NotesComparatives";
import Competences from "./pages/Competences";
import Messagerie from "./pages/Messagerie";
import EmploiDuTemps from "./pages/EmploiDuTemps";
import CahierDeTextes from "./pages/CahierDeTexte";

import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="app-layout">

        <Sidebar />

        <div className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vie-scolaire" element={<VieScolaire />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/notes-comparatives" element={<NotesComparatives />} />
            <Route path="/competences" element={<Competences />} />
            <Route path="/messagerie" element={<Messagerie />} />
            <Route path="/emploi-du-temps" element={<EmploiDuTemps />} />
            <Route path="/cahier-de-texte" element={<CahierDeTextes />} />
          </Routes>
        </div>

      </div>
    </Router>
  );
}
