-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 28, 2026 at 04:28 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ceylon_compass`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `password_hash`, `created_at`) VALUES
(1, 'admin', '$2a$10$IXleZA0jvDkNUxvsU2Hcd.v4Vs/4TbJxpigr6njDc9iV5i1vHFB8S', '2026-09-27 17:54:43');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Beach'),
(6, 'Dining'),
(5, 'Museum'),
(3, 'Nature'),
(4, 'Recreation/Leisure'),
(2, 'Religious/Heritage');

-- --------------------------------------------------------

--
-- Table structure for table `places`
--

CREATE TABLE `places` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `category_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `short_description` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,7) NOT NULL,
  `longitude` decimal(10,7) NOT NULL,
  `opening_time` time DEFAULT NULL,
  `closing_time` time DEFAULT NULL,
  `hours_unavailable` tinyint(1) NOT NULL DEFAULT 0,
  `is_24_hours` tinyint(1) NOT NULL DEFAULT 0,
  `travel_tips` text DEFAULT NULL,
  `avg_visit_minutes` int(11) NOT NULL DEFAULT 90,
  `primary_image` varchar(255) DEFAULT NULL,
  `image_1` varchar(255) DEFAULT NULL,
  `image_2` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `places`
--

INSERT INTO `places` (`id`, `name`, `category_id`, `description`, `short_description`, `latitude`, `longitude`, `opening_time`, `closing_time`, `hours_unavailable`, `is_24_hours`, `travel_tips`, `avg_visit_minutes`, `primary_image`, `image_1`, `image_2`, `created_at`, `updated_at`) VALUES
(1, 'Panadura Beach', 1, 'A coastal stretch popular for evening walks, sunset views and casual relaxation. Less crowded than the beaches further north, it is a favourite spot for locals to unwind by the Indian Ocean.', 'A relaxed coastal stretch known for sunset views.', 6.7114985, 79.8968777, NULL, NULL, 0, 1, 'Best visited in the late afternoon for sunset. Wear sandals suitable for sand.', 60, '/uploads/primary_image-1790574362159-463413491.jpg', '/uploads/image_1-1790574362160-153773482.jpg', '/uploads/image_2-1790574362161-186601459.jpg', '2026-09-27 17:49:00', '2026-09-28 07:50:58'),
(2, 'Rankoth Viharaya (Panadura Raja Maha Viharaya)', 2, 'A historic Buddhist temple with an image house over 200 years old, decorated with traditional fresco paintings depicting the life of the Buddha.', 'A historic temple with 200-year-old fresco paintings.', 6.7116127, 79.9037985, '05:00:00', '21:00:00', 0, 0, 'Dress modestly; shoulders and knees should be covered. Remove footwear before entering.', 60, '/uploads/primary_image-1790574680334-778317658.jpg', '/uploads/image_1-1790574680334-805335482.jpg', '/uploads/image_2-1790574680336-919101582.jpg', '2026-09-27 17:49:00', '2026-09-28 07:17:00'),
(3, 'The Barnhouse', 4, 'Sri Lanka\'s first upcycled hotel, built from 90% recycled materials, featuring a restaurant, pool, chalets, and activities such as pottery and archery.', 'An eco-friendly leisure retreat built from recycled materials.', 6.7300137, 79.9393461, NULL, NULL, 0, 1, 'Booking ahead is recommended for pottery or archery sessions.', 120, '/uploads/primary_image-1790577554221-428677369.jpg', '/uploads/image_1-1790575306798-481529347.jpg', '/uploads/image_2-1790575306798-1556104.jpg', '2026-09-27 17:49:00', '2026-09-28 07:50:48'),
(4, 'Bolgoda Lake', 3, 'Sri Lanka\'s largest freshwater lake, popular for boating, kayaking, fishing and birdwatching amid scenic greenery.', 'The country\'s largest freshwater lake, great for boating and birdwatching.', 6.7717290, 79.9086657, NULL, NULL, 0, 1, 'Early morning is best for birdwatching. Boat hire is available locally.', 120, '/uploads/primary_image-1790573641254-100224640.jpg', '/uploads/image_1-1790573641292-445047956.jpg', '/uploads/image_2-1790573641297-281679765.jpg', '2026-09-27 17:49:00', '2026-09-28 07:50:38'),
(5, 'Pearl Bay', 4, 'A leisure park in Bandaragama featuring a waterpark, karting track, air rifle range, archery, and an on-site restaurant.', 'A leisure park with a waterpark and karting track.', 6.7370533, 79.9827746, '11:00:00', '18:00:00', 0, 0, 'Bring a change of clothes if visiting the waterpark.', 150, '/uploads/primary_image-1790574506722-883747091.jpg', '/uploads/image_1-1790574506725-845692525.jpg', '/uploads/image_2-1790574506728-639707637.jpg', '2026-09-27 17:49:00', '2026-09-28 07:14:42'),
(6, 'Sri Lanka Air Force Museum', 5, 'Museum of the Sri Lanka Air Force and its predecessor, the Royal Ceylon Air Force, located at SLAF Ratmalana. Houses historical aircraft and military artifacts.', 'A museum of historical aircraft and military artifacts.', 6.8238674, 79.8892075, '08:30:00', '16:30:00', 0, 0, 'Photography rules may apply inside the museum - check with staff on arrival.', 90, '/uploads/primary_image-1790575037279-653340841.jpg', '/uploads/image_1-1790575037280-177466376.jpg', '/uploads/image_2-1790575037283-393643371.jpg', '2026-09-27 17:49:00', '2026-09-28 07:20:58'),
(7, 'Kalutara Bodhiya', 2, 'An iconic hollow Buddhist stupa built around a sacred Bo sapling; one of the most visited religious landmarks on the west coast.', 'An iconic hollow stupa built around a sacred Bo sapling.', 6.5872178, 79.9569720, '04:30:00', '22:00:00', 0, 0, 'Dress modestly and remove footwear before entering the stupa.', 60, '/uploads/primary_image-1790574111843-752196019.jpg', '/uploads/image_1-1790574111845-309956733.jpg', '/uploads/image_2-1790574111848-155891378.jpg', '2026-09-27 17:49:00', '2026-09-28 07:09:07'),
(8, 'Richmond Castle', 5, 'An early-20th-century Edwardian mansion combining Eastern and Western architecture, set on a 42-acre estate near the Kalu Ganga.', 'An Edwardian mansion set on a 42-acre riverside estate.', 6.6015876, 79.9726441, '08:00:00', '16:00:00', 0, 0, 'A small entrance fee applies. Allow time to walk the surrounding grounds.', 90, '/uploads/primary_image-1790574866371-538626870.jpg', '/uploads/image_1-1790574866372-768018562.jpg', '/uploads/image_2-1790574866375-341007006.jpg', '2026-09-27 17:49:00', '2026-09-28 07:18:59'),
(9, 'Dehiwala Zoological Garden', 3, 'One of Sri Lanka\'s oldest zoos, with an aquarium, butterfly garden and museum, home to a wide variety of local and exotic wildlife.', 'One of Sri Lanka\'s oldest zoos, with an aquarium and butterfly garden.', 6.8567416, 79.8717924, '08:30:00', '18:00:00', 0, 0, 'Arrive early to avoid midday crowds and heat.', 150, '/uploads/primary_image-1790573922446-115030306.jpg', '/uploads/image_1-1790573922448-259658824.jpg', '/uploads/image_2-1790573922453-35073083.jpg', '2026-09-27 17:49:00', '2026-09-28 07:06:43'),
(10, 'Thudugala Ella', 3, 'An 8m two-tiered waterfall in Dodangoda, Kalutara District. A popular bathing spot with a natural stream pool, a tunnel beneath the falls, and birdlife in the surrounding forest.', 'A two-tiered waterfall with a natural bathing pool.', 6.5711153, 80.0563692, NULL, NULL, 0, 1, 'Wear sturdy footwear for the short forest walk to the falls.', 90, '/uploads/primary_image-1790575471512-865376788.jpg', '/uploads/image_1-1790575471513-559569874.jpg', '/uploads/image_2-1790575471522-541835170.jpg', '2026-09-27 17:49:00', '2026-09-28 07:51:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `places`
--
ALTER TABLE `places`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_places_category` (`category_id`),
  ADD KEY `idx_places_name` (`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `places`
--
ALTER TABLE `places`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `places`
--
ALTER TABLE `places`
  ADD CONSTRAINT `fk_places_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
