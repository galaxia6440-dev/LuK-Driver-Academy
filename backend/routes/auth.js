const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/database");
const { JWT_SECRET } = require("../middleware/auth");

const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Identifiants manquants" });
  }
  const admin = db.prepare(`SELECT * FROM admins WHERE username = ?`).get(username);
  if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }
  const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: "12h" });
  res.json({ token, username: admin.username });
});

router.post("/change-password", (req, res) => {
  const { username, currentPassword, newPassword } = req.body;
  if (!username || !currentPassword || !newPassword) {
    return res.status(400).json({ error: "Champs manquants" });
  }
  const admin = db.prepare(`SELECT * FROM admins WHERE username = ?`).get(username);
  if (!admin || !bcrypt.compareSync(currentPassword, admin.password_hash)) {
    return res.status(401).json({ error: "Mot de passe actuel invalide" });
  }
  const hash = bcrypt.hashSync(newPassword, 10);
  db.prepare(`UPDATE admins SET password_hash = ? WHERE id = ?`).run(hash, admin.id);
  res.json({ ok: true });
});

module.exports = router;
