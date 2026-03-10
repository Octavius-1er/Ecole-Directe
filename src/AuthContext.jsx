import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// Comptes par défaut au premier lancement
const DEFAULT_ACCOUNTS = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    role: "admin",
    nom: "Administrateur",
    prenom: "Principal",
  },
  {
    id: "2",
    username: "fischer",
    password: "prof123",
    role: "prof",
    nom: "Fischer",
    prenom: "N.",
    matiere: "Français",
  },
  {
    id: "3",
    username: "octave",
    password: "eleve123",
    role: "eleve",
    nom: "Le Chatelier Gaign.",
    prenom: "Octave",
    classe: "5ème F EUROP.",
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem("ed_accounts");
      return saved ? JSON.parse(saved) : DEFAULT_ACCOUNTS;
    } catch { return DEFAULT_ACCOUNTS; }
  });

  // Persister les comptes
  useEffect(() => {
    localStorage.setItem("ed_accounts", JSON.stringify(accounts));
  }, [accounts]);

  // Restaurer session
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ed_session");
      if (saved) setUser(JSON.parse(saved));
    } catch {}
  }, []);

  function login(username, password) {
    const found = accounts.find(
      a => a.username === username && a.password === password
    );
    if (found) {
      setUser(found);
      localStorage.setItem("ed_session", JSON.stringify(found));
      return { success: true };
    }
    return { success: false, error: "Identifiant ou mot de passe incorrect." };
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("ed_session");
  }

  function addAccount(account) {
    const newAcc = { ...account, id: Date.now().toString() };
    setAccounts(prev => [...prev, newAcc]);
  }

  function updateAccount(id, updates) {
    setAccounts(prev =>
      prev.map(a => a.id === id ? { ...a, ...updates } : a)
    );
    // Si c'est l'utilisateur connecté, mettre à jour la session
    if (user?.id === id) {
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem("ed_session", JSON.stringify(updated));
    }
  }

  function deleteAccount(id) {
    setAccounts(prev => prev.filter(a => a.id !== id));
  }

  return (
    <AuthContext.Provider value={{ user, accounts, login, logout, addAccount, updateAccount, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
