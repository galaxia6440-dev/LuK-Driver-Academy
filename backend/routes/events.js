const express = require("express");
const db = require("../db/database");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(db.prepare(`SELECT * FROM events ORDER BY date ASC`).all());
});

router.post("/", requireAuth, (req, res) => {
  const { title_fr, title_en, description_fr, description_en, date } = req.body;
  if (!title_fr || !title_en) return res.status(400).json({ error: "Titre (FR et EN) requis" });
  const info = db
    .prepare(`INSERT INTO events (title_fr, title_en, description_fr, description_en, date) VALUES (?, ?, ?, ?, ?)`)
    .run(title_fr, title_en, description_fr || null, description_en || null, date || null);
  res.status(201).json(db.prepare(`SELECT * FROM events WHERE id = ?`).get(info.lastInsertRowid));
});

router.put("/:id", requireAuth, (req, res) => {
  const event = db.prepare(`SELECT * FROM events WHERE id = ?`).get(req.params.id);
  if (!event) return res.status(404).json({ error: "Événement introuvable" });
  const fields = ["title_fr", "title_en", "description_fr", "description_en", "date"];
  const updates = {};
  Object.keys(req.body).forEach((k) => {
    if (fields.includes(k)) updates[k] = req.body[k];
  });
  if (Object.keys(updates).length === 0) return res.status(400).json({ error: "Rien à mettre à jour" });
  const setClause = Object.keys(updates).map((k) => `${k} = @${k}`).join(", ");
  db.prepare(`UPDATE events SET ${setClause} WHERE id = @id`).run({ ...updates, id: event.id });
  res.json(db.prepare(`SELECT * FROM events WHERE id = ?`).get(event.id));
});

router.delete("/:id", requireAuth, (req, res) => {
  const event = db.prepare(`SELECT * FROM events WHERE id = ?`).get(req.params.id);
  if (!event) return res.status(404).json({ error: "Événement introuvable" });
  db.prepare(`DELETE FROM events WHERE id = ?`).run(event.id);
  res.json({ ok: true });
});

module.exports = router;
