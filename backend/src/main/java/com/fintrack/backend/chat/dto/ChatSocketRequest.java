package com.fintrack.backend.chat.dto;

import lombok.Data;

@Data
public class ChatSocketRequest {
    private String requestId;
    private Long userId;
    private String message;
}
