-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 192.168.10.2    Database: euroskills2023_module_b_solution
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `api_tokens`
--

DROP TABLE IF EXISTS `api_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `token` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `revoked_at` timestamp NULL DEFAULT NULL,
  `workspace_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_9c644dd21cac1a0e8fca9443373` (`workspace_id`),
  CONSTRAINT `FK_9c644dd21cac1a0e8fca9443373` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_tokens`
--

LOCK TABLES `api_tokens` WRITE;
/*!40000 ALTER TABLE `api_tokens` DISABLE KEYS */;
INSERT INTO `api_tokens` VALUES (1,'development','13508a659a2dbab0a825622c43aef5b5133f85502bfdeae0b6','2023-06-28 11:14:22','2023-06-28 11:14:22',NULL,1),(2,'production','8233a3e017bdf80fb90ac01974b8a57e03e4828738bbf60f91','2023-06-28 16:44:51','2023-06-28 16:44:51',NULL,1);
/*!40000 ALTER TABLE `api_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billing_quotas`
--

DROP TABLE IF EXISTS `billing_quotas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billing_quotas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `limit` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billing_quotas`
--

LOCK TABLES `billing_quotas` WRITE;
/*!40000 ALTER TABLE `billing_quotas` DISABLE KEYS */;
INSERT INTO `billing_quotas` VALUES (1,200.00,'2024-08-14 16:57:28','2024-08-14 16:57:28');
/*!40000 ALTER TABLE `billing_quotas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (16,'2019_12_14_000001_create_personal_access_tokens_table',1),(17,'2024_08_15_075839_create_service_usage_jobs_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_usage_jobs`
--

DROP TABLE IF EXISTS `service_usage_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_usage_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `status` varchar(255) DEFAULT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`content`)),
  `service_usage_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `service_usage_jobs_service_usage_id_foreign` (`service_usage_id`),
  CONSTRAINT `service_usage_jobs_service_usage_id_foreign` FOREIGN KEY (`service_usage_id`) REFERENCES `service_usages` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_usage_jobs`
--

LOCK TABLES `service_usage_jobs` WRITE;
/*!40000 ALTER TABLE `service_usage_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `service_usage_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_usages`
--

DROP TABLE IF EXISTS `service_usages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_usages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `duration_in_ms` int(11) NOT NULL,
  `api_token_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `usage_started_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_5ccd2747635edaf9f36f8bae5de` (`api_token_id`),
  KEY `FK_edbd8912f285c2a423d66020061` (`service_id`),
  CONSTRAINT `FK_5ccd2747635edaf9f36f8bae5de` FOREIGN KEY (`api_token_id`) REFERENCES `api_tokens` (`id`),
  CONSTRAINT `FK_edbd8912f285c2a423d66020061` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=217 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_usages`
--

LOCK TABLES `service_usages` WRITE;
/*!40000 ALTER TABLE `service_usages` DISABLE KEYS */;
INSERT INTO `service_usages` VALUES (1,38,2,1,'2023-07-01 10:31:48'),(2,36,2,1,'2023-07-01 23:43:17'),(3,38,2,1,'2023-07-02 10:36:12'),(4,36,2,1,'2023-07-02 23:54:02'),(5,38,2,1,'2023-07-03 06:34:24'),(6,39,2,1,'2023-07-03 17:21:00'),(7,39,2,1,'2023-07-03 22:52:59'),(8,36,2,1,'2023-07-04 12:54:21'),(9,39,2,1,'2023-07-04 16:25:28'),(10,38,2,1,'2023-07-05 07:47:05'),(11,37,2,1,'2023-07-05 08:45:33'),(12,37,2,1,'2023-07-05 21:18:46'),(13,36,2,1,'2023-07-05 23:07:11'),(14,37,2,1,'2023-07-06 08:03:32'),(15,38,2,1,'2023-07-06 19:00:55'),(16,38,2,1,'2023-07-06 22:46:37'),(17,38,2,1,'2023-07-07 12:13:47'),(18,39,2,1,'2023-07-08 01:31:04'),(19,38,2,1,'2023-07-08 08:53:46'),(20,36,2,1,'2023-07-08 17:25:26'),(21,38,2,1,'2023-07-08 18:12:54'),(22,36,2,1,'2023-07-09 00:40:36'),(23,36,2,1,'2023-07-09 01:33:45'),(24,35,2,1,'2023-07-09 02:15:18'),(25,38,2,1,'2023-07-09 10:57:03'),(26,37,2,1,'2023-07-09 20:32:25'),(27,39,2,1,'2023-07-10 11:25:13'),(28,37,2,1,'2023-07-10 19:01:00'),(29,35,2,1,'2023-07-11 06:41:27'),(30,37,2,1,'2023-07-11 16:09:11'),(31,38,2,1,'2023-07-12 00:00:39'),(32,38,2,1,'2023-07-12 04:40:13'),(33,39,2,1,'2023-07-12 14:27:25'),(34,39,2,1,'2023-07-13 03:38:15'),(35,39,2,1,'2023-07-13 04:45:52'),(36,38,2,1,'2023-07-13 10:23:03'),(37,39,2,1,'2023-07-14 01:33:35'),(38,35,2,1,'2023-07-14 13:21:23'),(39,36,2,1,'2023-07-14 22:42:34'),(40,37,2,1,'2023-07-15 03:08:06'),(41,5,2,1,'2023-07-15 04:29:00'),(42,21,2,2,'2023-06-30 22:46:04'),(43,20,2,2,'2023-07-01 17:02:15'),(44,20,2,2,'2023-07-01 23:53:57'),(45,23,2,2,'2023-07-02 03:26:37'),(46,22,2,2,'2023-07-02 15:41:25'),(47,22,2,2,'2023-07-03 01:16:59'),(48,22,2,2,'2023-07-03 18:12:08'),(49,21,2,2,'2023-07-03 19:02:06'),(50,22,2,2,'2023-07-04 00:21:34'),(51,24,2,2,'2023-07-04 07:54:53'),(52,20,2,2,'2023-07-04 14:28:14'),(53,24,2,2,'2023-07-04 14:40:11'),(54,21,2,2,'2023-07-04 20:33:10'),(55,23,2,2,'2023-07-05 06:47:03'),(56,22,2,2,'2023-07-05 08:25:03'),(57,22,2,2,'2023-07-05 20:35:58'),(58,20,2,2,'2023-07-06 05:22:29'),(59,22,2,2,'2023-07-06 15:23:32'),(60,23,2,2,'2023-07-07 02:41:43'),(61,21,2,2,'2023-07-07 21:28:06'),(62,22,2,2,'2023-07-08 07:57:25'),(63,24,2,2,'2023-07-08 11:39:33'),(64,21,2,2,'2023-07-08 15:15:40'),(65,21,2,2,'2023-07-09 11:56:12'),(66,22,2,2,'2023-07-10 02:57:01'),(67,24,2,2,'2023-07-10 03:07:02'),(68,24,2,2,'2023-07-10 19:50:49'),(69,23,2,2,'2023-07-11 14:35:38'),(70,20,2,2,'2023-07-11 16:16:30'),(71,22,2,2,'2023-07-11 19:37:35'),(72,22,2,2,'2023-07-12 04:47:41'),(73,24,2,2,'2023-07-12 19:10:36'),(74,1,2,2,'2023-07-13 02:07:44'),(75,10,1,1,'2023-07-01 12:49:36'),(76,12,1,1,'2023-07-02 04:20:00'),(77,12,1,1,'2023-07-02 19:20:36'),(78,10,1,1,'2023-07-02 20:34:48'),(79,11,1,1,'2023-07-02 22:42:10'),(80,10,1,1,'2023-07-03 04:08:20'),(81,11,1,1,'2023-07-03 12:12:21'),(82,10,1,1,'2023-07-03 18:07:24'),(83,9,1,1,'2023-07-03 18:31:09'),(84,10,1,1,'2023-07-04 10:06:29'),(85,9,1,1,'2023-07-04 20:17:28'),(86,10,1,1,'2023-07-04 21:46:47'),(87,12,1,1,'2023-07-04 23:11:00'),(88,12,1,1,'2023-07-05 11:41:06'),(89,12,1,1,'2023-07-06 03:20:54'),(90,11,1,1,'2023-07-06 06:08:26'),(91,12,1,1,'2023-07-06 23:28:25'),(92,10,1,1,'2023-07-07 08:58:39'),(93,8,1,1,'2023-07-07 11:05:19'),(94,8,1,1,'2023-07-08 01:32:52'),(95,12,1,1,'2023-07-08 10:58:52'),(96,8,1,1,'2023-07-08 12:10:00'),(97,10,1,1,'2023-07-09 02:24:20'),(98,11,1,1,'2023-07-09 12:00:18'),(99,10,1,1,'2023-07-10 05:03:09'),(100,12,1,1,'2023-07-10 18:02:58'),(101,9,1,1,'2023-07-11 05:40:12'),(102,11,1,1,'2023-07-11 06:54:20'),(103,9,1,1,'2023-07-11 09:04:47'),(104,10,1,1,'2023-07-11 12:31:53'),(105,10,1,1,'2023-07-11 20:49:51'),(106,11,1,1,'2023-07-12 06:08:02'),(107,9,1,1,'2023-07-12 18:50:56'),(108,8,1,1,'2023-07-13 10:58:42'),(109,9,1,1,'2023-07-13 16:23:09'),(110,11,1,1,'2023-07-14 03:58:02'),(111,10,1,1,'2023-07-14 20:50:28'),(112,11,1,1,'2023-07-15 12:07:17'),(113,11,1,1,'2023-07-16 03:22:49'),(114,5,1,1,'2023-07-16 18:01:16'),(115,59,2,1,'2023-08-02 04:37:43'),(116,58,2,1,'2023-08-03 07:38:46'),(117,58,2,1,'2023-08-04 04:01:52'),(118,58,2,1,'2023-08-04 19:47:44'),(119,61,2,1,'2023-08-05 15:31:08'),(120,61,2,1,'2023-08-05 18:41:15'),(121,61,2,1,'2023-08-07 06:05:30'),(122,62,2,1,'2023-08-07 14:41:37'),(123,62,2,1,'2023-08-09 00:19:23'),(124,58,2,1,'2023-08-10 11:48:53'),(125,62,2,1,'2023-08-11 02:45:15'),(126,58,2,1,'2023-08-11 06:33:24'),(127,62,2,1,'2023-08-11 21:26:58'),(128,60,2,1,'2023-08-12 14:47:42'),(129,60,2,1,'2023-08-13 04:53:03'),(130,62,2,1,'2023-08-14 15:45:21'),(131,62,2,1,'2023-08-14 22:40:03'),(132,15,2,1,'2023-08-16 09:42:20'),(133,35,2,2,'2023-08-01 15:25:25'),(134,35,2,2,'2023-08-02 08:19:34'),(135,35,2,2,'2023-08-03 03:06:20'),(136,35,2,2,'2023-08-03 22:38:11'),(137,32,2,2,'2023-08-05 07:11:48'),(138,35,2,2,'2023-08-06 08:54:57'),(139,33,2,2,'2023-08-06 09:51:05'),(140,34,2,2,'2023-08-08 05:52:41'),(141,32,2,2,'2023-08-09 03:57:04'),(142,33,2,2,'2023-08-10 10:56:36'),(143,36,2,2,'2023-08-11 15:54:06'),(144,36,2,2,'2023-08-12 19:51:08'),(145,33,2,2,'2023-08-14 00:19:40'),(146,33,2,2,'2023-08-15 12:45:57'),(147,24,2,2,'2023-08-16 08:56:30'),(148,6,1,1,'2023-08-01 23:14:43'),(149,5,1,1,'2023-08-03 00:53:32'),(150,7,1,1,'2023-08-03 16:21:29'),(151,8,1,1,'2023-08-04 17:53:18'),(152,8,1,1,'2023-08-05 09:25:30'),(153,8,1,1,'2023-08-06 05:10:20'),(154,6,1,1,'2023-08-06 14:26:15'),(155,7,1,1,'2023-08-06 15:58:22'),(156,7,1,1,'2023-08-07 07:44:31'),(157,6,1,1,'2023-08-08 06:25:03'),(158,7,1,1,'2023-08-08 23:55:19'),(159,8,1,1,'2023-08-09 17:26:31'),(160,5,1,1,'2023-08-09 19:04:41'),(161,8,1,1,'2023-08-10 01:42:46'),(162,8,1,1,'2023-08-10 08:57:31'),(163,5,1,1,'2023-08-11 03:10:14'),(164,4,1,1,'2023-08-11 12:32:56'),(165,6,1,1,'2023-08-11 16:47:10'),(166,6,1,1,'2023-08-12 07:32:43'),(167,6,1,1,'2023-08-12 18:52:12'),(168,8,1,1,'2023-08-13 06:31:00'),(169,6,1,1,'2023-08-13 23:27:34'),(170,5,1,1,'2023-08-15 02:44:24'),(171,6,1,1,'2023-08-15 05:29:27'),(172,6,1,1,'2023-08-15 16:28:44'),(173,0,1,1,'2024-08-15 09:44:06'),(174,0,1,1,'2024-08-15 10:09:26'),(175,0,1,1,'2024-08-15 10:18:27'),(176,0,1,1,'2024-08-15 10:19:04'),(177,0,1,1,'2024-08-15 10:21:44'),(178,0,1,1,'2024-08-15 10:27:19'),(179,0,1,1,'2024-08-15 10:27:47'),(180,0,1,1,'2024-08-15 10:28:13'),(181,0,1,1,'2024-08-15 10:28:37'),(182,0,1,1,'2024-08-15 10:30:33'),(183,0,1,1,'2024-08-15 10:47:33'),(184,0,1,1,'2024-08-15 10:55:35'),(185,0,1,1,'2024-08-15 10:58:05'),(186,0,1,1,'2024-08-15 10:59:32'),(187,0,1,1,'2024-08-15 11:00:53'),(188,0,1,1,'2024-08-15 11:02:47'),(189,0,1,1,'2024-08-15 11:02:49'),(190,0,1,1,'2024-08-15 11:03:26'),(191,0,1,1,'2024-08-15 11:03:35'),(192,0,1,1,'2024-08-15 11:04:26'),(193,1180,1,1,'2024-08-15 12:51:03'),(194,0,1,1,'2024-08-15 13:18:22'),(195,0,1,2,'2024-08-15 13:35:23'),(196,0,1,2,'2024-08-15 13:41:05'),(197,0,1,2,'2024-08-15 13:41:13'),(198,0,1,2,'2024-08-15 13:41:53'),(199,0,1,2,'2024-08-15 13:42:28'),(200,0,1,2,'2024-08-15 13:43:06'),(201,0,1,2,'2024-08-15 14:03:29'),(202,3634338,1,2,'2024-08-15 15:43:31'),(203,3905203,1,2,'2024-08-15 15:53:34'),(204,12592,1,2,'2024-08-15 15:56:13'),(205,12346,1,2,'2024-08-15 16:28:59'),(206,12720,1,2,'2024-08-15 16:31:46'),(207,12868,1,2,'2024-08-15 16:32:25'),(208,16,1,3,'2024-08-15 15:47:20'),(209,31,1,3,'2024-08-15 15:58:46'),(210,21,1,3,'2024-08-15 16:00:49'),(211,28,1,3,'2024-08-15 16:01:17'),(212,24,1,3,'2024-08-15 16:01:28'),(213,20,1,3,'2024-08-15 16:01:33'),(214,28,1,3,'2024-08-15 16:01:38'),(215,21,1,3,'2024-08-15 16:02:15'),(216,18,1,3,'2024-08-15 16:02:38');
/*!40000 ALTER TABLE `service_usages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `cost_per_ms` decimal(10,6) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'Service #1',0.001500,'2023-06-26 08:00:00','2023-06-26 08:00:00'),(2,'Service #2',0.005000,'2023-06-26 09:00:00','2023-06-26 09:00:00'),(3,'Service #3',0.010000,'2023-06-26 10:00:00','2023-06-26 10:00:00');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'demo1','$2b$10$9n/9JLnTKFzUPt0RAgdAPe2lOe0nceVA0s7B51r9CJCfm3FvPOT5e','2023-06-27 12:32:11','2023-06-27 12:32:11'),(2,'demo2','$2b$10$kb.9ObgBfNM9yIQgyUxY0.ZMDu4wUDEh/VozshnoVLcru7VIcQSmO','2023-06-27 12:33:11','2023-06-27 12:33:11');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workspaces`
--

DROP TABLE IF EXISTS `workspaces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workspaces` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) NOT NULL,
  `billing_quota_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_bc02d89a5cbb742925cda902c5` (`billing_quota_id`),
  UNIQUE KEY `REL_bc02d89a5cbb742925cda902c5` (`billing_quota_id`),
  KEY `FK_78512d762073bf8cb3fc88714c1` (`user_id`),
  CONSTRAINT `FK_78512d762073bf8cb3fc88714c1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK_bc02d89a5cbb742925cda902c5b` FOREIGN KEY (`billing_quota_id`) REFERENCES `billing_quotas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workspaces`
--

LOCK TABLES `workspaces` WRITE;
/*!40000 ALTER TABLE `workspaces` DISABLE KEYS */;
INSERT INTO `workspaces` VALUES (1,'My App','This is the description for My App workspace','2023-06-28 10:55:05','2023-06-28 10:55:05',1,NULL),(2,'Default Workspace','My personal workspace for smaller apps.','2023-06-28 14:06:34','2023-06-28 14:06:34',2,NULL);
/*!40000 ALTER TABLE `workspaces` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-16 17:55:03
