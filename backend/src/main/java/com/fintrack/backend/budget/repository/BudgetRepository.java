package com.fintrack.backend.budget.repository;

import com.fintrack.backend.budget.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUserIdAndMonth(Long userId, String month);

    // Hàm quan trọng để TransactionService tìm ra Budget
    Optional<Budget> findByUserIdAndMonthAndCategory(Long userId, String month, String category);
}