package com.fitness.aiservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class GeminiService {

    private final WebClient webClient;
    @Value("${Gemini.api.url}")
    private String geminiApiUrl;
    @Value("${Gemini.api.key}")
    private String geminiApiKey;

    public GeminiService(WebClient.Builder webClient) {
        this.webClient = webClient.build();
    }

    public String getAnswer(String prompt) {
        Map<String, Object> requestBody = Map.of(
          "contents", new Object[] {
                  Map.of("parts", new Object[] {
                          Map.of("text", prompt)
                  })
                }
        );

        String response = webClient.post()
                .uri(geminiApiUrl + geminiApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return response;
    }
}
