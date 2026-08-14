import { useLang } from "../i18n/LanguageContext.jsx";

const IOS_URL = "https://apps.apple.com/fr/app/car-parking-multiplayer/id1374868881";
const ANDROID_URL = "https://play.google.com/store/apps/details?id=com.olzhas.carparking.multyplayer";

export default function GamePage() {
  const { t } = useLang();
  return (
    <div className="section">
      <div className="container">
        <div className="eyebrow">Car Parking Multiplayer</div>
        <h1 className="h1">{t("game_title")}</h1>
        <p className="lede" style={{ marginTop: 16 }}>
          {t("game_desc")}
        </p>
        <div style={{ display: "flex", gap: 14, marginTop: 32, flexWrap: "wrap" }}>
          <a href={IOS_URL} target="_blank" rel="noreferrer" className="btn btn--solid">
            {t("game_ios")}
          </a>
          <a href={ANDROID_URL} target="_blank" rel="noreferrer" className="btn btn--ghost">
            {t("game_android")}
          </a>
        </div>
      </div>
    </div>
  );
}
