-- ============================================
-- TEST DATA - TÀI KHOẢN TEST
-- ============================================
-- File này tạo tài khoản test để dễ test ứng dụng
-- Password đã được hash bằng BCrypt
-- Mật khẩu gốc: "123456"

USE vissmart;

-- ============================================
-- 1. TẠO TÀI KHOẢN TEST
-- ============================================

-- Tài khoản test 1: test@test.com / 123456
-- Password hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT INTO users (email, password, full_name, phone) 
VALUES (
    'test@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Test User',
    '0123456789'
)
ON DUPLICATE KEY UPDATE email=email;

-- Tài khoản test 2: admin@test.com / 123456
INSERT INTO users (email, password, full_name, phone) 
VALUES (
    'admin@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Admin User',
    '0987654321'
)
ON DUPLICATE KEY UPDATE email=email;

-- Tài khoản test 3: demo@test.com / 123456
INSERT INTO users (email, password, full_name, phone) 
VALUES (
    'demo@test.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Demo User',
    '0111222333'
)
ON DUPLICATE KEY UPDATE email=email;

-- ============================================
-- 2. TẠO DỮ LIỆU MẪU (TÙY CHỌN)
-- ============================================

-- Lấy user_id của test@test.com (thường là 1)
SET @test_user_id = (SELECT id FROM users WHERE email = 'test@test.com' LIMIT 1);

-- Tạo ví mẫu
INSERT INTO wallets (wallet_name, type, balance, user_id, bank_linked, account_name) 
VALUES 
    ('Ví chính', 'Tiền mặt', 5000000, @test_user_id, NULL, NULL),
    ('Tài khoản ngân hàng', 'Ngân hàng', 10000000, @test_user_id, 'Vietcombank', 'Test User')
ON DUPLICATE KEY UPDATE wallet_name=wallet_name;

-- Tạo ngân sách mẫu
INSERT INTO budgets (category, limit_amount, budget_month, spent, user_id) 
VALUES 
    ('Ăn uống', 2000000, '2025-01', 1500000, @test_user_id),
    ('Đi lại', 1000000, '2025-01', 500000, @test_user_id),
    ('Giải trí', 1500000, '2025-01', 800000, @test_user_id)
ON DUPLICATE KEY UPDATE category=category;

-- Tạo giao dịch mẫu
INSERT INTO transactions (transaction_date, description, amount, is_income, category, user_id, wallet_id) 
VALUES 
    (CURDATE(), 'Mua đồ ăn', 50000, 0, 'Ăn uống', @test_user_id, 1),
    (CURDATE(), 'Xăng xe', 200000, 0, 'Đi lại', @test_user_id, 1),
    (CURDATE(), 'Lương tháng', 10000000, 1, 'Thu nhập', @test_user_id, 1),
    (DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Cà phê', 30000, 0, 'Ăn uống', @test_user_id, 1),
    (DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'Xem phim', 150000, 0, 'Giải trí', @test_user_id, 1)
ON DUPLICATE KEY UPDATE description=description;

-- ============================================
-- 3. KIỂM TRA
-- ============================================

SELECT 'Test data created successfully!' AS status;
SELECT id, email, full_name FROM users WHERE email LIKE '%@test.com';

