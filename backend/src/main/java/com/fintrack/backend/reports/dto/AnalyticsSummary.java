package com.fintrack.backend.reports.dto;

import lombok.Data;
import java.util.Map;

@Data
public class AnalyticsSummary {
    private double totalIncome;
    private double totalExpense;
    private double balance;
    private String period;
    private Map<String, Double> categorySummary;
    private Map<String, Double> percentageSummary;
    private int transactionCount;
    private double averageTransaction;
}