create database gym;
use gym;

-- Bảng người dùng
CREATE TABLE `Users` (
    `user_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_name` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(255) NOT NULL,
    `role` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `fullname` VARCHAR(255) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `date_of_birth` DATE NOT NULL
);

-- Bảng phòng tập
CREATE TABLE `Rooms` (
    `room_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `room_name` VARCHAR(255) NOT NULL,
    `room_type` VARCHAR(255) NOT NULL,
    `status` VARCHAR(255) NOT NULL
);

-- Bảng thiết bị trong phòng tập
CREATE TABLE `Equipments` (
    `equipment_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `equipment_name` VARCHAR(255) NOT NULL,
    `quantity` BIGINT NOT NULL,
    `manufacturer` VARCHAR(255) NOT NULL,
    `room_id` BIGINT unsigned NOT NULL,
    `price` DOUBLE NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    `notes` VARCHAR(255) NULL,
    FOREIGN KEY (`room_id`) REFERENCES `Rooms`(`room_id`)
);

-- Bảng gói tập
CREATE TABLE `MembershipPackage` (
    `package_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `package_name` VARCHAR(255) NOT NULL,
    `duration` BIGINT NOT NULL, -- Thời gian gói tập tính bằng ngày
    `max_pt_meeting_days` BIGINT DEFAULT 0, -- Số buổi tập tối đa với huấn luyện viên cá nhân ( nếu có )
    `price` DOUBLE NOT NULL,
    `PT` BOOLEAN NOT NULL,
    `description` TEXT NULL,
    `discount` DOUBLE DEFAULT 0.0
);

-- Gán huấn luyện viên cho gói tập
CREATE TABLE `training_assign` (
    `package_id` BIGINT unsigned NOT NULL,
    `trainer_id` BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (`package_id`, `trainer_id`),
    FOREIGN KEY (`package_id`) REFERENCES `MembershipPackage`(`package_id`),
    FOREIGN KEY (`trainer_id`) REFERENCES `Users`(`user_id`)
);

-- Bảng hội viên đăng ký gói
CREATE TABLE `Membership` (
    `membership_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `member_id` BIGINT UNSIGNED NOT NULL,
    `trainer_id` BIGINT unsigned NULL,
    `package_id` BIGINT unsigned NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `payment_status` ENUM('Paid', 'Unpaid', 'Processing') NOT NULL,
    `pt_meeting_days_left` BIGINT DEFAULT 0, -- Số buổi tập còn lại với huấn luyện viên cá nhân
    FOREIGN KEY (`member_id`) REFERENCES `Users`(`user_id`),
    FOREIGN KEY (`trainer_id`) REFERENCES `Users`(`user_id`),
    FOREIGN KEY (`package_id`) REFERENCES `MembershipPackage`(`package_id`),
    CHECK (`end_date` > `start_date`)
);

-- Bảng feedback
CREATE TABLE `Feedback` (
    `feedback_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `member_id` BIGINT unsigned NOT NULL,
    `feedback_text` TEXT NOT NULL,
    `feedback_date` DATE NOT NULL,
    `rating` INT CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
    FOREIGN KEY (`member_id`) REFERENCES `Users`(`user_id`)
);

-- Bảng điểm danh
CREATE TABLE `Attendance` (
    `attendance_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `member_id` BIGINT unsigned NOT NULL,
    `checkin_date` TIMESTAMP NOT NULL,
    `feedback` TEXT NULL,
    FOREIGN KEY (`member_id`) REFERENCES `Users`(`user_id`)
);

