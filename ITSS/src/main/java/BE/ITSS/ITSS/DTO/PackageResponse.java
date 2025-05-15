package BE.ITSS.ITSS.DTO;

public class PackageResponse {
    private Long packageId;
    private String packageName;
    private Long duration;
    private Double price;
    private String packageType;

    // Constructors
    public PackageResponse(Long packageId, String packageName, Long duration, Double price, String packageType) {
        this.packageId = packageId;
        this.packageName = packageName;
        this.duration = duration;
        this.price = price;
        this.packageType = packageType;
    }

    // Getters
    public Long getPackageId() { return packageId; }
    public String getPackageName() { return packageName; }
    public Long getDuration() { return duration; }
    public Double getPrice() { return price; }
    public String getPackageType() { return packageType; }
}
