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

    // ============================
    // 1. Tạo ngân sách mới
    // ============================
    public Budget createBudget(Budget budget) {

        // Đảm bảo spent = 0, không bao giờ null
        if (budget.getSpent() == null) {
            budget.setSpent(0.0);
        }

        // Không được đụng ví ở đây!
        // Vì đây chỉ là tạo ngân sách — chưa chi tiêu

        return budgetRepository.save(budget);
    }

    // ============================
    // 2. Cập nhật ngân sách (chỉnh sửa)
    // ============================
    public Budget updateBudget(Long id, Budget updated) {
        Budget existing = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        Long oldWalletId = existing.getWalletId();
        double oldSpent = existing.getSpent() != null ? existing.getSpent() : 0.0;

        Long newWalletId = updated.getWalletId();
        double newSpent = updated.getSpent() != null ? updated.getSpent() : oldSpent;

        existing.setCategory(updated.getCategory());
        existing.setLimitAmount(updated.getLimitAmount());
        existing.setSpent(newSpent);
        existing.setMonth(updated.getMonth());
        existing.setWalletId(newWalletId);

        Budget saved = budgetRepository.save(existing);

        // --- Nếu đổi ví ---
        if (!oldWalletId.equals(newWalletId)) {

            // Hoàn tiền chi cũ về ví cũ
            walletRepository.findById(oldWalletId).ifPresent(wallet -> {
                wallet.setBalance(wallet.getBalance() + oldSpent);
                walletRepository.save(wallet);
            });

            // Trừ lại toàn bộ chi mới từ ví mới
            walletRepository.findById(newWalletId).ifPresent(wallet -> {
                wallet.setBalance(Math.max(wallet.getBalance() - newSpent, 0));
                walletRepository.save(wallet);
            });

        } else {
            // --- Cùng ví: xử lý chênh lệch ---
            double diff = newSpent - oldSpent;
            if (Math.abs(diff) > 0.001) {
                walletRepository.findById(newWalletId).ifPresent(wallet -> {
                    wallet.setBalance(Math.max(wallet.getBalance() - diff, 0));
                    walletRepository.save(wallet);
                });
            }
        }

        return saved;
    }

    // ============================
    // 3. Thêm chi tiêu vào ngân sách có sẵn
    // ============================
    public Budget addSpent(Long id, double amount, String month) {

        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }

        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        double currentSpent = budget.getSpent() != null ? budget.getSpent() : 0.0;
        double newSpent = currentSpent + amount;
        budget.setSpent(newSpent);

        if (month != null && !month.isBlank()) {
            budget.setMonth(month);
        }

        Budget saved = budgetRepository.save(budget);

        walletRepository.findById(budget.getWalletId()).ifPresent(wallet -> {
            wallet.setBalance(Math.max(wallet.getBalance() - amount, 0));
            walletRepository.save(wallet);
        });

        return saved;
    }

    // ============================
    // 4. Xóa ngân sách
    // ============================
    public void deleteBudget(Long id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        double spent = budget.getSpent() != null ? budget.getSpent() : 0.0;

        walletRepository.findById(budget.getWalletId()).ifPresent(wallet -> {
            // Hoàn lại tất cả tiền đã chi
            wallet.setBalance(wallet.getBalance() + spent);
            walletRepository.save(wallet);
        });

        budgetRepository.delete(budget);
    }
}
