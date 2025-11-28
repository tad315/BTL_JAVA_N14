package com.fintrack.backend.analysis.dto;

import lombok.Data;

@Data
public class TrendDTO {
    private String period;
    private double income;
    private double expense;
    private double balance;
}