import { useState, useEffect } from "react";
import { api } from "../../api/client.js";

const STATUS_LABELS = {
  nouvelle: "Nouvelle candidature",
  en_cours: "En cours d'examen",
  acceptee: "Acceptée",
  refusee: "Refusée",
};

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("");

  const load = () => {
    const query = filter ? `?status=${filter}` : "";
    api.get(`/applications${query}`).then(setApplications);
  };
  useEffect(load, [filter]);

  const onStatusChange = async (id, status) => {
    await api.put(`/applications/${id}/status`, { status });
    load();
  };

  const onDelete = async (id) => {
    if (!window.confirm("Supprimer cette candidature ?")) return;
    await api.del(`/applications/${id}`);
    load();
  };

  return (
    <div>
      <h2 className="h2">Candidatures</h2>

      <div style={{ display: "flex", gap: 8, margin: "16px 0" }}>
        <button className={`tag ${!filter ? "tag--gold" : ""}`} style={{ cursor: "pointer", background: "none" }} onClick={() => setFilter("")}>
          Toutes
        </button>
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <button key={key} className={`tag ${filter === key ? "tag--gold" : ""}`} style={{ cursor: "pointer", background: "none" }} onClick={() => setFilter(key)}>
            {label}
          </button>
        ))}
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Pseudo</th>
            <th>Pays</th>
            <th>Âge</th>
            <th>Discord</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((a) => (
            <tr key={a.id}>
              <td>{a.pseudo}</td>
              <td>{a.country}</td>
              <td>{a.age}</td>
              <td>{a.discord_id || "—"}</td>
              <td>
                <select value={a.status} onChange={(e) => onStatusChange(a.id, e.target.value)} style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)", padding: "4px 6px" }}>
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </td>
              <td className="admin-actions">
                <button className="btn btn--ghost btn--sm" onClick={() => onDelete(a.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
