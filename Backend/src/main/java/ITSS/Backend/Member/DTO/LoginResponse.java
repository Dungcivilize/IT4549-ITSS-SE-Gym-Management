package ITSS.Backend.Member.DTO;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class LoginResponse {
    private String message;
    private Long user_id;
    private String user_name;
    private String email;
    private String phone;
    private String role;
    private LocalDateTime created_at;
    private String fullname;
    private String address;
    private LocalDate date_of_birth;
    // Thêm các trường khác nếu cần

    // Constructor
    public LoginResponse(String message, Long user_id, String user_name, String email, String phone, 
                        String role, LocalDateTime created_at, String fullname, String address, 
                        LocalDate date_of_birth) {
        this.message = message;
        this.user_id = user_id;
        this.user_name = user_name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.created_at = created_at;
        this.fullname = fullname;
        this.address = address;
        this.date_of_birth = date_of_birth;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }

    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDate getDate_of_birth() {
        return date_of_birth;
    }

    public void setDate_of_birth(LocalDate date_of_birth) {
        this.date_of_birth = date_of_birth;
    }
}
