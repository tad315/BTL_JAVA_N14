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

    private Double spent; // Vẫn giữ cột đã chi để Transaction cộng dồn vào

    @Column(name = "budget_month")
    private String month;

    @Column(name = "user_id")
    private Long userId;

    // --- ĐÃ XÓA walletId ---

    public Budget() {}

    // Getters & Setters (Nhớ xóa get/set của walletId)
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
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}