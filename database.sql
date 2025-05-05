CREATE TABLE `Equipments`(
    `equipment_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `equipment_name` VARCHAR(255) NOT NULL,
    `quantity` BIGINT NOT NULL,
    `manufacturer` BIGINT NOT NULL,
    `room_id` BIGINT NOT NULL
);
CREATE TABLE `Rooms`(
    `room_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `branch_id` BIGINT NOT NULL,
    `room_name` VARCHAR(255) NOT NULL,
    `room_type` VARCHAR(255) NOT NULL,
    `status` VARCHAR(255) NOT NULL
);
CREATE TABLE `Users`(
    `user_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_name` BIGINT NOT NULL,
    `password` BIGINT NOT NULL,
    `email` BIGINT NOT NULL,
    `phone` BIGINT NOT NULL,
    `role` BIGINT NOT NULL,
    `created_at` BIGINT NOT NULL
);
CREATE TABLE `Trainers`(
    `trainer_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `branch_id` BIGINT NOT NULL,
    `fullname` VARCHAR(255) NOT NULL,
    `specialty` VARCHAR(255) NOT NULL,
    `salary` DOUBLE NOT NULL,
    `hire_date` TIMESTAMP NOT NULL
);
CREATE TABLE `Admins`(
    `admin_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `fullname` VARCHAR(255) NOT NULL
);
CREATE TABLE `Receptionists`(
    `receptionist_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `branch_id` BIGINT NOT NULL,
    `fullname` VARCHAR(255) NOT NULL,
    `salary` BIGINT NOT NULL,
    `hire_date` DATE NOT NULL
);
CREATE TABLE `Members`(
    `member_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `fullname` BIGINT NOT NULL,
    `address` BIGINT NOT NULL,
    `date_of_birth` DATE NOT NULL,
    `register_date` DATE NOT NULL
);
CREATE TABLE `MembershipPackage`(
    `package_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `package_name` VARCHAR(255) NOT NULL,
    `duration` BIGINT NOT NULL,
    `price` DOUBLE NOT NULL,
    `package_type` VARCHAR(255) NOT NULL
);
CREATE TABLE `Membership`(
    `membership_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `member_id` BIGINT NOT NULL,
    `package_id` BIGINT NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `payment_status` VARCHAR(255) NOT NULL
);
CREATE TABLE `Attendance`(
    `attendance_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `member_id` BIGINT NOT NULL,
    `check_in_time` TIMESTAMP NOT NULL,
    `check_out_time` TIMESTAMP NOT NULL
);
CREATE TABLE `TrainerAssignment`(
    `assignment_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `member_id` BIGINT NOT NULL,
    `trainer_id` BIGINT NOT NULL,
    `training_date` DATE NOT NULL,
    `status` VARCHAR(255) NOT NULL
);
CREATE TABLE `Feedback`(
    `feedback_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `member_id` BIGINT NOT NULL,
    `feedback_text` TEXT NOT NULL,
    `feedback_date` DATE NOT NULL
);
CREATE TABLE `MaintenanceRequest`(
    `request_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `equipment_id` BIGINT NOT NULL,
    `receptionist_id` BIGINT NOT NULL,
    `request_date` DATE NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    `notes` TEXT NOT NULL
);
CREATE TABLE `TrainingFeedback`(
    `feedback_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `trainer_id` BIGINT NOT NULL,
    `member_id` BIGINT NOT NULL,
    `result` VARCHAR(255) NOT NULL
);
ALTER TABLE
    `Trainers` ADD CONSTRAINT `trainers_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `Users`(`user_id`);
ALTER TABLE
    `TrainingFeedback` ADD CONSTRAINT `trainingfeedback_trainer_id_foreign` FOREIGN KEY(`trainer_id`) REFERENCES `Trainers`(`trainer_id`);
ALTER TABLE
    `TrainingFeedback` ADD CONSTRAINT `trainingfeedback_member_id_foreign` FOREIGN KEY(`member_id`) REFERENCES `Members`(`member_id`);
ALTER TABLE
    `Attendance` ADD CONSTRAINT `attendance_attendance_id_foreign` FOREIGN KEY(`attendance_id`) REFERENCES `Members`(`member_id`);
ALTER TABLE
    `Membership` ADD CONSTRAINT `membership_package_id_foreign` FOREIGN KEY(`package_id`) REFERENCES `MembershipPackage`(`package_id`);
ALTER TABLE
    `MaintenanceRequest` ADD CONSTRAINT `maintenancerequest_receptionist_id_foreign` FOREIGN KEY(`receptionist_id`) REFERENCES `Receptionists`(`receptionist_id`);
ALTER TABLE
    `Equipments` ADD CONSTRAINT `equipments_room_id_foreign` FOREIGN KEY(`room_id`) REFERENCES `Rooms`(`room_id`);
ALTER TABLE
    `TrainerAssignment` ADD CONSTRAINT `trainerassignment_member_id_foreign` FOREIGN KEY(`member_id`) REFERENCES `Members`(`member_id`);
ALTER TABLE
    `Admins` ADD CONSTRAINT `admins_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `Users`(`user_id`);
ALTER TABLE
    `Receptionists` ADD CONSTRAINT `receptionists_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `Users`(`user_id`);
ALTER TABLE
    `Members` ADD CONSTRAINT `members_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `Users`(`user_id`);
ALTER TABLE
    `TrainerAssignment` ADD CONSTRAINT `trainerassignment_trainer_id_foreign` FOREIGN KEY(`trainer_id`) REFERENCES `Trainers`(`trainer_id`);
ALTER TABLE
    `Membership` ADD CONSTRAINT `membership_membership_id_foreign` FOREIGN KEY(`membership_id`) REFERENCES `Members`(`member_id`);
ALTER TABLE
    `Feedback` ADD CONSTRAINT `feedback_member_id_foreign` FOREIGN KEY(`member_id`) REFERENCES `Members`(`member_id`);
ALTER TABLE
    `MaintenanceRequest` ADD CONSTRAINT `maintenancerequest_equipment_id_foreign` FOREIGN KEY(`equipment_id`) REFERENCES `Equipments`(`equipment_id`);