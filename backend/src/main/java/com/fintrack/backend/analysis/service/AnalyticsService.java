package com.fintrack.backend.analysis.service;

import com.fintrack.backend.analysis.dto.ChartDataDTO;
import com.fintrack.backend.analysis.dto.FinancialReportDTO;
import com.fintrack.backend.analysis.dto.TrendDTO;
import java.util.List;

public interface AnalyticsService {
    FinancialReportDTO getFinancialReport(Long userId, int month, int year);
    ChartDataDTO getChartData(Long userId);
    List<TrendDTO> getTrendAnalysis(Long userId);
    List<String> getAvailableReportPeriods(Long userId);

    byte[] exportFinancialReportPdf(Long userId, int month, int year);
    byte[] exportFinancialReportCsv(Long userId, int month, int year);
}