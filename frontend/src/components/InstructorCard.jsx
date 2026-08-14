import { useLang } from "../i18n/LanguageContext.jsx";
import { mediaUrl } from "../api/config.js";
import "./InstructorCard.css";

export default function InstructorCard({ instructor }) {
  const { lang } = useLang();
  return (
    <div className="instructor-card">
      <div className="instructor-card__photo">
        {instructor.photo ? <img src={mediaUrl(instructor.photo)} alt={instructor.name} /> : <div className="instructor-card__placeholder">{instructor.name.charAt(0)}</div>}
      </div>
      <div className="instructor-card__body">
        <div className="eyebrow">
          {instructor.flag_emoji} {lang === "fr" ? instructor.country_fr : instructor.country_en}
        </div>
        <h3 className="h3">{instructor.name}</h3>
        <p className="instructor-card__specialty">{lang === "fr" ? instructor.specialty_fr : instructor.specialty_en}</p>
      </div>
    </div>
  );
}
