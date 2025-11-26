-- ============================================
-- CLEAN_TEST_DATA.sql
-- Xóa dữ liệu mẫu được insert bởi TEST_DATA.sql
-- ============================================
USE vissmart;

SET @test_user_id = (SELECT id FROM users WHERE email = 'test@test.com');
SET @admin_user_id = (SELECT id FROM users WHERE email = 'admin@test.com');
SET @demo_user_id = (SELECT id FROM users WHERE email = 'demo@test.com');

-- Xóa transactions mẫu
DELETE FROM transactions WHERE user_id IN (@test_user_id, @admin_user_id, @demo_user_id);

-- Xóa budgets mẫu
DELETE FROM budgets WHERE user_id IN (@test_user_id, @admin_user_id, @demo_user_id);

-- Xóa wallets mẫu
DELETE FROM wallets WHERE user_id IN (@test_user_id, @admin_user_id, @demo_user_id);

-- (Tùy chọn) Xóa luôn user mẫu
-- DELETE FROM users WHERE id IN (@test_user_id, @admin_user_id, @demo_user_id);

SELECT 'CLEAN_TEST_DATA completed' AS status;

