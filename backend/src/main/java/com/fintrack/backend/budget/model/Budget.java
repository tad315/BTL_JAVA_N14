package com.fintrack.backend.budget.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "budgets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;       // Danh mục chi tiêu (vd: Ăn uống, Đi lại)
    private Double limitAmount;    // Hạn mức chi tiêu
    private Double spent;          // Đã chi bao nhiêu

    // ⚠️ 'month' là từ khóa SQL -> đổi tên cột để tránh lỗi
    @Column(name = "budget_month")
    private String month;          // Tháng áp dụng (vd: 2025-10)

    private Long walletId;         // ID ví liên kết
}
