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

    donationType VARCHAR(10) NULL,   

    months INT NULL,  

    FOREIGN KEY (DonatorID) REFERENCES Users(UserID)  

); 


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

 

CREATE TABLE FeedbackVerified 

( 

    id INT  PRIMARY KEY IDENTITY, 

    justification VARCHAR(250) NOT NULL, 

    response VARCHAR(250) NULL, 

    feedback_id INT FOREIGN KEY REFERENCES Feedback(id) 

) 

 

 

CREATE TABLE Documentary (  

docid INT PRIMARY KEY IDENTITY,  

title varchar(255) NOT NULL,  

documentary varchar(max) NOT NULL, 

docdate date,  


image varchar(max), 

doccategory varchar(50) 


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



 

CREATE TABLE Review ( 

    reviewid INT IDENTITY PRIMARY KEY,  

    docid INT NOT NULL,  

    review VARCHAR(500),  

    stars INT NOT NULL, 

    date date NOT NULL, 

    userid INT NOT NULL, 

    FOREIGN KEY (userid) REFERENCES Users(userid), 

    FOREIGN KEY (docid) REFERENCES Documentary(docid), 

    CONSTRAINT unique_docid_review UNIQUE (docid, review) 

); 

 

 
INSERT INTO admin (username, password) VALUES ('test', 'test');
INSERT INTO admin (username, password) VALUES ('test1', 'test1');
INSERT INTO EVENT (EventName, eventDescription, eventDateTime, Adminid)
VALUES ('Sample Event1', 'This is a description for the sample event.', '2024-07-01T15:00:00', 1);
INSERT INTO EVENT (EventName, eventDescription, eventDateTime, Adminid)
VALUES ('Sample Event2', 'This is a description for the sample event.', '2024-07-01T15:00:00', 1);


select * from admin
select * from event

--INSERT for Documentary--
INSERT into Documentary(title, documentary, docdate, image, doccategory) values ('How global warming is disrupting life on Earth, Our planet is getting hotter',
'Since the Industrial Revolution�an event that spurred the use of fossil fuels in everything from power plants to transportation�Earth has warmed by 1 degree Celsius, about 2 degrees Fahrenheit. That may sound insignificant, but 2023 was the hottest year on record, and all 10 of the hottest years on record have occurred in the past decade. Global warming and climate change are often used interchangeably as synonyms, but scientists prefer to use �climate change� when describing the complex shifts now affecting our planet�s weather and climate systems. Climate change encompasses not only rising average temperatures but also natural disasters, shifting wildlife habitats, rising seas, and a range of other impacts. All of these changes are emerging as humans continue to add heat-trapping greenhouse gases, like carbon dioxide and methane, to the atmosphere. What causes global warming? When fossil fuel emissions are pumped into the atmosphere, they change the chemistry of our atmosphere, allowing sunlight to reach the Earth but preventing heat from being released into space. This keeps Earth warm, like a greenhouse, and this warming is known as the greenhouse effect. Carbon dioxide is the most commonly found greenhouse gas and about 75 percent of all the climate warming pollution in the atmosphere. This gas is a product of producing and burning oil, gas, and coal. About a quarter of Carbon dioxide also results from land cleared for timber or agriculture. Methane is another common greenhouse gas. Although it makes up only about 16 percent of emissions, it''s roughly 25 times more potent than carbon dioxide and dissipates more quickly. That means methane can cause a large spark in warming, but ending methane pollution can also quickly limit the amount of atmospheric warming. Sources of this gas include agriculture (mostly livestock), leaks from oil and gas production, and waste from landfills. What are the effects of global warming? One of the most concerning impacts of global warming is the effect warmer temperatures will have on Earth''s polar regions and mountain glaciers. The Arctic is warming four times faster than the rest of the planet. This warming reduces critical ice habitat and it disrupts the flow of the jet stream, creating more unpredictable weather patterns around the globe. (Learn more about the jet stream.) A warmer planet doesn''t just raise temperatures. Precipitation is becoming more extreme as the planet heats. For every degree your thermometer rises, the air holds about seven percent more moisture. This increase in moisture in the atmosphere can produce flash floods, more destructive hurricanes, and even paradoxically, stronger snow storms. The world''s leading scientists regularly gather to review the latest research on how the planet is changing. The results of this review is synthesized in regularly published reports known as the Intergovernmental Panel on Climate Change (IPCC) reports. A recent report outlines how disruptive a global rise in temperature can be: Coral reefs are now a highly endangered ecosystem. When corals face environmental stress, such as high heat, they expel their colorful algae and turn a ghostly white, an effect known as coral bleaching. In this weakened state, they more easily die. Trees are increasingly dying from drought, and this mass mortality is reshaping forest ecosystems. Rising temperatures and changing precipitation patterns are making wildfires more common and more widespread. Research shows they''re even moving into the eastern U.S. where fires have historically been less common. Hurricanes are growing more destructive and dumping more rain, an effect that will result in more damage. Some scientists say we even need to be preparing for Cat 6 storms. (The current ranking system ends at Cat 5.) How can we limit global warming? Limiting the rising in global warming is theoretically achievable, but politically, socially, and economically difficult. Those same sources of greenhouse gas emissions must be limited to reduce warming. For example, oil and gas used to generate electricity or power industrial manufacturing will need to be replaced by net zero emission technology like wind and solar power. Transportation, another major source of emissions, will need to integrate more electric vehicles, public transportation, and innovative urban design, such as safe bike lanes and walkable cities. One global warming solution that was once considered far fetched is now being taken more seriously: geoengineering. This type of technology relies on manipulating the Earth''s atmosphere to physically block the warming rays of the sun or by sucking carbon dioxide straight out of the sky. Restoring nature may also help limit warming. Trees, oceans, wetlands, and other ecosystems help absorb excess carbon�but when they''re lost, so too is their potential to fight climate change. Ultimately, we''ll need to adapt to warming temperatures, building homes to withstand sea level rise for example, or more efficiently cooling homes during heat waves.', 
'2024-02-15', 
'https://i.natgeofe.com/n/48597c14-b468-42ec-a2fa-1ff99195aed0/GettyImages-1354065189.jpg?w=1280&h=853',
'Environment');

INSERT into Documentary(title, documentary, docdate, image, doccategory) values ('The Impact of Technology in Healthcare', 
'Technology in healthcare is a relatively new term. Although innovators have talked about using technology and computers in healthcare since the sixties, such practices were too costly at that time. Additionally, advancements in technology weren''t properly tested, making it difficult to implement computers into day-to-day medical operations. Fast forward to today, it''s clear that technology has changed the way we work, and the healthcare sector isn''t an exception.

Not only do technological tools expand the possibilities of medical treatments, but they also improve many operations, saving time and costs for industry experts. For example, implementing machines and using digital tools helped medical institutions track medical records easier while helping patients access treatment data easier. Keep on reading to learn more about how technology impacted the healthcare sector.

Patient Portals Provide More Flexibility

Thanks to the global pandemic, telehealth has become the next great thing, and it appears that it''s here to stay. Once used as a way to restrict the spread of the virus, it''s now an efficient method to access health services. That''s because some patients live in rural areas, while others struggle to find the time to book an appointment.

As a result, patient portals and telemedicine technology are a solution to solving this issue. Patients no longer need to visit physical healthcare centers. Doctors, practice nurses, and other medical practitioners can ensure correct personalized treatment plans all over a single phone call or by using a special internal video-conferencing service. This way, people can avoid unnecessary face-to-face meetings, at the same time, receive the needed treatment guidelines.

Automated and Efficient Internal Processes

Similar to financial institutions, healthcare professionals operate in a strictly regulated environment, which means that they need to maintain a detailed security policy by following countless administrative procedures. This is where technology comes into play. Daily processes now have technology helping with efficient workflow management.

Modern digital healthcare services are known for:

Reduced costs
Better patient outcomes
Cutting-edge online platforms
Automated procedures
Operational efficiency
For instance, patients nowadays fill out digital forms that are automatically forwarded to the appropriate department for review. Additionally, organization-wide procedures and information, along with training material, can be sent online. That means the staff can gain new skills without having to participate in on-site training sessions or traveling a long distance.

Artificial Intelligence and Big Data

Big data, machine learning (ML), and artificial intelligence (AI) are also used in various fields of healthcare, typically applications that are designed for hospitals. Cognitive computer systems enable sample analyses, which are made by investigating repetitive patterns and processes. This is especially useful for radiological diagnosis. In the meantime, AI is used to predict future behaviors and functions, which powers machines to learn and improve the work of humans.

Other use cases of deep learning and artificial intelligence can be used for determining patients'' time of death or automatically prescribing the best-suited medication for ill patients. AI helps monitor the status of any patient, alerting doctors if they are needed to be transferred to palliative care, for example. Of course, let''s not forget surgical robots that can now perform complex surgeries that would typically require hours of work for highly skilled surgeons.

Applications and Increased Mobility

Overall, health-tracking using apps and smart watches has become a global trend for a reason. More patients are turning to their smart devices for advice, prescriptions, and other convenient services regarding their health. Mobile applications provide the benefit of having more control over your health without having to rely on in-person meetings with the doctor.

Like other apps, convenience and immediate access to services play a huge role in the success of healthcare applications. By using an app on your phone, you can securely check information about your health and receive updates in a matter of seconds, 24/7.

Here are some benefits of using healthcare apps:

They are user-friendly and very easy to use.
Apps provide clear information and inform patients about the next steps.
You can communicate with professionals easier.
You''re part of a remote community where you can share your experience.
Despite that, with every technological invention comes the risks of cyberattacks. The healthcare sector safeguards medical apps that hold important patient data by implementing authentication services, similar to iDenfy and its remote ID verification solution. That means if you want to register for a medical clinic''s app, you might need to verify your identity first for security reasons. This way, medical institutions prevent hackers from compromising their networks.

Final Words

Technology has made a huge impact on the healthcare industry. From smoothening out internal processes to enabling surgeries that are performed remotely by robots, it''s crystal clear that technology comes in handy. Patients no longer need to wait in lines, as they can book a medical appointment using an app. Healthcare businesses can communicate with their clients better by providing them with treatment and test results with just a few clicks. It appears it''s just the beginning, as technology will most likely progress, bringing new benefits to the healthcare sector.

By Domantas Ciulde',
'2024-10-07',
'https://images.tmcnet.com/tmc/misc/articles/image/2022-oct/5973416478-doctor11.jpg',
'Healthcare')

INSERT into Documentary(title, documentary, docdate, image, doccategory) values ('Why your food choices are a political act', 
'The choice of what you eat is perhaps globally as influential � or more � as your vote in national elections.

It always has been. Think about the history of food.

In the beginning there was selfishness. A hunter-gatherer lifestyle promoted competition over cooperation, in line with the logic of � literally � first come, first served.

The transition from a hunter-gatherer lifestyle to a structured agriculture with management and cultivation of crops and animals had massive political implications.

But the dark side of humans � in the form of competition or even fierce, existential rivalry in the pre-settlement era � was still there. The rise of societal structure gave birth to the concept of political elites, which would normally be formed of those most qualified or most in the position to manage the food surplus. Back then, what we would call today a national treasury, was directly linked to agriculture.

With the rise of political elites, the inevitable happened. Whilst the pre-settlement model was based on the tribal logic of us-against-them, it also curbed any individual ambitions which put the benefit of the group first. The new arrangement, however, allowed for the rise of internal divisions, including inequalities and class systems.

Years later, the erosion and soil depletion around Rome triggered another revolution of a political nature, when the empire was forced to establish trade relations with North Africa, particularly Egypt, in order to meet its fundamental promise of feeding its people.

Since then, the management of crops surplus and trade pacts served for many centuries as a driving force of alliances, wars, political debates, and engines of growth for many parts of Europe and indeed the world.

Fast-forward. Think about the more recent times, the start of the twentieth century and the innovation of ammonia fertiliser � �the bread from air� � by the German chemist, Fritz Haber. His rather innocent set of scientific achievements, designed to answer the problem of food shortages following rapid population growth, sent Europe into some of its darkest moments in history. His ammonia fertiliser is believed to have at the same time fed millions, if not billions, of people, but also to have extended the first world war by at least a year, being effectively used as an explosive and claiming many human lives.

One thing that connects all these examples is that every single decision we make about food, every single step changing the way we produce it, has political � understood as societal � consequences.

When today you choose cheaper, lower quality products over those perhaps a bit more expensive, but produced in a controlled, sustainable environment � it is an essentially political decision. If you go for simplified, standardised, and mechanically-produced goods over those from local sources � it is an equivalent of a political vote for your vision of the future.

As we enter the new age of uncertainty and global challenges, when even Haber�s magic formula increasingly seems to be not enough to meet the demand for the 21st Century with 10 billion people expected by 2050, we may be on the brink of another historic turn. Where do we go from here?

I, for one, believe in the spirit of the famous saying of the former Czechoslovak leader, Vaclav Havel, who hugely influenced the Central European understanding of politics. �The salvation of this human world,� he said, �lies nowhere else than in the human heart, in the human power to reflect, in human meekness and human responsibility.�

Appreciating the progress my country, Poland, has made since the collapse of communism in 1989, effectively joining the most developed countries in the world, I feel morally obliged to support others in meeting their aspirations of a prosperous and peaceful life.

If there is a way forward � to the world of no hunger, limited inequalities, little problems with nutrition � I believe it to be strictly connected to our ability to cooperate with each other in the spirit of solidarity and inclusion. The recently adopted set of UN Sustainable Development Goals � including much welcomed actions connected to food security, food safety, responsible production and consumption � offers the real prospect of a better world, but requires a paradigm shift for the change to take place.

Every single purchase of every single food product needs to be considered a political decision. As consumers, we indeed are co-responsible for making informed choices, even if it takes an extra 30 seconds to use our smartphone and check if the product we are about to buy meets the environmental, quality and social standards for the future world we want to live in.

Climate change, poverty, hunger, rising inequalities. It is all one, interconnected fight we are a part of.

This World Food Day, as business and government leaders across the globe reaffirm their political commitment to fight hunger, make no mistake: you are one of them. You are perhaps the most influential of them all, as you are in a position to reaffirm this pledge every time you go shopping.

Spread the word among your friends, and encourage them to make responsible decisions.

The next time you buy groceries, remember: it�s decision time. What you eat is what you vote for.',
'2015-10-16',
'https://assets.weforum.org/article/image/large_ZhktFwS8CBO5oRQv2fbhh_4ZAfE12IbG7cjNRab6Afw.jpg',
'Food and Nutrition')

INSERT into Documentary(title, documentary, docdate, image, doccategory) values ('Authentic Engagement: Michael Hernandez on Using AI and Meaningful Assessments to Reenergize Learning', 
'One thing we all seem to agree on when it comes to Artificial Intelligence (AI) is that it�s poised to cause significant change. It�s revolutionizing how we work and play, how we communicate, and even how we create. And as is often the case with new technologies, there�s a lot of fear about the future. However, educator and author Michael Hernandez is cautiously optimistic that with thoughtful and ethical adoption, AI can transform our education system for the better. Instead of challenges, he�s looking for opportunities. Hernandez, a veteran media arts teacher at Mira Costa High School in California and author of the recently published ISTE book Storytelling with Purpose: Digital Projects to Ignite Student Curiosity, is passionate about increasing student engagement, in part via authentic and meaningful assessments. He encourages the use of story projects that allow students to utilize their unique voices and perspectives, find deeper meaning in their learning, and avoid the temptation to cheat. While cheating has been at the forefront of concerns about AI on the educational front, Hernandez has a different take. AI, he reminds us, is just another tool. He likens it to the introduction of the calculator in classrooms; schools wanted to ban them because students wouldn�t learn basic math skills. But Hernandez believes that artificial intelligence may free students from mundane tasks, allowing them to delve deeper into topics of interest. �I�m hopeful that AI will be the ultimate disruptor of a very problematic academic school system which has always focused on rote memorization and repetitive activities,� Hernandez explains. �How can we use these tools to offload that cognitive load?� When Hernandez thinks back to childhood, he remembers having his own challenges in the classroom. �There are many obstacles to learning that students struggle with,� he says. �Instead of putting barriers in front of kids and telling them they have to suffer, because suffering somehow equals learning, we should focus on what really matters, which is curiosity and passion and doing something real that has an impact in the world.� It is exactly these challenges and this vision that pushed Hernandez to think critically about assessments. He dedicated a full chapter to the subject in Storytelling with Purpose and found that it resonated heavily with fellow educators who were struggling to properly assess student learning and discourage cheating. This led Hernandez to create his new self-produced online course, entitled Uncheatable Assessments. Hernandez�s method isn�t simply about making it difficult for students to cheat, it�s also about creating assignments that are exciting, so kids aren�t compelled to cheat. Instead of bogging students down in the name of a learning model that often equates to �minutes sitting in a chair,�� Hernandez advocates rethinking standardized assignments, where possible, and freeing students to share their learning stories. In terms of AI and its future in the classroom, Hernandez thinks it may be just what we need to tear down barriers to learning and elevate the type of work students can engage in. "These tech tools, and especially artificial intelligence, have highlighted the importance of our humanity, originality, and creativity,� he shares. �What is of value is not rote memorization. It��s not the worksheets. It��s what you can do that is helpful and productive and unique. And so, it��s not so much what you know, but what you can do with what you know that matters."',
'2024-06-20',
'https://iste-prod.imgix.net/GettyImages-892807216.jpg?auto=compress%2Cformat&fit=crop&ar=1.7777777777778%3A1&crop=focalpoint&fp-x=0.5&fp-y=0.5&h=720&q=80&w=1946&ixlib=imgixjs-4.0.1',
'Education')

INSERT into Documentary(title, documentary, docdate, image, doccategory) values ('How will climate change affect agriculture?', 
'The effects of climate change, now accelerating all over the world, include unpredictable changes in rainfall patterns bringing drought, heatwaves, and flooding. As extreme weather becomes more frequent, and destructive events hit farmers harder, the impact on farming will be more and more severe.

The most impoverished farmers (including pastoralists, fishers, and others who rely on agriculture and natural resources to survive) are among the worst affected. Women farmers, who already face greater difficulties accessing land, finance, and training, face some of the greatest risks to their fragile livelihoods.

The ways climate change is affecting farmers is one factor driving the acceleration of inequality and poverty. However, all farming � whether subsistence-level producers in West Africa or industrial-sized farms in Europe and North America � are feeling the effects of climate change.

Since it was founded in the 1940s, Oxfam has been fighting hunger and supporting farmers while working to change the underlying causes of injustice and poverty. You can read here how we see climate change affecting agriculture and the ways the climate crisis is driving malnutrition, see our recommendations for what we can do now to ensure we have food in the future, and learn more about what you can do to help the farmers who are the least responsible for climate change to survive.

HOW DOES CLIMATE CHANGE AFFECT FOOD PRODUCTION?
The worst effects of climate change are now bringing significant risks to farming, including unpredictable changes in temperature (both averages, and extreme heat and cold), and availability of water (the volume of precipitation � too much destructive rain, and drought).

As the climate changes, so is the range of pests and diseases. Areas that were not previously vulnerable to certain types of crop-eating insects or destructive blights or fungi might suddenly be exposed to additional, unfamiliar risks. �The net effect of these climate [-induced] impacts will generally be negative (e.g., droughts causing reduced crop yields or crop failures), though they may be positive in some instances (e.g., warmer springs, longer growing seasons),� says a report co-authored by Oxfam.

Some of these concerns are already visible in East Africa, an area suffering from recurrent drought causing crop failures, loss of livelihoods, and large-scale internal displacement. At one point in 2022, 85 percent of cropland in Ethiopia had been affected, and up to 60 percent of cereal production in Somalia was below average as a result of a two-year-drought. The drought killed millions of livestock, due to lack of water and pasture.

Small-scale farmers, who produce more than 70 percent of the food consumed by people in Asia and sub-Saharan Africa, are the most vulnerable to climate change and the resulting volatility of commodity prices. Yet they are the least responsible for the heat-trapping emissions responsible for the changes that are making food production, on which their very lives depend, more and more difficult.

HOW MUCH DOES AGRICULTURE CONTRIBUTE TO CLIMATE CHANGE?
Farming contributes to global warming, as fertilized soil emits nitrous oxide, cattle pass methane gas, and burning fields produces carbon dioxide. Agriculture accounts for one third of greenhouse gas emissions globally, according to the UN Food and Agriculture Organisation.

As part of our Behind the Brands campaign, started in 2013, Oxfam�s learned that the large-scale industrial agriculture production and supply chain supporting the food and beverage sector accounts for as much as 37 percent of global greenhouse gas emissions and is responsible for much of the destruction of the world�s tropical rainforests.

This means food and beverage companies are in a position to make a major difference in reducing greenhouse gas emissions and promoting sustainable farming practices that can help farmers survive climate change. Oxfam has advocated for the top 10 food and beverage companies to make commitments to reduce greenhouse gas emissions across their supply chain, set science-based goals, and track their results. We�ve actually scored these companies on the actions they take to protect the environment (and workers).

HOW MUCH DOES CLIMATE CHANGE AFFECT SOIL?
Farmers in areas accustomed to regular rainy seasons are now experiencing unpredictable rainfall. Sometimes this comes in the form of unusually heavy rains, which can have devastating effects, eroding top soil, washing away nutrients, and destroying productive growing areas.

Oxfam is helping farmers protect their soil by applying organic fertilizer, and planting trees to help reduce erosion and add nitrogen to improve soil quality. We advise farmers to plant trees and build stone walls and other structures to reduce water run-off, recharge groundwater, maintain moisture in growing areas, and reduce erosion.

To help rice farmers in southeast Asia, Oxfam for many years trained farmers in the System of Rice Intensification (SRI), which reduces chemical fertilizers that release powerful greenhouse gases when applied to farmland. SRI growing methods use 30 percent less water, no harmful chemicals, and reduces greenhouse gas emissions by up to 20 percent.

HOW DOES CLIMATE CHANGE AFFECT MALNUTRITION?
There�s no question that the effects of climate change, especially the increasing number of extreme weather events, are playing a negative role in malnutrition rates in the most vulnerable areas of the world.

Between 2000 and 2022, 10 countries that experienced the highest number of U.N. appeals related to extreme weather events saw malnutrition jump from 21 million people to 48 million during the last six years of that period, according to an analysis by Oxfam. �The correlation between weather-related crises and rising hunger in these countries is stark and undeniable,� the report states.

As the frequency of extreme weather events increases, the poorest families hit by storms, floods, or severe drought have less and less time to recover before the next disaster hits. For pastoralist families, it can take years to rebuild herds destroyed by drought. Others displaced by flooding may not be able to replant severely eroded fields, and must seek an entirely different livelihood. These shocks are generally accompanied by food scarcity and increased prices.

As in all crises, the most disadvantaged people suffer the most. Women, minority groups, and children are most at risk of malnutrition in areas where climate-driven extreme weather has disrupted food supplies and malnutrition increases.

WHAT WILL FARMING LOOK LIKE IN 2100?
What the global agriculture system will look like in the future will depend on what we do today. There is a potential for even more negative outcomes if we do not reduce greenhouse gas emissions and help farmers adapt to climate change.

If temperatures continue to climb and there are no technological advances, rice yields in Asia could drop as much as 50 percent by 2100, compared to 1990.
Farmers in South Asia could experience a 30 percent reduction in wheat and maize production by the end of the century, pushing up food prices. By 2030, as many as 38 million more people in Asia and the Pacific region could be pushed into hunger.
To avoid the worst possible outcomes, Oxfam is recommending that countries should:

Deeply reduce emissions: To minimize the worst effects of climate change on agriculture, countries like the United States need to take realistic steps to reduce greenhouse gas emissions by 2030 to ensure temperature increases do not exceed 1.5 degrees Celsius.
Provide humanitarian aid to address the immediate hunger crisis in places hit hardest by climate change.
Fairly compensate those most affected by the climate crisis: Rich polluting countries must compensate low-income countries for the damages and losses they caused them due to climate change, so farmers can recover and adapt their agricultural production.
Prepare for the next climate shock: To help the most vulnerable farmers be better prepared, we need funds for communities at risk that can be provided ahead of climate disasters, create early warning systems so they can prepare, and ensure local communities and organizations can lead the response to disasters.
If we succeed, we will build a more gender just, resilient, and sustainable food system at the heart of the climate response. This will ensure small-scale food producers (many of whom are women) participate in discussions about adapting and surviving climate change. The agriculture and food system of the future will require investing in sustainable agriculture that supports local food production and preserves the planet.',
'2024-04-18',
'https://webassets.oxfamamerica.org/media/images/Oxfam_InuruID.2e16d0ba.fill-1180x738-c100.jpegquality-60_X8VKdr7.jpg',
'Agriculture')
