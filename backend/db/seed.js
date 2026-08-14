const db = require("./database");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const carsSeed = JSON.parse(fs.readFileSync(path.join(__dirname, "cars_seed.json"), "utf-8"));

const categories = [
  { key: "gt", name_fr: "GT", name_en: "GT", description_fr: "Voitures de Grand Tourisme, entre performance et élégance.", description_en: "Grand Touring cars, balancing performance and elegance.", sort_order: 1 },
  { key: "gt3", name_fr: "GT3", name_en: "GT3", description_fr: "Catégorie reine de la compétition GT sur circuit.", description_en: "The premier category of circuit GT racing.", sort_order: 2 },
  { key: "gt4", name_fr: "GT4", name_en: "GT4", description_fr: "Compétition GT accessible, tremplin vers le GT3.", description_en: "Accessible GT racing, a stepping stone toward GT3.", sort_order: 3 },
  { key: "hypercar", name_fr: "Hypercar", name_en: "Hypercar", description_fr: "Les machines les plus extrêmes de l'académie.", description_en: "The academy's most extreme machines.", sort_order: 4 },
  { key: "touring-car", name_fr: "Touring Car", name_en: "Touring Car", description_fr: "Berlines et compactes préparées pour la compétition.", description_en: "Sedans and compacts prepared for competition.", sort_order: 5 },
  { key: "rallye", name_fr: "Rallye", name_en: "Rally", description_fr: "Pilotage sur terrains variés, entre précision et adaptation.", description_en: "Driving across varied terrain, blending precision and adaptability.", sort_order: 6 },
  { key: "drift", name_fr: "Drift", name_en: "Drift", description_fr: "L'art du contrôle en dérapage.", description_en: "The art of controlled sliding.", sort_order: 7 },
  { key: "time-attack", name_fr: "Time Attack", name_en: "Time Attack", description_fr: "La quête du chrono parfait, seul contre la montre.", description_en: "The pursuit of the perfect lap, alone against the clock.", sort_order: 8 },
  { key: "monoplace", name_fr: "Monoplace", name_en: "Single-seater", description_fr: "L'exigence pure du pilotage en monoplace.", description_en: "The pure demands of single-seater racing.", sort_order: 9 },
  { key: "endurance", name_fr: "Endurance", name_en: "Endurance", description_fr: "Course de longue distance, gestion et régularité.", description_en: "Long-distance racing, management and consistency.", sort_order: 10 },
  { key: "formation-debutant", name_fr: "Formation débutant", name_en: "Beginner training", description_fr: "Voitures dédiées aux premiers pas dans l'académie.", description_en: "Cars dedicated to first steps in the academy.", sort_order: 11 },
  { key: "formation-avancee", name_fr: "Formation avancée", name_en: "Advanced training", description_fr: "Pour les pilotes prêts à passer un cap.", description_en: "For drivers ready to take the next step.", sort_order: 12 },
  { key: "autre", name_fr: "Autre", name_en: "Other", description_fr: "Voitures diverses de l'académie.", description_en: "Other academy cars.", sort_order: 13 },
];

const statuses = [
  { key: "academie", label_fr: "Voiture de l'académie", label_en: "Academy car", show_return_notice: 0 },
  { key: "pretee", label_fr: "Voiture prêtée", label_en: "Loaned car", show_return_notice: 1 },
  { key: "competition", label_fr: "Voiture de compétition", label_en: "Competition car", show_return_notice: 0 },
  { key: "entrainement", label_fr: "Véhicule d'entraînement", label_en: "Training vehicle", show_return_notice: 0 },
  { key: "competition_debutant", label_fr: "Voiture de compétition débutant", label_en: "Beginner competition car", show_return_notice: 0 },
  { key: "personnelle_apprentis", label_fr: "Voiture personnelle de chaque apprenti", label_en: "Each trainee's personal car", show_return_notice: 0 },
  { key: "basique", label_fr: "Voiture basique", label_en: "Basic car", show_return_notice: 0 },
  { key: "autres", label_fr: "Autres", label_en: "Other", show_return_notice: 0 },
];

const levels = [
  { key: "debutant", label_fr: "Débutant", label_en: "Beginner", sort_order: 1 },
  { key: "intermediaire", label_fr: "Intermédiaire", label_en: "Intermediate", sort_order: 2 },
  { key: "avance", label_fr: "Avancé", label_en: "Advanced", sort_order: 3 },
];

const instructors = [
  { name: "L. Dufour", country_fr: "France", country_en: "France", flag_emoji: "🇫🇷", specialty_fr: "Moniteur boîte automatique", specialty_en: "Automatic transmission instructor", photo: null, sort_order: 1 },
  { name: "MrBread", country_fr: "Malaisie", country_en: "Malaysia", flag_emoji: "🇲🇾", specialty_fr: "Moniteur boîte manuelle", specialty_en: "Manual transmission instructor", photo: null, sort_order: 2 },
];

