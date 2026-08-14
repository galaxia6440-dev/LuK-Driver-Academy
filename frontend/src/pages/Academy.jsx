import { useLang } from "../i18n/LanguageContext.jsx";
import { useApiData } from "../api/hooks.js";
import InstructorCard from "../components/InstructorCard.jsx";

export default function Academy() {
  const { t } = useLang();
  const { data: instructors } = useApiData("/instructors");
  const goals = ["goal_1", "goal_2", "goal_3", "goal_4", "goal_5", "goal_6", "goal_7", "goal_8", "goal_9"];

  return (
    <div className="section">
      <div className="container">
        <div className="eyebrow">{t("hero_kicker")}</div>
        <h1 className="h1">{t("academy_title")}</h1>
        <p className="lede" style={{ marginTop: 16 }}>
          {t("academy_intro")}
        </p>

        <div className="stripe stripe--thin" style={{ margin: "40px 0" }} />

        <h2 className="h2" style={{ marginBottom: 24 }}>
          {t("home_goals_title")}
        </h2>
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12, maxWidth: 640 }}>
          {goals.map((g, i) => (
            <li key={g} style={{ display: "flex", gap: 14 }}>
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--gold)" }}>{String(i + 1).padStart(2, "0")}</span>
              <span>{t(g)}</span>
            </li>
          ))}
        </ul>

        <div className="stripe stripe--thin" style={{ margin: "48px 0 40px" }} />

        <h2 className="h2" style={{ marginBottom: 24 }}>
          {t("home_instructors_title")}
        </h2>
        <div className="grid grid--2">
          {(instructors || []).map((i) => (
            <InstructorCard key={i.id} instructor={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
