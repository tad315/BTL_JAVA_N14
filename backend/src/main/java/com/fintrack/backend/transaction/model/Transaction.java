package com.fintrack.backend.transaction.model;

import com.fasterxml.jackson.annotation.JsonProperty; // <--- 1. IMPORT MỚI
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    private String description;

    @Column(precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "is_income")
    @JsonProperty("isIncome")
    private boolean isIncome;

    private String category;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "wallet_id")
    private Long walletId;
}