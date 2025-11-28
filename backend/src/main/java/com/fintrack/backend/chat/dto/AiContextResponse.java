package com.fintrack.backend.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiContextResponse {

    private String userName;
    private String month;
    private Summary summary;
    private List<TransactionItem> recentTransactions;
    private List<CategorySpending> topCategories;
    private List<BudgetStatus> budgets;
    private List<WalletSummary> wallets;
    private List<String> alerts;
    private String lastUpdated;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Summary {
        private double totalIncome;
        private double totalExpense;
        private double netIncome;
        private double savingRate;
        private double averageDailyExpense;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TransactionItem {
        private Long id;
        private String date;
        private String description;
        private double amount;
        private boolean income;
        private String category;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategorySpending {
        private String category;
        private double amount;
        private double percentage;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BudgetStatus {
        private Long id;
        private String category;
        private double limitAmount;
        private double spent;
        private double utilization;
        private String status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WalletSummary {
        private Long id;
        private String name;
        private String type;
        private double balance;
    }
}

