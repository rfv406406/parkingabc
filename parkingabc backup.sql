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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `car`
--

LOCK TABLES `car` WRITE;
/*!40000 ALTER TABLE `car` DISABLE KEYS */;
INSERT INTO `car` VALUES (2,'2','rfv'),(3,'2','dfg');
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `car_image`
--

LOCK TABLES `car_image` WRITE;
/*!40000 ALTER TABLE `car_image` DISABLE KEYS */;
INSERT INTO `car_image` VALUES (2,'2','https://d1hxt3hn1q2xo2.cloudfront.net/1702147535-0.jpg'),(3,'3','https://d1hxt3hn1q2xo2.cloudfront.net/1702166773-0.jpg');
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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consumption`
--

LOCK TABLES `consumption` WRITE;
/*!40000 ALTER TABLE `consumption` DISABLE KEYS */;
INSERT INTO `consumption` VALUES (18,'2023-12-10',2,'20231209220142214558','?啣?撣陸撅勗?蝳?3銵?86??',102,'123????,NULL,'1','rfv','55','2023-12-10 06:01:42','2023-12-10 06:02:06',0,0),(19,'2023-12-10',2,'20231209222358179394','?啣?撣??銝剖像頝?98撌?1????,46,'銝剛?????,NULL,'1','rfv','45','2023-12-10 06:23:58','2023-12-10 06:29:57',45,40);
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deposit_account`
--

