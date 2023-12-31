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
  `carboard_number` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `car`
--

LOCK TABLES `car` WRITE;
/*!40000 ALTER TABLE `car` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `car_image`
--

LOCK TABLES `car_image` WRITE;
/*!40000 ALTER TABLE `car_image` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consumption`
--

LOCK TABLES `consumption` WRITE;
/*!40000 ALTER TABLE `consumption` DISABLE KEYS */;
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
INSERT INTO `deposit_account` VALUES (1,'1',0);
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
INSERT INTO `member` VALUES (1,NULL,NULL,NULL,'test@gamil.com','test','test',NULL,'2023-12-10 09:04:22');
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
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parkinglotdata`
--

LOCK TABLES `parkinglotdata` WRITE;
/*!40000 ALTER TABLE `parkinglotdata` DISABLE KEYS */;
INSERT INTO `parkinglotdata` VALUES (1,1,'撏?憟喳?擃葉?唬?????,'?啣??銝?頝?9?2','??,'00:00','24:00','摰文',65,'2','2','121.5394146','24.9716752'),(2,1,'瘞湔像瘣?頠','??瘞湔像瘣挾4??-1??7-3??7-9?啗?(??蝺?8.5K)','??,'00:00','24:00','摰文',65,'2','2','121.8644858','25.1219428'),(3,1,'?啁?????內蝭?撣????,'銝????頝臭?畾???,'??,'00:00','24:00','摰文',65,'2','2','121.488401','25.0665205'),(4,1,'?箏?蝘飛??頠','?啣???頝臭?畾?13?1?3?4','??,'00:00','24:00','摰文',45,'2','2','121.5400813','24.9860095'),(5,1,'摰嗆?蝳????????,'????鈭楝銝畾?59?銝?璅?,'??,'00:00','24:00','摰文',45,'2','2','121.3729465','25.0799372'),(6,1,'?鞈???∩遢???砍?頝???璆剜?????,'?踵???頝??銝?撅?,'??,'00:00','24:00','摰文',45,'2','2','121.4571644','24.9986334'),(7,1,'?蟡之璅銝?頠','?踵?????梯楝20-6?2','??,'00:00','24:00','摰文',20,'2','2','121.4546073','25.0063739'),(8,1,'?祇???平??蝬?憭扳??唬?????,'?祇???芷?頝?21??,'??,'00:00','24:00','摰文',20,'2','2','121.6897473','25.1798106'),(9,1,'瘞游偏????,'?啣?撣?撅勗?瘞?頝?90??','??,'00:00','24:00','摰文',45,'2','2','121.585289','0.0002281'),(10,1,'瘝寡???B?)????,'?啣?撣楚瘞游?銝剜迤頝?畾?7撌瑁?瘝?頝臭漱撗(B?)','??,'00:00','24:00','摰文',65,'2','2','121.4203833','25.181155'),(11,1,'蝡輯?憭批?頠?頠','?啣?撣楚瘞游?蝡輯?銝銵?瘚琿?畾?39?啗?)','??,'00:00','24:00','摰文',65,'2','2','121.4490616','25.1659579'),(12,1,'?啣?撣????瑁隞賣???詨?頠','銝??銝剜迤?楝111??,'??,'00:00','24:00','摰文',20,'2','2','121.4870005','25.0645479'),(13,1,'暾駁?撖嗅銝鞎餃?頠','?啣?撣??瘞?頝?88撌??3','??,'00:00','24:00','摰文',20,'2','2','121.425127','25.023231'),(14,1,'瘙?乩???B1F)????,'?啣?撣摨?瘞?頝?13?1','??,'00:00','24:00','摰文',45,'2','2','121.5364359','24.9825333'),(15,1,'皝臬?銝?????,'?啣?撣????頝?畾?09撌瑕?銝剛???鈭文???,'??,'00:00','24:00','摰文',65,'2','2','121.469287','25.0460341'),(16,1,'蝧亳A+????,'?啣?撣?????頝?00?1?2','??,'00:00','24:00','摰文',45,'2','2','121.4877373','25.0513509'),(17,1,'?暹?憭扳? MEGA TOWER ????,'?啣?撣璈??啁?頝?8?2~B4??~9F','??,'00:00','24:00','摰文',20,'2','2','121.4667685','25.0134911'),(18,1,'憌?21蝘???????,'?啣?撣葉??銝剖控頝?畾?06??,'??,'00:00','24:00','摰文',65,'2','2','121.4766412','25.0062191'),(19,1,'?啣?撣楚瘞游?撣??臬???銝剖??唬?????,'?啣?撣楚瘞游?銝剖控?楝2畾?75??,'??,'00:00','24:00','摰文',65,'2','2','121.4434184','25.1868657'),(20,1,'?踵邦????,'璅寞??瘞湔?銵??踵??皞芸?頝?,'??,'00:00','24:00','摰文',20,'2','2','121.4276729','24.9809976'),(21,1,'靘踹???湧??勗銝?璅?????,'?啣?撣?甇Ｗ??啣鈭楝銝畾?5-81?2','??,'00:00','24:00','摰文',20,'2','2','121.64547','25.061804'),(22,1,'??瘥?頠','?啣?撣楚瘞游??頝?84撌?0?1','??,'00:00','24:00','摰文',20,'2','2','121.4512649','25.1775521'),(23,1,'憯賢噸????,'?啣?撣葉???像頝?00撌???,'??,'00:00','24:00','摰文',65,'2','2','121.4659479','24.99374'),(24,1,'瘙蝳桀?頠','?啣?撣摨?鈭?撘菔楝119???Ｙ征??,'??,'00:00','24:00','摰文',65,'2','2','121.5358784','24.9796012'),(25,1,'撖嗅?????,'?啣??撖嗅?銵?6??,'??,'00:00','24:00','摰文',65,'2','2','121.5421539','24.9842957'),(26,1,'蝣抒撜啁?????,'?啣?撣??蝳?銵?6??,'??,'00:00','24:00','摰文',20,'2','2','121.4604028','25.0535959'),(27,1,'瘛⊥偌?葉????,'瘛⊥偌???銵?0??,'??,'00:00','24:00','摰文',65,'2','2','121.4365588','25.1747208'),(28,1,'瘛⊥偌擐砍?蝝敹菟?ａ?閮剜鞎餃?頠','瘛⊥偌?瘞?頝?7??擐砍?璅2?3???之璅?','??,'00:00','24:00','摰文',65,'2','2','121.4619504','25.1390057'),(29,1,'?啣?撣???祆?銵憭扳??唬?2璅?閮剜鞎餃?頠','?啣?撣??銝剜迤頝?76?2','??,'00:00','24:00','摰文',20,'2','2','121.450118','25.036185'),(30,1,'憟賢?憭??????,'?啣?撣??撱箏?銝頝?38??,'??,'00:00','24:00','摰文',20,'2','2','121.434669','25.0274737'),(31,1,'敺瑕?????,'?啣??摰熒頝臭?畾?00-2??,'??,'00:00','24:00','摰文',65,'2','2','121.5042386','24.9581298'),(32,1,'摰嗥??∩遢???砍???詨?頠','銝???頝臭?畾?54??,'??,'00:00','24:00','摰文',45,'2','2','121.4671946','25.0430975'),(33,1,'?啁?鞈潛銝剖??A9????,'?啣?撣??????銝楝1畾??2?3','??,'00:00','24:00','摰文',65,'2','2','121.3615881','25.0661296'),(34,1,'?踵????寧撣蝚砌?????,'?啣?撣璈??踹?頝?000????,'??,'00:00','24:00','摰文',45,'2','2','121.44925','25.018864'),(35,1,'鈭???嗉祥????,'?啣?撣??蝳?銵?28撌?0?1?2','??,'00:00','24:00','摰文',45,'2','2','121.4622464','25.0578695'),(36,1,'?僑蝷暹?雿?銝?1擗典?頠','?啣?撣????唳眾?楝125?2~B3','??,'00:00','24:00','摰文',20,'2','2','121.4965374','25.0553754'),(37,1,'?僑蝷暹?雿?銝?2擗典?頠','?啣?撣???憭批??楝172撌?8??0?1~B3','??,'00:00','24:00','摰文',45,'2','2','121.4980413','25.0576816'),(38,1,'銝剛?????,'?啣?撣摨?銝剛?頝臭?畾?31??,'??,'00:00','24:00','摰文',45,'2','2','121.5446175','24.9791451'),(39,1,'?桀誨????,'?啣?撣璈?瘞?頝?畾?23?椰??7?砍偕??,'??,'00:00','24:00','摰文',45,'2','2','121.462891','25.0320831'),(40,1,'鈭?恍????,'?啣?撣璈?擃撖楝300??F~3F?2-B4','??,'00:00','24:00','摰文',65,'2','2','121.4532986','24.9999002'),(41,1,'摰?????,'?啣?撣像皞芸???銵?4??,'??,'00:00','24:00','摰文',45,'2','2','121.722503','25.023209'),(42,1,'Times 銝??琿?頝臬?頠','?啣?撣????琿?頝?2撌?2-1??','??,'00:00','24:00','摰文',45,'2','2','121.4845932','25.0542773'),(43,1,'曌予擗ㄡ摨?頠','?啣?撣??銝剖?頝?9??撠','??,'00:00','24:00','摰文',65,'2','2','121.4579322','25.0549939'),(44,1,'銝剖亢頝臬?瘝寧??嗉祥????,'?啣?撣???銝剖亢頝?畾?3?1','??,'00:00','24:00','摰文',45,'2','2','121.4382781','24.9680529'),(45,1,'銝剛?????,'?啣?撣??銝剖像頝?98撌?1????,'??,'00:00','24:00','摰文',20,'2','2','121.4465993','25.0485281'),(46,1,'?啣蝳?頠','銝剖???血?頝?88??F?1','??,'00:00','24:00','摰文',20,'2','2','121.4905316','24.9903837'),(47,1,'?啁?舫???頠','?啣?撣??蝳ˊ銵?11銋? ??蝛箏','??,'00:00','24:00','摰文',45,'2','2','121.4576377','25.051212'),(48,1,'瘞訾蝨????,'?啣?撣????縑鈭???靽∩?銵?76撌瑕?征??,'??,'00:00','24:00','摰文',65,'2','2','121.4954568','25.0787256'),(49,1,'蝬?尹????,'?啣?撣摨?摰孕頝?5?1','??,'00:00','24:00','摰文',65,'2','2','121.4844487','24.9624027'),(50,1,'??????,'?啣?撣葉???∪控頝?89?1','??,'00:00','24:00','摰文',45,'2','2','121.4783481','25.0094999'),(51,1,'摨?撱??唬?????,'?曉ˊ頝??銝?,'??,'00:00','24:00','摰文',45,'2','2','121.5629973','25.0360887'),(52,1,'?曉ˊ撱??唬?????,'?暹頝?5?銝?,'??,'00:00','24:00','摰文',20,'2','2','121.5662804','25.0371467'),(53,1,'?箏?撣摰單?霈葉敹銝?頠','?頝?91撌?1撘??銝?,'??,'00:00','24:00','摰文',65,'2','2','121.566226','25.0288063'),(54,1,'?孕?砍??唬?????,'?暸?頝?23撌??銝?,'??,'00:00','24:00','摰文',45,'2','2','121.5718707','25.0474442'),(55,1,'蝡噙?砍??唬?????,'?踹噸頝?畾?72?銝?,'??,'00:00','24:00','摰文',45,'2','2','121.5035695','25.1184302'),(56,1,'?琿?憟痔蝡?銋?頠','?啣?撣?,'??,'00:00','24:00','摰文',65,'2','2','121.50111','25.126453'),(57,1,'?祈?葉?唬?????,'镼輯?頝?01?銝?,'??,'00:00','24:00','摰文',20,'2','2','121.499207','25.0289927'),(58,1,'?琿???????,'?啣?撣葉撅勗???頝?98??璅1-B2','??,'00:00','24:00','摰文',20,'2','2','121.5557109','25.0851349'),(59,1,'?振???弦??????,'?葛??弦?Ｚ楝1畾?30撌?9?銝?-2撅?,'??,'00:00','24:00','摰文',65,'2','2','121.6126097','25.0491338'),(60,1,'?啁?舫之銝?????,'?頝?1?2~B4','??,'00:00','24:00','摰文',20,'2','2','121.5051465','25.0431052'),(61,1,'???踵??????,'靽∠儔??梯?頝?5?銝?-4撅?,'??,'00:00','24:00','摰文',20,'2','2','121.5666161','25.0470411'),(62,1,'???輻???蝡?頠','靽∠儔??粹?頝?畾?06?銝???撅?,'??,'00:00','24:00','摰文',65,'2','2','121.5632906','25.0398471'),(63,1,'?血?????,'??畾萄撠挾175??76??77??79??79-1??79-2??79-3??79-4??79-5?啗?','??,'00:00','24:00','摰文',45,'2','2','121.5491813','25.027344'),(64,1,'???葉?唬?????,'?曉噸頝?00撌?8?銝?,'??,'00:00','24:00','摰文',20,'2','2','121.57281','25.0349059'),(65,1,'撜函?蝡?????,'撜函?銵?3??,'??,'00:00','24:00','摰文',20,'2','2','121.5053854','25.0440366'),(66,1,'銝剖控?銝?頠','撱嗅像?楝98?銝?,'??,'00:00','24:00','摰文',65,'2','2','121.5104581','25.0440122'),(67,1,'撗單??血?????,'?血??楝2畾?01??蝛箏','??,'00:00','24:00','摰文',65,'2','2','121.5494143','25.0274934'),(68,1,'瘣蝡?????,'?唳眾?楝1畾???,'??,'00:00','24:00','摰文',45,'2','2','121.5058742','25.048244'),(69,1,'憛??砍??唬?????,'憛?銵?1?銝?,'??,'00:00','24:00','摰文',20,'2','2','121.51098','25.0508192'),(70,1,'?暸翩擃葉?唬?????,'?踹噸頝?畾?75?銝?,'??,'00:00','24:00','摰文',65,'2','2','121.5239985','25.0861507'),(71,1,'?葛?砍??唬?????,'?葛銵?5?銝?,'??,'00:00','24:00','摰文',45,'2','2','121.5202887','25.0853723'),(72,1,'鈭???銝?頠','銝剖?楝57?銝?,'??,'00:00','24:00','摰文',45,'2','2','121.5804418','25.0466272'),(73,1,'瘞??砍??唬?????,'瘞??梯楝4畾?80?銝?,'??,'00:00','24:00','摰文',45,'2','2','121.5579744','25.0616122'),(74,1,'??砍??唬?????,'?銵?90?銝?,'??,'00:00','24:00','摰文',65,'2','2','121.531649','25.0295256'),(75,1,'?支滬?葉?唬?????,'銝剛頝?畾?06撌??銝?,'??,'00:00','24:00','摰文',45,'2','2','121.5105559','25.0244215'),(76,1,'璁桀?蝘??刻憭批??葦摨?頠','?像?梯楝2畾?11撌?9?銝?撅?,'??,'00:00','24:00','摰文',65,'2','2','121.5453193','25.0255132'),(77,1,'?航?砍??唬?????,'?航銵?5?銝?,'??,'00:00','24:00','摰文',65,'2','2','121.5437866','24.9952616'),(78,1,'?曉控擃葉?唬?????,'?粹?頝?畾?56?銝?,'??,'00:00','24:00','摰文',45,'2','2','121.5640748','25.0440766'),(79,1,'?望????唬?????,'?望?頝?15??1?唬?','??,'00:00','24:00','摰文',45,'2','2','121.6156987','25.0685463'),(80,1,'憭抒酉??銝?頠','甇貊?銵?43?銝?,'??,'00:00','24:00','摰文',65,'2','2','121.5104682','25.0583928'),(81,1,'?葉?砍??唬?????,'敺抵??楝1畾?40撌?1?銝?,'??,'00:00','24:00','摰文',20,'2','2','121.5422916','25.0362914'),(82,1,'镼踵擃葉?唬?????,'?亙熒頝?25撌?9撘??銝?,'??,'00:00','24:00','摰文',65,'2','2','121.5658822','25.0558122'),(83,1,'?脣??砍??唬?????,'?怠噸頝?畾?58?銝?,'??,'00:00','24:00','摰文',45,'2','2','121.5377054','25.0461126'),(84,1,'颲漸???唬?????,'颲漸頝?畾?03?銝?,'??,'00:00','24:00','摰文',45,'2','2','121.5586242','25.0062748'),(85,1,'?殿擃葉?唬?????,'?踹噸頝?畾?35??1?唬?','??,'00:00','24:00','摰文',20,'2','2','121.5198081','25.0609065'),(86,1,'憭扯??砍??唬?????,'憭扯?銵?45?銝?,'??,'00:00','24:00','摰文',65,'2','2','121.5039362','25.1311284'),(87,1,'憭批?擃極?唬?????,'靽∠儔頝?畾?66撌?撘?2?銝?,'??,'00:00','24:00','摰文',45,'2','2','121.5418549','25.0326351'),(88,1,'?噸蝡?????,'??頝???,'??,'00:00','24:00','摰文',20,'2','2','121.5860499','25.0458864'),(89,1,'蝷曉?蝡?????,'撱嗅像?楝6畾?80??,'??,'00:00','24:00','摰文',20,'2','2','121.5059533','25.0895814'),(90,1,'?亙熒???唬?????,'撱嗅ˊ銵?68?銝?,'??,'00:00','24:00','摰文',45,'2','2','121.5623547','25.056538'),(91,1,'敹縑?砍??唬?????,'?曆?頝??銝?,'??,'00:00','24:00','摰文',65,'2','2','121.5677832','25.0404193'),(92,1,'撱箸??葉?唬?????,'?瑕?镼輯楝37??銝?唬?','??,'00:00','24:00','摰文',20,'2','2','121.5198757','25.0514889'),(93,1,'?葉蝡?????,'?葉頝?4撌???,'??,'00:00','24:00','摰文',20,'2','2','121.6065022','25.0561045'),(94,1,'?僑?砍?擃憭怎??游銝?頠','??頝??銝?,'??,'00:00','24:00','摰文',45,'2','2','121.5077827','25.023779'),(95,1,'?怠噸頝臬?頠','?箏?撣葉撅勗??怠噸頝臭?畾?03?1?4??,'??,'00:00','24:00','摰文',20,'2','2','121.5397728','25.0468771'),(96,1,'????唬?????,'?啣?頝?畾?8??,'??,'00:00','24:00','摰文',45,'2','2','121.5787728','24.9973635'),(97,1,'瘙撌?????,'銝剜迤?蝳?畾萎?撠挾267-3??91-4?啗?嚗?撌楝3畾?6??蝛箏','??,'00:00','24:00','摰文',45,'2','2','121.5306609','25.0158678'),(98,1,'靽∠儔撱??唬?????,'靽∠儔頝?畾?1?銝?,'??,'00:00','24:00','摰文',45,'2','2','121.5658116','25.0331461'),(99,1,'憭扳平蝡?????,'憭扳平頝?45??,'??,'00:00','24:00','摰文',20,'2','2','121.5028906','25.1376778'),(100,1,'?啣?101????,'?啣?撣縑蝢拙?撣?頝?5?2~B4','??,'00:00','24:00','摰文',45,'2','2','121.5637307','25.0337348');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parkinglotimage`
--

