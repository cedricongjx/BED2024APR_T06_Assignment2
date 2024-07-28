CREATE TABLE Users ( 
    Userid int PRIMARY KEY IDENTITY(1,1), 
    username varchar(50) NOT NULL UNIQUE, 
    password varchar(100) NOT NULL, 
    role char(1) NOT NULL DEFAULT 'U', 
    CHECK (role='A' OR role='U') 
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
create table Event( 
  Eventid int primary key identity, 
  EventName varchar(100) not null, 
  eventDescription varchar (500) not null, 
  eventDateTime datetime not null, 
  Image varchar(100),
  location varchar(200) not null
) 
CREATE TABLE EventsWithUsers (
    Eventid int,
    userid int,
    FOREIGN KEY (Eventid) REFERENCES Event(Eventid),
    FOREIGN KEY (userid) REFERENCES Users(userid),
    PRIMARY KEY (Eventid, userid)
);
create table categories(
	catId int primary key IDENTITY(1,1) NOT NULL,
	categoryName varchar(100)  NOT NULL,
)
create table EventWithCategory(
	Eventid int NOT NULL,
	CatId int NOT NULL,
	foreign key (Eventid) references Event(Eventid),
	foreign key (CatId) references categories(CatId)
  PRIMARY KEY (Eventid, CatId)
)
INSERT INTO Event (EventName, eventDescription, eventDateTime, Image, location)
VALUES 
('Tech Conference 2024', 'A conference focusing on the latest in tech and innovation.', '2024-08-15 09:00:00', 'tech_conference.jpg', 'Convention Center, Hall 5'),
('Community Cleanup', 'Join us in cleaning up the local park and surrounding areas.', '2024-09-10 08:00:00', 'cleanup_event.jpg', 'Local Park'),
('Charity Run', 'A 5K run to raise money for local charities.', '2024-10-05 07:00:00', 'charity_run.jpg', 'City Stadium');

INSERT INTO EventWithUsers (Eventid, userid)
VALUES 
(1, 101),
(1, 102),
(2, 103),
(3, 104),
(3, 105);

INSERT INTO categories (categoryName)
VALUES 
('Technology'),
('Community Service'),
('Charity'),
('Sports'),
('Education');

INSERT INTO EventWithCategory (Eventid, CatId)
VALUES 
(1, 1), -- Tech Conference 2024 belongs to Technology category
(1, 2), -- Tech Conference 2024 belongs to Community Service category
(2, 2), -- Community Cleanup belongs to Community Service category
(3, 3), -- Charity Run belongs to Charity category
(3, 4); -- Charity Run also belongs to Sports category



INSERT INTO admin (username, password) VALUES ('test', 'test');
INSERT INTO admin (username, password) VALUES ('test1', 'test1');
INSERT INTO EVENT (EventName, eventDescription, eventDateTime, Adminid)
VALUES ('Sample Event1', 'This is a description for the sample event.', '2024-07-01T15:00:00', 1);
INSERT INTO EVENT (EventName, eventDescription, eventDateTime, Adminid)
VALUES ('Sample Event2', 'This is a description for the sample event.', '2024-07-01T15:00:00', 1);


select * from admin
select * from event