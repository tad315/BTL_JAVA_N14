# 🤖 Hướng dẫn cài đặt Gemini AI Chat

## 📋 Yêu cầu

Để sử dụng tính năng Chat AI, bạn cần có API key từ Google Gemini.

## 🔑 Lấy API Key

1. Truy cập: https://aistudio.google.com/apikey
2. Đăng nhập bằng tài khoản Google
3. Click **"Create API Key"**
4. Copy API key vừa tạo

## ⚙️ Cài đặt

### Bước 1: Tạo file `.env`

Tạo file `.env` trong thư mục `frontend/`:

```bash
cd frontend
```

### Bước 2: Thêm API key vào file `.env`

Tạo file `.env` với nội dung:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

**Ví dụ:**
```env
VITE_GEMINI_API_KEY=AIzaSyBuyIziYiRfOfADiwBjRtXr7U3Hb_VbaCg
```

### Bước 3: Khởi động lại ứng dụng

```bash
# Từ thư mục gốc project
.\stop-all.bat
.\start-all.bat
```

## ✅ Kiểm tra

1. Mở ứng dụng: http://localhost:3001
2. Click vào icon **chat** ở góc dưới bên phải
3. Gửi tin nhắn: "Xin chào!"
4. Nếu nhận được phản hồi → Thành công! 🎉

## 🔒 Bảo mật

- ⚠️ **KHÔNG** commit file `.env` lên GitHub
- ⚠️ **KHÔNG** chia sẻ API key với người khác
- ✅ File `.env` đã được thêm vào `.gitignore` để bảo vệ

## ❓ Xử lý lỗi

### Lỗi: "API key was reported as leaked"

**Nguyên nhân:** API key đã bị lộ trên GitHub hoặc nơi công khai

**Giải pháp:**
1. Vào https://aistudio.google.com/apikey
2. **Delete** API key cũ
3. **Tạo API key mới**
4. Cập nhật file `.env` với key mới
5. Khởi động lại ứng dụng

### Lỗi: "Failed to fetch"

**Nguyên nhân:** API key không hợp lệ hoặc chưa được cấu hình

**Giải pháp:**
1. Kiểm tra file `.env` có tồn tại không
2. Kiểm tra API key có đúng định dạng không
3. Khởi động lại ứng dụng sau khi cập nhật `.env`

### Lỗi: "GoogleGenerativeAI Error"

**Nguyên nhân:** API key đã bị vô hiệu hóa hoặc hết quota

**Giải pháp:**
1. Kiểm tra trạng thái API key tại https://aistudio.google.com/apikey
2. Tạo API key mới nếu cần
3. Cập nhật `.env` và khởi động lại

## 💡 Lưu ý

- API key miễn phí của Gemini có giới hạn request
- Nếu sử dụng nhiều, có thể cần nâng cấp lên gói trả phí
- Mỗi người cần có API key riêng của mình

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Console của trình duyệt (F12) để xem lỗi chi tiết
2. Terminal của frontend để xem log
3. File `.env` có đúng tên và vị trí không

---

**Chúc bạn sử dụng thành công! 🚀**

