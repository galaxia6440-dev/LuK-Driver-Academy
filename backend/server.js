require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const carsRoutes = require("./routes/cars");
const taxonomyRoutes = require("./routes/taxonomy");
const instructorsRoutes = require("./routes/instructors");
const trainingsRoutes = require("./routes/trainings");
const eventsRoutes = require("./routes/events");
const applicationsRoutes = require("./routes/applications");
const siteTextsRoutes = require("./routes/site-texts");

const app = express();
const PORT = process.env.PORT || 4000;

// CORS : en production, seuls les domaines listés dans FRONTEND_URL (séparés par des virgules)
// sont autorisés à appeler l'API. En dev (rien de défini), tout est autorisé pour simplifier.
const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Requêtes sans origin (curl, health checks) ou aucune restriction configurée
      if (!origin || allowedOrigins.length === 0) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin ${origin} non autorisée par CORS`));
    },
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/cars", carsRoutes);
app.use("/api", taxonomyRoutes);
app.use("/api/instructors", instructorsRoutes);
app.use("/api/trainings", trainingsRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/site-texts", siteTextsRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Erreur serveur" });
});

app.listen(PORT, () => {
  console.log(`LuK Driver Academy API en écoute sur le port ${PORT}`);
});
