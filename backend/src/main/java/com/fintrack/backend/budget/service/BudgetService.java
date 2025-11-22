package com.fintrack.backend.budget.service;

import com.fintrack.backend.budget.model.Budget;
import com.fintrack.backend.budget.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    public List<Budget> getBudgets(Long userId, String month) {
        return budgetRepository.findByUserIdAndMonth(userId, month);
    }

    public List<Budget> getAllBudgets() {
        return budgetRepository.findAll();
    }

    @Transactional
    public Budget createBudget(Budget budget) {
        if (budget.getSpent() == null) budget.setSpent(0.0);
        if (budget.getUserId() == null) budget.setUserId(1L);
        return budgetRepository.save(budget);
    }

    @Transactional
    public Budget updateBudget(Long id, Budget updated) {
        Budget existing = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        // Chỉ cho sửa thông tin kế hoạch
        existing.setCategory(updated.getCategory());
        existing.setLimitAmount(updated.getLimitAmount());
        existing.setMonth(updated.getMonth());

        // Không cho sửa tay 'spent' và không xử lý ví
        return budgetRepository.save(existing);
    }

    @Transactional
    public void deleteBudget(Long id) {
        budgetRepository.deleteById(id);
    }
}