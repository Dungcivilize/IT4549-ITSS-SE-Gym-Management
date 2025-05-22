package BE.ITSS.ITSS.DTO;

public class LoginResponse {
    private String message;
    private Long user_id;
    private String user_name;
    private String role;
    private String fullname;
    private Long member_id;
    // Thêm các trường khác nếu cần

    // Constructor
    public LoginResponse(String message, Long user_id, String user_name, String role, String fullname, Long member_id) {
        this.message = message;
        this.user_id = user_id;
        this.user_name = user_name;
        this.role = role;
        this.fullname = fullname;
        this.member_id = member_id;
    }

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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public Long getMember_id() {
        return member_id;
    }

    public void setMember_id(Long member_id) {
        this.member_id = member_id;
    }
}