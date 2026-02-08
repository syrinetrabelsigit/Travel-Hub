package com.travelhub.dto;

public class HotelSearchRequest {

    private String destination;
    private String checkInDate;
    private String checkOutDate;
    private Integer rooms;
    private Integer guests;
    private Integer minStars; // 1-5

    // Constructeurs
    public HotelSearchRequest() {
    }

    // Getters et Setters
    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getCheckInDate() {
        return checkInDate;
    }

    public void setCheckInDate(String checkInDate) {
        this.checkInDate = checkInDate;
    }

    public String getCheckOutDate() {
        return checkOutDate;
    }

    public void setCheckOutDate(String checkOutDate) {
        this.checkOutDate = checkOutDate;
    }

    public Integer getRooms() {
        return rooms;
    }

    public void setRooms(Integer rooms) {
        this.rooms = rooms;
    }

    public Integer getGuests() {
        return guests;
    }

    public void setGuests(Integer guests) {
        this.guests = guests;
    }

    public Integer getMinStars() {
        return minStars;
    }

    public void setMinStars(Integer minStars) {
        this.minStars = minStars;
    }
}