const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db/database");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "uploads", "instructors");
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

router.get("/", (req, res) => {
  res.json(db.prepare(`SELECT * FROM instructors ORDER BY sort_order ASC`).all());
});

router.post("/", requireAuth, (req, res) => {
  const { name, country_fr, country_en, flag_emoji, specialty_fr, specialty_en } = req.body;
  if (!name || !country_fr || !specialty_fr) {
    return res.status(400).json({ error: "Champs requis manquants" });
  }
  const maxOrder = db.prepare(`SELECT MAX(sort_order) as m FROM instructors`).get();
  const info = db
    .prepare(`INSERT INTO instructors (name, country_fr, country_en, flag_emoji, specialty_fr, specialty_en, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .run(name, country_fr, country_en || country_fr, flag_emoji || "", specialty_fr, specialty_en || specialty_fr, (maxOrder.m || 0) + 1);
  res.status(201).json(db.prepare(`SELECT * FROM instructors WHERE id = ?`).get(info.lastInsertRowid));
});

router.put("/:id", requireAuth, (req, res) => {
  const instructor = db.prepare(`SELECT * FROM instructors WHERE id = ?`).get(req.params.id);
  if (!instructor) return res.status(404).json({ error: "Moniteur introuvable" });
  const fields = ["name", "country_fr", "country_en", "flag_emoji", "specialty_fr", "specialty_en", "photo"];
  const updates = {};
  Object.keys(req.body).forEach((k) => {
    if (fields.includes(k)) updates[k] = req.body[k];
  });
  if (Object.keys(updates).length === 0) return res.status(400).json({ error: "Rien à mettre à jour" });
  const setClause = Object.keys(updates).map((k) => `${k} = @${k}`).join(", ");
  db.prepare(`UPDATE instructors SET ${setClause} WHERE id = @id`).run({ ...updates, id: instructor.id });
  res.json(db.prepare(`SELECT * FROM instructors WHERE id = ?`).get(instructor.id));
});

router.post("/:id/photo", requireAuth, upload.single("photo"), (req, res) => {
  const instructor = db.prepare(`SELECT * FROM instructors WHERE id = ?`).get(req.params.id);
  if (!instructor) return res.status(404).json({ error: "Moniteur introuvable" });
  if (!req.file) return res.status(400).json({ error: "Aucun fichier reçu" });
  const url = `/uploads/instructors/${req.file.filename}`;
  db.prepare(`UPDATE instructors SET photo = ? WHERE id = ?`).run(url, instructor.id);
  res.json({ ok: true, photo: url });
});

router.delete("/:id", requireAuth, (req, res) => {
  const instructor = db.prepare(`SELECT * FROM instructors WHERE id = ?`).get(req.params.id);
  if (!instructor) return res.status(404).json({ error: "Moniteur introuvable" });
  db.prepare(`DELETE FROM instructors WHERE id = ?`).run(instructor.id);
  res.json({ ok: true });
});

module.exports = router;
