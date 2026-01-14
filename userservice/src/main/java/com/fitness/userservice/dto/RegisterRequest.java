package com.fitness.userservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "email cannot be blank")
    @Email(message = "Invalid email format")
    private String email;
    @NotBlank(message = "password cannot be blank")
    @Size(min=6, message = "password must be of minimum 6 chaaracters")
    private String password;
    private String firstName;
    private String lastName;
}
