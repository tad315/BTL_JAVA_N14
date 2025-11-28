# 🔑 Hướng dẫn cấu hình Gemini API Key

## ⚠️ QUAN TRỌNG: BẢO MẬT API KEY

**KHÔNG BAO GIỜ** commit API key lên Git hoặc chia sẻ công khai!

---

## 📝 Các bước cấu hình:

### 1. Lấy API Key miễn phí

Truy cập: https://makersuite.google.com/app/apikey

- Đăng nhập bằng tài khoản Google
- Click "Create API Key"
- Copy API key vừa tạo

### 2. Tạo file `.env` trong thư mục `frontend/`

```bash
cd frontend
cp .env.example .env
```

### 3. Mở file `.env` và thêm API key của bạn

```env
VITE_GEMINI_API_KEY=AIzaSy...your_real_key_here
```

### 4. Khởi động lại frontend

```bash
npm run dev
```

---

## 🔒 Bảo mật

✅ File `.env` đã được thêm vào `.gitignore`  
✅ API key KHÔNG được hardcode trong source code  
✅ Chỉ dùng environment variables  

---

## ❓ Nếu gặp lỗi

### Lỗi: "API key chưa được cấu hình"

**Nguyên nhân:** File `.env` chưa được tạo hoặc thiếu `VITE_GEMINI_API_KEY`

**Giải pháp:**
1. Kiểm tra file `frontend/.env` có tồn tại không
2. Kiểm tra tên biến phải chính xác: `VITE_GEMINI_API_KEY`
3. Khởi động lại Vite dev server (Ctrl+C rồi `npm run dev`)

### Lỗi: "403 Forbidden" hoặc "Invalid API Key"

**Nguyên nhân:** API key không hợp lệ hoặc đã hết hạn

**Giải pháp:**
1. Tạo API key mới tại https://makersuite.google.com/app/apikey
2. Cập nhật vào file `.env`
3. Khởi động lại server

### Lỗi: "429 Too Many Requests"

**Nguyên nhân:** Vượt quá giới hạn miễn phí

**Giải pháp:**
- Đợi vài phút rồi thử lại
- Hoặc tạo API key mới với tài khoản Google khác

---

## 📊 Giới hạn miễn phí của Gemini API

- **60 requests/phút**
- **1,500 requests/ngày**
- **Miễn phí hoàn toàn** cho sử dụng cá nhân

---

## 🛡️ Checklist bảo mật

- [ ] File `.env` đã được tạo
- [ ] API key đã được thêm vào `.env`
- [ ] File `.env` có trong `.gitignore`
- [ ] KHÔNG commit file `.env` lên Git
- [ ] Source code KHÔNG chứa API key hardcoded

---

**📌 Lưu ý:** Mỗi lần clone project mới, bạn phải tạo lại file `.env` và thêm API key của riêng mình.

