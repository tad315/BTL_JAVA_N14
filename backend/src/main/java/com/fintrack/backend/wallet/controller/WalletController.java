package com.fintrack.backend.wallet.controller;

import com.fintrack.backend.wallet.model.Wallet;
import com.fintrack.backend.wallet.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wallets")
@CrossOrigin(origins = "http://localhost:5173") // Cho phép frontend React gọi API
public class WalletController {

    @Autowired
    private WalletService walletService;

    @GetMapping("/{userId}")
    public List<Wallet> getWalletsByUser(@PathVariable Long userId) {
        return walletService.getAllWalletsByUser(userId);
    }

    @PostMapping("/create")
    public Wallet createWallet(@RequestBody Wallet wallet) {
        return walletService.createWallet(wallet);
    }

    @PutMapping("/{walletId}/update-balance")
    public Wallet updateBalance(@PathVariable Long walletId, @RequestParam Double delta) {
        return walletService.updateBalance(walletId, delta);
    }
}
