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
-- Table structure for table `income`
--

DROP TABLE IF EXISTS `income`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `income` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` varchar(255) DEFAULT NULL,
  `parkinglotdata_id` bigint DEFAULT NULL,
  `parkinglotname` varchar(255) DEFAULT NULL,
  `parkinglotspace_id` bigint DEFAULT NULL,
  `parkinglotspacename` varchar(255) DEFAULT NULL,
  `starttime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `stoptime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(255) DEFAULT NULL,
  `income` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `income`
--

LOCK TABLES `income` WRITE;
/*!40000 ALTER TABLE `income` DISABLE KEYS */;
/*!40000 ALTER TABLE `income` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parkinglotdata`
--

DROP TABLE IF EXISTS `parkinglotdata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parkinglotdata` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `landmark` text NOT NULL,
  `openingTime` text NOT NULL,
  `closingTime` text NOT NULL,
  `spaceInOut` text NOT NULL,
  `price` varchar(255) NOT NULL,
  `widthLimit` varchar(255) NOT NULL,
  `heightLimit` varchar(255) NOT NULL,
  `lng` varchar(255) DEFAULT NULL,
  `lat` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parkinglotdata`
--

LOCK TABLES `parkinglotdata` WRITE;
/*!40000 ALTER TABLE `parkinglotdata` DISABLE KEYS */;
INSERT INTO `parkinglotdata` VALUES (1,'123停車場','新北市泰山區福興3街186號樓','全聯','00:00','23:59','室內','25','2','2','121.4319576','25.0567539'),(2,'456停車場','新北市泰山區福興2街','全聯','00:00','23:59','室內','60','1.5','3','121.4330764','25.0577567');
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
  `parkinglotdata` bigint DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parkinglotimage`
--

LOCK TABLES `parkinglotimage` WRITE;
/*!40000 ALTER TABLE `parkinglotimage` DISABLE KEYS */;
INSERT INTO `parkinglotimage` VALUES (1,1,'https://d1hxt3hn1q2xo2.cloudfront.net/1700158305-20210325-121559_U7321_M680292_0f7b.jpg'),(2,1,'https://d1hxt3hn1q2xo2.cloudfront.net/1700158306-download_3.jpg'),(3,1,'https://d1hxt3hn1q2xo2.cloudfront.net/1700158306-download.jpg'),(4,2,'https://d1hxt3hn1q2xo2.cloudfront.net/1700292782-download_3.jpg'),(5,2,'https://d1hxt3hn1q2xo2.cloudfront.net/1700292783-download.jpg');
/*!40000 ALTER TABLE `parkinglotimage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parkinglotspace`
--

DROP TABLE IF EXISTS `parkinglotspace`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parkinglotspace` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `parkinglotdata` bigint DEFAULT NULL,
  `number` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parkinglotspace`
--

LOCK TABLES `parkinglotspace` WRITE;
/*!40000 ALTER TABLE `parkinglotspace` DISABLE KEYS */;
INSERT INTO `parkinglotspace` VALUES (1,1,'1'),(2,2,'2');
/*!40000 ALTER TABLE `parkinglotspace` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parkingspaceimage`
--

DROP TABLE IF EXISTS `parkingspaceimage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parkingspaceimage` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `parkinglotspace` bigint DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parkingspaceimage`
--

LOCK TABLES `parkingspaceimage` WRITE;
/*!40000 ALTER TABLE `parkingspaceimage` DISABLE KEYS */;
INSERT INTO `parkingspaceimage` VALUES (1,1,'https://d1hxt3hn1q2xo2.cloudfront.net/1700158306-images.jpg'),(2,1,'https://d1hxt3hn1q2xo2.cloudfront.net/1700292783-images.jpg');
/*!40000 ALTER TABLE `parkingspaceimage` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-19 10:23:08
