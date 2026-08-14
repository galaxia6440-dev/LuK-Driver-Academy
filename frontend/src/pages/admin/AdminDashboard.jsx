import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminCars from "./AdminCars.jsx";
import AdminInstructors from "./AdminInstructors.jsx";
import AdminTrainings from "./AdminTrainings.jsx";
import AdminEvents from "./AdminEvents.jsx";
import AdminApplications from "./AdminApplications.jsx";
import "./admin.css";

const TABS = [
  { key: "cars", label: "Voitures", Component: AdminCars },
  { key: "instructors", label: "Moniteurs", Component: AdminInstructors },
  { key: "trainings", label: "Formations", Component: AdminTrainings },
  { key: "events", label: "Événements", Component: AdminEvents },
  { key: "applications", label: "Candidatures", Component: AdminApplications },
];

export default function AdminDashboard() {
  const [active, setActive] = useState("cars");
  const navigate = useNavigate();

  const logout = () => {
    window.localStorage.removeItem("luk_admin_token");
    navigate("/admin/login");
  };

  const Active = TABS.find((t) => t.key === active)?.Component || AdminCars;

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <div className="admin__brand">LuK Admin</div>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`admin__nav-item ${active === t.key ? "admin__nav-item--active" : ""}`}
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </button>
        ))}
        <button className="btn btn--ghost btn--sm admin__logout" onClick={logout}>
          Se déconnecter
        </button>
      </aside>
      <main className="admin__main">
        <Active />
      </main>
    </div>
  );
}