LOCK TABLES `deposit_account` WRITE;
/*!40000 ALTER TABLE `deposit_account` DISABLE KEYS */;
INSERT INTO `deposit_account` VALUES (2,'2',955);
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (2,NULL,NULL,NULL,'rfv','rfv','rfv',NULL,'2023-12-10 02:45:14');
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
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parkinglotdata`
--

LOCK TABLES `parkinglotdata` WRITE;
/*!40000 ALTER TABLE `parkinglotdata` DISABLE KEYS */;
INSERT INTO `parkinglotdata` VALUES (2,2,'撏?憟喳?擃葉?唬?????,'?啣??銝?頝?9?2','??,'00:00','24:00','摰文',45,'2','2','121.5394146','24.9716752'),(3,2,'瘞湔像瘣?頠','??瘞湔像瘣挾4??-1??7-3??7-9?啗?(??蝺?8.5K)','??,'00:00','24:00','摰文',65,'2','2','121.8644858','25.1219428'),(4,2,'?啁?????內蝭?撣????,'銝????頝臭?畾???,'??,'00:00','24:00','摰文',65,'2','2','121.488401','25.0665205'),(5,2,'?箏?蝘飛??頠','?啣???頝臭?畾?13?1?3?4','??,'00:00','24:00','摰文',45,'2','2','121.5400813','24.9860095'),(6,2,'摰嗆?蝳????????,'????鈭楝銝畾?59?銝?璅?,'??,'00:00','24:00','摰文',20,'2','2','121.3729465','25.0799372'),(7,2,'?鞈???∩遢???砍?頝???璆剜?????,'?踵???頝??銝?撅?,'??,'00:00','24:00','摰文',65,'2','2','121.4571644','24.9986334'),(8,2,'?蟡之璅銝?頠','?踵?????梯楝20-6?2','??,'00:00','24:00','摰文',20,'2','2','121.4546073','25.0063739'),(9,2,'?祇???平??蝬?憭扳??唬?????,'?祇???芷?頝?21??,'??,'00:00','24:00','摰文',45,'2','2','121.6897473','25.1798106'),(10,2,'瘞游偏????,'?啣?撣?撅勗?瘞?頝?90??','??,'00:00','24:00','摰文',45,'2','2','121.585289','0.0002281'),(11,2,'瘝寡???B?)????,'?啣?撣楚瘞游?銝剜迤頝?畾?7撌瑁?瘝?頝臭漱撗(B?)','??,'00:00','24:00','摰文',65,'2','2','121.4203833','25.181155'),(12,2,'蝡輯?憭批?頠?頠','?啣?撣楚瘞游?蝡輯?銝銵?瘚琿?畾?39?啗?)','??,'00:00','24:00','摰文',45,'2','2','121.4490616','25.1659579'),(13,2,'?啣?撣????瑁隞賣???詨?頠','銝??銝剜迤?楝111??,'??,'00:00','24:00','摰文',45,'2','2','121.4870005','25.0645479'),(14,2,'暾駁?撖嗅銝鞎餃?頠','?啣?撣??瘞?頝?88撌??3','??,'00:00','24:00','摰文',65,'2','2','121.425127','25.023231'),(15,2,'瘙?乩???B1F)????,'?啣?撣摨?瘞?頝?13?1','??,'00:00','24:00','摰文',65,'2','2','121.5364359','24.9825333'),(16,2,'皝臬?銝?????,'?啣?撣????頝?畾?09撌瑕?銝剛???鈭文???,'??,'00:00','24:00','摰文',45,'2','2','121.469287','25.0460341'),(17,2,'蝧亳A+????,'?啣?撣?????頝?00?1?2','??,'00:00','24:00','摰文',20,'2','2','121.4877373','25.0513509'),(18,2,'?暹?憭扳? MEGA TOWER ????,'?啣?撣璈??啁?頝?8?2~B4??~9F','??,'00:00','24:00','摰文',45,'2','2','121.4667685','25.0134911'),(19,2,'憌?21蝘???????,'?啣?撣葉??銝剖控頝?畾?06??,'??,'00:00','24:00','摰文',65,'2','2','121.4766412','25.0062191'),(20,2,'?啣?撣楚瘞游?撣??臬???銝剖??唬?????,'?啣?撣楚瘞游?銝剖控?楝2畾?75??,'??,'00:00','24:00','摰文',45,'2','2','121.4434184','25.1868657'),(21,2,'?踵邦????,'璅寞??瘞湔?銵??踵??皞芸?頝?,'??,'00:00','24:00','摰文',20,'2','2','121.4276729','24.9809976'),(22,2,'靘踹???湧??勗銝?璅?????,'?啣?撣?甇Ｗ??啣鈭楝銝畾?5-81?2','??,'00:00','24:00','摰文',45,'2','2','121.64547','25.061804'),(23,2,'??瘥?頠','?啣?撣楚瘞游??頝?84撌?0?1','??,'00:00','24:00','摰文',20,'2','2','121.4512649','25.1775521'),(24,2,'憯賢噸????,'?啣?撣葉???像頝?00撌???,'??,'00:00','24:00','摰文',20,'2','2','121.4659479','24.99374'),(25,2,'瘙蝳桀?頠','?啣?撣摨?鈭?撘菔楝119???Ｙ征??,'??,'00:00','24:00','摰文',45,'2','2','121.5358784','24.9796012'),(26,2,'撖嗅?????,'?啣??撖嗅?銵?6??,'??,'00:00','24:00','摰文',20,'2','2','121.5421539','24.9842957'),(27,2,'蝣抒撜啁?????,'?啣?撣??蝳?銵?6??,'??,'00:00','24:00','摰文',45,'2','2','121.4604028','25.0535959'),(28,2,'瘛⊥偌?葉????,'瘛⊥偌???銵?0??,'??,'00:00','24:00','摰文',45,'2','2','121.4365588','25.1747208'),(29,2,'瘛⊥偌擐砍?蝝敹菟?ａ?閮剜鞎餃?頠','瘛⊥偌?瘞?頝?7??擐砍?璅2?3???之璅?','??,'00:00','24:00','摰文',65,'2','2','121.4619504','25.1390057'),(30,2,'?啣?撣???祆?銵憭扳??唬?2璅?閮剜鞎餃?頠','?啣?撣??銝剜迤頝?76?2','??,'00:00','24:00','摰文',65,'2','2','121.450118','25.036185'),(31,2,'憟賢?憭??????,'?啣?撣??撱箏?銝頝?38??,'??,'00:00','24:00','摰文',65,'2','2','121.434669','25.0274737'),(32,2,'敺瑕?????,'?啣??摰熒頝臭?畾?00-2??,'??,'00:00','24:00','摰文',65,'2','2','121.5042386','24.9581298'),(33,2,'摰嗥??∩遢???砍???詨?頠','銝???頝臭?畾?54??,'??,'00:00','24:00','摰文',45,'2','2','121.4671946','25.0430975'),(34,2,'?啁?鞈潛銝剖??A9????,'?啣?撣??????銝楝1畾??2?3','??,'00:00','24:00','摰文',45,'2','2','121.3615881','25.0661296'),(35,2,'?踵????寧撣蝚砌?????,'?啣?撣璈??踹?頝?000????,'??,'00:00','24:00','摰文',45,'2','2','121.44925','25.018864'),(36,2,'鈭???嗉祥????,'?啣?撣??蝳?銵?28撌?0?1?2','??,'00:00','24:00','摰文',20,'2','2','121.4622464','25.0578695'),(37,2,'?僑蝷暹?雿?銝?1擗典?頠','?啣?撣????唳眾?楝125?2~B3','??,'00:00','24:00','摰文',65,'2','2','121.4965374','25.0553754'),(38,2,'?僑蝷暹?雿?銝?2擗典?頠','?啣?撣???憭批??楝172撌?8??0?1~B3','??,'00:00','24:00','摰文',20,'2','2','121.4980413','25.0576816'),(39,2,'銝剛?????,'?啣?撣摨?銝剛?頝臭?畾?31??,'??,'00:00','24:00','摰文',20,'2','2','121.5446175','24.9791451'),(40,2,'?桀誨????,'?啣?撣璈?瘞?頝?畾?23?椰??7?砍偕??,'??,'00:00','24:00','摰文',45,'2','2','121.462891','25.0320831'),(41,2,'鈭?恍????,'?啣?撣璈?擃撖楝300??F~3F?2-B4','??,'00:00','24:00','摰文',65,'2','2','121.4532986','24.9999002'),(42,2,'摰?????,'?啣?撣像皞芸???銵?4??,'??,'00:00','24:00','摰文',65,'2','2','121.722503','25.023209'),(43,2,'Times 銝??琿?頝臬?頠','?啣?撣????琿?頝?2撌?2-1??','??,'00:00','24:00','摰文',20,'2','2','121.4845932','25.0542773'),(44,2,'曌予擗ㄡ摨?頠','?啣?撣??銝剖?頝?9??撠','??,'00:00','24:00','摰文',65,'2','2','121.4579322','25.0549939'),(45,2,'銝剖亢頝臬?瘝寧??嗉祥????,'?啣?撣???銝剖亢頝?畾?3?1','??,'00:00','24:00','摰文',20,'2','2','121.4382781','24.9680529'),(46,2,'銝剛?????,'?啣?撣??銝剖像頝?98撌?1????,'??,'00:00','24:00','摰文',45,'2','2','121.4465993','25.0485281'),(47,2,'?啣蝳?頠','銝剖???血?頝?88??F?1','??,'00:00','24:00','摰文',20,'2','2','121.4905316','24.9903837'),(48,2,'?啁?舫???頠','?啣?撣??蝳ˊ銵?11銋? ??蝛箏','??,'00:00','24:00','摰文',20,'2','2','121.4576377','25.051212'),(49,2,'瘞訾蝨????,'?啣?撣????縑鈭???靽∩?銵?76撌瑕?征??,'??,'00:00','24:00','摰文',65,'2','2','121.4954568','25.0787256'),(50,2,'蝬?尹????,'?啣?撣摨?摰孕頝?5?1','??,'00:00','24:00','摰文',65,'2','2','121.4844487','24.9624027'),(51,2,'??????,'?啣?撣葉???∪控頝?89?1','??,'00:00','24:00','摰文',20,'2','2','121.4783481','25.0094999'),(52,2,'摨?撱??唬?????,'?曉ˊ頝??銝?,'??,'00:00','24:00','摰文',45,'2','2','121.56299732925083','25.036088710859406'),(53,2,'?曉ˊ撱??唬?????,'?暹頝?5?銝?,'??,'00:00','24:00','摰文',20,'2','2','121.56628035534418','25.037146692861853'),(54,2,'?箏?撣摰單?霈葉敹銝?頠','?頝?91撌?1撘??銝?,'??,'00:00','24:00','摰文',45,'2','2','121.5662260284532','25.028806328792783'),(55,2,'?孕?砍??唬?????,'?暸?頝?23撌??銝?,'??,'00:00','24:00','摰文',20,'2','2','121.5718707051804','25.04744424437438'),(56,2,'蝡噙?砍??唬?????,'?踹噸頝?畾?72?銝?,'??,'00:00','24:00','摰文',20,'2','2','121.50356949655315','25.118430180412933'),(57,2,'?琿?憟痔蝡?銋?頠','?啣?撣?,'??,'00:00','24:00','摰文',65,'2','2','121.50110997030495','25.12645295106037'),(58,2,'?祈?葉?唬?????,'镼輯?頝?01?銝?,'??,'00:00','24:00','摰文',20,'2','2','121.49920699677799','25.028992720810674'),(59,2,'?琿???????,'?啣?撣葉撅勗???頝?98??璅1-B2','??,'00:00','24:00','摰文',65,'2','2','121.5557109129853','25.08513493614098'),(60,2,'?振???弦??????,'?葛??弦?Ｚ楝1畾?30撌?9?銝?-2撅?,'??,'00:00','24:00','摰文',45,'2','2','121.61260970851833','25.049133832770632'),(61,2,'?啁?舫之銝?????,'?頝?1?2~B4','??,'00:00','24:00','摰文',45,'2','2','121.50514654781308','25.043105170064205'),(62,2,'???踵??????,'靽∠儔??梯?頝?5?銝?-4撅?,'??,'00:00','24:00','摰文',65,'2','2','121.56661611908001','25.047041144808784'),(63,2,'???輻???蝡?頠','靽∠儔??粹?頝?畾?06?銝???撅?,'??,'00:00','24:00','摰文',65,'2','2','121.5632906114666','25.039847061953076'),(64,2,'?血?????,'??畾萄撠挾175??76??77??79??79-1??79-2??79-3??79-4??79-5?啗?','??,'00:00','24:00','摰文',45,'2','2','121.54918129308113','25.027343996126454'),(65,2,'???葉?唬?????,'?曉噸頝?00撌?8?銝?,'??,'00:00','24:00','摰文',65,'2','2','121.57280999836034','25.034905912630663'),(66,2,'撜函?蝡?????,'撜函?銵?3??,'??,'00:00','24:00','摰文',20,'2','2','121.5053853732904','25.044036599777492'),(67,2,'銝剖控?銝?頠','撱嗅像?楝98?銝?,'??,'00:00','24:00','摰文',65,'2','2','121.51045808475604','25.044012215635952'),(68,2,'撗單??血?????,'?血??楝2畾?01??蝛箏','??,'00:00','24:00','摰文',20,'2','2','121.54941430902004','25.027493362297605'),(69,2,'瘣蝡?????,'?唳眾?楝1畾???,'??,'00:00','24:00','摰文',65,'2','2','121.50587417219131','25.048244016715298'),(70,2,'憛??砍??唬?????,'憛?銵?1?銝?,'??,'00:00','24:00','摰文',20,'2','2','121.51098000202775','25.050819228827947'),(71,2,'?暸翩擃葉?唬?????,'?踹噸頝?畾?75?銝?,'??,'00:00','24:00','摰文',65,'2','2','121.523998543996','25.08615067253256'),(72,2,'?葛?砍??唬?????,'?葛銵?5?銝?,'??,'00:00','24:00','摰文',45,'2','2','121.52028870186615','25.085372328750136'),(73,2,'鈭???銝?頠','銝剖?楝57?銝?,'??,'00:00','24:00','摰文',45,'2','2','121.58044180825236','25.046627188823916'),(74,2,'瘞??砍??唬?????,'瘞??梯楝4畾?80?銝?,'??,'00:00','24:00','摰文',65,'2','2','121.5579743612291','25.061612158963605'),(75,2,'??砍??唬?????,'?銵?90?銝?,'??,'00:00','24:00','摰文',65,'2','2','121.531648953144','25.02952563943333'),(76,2,'?支滬?葉?唬?????,'銝剛頝?畾?06撌??銝?,'??,'00:00','24:00','摰文',45,'2','2','121.51055591219423','25.024421513907587'),(77,2,'璁桀?蝘??刻憭批??葦摨?頠','?像?梯楝2畾?11撌?9?銝?撅?,'??,'00:00','24:00','摰文',20,'2','2','121.54531926274856','25.025513235146885'),(78,2,'?航?砍??唬?????,'?航銵?5?銝?,'??,'00:00','24:00','摰文',20,'2','2','121.543786636403','24.995261600455844'),(79,2,'?曉控擃葉?唬?????,'?粹?頝?畾?56?銝?,'??,'00:00','24:00','摰文',45,'2','2','121.56407481428205','25.044076616943254'),(80,2,'?望????唬?????,'?望?頝?15??1?唬?','??,'00:00','24:00','摰文',45,'2','2','121.61569872878344','25.06854628365639'),(81,2,'憭抒酉??銝?頠','甇貊?銵?43?銝?,'??,'00:00','24:00','摰文',65,'2','2','121.51046820499613','25.058392753108553'),(82,2,'?葉?砍??唬?????,'敺抵??楝1畾?40撌?1?銝?,'??,'00:00','24:00','摰文',65,'2','2','121.54229161052957','25.03629138444445'),(83,2,'镼踵擃葉?唬?????,'?亙熒頝?25撌?9撘??銝?,'??,'00:00','24:00','摰文',20,'2','2','121.56588222963514','25.055812151114665'),(84,2,'?脣??砍??唬?????,'?怠噸頝?畾?58?銝?,'??,'00:00','24:00','摰文',45,'2','2','121.53770541657562','25.0461126304257'),(85,2,'颲漸???唬?????,'颲漸頝?畾?03?銝?,'??,'00:00','24:00','摰文',45,'2','2','121.55862421844337','25.006274814809128'),(86,2,'?殿擃葉?唬?????,'?踹噸頝?畾?35??1?唬?','??,'00:00','24:00','摰文',45,'2','2','121.51980805543661','25.060906542172283'),(87,2,'憭扯??砍??唬?????,'憭扯?銵?45?銝?,'??,'00:00','24:00','摰文',45,'2','2','121.50393615358976','25.131128359904206'),(88,2,'憭批?擃極?唬?????,'靽∠儔頝?畾?66撌?撘?2?銝?,'??,'00:00','24:00','摰文',45,'2','2','121.54185486111442','25.032635070483167'),(89,2,'?噸蝡?????,'??頝???,'??,'00:00','24:00','摰文',20,'2','2','121.58604991761518','25.045886360035194'),(90,2,'蝷曉?蝡?????,'撱嗅像?楝6畾?80??,'??,'00:00','24:00','摰文',65,'2','2','121.50595328004056','25.089581392119776'),(91,2,'?亙熒???唬?????,'撱嗅ˊ銵?68?銝?,'??,'00:00','24:00','摰文',20,'2','2','121.56235465177286','25.056537952066428'),(92,2,'敹縑?砍??唬?????,'?曆?頝??銝?,'??,'00:00','24:00','摰文',45,'2','2','121.56778319103641','25.04041931374981'),(93,2,'撱箸??葉?唬?????,'?瑕?镼輯楝37??銝?唬?','??,'00:00','24:00','摰文',45,'2','2','121.51987568502923','25.051488850127697'),(94,2,'?葉蝡?????,'?葉頝?4撌???,'??,'00:00','24:00','摰文',20,'2','2','121.60650222077207','25.05610449008915'),(95,2,'?僑?砍?擃憭怎??游銝?頠','??頝??銝?,'??,'00:00','24:00','摰文',45,'2','2','121.50778270012647','25.023779001503968'),(96,2,'?怠噸頝臬?頠','?箏?撣葉撅勗??怠噸頝臭?畾?03?1?4??,'??,'00:00','24:00','摰文',45,'2','2','121.53977284025949','25.04687712319202'),(97,2,'????唬?????,'?啣?頝?畾?8??,'??,'00:00','24:00','摰文',20,'2','2','121.57877277480436','24.99736352495899'),(98,2,'瘙撌?????,'銝剜迤?蝳?畾萎?撠挾267-3??91-4?啗?嚗?撌楝3畾?6??蝛箏','??,'00:00','24:00','摰文',20,'2','2','121.53066087354046','25.015867752079526'),(99,2,'靽∠儔撱??唬?????,'靽∠儔頝?畾?1?銝?,'??,'00:00','24:00','摰文',20,'2','2','121.56581163492964','25.033146070479685'),(100,2,'憭扳平蝡?????,'憭扳平頝?45??,'??,'00:00','24:00','摰文',20,'2','2','121.50289062096738','25.137677840182974'),(101,2,'?啣?101????,'?啣?撣縑蝢拙?撣?頝?5?2~B4','??,'00:00','24:00','摰文',45,'2','2','121.56373066286743','25.033734753648474'),(102,2,'123????,'?啣?撣陸撅勗?蝳?3銵?86??','???刻','03:20','15:20','摰文',55,'2','2','121.4319576','25.0567539');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parkinglotimage`
--

