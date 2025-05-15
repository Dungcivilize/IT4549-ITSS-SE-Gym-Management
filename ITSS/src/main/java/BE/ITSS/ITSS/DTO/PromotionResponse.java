package BE.ITSS.ITSS.DTO;

import BE.ITSS.ITSS.Models.Promotion;

import java.sql.Date;

public class PromotionResponse {

    private String promotionName;
    private String description;
    private Double discountPercent;
    private Date startDate;
    private Date endDate;

    private String packageName;
    private Double originalPrice;
    private Double discountedPrice;

    public PromotionResponse(Promotion p) {
        this.promotionName = p.getPromotionName();
        this.description = p.getDescription();
        this.discountPercent = p.getDiscountPercent();
        this.startDate = p.getStartDate();
        this.endDate = p.getEndDate();
        this.packageName = p.getMembershipPackage().getPackageName();
        this.originalPrice = p.getMembershipPackage().getPrice();
        this.discountedPrice = originalPrice * (1 - discountPercent / 100);
    }

    // Getters, Setters

    public String getPromotionName() {
        return promotionName;
    }

    public void setPromotionName(String promotionName) {
        this.promotionName = promotionName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getDiscountPercent() {
        return discountPercent;
    }

    public void setDiscountPercent(Double discountPercent) {
        this.discountPercent = discountPercent;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public Double getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(Double originalPrice) {
        this.originalPrice = originalPrice;
    }

    public Double getDiscountedPrice() {
        return discountedPrice;
    }

    public void setDiscountedPrice(Double discountedPrice) {
        this.discountedPrice = discountedPrice;
    }
}

