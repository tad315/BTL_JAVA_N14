package com.fintrack.backend.chat.service;

import com.fintrack.backend.budget.model.Budget;
import com.fintrack.backend.budget.repository.BudgetRepository;
import com.fintrack.backend.chat.dto.AiContextResponse;
import com.fintrack.backend.transaction.model.Transaction;
import com.fintrack.backend.transaction.repository.TransactionRepository;
import com.fintrack.backend.wallet.model.Wallet;
import com.fintrack.backend.wallet.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiContextService {

    private static final Locale VI_LOCALE = new Locale("vi", "VN");

    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final WalletRepository walletRepository;

    public AiContextResponse buildContext(Long userId, String userName) {
        YearMonth currentMonth = YearMonth.now();
        LocalDate monthStart = currentMonth.atDay(1);
        LocalDate monthEnd = currentMonth.atEndOfMonth();

        List<Transaction> monthlyTransactions = transactionRepository
                .findByUserIdAndDateBetweenOrderByDateDesc(userId, monthStart, monthEnd);

        List<Transaction> latestTransactions = transactionRepository
                .findTop5ByUserIdOrderByDateDesc(userId);

        List<Budget> budgets = budgetRepository.findByUserId(userId);
        List<Wallet> wallets = walletRepository.findByUserId(userId);

        BigDecimal totalIncome = monthlyTransactions.stream()
                .filter(Transaction::isIncome)
                .map(Transaction::getAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpense = monthlyTransactions.stream()
                .filter(t -> !t.isIncome())
                .map(Transaction::getAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal net = totalIncome.subtract(totalExpense);
        double savingRate = totalIncome.compareTo(BigDecimal.ZERO) > 0
                ? net.divide(totalIncome, 4, RoundingMode.HALF_UP).doubleValue() * 100
                : 0;

        int dayOfMonth = LocalDate.now().getDayOfMonth();
        double averageDailyExpense = totalExpense.compareTo(BigDecimal.ZERO) > 0
                ? totalExpense.divide(BigDecimal.valueOf(dayOfMonth), 2, RoundingMode.HALF_UP).doubleValue()
                : 0;

        List<AiContextResponse.CategorySpending> categorySpendings = calculateCategorySpendings(monthlyTransactions, totalExpense);
        List<AiContextResponse.BudgetStatus> budgetStatuses = mapBudgets(budgets);
        List<String> alerts = buildAlerts(monthlyTransactions, budgetStatuses, wallets);

        return AiContextResponse.builder()
                .userName(userName)
                .month(formatMonth(currentMonth))
                .summary(AiContextResponse.Summary.builder()
                        .totalIncome(totalIncome.doubleValue())
                        .totalExpense(totalExpense.doubleValue())
                        .netIncome(net.doubleValue())
                        .savingRate(roundTwoDecimals(savingRate))
                        .averageDailyExpense(roundTwoDecimals(averageDailyExpense))
                        .build())
                .recentTransactions(latestTransactions.stream()
                        .map(this::mapTransaction)
                        .toList())
                .topCategories(categorySpendings)
                .budgets(budgetStatuses)
                .wallets(wallets.stream().map(this::mapWallet).toList())
                .alerts(alerts)
                .lastUpdated(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .build();
    }

    private AiContextResponse.TransactionItem mapTransaction(Transaction transaction) {
        return AiContextResponse.TransactionItem.builder()
                .id(transaction.getId())
                .date(transaction.getDate() != null ? transaction.getDate().toString() : null)
                .description(transaction.getDescription())
                .amount(transaction.getAmount() != null ? transaction.getAmount().doubleValue() : 0)
                .income(transaction.isIncome())
                .category(transaction.getCategory())
                .build();
    }

    private AiContextResponse.WalletSummary mapWallet(Wallet wallet) {
        return AiContextResponse.WalletSummary.builder()
                .id(wallet.getId())
                .name(wallet.getWalletName())
                .type(wallet.getType())
                .balance(wallet.getBalance() != null ? wallet.getBalance() : 0)
                .build();
    }

    private List<AiContextResponse.CategorySpending> calculateCategorySpendings(List<Transaction> transactions, BigDecimal totalExpense) {
        if (transactions.isEmpty() || totalExpense.compareTo(BigDecimal.ZERO) <= 0) {
            return List.of();
        }

        Map<String, BigDecimal> spendingMap = transactions.stream()
                .filter(t -> !t.isIncome())
                .collect(Collectors.groupingBy(
                        t -> t.getCategory() != null && !t.getCategory().isEmpty() ? t.getCategory() : "Khác",
                        Collectors.reducing(BigDecimal.ZERO,
                                t -> t.getAmount() != null ? t.getAmount() : BigDecimal.ZERO,
                                BigDecimal::add)
                ));

        return spendingMap.entrySet().stream()
                .sorted(Map.Entry.<String, BigDecimal>comparingByValue(Comparator.reverseOrder()))
                .limit(5)
                .map(entry -> {
                    double percent = entry.getValue()
                            .divide(totalExpense, 4, RoundingMode.HALF_UP)
                            .multiply(BigDecimal.valueOf(100))
                            .doubleValue();
                    return AiContextResponse.CategorySpending.builder()
                            .category(entry.getKey())
                            .amount(entry.getValue().doubleValue())
                            .percentage(roundTwoDecimals(percent))
                            .build();
                })
                .toList();
    }

    private List<AiContextResponse.BudgetStatus> mapBudgets(List<Budget> budgets) {
        return budgets.stream()
                .map(budget -> {
                    double limit = budget.getLimitAmount() != null ? budget.getLimitAmount() : 0;
                    double spent = budget.getSpent() != null ? budget.getSpent() : 0;
                    double utilization = (limit > 0) ? spent / limit : 0;
                    String status;
                    if (limit <= 0) {
                        status = "NO_LIMIT";
                    } else if (utilization >= 1) {
                        status = "OVER_LIMIT";
                    } else if (utilization >= 0.9) {
                        status = "NEAR_LIMIT";
                    } else {
                        status = "ON_TRACK";
                    }

                    return AiContextResponse.BudgetStatus.builder()
                            .id(budget.getId())
                            .category(budget.getCategory())
                            .limitAmount(limit)
                            .spent(spent)
                            .utilization(roundTwoDecimals(utilization * 100))
                            .status(status)
                            .build();
                })
                .collect(Collectors.toList());
    }

    private List<String> buildAlerts(List<Transaction> monthlyTransactions,
                                     List<AiContextResponse.BudgetStatus> budgets,
                                     List<Wallet> wallets) {
        List<String> alerts = new ArrayList<>();

        if (monthlyTransactions.isEmpty()) {
            alerts.add("Tháng này bạn chưa có giao dịch nào, hãy bắt đầu ghi lại để theo dõi chi tiêu.");
        }

        if (wallets.isEmpty()) {
            alerts.add("Bạn chưa tạo ví nào, hãy thêm ít nhất một ví để quản lý số dư.");
        }

        budgets.stream()
                .filter(budget -> "OVER_LIMIT".equals(budget.getStatus()) || "NEAR_LIMIT".equals(budget.getStatus()))
                .forEach(budget -> {
                    if ("OVER_LIMIT".equals(budget.getStatus())) {
                        alerts.add(String.format("Ngân sách \"%s\" đã vượt giới hạn. Đã chi %.0f%% ngân sách.",
                                budget.getCategory(), budget.getUtilization()));
                    } else {
                        alerts.add(String.format("Ngân sách \"%s\" đã dùng %.0f%%. Cân nhắc hạn chế chi thêm.",
                                budget.getCategory(), budget.getUtilization()));
                    }
                });

        return alerts;
    }

    private String formatMonth(YearMonth month) {
        String monthName = month.getMonth().getDisplayName(TextStyle.FULL, VI_LOCALE);
        return monthName.substring(0, 1).toUpperCase(VI_LOCALE) + monthName.substring(1) + " " + month.getYear();
    }

    private double roundTwoDecimals(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}

