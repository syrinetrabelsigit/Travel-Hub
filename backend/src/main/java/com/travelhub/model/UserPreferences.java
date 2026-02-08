package com.travelhub.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "user_preferences")
public class UserPreferences {

    @Id
    private String id;
    private String userId;
    private String travelClass = "economy";
    private List<String> preferredAirlines = new ArrayList<>();
    private Double budgetMin;
    private Double budgetMax;
    private List<Integer> hotelStars = new ArrayList<>();
    private List<FrequentTraveler> frequentTravelers = new ArrayList<>();
    private Boolean emailNotifications = true;
    private Boolean priceAlerts = true;

    // Constructeurs
    public UserPreferences() {
    }

    // Getters et Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getTravelClass() {
        return travelClass;
    }

    public void setTravelClass(String travelClass) {
        this.travelClass = travelClass;
    }

    public List<String> getPreferredAirlines() {
        return preferredAirlines;
    }

    public void setPreferredAirlines(List<String> preferredAirlines) {
        this.preferredAirlines = preferredAirlines;
    }

    public Double getBudgetMin() {
        return budgetMin;
    }

    public void setBudgetMin(Double budgetMin) {
        this.budgetMin = budgetMin;
    }

    public Double getBudgetMax() {
        return budgetMax;
    }

    public void setBudgetMax(Double budgetMax) {
        this.budgetMax = budgetMax;
    }

    public List<Integer> getHotelStars() {
        return hotelStars;
    }

    public void setHotelStars(List<Integer> hotelStars) {
        this.hotelStars = hotelStars;
    }

    public List<FrequentTraveler> getFrequentTravelers() {
        return frequentTravelers;
    }

    public void setFrequentTravelers(List<FrequentTraveler> frequentTravelers) {
        this.frequentTravelers = frequentTravelers;
    }

    public Boolean getEmailNotifications() {
        return emailNotifications;
    }

    public void setEmailNotifications(Boolean emailNotifications) {
        this.emailNotifications = emailNotifications;
    }

    public Boolean getPriceAlerts() {
        return priceAlerts;
    }

    public void setPriceAlerts(Boolean priceAlerts) {
        this.priceAlerts = priceAlerts;
    }
}