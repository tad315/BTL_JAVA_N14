package com.myapp.analytics.model;

import jakarta.persistence.*;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "amount", nullable = false)
    private double amount;

    @Column(name = "is_income", nullable = false)
    private boolean isIncome;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "day_of_month", nullable = false)
    private int dayOfMonth;

    @Column(name = "month", nullable = false)
    private int month;

    @Column(name = "year", nullable = false)
    private int year;

    // Constructors, Getters and Setters (giữ nguyên)
    public Transaction() {}

    public Transaction(Long id, double amount, boolean isIncome, String category, int dayOfMonth, int month, int year) {
        this.id = id;
        this.amount = amount;
        this.isIncome = isIncome;
        this.category = category;
        this.dayOfMonth = dayOfMonth;
        this.month = month;
        this.year = year;
    }

    // Getters and Setters (giữ nguyên)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public boolean isIncome() { return isIncome; }
    public void setIncome(boolean income) { isIncome = income; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getDayOfMonth() { return dayOfMonth; }
    public void setDayOfMonth(int dayOfMonth) { this.dayOfMonth = dayOfMonth; }

    public int getMonth() { return month; }
    public void setMonth(int month) { this.month = month; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }
}