package com.malaichaap.junction.model;

import jakarta.persistence.*;

@Entity
@Table(name = "mcj_restaurant_info")
public class RestaurantInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name = "Svad Malai Chaap Junction";
    private String tagline = "Ghaziabad's Premier Tandoori & Chaap Specialities";
    private String address = "L-127, Sanjay Nagar, Sector - 23, Ghaziabad";
    private String phonePrimary = "99-1101-3993";
    private String phoneSecondary = "89-2929-9898";
    private String whatsappNumber = "919911013993";
    private String openingHours = "12:00 PM - 11:30 PM (Daily)";
    private boolean pureVeg = true;
    private Double gstRate = 5.0; // 5% GST

    public RestaurantInfo() {
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

    public String getTagline() {
        return tagline;
    }

    public void setTagline(String tagline) {
        this.tagline = tagline;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhonePrimary() {
        return phonePrimary;
    }

    public void setPhonePrimary(String phonePrimary) {
        this.phonePrimary = phonePrimary;
    }

    public String getPhoneSecondary() {
        return phoneSecondary;
    }

    public void setPhoneSecondary(String phoneSecondary) {
        this.phoneSecondary = phoneSecondary;
    }

    public String getWhatsappNumber() {
        return whatsappNumber;
    }

    public void setWhatsappNumber(String whatsappNumber) {
        this.whatsappNumber = whatsappNumber;
    }

    public String getOpeningHours() {
        return openingHours;
    }

    public void setOpeningHours(String openingHours) {
        this.openingHours = openingHours;
    }

    public boolean isPureVeg() {
        return pureVeg;
    }

    public void setPureVeg(boolean pureVeg) {
        this.pureVeg = pureVeg;
    }

    public Double getGstRate() {
        return gstRate;
    }

    public void setGstRate(Double gstRate) {
        this.gstRate = gstRate;
    }
}
