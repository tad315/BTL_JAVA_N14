package com.fintrack.backend.chat.service;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    private static final String FALLBACK_MESSAGE =
            "Xin loi, dich vu AI hien chua phan hoi. Vui long thu lai sau it phut.";

    private final RestClient.Builder restClientBuilder;

    @Value("${chat.gemini.api-key:}")
    private String apiKey;

    @Value("${chat.gemini.model:gemini-2.5-flash}")
    private String model;

    @Value("${chat.gemini.base-url:https://generativelanguage.googleapis.com/v1beta}")
    private String baseUrl;

    public String generateResponse(String userMessage) {
        if (!StringUtils.hasText(apiKey)) {
            throw new GeminiChatException("Chua cau hinh Gemini API key. Hay dat bien moi truong GEMINI_API_KEY.");
        }

        try {
            RestClient restClient = restClientBuilder.baseUrl(baseUrl).build();

            JsonNode response = restClient.post()
                    .uri("/models/{model}:generateContent", model)
                    .header("x-goog-api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(buildRequestBody(userMessage))
                    .retrieve()
                    .body(JsonNode.class);

            String text = extractResponseText(response);
            if (!StringUtils.hasText(text)) {
                throw new GeminiChatException(FALLBACK_MESSAGE);
            }

            return text;
        } catch (GeminiChatException exception) {
            throw exception;
        } catch (RestClientException exception) {
            throw new GeminiChatException(FALLBACK_MESSAGE, exception);
        }
    }

    private Map<String, Object> buildRequestBody(String userMessage) {
        return Map.of(
                "system_instruction", Map.of(
                        "parts", List.of(
                                Map.of(
                                        "text",
                                        "Ban la Vissmart AI, tro ly tai chinh cho ung dung quan ly chi tieu. " +
                                                "Hay tra loi bang tieng Viet, ro rang, ngan gon va huu ich."
                                )
                        )
                ),
                "contents", List.of(
                        Map.of(
                                "role", "user",
                                "parts", List.of(Map.of("text", userMessage))
                        )
                )
        );
    }

    private String extractResponseText(JsonNode response) {
        JsonNode candidates = response.path("candidates");
        if (!candidates.isArray() || candidates.isEmpty()) {
            return null;
        }

        JsonNode parts = candidates.get(0).path("content").path("parts");
        if (!parts.isArray() || parts.isEmpty()) {
            return null;
        }

        StringBuilder text = new StringBuilder();
        for (JsonNode part : parts) {
            String value = part.path("text").asText("");
            if (!value.isBlank()) {
                if (!text.isEmpty()) {
                    text.append('\n');
                }
                text.append(value);
            }
        }

        return text.toString();
    }

    public static class GeminiChatException extends RuntimeException {
        public GeminiChatException(String message) {
            super(message);
        }

        public GeminiChatException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
