-- MySQL dump 10.13  Distrib 8.1.0, for Win64 (x86_64)
--
-- Host: localhost    Database: parkingabc
-- ------------------------------------------------------
-- Server version	8.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `car`
--

DROP TABLE IF EXISTS `car`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `car` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `member_id` varchar(255) NOT NULL,
  `carboard_unmber` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `car`
--

LOCK TABLES `car` WRITE;
/*!40000 ALTER TABLE `car` DISABLE KEYS */;
INSERT INTO `car` VALUES (1,'1','231231231231');
/*!40000 ALTER TABLE `car` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `car_image`
--

DROP TABLE IF EXISTS `car_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `car_image` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `car_id` varchar(255) NOT NULL,
  `car_image` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `car_image`
--

LOCK TABLES `car_image` WRITE;
/*!40000 ALTER TABLE `car_image` DISABLE KEYS */;
INSERT INTO `car_image` VALUES (1,'1','https://d1hxt3hn1q2xo2.cloudfront.net/1701264536-images.jfif');
/*!40000 ALTER TABLE `car_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consumption`
--

DROP TABLE IF EXISTS `consumption`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consumption` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL DEFAULT (curdate()),
  `member_id` bigint DEFAULT NULL,
  `order_number` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `parkinglotdata_id` bigint DEFAULT NULL,
  `parkinglotname` varchar(255) DEFAULT NULL,
  `parkinglotsquare` bigint DEFAULT NULL,
  `square_number` varchar(255) DEFAULT NULL,
  `car_board` varchar(255) DEFAULT NULL,
  `price` varchar(255) NOT NULL,
  `starttime` varchar(255) DEFAULT NULL,
  `stoptime` varchar(255) DEFAULT NULL,
  `payment` bigint DEFAULT NULL,
  `income` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consumption`
--

LOCK TABLES `consumption` WRITE;
/*!40000 ALTER TABLE `consumption` DISABLE KEYS */;
INSERT INTO `consumption` VALUES (1,'2023-11-29',1,'20231129134206034270','新北市泰山區福興3街186號樓',1,'123停車場',NULL,'1','231231231231','25','2023-11-29 21:42:06','2023-11-29 21:42:13',0,0),(2,'2023-11-29',1,'20231129134609519352','新北市泰山區福興3街186號樓',1,'123停車場',NULL,'2','231231231231','25','2023-11-29 21:46:07','2023-11-29 21:47:01',25,22),(3,'2023-11-29',1,'20231129134743234218','新北市泰山區福興3街186號樓',1,'123停車場',NULL,'2','231231231231','25','2023-11-29 21:47:43','2023-11-29 21:49:00',25,22),(4,'2023-11-30',1,'20231130051858032076','新北市泰山區福興3街186號樓',1,'123停車場',NULL,'1','231231231231','25','2023-11-30 13:18:58','2023-11-30 13:19:21',0,0),(5,'2023-11-30',1,'20231130054345845248','新北市泰山區福興3街186號樓',1,'123停車場',NULL,'1','231231231231','25','2023-11-30 13:43:45','2023-11-30 13:46:26',25,22),(6,'2023-11-30',1,'20231130055028093501','新北市泰山區福興3街186號樓',1,'123停車場',NULL,'1','231231231231','25','2023-11-30 13:50:28','2023-11-30 13:50:30',0,0),(7,'2023-11-30',1,'20231130055335710207','新北市泰山區福興3街186號樓',1,'123停車場',NULL,'1','231231231231','25','2023-11-30 13:53:35','2023-11-30 13:53:43',0,0),(8,'2023-11-30',1,'20231130055403598237','新北市泰山區福興3街186號樓',1,'123停車場',NULL,'1','231231231231','25','2023-11-30 13:54:03','2023-11-30 13:54:09',0,0),(9,'2023-11-30',1,'20231130055453746881','新北市泰山區福興3街186號樓',1,'123停車場',NULL,'1','231231231231','25','2023-11-30 13:54:53','2023-11-30 13:54:55',0,0),(10,'2023-11-30',1,'20231130055644796780','新北市泰山區福興3街186號樓',1,'123停車場',NULL,'2','231231231231','25','2023-11-30 13:56:44','2023-11-30 13:57:45',25,22),(11,'2023-11-30',1,'20231130060230265263','新北市泰山區福興3街186號樓',1,'123停車場',NULL,'1','231231231231','25','2023-11-30 14:02:30','2023-11-30 14:03:08',25,22),(12,'2023-11-30',1,'20231130060327243256','新北市泰山區福興3街186號樓',1,'123停車場',NULL,'1','231231231231','25','2023-11-30 14:03:27','2023-11-30 14:12:38',25,22),(13,'2023-11-30',1,'20231130061252824058','新北市泰山區福興3街186號樓',1,'123停車場',NULL,'1','231231231231','25','2023-11-30 14:12:52','2023-11-30 14:13:11',0,0),(14,'2023-11-30',1,'20231130061552308997','新北市泰山區福興3街186號樓',1,'123停車場',NULL,'1','231231231231','25','2023-11-30 14:15:52','2023-11-30 14:22:43',25,22),(15,'2023-11-30',1,'20231130062305057438','新北市泰山區福興3街186號樓',1,'123停車場',NULL,'1','231231231231','25','2023-11-30 14:23:05','2023-11-30 14:24:48',25,22),(16,'2023-11-30',1,'20231130063415340837','新北市泰山區福興3街186號樓',1,'123停車場',NULL,'1','231231231231','25','2023-11-30 14:34:15','2023-11-30 14:34:20',0,0),(17,'2023-11-30',1,'20231130063435214943','新北市泰山區福興3街186號樓',1,'123停車場',NULL,'1','231231231231','25','2023-11-30 14:34:35','2023-11-30 14:34:40',0,0);
/*!40000 ALTER TABLE `consumption` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deposit_account`
--

DROP TABLE IF EXISTS `deposit_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deposit_account` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `member_id` varchar(255) NOT NULL,
  `Balance` bigint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deposit_account`
--

LOCK TABLES `deposit_account` WRITE;
/*!40000 ALTER TABLE `deposit_account` DISABLE KEYS */;
INSERT INTO `deposit_account` VALUES (1,'1',175);
/*!40000 ALTER TABLE `deposit_account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `birthday` varchar(255) DEFAULT NULL,
  `cellphone` text,
  `email` text NOT NULL,
  `account` text NOT NULL,
  `password` text NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `RegistrationDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (1,NULL,NULL,NULL,'qwe','qwe','qwe',NULL,'2023-11-29 19:14:40');
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parkinglotdata`
--

DROP TABLE IF EXISTS `parkinglotdata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parkinglotdata` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `member_id` bigint DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `landmark` text NOT NULL,
  `openingTime` text NOT NULL,
  `closingTime` text NOT NULL,
  `spaceInOut` text NOT NULL,
  `price` bigint DEFAULT NULL,
  `widthLimit` varchar(255) NOT NULL,
  `heightLimit` varchar(255) NOT NULL,
  `lng` varchar(255) DEFAULT NULL,
  `lat` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parkinglotdata`
--

LOCK TABLES `parkinglotdata` WRITE;
/*!40000 ALTER TABLE `parkinglotdata` DISABLE KEYS */;
INSERT INTO `parkinglotdata` VALUES (1,1,'123停車場','新北市泰山區福興3街186號樓','靠近全聯','07:15','19:15','室內',25,'2','2','121.4319576','25.0567539');
/*!40000 ALTER TABLE `parkinglotdata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parkinglotimage`
--

DROP TABLE IF EXISTS `parkinglotimage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parkinglotimage` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `parkinglotdata_id` bigint DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parkinglotimage`
--

LOCK TABLES `parkinglotimage` WRITE;
/*!40000 ALTER TABLE `parkinglotimage` DISABLE KEYS */;
INSERT INTO `parkinglotimage` VALUES (1,1,'https://d1hxt3hn1q2xo2.cloudfront.net/1701256538-20210325-121559_U7321_M680292_0f7b.jpg');
/*!40000 ALTER TABLE `parkinglotimage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parkinglotsquare`
--

DROP TABLE IF EXISTS `parkinglotsquare`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parkinglotsquare` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `parkinglotdata_id` bigint DEFAULT NULL,
  `square_number` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parkinglotsquare`
--

LOCK TABLES `parkinglotsquare` WRITE;
/*!40000 ALTER TABLE `parkinglotsquare` DISABLE KEYS */;
INSERT INTO `parkinglotsquare` VALUES (1,1,'1',NULL),(2,1,'2',NULL);
/*!40000 ALTER TABLE `parkinglotsquare` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parkingsquareimage`
--

DROP TABLE IF EXISTS `parkingsquareimage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parkingsquareimage` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `parkinglotsquare_id` bigint DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parkingsquareimage`
--

LOCK TABLES `parkingsquareimage` WRITE;
/*!40000 ALTER TABLE `parkingsquareimage` DISABLE KEYS */;
INSERT INTO `parkingsquareimage` VALUES (1,1,'https://d1hxt3hn1q2xo2.cloudfront.net/1701256540-noimage.png'),(2,2,'https://d1hxt3hn1q2xo2.cloudfront.net/1701256540-noimage.png');
/*!40000 ALTER TABLE `parkingsquareimage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_number` varchar(255) NOT NULL,
  `deposit_account_id` int NOT NULL,
  `Type` enum('DEPOSIT','WITHDRAWAL') NOT NULL,
  `Amount` bigint NOT NULL,
  `status` varchar(255) NOT NULL,
  `transactions_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,'20231129124416849802',1,'DEPOSIT',100,'已繳款','2023-11-29 20:44:16'),(2,'20231129124655002485',1,'DEPOSIT',100,'已繳款','2023-11-29 20:46:55'),(3,'20231129125336750523',1,'DEPOSIT',100,'已繳款','2023-11-29 20:53:36'),(4,'20231129125746112837',1,'DEPOSIT',100,'已繳款','2023-11-29 20:57:46'),(5,'20231129134206034270',1,'WITHDRAWAL',0,'已繳款','2023-11-29 21:42:13'),(6,'20231129134609519352',1,'WITHDRAWAL',25,'已繳款','2023-11-29 21:47:02'),(7,'20231129134743234218',1,'WITHDRAWAL',25,'已繳款','2023-11-29 21:49:00'),(8,'20231130051858032076',1,'WITHDRAWAL',0,'已繳款','2023-11-30 13:19:21'),(9,'20231130054345845248',1,'WITHDRAWAL',0,'已繳款','2023-11-30 13:43:48'),(10,'20231130054345845248',1,'WITHDRAWAL',25,'已繳款','2023-11-30 13:46:23'),(11,'20231130054345845248',1,'WITHDRAWAL',25,'已繳款','2023-11-30 13:46:26'),(12,'20231130055028093501',1,'WITHDRAWAL',0,'已繳款','2023-11-30 13:50:30'),(13,'20231130055335710207',1,'WITHDRAWAL',0,'已繳款','2023-11-30 13:53:43'),(14,'20231130055403598237',1,'WITHDRAWAL',0,'已繳款','2023-11-30 13:54:09'),(15,'20231130055453746881',1,'WITHDRAWAL',0,'已繳款','2023-11-30 13:54:55'),(16,'20231130055644796780',1,'WITHDRAWAL',25,'已繳款','2023-11-30 13:57:45'),(17,'20231130060230265263',1,'WITHDRAWAL',25,'已繳款','2023-11-30 14:03:08'),(18,'20231130060327243256',1,'WITHDRAWAL',25,'已繳款','2023-11-30 14:12:38'),(19,'20231130061252824058',1,'WITHDRAWAL',0,'已繳款','2023-11-30 14:13:11'),(20,'20231130061552308997',1,'WITHDRAWAL',25,'已繳款','2023-11-30 14:22:43'),(21,'20231130062305057438',1,'WITHDRAWAL',25,'已繳款','2023-11-30 14:24:48'),(22,'20231130063415340837',1,'WITHDRAWAL',0,'已繳款','2023-11-30 14:34:20'),(23,'20231130063435214943',1,'WITHDRAWAL',0,'已繳款','2023-11-30 14:34:40');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-30 20:12:17
