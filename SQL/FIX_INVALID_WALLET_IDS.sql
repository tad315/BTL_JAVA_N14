-- ===================================
-- SCRIPT: FIX INVALID WALLET IDS
-- Mục đích: Xóa hoặc cập nhật các giao dịch có wallet_id không tồn tại
-- ===================================

-- 1. KIỂM TRA: Tìm các giao dịch có wallet_id không hợp lệ
SELECT 
    t.id,
    t.transaction_date,
    t.description,
    t.amount,
    t.wallet_id,
    t.user_id
FROM transactions t
LEFT JOIN wallets w ON t.wallet_id = w.id
WHERE w.id IS NULL;

-- 2. XÓA các giao dịch có wallet_id không hợp lệ
-- CẢNH BÁO: Lệnh này sẽ XÓA dữ liệu! Chỉ chạy nếu chắc chắn!
-- DELETE FROM transactions 
-- WHERE wallet_id NOT IN (SELECT id FROM wallets);

-- 3. HOẶC: Cập nhật wallet_id về NULL (nếu muốn giữ lại giao dịch)
-- UPDATE transactions
-- SET wallet_id = NULL
-- WHERE wallet_id NOT IN (SELECT id FROM wallets);

-- ===================================
-- KẾT QUẢ MONG ĐỢI:
-- - Không còn giao dịch nào có wallet_id = 9999 hoặc ID không tồn tại
-- - Frontend sẽ hiển thị "Ví đã xóa" hoặc không hiển thị giao dịch đó
-- ===================================

