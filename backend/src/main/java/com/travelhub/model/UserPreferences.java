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

    // Préférences de vol
    private String travelClass = "economy";
    private String seatPreference = "window";
    private String mealPreference = "standard";
    private List<String> preferredAirlines = new ArrayList<>();

    // Préférences d'hôtel
    private List<Integer> hotelStars = new ArrayList<>();
    private String roomType = "double";
    private List<String> hotelAmenities = new ArrayList<>();

    // Budget
    private Double budgetMin = 0.0;
    private Double budgetMax = 5000.0;

    // Destinations préférées
    private List<String> destinations = new ArrayList<>();

    // Voyageurs fréquents
    private List<FrequentTraveler> frequentTravelers = new ArrayList<>();

    // Notifications
    private Boolean emailNotifications = true;
    private Boolean smsNotifications = false;
    private Boolean priceAlerts = true;
    private Boolean promotions = true;
    private Boolean newsletter = true;

    // Préférences générales
    private String language = "fr";
    private String currency = "EUR";

    // Constructeur
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

    public String getSeatPreference() {
        return seatPreference;
    }

    public void setSeatPreference(String seatPreference) {
        this.seatPreference = seatPreference;
    }

    public String getMealPreference() {
        return mealPreference;
    }

    public void setMealPreference(String mealPreference) {
        this.mealPreference = mealPreference;
    }

    public List<String> getPreferredAirlines() {
        return preferredAirlines;
    }

    public void setPreferredAirlines(List<String> preferredAirlines) {
        this.preferredAirlines = preferredAirlines;
    }

    public List<Integer> getHotelStars() {
        return hotelStars;
    }

    public void setHotelStars(List<Integer> hotelStars) {
        this.hotelStars = hotelStars;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public List<String> getHotelAmenities() {
        return hotelAmenities;
    }

    public void setHotelAmenities(List<String> hotelAmenities) {
        this.hotelAmenities = hotelAmenities;
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

    public List<String> getDestinations() {
        return destinations;
    }

    public void setDestinations(List<String> destinations) {
        this.destinations = destinations;
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

    public Boolean getSmsNotifications() {
        return smsNotifications;
    }

    public void setSmsNotifications(Boolean smsNotifications) {
        this.smsNotifications = smsNotifications;
    }

    public Boolean getPriceAlerts() {
        return priceAlerts;
    }

    public void setPriceAlerts(Boolean priceAlerts) {
        this.priceAlerts = priceAlerts;
    }

    public Boolean getPromotions() {
        return promotions;
    }

    public void setPromotions(Boolean promotions) {
        this.promotions = promotions;
    }

    public Boolean getNewsletter() {
        return newsletter;
    }

    public void setNewsletter(Boolean newsletter) {
        this.newsletter = newsletter;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}