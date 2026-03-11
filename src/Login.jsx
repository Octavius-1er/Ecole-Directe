import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const result = login(username.trim(), password);
    if (!result.success) setError(result.error);
    setLoading(false);
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <div className="login-logo-icon">É</div>
          <h1>École Direct</h1>
          <p>Collège Privé Bobée</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label>Identifiant</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Votre identifiant"
              autoFocus
              required
            />
          </div>

          <div className="login-field">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              required
            />
          </div>

          {error && <div className="login-error">⚠ {error}</div>}

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>


      </div>
    </div>
  );
}
