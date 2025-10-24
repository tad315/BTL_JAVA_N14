package com.fintrack.backend.wallet.repository;

import com.fintrack.backend.wallet.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WalletRepository extends JpaRepository<Wallet, Long> {
    List<Wallet> findByUserId(Long userId);
}
