const express = require("express");
const db = require("../db/database");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", (req, res) => {
  const trainings = db
    .prepare(
      `SELECT t.*, i.name as instructor_name FROM trainings t
       LEFT JOIN instructors i ON i.id = t.instructor_id
       ORDER BY t.sort_order ASC`
    )
    .all();
  res.json(trainings);
});

router.post("/", requireAuth, (req, res) => {
  const { name_fr, name_en, description_fr, description_en, level_key, category_key, instructor_id } = req.body;
  if (!name_fr || !name_en) return res.status(400).json({ error: "Nom (FR et EN) requis" });
  const maxOrder = db.prepare(`SELECT MAX(sort_order) as m FROM trainings`).get();
  const info = db
    .prepare(
      `INSERT INTO trainings (name_fr, name_en, description_fr, description_en, level_key, category_key, instructor_id, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(name_fr, name_en, description_fr || null, description_en || null, level_key || null, category_key || null, instructor_id || null, (maxOrder.m || 0) + 1);
  res.status(201).json(db.prepare(`SELECT * FROM trainings WHERE id = ?`).get(info.lastInsertRowid));
});

router.put("/:id", requireAuth, (req, res) => {
  const training = db.prepare(`SELECT * FROM trainings WHERE id = ?`).get(req.params.id);
  if (!training) return res.status(404).json({ error: "Formation introuvable" });
  const fields = ["name_fr", "name_en", "description_fr", "description_en", "level_key", "category_key", "instructor_id"];
  const updates = {};
  Object.keys(req.body).forEach((k) => {
    if (fields.includes(k)) updates[k] = req.body[k];
  });
  if (Object.keys(updates).length === 0) return res.status(400).json({ error: "Rien à mettre à jour" });
  const setClause = Object.keys(updates).map((k) => `${k} = @${k}`).join(", ");
  db.prepare(`UPDATE trainings SET ${setClause} WHERE id = @id`).run({ ...updates, id: training.id });
  res.json(db.prepare(`SELECT * FROM trainings WHERE id = ?`).get(training.id));
});

router.delete("/:id", requireAuth, (req, res) => {
  const training = db.prepare(`SELECT * FROM trainings WHERE id = ?`).get(req.params.id);
  if (!training) return res.status(404).json({ error: "Formation introuvable" });
  db.prepare(`DELETE FROM trainings WHERE id = ?`).run(training.id);
  res.json({ ok: true });
});

module.exports = router;
