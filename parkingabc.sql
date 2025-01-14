SHOW DATABASES;
USE parkingabc;
SELECT VERSION();
SHOW TABLES;
SHOW PROCESSLIST;
SELECT trx_id, trx_state, trx_started, trx_requested_lock_id, trx_mysql_thread_id FROM information_schema.innodb_trx;

SELECT * FROM car;
SELECT * FROM car_image;
SELECT * FROM consumption;
SELECT * FROM deposit_account;
SELECT * FROM member;
SELECT * FROM parkinglotdata;
SELECT * FROM parkinglotimage;
SELECT * FROM parkinglotsquare;
SELECT * FROM parkingsquareimage;
SELECT * FROM transactions;

SET SQL_SAFE_UPDATES = 0;

UPDATE parkinglotsquare 
SET status = '閒置中' 
WHERE parkinglotdata_id = 45 AND square_number = 1;
UPDATE member SET status = NULL WHERE id = 1;

SET SQL_SAFE_UPDATES = 1;

ALTER TABLE parkinglotimage
ADD FOREIGN KEY (parkinglotdata_id) 
REFERENCES parkinglotdata(id);
ALTER TABLE parkinglotsquare
ADD FOREIGN KEY (parkinglotdata_id) 
REFERENCES parkinglotdata(id);

DROP TABLE IF EXISTS car;
DROP TABLE IF EXISTS car_image;
DROP TABLE IF EXISTS consumption;
DROP TABLE IF EXISTS deposit_account;
DROP TABLE IF EXISTS member;
DROP TABLE IF EXISTS parkinglotimage;
DROP TABLE IF EXISTS parkinglotsquare;
DROP TABLE IF EXISTS parkingsquareimage;
DROP TABLE IF EXISTS parkinglotdata;
DROP TABLE IF EXISTS transactions;

CREATE TABLE car (
  id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  member_id varchar(255) NOT NULL,
  carboard_number varchar(255) NOT NULL
);

CREATE TABLE car_image (
  id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  car_id varchar(255) NOT NULL,
  car_image varchar(255) NOT NULL
);

CREATE TABLE consumption (
  id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  date date NOT NULL DEFAULT (curdate()),
  member_id bigint DEFAULT NULL,
  order_number varchar(255) NOT NULL,
  address varchar(255) NOT NULL,
  parkinglotdata_id bigint DEFAULT NULL,
  parkinglotname varchar(255) DEFAULT NULL,
  parkinglotsquare bigint DEFAULT NULL,
  square_number varchar(255) DEFAULT NULL,
  car_board varchar(255) DEFAULT NULL,
  price varchar(255) NOT NULL,
  starttime varchar(255) DEFAULT NULL,
  stoptime varchar(255) DEFAULT NULL,
  payment bigint DEFAULT NULL,
  income bigint DEFAULT NULL
);

CREATE TABLE deposit_account (
  id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  member_id varchar(255) NOT NULL,
  Balance bigint NOT NULL DEFAULT '0'
);

CREATE TABLE member (
  id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(255) DEFAULT NULL,
  birthday varchar(255) DEFAULT NULL,
  cellphone text,
  email text NOT NULL,
  account text NOT NULL,
  password text NOT NULL,
  status varchar(255) DEFAULT NULL,
  RegistrationDate datetime DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE parkinglotdata (
  id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  member_id bigint DEFAULT NULL,
  name varchar(255) NOT NULL,
  address varchar(255) NOT NULL,
  landmark text NOT NULL,
  openingTime text NOT NULL,
  closingTime text NOT NULL,
  spaceInOut text NOT NULL,
  price bigint DEFAULT NULL,
  widthLimit varchar(255) NOT NULL,
  heightLimit varchar(255) NOT NULL,
  lng varchar(255) DEFAULT NULL,
  lat varchar(255) DEFAULT NULL
);

CREATE TABLE parkinglotimage (
  id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  parkinglotdata_id bigint DEFAULT NULL,
  image varchar(255) DEFAULT NULL
);

CREATE TABLE parkinglotsquare (
  id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  parkinglotdata_id bigint DEFAULT NULL,
  square_number bigint DEFAULT NULL,
  status varchar(255) DEFAULT NULL
);

CREATE TABLE parkingsquareimage (
  id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  parkinglotsquare_id bigint DEFAULT NULL,
  image varchar(255) DEFAULT NULL
);

CREATE TABLE transactions (
  id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_number varchar(255) NOT NULL,
  deposit_account_id bigint NOT NULL,
  Type enum('DEPOSIT','WITHDRAWAL') NOT NULL,
  Amount bigint NOT NULL,
  status varchar(255) NOT NULL,
  transactions_time datetime DEFAULT CURRENT_TIMESTAMP
);



