package com.fintrack.backend.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

// ===================================
// BẮT ĐẦU PHẦN THÊM MỚI
// ===================================
import java.time.LocalDateTime;
// ===================================
// KẾT THÚC PHẦN THÊM MỚI
// ===================================
import java.util.Collection;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users") // Tên bảng trong database
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String fullName;

    @Email
    @NotBlank
    @Column(unique = true) // Email không được trùng
    private String email;

    private String phone;

    @NotBlank
    private String password; // Sẽ được mã hóa

    // ===================================
    // BẮT ĐẦU PHẦN THÊM MỚI
    // ===================================

    @Column(name = "reset_password_token")
    private String resetPasswordToken;

    @Column(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry;

    // ===================================
    // KẾT THÚC PHẦN THÊM MỚI
    // ===================================

    // Các phương thức bắt buộc của UserDetails
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Chúng ta có thể thêm vai trò (ROLE_USER, ROLE_ADMIN) ở đây nếu cần
        return List.of();
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}