package com.travelhub.dto;

public class MessageResponse {

    private String message;

    // Constructeurs
    public MessageResponse() {
    }

    public MessageResponse(String message) {
        this.message = message;
    }

    // Getters et Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}