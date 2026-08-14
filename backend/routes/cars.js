const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db/database");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function slugify(s) {
  return s
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function carUploadDir(slug) {
  return path.join(__dirname, "..", "uploads", "cars", slug);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const slug = req.params.slug;
    const dir = carUploadDir(slug);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ok = [".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(path.extname(file.originalname).toLowerCase());
    cb(ok ? null : new Error("Type de fichier non supporté"), ok);
  },
  limits: { fileSize: 15 * 1024 * 1024 },
});

function attachPhotos(car) {
  const photos = db.prepare(`SELECT id, url, sort_order FROM car_photos WHERE car_id = ? ORDER BY sort_order ASC`).all(car.id);
  return { ...car, photos };
}

// GET /api/cars  (public) — filtrable par category, level, status
router.get("/", (req, res) => {
  const { category, level, status } = req.query;
  let sql = `SELECT * FROM cars WHERE 1=1`;
  const params = [];
  if (category) {
    sql += ` AND category_key = ?`;
    params.push(category);
  }
  if (level) {
    sql += ` AND level_key = ?`;
    params.push(level);
  }
  if (status) {
    sql += ` AND status_key = ?`;
    params.push(status);
  }
  sql += ` ORDER BY sort_order ASC, id ASC`;
  const cars = db.prepare(sql).all(...params).map(attachPhotos);
  res.json(cars);
});

// GET /api/cars/:slug (public)
router.get("/:slug", (req, res) => {
  const car = db.prepare(`SELECT * FROM cars WHERE slug = ?`).get(req.params.slug);
  if (!car) return res.status(404).json({ error: "Voiture introuvable" });
  res.json(attachPhotos(car));
});

// POST /api/cars (admin) — créer une voiture
router.post("/", requireAuth, (req, res) => {
  const { name, brand, model, category, level, status, description_fr, description_en } = req.body;
  if (!name || !category || !level || !status) {
    return res.status(400).json({ error: "Champs requis manquants (nom, catégorie, niveau, statut)" });
  }
  let slug = slugify(name);
  const existing = db.prepare(`SELECT id FROM cars WHERE slug = ?`).get(slug);
  if (existing) slug = `${slug}-${Date.now()}`;

  const maxOrder = db.prepare(`SELECT MAX(sort_order) as m FROM cars`).get();
  const info = db
    .prepare(
      `INSERT INTO cars (slug, name, brand, model, category_key, level_key, status_key, description_fr, description_en, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(slug, name, brand || null, model || null, category, level, status, description_fr || null, description_en || null, (maxOrder.m || 0) + 1);

  const car = db.prepare(`SELECT * FROM cars WHERE id = ?`).get(info.lastInsertRowid);
  res.status(201).json(attachPhotos(car));
});

// PUT /api/cars/:slug (admin) — modifier une voiture (jamais le nom automatiquement)
router.put("/:slug", requireAuth, (req, res) => {
  const car = db.prepare(`SELECT * FROM cars WHERE slug = ?`).get(req.params.slug);
  if (!car) return res.status(404).json({ error: "Voiture introuvable" });

  const fields = ["name", "brand", "model", "category_key", "level_key", "status_key", "description_fr", "description_en", "main_photo"];
  const body = req.body;
  const updates = {};
  const map = { category: "category_key", level: "level_key", status: "status_key" };
  Object.keys(body).forEach((k) => {
    const col = map[k] || k;
    if (fields.includes(col)) updates[col] = body[k];
  });

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "Aucun champ à mettre à jour" });
  }

  const setClause = Object.keys(updates).map((k) => `${k} = @${k}`).join(", ");
  db.prepare(`UPDATE cars SET ${setClause} WHERE id = @id`).run({ ...updates, id: car.id });

  const updated = db.prepare(`SELECT * FROM cars WHERE id = ?`).get(car.id);
  res.json(attachPhotos(updated));
});

// DELETE /api/cars/:slug (admin)
router.delete("/:slug", requireAuth, (req, res) => {
  const car = db.prepare(`SELECT * FROM cars WHERE slug = ?`).get(req.params.slug);
  if (!car) return res.status(404).json({ error: "Voiture introuvable" });
  db.prepare(`DELETE FROM cars WHERE id = ?`).run(car.id);
  const dir = carUploadDir(car.slug);
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  res.json({ ok: true });
});

// POST /api/cars/:slug/photos (admin) — ajouter une ou plusieurs photos
router.post("/:slug/photos", requireAuth, upload.array("photos", 20), (req, res) => {
  const car = db.prepare(`SELECT * FROM cars WHERE slug = ?`).get(req.params.slug);
  if (!car) return res.status(404).json({ error: "Voiture introuvable" });

  const maxOrder = db.prepare(`SELECT MAX(sort_order) as m FROM car_photos WHERE car_id = ?`).get(car.id);
  let order = (maxOrder.m || 0) + 1;
  const insertPhoto = db.prepare(`INSERT INTO car_photos (car_id, url, sort_order) VALUES (?, ?, ?)`);
  const inserted = [];
  (req.files || []).forEach((file) => {
    const url = `/uploads/cars/${car.slug}/${file.filename}`;
    const info = insertPhoto.run(car.id, url, order++);
    inserted.push({ id: info.lastInsertRowid, url });
  });

  if (!car.main_photo && inserted.length > 0) {
    db.prepare(`UPDATE cars SET main_photo = ? WHERE id = ?`).run(inserted[0].url, car.id);
  }

  res.status(201).json({ photos: inserted });
});

// DELETE /api/cars/:slug/photos/:photoId (admin)
router.delete("/:slug/photos/:photoId", requireAuth, (req, res) => {
  const car = db.prepare(`SELECT * FROM cars WHERE slug = ?`).get(req.params.slug);
  if (!car) return res.status(404).json({ error: "Voiture introuvable" });
  const photo = db.prepare(`SELECT * FROM car_photos WHERE id = ? AND car_id = ?`).get(req.params.photoId, car.id);
  if (!photo) return res.status(404).json({ error: "Photo introuvable" });

  db.prepare(`DELETE FROM car_photos WHERE id = ?`).run(photo.id);

  const filePath = path.join(__dirname, "..", photo.url.replace(/^\//, ""));
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  if (car.main_photo === photo.url) {
    const next = db.prepare(`SELECT url FROM car_photos WHERE car_id = ? ORDER BY sort_order ASC LIMIT 1`).get(car.id);
    db.prepare(`UPDATE cars SET main_photo = ? WHERE id = ?`).run(next ? next.url : null, car.id);
  }

  res.json({ ok: true });
});

// PUT /api/cars/:slug/main-photo (admin) — définir la photo principale
router.put("/:slug/main-photo", requireAuth, (req, res) => {
  const { url } = req.body;
  const car = db.prepare(`SELECT * FROM cars WHERE slug = ?`).get(req.params.slug);
  if (!car) return res.status(404).json({ error: "Voiture introuvable" });
  const photo = db.prepare(`SELECT * FROM car_photos WHERE car_id = ? AND url = ?`).get(car.id, url);
  if (!photo) return res.status(404).json({ error: "Photo introuvable pour cette voiture" });
  db.prepare(`UPDATE cars SET main_photo = ? WHERE id = ?`).run(url, car.id);
  res.json({ ok: true, main_photo: url });
});

module.exports = router;
