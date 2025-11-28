package com.fintrack.backend.analysis.controller;

import com.fintrack.backend.analysis.dto.ChartDataDTO;
import com.fintrack.backend.analysis.dto.FinancialReportDTO;
import com.fintrack.backend.analysis.dto.TrendDTO;
import com.fintrack.backend.analysis.service.AnalyticsService;
import com.fintrack.backend.analysis.service.AnalyticsServiceImpl;
import com.fintrack.backend.auth.models.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3001", "http://localhost:3002", "http://localhost:5173"})
public class AnalyticsController {

    private final AnalyticsService service;

    @GetMapping("/financial-report")
    public ResponseEntity<?> getFinancialReport(
            @AuthenticationPrincipal User user,
            @RequestParam int month,
            @RequestParam int year,
            @RequestParam(required = false) Long userId
    ) {
        try {
            Long targetUserId = (user != null) ? user.getId() : userId;
            
            if (targetUserId == null) {
                return ResponseEntity.status(401).body("User ID is required");
            }
            
            FinancialReportDTO report = service.getFinancialReport(targetUserId, month, year);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error generating report: " + e.getMessage());
        }
    }

    @GetMapping("/chart-data")
    public ResponseEntity<?> getChartData(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Long userId
    ) {
        try {
            // Ưu tiên lấy từ @AuthenticationPrincipal, nếu không có thì lấy từ param
            Long targetUserId = (user != null) ? user.getId() : userId;
            
            if (targetUserId == null) {
                return ResponseEntity.status(401).body("User ID is required");
            }
            
            ChartDataDTO chartData = service.getChartData(targetUserId);
            return ResponseEntity.ok(chartData);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error getting chart data: " + e.getMessage());
        }
    }

    @GetMapping("/trend")
    public ResponseEntity<?> getTrendAnalysis(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Long userId
    ) {
        try {
            Long targetUserId = (user != null) ? user.getId() : userId;
            
            if (targetUserId == null) {
                return ResponseEntity.status(401).body("User ID is required");
            }
            
            List<TrendDTO> trendData = service.getTrendAnalysis(targetUserId);
            return ResponseEntity.ok(trendData);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error getting trend analysis: " + e.getMessage());
        }
    }

    @GetMapping("/available-periods")
    public ResponseEntity<?> getAvailablePeriods(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            List<String> periods = service.getAvailableReportPeriods(user.getId());
            return ResponseEntity.ok(periods);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error getting available periods: " + e.getMessage());
        }
    }

    @GetMapping("/export/pdf")
    public ResponseEntity<?> exportPdfReport(
            @AuthenticationPrincipal User user,
            @RequestParam int month,
            @RequestParam int year
    ) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            byte[] pdfBytes = service.exportFinancialReportPdf(user.getId(), month, year);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=financial-report-" + month + "-" + year + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error exporting PDF: " + e.getMessage());
        }
    }

    @GetMapping("/export/csv")
    public ResponseEntity<?> exportCsvReport(
            @AuthenticationPrincipal User user,
            @RequestParam int month,
            @RequestParam int year
    ) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            byte[] csvBytes = service.exportFinancialReportCsv(user.getId(), month, year);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=financial-report-" + month + "-" + year + ".csv")
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(csvBytes);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error exporting CSV: " + e.getMessage());
        }
    }

    // Debug endpoint
    @GetMapping("/debug/user-data")
    public ResponseEntity<?> debugUserData(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            if (service instanceof AnalyticsServiceImpl) {
                AnalyticsServiceImpl impl = (AnalyticsServiceImpl) service;
                return ResponseEntity.ok(impl.debugUserData(user.getId()));
            }
            return ResponseEntity.ok().body("Debug service not available");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Debug error: " + e.getMessage());
        }
    }
}