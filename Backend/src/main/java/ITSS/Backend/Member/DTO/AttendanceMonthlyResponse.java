package ITSS.Backend.Member.DTO;

public class AttendanceMonthlyResponse {
    private String month;
    private int total;

    public AttendanceMonthlyResponse(String month, int total) {
        this.month = month;
        this.total = total;
    }

    public String getMonth() {
        return month;
    }

    public int getTotal() {
        return total;
    }
}
