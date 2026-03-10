import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import "./AdminPanel.css";

const ROLE_LABELS = { admin: "Administrateur", prof: "Professeur", eleve: "Élève" };
const ROLE_COLORS = { admin: "#7c3aed", prof: "#0284c7", eleve: "#16a34a" };

const EMPTY_FORM = { username: "", password: "", role: "eleve", nom: "", prenom: "", matiere: "", classe: "" };

export default function AdminPanel() {
  const { accounts, addAccount, updateAccount, deleteAccount, user } = useAuth();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filterRole, setFilterRole] = useState("tous");

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate() {
    if (!form.username.trim()) return "L'identifiant est requis.";
    if (!form.password.trim()) return "Le mot de passe est requis.";
    if (!form.nom.trim()) return "Le nom est requis.";
    if (!form.prenom.trim()) return "Le prénom est requis.";
    const exists = accounts.find(a => a.username === form.username && a.id !== editId);
    if (exists) return "Cet identifiant est déjà utilisé.";
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError(""); setSuccess("");
    const err = validate();
    if (err) { setError(err); return; }

    if (editId) {
      updateAccount(editId, form);
      setSuccess("Compte mis à jour avec succès.");
      setEditId(null);
    } else {
      addAccount(form);
      setSuccess("Compte créé avec succès.");
    }
    setForm(EMPTY_FORM);
  }

  function handleEdit(acc) {
    setEditId(acc.id);
    setForm({ username: acc.username, password: acc.password, role: acc.role, nom: acc.nom, prenom: acc.prenom, matiere: acc.matiere || "", classe: acc.classe || "" });
    setError(""); setSuccess("");
    window.scrollTo(0, 0);
  }

  function handleDelete(id) {
    if (id === user.id) { setError("Vous ne pouvez pas supprimer votre propre compte."); return; }
    if (window.confirm("Supprimer ce compte ?")) {
      deleteAccount(id);
      setSuccess("Compte supprimé.");
    }
  }

  function handleCancel() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setError(""); setSuccess("");
  }

  const filtered = filterRole === "tous" ? accounts : accounts.filter(a => a.role === filterRole);

  return (
    <div className="admin-container">
      <h1 className="admin-title">Gestion des comptes</h1>

      {/* Formulaire */}
      <div className="admin-card">
        <h2>{editId ? "✏️ Modifier un compte" : "➕ Créer un compte"}</h2>

        {error   && <div className="admin-alert error">⚠ {error}</div>}
        {success && <div className="admin-alert success">✓ {success}</div>}

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-row">
            <div className="admin-field">
              <label>Identifiant *</label>
              <input name="username" value={form.username} onChange={handleChange} placeholder="ex: dupont.jean" />
            </div>
            <div className="admin-field">
              <label>Mot de passe *</label>
              <input name="password" value={form.password} onChange={handleChange} placeholder="Mot de passe" />
            </div>
            <div className="admin-field">
              <label>Rôle *</label>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="eleve">Élève</option>
                <option value="prof">Professeur</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-field">
              <label>Nom *</label>
              <input name="nom" value={form.nom} onChange={handleChange} placeholder="Nom de famille" />
            </div>
            <div className="admin-field">
              <label>Prénom *</label>
              <input name="prenom" value={form.prenom} onChange={handleChange} placeholder="Prénom" />
            </div>
            {form.role === "prof" && (
              <div className="admin-field">
                <label>Matière</label>
                <input name="matiere" value={form.matiere} onChange={handleChange} placeholder="ex: Mathématiques" />
              </div>
            )}
            {form.role === "eleve" && (
              <div className="admin-field">
                <label>Classe</label>
                <input name="classe" value={form.classe} onChange={handleChange} placeholder="ex: 5ème F EUROP." />
              </div>
            )}
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="btn-primary">
              {editId ? "Enregistrer les modifications" : "Créer le compte"}
            </button>
            {editId && <button type="button" className="btn-secondary" onClick={handleCancel}>Annuler</button>}
          </div>
        </form>
      </div>

      {/* Liste des comptes */}
      <div className="admin-card">
        <div className="admin-list-header">
          <h2>Comptes existants ({accounts.length})</h2>
          <div className="admin-filter">
            {["tous","admin","prof","eleve"].map(r => (
              <button key={r} className={`filter-btn ${filterRole === r ? "active" : ""}`} onClick={() => setFilterRole(r)}>
                {r === "tous" ? "Tous" : ROLE_LABELS[r]}
              </button>
            ))}
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Identifiant</th>
              <th>Nom complet</th>
              <th>Rôle</th>
              <th>Détail</th>
              <th>Mot de passe</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(acc => (
              <tr key={acc.id} className={acc.id === user.id ? "current-user" : ""}>
                <td><code>{acc.username}</code></td>
                <td>{acc.prenom} {acc.nom}</td>
                <td>
                  <span className="role-badge" style={{ background: ROLE_COLORS[acc.role] + "20", color: ROLE_COLORS[acc.role] }}>
                    {ROLE_LABELS[acc.role]}
                  </span>
                </td>
                <td className="muted">{acc.matiere || acc.classe || "—"}</td>
                <td><code className="pw-hidden">••••••••</code></td>
                <td>
                  <div className="action-btns">
                    <button className="btn-edit" onClick={() => handleEdit(acc)}>Modifier</button>
                    <button className="btn-delete" onClick={() => handleDelete(acc.id)} disabled={acc.id === user.id}>Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
