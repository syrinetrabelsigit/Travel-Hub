package com.travelhub.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
public class ContactRequest {
    @NotBlank(message = "Le nom est requis")
    private String name;

    @NotBlank(message = "L'email est requis")
    @Email(message = "Email invalide")
    private String email;

    private String phone;

    @NotBlank(message = "Le sujet est requis")
    private String subject;

    @NotBlank(message = "Le message est requis")
    private String message;
}