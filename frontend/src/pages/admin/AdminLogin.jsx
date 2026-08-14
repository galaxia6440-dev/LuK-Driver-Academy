import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client.js";
import "./admin.css";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { username, password });
      window.localStorage.setItem("luk_admin_token", res.token);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Erreur de connexion");
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login__box" onSubmit={onSubmit}>
        <div className="eyebrow">LuK Driver Academy</div>
        <h1 className="h2">Administration</h1>
        <label>
          Identifiant
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Mot de passe
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="admin-login__error">{error}</p>}
        <button className="btn btn--solid" type="submit">
          Se connecter
        </button>
      </form>
    </div>
  );
}
