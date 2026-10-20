-- Table des chambres (MySQL / MariaDB — cPanel)
-- Exécuter une fois dans phpMyAdmin ou mysql CLI sur DB_NAME.

CREATE TABLE IF NOT EXISTS rooms (
  uid VARCHAR(64) NOT NULL PRIMARY KEY,
  slug VARCHAR(128) NOT NULL,
  name VARCHAR(255) NULL,
  cover VARCHAR(512) NOT NULL,
  door VARCHAR(512) NULL,
  gallery JSON NOT NULL,
  price INT UNSIGNED NOT NULL DEFAULT 0,
  feature_keys JSON NOT NULL,
  listed_on_home TINYINT(1) NOT NULL DEFAULT 1,
  coming_soon TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_rooms_slug (slug),
  KEY idx_rooms_listed (listed_on_home, coming_soon, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données initiales (alignées sur lib/rooms.js — ajuster les URLs si besoin)
INSERT INTO rooms (
  uid, slug, name, cover, door, gallery, price, feature_keys,
  listed_on_home, coming_soon, sort_order
) VALUES
(
  'chambre-1', 'k-kubango', 'K. Kubango',
  '/images/rooms/K.%20Kubango/1.jpg',
  '/images/rooms/K.%20Kubango/door.png',
  '["/images/rooms/K.%20Kubango/2.jpg","/images/rooms/K.%20Kubango/3.jpg","/images/rooms/K.%20Kubango/4.jpg","/images/rooms/K.%20Kubango/5.jpg"]',
  25000,
  '["kitchenette","fridge","bathroom","bed","tv","ac","balcony"]',
  1, 0, 1
),
(
  'chambre-2', 'malange', 'Malange',
  '/images/rooms/Malange/1.png',
  '/images/rooms/Malange/door.png',
  '["/images/rooms/Malange/2.png","/images/rooms/Malange/3.png"]',
  25000,
  '["kitchenette","fridge","bathroom","bed","tv","ac","balcony"]',
  1, 0, 2
),
(
  'chambre-3', 'maquela', 'Maquela',
  '/images/rooms/Maquela/1.jpg',
  NULL,
  '["/images/rooms/Maquela/2.jpg","/images/rooms/Maquela/3.jpg"]',
  28000,
  '["kitchenette","fridge","bathroom","bed","tv","ac","balcony"]',
  1, 0, 3
),
(
  'chambre-4', 'bie', 'Bié',
  '/images/rooms/Bie/1.jpeg',
  '/images/rooms/Bie/door.jpeg',
  '["/images/rooms/Bie/2.jpeg","/images/rooms/Bie/3.jpeg"]',
  25000,
  '["kitchenette","fridge","bathroom","bed","tv","ac","balcony"]',
  1, 0, 4
),
(
  'chambre-5', 'huambo', 'Huambo',
  '/images/rooms/Huambo/1.jpeg',
  '/images/rooms/Huambo/door.jpeg',
  '["/images/rooms/Huambo/2.jpeg","/images/rooms/Huambo/3.jpeg","/images/rooms/Huambo/4.jpeg"]',
  25000,
  '["kitchenette","fridge","bathroom","bed","tv","ac","balcony"]',
  1, 0, 5
)
ON DUPLICATE KEY UPDATE
  slug = VALUES(slug),
  name = VALUES(name),
  cover = VALUES(cover),
  door = VALUES(door),
  gallery = VALUES(gallery),
  price = VALUES(price),
  feature_keys = VALUES(feature_keys),
  listed_on_home = VALUES(listed_on_home),
  coming_soon = VALUES(coming_soon),
  sort_order = VALUES(sort_order);
