CREATE DATABASE parkingabc;
SHOW DATABASES;
USE parkingabc;
SHOW TABLES;

SELECT * FROM parkinglotdata;
SELECT * FROM parkinglotimage;
SELECT * FROM parkinglotsquare;
SELECT * FROM parkingsquareimage;
SELECT * FROM member;
SELECT * FROM car;
SELECT * FROM car_image;
SELECT * FROM deposit_account;
SELECT * FROM transactions;
SELECT * FROM consumption;

DROP TABLE parkinglotdata;
DROP TABLE parkinglotimage;
DROP TABLE parkinglotsquare;
DROP TABLE parkingsquareimage;
DROP TABLE consumption;
DROP TABLE member;
DROP TABLE car;
DROP TABLE car_image;
DROP TABLE deposit_account;
DROP TABLE transactions;

DROP DATABASE parkingabc;

CREATE TABLE member(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    birthday VARCHAR(255),
	cellphone TEXT,
    email TEXT NOT NULL,
    account TEXT NOT NULL,
    password TEXT NOT NULL,
    RegistrationDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE parkinglotdata(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    member_id BIGINT,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
	landmark TEXT NOT NULL,
    openingTime TEXT NOT NULL,
    closingTime TEXT NOT NULL,
    spaceInOut TEXT NOT NULL,
    price VARCHAR(255) NOT NULL,
    widthLimit VARCHAR(255) NOT NULL,
	heightLimit VARCHAR(255) NOT NULL,
    lng VARCHAR(255),
    lat VARCHAR(255)
);

CREATE TABLE parkinglotimage(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    parkinglotdata_id BIGINT,
    image VARCHAR(255) 
);

CREATE TABLE parkinglotsquare(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    parkinglotdata_id BIGINT,
    square_number VARCHAR(255), 
    status VARCHAR(255)
);

CREATE TABLE parkingsquareimage(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    parkinglotsquare_id BIGINT,
    image VARCHAR(255) 
);

CREATE TABLE car(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    member_id VARCHAR(255) NOT NULL,
    carboard_unmber VARCHAR(255) NOT NULL
);

CREATE TABLE car_image(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    car_id VARCHAR(255) NOT NULL,
    car_image VARCHAR(255) NOT NULL
);

CREATE TABLE deposit_account(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    member_id VARCHAR(255) NOT NULL,
    Balance  BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(255) NOT NULL,
    deposit_account_id INT NOT NULL,
    Type ENUM('DEPOSIT', 'WITHDRAWAL') NOT NULL,
    Amount BIGINT NOT NULL,
    status VARCHAR(255) NOT NULL,
    transactions_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE consumption(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    member_id BIGINT,
    date DATE NOT NULL DEFAULT (CURDATE()),
    parkinglotdata_id BIGINT,
    parkinglotname VARCHAR(255),
    parkinglotsquare BIGINT,
    square_number VARCHAR(255),
    address VARCHAR(255) NOT NULL,
    price VARCHAR(255) NOT NULL,
    starttime VARCHAR(255),
    stoptime VARCHAR(255),
    payment BIGINT
);