LOCK TABLES `parkinglotimage` WRITE;
/*!40000 ALTER TABLE `parkinglotimage` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=204 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parkinglotsquare`
--

LOCK TABLES `parkinglotsquare` WRITE;
/*!40000 ALTER TABLE `parkinglotsquare` DISABLE KEYS */;
INSERT INTO `parkinglotsquare` VALUES (1,1,'1',NULL),(2,1,'2',NULL),(3,1,'3',NULL),(4,2,'1',NULL),(5,2,'2',NULL),(6,2,'3',NULL),(7,3,'1',NULL),(8,3,'2',NULL),(9,3,'3',NULL),(10,4,'1',NULL),(11,5,'1',NULL),(12,5,'2',NULL),(13,5,'3',NULL),(14,6,'1',NULL),(15,7,'1',NULL),(16,8,'1',NULL),(17,8,'2',NULL),(18,9,'1',NULL),(19,9,'2',NULL),(20,10,'1',NULL),(21,10,'2',NULL),(22,11,'1',NULL),(23,12,'1',NULL),(24,13,'1',NULL),(25,14,'1',NULL),(26,15,'1',NULL),(27,16,'1',NULL),(28,16,'2',NULL),(29,16,'3',NULL),(30,17,'1',NULL),(31,17,'2',NULL),(32,17,'3',NULL),(33,18,'1',NULL),(34,19,'1',NULL),(35,19,'2',NULL),(36,20,'1',NULL),(37,21,'1',NULL),(38,21,'2',NULL),(39,21,'3',NULL),(40,22,'1',NULL),(41,23,'1',NULL),(42,24,'1',NULL),(43,25,'1',NULL),(44,26,'1',NULL),(45,27,'1',NULL),(46,27,'2',NULL),(47,27,'3',NULL),(48,28,'1',NULL),(49,28,'2',NULL),(50,28,'3',NULL),(51,29,'1',NULL),(52,29,'2',NULL),(53,29,'3',NULL),(54,30,'1',NULL),(55,31,'1',NULL),(56,31,'2',NULL),(57,31,'3',NULL),(58,32,'1',NULL),(59,32,'2',NULL),(60,33,'1',NULL),(61,33,'2',NULL),(62,33,'3',NULL),(63,34,'1',NULL),(64,34,'2',NULL),(65,34,'3',NULL),(66,35,'1',NULL),(67,35,'2',NULL),(68,35,'3',NULL),(69,36,'1',NULL),(70,37,'1',NULL),(71,37,'2',NULL),(72,37,'3',NULL),(73,38,'1',NULL),(74,38,'2',NULL),(75,38,'3',NULL),(76,39,'1',NULL),(77,40,'1',NULL),(78,41,'1',NULL),(79,42,'1',NULL),(80,42,'2',NULL),(81,43,'1',NULL),(82,44,'1',NULL),(83,44,'2',NULL),(84,45,'1',NULL),(85,45,'2',NULL),(86,45,'3',NULL),(87,46,'1',NULL),(88,47,'1',NULL),(89,48,'1',NULL),(90,49,'1',NULL),(91,49,'2',NULL),(92,50,'1',NULL),(93,50,'2',NULL),(94,50,'3',NULL),(95,51,'1',NULL),(96,52,'1',NULL),(97,52,'2',NULL),(98,52,'3',NULL),(99,53,'1',NULL),(100,53,'2',NULL),(101,54,'1',NULL),(102,54,'2',NULL),(103,54,'3',NULL),(104,55,'1',NULL),(105,55,'2',NULL),(106,55,'3',NULL),(107,56,'1',NULL),(108,56,'2',NULL),(109,57,'1',NULL),(110,57,'2',NULL),(111,57,'3',NULL),(112,58,'1',NULL),(113,58,'2',NULL),(114,58,'3',NULL),(115,59,'1',NULL),(116,59,'2',NULL),(117,59,'3',NULL),(118,60,'1',NULL),(119,60,'2',NULL),(120,60,'3',NULL),(121,61,'1',NULL),(122,61,'2',NULL),(123,62,'1',NULL),(124,62,'2',NULL),(125,63,'1',NULL),(126,64,'1',NULL),(127,64,'2',NULL),(128,64,'3',NULL),(129,65,'1',NULL),(130,66,'1',NULL),(131,67,'1',NULL),(132,67,'2',NULL),(133,68,'1',NULL),(134,68,'2',NULL),(135,68,'3',NULL),(136,69,'1',NULL),(137,70,'1',NULL),(138,70,'2',NULL),(139,70,'3',NULL),(140,71,'1',NULL),(141,71,'2',NULL),(142,71,'3',NULL),(143,72,'1',NULL),(144,72,'2',NULL),(145,73,'1',NULL),(146,73,'2',NULL),(147,73,'3',NULL),(148,74,'1',NULL),(149,74,'2',NULL),(150,75,'1',NULL),(151,76,'1',NULL),(152,76,'2',NULL),(153,77,'1',NULL),(154,78,'1',NULL),(155,78,'2',NULL),(156,78,'3',NULL),(157,79,'1',NULL),(158,80,'1',NULL),(159,80,'2',NULL),(160,81,'1',NULL),(161,81,'2',NULL),(162,81,'3',NULL),(163,82,'1',NULL),(164,82,'2',NULL),(165,82,'3',NULL),(166,83,'1',NULL),(167,83,'2',NULL),(168,84,'1',NULL),(169,84,'2',NULL),(170,85,'1',NULL),(171,85,'2',NULL),(172,86,'1',NULL),(173,86,'2',NULL),(174,87,'1',NULL),(175,87,'2',NULL),(176,88,'1',NULL),(177,89,'1',NULL),(178,89,'2',NULL),(179,89,'3',NULL),(180,90,'1',NULL),(181,90,'2',NULL),(182,91,'1',NULL),(183,91,'2',NULL),(184,91,'3',NULL),(185,92,'1',NULL),(186,92,'2',NULL),(187,92,'3',NULL),(188,93,'1',NULL),(189,94,'1',NULL),(190,94,'2',NULL),(191,95,'1',NULL),(192,95,'2',NULL),(193,96,'1',NULL),(194,96,'2',NULL),(195,96,'3',NULL),(196,97,'1',NULL),(197,98,'1',NULL),(198,98,'2',NULL),(199,98,'3',NULL),(200,99,'1',NULL),(201,100,'1',NULL),(202,100,'2',NULL),(203,100,'3',NULL);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parkingsquareimage`
--

LOCK TABLES `parkingsquareimage` WRITE;
/*!40000 ALTER TABLE `parkingsquareimage` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
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

-- Dump completed on 2023-12-10  9:24:59
