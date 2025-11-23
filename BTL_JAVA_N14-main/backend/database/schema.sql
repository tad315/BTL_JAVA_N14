-- ==========================================
-- VISSMART DATABASE SCHEMA
-- ==========================================
-- Database: vissmart
-- Version: 1.0
-- Date: 2025-11-04
-- Description: Schema đơn giản cho dự án Vissmart - Quản lý Tài chính Thông minh
-- ==========================================

-- Tạo database nếu chưa tồn tại
CREATE DATABASE IF NOT EXISTS vissmart CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE vissmart;

-- ==========================================
-- 1. MODULE 1: AUTHENTICATION & AUTHORIZATION
-- ==========================================

-- Bảng Users (Quản lý người dùng)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,  -- BCrypt hashed password
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'USER',  -- USER, ADMIN
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Refresh Tokens (JWT Token Management)
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    expiry_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 2. MODULE 2: TRANSACTION MANAGEMENT
-- ==========================================

-- Bảng Categories (Danh mục chi tiêu)
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NULL,  -- NULL = default category cho tất cả users
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL,  -- INCOME (Thu nhập), EXPENSE (Chi tiêu)
    icon VARCHAR(100),  -- Icon name/material-icon
    color VARCHAR(20),  -- Hex color
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng Transactions (Giao dịch thu chi)
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    wallet_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    type VARCHAR(20) NOT NULL,  -- INCOME, EXPENSE
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_user_id (user_id),
    INDEX idx_wallet_id (wallet_id),
    INDEX idx_category_id (category_id),
    INDEX idx_transaction_date (transaction_date),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 3. MODULE 3: WALLET & ACCOUNT MANAGEMENT
-- ==========================================

-- Bảng Wallets (Ví/Tài khoản)
CREATE TABLE IF NOT EXISTS wallets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    wallet_name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,  -- CASH, BANK, CREDIT_CARD, SAVINGS
    balance DECIMAL(15,2) DEFAULT 0.00,
    bank_linked VARCHAR(100),  -- Tên ngân hàng (VPBank, ViettinBank, etc.)
    account_number VARCHAR(50),
    account_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 4. MODULE 4: BUDGET MANAGEMENT
-- ==========================================

-- Bảng Budgets (Ngân sách)
CREATE TABLE IF NOT EXISTS budgets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    wallet_id BIGINT NOT NULL,
    category VARCHAR(100) NOT NULL,
    limit_amount DECIMAL(15,2) NOT NULL,
    spent DECIMAL(15,2) DEFAULT 0.00,
    budget_month VARCHAR(20) NOT NULL,  -- Format: "MM yyyy" (VD: "11 2025")
    balance_locked BOOLEAN DEFAULT FALSE,
    initial_balance DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_wallet_id (wallet_id),
    INDEX idx_budget_month (budget_month)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 5. MODULE 5: ANALYTICS & REPORTING
-- ==========================================

