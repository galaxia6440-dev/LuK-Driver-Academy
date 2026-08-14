import { useState, useEffect } from "react";
import { api } from "../../api/client.js";

const emptyForm = { title_fr: "", title_en: "", description_fr: "", description_en: "", date: "" };

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const load = () => api.get("/events").then(setEvents);
  useEffect(load, []);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const startEdit = (ev) => {
    setEditingId(ev.id);
    setForm({
      title_fr: ev.title_fr,
      title_en: ev.title_en,
      description_fr: ev.description_fr || "",
      description_en: ev.description_en || "",
      date: ev.date || "",
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (editingId) await api.put(`/events/${editingId}`, form);
    else await api.post("/events", form);
    setEditingId(null);
    setForm(emptyForm);
    load();
  };

  const onDelete = async (id) => {
    if (!window.confirm("Supprimer cet événement ?")) return;
    await api.del(`/events/${id}`);
    load();
  };

  return (
    <div>
      <h2 className="h2">Événements</h2>
      <form className="admin-form" onSubmit={onSubmit}>
        <label>
          Titre (FR)
          <input name="title_fr" value={form.title_fr} onChange={onChange} required />
        </label>
        <label>
          Titre (EN)
          <input name="title_en" value={form.title_en} onChange={onChange} required />
        </label>
        <label>
          Date
          <input name="date" value={form.date} onChange={onChange} placeholder="AAAA-MM-JJ" />
        </label>
        <label className="admin-form__full">
          Description (FR)
          <textarea name="description_fr" value={form.description_fr} onChange={onChange} rows={2} />
        </label>
        <label className="admin-form__full">
          Description (EN)
          <textarea name="description_en" value={form.description_en} onChange={onChange} rows={2} />
        </label>
        <div className="admin-form__full admin-actions">
          <button className="btn btn--solid btn--sm" type="submit">
            {editingId ? "Enregistrer" : "Ajouter"}
          </button>
          {editingId && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
              Annuler
            </button>
          )}
        </div>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Titre</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((ev) => (
            <tr key={ev.id}>
              <td>{ev.date || "—"}</td>
              <td>{ev.title_fr}</td>
              <td className="admin-actions">
                <button className="btn btn--ghost btn--sm" onClick={() => startEdit(ev)}>Modifier</button>
                <button className="btn btn--ghost btn--sm" onClick={() => onDelete(ev.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