LOCK TABLES `parkinglotimage` WRITE;
/*!40000 ALTER TABLE `parkinglotimage` DISABLE KEYS */;
INSERT INTO `parkinglotimage` VALUES (2,102,'https://d1hxt3hn1q2xo2.cloudfront.net/1702149637-20210325-121559_U7321_M680292_0f7b.jpg');
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
) ENGINE=InnoDB AUTO_INCREMENT=210 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parkinglotsquare`
--

LOCK TABLES `parkinglotsquare` WRITE;
/*!40000 ALTER TABLE `parkinglotsquare` DISABLE KEYS */;
INSERT INTO `parkinglotsquare` VALUES (3,2,'1',NULL),(4,2,'2',NULL),(5,3,'1',NULL),(6,4,'1',NULL),(7,4,'2',NULL),(8,4,'3',NULL),(9,5,'1',NULL),(10,5,'2',NULL),(11,5,'3',NULL),(12,6,'1',NULL),(13,7,'1',NULL),(14,7,'2',NULL),(15,8,'1',NULL),(16,8,'2',NULL),(17,8,'3',NULL),(18,9,'1',NULL),(19,10,'1',NULL),(20,10,'2',NULL),(21,11,'1',NULL),(22,11,'2',NULL),(23,11,'3',NULL),(24,12,'1',NULL),(25,13,'1',NULL),(26,13,'2',NULL),(27,14,'1',NULL),(28,14,'2',NULL),(29,15,'1',NULL),(30,15,'2',NULL),(31,15,'3',NULL),(32,16,'1',NULL),(33,16,'2',NULL),(34,17,'1',NULL),(35,17,'2',NULL),(36,17,'3',NULL),(37,18,'1',NULL),(38,19,'1',NULL),(39,20,'1',NULL),(40,21,'1',NULL),(41,21,'2',NULL),(42,21,'3',NULL),(43,22,'1',NULL),(44,23,'1',NULL),(45,24,'1',NULL),(46,24,'2',NULL),(47,24,'3',NULL),(48,25,'1',NULL),(49,26,'1',NULL),(50,26,'2',NULL),(51,26,'3',NULL),(52,27,'1',NULL),(53,27,'2',NULL),(54,27,'3',NULL),(55,28,'1',NULL),(56,28,'2',NULL),(57,29,'1',NULL),(58,29,'2',NULL),(59,30,'1',NULL),(60,31,'1',NULL),(61,31,'2',NULL),(62,31,'3',NULL),(63,32,'1',NULL),(64,32,'2',NULL),(65,32,'3',NULL),(66,33,'1',NULL),(67,33,'2',NULL),(68,34,'1',NULL),(69,34,'2',NULL),(70,34,'3',NULL),(71,35,'1',NULL),(72,35,'2',NULL),(73,35,'3',NULL),(74,36,'1',NULL),(75,36,'2',NULL),(76,36,'3',NULL),(77,37,'1',NULL),(78,38,'1',NULL),(79,39,'1',NULL),(80,39,'2',NULL),(81,40,'1',NULL),(82,40,'2',NULL),(83,40,'3',NULL),(84,41,'1',NULL),(85,42,'1',NULL),(86,42,'2',NULL),(87,42,'3',NULL),(88,43,'1',NULL),(89,43,'2',NULL),(90,44,'1',NULL),(91,44,'2',NULL),(92,45,'1',NULL),(93,46,'1',NULL),(94,47,'1',NULL),(95,48,'1',NULL),(96,48,'2',NULL),(97,49,'1',NULL),(98,49,'2',NULL),(99,50,'1',NULL),(100,50,'2',NULL),(101,51,'1',NULL),(102,51,'2',NULL),(103,52,'1',NULL),(104,52,'2',NULL),(105,52,'3',NULL),(106,53,'1',NULL),(107,53,'2',NULL),(108,54,'1',NULL),(109,55,'1',NULL),(110,55,'2',NULL),(111,56,'1',NULL),(112,56,'2',NULL),(113,57,'1',NULL),(114,57,'2',NULL),(115,58,'1',NULL),(116,58,'2',NULL),(117,58,'3',NULL),(118,59,'1',NULL),(119,59,'2',NULL),(120,59,'3',NULL),(121,60,'1',NULL),(122,60,'2',NULL),(123,61,'1',NULL),(124,61,'2',NULL),(125,61,'3',NULL),(126,62,'1',NULL),(127,62,'2',NULL),(128,62,'3',NULL),(129,63,'1',NULL),(130,63,'2',NULL),(131,64,'1',NULL),(132,64,'2',NULL),(133,65,'1',NULL),(134,65,'2',NULL),(135,65,'3',NULL),(136,66,'1',NULL),(137,66,'2',NULL),(138,67,'1',NULL),(139,67,'2',NULL),(140,68,'1',NULL),(141,68,'2',NULL),(142,69,'1',NULL),(143,69,'2',NULL),(144,70,'1',NULL),(145,70,'2',NULL),(146,71,'1',NULL),(147,72,'1',NULL),(148,72,'2',NULL),(149,72,'3',NULL),(150,73,'1',NULL),(151,73,'2',NULL),(152,74,'1',NULL),(153,75,'1',NULL),(154,75,'2',NULL),(155,76,'1',NULL),(156,76,'2',NULL),(157,77,'1',NULL),(158,77,'2',NULL),(159,78,'1',NULL),(160,79,'1',NULL),(161,79,'2',NULL),(162,80,'1',NULL),(163,80,'2',NULL),(164,81,'1',NULL),(165,82,'1',NULL),(166,82,'2',NULL),(167,83,'1',NULL),(168,83,'2',NULL),(169,83,'3',NULL),(170,84,'1',NULL),(171,85,'1',NULL),(172,85,'2',NULL),(173,85,'3',NULL),(174,86,'1',NULL),(175,87,'1',NULL),(176,87,'2',NULL),(177,87,'3',NULL),(178,88,'1',NULL),(179,88,'2',NULL),(180,88,'3',NULL),(181,89,'1',NULL),(182,89,'2',NULL),(183,89,'3',NULL),(184,90,'1',NULL),(185,91,'1',NULL),(186,91,'2',NULL),(187,91,'3',NULL),(188,92,'1',NULL),(189,93,'1',NULL),(190,94,'1',NULL),(191,94,'2',NULL),(192,94,'3',NULL),(193,95,'1',NULL),(194,95,'2',NULL),(195,96,'1',NULL),(196,96,'2',NULL),(197,96,'3',NULL),(198,97,'1',NULL),(199,97,'2',NULL),(200,98,'1',NULL),(201,98,'2',NULL),(202,99,'1',NULL),(203,99,'2',NULL),(204,99,'3',NULL),(205,100,'1',NULL),(206,100,'2',NULL),(207,100,'3',NULL),(208,101,'1',NULL),(209,102,'1',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (24,'20231209220119047634',2,'DEPOSIT',1000,'撌脩像甈?,'2023-12-10 06:01:19'),(25,'20231209220142214558',2,'WITHDRAWAL',0,'撌脩像甈?,'2023-12-10 06:02:06'),(26,'20231209222358179394',2,'WITHDRAWAL',45,'撌脩像甈?,'2023-12-10 06:29:57');
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

-- Dump completed on 2023-12-10  8:26:49