-- Bảng Reports (Lưu báo cáo đã tạo - tùy chọn)
CREATE TABLE IF NOT EXISTS reports (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    report_type VARCHAR(50) NOT NULL,  -- MONTHLY, YEARLY, CUSTOM
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    file_path VARCHAR(500),  -- Path đến file PDF/CSV nếu export
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_report_type (report_type),
    INDEX idx_period (period_start, period_end)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 6. MODULE 6: AI INTEGRATION
-- ==========================================

-- Bảng AI Chat History (Lịch sử chat với AI - tùy chọn)
CREATE TABLE IF NOT EXISTS ai_chat_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 7. MODULE 7: CONFIGURATION & SETTINGS
-- ==========================================

-- Bảng Notifications (Thông báo)
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,  -- BUDGET_ALERT, TRANSACTION, SYSTEM
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng User Preferences (Cài đặt người dùng)
CREATE TABLE IF NOT EXISTS user_preferences (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    preference_key VARCHAR(100) NOT NULL,
    preference_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_preference (user_id, preference_key),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- INSERT SAMPLE DATA (Để test)
-- ==========================================

-- Insert default categories (cho tất cả users)
INSERT INTO categories (user_id, name, type, icon, color) VALUES
(NULL, 'Lương', 'INCOME', 'work', '#4CAF50'),
(NULL, 'Thưởng', 'INCOME', 'card_giftcard', '#2196F3'),
(NULL, 'Đầu tư', 'INCOME', 'trending_up', '#9C27B0'),
(NULL, 'Ăn uống', 'EXPENSE', 'restaurant', '#FF9800'),
(NULL, 'Sinh hoạt', 'EXPENSE', 'home', '#607D8B'),
(NULL, 'Giải trí', 'EXPENSE', 'movie', '#E91E63'),
(NULL, 'Mua sắm', 'EXPENSE', 'shopping_bag', '#F44336'),
(NULL, 'Y tế', 'EXPENSE', 'local_hospital', '#00BCD4'),
(NULL, 'Giáo dục', 'EXPENSE', 'school', '#3F51B5'),
(NULL, 'Giao thông', 'EXPENSE', 'directions_car', '#795548')
ON DUPLICATE KEY UPDATE name=name;

-- Insert test user (password: "password123" - BCrypt hash)
-- Để test, có thể tạo user với password đơn giản rồi hash bằng BCrypt trong code
INSERT INTO users (email, password, full_name, role) VALUES
('admin@vissmart.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwmKGvHe', 'Admin User', 'ADMIN'),
('user@vissmart.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwmKGvHe', 'Test User', 'USER')
ON DUPLICATE KEY UPDATE email=email;

-- Insert test wallets (cho user_id = 2)
INSERT INTO wallets (user_id, wallet_name, type, balance, bank_linked, account_number, account_name) VALUES
(2, 'Ví tiền mặt', 'CASH', 5000000.00, NULL, NULL, NULL),
(2, 'ViettinBank', 'BANK', 10000000.00, 'ViettinBank', '1234567890', 'Test User'),
(2, 'VPBank', 'BANK', 2000000.00, 'VPBank', '0987654321', 'Test User')
ON DUPLICATE KEY UPDATE wallet_name=wallet_name;

-- Insert test budgets
INSERT INTO budgets (user_id, wallet_id, category, limit_amount, spent, budget_month) VALUES
(2, 2, 'Ăn uống', 2000000.00, 500000.00, '11 2025'),
(2, 2, 'Sinh hoạt', 3000000.00, 1000000.00, '11 2025'),
(2, 2, 'Giải trí', 1000000.00, 200000.00, '11 2025')
ON DUPLICATE KEY UPDATE category=category;

-- Insert test transactions
INSERT INTO transactions (user_id, wallet_id, category_id, type, amount, description, transaction_date) VALUES
(2, 2, 4, 'EXPENSE', 150000.00, 'Ăn tối', '2025-11-04'),
(2, 2, 5, 'EXPENSE', 500000.00, 'Tiền điện', '2025-11-01'),
(2, 2, 1, 'INCOME', 10000000.00, 'Lương tháng 11', '2025-11-01')
ON DUPLICATE KEY UPDATE description=description;

-- ==========================================
-- VERIFICATION QUERIES
-- ==========================================

-- Kiểm tra số bảng đã tạo
-- SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = 'vissmart';

-- Kiểm tra số dòng trong mỗi bảng
-- SELECT 'users' as table_name, COUNT(*) as row_count FROM users
-- UNION ALL SELECT 'wallets', COUNT(*) FROM wallets
-- UNION ALL SELECT 'transactions', COUNT(*) FROM transactions
-- UNION ALL SELECT 'budgets', COUNT(*) FROM budgets
-- UNION ALL SELECT 'categories', COUNT(*) FROM categories;

-- ==========================================
-- END OF SCHEMA
-- ==========================================

