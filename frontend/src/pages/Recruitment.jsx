import { useState } from "react";
import { useLang } from "../i18n/LanguageContext.jsx";
import { useApiData } from "../api/hooks.js";
import "./Recruitment.css";

export default function Recruitment() {
  const { t, lang } = useLang();
  const { data: categories } = useApiData("/categories");
  const { data: levels } = useApiData("/levels");

  const [form, setForm] = useState({
    pseudo: "",
    full_name: "",
    country: "",
    age: "",
    desired_category: "",
    driving_level: "",
    race_experience: "",
    motivation: "",
    discord_id: "",
  });
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (photo) fd.append("photo", photo);
      const res = await fetch("/api/applications", { method: "POST", body: fd });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setForm({
        pseudo: "",
        full_name: "",
        country: "",
        age: "",
        desired_category: "",
        driving_level: "",
        race_experience: "",
        motivation: "",
        discord_id: "",
      });
      setPhoto(null);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div className="eyebrow">{t("nav_recruitment")}</div>
        <h1 className="h1">{t("recruitment_title")}</h1>
        <p className="lede" style={{ marginTop: 16 }}>
          {t("recruitment_intro")}
        </p>

        <form className="recruit-form" onSubmit={onSubmit}>
          <label>
            {t("form_pseudo")} *
            <input required name="pseudo" value={form.pseudo} onChange={onChange} />
          </label>
          <label>
            {t("form_fullname")}
            <input name="full_name" value={form.full_name} onChange={onChange} />
          </label>
          <label>
            {t("form_country")} *
            <input required name="country" value={form.country} onChange={onChange} />
          </label>
          <label>
            {t("form_age")} *
            <input required type="number" min="1" max="120" name="age" value={form.age} onChange={onChange} />
          </label>
          <label>
            {t("form_category")}
            <select name="desired_category" value={form.desired_category} onChange={onChange}>
              <option value="">—</option>
              {(categories || []).map((c) => (
                <option key={c.key} value={c.key}>
                  {lang === "fr" ? c.name_fr : c.name_en}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t("form_level")}
            <select name="driving_level" value={form.driving_level} onChange={onChange}>
              <option value="">—</option>
              {(levels || []).map((l) => (
                <option key={l.key} value={l.key}>
                  {lang === "fr" ? l.label_fr : l.label_en}
                </option>
              ))}
            </select>
          </label>
          <label className="recruit-form__full">
            {t("form_experience")}
            <textarea name="race_experience" value={form.race_experience} onChange={onChange} rows={3} />
          </label>
          <label className="recruit-form__full">
            {t("form_motivation")}
            <textarea name="motivation" value={form.motivation} onChange={onChange} rows={4} />
          </label>
          <label>
            {t("form_discord")}
            <input name="discord_id" value={form.discord_id} onChange={onChange} />
          </label>
          <label>
            {t("form_photo")}
            <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
          </label>

          <div className="recruit-form__full">
            <button className="btn btn--solid" type="submit" disabled={status === "sending"}>
              {t("form_submit")}
            </button>
            {status === "success" && <p className="recruit-form__success">{t("form_success")}</p>}
            {status === "error" && <p className="recruit-form__error">{t("form_error")}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
