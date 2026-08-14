import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext.jsx";
import { mediaUrl } from "../api/config.js";
import "./CarCard.css";

export default function CarCard({ car, categories, levels, statuses }) {
  const { lang, t } = useLang();
  const category = categories?.find((c) => c.key === car.category_key);
  const level = levels?.find((l) => l.key === car.level_key);
  const status = statuses?.find((s) => s.key === car.status_key);

  return (
    <Link to={`/flotte/${car.slug}`} className="car-card">
      <div className="car-card__img-wrap">
        {car.main_photo ? (
          <img src={mediaUrl(car.main_photo)} alt={car.name} loading="lazy" />
        ) : (
          <div className="car-card__placeholder" />
        )}
        {status && <span className="tag car-card__status">{lang === "fr" ? status.label_fr : status.label_en}</span>}
      </div>
      <div className="car-card__body">
        <div className="car-card__meta">
          {category && <span className="eyebrow">{lang === "fr" ? category.name_fr : category.name_en}</span>}
          {level && <span className="tag tag--gold">{lang === "fr" ? level.label_fr : level.label_en}</span>}
        </div>
        <h3 className="h3 car-card__name">{car.name}</h3>
      </div>
    </Link>
  );
}
