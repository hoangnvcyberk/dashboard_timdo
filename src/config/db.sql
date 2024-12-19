DROP TABLE IF EXISTS `accounttypes`;
CREATE TABLE `accounttypes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `articletags`;
CREATE TABLE `articletags` (
  `articleId` bigint(20) unsigned NOT NULL,
  `tagId` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`articleId`,`tagId`),
  KEY `tagId` (`tagId`),
  CONSTRAINT `articletags_ibfk_1` FOREIGN KEY (`articleId`) REFERENCES `sharedarticles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `articletags_ibfk_2` FOREIGN KEY (`tagId`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nameCategory` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `districts`;
CREATE TABLE `districts` (
  `id` varchar(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `provinceId` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `provinceId` (`provinceId`),
  CONSTRAINT `districts_ibfk_1` FOREIGN KEY (`provinceId`) REFERENCES `provinces` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `feelevelbenefits`;
CREATE TABLE `feelevelbenefits` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `feeLevelId` int(10) unsigned DEFAULT NULL,
  `benefit` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `feeLevelId` (`feeLevelId`),
  CONSTRAINT `feelevelbenefits_ibfk_1` FOREIGN KEY (`feeLevelId`) REFERENCES `feelevels` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `feelevels`;
CREATE TABLE `feelevels` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nameFeeLevel` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nameFeeLevel` (`nameFeeLevel`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `paymenthistory`;
CREATE TABLE `paymenthistory` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `articleId` bigint(20) unsigned NOT NULL,
  `paymentReceiptImageUrl` varchar(255) DEFAULT NULL,
  `transferAccountNumber` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `articleId` (`articleId`),
  CONSTRAINT `paymenthistory_ibfk_1` FOREIGN KEY (`articleId`) REFERENCES `sharedarticles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `provinces`;
CREATE TABLE `provinces` (
  `id` varchar(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `sharedarticles`;
CREATE TABLE `sharedarticles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `postType` enum('lost','found') DEFAULT NULL,
  `detailAddress` varchar(100) NOT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `eventDate` date NOT NULL,
  `isDelete` tinyint(1) DEFAULT 0,
  `contact` varchar(100) NOT NULL,
  `viewCount` int(10) unsigned DEFAULT 0,
  `postedBy` varchar(100) DEFAULT NULL,
  `status` enum('pending','reviewed','dismissed') DEFAULT 'pending',
  `provinceId` varchar(50) DEFAULT NULL,
  `districtId` varchar(50) DEFAULT NULL,
  `transferAccountNumber` varchar(100) DEFAULT NULL,
  `paymentReceiptImageUrl` varchar(255) DEFAULT NULL,
  `bank` varchar(100) DEFAULT NULL,
  `wardId` varchar(50) DEFAULT NULL,
  `userId` bigint(20) unsigned DEFAULT NULL,
  `categoryId` int(10) unsigned DEFAULT NULL,
  `feeLevelId` int(10) unsigned DEFAULT NULL,
  `isVIP` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deletedAt` timestamp NULL DEFAULT NULL,
  `expirationDate` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `categoryId` (`categoryId`),
  KEY `feeLevelId` (`feeLevelId`),
  CONSTRAINT `sharedarticles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT `sharedarticles_ibfk_2` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`),
  CONSTRAINT `sharedarticles_ibfk_3` FOREIGN KEY (`feeLevelId`) REFERENCES `feelevels` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=473 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `useraccounttypes`;
CREATE TABLE `useraccounttypes` (
  `user_id` bigint(20) unsigned NOT NULL,
  `account_type_id` int(10) unsigned NOT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`,`account_type_id`),
  KEY `account_type_id` (`account_type_id`),
  CONSTRAINT `useraccounttypes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `useraccounttypes_ibfk_2` FOREIGN KEY (`account_type_id`) REFERENCES `accounttypes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `status` enum('pending','active','reject') DEFAULT 'pending',
  `avatar_url` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `facebook_id` varchar(100) DEFAULT NULL,
  `google_id` varchar(100) DEFAULT NULL,
  `password_reset_token` varchar(100) DEFAULT NULL,
  `password_reset_expires_at` timestamp NULL DEFAULT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=599 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
