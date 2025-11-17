package com.fintrack.backend.budget.repository;

import com.fintrack.backend.budget.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByWalletId(Long walletId);
}