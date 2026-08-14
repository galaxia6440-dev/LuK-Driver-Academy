import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Academy from "./pages/Academy.jsx";
import Trainings from "./pages/Trainings.jsx";
import Categories from "./pages/Categories.jsx";
import Fleet from "./pages/Fleet.jsx";
import CarDetail from "./pages/CarDetail.jsx";
import Races from "./pages/Races.jsx";
import Recruitment from "./pages/Recruitment.jsx";
import Contact from "./pages/Contact.jsx";
import GamePage from "./pages/GamePage.jsx";
import NotFound from "./pages/NotFound.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminRoute from "./pages/admin/AdminRoute.jsx";

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Aller au contenu
      </a>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <main id="main">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/academie" element={<Academy />} />
                  <Route path="/formations" element={<Trainings />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/flotte" element={<Fleet />} />
                  <Route path="/flotte/:slug" element={<CarDetail />} />
                  <Route path="/courses" element={<Races />} />
                  <Route path="/recrutement" element={<Recruitment />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/jeu" element={<GamePage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </>
  );
}
