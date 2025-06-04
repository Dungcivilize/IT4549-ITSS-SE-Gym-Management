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
    `duration` BIGINT NOT NULL, -- đơn vị: ngày/tháng?
    `price` DOUBLE NOT NULL,
    `package_type` VARCHAR(255) NOT NULL,
    `PT` BOOLEAN NOT NULL
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
    FOREIGN KEY (`member_id`) REFERENCES `Users`(`user_id`)
);

-- Bảng điểm danh
CREATE TABLE `Attendance` (
    `attendance_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `member_id` BIGINT unsigned NOT NULL,
    `checkin_date` TIMESTAMP NOT NULL,
    FOREIGN KEY (`member_id`) REFERENCES `Users`(`user_id`)
);


INSERT INTO Users (user_name, password, email, phone, role, created_at, fullname, address, date_of_birth)
VALUES
-- Members
('alice01', 'pass123', 'alice01@example.com', '0900000001', 'member', '2024-01-15 08:20:00', 'Alice Nguyen', '123 Street A', '1995-04-10'),
('bob02', 'pass123', 'bob02@example.com', '0900000002', 'member', '2024-02-10 09:45:00', 'Bob Tran', '456 Street B', '1992-07-20'),
('carol03', 'pass123', 'carol03@example.com', '0900000003', 'member', '2024-03-12 14:30:00', 'Carol Pham', '789 Street C', '1990-11-12'),
('david04', 'pass123', 'david04@example.com', '0900000004', 'member', '2024-04-05 11:15:00', 'David Hoang', '135 Street D', '1991-03-22'),
('emma05', 'pass123', 'emma05@example.com', '0900000005', 'member', '2024-04-28 16:00:00', 'Emma Le', '246 Street E', '1989-06-14'),
('frank06', 'pass123', 'frank06@example.com', '0900000006', 'member', '2024-05-10 10:00:00', 'Frank Bui', '357 Street F', '1996-02-09'),
('grace07', 'pass123', 'grace07@example.com', '0900000007', 'member', '2024-06-01 13:40:00', 'Grace Vo', '468 Street G', '1993-10-17'),
('harry08', 'pass123', 'harry08@example.com', '0900000008', 'member', '2024-06-21 07:25:00', 'Harry Dang', '579 Street H', '1994-12-25'),
('ivy09', 'pass123', 'ivy09@example.com', '0900000009', 'member', '2024-07-02 15:50:00', 'Ivy Do', '680 Street I', '1992-01-05'),
('jack10', 'pass123', 'jack10@example.com', '0900000010', 'member', '2024-07-25 09:05:00', 'Jack Phan', '791 Street J', '1988-09-13'),
('karen11', 'pass123', 'karen11@example.com', '0900000011', 'member', '2024-08-10 11:45:00', 'Karen Ngo', '802 Street K', '1995-05-11'),
('leo12', 'pass123', 'leo12@example.com', '0900000012', 'member', '2024-08-30 18:15:00', 'Leo Ly', '913 Street L', '1991-08-07'),
('mia13', 'pass123', 'mia13@example.com', '0900000013', 'member', '2024-09-10 12:30:00', 'Mia Chau', '124 Street M', '1993-03-19'),
('nick14', 'pass123', 'nick14@example.com', '0900000014', 'member', '2024-09-28 08:00:00', 'Nick Huynh', '235 Street N', '1996-04-25'),
('olivia15', 'pass123', 'olivia15@example.com', '0900000015', 'member', '2024-10-15 16:20:00', 'Olivia Truong', '346 Street O', '1987-07-08'),
('paul16', 'pass123', 'paul16@example.com', '0900000016', 'member', '2024-11-02 14:10:00', 'Paul Nguyen', '457 Street P', '1994-12-30'),
('quinn17', 'pass123', 'quinn17@example.com', '0900000017', 'member', '2024-11-25 17:00:00', 'Quinn Dinh', '568 Street Q', '1990-02-03'),
('rose18', 'pass123', 'rose18@example.com', '0900000018', 'member', '2024-12-12 10:30:00', 'Rose Vo', '679 Street R', '1991-06-15'),
('sam19', 'pass123', 'sam19@example.com', '0900000019', 'member', '2025-01-10 08:50:00', 'Sam Le', '780 Street S', '1992-10-10'),
('tina20', 'pass123', 'tina20@example.com', '0900000020', 'member', '2025-05-28 13:00:00', 'Tina Doan', '891 Street T', '1989-11-01'),

-- Trainers
('trainer01', 'train123', 'trainer01@example.com', '0910000001', 'trainer', '2024-02-05 09:00:00', 'Trainer A', '101 Gym St', '1985-01-15'),
('trainer02', 'train123', 'trainer02@example.com', '0910000002', 'trainer', '2024-03-20 14:30:00', 'Trainer B', '102 Gym St', '1986-02-16'),
('trainer03', 'train123', 'trainer03@example.com', '0910000003', 'trainer', '2024-04-25 11:00:00', 'Trainer C', '103 Gym St', '1987-03-17'),
('trainer04', 'train123', 'trainer04@example.com', '0910000004', 'trainer', '2024-06-18 10:10:00', 'Trainer D', '104 Gym St', '1988-04-18'),
('trainer05', 'train123', 'trainer05@example.com', '0910000005', 'trainer', '2024-07-22 15:40:00', 'Trainer E', '105 Gym St', '1989-05-19'),
('trainer06', 'train123', 'trainer06@example.com', '0910000006', 'trainer', '2024-08-12 08:20:00', 'Trainer F', '106 Gym St', '1990-06-20'),
('trainer07', 'train123', 'trainer07@example.com', '0910000007', 'trainer', '2024-09-05 12:00:00', 'Trainer G', '107 Gym St', '1991-07-21'),
('trainer08', 'train123', 'trainer08@example.com', '0910000008', 'trainer', '2024-10-17 09:45:00', 'Trainer H', '108 Gym St', '1992-08-22'),
('trainer09', 'train123', 'trainer09@example.com', '0910000009', 'trainer', '2024-11-30 10:15:00', 'Trainer I', '109 Gym St', '1993-09-23'),
('trainer10', 'train123', 'trainer10@example.com', '0910000010', 'trainer', '2025-04-10 11:30:00', 'Trainer J', '110 Gym St', '1994-10-24'),

-- Admins
('admin01', 'admin123', 'admin01@example.com', '0920000001', 'admin', '2024-03-15 08:00:00', 'Admin A', 'Admin HQ', '1980-06-20'),
('admin02', 'admin123', 'admin02@example.com', '0920000002', 'admin', '2024-06-01 10:30:00', 'Admin B', 'Admin HQ', '1981-07-21'),
('admin03', 'admin123', 'admin03@example.com', '0920000003', 'admin', '2024-11-05 14:45:00', 'Admin C', 'Admin HQ', '1982-08-22');


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


INSERT INTO MembershipPackage (package_name, duration, price, package_type, PT)
VALUES 
-- Gói 1 tháng
('Basic Monthly', 30, 300000, 'Monthly', FALSE),
('Premium Monthly + PT', 30, 500000, 'Monthly', TRUE),

-- Gói 3 tháng
('Quarterly Pass', 90, 850000, 'Quarterly', FALSE),
('Quarterly Pass + PT', 90, 1400000, 'Quarterly', TRUE),

-- Gói 6 tháng
('Half-Year Basic', 180, 1600000, 'Half-Year', FALSE),
('Half-Year Premium + PT', 180, 2700000, 'Half-Year', TRUE),

-- Gói 12 tháng
('Annual Basic', 365, 2800000, 'Yearly', FALSE),
('Annual Premium + PT', 365, 4800000, 'Yearly', TRUE);


INSERT INTO training_assign (package_id, trainer_id)
VALUES 
-- Gói 2: Premium Monthly + PT
(2, 21), (2, 22), (2, 23),

-- Gói 4: Quarterly Pass + PT
(4, 24), (4, 25), (4, 26),

-- Gói 6: Half-Year Premium + PT
(6, 27), (6, 28), (6, 29),

-- Gói 8: Annual Premium + PT
(8, 30), (8, 21), (8, 22);


INSERT INTO Feedback (member_id, feedback_text, feedback_date)
VALUES 
(3, 'Phòng tập rộng rãi, máy móc hiện đại.', '2025-03-12'),
(3, 'Nhân viên rất nhiệt tình và thân thiện.', '2025-05-08'),

(7, 'Huấn luyện viên hướng dẫn rất chi tiết.', '2025-04-20'),

(11, 'Giá cả hợp lý, không gian sạch sẽ.', '2025-01-25'),
(11, 'Tôi rất hài lòng với dịch vụ tại đây.', '2025-06-01'),

(14, 'Môi trường tập luyện chuyên nghiệp.', '2025-02-17'),

(16, 'Ứng dụng đặt lịch hơi khó sử dụng.', '2025-04-03'),
(16, 'Tuy nhiên chất lượng huấn luyện thì rất tốt.', '2025-04-10'),

(18, 'Có nhiều lớp học phù hợp với nhu cầu.', '2025-05-22'),

(20, 'Tôi sẽ giới thiệu phòng tập này cho bạn bè.', '2025-06-01');

INSERT INTO Attendance (member_id, checkin_date)
VALUES
(1, '2024-01-20 07:45:00'),
(1, '2024-02-05 08:00:00'),
(2, '2024-02-15 09:50:00'),
(2, '2024-03-01 10:10:00'),
(3, '2024-03-15 15:00:00'),
(3, '2024-03-28 14:45:00'),
(4, '2024-04-10 11:30:00'),
(5, '2024-05-01 16:20:00'),
(6, '2024-05-15 10:10:00'),
(6, '2024-06-01 10:00:00'),
(7, '2024-06-05 14:00:00'),
(7, '2024-06-10 13:50:00');

INSERT INTO Membership (member_id, trainer_id, package_id, start_date, end_date, payment_status)
VALUES
(1, 21, 2, '2025-06-01', '2025-07-01', 'Paid'),
(2, 22, 2, '2025-06-01', '2025-07-01', 'Unpaid'),
(3, 24, 4, '2025-06-01', '2025-08-30', 'Processing'),
(4, 25, 4, '2025-06-01', '2025-08-30', 'Paid'),
(5, 27, 6, '2025-06-01', '2025-11-28', 'Unpaid'),
(6, 29, 6, '2025-06-01', '2025-11-28', 'Paid'),
(7, 30, 8, '2025-06-01', '2026-06-01', 'Processing'),
(8, 21, 8, '2025-06-01', '2026-06-01', 'Paid'),
(9, NULL, 1, '2025-06-01', '2025-07-01', 'Paid'),
(10, NULL, 3, '2025-06-01', '2025-08-30', 'Unpaid'),
(11, NULL, 5, '2025-06-01', '2025-11-28', 'Paid'),
(12, NULL, 7, '2025-06-01', '2026-06-01', 'Processing'),
(13, NULL, 1, '2025-06-01', '2025-07-01', 'Paid'),
(14, NULL, 3, '2025-06-01', '2025-08-30', 'Unpaid'),
(15, NULL, 5, '2025-06-01', '2025-11-28', 'Paid'),
(16, NULL, 7, '2025-06-01', '2026-06-01', 'Processing'),
(17, NULL, 1, '2025-06-01', '2025-07-01', 'Paid'),
(18, NULL, 3, '2025-06-01', '2025-08-30', 'Unpaid'),
(19, NULL, 5, '2025-06-01', '2025-11-28', 'Paid'),
(20, NULL, 7, '2025-06-01', '2026-06-01', 'Processing');