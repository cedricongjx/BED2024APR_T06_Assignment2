Create table Users( 

Userid int primary key identity, 

username varchar(50) not null unique, 

password varchar(100) not null unique 

); 

 

CREATE TABLE Admin ( 

  Adminid INT PRIMARY KEY IDENTITY, 

  username VARCHAR(50) NOT NULL UNIQUE, 

  password VARCHAR(100) NOT NULL UNIQUE 

); 

 

CREATE TABLE Donations ( 

    DonationID INT PRIMARY KEY IDENTITY, 

    DonatorID INT, 

    Name VARCHAR(100), 

    Amount DECIMAL(10, 2) NOT NULL, 

    DonationDate DATETIME DEFAULT GETDATE(), 

    FOREIGN KEY (DonatorID) REFERENCES Users(UserID) 

); 

 

 

create table Event( 

Eventid int primary key identity, 

EventName varchar(100) not null, 

eventDescription varchar (500) not null, 

eventDateTime datetime not null, 

Adminid int  

foreign key (Adminid) references Admin(Adminid) 

) 

 

create table EventsWithUsers( 

Eventid int, 

userid int, 

foreign key (eventid) references Event(eventid), 

foreign key (userid ) references Users(userid) 

) 

CREATE TABLE Feedback 
( 
  id INT PRIMARY KEY IDENTITY, 
  title VARCHAR(50) NOT NULL, 
  description VARCHAR(250) NOT NULL, 
  verified CHAR(1) NOT NULL DEFAULT('N') CHECK(verified IN ('Y','N')), 
  user_id INT FOREIGN KEY REFERENCES Users(userid), 
  admin_id INT FOREIGN KEY REFERENCES Admin(Adminid) 
); 

CREATE TABLE Documentary ( 

 docid INT PRIMARY KEY IDENTITY, 

 title varchar(100) NOT NULL, 

 documentary varchar(max) NOT NULL, 

 docdate date, 

 image varchar(500) 

) 

  

CREATE TABLE Newsletter( 

 newsid INT PRIMARY KEY IDENTITY, 

 email varchar(255) NOT NULL UNIQUE 

) 

INSERT INTO admin (username, password) VALUES ('test', 'test');
INSERT INTO admin (username, password) VALUES ('test1', 'test1');
INSERT INTO EVENT (EventName, eventDescription, eventDateTime, Adminid)
VALUES ('Sample Event1', 'This is a description for the sample event.', '2024-07-01T15:00:00', 1);
INSERT INTO EVENT (EventName, eventDescription, eventDateTime, Adminid)
VALUES ('Sample Event2', 'This is a description for the sample event.', '2024-07-01T15:00:00', 1);


select * from admin
select * from event