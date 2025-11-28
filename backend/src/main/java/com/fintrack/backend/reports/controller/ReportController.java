package com.fintrack.backend.reports.controller;

import com.fintrack.backend.analysis.dto.ChartDataDTO;
import com.fintrack.backend.analysis.dto.FinancialReportDTO;
import com.fintrack.backend.analysis.dto.TrendDTO;
import com.fintrack.backend.analysis.service.AnalyticsService;
import com.fintrack.backend.auth.models.User;
import com.fintrack.backend.auth.repositories.UserRepository;
import com.fintrack.backend.auth.services.JwtService;
import com.fintrack.backend.reports.dto.AnalyticsSummary;
import com.fintrack.backend.reports.dto.ReportRequest;
import com.fintrack.backend.reports.model.Report;
import com.fintrack.backend.reports.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class ReportController {

    private final ReportService reportService;
    private final AnalyticsService analyticsService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    private User getAuthenticatedUser(String token) {
        try {
            String authToken = token.startsWith("Bearer ") ? token.substring(7) : token;

            // Sử dụng extractEmail thay vì extractUsername
            String email = jwtService.extractEmail(authToken);
            Optional<User> userOpt = userRepository.findByEmail(email);

            if (userOpt.isEmpty()) {
                throw new RuntimeException("User not found");
            }

            return userOpt.get();
        } catch (Exception e) {
            log.error("Authentication failed: {}", e.getMessage());
            throw new RuntimeException("Authentication failed");
        }
    }

    @PostMapping("/generate/{reportType}")
    public ResponseEntity<?> generateReport(
            @PathVariable String reportType,
            @RequestBody ReportRequest request,
            @RequestHeader("Authorization") String token) {

        try {
            User user = getAuthenticatedUser(token);

            Report report;
            switch (reportType.toUpperCase()) {
                case "FINANCIAL":
                    report = reportService.generateFinancialReport(user, request);
                    break;
                case "BUDGET":
                    report = reportService.generateBudgetReport(user, request);
                    break;
                case "TRANSACTION":
                    report = reportService.generateTransactionReport(user, request);
                    break;
                default:
                    return ResponseEntity.badRequest().body(Map.of("error", "Invalid report type"));
            }

            return ResponseEntity.ok(report);
        } catch (Exception e) {
            log.error("Error generating report: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/analytics/summary")
    public ResponseEntity<?> getAnalyticsSummary(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestHeader("Authorization") String token) {

        try {
            User user = getAuthenticatedUser(token);

            // Parse dates
            String[] startParts = startDate.split("-");
            int startMonth = Integer.parseInt(startParts[1]);
            int startYear = Integer.parseInt(startParts[0]);

            FinancialReportDTO financialData = analyticsService.getFinancialReport(user.getId(), startMonth, startYear);
            AnalyticsSummary summary = convertToAnalyticsSummary(financialData, startDate, endDate);

            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            log.error("Error getting analytics summary: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/analytics/chart-data")
    public ResponseEntity<?> getChartData(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestHeader("Authorization") String token) {

        try {
            User user = getAuthenticatedUser(token);
            ChartDataDTO chartData = analyticsService.getChartData(user.getId());
            return ResponseEntity.ok(chartData);
        } catch (Exception e) {
            log.error("Error getting chart data: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/analytics/trends")
    public ResponseEntity<?> getTrends(
            @RequestParam(defaultValue = "12") int months,
            @RequestHeader("Authorization") String token) {

        try {
            User user = getAuthenticatedUser(token);
            List<TrendDTO> trendData = analyticsService.getTrendAnalysis(user.getId());
            return ResponseEntity.ok(trendData);
        } catch (Exception e) {
            log.error("Error getting trends: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/export/pdf")
    public ResponseEntity<?> exportPdfReport(
            @RequestParam int month,
            @RequestParam int year,
            @RequestHeader("Authorization") String token) {

        try {
            User user = getAuthenticatedUser(token);
            byte[] pdfBytes = analyticsService.exportFinancialReportPdf(user.getId(), month, year);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=financial-report-" + month + "-" + year + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (Exception e) {
            log.error("Error exporting PDF: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/export/csv")
    public ResponseEntity<?> exportCsvReport(
            @RequestParam int month,
            @RequestParam int year,
            @RequestHeader("Authorization") String token) {

        try {
            User user = getAuthenticatedUser(token);
            byte[] csvBytes = analyticsService.exportFinancialReportCsv(user.getId(), month, year);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=financial-report-" + month + "-" + year + ".csv")
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(csvBytes);
        } catch (Exception e) {
            log.error("Error exporting CSV: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

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