package com.fintrack.backend.wallet.model;

import jakarta.persistence.*;

@Entity
@Table(name = "wallets")
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String walletName;     // Tên ví
    private String type;           // Loại ví (tiền mặt, ngân hàng,...)
    private Double balance = 0.0;  // Số dư
    private Long userId;           // Liên kết người dùng

    private String bankLinked;     // Ngân hàng liên kết (VD: VPBank)
    private String accountNumber;  // Số tài khoản
    private String accountName;    // Tên chủ tài khoản

    public Wallet() {}

    // ===== Getter & Setter =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getWalletName() { return walletName; }
    public void setWalletName(String walletName) { this.walletName = walletName; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Double getBalance() { return balance; }
    public void setBalance(Double balance) { this.balance = balance; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getBankLinked() { return bankLinked; }
    public void setBankLinked(String bankLinked) { this.bankLinked = bankLinked; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getAccountName() { return accountName; }
    public void setAccountName(String accountName) { this.accountName = accountName; }
}
