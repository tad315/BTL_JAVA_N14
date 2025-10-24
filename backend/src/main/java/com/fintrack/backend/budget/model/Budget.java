package com.fintrack.backend.budget.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

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

    private Long userId;          // người dùng tạo ngân sách
    private String category;      // danh mục chi tiêu (VD: Food, Travel, Bills)
    private Double limitAmount;   // giới hạn ngân sách
    private Double spentAmount;   // số tiền đã chi
    private LocalDate startDate;  // ngày bắt đầu
    private LocalDate endDate;    // ngày kết thúc

    // ✅ Tự động khởi tạo mặc định
    @PrePersist
    public void onCreate() {
        if (spentAmount == null) spentAmount = 0.0;
    }
}
