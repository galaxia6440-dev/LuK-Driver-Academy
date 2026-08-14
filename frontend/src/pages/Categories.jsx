import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext.jsx";
import { useApiData } from "../api/hooks.js";

export default function Categories() {
  const { t, lang } = useLang();
  const { data: categories } = useApiData("/categories");
  const { data: cars } = useApiData("/cars");

  return (
    <div className="section">
      <div className="container">
        <div className="eyebrow">{t("nav_categories")}</div>
        <h1 className="h1">{t("categories_title")}</h1>
        <p className="lede" style={{ marginTop: 16 }}>
          {t("categories_intro")}
        </p>

        <div className="grid grid--3" style={{ marginTop: 48 }}>
          {(categories || []).map((c) => {
            const count = (cars || []).filter((car) => car.category_key === c.key).length;
            return (
              <Link key={c.key} to={`/flotte?category=${c.key}`} className="card" style={{ padding: 24, display: "block" }}>
                <div className="eyebrow">{String(c.sort_order).padStart(2, "0")}</div>
                <h3 className="h3" style={{ margin: "8px 0" }}>
                  {lang === "fr" ? c.name_fr : c.name_en}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{lang === "fr" ? c.description_fr : c.description_en}</p>
                <div style={{ marginTop: 14, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--gold)" }}>
                  {count} {count > 1 ? (lang === "fr" ? "voitures" : "cars") : lang === "fr" ? "voiture" : "car"}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
