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

    /**
     * Tạo mới một ngân sách. Nếu chưa có giá trị đã chi (spentAmount) thì mặc định là 0.
     */
    public Budget createBudget(Budget budget) {
        if (budget.getSpent() == null) {
            budget.setSpent(0.0);
        }
        return budgetRepository.save(budget);
    }

    /**
     * Lấy danh sách ngân sách theo ID ví (walletId)
     */
    public List<Budget> getBudgetsByWallet(Long walletId) {
        return budgetRepository.findByWalletId(walletId);
    }

    /**
     * Cập nhật số tiền đã chi của ngân sách (thêm hoặc bớt)
     */
    public Budget updateSpent(Long budgetId, Double delta) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found with id = " + budgetId));

        double newSpent = budget.getSpent() + delta;
        if (newSpent < 0) newSpent = 0; // tránh âm
        budget.setSpent(newSpent);

        return budgetRepository.save(budget);
    }

    /**
     * Trả về danh sách các ngân sách đã vượt giới hạn (spent >= limit)
     */
    public List<Budget> getExceededBudgets(Long walletId) {
        return budgetRepository.findByWalletId(walletId)
                .stream()
                .filter(b -> b.getSpent() >= b.getLimitAmount())
                .collect(Collectors.toList());
    }
}
