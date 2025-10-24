package com.fintrack.backend.budget.service;

import com.fintrack.backend.budget.model.Budget;
import com.fintrack.backend.budget.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    public Budget createBudget(Budget budget) {
        if (budget.getSpentAmount() == null)
            budget.setSpentAmount(0.0);
        return budgetRepository.save(budget);
    }

    public List<Budget> getBudgetsByUser(Long userId) {
        return budgetRepository.findByUserId(userId);
    }

    public Budget updateSpent(Long budgetId, Double delta) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        budget.setSpentAmount(budget.getSpentAmount() + delta);
        return budgetRepository.save(budget);
    }

    // Danh sách ngân sách đã vượt quá giới hạn
    public List<Budget> getExceededBudgets(Long userId) {
        return budgetRepository.findByUserId(userId)
                .stream()
                .filter(b -> b.getSpentAmount() >= b.getLimitAmount())
                .collect(Collectors.toList());
    }
}