-- Bảng lưu bill đã thanh toán
CREATE TABLE Accepted_bill ( 
    `bill_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `member_id` BIGINT UNSIGNED NOT NULL,
    `package_id` BIGINT unsigned NOT NULL,
    `amount` DOUBLE NOT NULL,
    `payment_date` TIMESTAMP NOT NULL,
    FOREIGN KEY (`package_id`) REFERENCES `MembershipPackage`(`package_id`),
    FOREIGN KEY (`member_id`) REFERENCES `Users`(`user_id`)
);

DELIMITER //

CREATE TRIGGER trg_set_pt_meeting_days_left
BEFORE INSERT ON Membership
FOR EACH ROW
BEGIN
  DECLARE max_days INT;

  SELECT max_pt_meeting_days
  INTO max_days
  FROM MembershipPackage
  WHERE package_id = NEW.package_id;

  SET NEW.pt_meeting_days_left = IFNULL(max_days, 0);
END;
//

DELIMITER ;


-- Thêm user
INSERT INTO Users (user_name, password, email, phone, role, created_at, fullname, address, date_of_birth) VALUES
('lauren62', '37RXs!zb&y', 'millermaria@example.net', '741-443-0610x703', 'member', '2024-12-26 10:22:33', 'George Brown', '2663 Michael Well Suite 518, Annafurt, AZ 60230', '1977-09-09'),
('vowens', '*T+4Xl1(a_', 'hbowman@example.org', '7775507568', 'member', '2024-05-20 00:48:18', 'Christopher Williams', '138 Jason Cliffs, Lake Robertport, KS 95505', '1985-05-16'),
('michaelbyrd', '0XWKeyDM*9', 'ncarlson@example.org', '+1-520-690-9528x443', 'member', '2024-02-21 23:04:39', 'Christina Powers', '222 Cox Mountain Apt. 431, Johnfort, MH 22353', '1973-03-21'),
('ubrown', 'YBX5RkY#c+', 'thomasbeth@example.net', '509-282-0470', 'member', '2024-06-08 14:35:13', 'John Barajas', '828 Cohen Underpass Apt. 439, East Andrewchester, WI 94841', '1970-12-05'),
('zwashington', '^QZ!6Tq$v@', 'mfox@example.com', '8425545354', 'member', '2024-04-21 06:22:14', 'Billy Lopez', '61644 Steven Glens Suite 720, South Stevenbury, WY 81813', '1972-01-25'),
('mwerner', 'TeyJGxId%5', 'maciasmarcia@example.net', '617-813-0664x69535', 'member', '2024-04-29 15:19:43', 'Mark Gray', '3463 Lowe Valleys, Jackburgh, CT 78172', '1968-06-04'),
('carolsanford', '+49q2IHdUg', 'palmerashley@example.net', '5012759994', 'member', '2024-02-17 05:18:07', 'Cole Reed', '418 Yang Curve, West Anthony, PR 34112', '1965-06-20'),
('kristin07', '3mlN7XIy%M', 'praymond@example.net', '634-476-3467x6223', 'member', '2024-08-26 18:35:25', 'Kenneth Taylor', '678 Ramirez Trafficway, East Trevor, MI 88118', '1969-01-14'),
('hthomas', 'F53DB#la_g', 'tonyamcbride@example.net', '(853)891-2592', 'member', '2024-01-23 02:18:30', 'Michael Chavez', '5444 Wood Springs Apt. 438, East Ann, WI 29226', '1989-08-24'),
('xandrews', '!e4OAko1sk', 'rodneyhall@example.org', '827-482-7327', 'member', '2024-04-23 08:35:15', 'Shirley Pollard', '94644 Mitchell Roads, Patriciaville, AS 15016', '1968-10-04'),
('jeanettebrown', '%P5Fz5KEI%', 'yhoffman@example.com', '328-872-5163x203', 'member', '2024-10-09 01:59:45', 'Caitlin Spears', '75342 Perez Square, East Shirley, SD 49741', '2002-09-08'),
('seth02', '#!3E_^JwQC', 'ssolomon@example.org', '+1-273-876-5729x90507', 'member', '2024-05-08 06:24:36', 'Karina Holt', 'PSC 8804, Box 5588, APO AP 89825', '1998-02-03'),
('perezamy', ')_T2WuVbms', 'brian57@example.org', '792-380-2768', 'member', '2024-04-26 01:38:46', 'Courtney Rodriguez', '373 Jonathan Place, Josephport, AZ 91033', '1973-10-18'),
('daniel34', '^Vq5OE7b9k', 'whitechristopher@example.net', '001-400-761-4430x2752', 'member', '2024-03-05 19:23:04', 'Brooke Adkins', '11145 Torres Place Suite 928, East Alicia, VT 03122', '2006-12-02'),
('petersonelizabeth', 'jo34&C!z_@', 'crojas@example.org', '3497126815', 'member', '2024-10-02 13:32:44', 'James Byrd', '997 Ricky Plaza, Jonesview, AS 21334', '1967-10-07'),
('amandamcdonald', '@4E5ogmNN5', 'jacksondeborah@example.org', '(912)882-5873', 'member', '2024-11-20 16:48:31', 'Emily Anderson', '348 Freeman Unions, North Antoniofort, VT 40073', '2000-04-27'),
('bondtravis', 'wphqPuSo(6', 'fergusoncharles@example.net', '409.472.1379', 'member', '2024-12-02 15:52:13', 'Tonya Horton', '364 Chelsea Center, Toddtown, PR 95133', '1965-01-19'),
('ryanchen', '9^)4eBm)*3', 'charlesjose@example.org', '(943)979-7649', 'member', '2024-10-19 04:52:46', 'William Castaneda', '364 Kayla Fort Apt. 189, Carterport, SC 14578', '1972-09-25'),
('pachecorichard', '!$g!3WzuQk', 'zcooper@example.com', '(641)488-5173', 'member', '2024-11-01 16:00:38', 'Brian Hayden', '8463 Robinson Mission, Normaside, AL 15348', '1976-02-24'),
('dannyrodriguez', '8%f$8qSyQp', 'sierra80@example.net', '001-410-588-9263x3726', 'member', '2024-02-24 19:36:53', 'Jeffrey Morris', '454 Emma Greens, Kevinchester, AR 79344', '2000-09-23'),
('matthew74', 'e8KQDprb+B', 'breanna16@example.org', '001-929-910-7902x30562', 'member', '2024-11-22 20:33:56', 'Amy Roman', '51528 Heather Grove, Port Jessica, TX 13936', '2000-06-23'),
('carrrobert', '9ze*8KEgnE', 'dawn02@example.org', '001-496-828-9125', 'member', '2024-04-02 13:32:53', 'Travis Ramsey', 'Unit 9121 Box 2234, DPO AA 03411', '2005-01-23'),
('brewereduardo', '*uN9$MD78W', 'williamsryan@example.com', '792-991-3349', 'member', '2024-11-07 19:47:39', 'Heather Bradley', 'PSC 2818, Box 0904, APO AE 91254', '1974-11-01'),
('rachelbowen', 'tm53aN((o^', 'pfuller@example.com', '(773)971-5423x370', 'member', '2024-01-24 03:21:44', 'Christina Kaiser', '33791 Sheena Mountain Apt. 000, North Amandaport, WA 64583', '1986-05-08'),
('jennifer73', '45x7iTgL_U', 'jeffery02@example.net', '(596)455-5444x26389', 'member', '2024-09-05 21:07:59', 'Crystal Ayers MD', '9382 Davis Island, Jacobville, MA 11132', '1995-12-10'),
('ryan80', 'oK687UOd&(', 'matthewjuarez@example.com', '+1-354-482-1176x8793', 'member', '2024-01-27 13:58:59', 'Matthew Hayden', '72650 Johnson Rapids Apt. 567, North Brittney, MH 64231', '1987-09-04'),
('fishersara', '$k&#@4NxDk', 'maria98@example.net', '(941)960-8419', 'member', '2024-06-19 12:53:58', 'Jamie Olson', '57178 Washington Shoal, Noblemouth, NM 48023', '1990-04-10'),
('chenjoseph', 'A$2mUKkM8J', 'michaelrice@example.org', '+1-845-216-5754', 'member', '2024-03-21 23:25:38', 'Gregory Pierce', '54986 Jason Path Suite 536, Reynoldsmouth, AR 31180', '1969-05-14'),
('robertryan', 'M+k0Y5iZ6@', 'phillippearson@example.net', '+1-270-724-0003x8739', 'member', '2024-02-01 09:19:37', 'Jeffrey Gomez', '515 Nathaniel Mountains, Jaredhaven, CO 45120', '1981-08-07'),
('jeffrey88', '85*6fRsW&u', 'anna73@example.com', '001-928-278-6431x2689', 'member', '2024-05-19 00:07:38', 'Cindy Hahn', '300 Ortega Streets, New Cameron, FM 56016', '1988-02-12'),
('denise36', '4@E7sq$f^4', 'sara03@example.org', '+1-354-934-3255x53382', 'member', '2024-07-06 14:54:51', 'Kyle Russell', '7987 Robinson Terrace, South Elizabethhaven, DE 49998', '1992-05-15'),
('tateseth', '+@@Q5kiD21', 'matthewholmes@example.net', '457-514-3646x230', 'member', '2024-04-21 17:11:38', 'Cody Kelly', '12724 Leroy Stravenue Apt. 614, West Denise, IL 45233', '2000-10-21'),
('nicole72', 'e_1icaTMMr', 'brandi31@example.com', '361.780.3220', 'member', '2024-12-26 22:08:30', 'Adrian Miller', '15293 Alisha Manor Suite 419, Rogersside, WI 16911', '1975-02-21'),
('floreshoward', '%Q7At6$bZX', 'john77@example.net', '(849)999-7858', 'member', '2024-11-30 08:40:09', 'Cheryl Wallace', '10875 Joseph Prairie, Williamburgh, WY 09330', '1998-07-30'),
('patriciaharris', '6w)JDG5l#2', 'aaronjohnson@example.org', '+1-341-764-2224x5379', 'member', '2024-12-24 22:05:00', 'Beth Miller', 'USNS Macias, FPO AE 63262', '1980-07-22'),
('leeian', 'i+4YQn(_%6', 'regina85@example.net', '863.428.5176x3989', 'member', '2024-11-26 15:45:29', 'Alicia Charles', '01314 Martin Lake Apt. 219, Clarkport, MN 04050', '2005-02-26'),
('barbarajarvis', ')7FPCC^Mxp', 'edwardsholly@example.net', '+1-602-339-1434x054', 'member', '2024-01-15 07:36:32', 'Ian Stephenson', '1843 Reynolds Mountains Suite 684, North Alexanderstad, WV 02125', '2005-12-23'),
('kylegillespie', 'I92bAkbGY_', 'andrewtodd@example.org', '9672271671', 'member', '2024-04-05 12:40:39', 'Curtis Gonzalez', '42486 Ellen Neck, New Mitchellshire, PW 82150', '1965-08-26'),
('joshua73', '+I9OyGuBbU', 'david57@example.net', '(355)712-1960x77271', 'member', '2024-01-18 09:37:07', 'Dr. Lauren Harris', '963 Justin Trail Apt. 695, Lake Michael, FL 17541', '1965-09-02'),
('davilagregory', '46b$A7Qi_d', 'gmiller@example.org', '+1-664-752-4340x680', 'member', '2024-03-18 18:29:41', 'Heather Smith', '585 Sarah Point Suite 130, East Matthew, WA 66282', '1974-09-07'),
('fmullen', 'I3Nn2QqFE*', 'cooperamber@example.com', '782.861.4589x99024', 'member', '2024-09-11 22:44:32', 'Eric Davis', '239 Brown Land, Lake Howard, NY 14187', '2003-10-12'),
('jle', '#1YES8Jzol', 'wesley93@example.com', '854-493-9604x43758', 'member', '2024-10-04 14:20:44', 'Desiree Ford', '94597 Wilson Hill, Smithtown, MP 37832', '1972-01-16'),
('alvarezvincent', 'Tu)foWxe^9', 'samanthamartin@example.com', '(710)811-6770x1160', 'member', '2024-11-11 05:05:12', 'Jennifer Thompson', '85271 Dustin Underpass, Port Lesliemouth, MI 66068', '1978-09-10'),
('pgardner', 'rs$7QAWkH6', 'burgessjames@example.com', '519.390.0612x661', 'member', '2024-04-25 06:19:19', 'David Doyle', '15263 David Avenue, Edwardfort, NY 81214', '2006-08-24'),
('rhondamartinez', '_v2M1bBe#j', 'glee@example.org', '307-572-7432x19854', 'member', '2024-04-18 19:48:40', 'Jessica Miller', '71295 Garner Junction, Lucasberg, ID 05779', '1997-03-20'),
('uwalker', '#(Z1Uu5xKE', 'imills@example.net', '799-789-4609x49262', 'member', '2024-09-14 20:44:41', 'Derek Mcdaniel', '920 Bradley Ville, East Edwardport, NV 41481', '2002-09-18'),
('william20', '%0f@e^Q*p#', 'hmoreno@example.org', '7553983373', 'member', '2024-01-03 10:05:03', 'Christine Clark', '3777 Newman Manor, Taylorberg, WY 11121', '1989-09-09'),
('eileen34', '397ogDby!f', 'patrickbailey@example.org', '001-296-503-9537', 'member', '2024-07-07 04:13:37', 'Richard Sanders', '49770 Miller Manors, Proctorstad, MN 48249', '1975-07-27'),
('ghughes', '@_3lI835&y', 'tracy85@example.org', '851.530.1585x8951', 'member', '2024-12-16 17:26:22', 'Alicia Beard', '76064 Adams Mills, West Michael, SC 41108', '1980-09-03'),
('jessicastewart', 'VAc3yBiX@k', 'garrisonjames@example.com', '001-220-655-2271x786', 'member', '2024-11-09 18:38:29', 'Kristen Lopez', '501 Monica Lake Suite 113, Port Jennifermouth, TN 17377', '2006-03-16'),
('teresa17', '(PgmZZb7)7', 'franciscorasmussen@example.com', '+1-751-754-9053x0679', 'trainer', '2024-07-16 20:30:11', 'Daniel Peterson', '9176 Julian Divide, New Troyville, VI 41904', '1991-04-17'),
('nunezbeth', '(77L!Pdrce', 'heather54@example.com', '001-859-415-1071x4804', 'trainer', '2024-02-07 09:25:03', 'Jason Hughes', '5159 Anthony Spur, Reynoldsmouth, RI 11303', '1976-05-02'),
('brittneyscott', 'Q6MW0Pgzw^', 'hollymcintyre@example.com', '+1-238-347-0368x5899', 'trainer', '2024-07-29 01:29:43', 'Dawn Bright', '65348 Hawkins Street Apt. 347, South Russellton, NJ 79964', '2007-05-14'),
('alicia30', '(9EEJ6dvsc', 'carol73@example.com', '(284)275-8728x09514', 'trainer', '2024-02-03 21:06:03', 'Michael Higgins', '2694 Gabrielle Fort Suite 481, Lake Eduardofurt, WV 60348', '1987-09-04'),
('heidiho', 'P$i6Ffo0T%', 'allenwalter@example.net', '001-646-602-4516x84839', 'trainer', '2024-06-06 17:04:19', 'Christopher Moore', '282 West Lodge Apt. 769, New Robert, VI 60012', '1977-01-27'),
('wallerpatricia', '+r&vFWwj80', 'brianbrennan@example.com', '+1-391-204-1983x1064', 'trainer', '2024-01-24 00:48:57', 'Ann Garza', '1126 Gomez Well Suite 348, South Michael, GU 10676', '1987-11-04'),
('msnyder', '&BUp&clh6B', 'dmills@example.com', '001-468-867-9424x4960', 'trainer', '2024-01-07 04:02:26', 'Wendy Gomez', '4476 Wilson Ranch Suite 227, Port Christopherstad, MO 98455', '1997-06-28'),
('watersjerry', '+oP)Pmf4&3', 'xwheeler@example.net', '8604111569', 'trainer', '2024-05-18 08:59:55', 'Anthony Clark', '073 Davis Extension, Lake Derek, OK 35407', '1980-01-29'),
('xking', 'C%N6Iru9E!', 'heather37@example.net', '+1-880-261-5215x02407', 'trainer', '2024-08-31 06:16:21', 'Craig Walker', '46169 Emma Camp Suite 913, New Michaelbury, WA 63866', '2002-10-17'),
('paul83', '$aON8XYGq3', 'christinescott@example.com', '336.633.8835x373', 'trainer', '2024-03-31 21:04:05', 'Samantha Schmitt', 'PSC 1122, Box 7447, APO AE 85573', '1974-03-04'),
('tmerritt', 'D8y5snOyL+', 'xnovak@example.org', '787.795.7724x27467', 'trainer', '2024-02-15 07:07:13', 'Linda Davila', '010 Christopher Via Apt. 539, Lake Angela, PR 58231', '1994-12-04'),
('doyletonya', '6kWMRjl8+9', 'laura15@example.org', '001-507-208-5334x198', 'trainer', '2024-09-01 05:46:05', 'Sandra Guzman', '6257 Fry Trail Suite 922, Lake Travisfurt, MA 19398', '2002-06-11'),
('carrjeffrey', '2y23OySdK^', 'phillipslindsey@example.net', '(455)516-3128', 'trainer', '2024-09-26 11:54:18', 'Whitney Dixon', '96644 Hood Mission Apt. 472, Laneland, TN 90126', '2003-06-15'),
('huertamichael', '(6EGbqhV#6', 'brooksmariah@example.org', '962.571.6489', 'trainer', '2024-08-04 14:57:49', 'Martin Meyer', '3450 Cortez Manor Apt. 293, Virginiaside, SC 82679', '1968-06-25'),
('kurtwheeler', 'dx^_6JFa$X', 'angelica93@example.com', '(843)970-6619', 'trainer', '2024-10-30 20:10:38', 'Michael Tate', '2274 Hart Extensions Apt. 025, Nancyfurt, WI 33356', '1969-05-17'),
('lesliewilliams', '&4Smjgxu1n', 'kennethhanson@example.net', '(537)330-3355x24661', 'trainer', '2024-10-23 06:53:45', 'Michael Park', '92360 Ballard Row Suite 272, Aguilarton, WI 38359', '2001-08-17'),
('dominic90', 'cPBFV#f^@0', 'teresaquinn@example.org', '+1-505-958-7376x105', 'trainer', '2024-11-05 21:58:37', 'Megan Reyes', 'Unit 1632 Box 8823, DPO AA 28890', '1984-04-15'),
('jeffreymartinez', '$v6M4Epm1s', 'dglenn@example.net', '411-536-1018', 'trainer', '2024-01-27 00:33:04', 'Nicole Petersen', '3404 Yolanda Common Suite 780, Coreyfurt, DE 10524', '1969-04-09'),
('jwright', 'jKA7$Jug*1', 'lozanochristopher@example.net', '784-456-4832x3397', 'trainer', '2024-06-29 21:06:44', 'John Sanchez', '72099 Brown Ramp Apt. 173, Hubbardton, CT 72480', '1992-06-21'),
('michaela42', '#ifE)aWe46', 'georgejacobs@example.com', '6292683344', 'trainer', '2024-04-17 19:43:10', 'Mary King', 'PSC 6785, Box 3248, APO AE 67407', '1990-10-06'),
('ysimon', '!sTvLwQ3P5', 'rosesara@example.net', '(727)788-0842x979', 'receptionist', '2024-05-27 00:34:21', 'Melinda King', '311 Baker Dale Suite 325, New Yvonne, OH 08903', '1997-12-12'),
('stephengarcia', '^I#8^e9rv0', 'ngaines@example.org', '470-434-5681x522', 'receptionist', '2024-05-02 01:54:26', 'Amy Alvarado', 'PSC 9272, Box 9351, APO AP 78642', '1969-06-04'),
('sthompson', 'X(E7Nbi&6T', 'bjacobson@example.net', '+1-884-281-3590x679', 'receptionist', '2024-12-22 06:31:09', 'Christina Michael', '1912 Noah Lock, Kennethport, GU 03728', '1978-05-07'),
('randyherrera', ')bUQ7nz21g', 'jamesgordon@example.net', '(463)916-3407x26896', 'receptionist', '2024-11-17 01:35:07', 'Sara Burns', '39030 Darin Track Suite 731, East Joseside, MP 78961', '1996-07-02'),
('phillipsabigail', '*8YNsFYj0W', 'pollardtiffany@example.net', '+1-762-294-5037x258', 'receptionist', '2024-12-20 01:30:35', 'Andrew Marquez', '916 Myers Passage Apt. 522, Kevinmouth, MA 21905', '1979-04-26'),
('john04', '5lGr2R@i((', 'zmiller@example.com', '393-520-2970x8435', 'receptionist', '2024-11-09 17:03:14', 'William Lee', '98693 Hunter Vista Suite 171, North Joseville, PR 76397', '1974-03-26'),
('tlopez', '*aHL@_Zr8(', 'williamgoodman@example.com', '001-522-481-8770x78855', 'receptionist', '2024-02-06 22:00:59', 'Casey Patterson Jr.', '2388 Johnson Trail, Thomasberg, PW 14911', '1966-09-03'),
('pamela42', 'Gi7hQpoY^3', 'amanda94@example.net', '7123975336', 'receptionist', '2024-04-26 07:18:34', 'Nicholas Buck', '9131 Joseph Curve, Lisaland, MS 01123', '1985-02-08'),
('hilljenny', '(WJx6hMkKm', 'kimberlyschultz@example.com', '968-933-9115x700', 'receptionist', '2024-12-24 10:30:19', 'Mark Myers', '4704 Linda Heights, Schultzmouth, CA 80108', '1973-03-06'),
('marcher', 'q&^9CU636h', 'mitchellkaren@example.org', '542-273-5687x53137', 'receptionist', '2024-07-11 13:20:25', 'Richard Lowe', '5015 Gonzalez Stravenue Apt. 996, Phillipsborough, PR 89451', '1992-08-26'),
('hernandezsarah', '%Nc9P!cVtg', 'oanderson@example.com', '001-290-371-3943', 'admin', '2024-03-27 09:54:18', 'Michael Gates', '765 Thomas Fort Suite 901, North Angel, AZ 20004', '2000-10-11'),
('dmurray', '6b5^ZKAJs_', 'padilladerrick@example.org', '(425)863-4517', 'admin', '2024-02-13 23:37:22', 'Stacey Jones', '4179 Haley Wells, Lanemouth, WI 11471', '1987-02-04');

-- Thêm phòng tập
INSERT INTO Rooms (room_name, room_type, status)
VALUES 
('Strength Zone', 'Strength', 'Available'),
('Yoga Paradise', 'Flexibility', 'Available'),
('Cardio Blast', 'Cardio', 'Available'),
('HIIT Arena', 'HIIT', 'Available'),
('Functional Zone', 'Functional Training', 'Available');


INSERT INTO Equipments (equipment_name, quantity, manufacturer, room_id, price, status, notes)
VALUES 
-- Room 1: Strength Zone
('Bench Press', 4, 'Hammer Strength', 1, 1500.00, 'Available', 'For chest workouts'),
('Dumbbell Set', 10, 'Rogue', 1, 800.00, 'Available', '5kg to 40kg'),
('Barbell Set', 6, 'Eleiko', 1, 1200.00, 'Available', 'Olympic set'),
('Squat Rack', 3, 'Rogue', 1, 1100.00, 'Available', 'Heavy-duty rack'),
('Lat Pulldown', 2, 'Hoist', 1, 1300.00, 'Available', 'Back muscle training'),
('Leg Press Machine', 2, 'Cybex', 1, 2000.00, 'Available', 'Lower body focus'),
('Cable Crossover', 2, 'Matrix', 1, 2500.00, 'Available', 'Multi-angle training'),
('Chest Press Machine', 3, 'Life Fitness', 1, 1400.00, 'Available', 'Isolated chest workout'),
('Hack Squat', 2, 'Body Solid', 1, 1800.00, 'Available', 'Leg workout'),
('Pull-up Bar Station', 2, 'Rogue', 1, 300.00, 'Available', 'Upper body strength'),

-- Room 2: Yoga Paradise
('Yoga Mats', 20, 'Manduka', 2, 25.00, 'Available', 'Eco-friendly'),
('Yoga Blocks', 20, 'Liforme', 2, 15.00, 'Available', 'Support poses'),
('Bolsters', 10, 'Gaiam', 2, 30.00, 'Available', 'Comfort in stretches'),
('Meditation Cushions', 10, 'Bean Products', 2, 35.00, 'Available', 'For meditation'),
('Foam Rollers', 10, 'TriggerPoint', 2, 20.00, 'Available', 'Muscle recovery'),
('Resistance Bands', 15, 'TheraBand', 2, 10.00, 'Available', 'Flexibility training'),
('Straps', 12, 'Reehut', 2, 12.00, 'Available', 'Stretch assistance'),
('Balance Pads', 10, 'Airex', 2, 45.00, 'Available', 'Core stability'),
('Aroma Diffuser', 2, 'Urpower', 2, 50.00, 'Available', 'Relaxation scent'),
('Yoga Wheels', 8, 'UpCircleSeven', 2, 35.00, 'Available', 'Back stretching'),

-- Room 3: Cardio Blast
('Treadmill', 5, 'NordicTrack', 3, 2000.00, 'Available', 'Incline feature'),
('Elliptical Machine', 5, 'ProForm', 3, 1800.00, 'Available', 'Low impact'),
('Stationary Bike', 5, 'Peloton', 3, 2500.00, 'Available', 'Interactive display'),
('Rowing Machine', 4, 'Concept2', 3, 1200.00, 'Available', 'Full-body cardio'),
('Stair Climber', 2, 'StairMaster', 3, 3000.00, 'Available', 'High-intensity'),
('Spin Bike', 5, 'Schwinn', 3, 1100.00, 'Available', 'Compact design'),
('Heart Rate Monitor', 10, 'Polar', 3, 100.00, 'Available', 'Wearable'),
('Fan Bike', 3, 'Assault', 3, 1300.00, 'Available', 'Air resistance'),
('Step Platforms', 10, 'Reebok', 3, 50.00, 'Available', 'Step aerobics'),
('Speed Ropes', 10, 'RPM', 3, 30.00, 'Available', 'High-speed skipping'),

-- Room 4: HIIT Arena
('Battle Ropes', 6, 'Onnit', 4, 120.00, 'Available', 'Cardio & strength'),
('Slam Balls', 10, 'Titan Fitness', 4, 60.00, 'Available', 'Explosive training'),
('Kettlebells', 10, 'Rogue', 4, 600.00, 'Available', 'Various weights'),
('Jump Boxes', 6, 'Rep Fitness', 4, 150.00, 'Available', 'Plyo exercises'),
('Agility Ladder', 5, 'SKLZ', 4, 30.00, 'Available', 'Speed drills'),
('Wall Balls', 10, 'Rogue', 4, 70.00, 'Available', 'Core and power'),
('TRX Suspension', 4, 'TRX', 4, 250.00, 'Available', 'Bodyweight training'),
('Sandbags', 6, 'Brute Force', 4, 90.00, 'Available', 'Functional strength'),
('Speed Sleds', 2, 'Rogue', 4, 350.00, 'Available', 'Sprint resistance'),
('Resistance Parachutes', 5, 'SKLZ', 4, 40.00, 'Available', 'Sprint training'),

-- Room 5: Functional Zone
('Functional Trainer', 2, 'Life Fitness', 5, 3500.00, 'Available', 'Cable system'),
('Medicine Balls', 10, 'Dynamax', 5, 75.00, 'Available', 'Core work'),
('Kettlebell Rack', 1, 'Rogue', 5, 500.00, 'Available', 'Storage unit'),
('Bosu Balls', 5, 'BOSU', 5, 100.00, 'Available', 'Balance and core'),
('Core Bags', 6, 'Jordan', 5, 80.00, 'Available', 'Dynamic movement'),
('Power Bands', 12, 'Iron Bull', 5, 20.00, 'Available', 'Resistance training'),
('Balance Discs', 6, 'Black Mountain', 5, 25.00, 'Available', 'Stability drills'),
('Mini Hurdles', 10, 'SKLZ', 5, 15.00, 'Available', 'Agility work'),
('Landmine Attachment', 2, 'Rogue', 5, 90.00, 'Available', 'Barbell variation'),
('Adjustable Stepper', 4, 'Reebok', 5, 85.00, 'Available', 'Height variations');


-- Tạo gói tập
INSERT INTO `MembershipPackage` 
(`package_name`, `duration`, `max_pt_meeting_days`, `price`, `PT`, `description`, `discount`)
VALUES
-- 1 tháng
('Basic Monthly', 30, NULL, 500000, FALSE, 
 'Gói tập 1 tháng cơ bản, phù hợp cho người mới bắt đầu. Bao gồm quyền truy cập không giới hạn vào phòng gym và các lớp học cơ bản. Không bao gồm huấn luyện viên cá nhân.', 
 0.0),

('Basic Monthly with PT', 30, 4, 800000, TRUE, 
 'Gói tập 1 tháng bao gồm 4 buổi huấn luyện với huấn luyện viên cá nhân. Phù hợp với người cần hướng dẫn ban đầu. Bao gồm toàn bộ tiện ích phòng tập và lớp học.', 
 0.0),

-- 3 tháng
('Standard Quarterly', 90, NULL, 1350000, FALSE, 
 'Gói tập 3 tháng tiết kiệm, giúp bạn xây dựng thói quen tập luyện đều đặn. Bao gồm truy cập không giới hạn phòng tập, lớp học nhóm và tư vấn dinh dưỡng cơ bản. Không có huấn luyện viên cá nhân.', 
 0.0),

('Standard Quarterly with PT', 90, 12, 1800000, TRUE, 
 'Gói tập 3 tháng có 12 buổi tập với huấn luyện viên cá nhân. Phù hợp với người muốn cải thiện hình thể có định hướng. Bao gồm đầy đủ tiện ích và đang được giảm giá 10%.', 
 0.1),

-- 6 tháng
('Advanced Semi-Annual', 180, NULL, 2400000, FALSE, 
 'Gói tập 6 tháng nâng cao, lý tưởng để duy trì sức khỏe lâu dài. Bao gồm toàn bộ tiện ích phòng tập, lớp học nâng cao, và quyền ưu tiên đặt lịch.', 
 0.0),

('Advanced Semi-Annual with PT', 180, 24, 3200000, TRUE, 
 'Gói tập 6 tháng với 24 buổi cùng huấn luyện viên cá nhân. Lý tưởng cho người muốn theo đuổi mục tiêu thể hình nghiêm túc. Ưu đãi giảm 15%, bao gồm toàn bộ tiện ích cao cấp.', 
 0.15),

-- 12 tháng
('Premium Annual', 360, NULL, 4200000, FALSE, 
 'Gói tập 12 tháng cao cấp không huấn luyện viên, tối ưu cho người tập lâu dài. Bao gồm tất cả tiện ích phòng tập, lớp học không giới hạn và quyền ưu tiên.', 
 0.0),

('Premium Annual with PT', 360, 48, 5800000, TRUE, 
 'Gói tập 12 tháng cao cấp với 48 buổi huấn luyện viên cá nhân, hỗ trợ toàn diện từ luyện tập đến dinh dưỡng. Dành cho người cam kết lâu dài và cần hỗ trợ chuyên sâu.', 
 0.0);


INSERT INTO training_assign (package_id, trainer_id)
VALUES

-- Gói 2
(2, 57), (2, 58), (2, 59), (2, 60), (2, 61), (2, 62), (2, 63), (2, 64), (2, 65),

-- Gói 4
(4, 69), (4, 70), (4, 51), (4, 52), (4, 53), (4, 54), (4, 55), (4, 56), (4, 57), (4, 58),

-- Gói 6
(6, 61), (6, 62), (6, 63), (6, 64), (6, 65), (6, 66), (6, 67), (6, 68), (6, 69), (6, 70),

-- Gói 8
(8, 53), (8, 54), (8, 55), (8, 56), (8, 57), (8, 58), (8, 59), (8, 60), (8, 61), (8, 62);


INSERT INTO Feedback (member_id, feedback_text, feedback_date, rating) VALUES
(40, 'Nhân viên lễ tân thân thiện, hỗ trợ tốt.', '2024-03-12', 4),
(48, 'Các lớp học đa dạng và phù hợp với mọi trình độ.', '2024-05-01', 4),
(9, 'Tôi rất hài lòng với chất lượng huấn luyện.', '2024-06-29', 4),
(24, 'Giá cả hợp lý, đáng đồng tiền bát gạo.', '2024-03-19', 4),
(10, 'Tôi rất hài lòng với chất lượng huấn luyện.', '2024-08-29', 3),
(47, 'Huấn luyện viên rất nhiệt tình và tận tâm.', '2024-09-11', 4),
(21, 'Các lớp học đa dạng và phù hợp với mọi trình độ.', '2024-11-16', 3),
(39, 'Phòng tập rất sạch sẽ và thoáng mát.', '2024-04-21', 5),
(18, 'Không gian tập luyện thoải mái, nhiều thiết bị hiện đại.', '2024-05-07', 5),
(28, 'Huấn luyện viên rất nhiệt tình và tận tâm.', '2024-05-29', 4),
(32, 'Nhân viên lễ tân thân thiện, hỗ trợ tốt.', '2024-03-23', 5),
(20, 'Huấn luyện viên rất nhiệt tình và tận tâm.', '2024-03-19', 5),
(7, 'Dịch vụ đăng ký nhanh chóng, tiện lợi.', '2024-11-27', 4),
(39, 'Cần cải thiện thêm về khu vực thay đồ.', '2024-01-08', 3),
(5, 'Cần cải thiện thêm về khu vực thay đồ.', '2024-05-15', 3),
(4, 'Dịch vụ đăng ký nhanh chóng, tiện lợi.', '2024-04-25', 4),
(6, 'Nhân viên lễ tân thân thiện, hỗ trợ tốt.', '2024-12-13', 5),
(46, 'Không gian tập luyện thoải mái, nhiều thiết bị hiện đại.', '2024-06-19', 5),
(30, 'Không gian tập luyện thoải mái, nhiều thiết bị hiện đại.', '2024-08-18', 4),
(47, 'Không gian tập luyện thoải mái, nhiều thiết bị hiện đại.', '2024-09-09', 5),
(44, 'Nhân viên lễ tân thân thiện, hỗ trợ tốt.', '2024-05-15', 4),
(13, 'Thời gian mở cửa linh hoạt, rất tiện lợi.', '2024-01-19', 5),
(33, 'Nhân viên lễ tân thân thiện, hỗ trợ tốt.', '2024-07-16', 5),
(33, 'Cần cải thiện thêm về khu vực thay đồ.', '2024-08-26', 5),
(1, 'Dịch vụ đăng ký nhanh chóng, tiện lợi.', '2024-11-29', 4),
(47, 'Huấn luyện viên rất nhiệt tình và tận tâm.', '2024-01-23', 4),
(11, 'Tôi rất hài lòng với chất lượng huấn luyện.', '2024-07-12', 5),
(30, 'Giá cả hợp lý, đáng đồng tiền bát gạo.', '2024-02-25', 5),
(43, 'Phòng tập rất sạch sẽ và thoáng mát.', '2024-04-12', 5),
(39, 'Huấn luyện viên rất nhiệt tình và tận tâm.', '2024-10-21', 5);


INSERT INTO Attendance (member_id, checkin_date, feedback) VALUES
(1, NOW(), 'Tập luyện rất tốt, giữ vững phong độ.'),
(2, NOW(), 'Cần chú ý tư thế tập để tránh chấn thương.'),
(3, NOW(), 'Buổi tập hiệu quả, nâng cao sức bền.'),
(4, NOW(), 'Cố gắng tăng cường tập cardio.'),
(5, NOW(), 'Tập tạ với kỹ thuật tốt, tiếp tục phát huy.'),
(6, NOW(), 'Động tác chưa chuẩn, cần sửa lại.'),
(7, NOW(), 'Giữ thói quen tập đều đặn.'),
(8, NOW(), 'Tinh thần tập luyện rất tốt.'),
(9, NOW(), 'Cần cải thiện nhịp thở khi tập.'),
(10, NOW(), 'Sức khỏe được cải thiện rõ rệt.'),
(11, NOW(), 'Tư thế squat rất chuẩn.'),
(12, NOW(), 'Cần nghỉ ngơi hợp lý hơn để hồi phục.'),
(13, NOW(), 'Tập luyện chăm chỉ, đáng khen.'),
(14, NOW(), 'Nên bổ sung thêm dinh dưỡng hợp lý.'),
(15, NOW(), 'Thái độ tích cực khi tập luyện.'),
(16, NOW(), 'Buổi tập rất vui và hiệu quả.'),
(17, NOW(), 'Giữ vững động lực và kiên trì.'),
(18, NOW(), 'Động tác deadlift cần điều chỉnh.'),
(19, NOW(), 'Tập luyện đúng giáo án.'),
(20, NOW(), 'Cơ bắp phát triển rõ rệt.'),
(21, NOW(), 'Nên tăng dần cường độ tập.'),
(22, NOW(), 'Thời gian tập phù hợp với lịch cá nhân.'),
(23, NOW(), 'Tinh thần tốt, giữ vững nhé.'),
(24, NOW(), 'Chú ý an toàn khi tập các bài khó.'),
(25, NOW(), 'Cần giữ tư thế chuẩn khi tập.'),
(26, NOW(), 'Buổi tập hiệu quả và thú vị.'),
(27, NOW(), 'Tập trung hơn khi tập cardio.'),
(28, NOW(), 'Tăng cường cơ core để tránh đau lưng.'),
(29, NOW(), 'Thời gian nghỉ hợp lý, rất tốt.'),
(30, NOW(), 'Cố gắng duy trì đều đặn mỗi ngày.'),
(31, NOW(), 'Kỹ thuật tập tạ rất tốt.'),
(32, NOW(), 'Giữ vững phong độ từng buổi.'),
(33, NOW(), 'Cần bổ sung nước đầy đủ khi tập.'),
(34, NOW(), 'Động tác kéo xà tiến bộ rõ rệt.'),
(35, NOW(), 'Tập luyện đều đặn giúp tăng sức bền.'),
(36, NOW(), 'Chăm sóc cơ thể đúng cách sau tập.'),
(37, NOW(), 'Tinh thần rất tích cực và chủ động.'),
(38, NOW(), 'Cần nghỉ ngơi khi thấy mệt.'),
(39, NOW(), 'Tập luyện chăm chỉ, rất tốt.'),
(40, NOW(), 'Động lực tập luyện ngày càng cao.');


INSERT INTO Membership (member_id, trainer_id, package_id, start_date, end_date, payment_status, pt_meeting_days_left) VALUES
(6, 61, 6, '2025-04-12', '2025-10-09', 'Paid', 20),
(34, NULL, 5, '2024-05-06', '2024-11-02', 'Unpaid', 0),
(4, NULL, 1, '2024-02-27', '2024-03-28', 'Unpaid', 0),
(48, NULL, 3, '2025-01-04', '2025-04-04', 'Paid', 0),
(5, NULL, 1, '2024-05-31', '2024-06-30', 'Paid', 0),
(35, 51, 6, '2025-04-26', '2025-10-23', 'Paid', 14),
(24, 65, 4, '2024-03-13', '2024-06-11', 'Paid', 10),
(29, NULL, 1, '2025-03-09', '2025-04-08', 'Processing', 0),
(20, 66, 8, '2024-05-07', '2025-05-02', 'Processing', 34),
(2, NULL, 3, '2024-11-09', '2025-02-07', 'Unpaid', 0),
(14, NULL, 7, '2024-05-24', '2025-05-19', 'Paid', 0),
(26, 58, 8, '2024-03-29', '2025-03-24', 'Processing', 23),
(36, NULL, 1, '2024-11-20', '2024-12-20', 'Processing', 0),
(44, NULL, 3, '2024-04-25', '2024-07-24', 'Processing', 0),
(15, NULL, 5, '2024-03-03', '2024-08-30', 'Unpaid', 0),
(43, NULL, 1, '2024-04-01', '2024-05-01', 'Processing', 0),
(14, 65, 4, '2024-03-05', '2024-06-03', 'Unpaid', 3),
(22, 57, 6, '2024-10-12', '2025-04-10', 'Paid', 10),
(43, 59, 4, '2024-12-20', '2025-03-20', 'Processing', 8),
(10, NULL, 7, '2024-04-22', '2025-04-17', 'Unpaid', 0),
(32, NULL, 5, '2025-02-13', '2025-08-12', 'Unpaid', 0),
(24, NULL, 5, '2024-02-21', '2024-08-19', 'Unpaid', 0),
(4, 51, 2, '2024-02-14', '2024-03-15', 'Paid', 4),
(28, NULL, 1, '2024-03-02', '2024-04-01', 'Paid', 0),
(17, 51, 4, '2024-12-18', '2025-03-18', 'Unpaid', 4),
(20, 62, 2, '2024-03-08', '2024-04-07', 'Unpaid', 0),
(14, NULL, 1, '2024-04-28', '2024-05-28', 'Processing', 0),
(30, NULL, 1, '2025-05-23', '2025-06-22', 'Paid', 0),
(30, 54, 2, '2025-01-21', '2025-02-20', 'Processing', 1),
(11, 61, 6, '2024-08-24', '2025-02-20', 'Paid', 19),
(42, 64, 4, '2024-02-04', '2024-05-04', 'Unpaid', 0),
(3, NULL, 7, '2025-04-25', '2026-04-20', 'Unpaid', 0),
(9, NULL, 5, '2024-11-16', '2025-05-15', 'Unpaid', 0),
(4, NULL, 1, '2025-03-03', '2025-04-02', 'Unpaid', 0),
(28, 63, 2, '2024-12-27', '2025-01-26', 'Paid', 3),
(31, NULL, 5, '2025-03-07', '2025-09-03', 'Processing', 0),
(35, 54, 8, '2024-04-14', '2025-04-09', 'Paid', 35),
(32, 70, 8, '2025-03-01', '2026-02-24', 'Unpaid', 36),
(43, 57, 8, '2024-04-21', '2025-04-16', 'Processing', 8),
(45, 64, 4, '2024-01-20', '2024-04-19', 'Unpaid', 6),
(38, NULL, 1, '2024-01-23', '2024-02-22', 'Processing', 0),
(48, NULL, 7, '2024-02-02', '2025-01-27', 'Paid', 0),
(36, 51, 2, '2024-12-15', '2025-01-14', 'Paid', 4),
(49, 59, 2, '2024-01-04', '2024-02-03', 'Paid', 4),
(42, 63, 4, '2024-02-13', '2024-05-13', 'Paid', 2),
(47, NULL, 7, '2024-09-21', '2025-09-16', 'Unpaid', 0),
(12, NULL, 7, '2025-01-01', '2025-12-27', 'Paid', 0),
(46, NULL, 5, '2024-07-07', '2025-01-03', 'Unpaid', 0),
(27, NULL, 7, '2025-05-07', '2026-05-02', 'Processing', 0),
(41, NULL, 3, '2024-06-24', '2024-09-22', 'Processing', 0),
(41, NULL, 1, '2024-09-15', '2024-10-15', 'Paid', 0),
(36, 57, 6, '2024-02-12', '2024-08-10', 'Paid', 15),
(11, NULL, 3, '2024-11-01', '2025-01-30', 'Paid', 0),
(35, 61, 6, '2024-08-20', '2025-02-16', 'Unpaid', 5),
(20, NULL, 5, '2024-01-07', '2024-07-05', 'Processing', 0),
(47, 61, 2, '2024-12-10', '2025-01-09', 'Processing', 4),
(31, 63, 8, '2024-03-16', '2025-03-11', 'Paid', 43),
(22, NULL, 5, '2024-10-10', '2025-04-08', 'Unpaid', 0),
(42, 62, 8, '2024-01-24', '2025-01-18', 'Unpaid', 7),
(17, 56, 6, '2024-06-09', '2024-12-06', 'Unpaid', 10),
(24, NULL, 1, '2024-06-14', '2024-07-14', 'Processing', 0),
(22, NULL, 1, '2024-04-08', '2024-05-08', 'Processing', 0),
(25, NULL, 5, '2025-04-27', '2025-10-24', 'Processing', 0),
(31, 69, 2, '2025-05-28', '2025-06-27', 'Unpaid', 0),
(32, NULL, 7, '2025-03-30', '2026-03-25', 'Processing', 0),
(2, 61, 6, '2025-03-18', '2025-09-14', 'Paid', 4),
(32, 59, 6, '2024-08-21', '2025-02-17', 'Paid', 11),
(49, NULL, 1, '2024-06-30', '2024-07-30', 'Paid', 0),
(28, 67, 8, '2025-03-15', '2026-03-10', 'Unpaid', 35),
(22, NULL, 1, '2024-11-11', '2024-12-11', 'Unpaid', 0),
(31, 60, 6, '2024-07-05', '2025-01-01', 'Unpaid', 14),
(49, 63, 6, '2024-09-19', '2025-03-18', 'Paid', 11),
(33, 64, 2, '2024-03-07', '2024-04-06', 'Processing', 4),
(8, NULL, 1, '2025-05-18', '2025-06-17', 'Paid', 0),
(36, 53, 8, '2024-05-17', '2025-05-12', 'Paid', 7),
(6, 58, 6, '2024-11-18', '2025-05-17', 'Processing', 20),
(36, NULL, 7, '2025-03-03', '2026-02-26', 'Unpaid', 0),
(39, NULL, 3, '2024-02-01', '2024-05-01', 'Processing', 0),
(4, NULL, 1, '2024-05-20', '2024-06-19', 'Unpaid', 0),
(39, NULL, 7, '2025-04-17', '2026-04-12', 'Paid', 0),
(6, 51, 4, '2024-05-09', '2024-08-07', 'Unpaid', 12),
(12, 54, 2, '2024-06-30', '2024-07-30', 'Paid', 4),
(2, 59, 4, '2025-04-23', '2025-07-22', 'Paid', 7),
(35, 58, 2, '2025-02-11', '2025-03-13', 'Paid', 2),
(6, NULL, 1, '2024-05-14', '2024-06-13', 'Processing', 0),
(14, 67, 2, '2024-12-08', '2025-01-07', 'Processing', 4),
(32, NULL, 1, '2025-04-02', '2025-05-02', 'Paid', 0),
(49, 56, 4, '2024-07-19', '2024-10-17', 'Processing', 1),
(44, NULL, 3, '2024-07-09', '2024-10-07', 'Paid', 0),
(26, 67, 8, '2024-10-30', '2025-10-25', 'Unpaid', 0),
(20, 62, 2, '2025-02-14', '2025-03-16', 'Unpaid', 2),
(23, 69, 2, '2024-01-03', '2024-02-02', 'Paid', 2),
(3, 52, 4, '2024-07-03', '2024-10-01', 'Processing', 6),
(43, 68, 6, '2024-10-23', '2025-04-21', 'Paid', 1),
(9, NULL, 7, '2025-03-24', '2026-03-19', 'Paid', 0),
(2, NULL, 5, '2024-03-11', '2024-09-07', 'Processing', 0),
(6, 54, 4, '2024-06-13', '2024-09-11', 'Unpaid', 2),
(13, 54, 8, '2024-04-11', '2025-04-06', 'Processing', 13),
(5, 58, 6, '2024-08-19', '2025-02-15', 'Paid', 22),
(50, 58, 8, '2024-09-02', '2025-08-28', 'Processing', 2);

INSERT INTO Accepted_bill (member_id, package_id, amount, payment_date)
SELECT 
    m.member_id,
    m.package_id,
    p.price * (1 - p.discount / 100.0) AS amount,
    m.start_date AS payment_date
FROM Membership m
JOIN MembershipPackage p ON m.package_id = p.package_id
WHERE m.payment_status = 'Paid';
