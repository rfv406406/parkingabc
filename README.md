# ParkingShare

A mobile-friendly website focused on backend and database design, offering services to store parking space rental information in a MySQL database and renders it on a map for users. It features a cash point storage system based on TapPay, and calculates the parking fees at the end of the service. Additionally, it provides historical usage information, including details of rentals, cash point storage, and transaction.

<img src=readmefile/img.png width=80% />

## DEMO URL

https://parkingabc.online/

## Test Account

Guests could use map and navigation function without logging in. 
To use parking space rental and parking service, you need to log first. Below are the test account and password.

| Account | Password |
|-----|--------|
| test@test.com | test |

| Card Number | Valid Date | CVV |
|-----|--------|--------|
| 4242 4242 4242 4242 | 12/24 | 123 |

## Core Features
* Parking rental service
* Map Service

## Tech Stack
* Python Flask
* Docker
* AWS EC2, Cloud Front, Nginx, S3, RDS
* JSON Web Token(JWT)
* MySQL

## Website architecture

<img src=readmefile/parkingabcST.png width=80% />


The backend of the website is built by ```Python Flask``` framework, initially encapsulated in ```Docker``` and then deployed on ```Amazon EC2``` servers, while also configured with ```NGINX``` as a ```reverse proxy```, and utilizing SSL/TLS certificates from ```Let’s Encrypt``` to ensure secure ```HTTPS``` connections. Data is stored in a ```MySQL``` database managed by ```Amazon RDS```, whereas static resources such as images and style sheets are stored on ```Amazon S3```, with content distribution accelerated through ```Amazon CloudFront``` for enhanced access speed.

## Demo GIF

Designing by MySQL relational database that conforms to the second normal form and utilizes foreign key constraints to enhance stability.

<img src=readmefile/DBS.png width=100% />

## Features

### Car information input(新創帳號使用者，進行停車服務前請先登記至少一筆車輛資料)

*Users need to input at least one car information for parking service.

![Alt text](<readmefile/input car infor.gif>)
<br/>

### Deposit(請儲值才可以進行停車服務)

*Users need to deposit. If the cash point is 0 or negative, parking service is forbidden.
![Alt text](readmefile/deposit.gif)
<br/>

### Location Search

Using the Google Map Apis to provide destination searching.

![Alt text](<readmefile/location search.gif>)
<br/>

### Navigation

Google Map Apis to provide navigation service.

![Alt text](readmefile/navigation.gif)
<br/>

### Parking space rental input

Data input MySQL to provide rental information for users.

![Alt text](<readmefile/input parking space.gif>)
<br/>

### Parking Demo

If you arrive parking lot, use this way to start parking.
![Alt text](<readmefile/parking demo.gif>)
<br/>

## Contact

康智偉 Chih-Wei, KANG

rfv406406@gmail.com

***