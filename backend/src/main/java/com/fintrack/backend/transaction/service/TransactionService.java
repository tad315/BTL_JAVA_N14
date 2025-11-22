package com.fintrack.backend.transaction.service;

import com.fintrack.backend.budget.model.Budget;
import com.fintrack.backend.budget.repository.BudgetRepository;
import com.fintrack.backend.transaction.model.Transaction;
import com.fintrack.backend.transaction.repository.TransactionRepository;
import com.fintrack.backend.wallet.model.Wallet;
import com.fintrack.backend.wallet.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private WalletRepository walletRepository;
    @Autowired
    private BudgetRepository budgetRepository;

    // Lấy danh sách giao dịch (Tìm kiếm + Phân trang)
    public org.springframework.data.domain.Page<Transaction> getTransactions(Long userId, String searchTerm, org.springframework.data.domain.Pageable pageable) {
        if (searchTerm != null && !searchTerm.isEmpty()) {
            return transactionRepository.searchTransactions(userId, searchTerm, pageable);
        }
        return transactionRepository.findByUserId(userId, pageable);
    }

    // === 1. TẠO GIAO DỊCH MỚI ===
    @Transactional
    public Transaction createTransaction(Transaction transaction) {
        if (transaction.getUserId() == null) transaction.setUserId(1L);

        // A. Lưu Giao dịch
        Transaction saved = transactionRepository.save(transaction);

        // B. Xử lý Tiền Ví (Mới)
        if (transaction.getWalletId() != null) {
            walletRepository.findById(transaction.getWalletId()).ifPresent(wallet -> {
                if (transaction.isIncome()) {
                    wallet.setBalance(wallet.getBalance() + transaction.getAmount().doubleValue());
                } else {
                    wallet.setBalance(wallet.getBalance() - transaction.getAmount().doubleValue());
                }
                walletRepository.save(wallet);
            });
        }

        // C. Cập nhật Ngân sách (Chỉ cộng dồn nếu là Chi tiêu)
        if (!transaction.isIncome()) {
            try {
                String currentMonth = transaction.getDate().toString().substring(0, 7);
                budgetRepository.findByUserIdAndMonthAndCategory(
                        transaction.getUserId(),
                        currentMonth,
                        transaction.getCategory()
                ).ifPresent(budget -> {
                    double oldSpent = budget.getSpent() != null ? budget.getSpent() : 0.0;
                    budget.setSpent(oldSpent + transaction.getAmount().doubleValue());
                    budgetRepository.save(budget);
                });
            } catch (Exception e) {
                System.err.println("Lỗi cập nhật ngân sách: " + e.getMessage());
            }
        }
        return saved;
    }

    // === 2. CẬP NHẬT GIAO DỊCH (Hàm này bạn đang thiếu) ===
    @Transactional
    public Transaction updateTransaction(Long id, Transaction details) {
        Transaction existing = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Giao dịch không tồn tại"));

        // --- BƯỚC 1: HOÀN TÁC DỮ LIỆU CŨ (Revert Old) ---

        // 1.1. Hoàn tiền Ví cũ (Đảo ngược thao tác cũ)
        if (existing.getWalletId() != null) {
            walletRepository.findById(existing.getWalletId()).ifPresent(w -> {
                if (existing.isIncome()) {
                    // Cũ là thu nhập -> Giờ trừ đi
                    w.setBalance(w.getBalance() - existing.getAmount().doubleValue());
                } else {
                    // Cũ là chi tiêu -> Giờ cộng lại
                    w.setBalance(w.getBalance() + existing.getAmount().doubleValue());
                }
                walletRepository.save(w);
            });
        }

        // 1.2. Trừ lại Ngân sách cũ (nếu cũ là chi tiêu)
        if (!existing.isIncome()) {
            try {
                String oldMonth = existing.getDate().toString().substring(0, 7);
                budgetRepository.findByUserIdAndMonthAndCategory(existing.getUserId(), oldMonth, existing.getCategory())
                        .ifPresent(b -> {
                            double spent = b.getSpent() != null ? b.getSpent() : 0.0;
                            b.setSpent(Math.max(0, spent - existing.getAmount().doubleValue()));
                            budgetRepository.save(b);
                        });
            } catch (Exception e) {}
        }

        // --- BƯỚC 2: CẬP NHẬT THÔNG TIN MỚI ---
        existing.setDate(details.getDate());
        existing.setDescription(details.getDescription());
        existing.setAmount(details.getAmount());
        existing.setCategory(details.getCategory());
        existing.setIncome(details.isIncome());
        existing.setWalletId(details.getWalletId());

        // --- BƯỚC 3: ÁP DỤNG DỮ LIỆU MỚI (Apply New) ---

        // 3.1. Trừ/Cộng tiền Ví mới
        if (existing.getWalletId() != null) {
            walletRepository.findById(existing.getWalletId()).ifPresent(w -> {
                if (existing.isIncome()) {
                    w.setBalance(w.getBalance() + existing.getAmount().doubleValue());
                } else {
                    w.setBalance(w.getBalance() - existing.getAmount().doubleValue());
                }
                walletRepository.save(w);
            });
        }

        // 3.2. Cộng dồn Ngân sách mới
        if (!existing.isIncome()) {
            try {
                String newMonth = existing.getDate().toString().substring(0, 7);
                budgetRepository.findByUserIdAndMonthAndCategory(existing.getUserId(), newMonth, existing.getCategory())
                        .ifPresent(b -> {
                            double spent = b.getSpent() != null ? b.getSpent() : 0.0;
                            b.setSpent(spent + existing.getAmount().doubleValue());
                            budgetRepository.save(b);
                        });
            } catch (Exception e) {}
        }

        return transactionRepository.save(existing);
    }

    // === 3. XÓA GIAO DỊCH (HOÀN LẠI TIỀN) ===
    @Transactional
    public void deleteTransaction(Long id) {
        Transaction t = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Giao dịch không tồn tại"));

        // A. Hoàn tiền Ví
        if (t.getWalletId() != null) {
            walletRepository.findById(t.getWalletId()).ifPresent(w -> {
                if (t.isIncome()) {
                    w.setBalance(w.getBalance() - t.getAmount().doubleValue());
                } else {
                    w.setBalance(w.getBalance() + t.getAmount().doubleValue());
                }
                walletRepository.save(w);
            });
        }

        // B. Trừ lại Ngân sách
        if (!t.isIncome()) {
            try {
                String month = t.getDate().toString().substring(0, 7);
                budgetRepository.findByUserIdAndMonthAndCategory(t.getUserId(), month, t.getCategory())
                        .ifPresent(b -> {
                            double spent = b.getSpent() != null ? b.getSpent() : 0.0;
                            b.setSpent(Math.max(0, spent - t.getAmount().doubleValue()));
                            budgetRepository.save(b);
                        });
            } catch (Exception e) {}
        }
        transactionRepository.deleteById(id);
    }
}