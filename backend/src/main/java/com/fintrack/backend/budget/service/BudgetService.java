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

        // ✅ Chỉ trừ tiền ví nếu chưa trừ và có chi tiêu
        if (!saved.isBalanceLocked() && saved.getSpent() > 0) {
            walletRepository.findById(saved.getWalletId()).ifPresent(wallet -> {
                wallet.setBalance(Math.max(wallet.getBalance() - saved.getSpent(), 0));
                walletRepository.save(wallet);

                // Đánh dấu ngân sách này đã “đóng băng”
                saved.setBalanceLocked(true);
                budgetRepository.save(saved);
            });
        }

        return saved;
    }


    public Budget updateBudget(Long id, Budget updated) {
        Budget existing = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        // Nếu ngân sách này đã “đóng băng” rồi, không trừ lại nữa
        if (existing.isBalanceLocked()) {
            existing.setCategory(updated.getCategory());
            existing.setLimitAmount(updated.getLimitAmount());
            existing.setSpent(updated.getSpent());
            existing.setMonth(updated.getMonth());
            return budgetRepository.save(existing);
        }

        // Nếu chưa “đóng băng” => xử lý chênh lệch chi tiêu
        double oldSpent = existing.getSpent() != null ? existing.getSpent() : 0.0;
        double newSpent = updated.getSpent() != null ? updated.getSpent() : 0.0;
        double diff = newSpent - oldSpent;

        existing.setCategory(updated.getCategory());
        existing.setLimitAmount(updated.getLimitAmount());
        existing.setSpent(newSpent);
        existing.setMonth(updated.getMonth());
        existing.setWalletId(updated.getWalletId());

        Budget saved = budgetRepository.save(existing);

        // Trừ/cộng chênh lệch rồi “đóng băng”
        if (Math.abs(diff) > 0.001) {
            walletRepository.findById(updated.getWalletId()).ifPresent(wallet -> {
                wallet.setBalance(Math.max(wallet.getBalance() - diff, 0));
                walletRepository.save(wallet);
            });
        }

        saved.setBalanceLocked(true);
        return budgetRepository.save(saved);
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
