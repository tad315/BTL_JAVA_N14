package com.myapp.analytics.service;

import com.myapp.analytics.dto.FinancialReportDTO;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.StringJoiner;

@Service
public class ExportService {

    public byte[] exportToPdf(FinancialReportDTO report) {
        try {
            // Tạm thời sử dụng implementation đơn giản không dùng iText
            // Cho đến khi dependency được resolve
            String pdfContent = generateSimplePdfContent(report);
            return pdfContent.getBytes();
        } catch (Exception e) {
            throw new RuntimeException("PDF export failed", e);
        }
    }

    public byte[] exportToCsv(FinancialReportDTO report) {
        StringJoiner csv = new StringJoiner("\n");
        csv.add("Category,Amount");

        report.getCategorySummary().forEach((category, amount) -> {
            csv.add(category + "," + amount);
        });

        csv.add("Total Income," + report.getTotalIncome());
        csv.add("Total Expense," + report.getTotalExpense());
        csv.add("Balance," + report.getBalance());

        return csv.toString().getBytes();
    }

    private String generateSimplePdfContent(FinancialReportDTO report) {
        StringBuilder pdfContent = new StringBuilder();
        pdfContent.append("Financial Report - ").append(report.getMonth()).append("/").append(report.getYear()).append("\n\n");
        pdfContent.append("Total Income: ").append(report.getTotalIncome()).append("\n");
        pdfContent.append("Total Expense: ").append(report.getTotalExpense()).append("\n");
        pdfContent.append("Balance: ").append(report.getBalance()).append("\n\n");
        pdfContent.append("Category Summary:\n");

        report.getCategorySummary().forEach((category, amount) -> {
            pdfContent.append("- ").append(category).append(": ").append(amount).append("\n");
        });

        return pdfContent.toString();
    }
}