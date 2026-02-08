package com.travelhub.dto;

public class PaymentIntentRequest {

    private String bookingId;
    private Double amount;
    private String currency;

    // Constructeurs
    public PaymentIntentRequest() {
    }

    // Getters et Setters
    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}