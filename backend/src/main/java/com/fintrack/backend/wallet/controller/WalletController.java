package com.fintrack.backend.wallet.controller;

import com.fintrack.backend.wallet.model.Wallet;
import com.fintrack.backend.wallet.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wallets")
@CrossOrigin(origins = "http://localhost:3000")
public class WalletController {
    @Autowired
    private WalletRepository walletRepository;

    @GetMapping
    public List<Wallet> getAllWallets() {
        return walletRepository.findAll();
    }

    @PostMapping
    public Wallet createWallet(@RequestBody Wallet wallet) {
        return walletRepository.save(wallet);
    }

    @PutMapping("/{id}")
    public Wallet updateWallet(@PathVariable Long id, @RequestBody Wallet wallet) {
        Wallet existing = walletRepository.findById(id).orElseThrow();
        existing.setWalletName(wallet.getWalletName());
        existing.setType(wallet.getType());
        existing.setBalance(wallet.getBalance());
        existing.setBankLinked(wallet.getBankLinked());
        existing.setAccountNumber(wallet.getAccountNumber());
        existing.setAccountName(wallet.getAccountName());
        return walletRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void deleteWallet(@PathVariable Long id) {
        walletRepository.deleteById(id);
    }
}