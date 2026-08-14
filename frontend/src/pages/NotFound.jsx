import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext.jsx";

export default function NotFound() {
  const { t } = useLang();
  return (
    <div className="section" style={{ textAlign: "center" }}>
      <div className="container">
        <div className="eyebrow">404</div>
        <h1 className="h1">—</h1>
        <Link to="/" className="btn btn--ghost" style={{ marginTop: 24 }}>
          {t("nav_home")}
        </Link>
      </div>
    </div>
  );
}
