package com.fintrack.backend.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatSocketResponse {
    private String requestId;
    private String message;
    private String error;
    private String timestamp;
}
