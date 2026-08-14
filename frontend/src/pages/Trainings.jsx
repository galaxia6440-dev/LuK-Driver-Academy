import { useLang } from "../i18n/LanguageContext.jsx";
import { useApiData } from "../api/hooks.js";

export default function Trainings() {
  const { t, lang } = useLang();
  const { data: trainings } = useApiData("/trainings");
  const { data: levels } = useApiData("/levels");
  const { data: categories } = useApiData("/categories");

  return (
    <div className="section">
      <div className="container">
        <div className="eyebrow">{t("nav_trainings")}</div>
        <h1 className="h1">{t("trainings_title")}</h1>
        <p className="lede" style={{ marginTop: 16 }}>
          {t("trainings_intro")}
        </p>

        <div className="grid grid--3" style={{ marginTop: 48 }}>
          {(trainings || []).map((tr) => {
            const level = levels?.find((l) => l.key === tr.level_key);
            const category = categories?.find((c) => c.key === tr.category_key);
            return (
              <div key={tr.id} className="card" style={{ padding: 22 }}>
                <h3 className="h3">{lang === "fr" ? tr.name_fr : tr.name_en}</h3>
                {(tr.description_fr || tr.description_en) && (
                  <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 10 }}>
                    {lang === "fr" ? tr.description_fr : tr.description_en}
                  </p>
                )}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
                  {level && <span className="tag tag--gold">{lang === "fr" ? level.label_fr : level.label_en}</span>}
                  {category && <span className="tag">{lang === "fr" ? category.name_fr : category.name_en}</span>}
                  {tr.instructor_name && <span className="tag">{tr.instructor_name}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
