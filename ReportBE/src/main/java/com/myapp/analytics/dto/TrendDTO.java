package com.myapp.analytics.dto;

import lombok.Data;

@Data
public class TrendDTO {
    private String period;
    private double income;
    private double expense;
    private double balance;
}