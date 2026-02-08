package com.travelhub.dto;

import com.travelhub.model.User;

public class AuthResponse {

    private String token;
    private String type = "Bearer";
    private User user;

    // Constructeurs
    public AuthResponse() {
    }

    public AuthResponse(String token, User user) {
        this.token = token;
        this.user = user;
        this.type = "Bearer";
    }

    public AuthResponse(String token, String type, User user) {
        this.token = token;
        this.type = type;
        this.user = user;
    }

    // Getters et Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}