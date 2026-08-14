const express = require("express");
const db = require("../db/database");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/categories", (req, res) => {
  res.json(db.prepare(`SELECT * FROM categories ORDER BY sort_order ASC`).all());
});
router.put("/categories/:key", requireAuth, (req, res) => {
  const { name_fr, name_en, description_fr, description_en } = req.body;
  const cat = db.prepare(`SELECT * FROM categories WHERE key = ?`).get(req.params.key);
  if (!cat) return res.status(404).json({ error: "Catégorie introuvable" });
  db.prepare(`UPDATE categories SET name_fr = COALESCE(?, name_fr), name_en = COALESCE(?, name_en), description_fr = COALESCE(?, description_fr), description_en = COALESCE(?, description_en) WHERE key = ?`)
    .run(name_fr, name_en, description_fr, description_en, req.params.key);
  res.json(db.prepare(`SELECT * FROM categories WHERE key = ?`).get(req.params.key));
});

router.get("/statuses", (req, res) => {
  res.json(db.prepare(`SELECT * FROM statuses`).all());
});

router.get("/levels", (req, res) => {
  res.json(db.prepare(`SELECT * FROM levels ORDER BY sort_order ASC`).all());
});

module.exports = router;
