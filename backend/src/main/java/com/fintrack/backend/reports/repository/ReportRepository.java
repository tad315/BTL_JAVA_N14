package com.fintrack.backend.reports.repository;

import com.fintrack.backend.reports.model.Report;
import com.fintrack.backend.auth.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByUserOrderByCreatedAtDesc(User user);
    List<Report> findByUserAndReportTypeOrderByCreatedAtDesc(User user, String reportType);
}