package BE.ITSS.ITSS.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LoginRequest {
//    @JsonProperty("user_name")
//    private String user_name;
    private String email;
    private String password;

    // Getters and Setters


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

