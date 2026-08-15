import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import { useLang } from "../i18n/LanguageContext.jsx";
import "./Navbar.css";

const links = [
  { to: "/", key: "nav_home" },
  { to: "/academie", key: "nav_academy" },
  { to: "/moniteurs", key: "nav_instructors" },
  { to: "/formations", key: "nav_trainings" },
  { to: "/categories", key: "nav_categories" },
  { to: "/flotte", key: "nav_fleet" },
  { to: "/courses", key: "nav_races" },
  { to: "/recrutement", key: "nav_recruitment" },
  { to: "/contact", key: "nav_contact" },
];

export default function Navbar() {
  const { t, toggleLang, lang } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="nav__stripe" />
      <div className="container nav__row">
        <Link to="/" className="nav__brand" onClick={() => setOpen(false)}>
          LuK <span>Driver Academy</span>
        </Link>

        <nav className={`nav__links ${open ? "nav__links--open" : ""}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) => `nav__link ${isActive ? "nav__link--active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {t(l.key)}
            </NavLink>
          ))}
        </nav>

        <div className="nav__actions">
          <button className="nav__lang" onClick={toggleLang} aria-label="Changer de langue">
            {lang === "fr" ? "FR" : "EN"} <span className="nav__lang-sep">/</span> {t("lang_switch")}
          </button>
          <button className="nav__burger" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
