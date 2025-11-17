package com.fintrack.backend.budget.model;

import jakarta.persistence.*;

@Entity
@Table(name = "budgets")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;

    @Column(name = "limit_amount")
    private Double limitAmount;

    private Double spent;

    @Column(name = "budget_month")
    private String month;

    @Column(name = "wallet_id")
    private Long walletId;

    public Budget() {}

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getLimitAmount() { return limitAmount; }
    public void setLimitAmount(Double limitAmount) { this.limitAmount = limitAmount; }

    public Double getSpent() { return spent; }
    public void setSpent(Double spent) { this.spent = spent; }

    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }

    public Long getWalletId() { return walletId; }
    public void setWalletId(Long walletId) { this.walletId = walletId; }
}
