package com.fintrack.backend.reports.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ReportRequest {
    private LocalDate startDate;
    private LocalDate endDate;
    private String reportType;
}