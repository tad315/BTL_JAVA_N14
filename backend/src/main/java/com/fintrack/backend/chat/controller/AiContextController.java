package com.fintrack.backend.chat.controller;

import com.fintrack.backend.auth.models.User;
import com.fintrack.backend.chat.dto.AiContextResponse;
import com.fintrack.backend.chat.service.AiContextService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = {"http://localhost:3001", "http://localhost:3002", "http://localhost:5173"})
@RequiredArgsConstructor
@Slf4j
public class AiContextController {

    private final AiContextService aiContextService;

    @GetMapping("/context")
    public ResponseEntity<?> getContext(
            @AuthenticationPrincipal User user,
            @RequestParam(value = "question", required = false) String question
    ) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        if (question != null && !question.isBlank()) {
            log.info("AI context requested by user {} for question: {}", user.getId(), question);
        }

        AiContextResponse context = aiContextService.buildContext(user.getId(), user.getFullName());
        return ResponseEntity.ok(context);
    }
}

