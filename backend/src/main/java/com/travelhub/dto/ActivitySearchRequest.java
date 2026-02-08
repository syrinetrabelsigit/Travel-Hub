package com.travelhub.dto;

public class ActivitySearchRequest {

    private String destination;
    private String date;
    private String category; // "culture", "adventure", "food", "nature"
    private Double maxPrice;

    // Constructeurs
    public ActivitySearchRequest() {
    }

    // Getters et Setters
    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(Double maxPrice) {
        this.maxPrice = maxPrice;
    }
}