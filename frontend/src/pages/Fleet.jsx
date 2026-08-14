import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext.jsx";
import { useApiData } from "../api/hooks.js";
import CarCard from "../components/CarCard.jsx";

export default function Fleet() {
  const { t, lang } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";

  const { data: cars, loading } = useApiData("/cars");
  const { data: categories } = useApiData("/categories");
  const { data: levels } = useApiData("/levels");
  const { data: statuses } = useApiData("/statuses");

  const filtered = useMemo(() => {
    if (!cars) return [];
    if (!activeCategory) return cars;
    return cars.filter((c) => c.category_key === activeCategory);
  }, [cars, activeCategory]);

  const usedCategories = useMemo(() => {
    if (!cars || !categories) return [];
    const keys = new Set(cars.map((c) => c.category_key));
    return categories.filter((c) => keys.has(c.key));
  }, [cars, categories]);

  return (
    <div className="section">
      <div className="container">
        <div className="eyebrow">{t("nav_fleet")}</div>
        <h1 className="h1">{t("fleet_title")}</h1>
        <p className="lede" style={{ marginTop: 16 }}>
          {t("fleet_intro")}
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "36px 0" }}>
          <button
            className={`tag ${!activeCategory ? "tag--gold" : ""}`}
            style={{ cursor: "pointer", background: "none" }}
            onClick={() => setSearchParams({})}
          >
            {t("filter_all")}
          </button>
          {usedCategories.map((c) => (
            <button
              key={c.key}
              className={`tag ${activeCategory === c.key ? "tag--gold" : ""}`}
              style={{ cursor: "pointer", background: "none" }}
              onClick={() => setSearchParams({ category: c.key })}
            >
              {lang === "fr" ? c.name_fr : c.name_en}
            </button>
          ))}
        </div>

        {!loading && filtered.length === 0 && <p style={{ color: "var(--text-muted)" }}>—</p>}

        <div className="grid grid--3">
          {filtered.map((car) => (
            <CarCard key={car.id} car={car} categories={categories} levels={levels} statuses={statuses} />
          ))}
        </div>
      </div>
    </div>
  );
}
