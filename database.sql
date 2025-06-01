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
    `payment_status` ENUM('Paid', 'Unpaid') NOT NULL,
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
