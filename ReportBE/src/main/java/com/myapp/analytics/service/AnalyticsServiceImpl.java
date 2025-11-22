package com.myapp.analytics.service;

import com.myapp.analytics.dto.ChartDataDTO;
import com.myapp.analytics.dto.FinancialReportDTO;
import com.myapp.analytics.dto.TrendDTO;
import com.myapp.analytics.repository.AnalyticsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final AnalyticsRepository repo;

    @Override
    public FinancialReportDTO getFinancialReport(int month, int year) {
        System.out.println("Getting financial report for: " + month + "/" + year);

        // Tạm thời trả về dữ liệu mẫu
        FinancialReportDTO dto = new FinancialReportDTO();
        dto.setTotalIncome(15000000);
        dto.setTotalExpense(9909000);
        dto.setBalance(5091000);

        Map<String, Double> categorySummary = new HashMap<>();
        categorySummary.put("Ăn uống", 2345000.0);
        categorySummary.put("Sinh hoạt", 3124000.0);
        categorySummary.put("Đi lại", 997000.0);
        categorySummary.put("Giải trí", 1116000.0);
        categorySummary.put("Giáo dục", 1322000.0);
        categorySummary.put("Y tế", 1005000.0);

        dto.setCategorySummary(categorySummary);
        dto.setMonth(month);
        dto.setYear(year);

        return dto;
    }

    @Override
    public ChartDataDTO getChartData() {
        System.out.println("Getting chart data");

        ChartDataDTO dto = new ChartDataDTO();

        // Dữ liệu mẫu cho biểu đồ tròn
        Map<String, Double> categoryTotals = new HashMap<>();
        categoryTotals.put("Ăn uống", 30.0);
        categoryTotals.put("Sinh hoạt", 25.0);
        categoryTotals.put("Đi lại", 20.0);
        categoryTotals.put("Giải trí", 15.0);
        categoryTotals.put("Giáo dục", 8.0);
        categoryTotals.put("Y tế", 2.0);
        dto.setCategoryTotals(categoryTotals);

        Map<String, Double> monthlyExpenses = new LinkedHashMap<>();
        Map<String, Double> monthlyIncomes = new LinkedHashMap<>();

        String[] months = {"2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06",
                "2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12"};
        double[] expenses = {8.5, 9.2, 8.8, 10.1, 9.5, 11.2, 10.8, 9.9, 12.1, 10.5, 9.8, 11.5};
        double income = 15.0;

        for (int i = 0; i < months.length; i++) {
            monthlyIncomes.put(months[i], income);
            monthlyExpenses.put(months[i], expenses[i]);
        }

        dto.setMonthlyExpenses(monthlyExpenses);
        dto.setMonthlyIncomes(monthlyIncomes);

        return dto;
    }

    @Override
    public List<TrendDTO> getTrendAnalysis() {
        System.out.println("Getting trend analysis");

        List<TrendDTO> trends = new ArrayList<>();
        String[] months = {"2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06",
                "2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12"};
        double[] expenses = {8.5, 9.2, 8.8, 10.1, 9.5, 11.2, 10.8, 9.9, 12.1, 10.5, 9.8, 11.5};
        double income = 15.0;

        for (int i = 0; i < months.length; i++) {
            TrendDTO trend = new TrendDTO();
            trend.setPeriod(months[i]);
            trend.setIncome(income);
            trend.setExpense(expenses[i]);
            trend.setBalance(income - expenses[i]);
            trends.add(trend);
        }

        return trends;
    }

    @Override
    public byte[] exportFinancialReportPdf(int month, int year) {
        System.out.println("Exporting PDF report for: " + month + "/" + year);
        // Tạm thời trả về placeholder
        String pdfContent = "PDF Export - Financial Report " + month + "/" + year + "\n";
        pdfContent += "Total Income: 15,000,000\n";
        pdfContent += "Total Expense: 9,909,000\n";
        pdfContent += "Balance: 5,091,000\n";
        return pdfContent.getBytes();
    }

    @Override
    public byte[] exportFinancialReportCsv(int month, int year) {
        System.out.println("Exporting CSV report for: " + month + "/" + year);
        String csvContent = "Category,Amount\n";
        csvContent += "Ăn uống,2345000\n";
        csvContent += "Sinh hoạt,3124000\n";
        csvContent += "Đi lại,997000\n";
        csvContent += "Giải trí,1116000\n";
        csvContent += "Giáo dục,1322000\n";
        csvContent += "Y tế,1005000\n";
        csvContent += "Total Income,15000000\n";
        csvContent += "Total Expense,9909000\n";
        csvContent += "Balance,5091000\n";
        return csvContent.getBytes();
    }
}