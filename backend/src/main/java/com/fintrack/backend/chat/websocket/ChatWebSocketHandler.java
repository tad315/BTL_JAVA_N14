package com.fintrack.backend.chat.websocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fintrack.backend.chat.dto.ChatSocketRequest;
import com.fintrack.backend.chat.dto.ChatSocketResponse;
import com.fintrack.backend.chat.service.ChatHistoryService;
import com.fintrack.backend.chat.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.time.OffsetDateTime;

@Component
@RequiredArgsConstructor
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper;
    private final ChatbotService chatbotService;
    private final ChatHistoryService chatHistoryService;

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        ChatSocketRequest request = objectMapper.readValue(message.getPayload(), ChatSocketRequest.class);
        String requestId = request.getRequestId();
        Long userId = request.getUserId() != null ? request.getUserId() : 1L;
        String userMessage = request.getMessage() != null ? request.getMessage().trim() : "";

        if (!StringUtils.hasText(userMessage)) {
            sendResponse(session, new ChatSocketResponse(
                    requestId,
                    null,
                    "Tin nhan khong duoc de trong.",
                    OffsetDateTime.now().toString()
            ));
            return;
        }

        try {
            String botMessage = chatbotService.generateResponse(userMessage);
            chatHistoryService.saveChatHistory(userId, userMessage, botMessage);

            sendResponse(session, new ChatSocketResponse(
                    requestId,
                    botMessage,
                    null,
                    OffsetDateTime.now().toString()
            ));
        } catch (ChatbotService.GeminiChatException exception) {
            sendResponse(session, new ChatSocketResponse(
                    requestId,
                    null,
                    exception.getMessage(),
                    OffsetDateTime.now().toString()
            ));
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        if (session.isOpen()) {
            session.close(CloseStatus.SERVER_ERROR);
        }
    }

    private void sendResponse(WebSocketSession session, ChatSocketResponse response) throws IOException {
        session.sendMessage(new TextMessage(writeValue(response)));
    }

    private String writeValue(ChatSocketResponse response) throws JsonProcessingException {
        return objectMapper.writeValueAsString(response);
    }
}
