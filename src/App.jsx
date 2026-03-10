import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./Login";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import VieScolaire from "./pages/VieScolaire";
import Notes from "./pages/Notes";
import Messagerie from "./pages/Messagerie";
import EmploiDuTemps from "./pages/EmploiDuTemps";
import CahierDeTextes from "./pages/CahierDeTexte";
import AdminPanel from "./pages/AdminPanel";

import "./App.css";

// Routes selon le rôle
const ROUTES_BY_ROLE = {
  admin:  ["/", "/vie-scolaire", "/notes", "/messagerie", "/emploi-du-temps", "/cahier-de-texte", "/admin"],
  prof:   ["/", "/vie-scolaire", "/notes", "/messagerie", "/emploi-du-temps", "/cahier-de-texte"],
  eleve:  ["/", "/vie-scolaire", "/notes", "/messagerie", "/emploi-du-temps", "/cahier-de-texte"],
};

function ProtectedRoute({ path, element, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return element;
}

function AppInner() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return <Login />;

  return (
    <div className="app-layout">
      <Sidebar
        expanded={sidebarOpen}
        onEnter={() => setSidebarOpen(true)}
        onLeave={() => setSidebarOpen(false)}
      />
      <div className={`app-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vie-scolaire" element={<VieScolaire />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/messagerie" element={<Messagerie />} />
          <Route path="/emploi-du-temps" element={<EmploiDuTemps />} />
          <Route path="/cahier-de-texte" element={<CahierDeTextes />} />
          <Route
            path="/admin"
            element={
              user.role === "admin"
                ? <AdminPanel />
                : <Navigate to="/" replace />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppInner />
      </Router>
    </AuthProvider>
  );
}
