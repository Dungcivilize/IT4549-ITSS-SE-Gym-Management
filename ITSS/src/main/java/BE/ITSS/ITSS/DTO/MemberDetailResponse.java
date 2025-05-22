package BE.ITSS.ITSS.DTO;

public class MemberDetailResponse {
    private String userName;
    private String email;
    private String phone;
    private String fullname;
    private java.sql.Date dateOfBirth;

    public MemberDetailResponse() {
    }

    public MemberDetailResponse(String userName, String email, String phone, String fullname, java.sql.Date dateOfBirth) {
        this.userName = userName;
        this.email = email;
        this.phone = phone;
        this.fullname = fullname;
        this.dateOfBirth = dateOfBirth;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
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

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public java.sql.Date getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(java.sql.Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
} 