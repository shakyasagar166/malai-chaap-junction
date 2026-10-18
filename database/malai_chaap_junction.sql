-- ========================================================
-- Svad Malai Chaap Junction - MySQL Database Schema & Seed Data
-- Address: L-127, Sanjay Nagar, Sector - 23, Ghaziabad
-- Phones: 99-1101-3993, 89-2929-9898
-- ========================================================

CREATE DATABASE IF NOT EXISTS `malai_chaap_junction_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `malai_chaap_junction_db`;

-- 1. Restaurant Info Table
DROP TABLE IF EXISTS `restaurant_info`;
CREATE TABLE `restaurant_info` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL DEFAULT 'Svad Malai Chaap Junction',
  `tagline` VARCHAR(255) DEFAULT 'Ghaziabad\'s Premier Tandoori & Chaap Specialities - 100% Pure Veg',
  `address` VARCHAR(500) DEFAULT 'L-127, Sanjay Nagar, Sector - 23, Ghaziabad',
  `phone_primary` VARCHAR(50) DEFAULT '99-1101-3993',
  `phone_secondary` VARCHAR(50) DEFAULT '89-2929-9898',
  `whatsapp_number` VARCHAR(50) DEFAULT '919911013993',
  `opening_hours` VARCHAR(100) DEFAULT '12:00 PM - 11:30 PM (Daily)',
  `pure_veg` BOOLEAN DEFAULT TRUE,
  `gst_rate` DOUBLE DEFAULT 5.0
);

INSERT INTO `restaurant_info` (`id`, `name`, `tagline`, `address`, `phone_primary`, `phone_secondary`, `whatsapp_number`, `opening_hours`, `pure_veg`, `gst_rate`)
VALUES (1, 'Svad Malai Chaap Junction', 'Ghaziabad\'s Premier Tandoori & Chaap Specialities - 100% Pure Veg', 'L-127, Sanjay Nagar, Sector - 23, Ghaziabad', '99-1101-3993', '89-2929-9898', '919911013993', '12:00 PM - 11:30 PM (Daily)', TRUE, 5.0);

-- 2. Categories Table
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `description` VARCHAR(500),
  `icon` VARCHAR(100),
  `display_order` INT DEFAULT 0
);

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon`, `display_order`) VALUES
(1, 'VEG. TANDOORI', 'veg-tandoori', 'Smoky charcoal grilled authentic soya chaaps and veg tandoori delicacies', 'Flame', 1),
(2, 'VEG. ROLL', 'veg-roll', 'Freshly tossed tandoori chaap wrapped in flaky roomali and parathas', 'WrapText', 2),
(3, 'CHAAP GRAVY', 'chaap-gravy', 'Simmered in rich tawa, handi and Mughlai gravies', 'Soup', 3),
(4, 'VEG. DAAL', 'veg-daal', 'Slow-cooked authentic Amritsari and Makhni dal preparations', 'UtensilsCrossed', 4),
(5, 'SVAD PANEER GRAVY', 'paneer-gravy', 'Fresh cottage cheese in luscious creamy, kadhai and butter gravies', 'Sparkles', 5),
(6, 'BREADS', 'breads', 'Freshly baked tandoori rotis, garlic naans and stuffed paranthas', 'Wheat', 6),
(7, 'RICE', 'rice', 'Aromatic basmati pulao, jeera rice, fried rice and dum biryani', 'Bowl', 7),
(8, 'RAITA', 'raita', 'Chilled curd, boondi raita and cooling refreshing accompaniment', 'Milk', 8),
(9, 'NOODLES', 'noodles', 'Wok tossed Chinese noodles with crunchy garden vegetables', 'Salad', 9),
(10, 'POTATO MASTI', 'potato-masti', 'Crispy chilli potatoes, French fries and wok tossed chilli paneer', 'Cookie', 10),
(11, 'SPECIAL TIKKA', 'special-tikka', 'Tender marinated paneer and mushroom tikkas roasted in tandoor', 'Flame', 11),
(12, 'MOMOS MAGIC', 'momos-magic', 'Steamed, kurkure, tandoori and gravy momos (Half 6 pcs / Full 10 pcs)', 'Package', 12),
(13, 'KING ROLLS', 'king-rolls', 'Jumbo signature rolls loaded with tandoori paneer & crunchy veggies', 'Crown', 13);

-- 3. Customer Orders & Items
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `customer_orders`;

CREATE TABLE `customer_orders` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `order_number` VARCHAR(100) NOT NULL UNIQUE,
  `order_type` VARCHAR(50) NOT NULL,
  `table_number` INT,
  `customer_name` VARCHAR(255),
  `customer_phone` VARCHAR(50),
  `notes` TEXT,
  `subtotal` DOUBLE NOT NULL,
  `tax` DOUBLE NOT NULL,
  `total` DOUBLE NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  `payment_method` VARCHAR(50) DEFAULT 'UPI / Counter',
  `created_at` DATETIME,
  `updated_at` DATETIME
);

CREATE TABLE `order_items` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `order_id` BIGINT NOT NULL,
  `menu_item_id` BIGINT,
  `item_name` VARCHAR(255) NOT NULL,
  `portion` VARCHAR(50) NOT NULL,
  `quantity` INT NOT NULL,
  `price_per_unit` DOUBLE NOT NULL,
  `total_price` DOUBLE NOT NULL,
  `notes` VARCHAR(500),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `customer_orders` (`id`) ON DELETE CASCADE
);
