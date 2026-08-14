import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext.jsx";
import "./Footer.css";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="footer">
      <div className="stripe stripe--thin" />
      <div className="container footer__row">
        <div>
          <div className="footer__brand">LuK Driver Academy</div>
          <p className="footer__text">{t("footer_rights")}</p>
        </div>
        <div className="footer__links">
          <Link to="/contact">{t("nav_contact")}</Link>
          <Link to="/recrutement">{t("nav_recruitment")}</Link>
          <Link to="/flotte">{t("nav_fleet")}</Link>
          <a href="https://discord.gg/gyN9pzZcep" target="_blank" rel="noreferrer">
            {t("contact_gpr_discord")}
          </a>
        </div>
      </div>
    </footer>
  );
}
