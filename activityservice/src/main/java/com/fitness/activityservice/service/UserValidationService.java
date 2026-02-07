package com.fitness.activityservice.service;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
@AllArgsConstructor
public class UserValidationService {
    private final WebClient userWebClient;

    public boolean validateUser(String userId) {
        try {
            return userWebClient.get()
                    .uri("/api/users/{userId}/validate", userId)
                    .retrieve()
                    .bodyToMono(Boolean.class)
                    .block();
        } catch (WebClientResponseException e) {
            if(e.getStatusCode() == HttpStatus.NOT_FOUND) {
                throw new RuntimeException("User with this user id does not exist " + userId);
            } else if(e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                throw new RuntimeException("Bad request with " + userId);
            }
        }
        return false;
    }
}
