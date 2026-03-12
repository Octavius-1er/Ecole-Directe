import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const AuthContext = createContext(null);

const DEFAULT_ACCOUNTS = [
  { id:"1", username:"admin",   password:"admin123", role:"admin", nom:"Administrateur", prenom:"Principal" },
  { id:"2", username:"fischer", password:"prof123",  role:"prof",  nom:"Fischer",        prenom:"N.", matiere:"Français" },
  { id:"3", username:"octave",  password:"eleve123", role:"eleve", nom:"Le Chatelier Gaign.", prenom:"Octave", classe:"5ème F EUROP." },
];

export function AuthProvider({ children }) {
  const [user,     setUser]     = useState(null);
  const [accounts, setAccounts] = useState(DEFAULT_ACCOUNTS);
  const [ready,    setReady]    = useState(false);

  // ── Sync comptes depuis Firestore ──
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "app", "accounts"), snap => {
      if (snap.exists() && snap.data().data?.length) {
        const remoteAccounts = snap.data().data;
        setAccounts(remoteAccounts);

        // Mettre à jour la session locale si le compte a changé (ex : mot de passe changé depuis un autre appareil)
        const savedId = localStorage.getItem("ed_session_id");
        if (savedId) {
          const found = remoteAccounts.find(a => a.id === savedId);
          if (found) {
            setUser(found);
          } else {
            // Compte supprimé
            setUser(null);
            localStorage.removeItem("ed_session_id");
          }
        }
      } else {
        // Premier lancement : initialiser avec les comptes par défaut
        saveAccounts(DEFAULT_ACCOUNTS);
      }
      setReady(true);
    });
    return () => unsub();
  }, []);

  async function saveAccounts(list) {
    await setDoc(doc(db, "app", "accounts"), { data: list, updatedAt: serverTimestamp() }, );
  }

  function login(username, password) {
    const found = accounts.find(a => a.username === username && a.password === password);
    if (found) {
      setUser(found);
      localStorage.setItem("ed_session_id", found.id);
      return { success: true };
    }
    return { success: false, error: "Identifiant ou mot de passe incorrect." };
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("ed_session_id");
  }

  async function addAccount(account) {
    const newAcc = { ...account, id: Date.now().toString() };
    const next   = [...accounts, newAcc];
    await saveAccounts(next);
  }

  async function updateAccount(id, updates) {
    const next = accounts.map(a => a.id === id ? { ...a, ...updates } : a);
    await saveAccounts(next);
    if (user?.id === id) {
      const updated = { ...user, ...updates };
      setUser(updated);
    }
  }

  async function deleteAccount(id) {
    const next = accounts.filter(a => a.id !== id);
    await saveAccounts(next);
  }

  if (!ready) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", flexDirection:"column", gap:16, fontFamily:"Outfit,sans-serif", color:"#1a4fa0" }}>
      <div style={{ width:40, height:40, border:"4px solid #bfdbfe", borderTop:"4px solid #1a4fa0", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
      <p style={{ fontWeight:600 }}>Connexion en cours...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <AuthContext.Provider value={{ user, accounts, login, logout, addAccount, updateAccount, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
