package com.fintrack.backend.budget.service;

import com.fintrack.backend.budget.model.Budget;
import com.fintrack.backend.budget.repository.BudgetRepository;
import com.fintrack.backend.wallet.model.Wallet;
import com.fintrack.backend.wallet.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private WalletRepository walletRepository;

    public List<Budget> getAllBudgets() {
        return budgetRepository.findAll();
    }

    public Budget createBudget(Budget budget) {
        Budget saved = budgetRepository.save(budget);
        walletRepository.findById(budget.getWalletId()).ifPresent(wallet -> {
            double newBalance = wallet.getBalance() - budget.getSpent();
            wallet.setBalance(Math.max(newBalance, 0));
            walletRepository.save(wallet);
        });
        return saved;
    }

    public Budget updateBudget(Long id, Budget updated) {
        Budget existing = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        // ✅ Tính phần chênh lệch đã chi
        double oldSpent = existing.getSpent() != null ? existing.getSpent() : 0.0;
        double newSpent = updated.getSpent() != null ? updated.getSpent() : 0.0;
        double diff = newSpent - oldSpent;

        // ✅ Cập nhật thông tin ngân sách
        existing.setCategory(updated.getCategory());
        existing.setLimitAmount(updated.getLimitAmount());
        existing.setSpent(newSpent);
        existing.setMonth(updated.getMonth());
        existing.setWalletId(updated.getWalletId());

        Budget saved = budgetRepository.save(existing);

        // ✅ Nếu có thay đổi chi tiêu => trừ/cộng đúng phần chênh lệch
        if (Math.abs(diff) > 0.001) {
            walletRepository.findById(updated.getWalletId()).ifPresent(wallet -> {
                double newBalance = wallet.getBalance() - diff;
                wallet.setBalance(Math.max(newBalance, 0));
                walletRepository.save(wallet);
            });
        }

        return saved;
    }


    public void deleteBudget(Long id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        walletRepository.findById(budget.getWalletId()).ifPresent(wallet -> {
            wallet.setBalance(wallet.getBalance() + budget.getSpent());
            walletRepository.save(wallet);
        });
        budgetRepository.delete(budget);
    }
}
