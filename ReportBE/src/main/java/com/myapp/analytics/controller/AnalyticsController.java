package com.myapp.analytics.controller;

import com.myapp.analytics.dto.ChartDataDTO;
import com.myapp.analytics.dto.FinancialReportDTO;
import com.myapp.analytics.dto.TrendDTO;
import com.myapp.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin
public class AnalyticsController {

    private final AnalyticsService service;

    @GetMapping("/financial-report")
    public FinancialReportDTO getFinancialReport(
            @RequestParam(defaultValue = "9") int month,
            @RequestParam(defaultValue = "2024") int year
    ) {
        return service.getFinancialReport(month, year);
    }

    @GetMapping("/chart-data")
    public ChartDataDTO getChartData() {
        return service.getChartData();
    }

    @GetMapping("/trend")
    public List<TrendDTO> getTrendAnalysis() {
        return service.getTrendAnalysis();
    }

    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportPdfReport(
            @RequestParam int month,
            @RequestParam int year
    ) {
        byte[] pdfBytes = service.exportFinancialReportPdf(month, year);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=financial-report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportCsvReport(
            @RequestParam int month,
            @RequestParam int year
    ) {
        byte[] csvBytes = service.exportFinancialReportCsv(month, year);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=financial-report.csv")
                .contentType(MediaType.TEXT_PLAIN)
                .body(csvBytes);
    }
}