const trainings = [
  { name_fr: "Initiation au pilotage", name_en: "Driving initiation", level_key: "debutant", category_key: "formation-debutant" },
  { name_fr: "Perfectionnement", name_en: "Skill development", level_key: "intermediaire", category_key: null },
  { name_fr: "Trajectoires", name_en: "Racing lines", level_key: "intermediaire", category_key: null },
  { name_fr: "Freinage", name_en: "Braking", level_key: "intermediaire", category_key: null },
  { name_fr: "Dépassements", name_en: "Overtaking", level_key: "avance", category_key: null },
  { name_fr: "Techniques de course", name_en: "Race techniques", level_key: "avance", category_key: null },
  { name_fr: "Gestion d'une course", name_en: "Race management", level_key: "avance", category_key: null },
  { name_fr: "Préparation à la compétition", name_en: "Competition preparation", level_key: "avance", category_key: "formation-avancee" },
  { name_fr: "Formation débutant", name_en: "Beginner training", level_key: "debutant", category_key: "formation-debutant" },
  { name_fr: "Formation avancée", name_en: "Advanced training", level_key: "avance", category_key: "formation-avancee" },
];

function run() {
  const insertCategory = db.prepare(`INSERT OR IGNORE INTO categories (key, name_fr, name_en, description_fr, description_en, sort_order) VALUES (@key, @name_fr, @name_en, @description_fr, @description_en, @sort_order)`);
  categories.forEach((c) => insertCategory.run(c));

  const insertStatus = db.prepare(`INSERT OR IGNORE INTO statuses (key, label_fr, label_en, show_return_notice) VALUES (@key, @label_fr, @label_en, @show_return_notice)`);
  statuses.forEach((s) => insertStatus.run(s));

  const insertLevel = db.prepare(`INSERT OR IGNORE INTO levels (key, label_fr, label_en, sort_order) VALUES (@key, @label_fr, @label_en, @sort_order)`);
  levels.forEach((l) => insertLevel.run(l));

  const insertInstructor = db.prepare(`INSERT OR IGNORE INTO instructors (name, country_fr, country_en, flag_emoji, specialty_fr, specialty_en, photo, sort_order) VALUES (@name, @country_fr, @country_en, @flag_emoji, @specialty_fr, @specialty_en, @photo, @sort_order)`);
  const existingInstructors = db.prepare(`SELECT COUNT(*) as c FROM instructors`).get();
  if (existingInstructors.c === 0) {
    instructors.forEach((i) => insertInstructor.run(i));
  }

  const existingTrainings = db.prepare(`SELECT COUNT(*) as c FROM trainings`).get();
  if (existingTrainings.c === 0) {
    const insertTraining = db.prepare(`INSERT INTO trainings (name_fr, name_en, description_fr, description_en, level_key, category_key, instructor_id, sort_order) VALUES (@name_fr, @name_en, NULL, NULL, @level_key, @category_key, NULL, @sort_order)`);
    trainings.forEach((t, idx) => insertTraining.run({ ...t, sort_order: idx + 1 }));
  }

  const existingCars = db.prepare(`SELECT COUNT(*) as c FROM cars`).get();
  if (existingCars.c === 0) {
    const insertCar = db.prepare(`
      INSERT INTO cars (slug, name, brand, model, category_key, level_key, status_key, description_fr, description_en, main_photo, sort_order)
      VALUES (@slug, @name, NULL, NULL, @category, @level, @status, @description_fr, @description_en, @main_photo, @sort_order)
    `);
    const insertPhoto = db.prepare(`INSERT INTO car_photos (car_id, url, sort_order) VALUES (?, ?, ?)`);

    carsSeed.forEach((c, idx) => {
      const info = insertCar.run({
        slug: c.slug,
        name: c.name,
        category: c.category,
        level: c.level,
        status: c.status,
        description_fr: c.description_fr,
        description_en: c.description_en,
        main_photo: c.main_photo,
        sort_order: idx + 1,
      });
      const carId = info.lastInsertRowid;
      c.photos.forEach((url, pIdx) => insertPhoto.run(carId, url, pIdx + 1));
    });
  }

  const existingAdmin = db.prepare(`SELECT COUNT(*) as c FROM admins`).get();
  if (existingAdmin.c === 0) {
    const hash = bcrypt.hashSync("ChangeMe123!", 10);
    db.prepare(`INSERT INTO admins (username, password_hash) VALUES (?, ?)`).run("admin", hash);
    console.log("Admin par défaut créé -> username: admin / mot de passe: ChangeMe123! (à changer immédiatement)");
  }

  console.log("Seed terminé.");
}

run();
