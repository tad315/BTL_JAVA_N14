package com.myapp.analytics.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.myapp.analytics.model.Transaction;
import java.util.List;

public interface AnalyticsRepository extends JpaRepository<Transaction, Long> {

    @Query("SELECT t FROM Transaction t WHERE t.month = :month AND t.year = :year")
    List<Transaction> findByMonthYear(@Param("month") int month, @Param("year") int year);

    @Query(value = "SELECT category, SUM(amount) FROM transactions WHERE is_income = false GROUP BY category", nativeQuery = true)
    List<Object[]> sumExpenseByCategory();

    @Query(value = "SELECT CONCAT(year, '-', LPAD(month, 2, '0')) as period, " +
           "SUM(CASE WHEN is_income = true THEN amount ELSE 0 END) as income, " +
           "SUM(CASE WHEN is_income = false THEN amount ELSE 0 END) as expense " +
           "FROM transactions " +
           "GROUP BY year, month " +
           "ORDER BY year, month", nativeQuery = true)
    List<Object[]> monthlyTrend();

    @Query("SELECT t FROM Transaction t WHERE t.year = :year ORDER BY t.month, t.dayOfMonth")
    List<Transaction> findByYear(@Param("year") int year);
}