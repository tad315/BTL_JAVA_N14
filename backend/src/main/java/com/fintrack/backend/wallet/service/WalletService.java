package com.fintrack.backend.wallet.service;

import com.fintrack.backend.wallet.model.Wallet;
import com.fintrack.backend.wallet.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WalletService {

    @Autowired
    private WalletRepository walletRepository;

    public List<Wallet> getAllWalletsByUser(Long userId) {
        return walletRepository.findByUserId(userId);
    }

    public Wallet createWallet(Wallet wallet) {
        if (wallet.getBalance() == null)
            wallet.setBalance(0.0);
        return walletRepository.save(wallet);
    }

    public Wallet updateBalance(Long walletId, Double delta) {
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        wallet.setBalance(wallet.getBalance() + delta);
        return walletRepository.save(wallet);
    }
}
