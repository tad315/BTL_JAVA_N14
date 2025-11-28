package com.fintrack.backend.reports.service;

import com.fintrack.backend.analysis.dto.ChartDataDTO;
import com.fintrack.backend.analysis.dto.FinancialReportDTO;
import com.fintrack.backend.analysis.dto.TrendDTO;
import com.fintrack.backend.analysis.service.AnalyticsService;
import com.fintrack.backend.analysis.service.ExportService;
import com.fintrack.backend.auth.models.User;
import com.fintrack.backend.auth.repositories.UserRepository;
import com.fintrack.backend.reports.dto.AnalyticsSummary;
import com.fintrack.backend.reports.dto.ReportRequest;
import com.fintrack.backend.reports.model.Report;
import com.fintrack.backend.reports.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final AnalyticsService analyticsService;
    private final ExportService exportService;

    // Lấy thông tin user hiện tại từ authentication - SỬA LẠI
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        return authentication.getName(); // Trả về email
    }

    // Lấy user hiện tại - SỬA LẠI
    private User getCurrentUser() {
        String email = getCurrentUserEmail();
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with email: " + email);
        }

        return userOpt.get();
    }

    // Tạo báo cáo tài chính
    @Transactional
    public Map<String, Object> generateFinancialReport(ReportRequest request) {
        try {
            User user = getCurrentUser();

            FinancialReportDTO financialData = analyticsService.getFinancialReport(
                    user.getId(),
                    request.getStartDate().getMonthValue(),
                    request.getStartDate().getYear()
            );

            Report report = new Report();
            report.setUser(user);
            report.setReportType("FINANCIAL");
            report.setPeriodStart(request.getStartDate());
            report.setPeriodEnd(request.getEndDate());
            report.setFilePath("/reports/financial_" + user.getId() + "_" + System.currentTimeMillis() + ".pdf");
            report.setCreatedAt(LocalDateTime.now());

            Report savedReport = reportRepository.save(report);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("report", Map.of(
                    "id", savedReport.getId(),
                    "type", savedReport.getReportType(),
                    "periodStart", savedReport.getPeriodStart(),
                    "periodEnd", savedReport.getPeriodEnd(),
                    "createdAt", savedReport.getCreatedAt()
            ));
            response.put("financialData", financialData);

            return response;
        } catch (Exception e) {
            log.error("Error generating financial report: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Lỗi tạo báo cáo tài chính: " + e.getMessage());
            return error;
        }
    }

    // Tạo báo cáo ngân sách
    @Transactional
    public Map<String, Object> generateBudgetReport(ReportRequest request) {
        try {
            User user = getCurrentUser();

            Report report = new Report();
            report.setUser(user);
            report.setReportType("BUDGET");
            report.setPeriodStart(request.getStartDate());
            report.setPeriodEnd(request.getEndDate());
            report.setFilePath("/reports/budget_" + user.getId() + "_" + System.currentTimeMillis() + ".pdf");
            report.setCreatedAt(LocalDateTime.now());

            Report savedReport = reportRepository.save(report);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("report", Map.of(
                    "id", savedReport.getId(),
                    "type", savedReport.getReportType(),
                    "periodStart", savedReport.getPeriodStart(),
                    "periodEnd", savedReport.getPeriodEnd(),
                    "createdAt", savedReport.getCreatedAt()
            ));

            return response;
        } catch (Exception e) {
            log.error("Error generating budget report: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Lỗi tạo báo cáo ngân sách: " + e.getMessage());
            return error;
        }
    }

    // Tạo báo cáo giao dịch
    @Transactional
    public Map<String, Object> generateTransactionReport(ReportRequest request) {
        try {
            User user = getCurrentUser();

            Report report = new Report();
            report.setUser(user);
            report.setReportType("TRANSACTION");
            report.setPeriodStart(request.getStartDate());
            report.setPeriodEnd(request.getEndDate());
            report.setFilePath("/reports/transaction_" + user.getId() + "_" + System.currentTimeMillis() + ".pdf");
            report.setCreatedAt(LocalDateTime.now());

            Report savedReport = reportRepository.save(report);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("report", Map.of(
                    "id", savedReport.getId(),
                    "type", savedReport.getReportType(),
                    "periodStart", savedReport.getPeriodStart(),
                    "periodEnd", savedReport.getPeriodEnd(),
                    "createdAt", savedReport.getCreatedAt()
            ));

            return response;
        } catch (Exception e) {
            log.error("Error generating transaction report: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Lỗi tạo báo cáo giao dịch: " + e.getMessage());
            return error;
        }
    }

    // Lấy tổng quan analytics
    public Map<String, Object> getAnalyticsSummary(String startDate, String endDate) {
        try {
            User user = getCurrentUser();

            // Parse dates
            String[] startParts = startDate.split("-");
            int startMonth = Integer.parseInt(startParts[1]);
            int startYear = Integer.parseInt(startParts[0]);

            FinancialReportDTO financialData = analyticsService.getFinancialReport(user.getId(), startMonth, startYear);
            AnalyticsSummary summary = convertToAnalyticsSummary(financialData, startDate, endDate);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("summary", summary);

            return response;
        } catch (Exception e) {
            log.error("Error getting analytics summary: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Lỗi lấy tổng quan: " + e.getMessage());
            return error;
        }
    }

    // Lấy dữ liệu biểu đồ
    public Map<String, Object> getChartData(String startDate, String endDate) {
        try {
            User user = getCurrentUser();
            ChartDataDTO chartData = analyticsService.getChartData(user.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("chartData", chartData);

            return response;
        } catch (Exception e) {
            log.error("Error getting chart data: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Lỗi lấy dữ liệu biểu đồ: " + e.getMessage());
            return error;
        }
    }

    // Lấy phân tích xu hướng
    public Map<String, Object> getTrendAnalysis(int months) {
        try {
            User user = getCurrentUser();
            List<TrendDTO> trendData = analyticsService.getTrendAnalysis(user.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("trendData", trendData);

            return response;
        } catch (Exception e) {
            log.error("Error getting trend analysis: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Lỗi lấy phân tích xu hướng: " + e.getMessage());
            return error;
        }
    }

    // Xuất PDF
    public Map<String, Object> exportToPdf(int month, int year) {
        try {
            User user = getCurrentUser();
            byte[] pdfBytes = analyticsService.exportFinancialReportPdf(user.getId(), month, year);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("content", pdfBytes);
            response.put("fileName", "financial-report-" + month + "-" + year + ".pdf");
            response.put("contentType", "application/pdf");

            return response;
        } catch (Exception e) {
            log.error("Error exporting PDF: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Lỗi xuất PDF: " + e.getMessage());
            return error;
        }
    }

    // Xuất CSV
    public Map<String, Object> exportToCsv(int month, int year) {
        try {
            User user = getCurrentUser();
            byte[] csvBytes = analyticsService.exportFinancialReportCsv(user.getId(), month, year);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("content", csvBytes);
            response.put("fileName", "financial-report-" + month + "-" + year + ".csv");
            response.put("contentType", "text/csv");

            return response;
        } catch (Exception e) {
            log.error("Error exporting CSV: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Lỗi xuất CSV: " + e.getMessage());
            return error;
        }
    }

    // Lấy lịch sử báo cáo
    public Map<String, Object> getReportHistory() {
        try {
            User user = getCurrentUser();
            List<Report> reports = reportRepository.findByUserOrderByCreatedAtDesc(user);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("reports", reports.stream().map(report -> Map.of(
                    "id", report.getId(),
                    "type", report.getReportType(),
                    "periodStart", report.getPeriodStart(),
                    "periodEnd", report.getPeriodEnd(),
                    "createdAt", report.getCreatedAt(),
                    "filePath", report.getFilePath()
            )).toList());

            return response;
        } catch (Exception e) {
            log.error("Error getting report history: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Lỗi lấy lịch sử báo cáo: " + e.getMessage());
            return error;
        }
    }

    // Helper method để convert FinancialReportDTO sang AnalyticsSummary
    private AnalyticsSummary convertToAnalyticsSummary(FinancialReportDTO financialData, String startDate, String endDate) {
        AnalyticsSummary summary = new AnalyticsSummary();
        summary.setTotalIncome(financialData.getTotalIncome());
        summary.setTotalExpense(financialData.getTotalExpense());
        summary.setBalance(financialData.getBalance());
        summary.setPeriod(financialData.getMonth() + "/" + financialData.getYear());
        summary.setCategorySummary(financialData.getCategorySummary());

        if (financialData.getCategorySummary() != null) {
            summary.setTransactionCount(financialData.getCategorySummary().size());
            double totalExpense = financialData.getTotalExpense();
            if (totalExpense > 0) {
                Map<String, Double> percentageSummary = new HashMap<>();
                for (Map.Entry<String, Double> entry : financialData.getCategorySummary().entrySet()) {
                    double percentage = (entry.getValue() / totalExpense) * 100;
                    percentageSummary.put(entry.getKey(), Math.round(percentage * 10.0) / 10.0);
                }
                summary.setPercentageSummary(percentageSummary);
            }
            summary.setAverageTransaction(totalExpense > 0 ? totalExpense / financialData.getCategorySummary().size() : 0.0);
        }

        return summary;
    }
}