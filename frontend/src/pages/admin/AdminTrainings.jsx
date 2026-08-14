import { useState, useEffect } from "react";
import { api } from "../../api/client.js";

const emptyForm = { name_fr: "", name_en: "", description_fr: "", description_en: "", level_key: "", category_key: "", instructor_id: "" };

export default function AdminTrainings() {
  const [trainings, setTrainings] = useState([]);
  const [levels, setLevels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const load = () => {
    api.get("/trainings").then(setTrainings);
    api.get("/levels").then(setLevels);
    api.get("/categories").then(setCategories);
    api.get("/instructors").then(setInstructors);
  };
  useEffect(load, []);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const startEdit = (t) => {
    setEditingId(t.id);
    setForm({
      name_fr: t.name_fr,
      name_en: t.name_en,
      description_fr: t.description_fr || "",
      description_en: t.description_en || "",
      level_key: t.level_key || "",
      category_key: t.category_key || "",
      instructor_id: t.instructor_id || "",
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, instructor_id: form.instructor_id || null };
    if (editingId) await api.put(`/trainings/${editingId}`, payload);
    else await api.post("/trainings", payload);
    setEditingId(null);
    setForm(emptyForm);
    load();
  };

  const onDelete = async (id) => {
    if (!window.confirm("Supprimer cette formation ?")) return;
    await api.del(`/trainings/${id}`);
    load();
  };

  return (
    <div>
      <h2 className="h2">Formations</h2>
      <form className="admin-form" onSubmit={onSubmit}>
        <label>
          Nom (FR)
          <input name="name_fr" value={form.name_fr} onChange={onChange} required />
        </label>
        <label>
          Nom (EN)
          <input name="name_en" value={form.name_en} onChange={onChange} required />
        </label>
        <label className="admin-form__full">
          Description (FR)
          <textarea name="description_fr" value={form.description_fr} onChange={onChange} rows={2} />
        </label>
        <label className="admin-form__full">
          Description (EN)
          <textarea name="description_en" value={form.description_en} onChange={onChange} rows={2} />
        </label>
        <label>
          Niveau
          <select name="level_key" value={form.level_key} onChange={onChange}>
            <option value="">—</option>
            {levels.map((l) => (
              <option key={l.key} value={l.key}>{l.label_fr}</option>
            ))}
          </select>
        </label>
        <label>
          Catégorie
          <select name="category_key" value={form.category_key} onChange={onChange}>
            <option value="">—</option>
            {categories.map((c) => (
              <option key={c.key} value={c.key}>{c.name_fr}</option>
            ))}
          </select>
        </label>
        <label>
          Moniteur
          <select name="instructor_id" value={form.instructor_id} onChange={onChange}>
            <option value="">—</option>
            {instructors.map((i) => (
              <option key={i.id} value={i.id}>{i.name}</option>
            ))}
          </select>
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
            <th>Nom</th>
            <th>Niveau</th>
            <th>Catégorie</th>
            <th>Moniteur</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trainings.map((t) => (
            <tr key={t.id}>
              <td>{t.name_fr}</td>
              <td>{levels.find((l) => l.key === t.level_key)?.label_fr || "—"}</td>
              <td>{categories.find((c) => c.key === t.category_key)?.name_fr || "—"}</td>
              <td>{t.instructor_name || "—"}</td>
              <td className="admin-actions">
                <button className="btn btn--ghost btn--sm" onClick={() => startEdit(t)}>Modifier</button>
                <button className="btn btn--ghost btn--sm" onClick={() => onDelete(t.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
