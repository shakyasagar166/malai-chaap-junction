package com.malaichaap.junction.model;

import jakarta.persistence.*;

@Entity
@Table(name = "menu_items")
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(length = 1000)
    private String description;

    private Double priceHalf;
    private Double priceFull;
    private Double singlePrice;
    private boolean hasSinglePrice = false;

    private String portionUnit; // e.g. "6 pcs / 10 pcs", "500 ml", "with 2 Rumali"

    private boolean isVeg = true;
    private boolean isAvailable = true;
    private boolean isChefSpecial = false;
    private boolean isBestseller = false;

    private String spiceLevel; // "Mild", "Medium", "Spicy"

    @Column(columnDefinition = "LONGTEXT")
    private String imageUrl;

    public MenuItem() {
    }

    public MenuItem(String name, Category category, String description, Double priceHalf, Double priceFull,
                    Double singlePrice, boolean hasSinglePrice, String portionUnit, boolean isChefSpecial,
                    boolean isBestseller, String spiceLevel, String imageUrl) {
        this.name = name;
        this.category = category;
        this.description = description;
        this.priceHalf = priceHalf;
        this.priceFull = priceFull;
        this.singlePrice = singlePrice;
        this.hasSinglePrice = hasSinglePrice;
        this.portionUnit = portionUnit;
        this.isChefSpecial = isChefSpecial;
        this.isBestseller = isBestseller;
        this.spiceLevel = spiceLevel;
        this.imageUrl = imageUrl;
        this.isVeg = true;
        this.isAvailable = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPriceHalf() {
        return priceHalf;
    }

    public void setPriceHalf(Double priceHalf) {
        this.priceHalf = priceHalf;
    }

    public Double getPriceFull() {
        return priceFull;
    }

    public void setPriceFull(Double priceFull) {
        this.priceFull = priceFull;
    }

    public Double getSinglePrice() {
        return singlePrice;
    }

    public void setSinglePrice(Double singlePrice) {
        this.singlePrice = singlePrice;
    }

    public boolean isHasSinglePrice() {
        return hasSinglePrice;
    }

    public void setHasSinglePrice(boolean hasSinglePrice) {
        this.hasSinglePrice = hasSinglePrice;
    }

    public String getPortionUnit() {
        return portionUnit;
    }

    public void setPortionUnit(String portionUnit) {
        this.portionUnit = portionUnit;
    }

    public boolean isVeg() {
        return isVeg;
    }

    public void setVeg(boolean veg) {
        isVeg = veg;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }

    public boolean isChefSpecial() {
        return isChefSpecial;
    }

    public void setChefSpecial(boolean chefSpecial) {
        isChefSpecial = chefSpecial;
    }

    public boolean isBestseller() {
        return isBestseller;
    }

    public void setBestseller(boolean bestseller) {
        isBestseller = bestseller;
    }

    public String getSpiceLevel() {
        return spiceLevel;
    }

    public void setSpiceLevel(String spiceLevel) {
        this.spiceLevel = spiceLevel;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCategorySlug() {
        return category != null ? category.getSlug() : null;
    }

    public String getCategoryName() {
        return category != null ? category.getName() : null;
    }
}
