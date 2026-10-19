import React, { createContext, useContext, useState, useEffect } from "react";
import { saveDoc, subscribe } from "./localStore";
import { ACCOUNTS_VERSION, DEFAULT_ACCOUNTS } from "./seed";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,     setUser]     = useState(null);
  const [accounts, setAccounts] = useState(DEFAULT_ACCOUNTS);
  const [ready,    setReady]    = useState(false);

  useEffect(() => {
    if (localStorage.getItem("ed_accounts_version") !== ACCOUNTS_VERSION) {
      saveDoc("accounts", DEFAULT_ACCOUNTS);
      localStorage.setItem("ed_accounts_version", ACCOUNTS_VERSION);
    }
    const unsub = subscribe("accounts", (stored) => {
      if (!stored?.length) {
        saveDoc("accounts", DEFAULT_ACCOUNTS);
        return;
      }
      setAccounts(stored);

      const savedId = localStorage.getItem("ed_session_id");
      if (savedId) {
        const found = stored.find(a => a.id === savedId);
        if (found) {
          setUser(found);
        } else {
          setUser(null);
          localStorage.removeItem("ed_session_id");
        }
      }
      setReady(true);
    });
    return () => unsub();
  }, []);

  async function saveAccounts(list) {
    saveDoc("accounts", list);
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
