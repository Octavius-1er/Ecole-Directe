import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import VieScolaire from "./pages/VieScolaire";
import Notes from "./pages/Notes";
import Messagerie from "./pages/Messagerie";
import EmploiDuTemps from "./pages/EmploiDuTemps";
import CahierDeTextes from "./pages/CahierDeTexte";

import "./App.css";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="app-layout">

        <Sidebar expanded={sidebarOpen} onEnter={() => setSidebarOpen(true)} onLeave={() => setSidebarOpen(false)} />

        <div className={`app-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vie-scolaire" element={<VieScolaire />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/messagerie" element={<Messagerie />} />
            <Route path="/emploi-du-temps" element={<EmploiDuTemps />} />
            <Route path="/cahier-de-texte" element={<CahierDeTextes />} />
          </Routes>
        </div>

      </div>
    </Router>
  );
}
