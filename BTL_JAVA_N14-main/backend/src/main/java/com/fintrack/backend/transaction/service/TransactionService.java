package com.fintrack.backend.transaction.service;

import com.fintrack.backend.budget.repository.BudgetRepository;
import com.fintrack.backend.transaction.model.Transaction;
import com.fintrack.backend.transaction.repository.TransactionRepository;
import com.fintrack.backend.wallet.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private WalletRepository walletRepository;
    @Autowired
    private BudgetRepository budgetRepository;

    public org.springframework.data.domain.Page<Transaction> getTransactions(Long userId, String searchTerm, org.springframework.data.domain.Pageable pageable) {
        if (searchTerm != null && !searchTerm.isEmpty()) {
            return transactionRepository.searchTransactions(userId, searchTerm, pageable);
        }
        return transactionRepository.findByUserId(userId, pageable);
    }

    // === 1. TẠO GIAO DỊCH ===
    @Transactional
    public Transaction createTransaction(Transaction transaction) {
        if (transaction.getUserId() == null) transaction.setUserId(1L); // Nên lấy từ Token thay vì hardcode 1L

        Transaction saved = transactionRepository.save(transaction);

        // Cập nhật ví
        if (transaction.getWalletId() != null) {
            walletRepository.findById(transaction.getWalletId()).ifPresent(wallet -> {
                double amount = transaction.getAmount().doubleValue();
                if (transaction.isIncome()) {
                    wallet.setBalance(wallet.getBalance() + amount);
                } else {
                    wallet.setBalance(wallet.getBalance() - amount);
                }
                walletRepository.save(wallet);
            });
        }

        // Cập nhật ngân sách
        updateBudget(transaction, false); // false = cộng dồn (chi tiêu mới)

        return saved;
    }

    // === 2. CẬP NHẬT GIAO DỊCH ===
    @Transactional
    public Transaction updateTransaction(Long id, Transaction details) {
        Transaction existing = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Giao dịch không tồn tại"));

        // 1. Hoàn tác dữ liệu cũ (Revert)
        // Hoàn tiền ví cũ
        if (existing.getWalletId() != null) {
            walletRepository.findById(existing.getWalletId()).ifPresent(w -> {
                double amount = existing.getAmount().doubleValue();
                if (existing.isIncome()) w.setBalance(w.getBalance() - amount);
                else w.setBalance(w.getBalance() + amount);
                walletRepository.save(w);
            });
        }
        // Hoàn ngân sách cũ
        updateBudget(existing, true); // true = trừ đi (hoàn tác)

        // 2. Cập nhật thông tin mới
        existing.setDate(details.getDate());
        existing.setDescription(details.getDescription());
        existing.setAmount(details.getAmount());
        existing.setCategory(details.getCategory());
        existing.setIncome(details.isIncome());
        existing.setWalletId(details.getWalletId());

        // 3. Áp dụng dữ liệu mới
        // Trừ ví mới
        if (existing.getWalletId() != null) {
            walletRepository.findById(existing.getWalletId()).ifPresent(w -> {
                double amount = existing.getAmount().doubleValue();
                if (existing.isIncome()) w.setBalance(w.getBalance() + amount);
                else w.setBalance(w.getBalance() - amount);
                walletRepository.save(w);
            });
        }
        // Cộng ngân sách mới
        updateBudget(existing, false);

        return transactionRepository.save(existing);
    }

    // === 3. XÓA GIAO DỊCH (SỬA LỖI Ở ĐÂY) ===
    @Transactional
    public void deleteTransaction(Long id) {
        Transaction t = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Giao dịch không tồn tại"));

        // 1. Hoàn tiền vào ví
        if (t.getWalletId() != null) {
            walletRepository.findById(t.getWalletId()).ifPresent(w -> {
                double amount = t.getAmount().doubleValue();
                // Nếu là thu nhập -> Xóa đi thì phải trừ tiền trong ví
                if (t.isIncome()) {
                    w.setBalance(w.getBalance() - amount);
                }
                // Nếu là chi tiêu -> Xóa đi thì phải cộng lại tiền vào ví
                else {
                    w.setBalance(w.getBalance() + amount);
                }
                walletRepository.save(w);
            });
        }

        // 2. Trừ bớt tiền đã chi trong Ngân sách
        // (Chỉ áp dụng với khoản Chi tiêu, không áp dụng Thu nhập)
        updateBudget(t, true); // true = isRevert (Trừ đi)

        transactionRepository.deleteById(id);
    }

    // === HÀM PHỤ TRỢ: CẬP NHẬT NGÂN SÁCH CHUNG ===
    // isRevert = true -> Trừ đi số tiền (Dùng khi Xóa hoặc Sửa cái cũ)
    // isRevert = false -> Cộng thêm số tiền (Dùng khi Tạo mới hoặc Sửa cái mới)
    private void updateBudget(Transaction t, boolean isRevert) {
        if (t.isIncome()) return; // Thu nhập không ảnh hưởng ngân sách

        try {
            // Lấy tháng dạng YYYY-MM
            String month = t.getDate().toString().substring(0, 7);

            // Trim() category để tránh lỗi thừa khoảng trắng
            String category = t.getCategory().trim();

            budgetRepository.findByUserIdAndMonthAndCategory(t.getUserId(), month, category)
                    .ifPresent(b -> {
                        double currentSpent = b.getSpent() != null ? b.getSpent() : 0.0;
                        double amount = t.getAmount().doubleValue();

                        if (isRevert) {
                            // Trừ đi (khi xóa giao dịch)
                            b.setSpent(Math.max(0, currentSpent - amount));
                            System.out.println("Đã trừ ngân sách: " + category + " | -" + amount);
                        } else {
                            // Cộng thêm (khi tạo giao dịch)
                            b.setSpent(currentSpent + amount);
                            System.out.println("Đã cộng ngân sách: " + category + " | +" + amount);
                        }
                        budgetRepository.save(b);
                    });
        } catch (Exception e) {
            System.err.println("Lỗi cập nhật ngân sách: " + e.getMessage());
        }
    }
}