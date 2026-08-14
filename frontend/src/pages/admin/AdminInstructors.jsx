import { useState, useEffect } from "react";
import { api } from "../../api/client.js";
import { mediaUrl } from "../../api/config.js";

const emptyForm = { name: "", country_fr: "", country_en: "", flag_emoji: "", specialty_fr: "", specialty_en: "" };

export default function AdminInstructors() {
  const [instructors, setInstructors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const load = () => api.get("/instructors").then(setInstructors);
  useEffect(load, []);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const startEdit = (i) => {
    setEditingId(i.id);
    setForm({
      name: i.name,
      country_fr: i.country_fr,
      country_en: i.country_en,
      flag_emoji: i.flag_emoji || "",
      specialty_fr: i.specialty_fr,
      specialty_en: i.specialty_en,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/instructors/${editingId}`, form);
    } else {
      await api.post("/instructors", form);
    }
    setEditingId(null);
    setForm(emptyForm);
    load();
  };

  const onDelete = async (id) => {
    if (!window.confirm("Supprimer ce moniteur ?")) return;
    await api.del(`/instructors/${id}`);
    load();
  };

  const onPhoto = async (id, file) => {
    const fd = new FormData();
    fd.append("photo", file);
    await api.postForm(`/instructors/${id}/photo`, fd);
    load();
  };

  return (
    <div>
      <h2 className="h2">Moniteurs</h2>
      <form className="admin-form" onSubmit={onSubmit}>
        <label>
          Nom
          <input name="name" value={form.name} onChange={onChange} required />
        </label>
        <label>
          Drapeau (emoji)
          <input name="flag_emoji" value={form.flag_emoji} onChange={onChange} />
        </label>
        <label>
          Pays (FR)
          <input name="country_fr" value={form.country_fr} onChange={onChange} required />
        </label>
        <label>
          Pays (EN)
          <input name="country_en" value={form.country_en} onChange={onChange} />
        </label>
        <label>
          Spécialité (FR)
          <input name="specialty_fr" value={form.specialty_fr} onChange={onChange} required />
        </label>
        <label>
          Spécialité (EN)
          <input name="specialty_en" value={form.specialty_en} onChange={onChange} />
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
            <th>Photo</th>
            <th>Nom</th>
            <th>Pays</th>
            <th>Spécialité</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {instructors.map((i) => (
            <tr key={i.id}>
              <td>{i.photo ? <img className="admin-thumb" src={mediaUrl(i.photo)} alt="" /> : "—"}</td>
              <td>{i.name}</td>
              <td>{i.flag_emoji} {i.country_fr}</td>
              <td>{i.specialty_fr}</td>
              <td className="admin-actions">
                <button className="btn btn--ghost btn--sm" onClick={() => startEdit(i)}>
                  Modifier
                </button>
                <label className="btn btn--ghost btn--sm" style={{ cursor: "pointer" }}>
                  Photo
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => e.target.files[0] && onPhoto(i.id, e.target.files[0])} />
                </label>
                <button className="btn btn--ghost btn--sm" onClick={() => onDelete(i.id)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
