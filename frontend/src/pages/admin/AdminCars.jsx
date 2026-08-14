import { useState, useEffect, Fragment } from "react";
import { api } from "../../api/client.js";
import { mediaUrl } from "../../api/config.js";

const emptyForm = {
  name: "",
  brand: "",
  model: "",
  category: "",
  level: "",
  status: "",
  description_fr: "",
  description_en: "",
};

export default function AdminCars() {
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingSlug, setEditingSlug] = useState(null);
  const [expandedSlug, setExpandedSlug] = useState(null);
  const [msg, setMsg] = useState(null);

  const loadAll = () => {
    api.get("/cars").then(setCars);
    api.get("/categories").then(setCategories);
    api.get("/levels").then(setLevels);
    api.get("/statuses").then(setStatuses);
  };

  useEffect(loadAll, []);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const startEdit = (car) => {
    setEditingSlug(car.slug);
    setForm({
      name: car.name,
      brand: car.brand || "",
      model: car.model || "",
      category: car.category_key,
      level: car.level_key,
      status: car.status_key,
      description_fr: car.description_fr || "",
      description_en: car.description_en || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingSlug(null);
    setForm(emptyForm);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      if (editingSlug) {
        await api.put(`/cars/${editingSlug}`, form);
        setMsg({ type: "ok", text: "Voiture mise à jour." });
      } else {
        await api.post("/cars", form);
        setMsg({ type: "ok", text: "Voiture ajoutée." });
      }
      cancelEdit();
      loadAll();
    } catch (err) {
      setMsg({ type: "err", text: err.message });
    }
  };

  const onDelete = async (slug) => {
    if (!window.confirm("Supprimer cette voiture et toutes ses photos ?")) return;
    await api.del(`/cars/${slug}`);
    loadAll();
  };

  const onUploadPhotos = async (slug, files) => {
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("photos", f));
    await api.postForm(`/cars/${slug}/photos`, fd);
    loadAll();
  };

  const onDeletePhoto = async (slug, photoId) => {
    await api.del(`/cars/${slug}/photos/${photoId}`);
    loadAll();
  };

  const onSetMain = async (slug, url) => {
    await api.put(`/cars/${slug}/main-photo`, { url });
    loadAll();
  };

  return (
    <div>
      <h2 className="h2">Voitures de la flotte</h2>

      <form className="admin-form" onSubmit={onSubmit}>
        <label>
          Nom
          <input name="name" value={form.name} onChange={onChange} required disabled={!!editingSlug} />
        </label>
        <label>
          Marque (facultatif)
          <input name="brand" value={form.brand} onChange={onChange} />
        </label>
        <label>
          Modèle (facultatif)
          <input name="model" value={form.model} onChange={onChange} />
        </label>
        <label>
          Catégorie
          <select name="category" value={form.category} onChange={onChange} required>
            <option value="">—</option>
            {categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.name_fr}
              </option>
            ))}
          </select>
        </label>
        <label>
          Niveau
          <select name="level" value={form.level} onChange={onChange} required>
            <option value="">—</option>
            {levels.map((l) => (
              <option key={l.key} value={l.key}>
                {l.label_fr}
              </option>
            ))}
          </select>
        </label>
        <label>
          Statut
          <select name="status" value={form.status} onChange={onChange} required>
            <option value="">—</option>
            {statuses.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label_fr}
              </option>
            ))}
          </select>
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
            {editingSlug ? "Enregistrer" : "Ajouter la voiture"}
          </button>
          {editingSlug && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={cancelEdit}>
              Annuler
            </button>
          )}
        </div>
      </form>

      {msg && <p className={`admin-msg admin-msg--${msg.type}`}>{msg.text}</p>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Nom</th>
            <th>Catégorie</th>
            <th>Niveau</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <Fragment key={car.slug}>
              <tr>
                <td>{car.main_photo ? <img className="admin-thumb" src={mediaUrl(car.main_photo)} alt="" /> : "—"}</td>
                <td>{car.name}</td>
                <td>{categories.find((c) => c.key === car.category_key)?.name_fr}</td>
                <td>{levels.find((l) => l.key === car.level_key)?.label_fr}</td>
                <td>{statuses.find((s) => s.key === car.status_key)?.label_fr}</td>
                <td className="admin-actions">
                  <button className="btn btn--ghost btn--sm" onClick={() => startEdit(car)}>
                    Modifier
                  </button>
                  <button className="btn btn--ghost btn--sm" onClick={() => setExpandedSlug(expandedSlug === car.slug ? null : car.slug)}>
                    Photos
                  </button>
                  <button className="btn btn--ghost btn--sm" onClick={() => onDelete(car.slug)}>
                    Supprimer
                  </button>
                </td>
              </tr>
              {expandedSlug === car.slug && (
                <tr>
                  <td colSpan={6}>
                    <div className="admin-photos-grid">
                      {car.photos.map((p) => (
                        <div className="admin-photo-item" key={p.id}>
                          <img src={mediaUrl(p.url)} alt="" />
                          <button className="btn btn--ghost btn--sm" onClick={() => onSetMain(car.slug, p.url)}>
                            Principale
                          </button>
                          <button className="btn btn--ghost btn--sm" onClick={() => onDeletePhoto(car.slug, p.id)}>
                            Suppr.
                          </button>
                        </div>
                      ))}
                    </div>
                    <label style={{ display: "inline-block", marginTop: 12, fontFamily: "var(--font-mono)", fontSize: 12 }}>
                      Ajouter des photos
                      <input type="file" multiple accept="image/*" onChange={(e) => onUploadPhotos(car.slug, e.target.files)} style={{ display: "block", marginTop: 6 }} />
                    </label>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
