package com.fitness.gateway.user;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@AllArgsConstructor
public class UserService {
    private final WebClient userWebClient;

    public Mono<Boolean> validateUser(String userId) {
        log.info("Calling User Validation API for userId: {}", userId);
            return userWebClient.get()
                    .uri("/api/users/{userId}/validate", userId)
                    .retrieve()
                    .bodyToMono(Boolean.class)
                    .onErrorResume(WebClientResponseException.class, e -> {
                        if(e.getStatusCode() == HttpStatus.NOT_FOUND) {
                            return Mono.error(new RuntimeException(("User not found: " + userId)));
                        } else if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                            return Mono.error(new RuntimeException(("Invalid request: " + userId)));
                        } else {
                            return Mono.error(new RuntimeException("Unexpected error: " + e.getMessage()));
                        }
                    });
    }

    public Mono<UserResponse> registerUser(RegisterRequest request) {
        log.info("Calling User Registeration API for email: {}", request.getEmail());
        return userWebClient.post()
                .uri("/api/users/register")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(UserResponse.class)
                .onErrorResume(WebClientResponseException.class, e -> {
                    if(e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                        return Mono.error(new RuntimeException(("Bad Request: " + e.getMessage())));
                    } else if (e.getStatusCode() == HttpStatus.INTERNAL_SERVER_ERROR) {
                        return Mono.error(new RuntimeException(("Internal Server Error: " + e.getMessage())));
                    } else {
                        return Mono.error(new RuntimeException("Unexpected error: " + e.getMessage()));
                    }
                });
    }
}
