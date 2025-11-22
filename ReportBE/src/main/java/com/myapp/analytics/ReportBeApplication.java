package com.myapp.analytics;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.myapp.analytics")
public class ReportBeApplication {
    public static void main(String[] args) {
        try {
            SpringApplication.run(ReportBeApplication.class, args);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}