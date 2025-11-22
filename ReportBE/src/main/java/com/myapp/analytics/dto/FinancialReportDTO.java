package com.myapp.analytics.dto;

import lombok.Data;
import java.util.Map;

@Data
public class FinancialReportDTO {
    private double totalIncome;
    private double totalExpense;
    private double balance;
    private Map<String, Double> categorySummary;
    private int month;
    private int year;
}