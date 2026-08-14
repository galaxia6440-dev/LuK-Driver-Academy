import { useLang } from "../i18n/LanguageContext.jsx";
import { useApiData } from "../api/hooks.js";

export default function Races() {
  const { t, lang } = useLang();
  const { data: events } = useApiData("/events");

  return (
    <div className="section">
      <div className="container">
        <div className="eyebrow">{t("nav_races")}</div>
        <h1 className="h1">{t("races_title")}</h1>
        <p className="lede" style={{ marginTop: 16 }}>
          {t("races_intro")}
        </p>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", margin: "32px 0 56px" }}>
          <a href="https://discord.gg/gyN9pzZcep" target="_blank" rel="noreferrer" className="btn btn--solid">
            {t("races_gpr_join")}
          </a>
          <a href="https://www.instagram.com/grand_prix_racing/" target="_blank" rel="noreferrer" className="btn btn--ghost">
            {t("races_gpr_instagram")}
          </a>
        </div>

        <div className="stripe stripe--thin" style={{ margin: "0 0 40px" }} />

        <h2 className="h2" style={{ marginBottom: 24 }}>
          {t("races_upcoming")}
        </h2>

        {(!events || events.length === 0) && <p style={{ color: "var(--text-muted)" }}>{t("races_none")}</p>}

        <div className="grid grid--2">
          {(events || []).map((ev) => (
            <div key={ev.id} className="card" style={{ padding: 22 }}>
              {ev.date && <span className="eyebrow">{ev.date}</span>}
              <h3 className="h3" style={{ marginTop: 8 }}>
                {lang === "fr" ? ev.title_fr : ev.title_en}
              </h3>
              {(ev.description_fr || ev.description_en) && (
                <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 10 }}>
                  {lang === "fr" ? ev.description_fr : ev.description_en}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
