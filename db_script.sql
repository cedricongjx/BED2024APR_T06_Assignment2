
CREATE TABLE Feedback
(
	id INT PRIMARY KEY IDENTITY,
	title VARCHAR(50) NOT NULL,
	description VARCHAR(250) NOT NULL,
    category VARCHAR(20) NOT NULL,
	verified CHAR(1) NOT NULL DEFAULT('N') CHECK(verified IN ('Y','N')),
	time DATETIME NOT NULL DEFAULT(GETDATE()),
	user_id INT FOREIGN KEY REFERENCES Users(Userid),
	admin_id INT FOREIGN KEY REFERENCES Admin(Adminid)
);


INSERT INTO Feedback(title, description,category,verified) 
VALUES 
('Website is buggy','This website is very buggy','Bug', 'N'),
('Website description is wrong', 'The documentary is off', 'Feedback', 'N'),
('Donation failure','The donation took my money but did not register it','Customer Service','Y');


CREATE TABLE FeedbackVerified
(
	id INT  PRIMARY KEY IDENTITY,
	justification VARCHAR(250) NOT NULL,
	response VARCHAR(250) NULL,
	feedback_id INT FOREIGN KEY REFERENCES Feedback(id)
)


