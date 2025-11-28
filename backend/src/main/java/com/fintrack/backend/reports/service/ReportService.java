package com.fintrack.backend.reports.service;

import com.fintrack.backend.analysis.dto.FinancialReportDTO;
import com.fintrack.backend.analysis.service.AnalyticsService;
import com.fintrack.backend.analysis.service.ExportService;
import com.fintrack.backend.reports.dto.ReportRequest;
import com.fintrack.backend.reports.model.Report;
import com.fintrack.backend.reports.repository.ReportRepository;
import com.fintrack.backend.auth.models.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    private final ReportRepository reportRepository;
    private final AnalyticsService analyticsService;
    private final ExportService exportService;

    public Report generateFinancialReport(User user, ReportRequest request) {
        try {
            // Sử dụng AnalyticsService để lấy dữ liệu báo cáo
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

            return reportRepository.save(report);
        } catch (Exception e) {
            log.error("Error generating financial report for user {}: {}", user.getId(), e.getMessage());
            throw new RuntimeException("Failed to generate financial report");
        }
    }

    public Report generateBudgetReport(User user, ReportRequest request) {
        try {
            Report report = new Report();
            report.setUser(user);
            report.setReportType("BUDGET");
            report.setPeriodStart(request.getStartDate());
            report.setPeriodEnd(request.getEndDate());
            report.setFilePath("/reports/budget_" + user.getId() + "_" + System.currentTimeMillis() + ".pdf");
            report.setCreatedAt(LocalDateTime.now());

            return reportRepository.save(report);
        } catch (Exception e) {
            log.error("Error generating budget report for user {}: {}", user.getId(), e.getMessage());
            throw new RuntimeException("Failed to generate budget report");
        }
    }

    public Report generateTransactionReport(User user, ReportRequest request) {
        try {
            Report report = new Report();
            report.setUser(user);
            report.setReportType("TRANSACTION");
            report.setPeriodStart(request.getStartDate());
            report.setPeriodEnd(request.getEndDate());
            report.setFilePath("/reports/transaction_" + user.getId() + "_" + System.currentTimeMillis() + ".pdf");
            report.setCreatedAt(LocalDateTime.now());

            return reportRepository.save(report);
        } catch (Exception e) {
            log.error("Error generating transaction report for user {}: {}", user.getId(), e.getMessage());
            throw new RuntimeException("Failed to generate transaction report");
        }
    }

    public byte[] exportToPdf(Report report) {
        try {
            FinancialReportDTO financialData = analyticsService.getFinancialReport(
                    report.getUser().getId(),
                    report.getPeriodStart().getMonthValue(),
                    report.getPeriodStart().getYear()
            );

            return exportService.exportToPdf(financialData);
        } catch (Exception e) {
            log.error("Error exporting PDF for report {}: {}", report.getId(), e.getMessage());
            throw new RuntimeException("PDF export failed");
        }
    }

    public byte[] exportToCsv(Report report) {
        try {
            FinancialReportDTO financialData = analyticsService.getFinancialReport(
                    report.getUser().getId(),
                    report.getPeriodStart().getMonthValue(),
                    report.getPeriodStart().getYear()
            );

            return exportService.exportToCsv(financialData);
        } catch (Exception e) {
            log.error("Error exporting CSV for report {}: {}", report.getId(), e.getMessage());
            throw new RuntimeException("CSV export failed");
        }
    }
}