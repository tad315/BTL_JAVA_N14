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

    @Column(name = "budget_month") // tránh lỗi SQL keyword "month"
    private String month;

    @Column(name = "wallet_id")
    private Long walletId;

    // ✅ Thêm cờ "đóng băng" (để không trừ tiền ví nhiều lần)
    @Column(name = "balance_locked")
    private boolean balanceLocked = false;

    // ✅ Nếu bạn muốn lưu lại số dư ví tại thời điểm tạo ngân sách (để hiển thị)
    @Column(name = "initial_balance")
    private Double initialBalance;

    public Budget() {}

    // =======================
    // Getter & Setter cơ bản
    // =======================
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

    // =======================
    // Getter & Setter mở rộng
    // =======================
    public boolean isBalanceLocked() { return balanceLocked; }
    public void setBalanceLocked(boolean balanceLocked) { this.balanceLocked = balanceLocked; }

    public Double getInitialBalance() { return initialBalance; }
    public void setInitialBalance(Double initialBalance) { this.initialBalance = initialBalance; }

}
