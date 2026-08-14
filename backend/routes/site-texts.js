const express = require("express");
const db = require("../db/database");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", (req, res) => {
  const rows = db.prepare(`SELECT * FROM site_texts`).all();
  const map = {};
  rows.forEach((r) => {
    map[r.text_key] = { fr: r.value_fr, en: r.value_en };
  });
  res.json(map);
});

router.put("/:key", requireAuth, (req, res) => {
  const { fr, en } = req.body;
  const existing = db.prepare(`SELECT * FROM site_texts WHERE text_key = ?`).get(req.params.key);
  if (existing) {
    db.prepare(`UPDATE site_texts SET value_fr = COALESCE(?, value_fr), value_en = COALESCE(?, value_en) WHERE text_key = ?`).run(fr, en, req.params.key);
  } else {
    db.prepare(`INSERT INTO site_texts (text_key, value_fr, value_en) VALUES (?, ?, ?)`).run(req.params.key, fr || null, en || null);
  }
  res.json({ ok: true });
});

module.exports = router;
