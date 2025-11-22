package com.myapp.analytics.service;

import com.myapp.analytics.dto.ChartDataDTO;
import com.myapp.analytics.dto.FinancialReportDTO;
import com.myapp.analytics.dto.TrendDTO;
import java.util.List;

public interface AnalyticsService {
    FinancialReportDTO getFinancialReport(int month, int year);
    ChartDataDTO getChartData();
    List<TrendDTO> getTrendAnalysis();

    byte[] exportFinancialReportPdf(int month, int year);
    byte[] exportFinancialReportCsv(int month, int year);
}