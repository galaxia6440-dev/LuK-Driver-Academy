import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext.jsx";
import { useApiData } from "../api/hooks.js";
import CarCard from "../components/CarCard.jsx";
import InstructorCard from "../components/InstructorCard.jsx";
import "./Home.css";

export default function Home() {
  const { t } = useLang();
  const { data: cars } = useApiData("/cars");
  const { data: instructors } = useApiData("/instructors");
  const { data: categories } = useApiData("/categories");
  const { data: levels } = useApiData("/levels");
  const { data: statuses } = useApiData("/statuses");

  const goals = ["goal_1", "goal_2", "goal_3", "goal_4", "goal_5", "goal_6", "goal_7", "goal_8", "goal_9"];
  const featured = cars ? cars.slice(0, 3) : [];

  return (
    <>
      <section className="hero">
        <div className="hero__bg" aria-hidden="true" />
        <div className="container hero__content">
          <div className="eyebrow">{t("hero_kicker")}</div>
          <h1 className="h1">{t("hero_title")}</h1>
          <p className="hero__slogan">{t("hero_slogan")}</p>
          <p className="lede">{t("hero_desc")}</p>
          <div className="hero__cta">
            <Link to="/flotte" className="btn btn--solid">
              {t("hero_cta_fleet")}
            </Link>
            <Link to="/recrutement" className="btn btn--ghost">
              {t("hero_cta_join")}
            </Link>
          </div>
          <p className="hero__disclaimer">{t("hero_disclaimer")}</p>
        </div>
        <div className="stripe" />
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{t("home_goals_kicker")}</span>
            <h2 className="h2">{t("home_goals_title")}</h2>
          </div>
          <div className="grid grid--3 goals-grid">
            {goals.map((g, i) => (
              <div key={g} className="goal-item">
                <span className="goal-item__num">{String(i + 1).padStart(2, "0")}</span>
                <p>{t(g)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{t("home_instructors_kicker")}</span>
            <h2 className="h2">{t("home_instructors_title")}</h2>
          </div>
          <div className="grid grid--2">
            {(instructors || []).map((i) => (
              <InstructorCard key={i.id} instructor={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{t("home_fleet_kicker")}</span>
            <h2 className="h2">{t("home_fleet_title")}</h2>
          </div>
          <div className="grid grid--3">
            {featured.map((car) => (
              <CarCard key={car.id} car={car} categories={categories} levels={levels} statuses={statuses} />
            ))}
          </div>
          <div className="home-fleet-cta">
            <Link to="/flotte" className="btn btn--ghost">
              {t("home_fleet_cta")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
