package com.fintrack.backend.wallet.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wallets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String walletName;    // Tên ví (VD: Ví tiền mặt, Ví ngân hàng)
    private String type;          // Loại ví (CASH, BANK, E_WALLET)
    private Double balance;       // Số dư hiện tại

    private Long userId;          // ID người dùng sở hữu ví
    private String bankLinked;    // Mã ngân hàng liên kết (nếu có)
}
