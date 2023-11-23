CREATE DATABASE parkingabc;
SHOW DATABASES;
USE parkingabc;
SHOW TABLES;

SELECT * FROM parkinglotdata;
SELECT * FROM parkinglotimage;
SELECT * FROM parkinglotspace;
SELECT * FROM parkingspaceimage;
SELECT * FROM income;
SELECT * FROM member;
SELECT * FROM car;
SELECT * FROM car_image;

DROP TABLE parkinglotdata;
DROP TABLE parkinglotimage;
DROP TABLE parkinglotspace;
DROP TABLE parkingspaceimage;
DROP TABLE income;
DROP TABLE member;
DROP TABLE car;
DROP TABLE car_image;

DROP DATABASE parkingabc;

CREATE TABLE parkinglotdata(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
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
    parkinglotdata BIGINT,
    image VARCHAR(255) 
);

CREATE TABLE parkinglotspace(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    parkinglotdata BIGINT,
    number VARCHAR(255), 
    status VARCHAR(255)
);

CREATE TABLE parkingspaceimage(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    parkinglotspace BIGINT,
    image VARCHAR(255) 
);

CREATE TABLE income(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL DEFAULT (CURDATE()),
    parkinglot BIGINT,
    parkinglotname VARCHAR(255),
    parkinglotspace BIGINT,
    parkinglotspacename VARCHAR(255),
    address VARCHAR(255) NOT NULL,
    price VARCHAR(255) NOT NULL,
    starttime VARCHAR(255),
    stoptime VARCHAR(255),
    income BIGINT
);

CREATE TABLE member(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    birthday VARCHAR(255),
	cellphone TEXT,
    email TEXT NOT NULL,
    account TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE car(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    member_id VARCHAR(255) NOT NULL,
    carboard_unmber VARCHAR(255) NOT NULL
);

CREATE TABLE car_image(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    car_id VARCHAR(255) NOT NULL,
    member_id VARCHAR(255) NOT NULL,
    car_image VARCHAR(255) NOT NULL
);