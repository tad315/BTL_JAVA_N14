package com.fintrack.backend.analysis.service;

import com.fintrack.backend.analysis.dto.ChartDataDTO;
import com.fintrack.backend.analysis.dto.FinancialReportDTO;
import com.fintrack.backend.analysis.dto.TrendDTO;
import com.fintrack.backend.analysis.repository.AnalyticsRepository;
import com.fintrack.backend.transaction.model.Transaction;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final AnalyticsRepository repo;
    private final ExportService exportService;

    @Override
    public FinancialReportDTO getFinancialReport(Long userId, int month, int year) {
        log.info("Getting financial report for user {} for: {}/{}", userId, month, year);

        // Lấy dữ liệu thật từ database với userId filter
        BigDecimal totalIncome = repo.getTotalIncomeByMonth(userId, month, year);
        BigDecimal totalExpense = repo.getTotalExpenseByMonth(userId, month, year);

        // Xử lý null values và convert sang double
        double incomeValue = totalIncome != null ? totalIncome.doubleValue() : 0.0;
        double expenseValue = totalExpense != null ? totalExpense.doubleValue() : 0.0;
        double balance = incomeValue - expenseValue;

        // Lấy chi tiết theo danh mục
        Map<String, Double> categorySummary = new HashMap<>();
        List<Object[]> categoryResults = repo.getCategoryExpensesByMonth(userId, month, year);

        for (Object[] result : categoryResults) {
            String category = (String) result[0];
            BigDecimal amount = (BigDecimal) result[1];
            if (category != null && amount != null) {
                categorySummary.put(category, amount.doubleValue());
            }
        }

        FinancialReportDTO dto = new FinancialReportDTO();
        dto.setTotalIncome(incomeValue);
        dto.setTotalExpense(expenseValue);
        dto.setBalance(balance);
        dto.setCategorySummary(categorySummary);
        dto.setMonth(month);
        dto.setYear(year);

        log.info("Financial report generated - Income: {}, Expense: {}, Balance: {}, Categories: {}",
                incomeValue, expenseValue, balance, categorySummary.size());

        return dto;
    }

    @Override
    public ChartDataDTO getChartData(Long userId) {
        log.info("Getting chart data for user {} from real database", userId);

        ChartDataDTO dto = new ChartDataDTO();

        // DEBUG: Kiểm tra dữ liệu giao dịch
        List<Transaction> userTransactions = repo.findAllByUserId(userId);
        log.info("DEBUG: User {} has {} transactions", userId, userTransactions.size());

        for (Transaction t : userTransactions) {
            log.info("DEBUG Transaction: id={}, amount={}, category={}, date={}, isIncome={}",
                    t.getId(), t.getAmount(), t.getCategory(), t.getDate(), t.isIncome());
        }

        // Lấy dữ liệu biểu đồ tròn từ tháng hiện tại
        Calendar cal = Calendar.getInstance();
        int currentMonth = cal.get(Calendar.MONTH) + 1;
        int currentYear = cal.get(Calendar.YEAR);

        log.info("DEBUG: Current month/year: {}/{}", currentMonth, currentYear);

        Map<String, Double> categoryTotals = new HashMap<>();
        List<Object[]> categoryResults = repo.getCategoryExpensesByMonth(userId, currentMonth, currentYear);

        log.info("DEBUG: Category results size: {}", categoryResults.size());
        for (Object[] result : categoryResults) {
            String category = (String) result[0];
            BigDecimal amount = (BigDecimal) result[1];
            log.info("DEBUG Category: {} - {}", category, amount);
            if (category != null && amount != null) {
                categoryTotals.put(category, amount.doubleValue());
            }
        }
        dto.setCategoryTotals(categoryTotals);

        // Lấy dữ liệu biểu đồ cột - 12 tháng gần nhất
        Map<String, Double> monthlyExpenses = new LinkedHashMap<>();
        Map<String, Double> monthlyIncomes = new LinkedHashMap<>();

        // Lấy dữ liệu 12 tháng gần nhất
        for (int i = 11; i >= 0; i--) {
            int month = currentMonth - i;
            int year = currentYear;

            if (month <= 0) {
                month += 12;
                year -= 1;
            }

            String period = String.format("%d-%02d", year, month);

            // Lấy tổng thu nhập và chi tiêu cho tháng
            BigDecimal income = repo.getTotalIncomeByMonth(userId, month, year);
            BigDecimal expense = repo.getTotalExpenseByMonth(userId, month, year);

            log.info("DEBUG Monthly Data: {} - Income: {}, Expense: {}", period, income, expense);

            monthlyIncomes.put(period, income != null ? income.doubleValue() : 0.0);
            monthlyExpenses.put(period, expense != null ? expense.doubleValue() : 0.0);
        }

        dto.setMonthlyExpenses(monthlyExpenses);
        dto.setMonthlyIncomes(monthlyIncomes);

        log.info("DEBUG Final Chart Data - Categories: {}, Monthly Expenses: {}, Monthly Incomes: {}",
                categoryTotals.size(), monthlyExpenses.size(), monthlyIncomes.size());

        return dto;
    }

    private List<MonthlyDataDTO> getMonthlyDataForChart(Long userId) {
        List<MonthlyDataDTO> monthlyData = new ArrayList<>();

        // Lấy dữ liệu 12 tháng gần nhất
        Calendar cal = Calendar.getInstance();
        int currentYear = cal.get(Calendar.YEAR);
        int currentMonth = cal.get(Calendar.MONTH) + 1;

        for (int i = 11; i >= 0; i--) {
            int month = currentMonth - i;
            int year = currentYear;

            // Xử lý tràn năm
            if (month <= 0) {
                month += 12;
                year -= 1;
            }

            MonthlyDataDTO monthly = new MonthlyDataDTO();
            monthly.setMonth(String.format("%d-%02d", year, month));

            // Lấy tổng thu nhập và chi tiêu cho tháng
            BigDecimal income = repo.getTotalIncomeByMonth(userId, month, year);
            BigDecimal expense = repo.getTotalExpenseByMonth(userId, month, year);

            monthly.setIncome(income != null ? income.doubleValue() : 0.0);
            monthly.setExpense(expense != null ? expense.doubleValue() : 0.0);

            monthlyData.add(monthly);
        }

        return monthlyData;
    }

    @Override
    public List<TrendDTO> getTrendAnalysis(Long userId) {
        log.info("Getting trend analysis for user {} from real database", userId);

        List<TrendDTO> trends = new ArrayList<>();
        List<Object[]> trendResults = repo.getMonthlyTrend(userId);

        for (Object[] result : trendResults) {
            String period = (String) result[0];
            BigDecimal income = (BigDecimal) result[1];
            BigDecimal expense = (BigDecimal) result[2];

            double incomeValue = income != null ? income.doubleValue() : 0.0;
            double expenseValue = expense != null ? expense.doubleValue() : 0.0;
            double balance = incomeValue - expenseValue;

            TrendDTO trend = new TrendDTO();
            trend.setPeriod(period);
            trend.setIncome(incomeValue);
            trend.setExpense(expenseValue);
            trend.setBalance(balance);
            trends.add(trend);
        }

        log.info("Trend analysis generated - {} periods", trends.size());

        return trends;
    }

    @Override
    public List<String> getAvailableReportPeriods(Long userId) {
        List<String> periods = new ArrayList<>();
        List<Integer> years = repo.findAvailableYears(userId);

        for (Integer year : years) {
            List<Integer> months = repo.findAvailableMonthsByYear(userId, year);
            for (Integer month : months) {
                periods.add(String.format("%d-%02d", year, month));
            }
        }

        return periods.stream()
                .sorted(Collections.reverseOrder())
                .collect(Collectors.toList());
    }

    @Override
    public byte[] exportFinancialReportPdf(Long userId, int month, int year) {
        log.info("Exporting PDF report for user {} for: {}/{}", userId, month, year);
        FinancialReportDTO report = getFinancialReport(userId, month, year);
        return exportService.exportToPdf(report);
    }

    @Override
    public byte[] exportFinancialReportCsv(Long userId, int month, int year) {
        log.info("Exporting CSV report for user {} for: {}/{}", userId, month, year);
        FinancialReportDTO report = getFinancialReport(userId, month, year);
        return exportService.exportToCsv(report);
    }

    // Debug method
    public Map<String, Object> debugUserData(Long userId) {
        Map<String, Object> debugInfo = new HashMap<>();

        // Count transactions
        Long totalCount = repo.countByUserId(userId);
        debugInfo.put("totalTransactions", totalCount);

        // Get all user transactions
        List<Transaction> userTransactions = repo.findAllByUserId(userId);
        debugInfo.put("userTransactions", userTransactions);

        // Check current month data
        Calendar cal = Calendar.getInstance();
        int currentMonth = cal.get(Calendar.MONTH) + 1;
        int currentYear = cal.get(Calendar.YEAR);

        BigDecimal currentIncome = repo.getTotalIncomeByMonth(userId, currentMonth, currentYear);
        BigDecimal currentExpense = repo.getTotalExpenseByMonth(userId, currentMonth, currentYear);

        debugInfo.put("currentMonth", currentMonth);
        debugInfo.put("currentYear", currentYear);
        debugInfo.put("currentIncome", currentIncome);
        debugInfo.put("currentExpense", currentExpense);

        // Check chart data
        List<MonthlyDataDTO> monthlyData = getMonthlyDataForChart(userId);
        debugInfo.put("monthlyChartData", monthlyData);

        return debugInfo;
    }

    // Inner class for monthly data
    @Data
    public static class MonthlyDataDTO {
        private String month;
        private Double income;
        private Double expense;
    }
}