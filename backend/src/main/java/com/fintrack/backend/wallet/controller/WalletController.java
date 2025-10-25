package com.fintrack.backend.wallet.controller;

import com.fintrack.backend.wallet.model.Wallet;
import com.fintrack.backend.wallet.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wallets")
public class WalletController {

    @Autowired
    private WalletRepository walletRepository;

    @GetMapping
    public List<Wallet> getAll() {
        return walletRepository.findAll();
    }

    @PostMapping
    public Wallet create(@RequestBody Wallet wallet) {
        return walletRepository.save(wallet);
    }

    @GetMapping("/{id}")
    public Wallet getById(@PathVariable Long id) {
        return walletRepository.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        walletRepository.deleteById(id);
    }
}
