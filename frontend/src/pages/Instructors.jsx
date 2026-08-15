import { useLang } from "../i18n/LanguageContext.jsx";
import { useApiData } from "../api/hooks.js";
import InstructorCard from "../components/InstructorCard.jsx";

export default function Instructors() {
  const { t } = useLang();
  const { data: instructors, loading } = useApiData("/instructors");

  return (
    <div className="section">
      <div className="container">
        <div className="eyebrow">{t("home_instructors_kicker")}</div>
        <h1 className="h1">{t("home_instructors_title")}</h1>
        <p className="lede" style={{ marginTop: 16 }}>
          {t("instructors_intro")}
        </p>

        <div className="grid grid--2" style={{ marginTop: 44 }}>
          {(instructors || []).map((i) => (
            <InstructorCard key={i.id} instructor={i} />
          ))}
        </div>

        {!loading && (!instructors || instructors.length === 0) && (
          <p style={{ color: "var(--text-muted)", marginTop: 24 }}>—</p>
        )}
      </div>
    </div>
  );
}
