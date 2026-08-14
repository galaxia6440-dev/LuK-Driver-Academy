import { useParams, Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext.jsx";
import { useApiData } from "../api/hooks.js";
import { mediaUrl } from "../api/config.js";
import PhotoGallery from "../components/PhotoGallery.jsx";
import NotFound from "./NotFound.jsx";

export default function CarDetail() {
  const { slug } = useParams();
  const { t, lang } = useLang();
  const { data: car, loading, error } = useApiData(`/cars/${slug}`, [slug]);
  const { data: categories } = useApiData("/categories");
  const { data: levels } = useApiData("/levels");
  const { data: statuses } = useApiData("/statuses");

  if (loading) return null;
  if (error || !car) return <NotFound />;

  const category = categories?.find((c) => c.key === car.category_key);
  const level = levels?.find((l) => l.key === car.level_key);
  const status = statuses?.find((s) => s.key === car.status_key);
  const description = lang === "fr" ? car.description_fr : car.description_en;
  const photoUrls = (car.photos || []).map((p) => mediaUrl(p.url));

  return (
    <div className="section">
      <div className="container">
        <Link to="/flotte" className="tag" style={{ marginBottom: 24, display: "inline-block" }}>
          ← {t("back_to_fleet")}
        </Link>

        <div className="grid grid--2" style={{ gridTemplateColumns: "1.3fr 1fr", gap: 40, alignItems: "start" }}>
          <div>
            <PhotoGallery photos={photoUrls} alt={car.name} />
          </div>

          <div>
            {category && <span className="eyebrow">{lang === "fr" ? category.name_fr : category.name_en}</span>}
            <h1 className="h1" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", marginTop: 8 }}>
              {car.name}
            </h1>

            <div style={{ marginTop: 24 }}>
              {level && (
                <div className="spec-row">
                  <span>{t("car_level")}</span>
                  <span>{lang === "fr" ? level.label_fr : level.label_en}</span>
                </div>
              )}
              {status && (
                <div className="spec-row">
                  <span>{t("car_status")}</span>
                  <span>{lang === "fr" ? status.label_fr : status.label_en}</span>
                </div>
              )}
              {car.brand && (
                <div className="spec-row">
                  <span>Brand</span>
                  <span>{car.brand}</span>
                </div>
              )}
              {car.model && (
                <div className="spec-row">
                  <span>Model</span>
                  <span>{car.model}</span>
                </div>
              )}
            </div>

            <p style={{ marginTop: 20, color: description ? "var(--text)" : "var(--text-muted)", lineHeight: 1.6 }}>
              {description || t("no_description")}
            </p>

            {status && status.show_return_notice === 1 && <div className="return-notice">{t("return_notice")}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
