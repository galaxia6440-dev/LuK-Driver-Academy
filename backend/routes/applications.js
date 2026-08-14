const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db/database");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "uploads", "applications");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  },
});
const upload = multer({ storage });

const VALID_STATUSES = ["nouvelle", "en_cours", "acceptee", "refusee"];

// POST /api/applications (public) — soumission du formulaire de recrutement
router.post("/", upload.single("photo"), (req, res) => {
  const { pseudo, full_name, country, age, desired_category, driving_level, race_experience, motivation, discord_id } = req.body;
  if (!pseudo || !country || !age) {
    return res.status(400).json({ error: "Pseudo, pays et âge sont requis" });
  }
  const photoUrl = req.file ? `/uploads/applications/${req.file.filename}` : null;
  const info = db
    .prepare(
      `INSERT INTO applications (pseudo, full_name, country, age, desired_category, driving_level, race_experience, motivation, discord_id, photo, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'nouvelle')`
    )
    .run(pseudo, full_name || null, country, Number(age), desired_category || null, driving_level || null, race_experience || null, motivation || null, discord_id || null, photoUrl);
  res.status(201).json({ ok: true, id: info.lastInsertRowid });
});

// GET /api/applications (admin) — liste des candidatures
router.get("/", requireAuth, (req, res) => {
  const { status } = req.query;
  let sql = `SELECT * FROM applications`;
  const params = [];
  if (status) {
    sql += ` WHERE status = ?`;
    params.push(status);
  }
  sql += ` ORDER BY created_at DESC`;
  res.json(db.prepare(sql).all(...params));
});

// PUT /api/applications/:id/status (admin)
router.put("/:id/status", requireAuth, (req, res) => {
  const { status } = req.body;
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: "Statut invalide" });
  }
  const app = db.prepare(`SELECT * FROM applications WHERE id = ?`).get(req.params.id);
  if (!app) return res.status(404).json({ error: "Candidature introuvable" });
  db.prepare(`UPDATE applications SET status = ? WHERE id = ?`).run(status, app.id);
  res.json(db.prepare(`SELECT * FROM applications WHERE id = ?`).get(app.id));
});

router.delete("/:id", requireAuth, (req, res) => {
  const app = db.prepare(`SELECT * FROM applications WHERE id = ?`).get(req.params.id);
  if (!app) return res.status(404).json({ error: "Candidature introuvable" });
  db.prepare(`DELETE FROM applications WHERE id = ?`).run(app.id);
  res.json({ ok: true });
});

module.exports = router;
