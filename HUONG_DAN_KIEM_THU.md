# 🧪 HƯỚNG DẪN KIỂM THỬ TỰ ĐỘNG

## 📋 CHECKLIST KIỂM THỬ

### ✅ **1. ĐĂNG NHẬP & XÁC THỰC**
- [ ] Đăng nhập với tài khoản: `aaa` / `123456`
- [ ] Kiểm tra JWT token được lưu vào localStorage
- [ ] Kiểm tra userId, userEmail, userFullName trong localStorage
- [ ] Kiểm tra hiển thị tên user ở góc phải header

**Cách test:**
1. Mở Developer Tools (F12) → Console
2. Nhập: `console.log(localStorage.getItem('userId'), localStorage.getItem('userEmail'))`
3. ✅ Pass nếu có userId và email

---

### 📊 **2. DASHBOARD (TRANG CHỦ)**

#### **Test Case 2.1: User có dữ liệu**
- [ ] Kiểm tra **Thu nhập tháng này** hiển thị đúng
- [ ] Kiểm tra **Chi tiêu tháng này** hiển thị đúng
- [ ] Kiểm tra **Số dư hiện tại** hiển thị đúng (tổng tất cả ví)
- [ ] Kiểm tra **Pie Chart** - Phân bổ chi tiêu theo danh mục
- [ ] Kiểm tra **Bar Chart** - Thu chi theo tháng (12 tháng)
- [ ] Kiểm tra **Giao dịch gần đây** - hiển thị 5 giao dịch mới nhất

**Cách test:**
1. Mở Console (F12)
2. Xem log `📦 API Response` → Kiểm tra có data không
3. Xem log `💰 Stats Calculated` → Kiểm tra số liệu
4. Xem log `🥧 Pie Data` → Kiểm tra dữ liệu biểu đồ
5. Xem log `📊 Bar Data` → Kiểm tra dữ liệu cột

#### **Test Case 2.2: User mới chưa có ví**
- [ ] Hiển thị **Welcome Card** với nút "Tạo ví đầu tiên"
- [ ] Click nút → Chuyển đến trang Quản lý tài khoản

#### **Test Case 2.3: User có ví nhưng chưa có giao dịch**
- [ ] Hiển thị **Alert** "Bạn đã có ví rồi! Hãy thêm giao dịch..."
- [ ] Click nút "Thêm giao dịch" → Chuyển đến trang Quản lý giao dịch

---

### 💼 **3. QUẢN LÝ VÍ**

- [ ] Hiển thị **ĐÚNG** danh sách ví của user hiện tại
- [ ] **KHÔNG** hiển thị ví của user khác
- [ ] Tạo ví mới → Ví được gán đúng userId
- [ ] Xóa ví → Chỉ xóa được ví của mình
- [ ] Kiểm tra tổng số dư trên header

**Cách test:**
1. Đăng nhập user A → Xem số ví
2. Đăng xuất → Đăng nhập user B
3. ✅ Pass nếu danh sách ví **KHÁC NHAU**

---

### 💸 **4. QUẢN LÝ GIAO DỊCH**

- [ ] Hiển thị **ĐÚNG** danh sách giao dịch của user
- [ ] **KHÔNG** hiển thị giao dịch của user khác
- [ ] **Thêm giao dịch mới:**
  - [ ] Chọn ví từ dropdown
  - [ ] Chọn danh mục từ dropdown
  - [ ] Nhập số tiền, nội dung
  - [ ] Lưu thành công
- [ ] **Sửa giao dịch:**
  - [ ] Click nút Edit (✏️)
  - [ ] Thay đổi thông tin
  - [ ] Lưu thành công
- [ ] **Xóa giao dịch:**
  - [ ] Click nút Delete (🗑️)
  - [ ] Xác nhận xóa
  - [ ] Giao dịch biến mất
- [ ] **Tìm kiếm:**
  - [ ] Tìm theo nội dung
  - [ ] Kết quả đúng

**Cách test:**
1. Thêm giao dịch mới với user A
2. Đăng xuất → Đăng nhập user B
3. ✅ Pass nếu user B **KHÔNG THẤY** giao dịch của A

---

### 💰 **5. QUẢN LÝ NGÂN SÁCH**

- [ ] Hiển thị **ĐÚNG** danh sách ngân sách của user
- [ ] **KHÔNG** hiển thị ngân sách của user khác
- [ ] **Thêm ngân sách mới:**
  - [ ] Chọn danh mục từ dropdown
  - [ ] Chọn tháng/năm
  - [ ] Nhập hạn mức
  - [ ] Lưu thành công
- [ ] **Hiển thị % sử dụng:**
  - [ ] Màu xanh: < 80%
  - [ ] Màu vàng: 80-100%
  - [ ] Màu đỏ: > 100%
- [ ] **Xóa ngân sách:**
  - [ ] Click nút Delete
  - [ ] Ngân sách bị xóa

**Cách test:**
1. Tạo ngân sách cho "Ăn uống" - 1,000,000đ
2. Thêm giao dịch chi tiêu "Ăn uống" - 900,000đ
3. ✅ Pass nếu hiển thị 90% (màu vàng)

---

### 📈 **6. PHÂN TÍCH CHI TIÊU**

- [ ] **Pie Chart** - Phân bổ chi tiêu theo danh mục
- [ ] **Bar Chart** - Thu chi theo tháng
- [ ] **Chỉ hiển thị dữ liệu của user hiện tại**
- [ ] Có thể filter theo thời gian

**Cách test:**
1. Kiểm tra số liệu trên chart
2. So sánh với trang Quản lý giao dịch
3. ✅ Pass nếu **SỐ LIỆU KHỚP**

---

### 📊 **7. BÁO CÁO**

- [ ] Hiển thị báo cáo tổng quan
- [ ] Dữ liệu đúng với user hiện tại
- [ ] Charts render đúng

---

### ⚙️ **8. CÀI ĐẶT**

- [ ] Hiển thị danh sách categories của user
- [ ] Thêm/Sửa/Xóa category
- [ ] Categories **KHÔNG** bị share giữa các user

**Cách test:**
1. User A thêm category "Du lịch"
2. Đăng xuất → Đăng nhập user B
3. ✅ Pass nếu user B **KHÔNG THẤY** "Du lịch"

---

### 🔐 **9. PHÂN QUYỀN & BẢO MẬT**

#### **Test Case 9.1: JWT Token**
- [ ] Token được gửi trong mọi API request
- [ ] API trả về 401 nếu không có token
- [ ] Token hết hạn → Tự động logout

**Cách test:**
1. Mở Network tab (F12)
2. Click vào bất kỳ request nào
3. Kiểm tra Header → `Authorization: Bearer xxx...`
4. ✅ Pass nếu có JWT token

#### **Test Case 9.2: Data Isolation**
- [ ] User A **KHÔNG THỂ** xem dữ liệu của User B
- [ ] User A **KHÔNG THỂ** sửa dữ liệu của User B
- [ ] User A **KHÔNG THỂ** xóa dữ liệu của User B

**Cách test:**
1. Tạo 2 tài khoản: `user1` và `user2`
2. User1 tạo ví, giao dịch, ngân sách
3. Đăng nhập User2
4. ✅ Pass nếu User2 thấy **TRANG TRẮNG** (không có data)

---

### 💬 **10. CHAT AI**

- [ ] Chat widget hiển thị ở tất cả các trang
- [ ] Gửi tin nhắn thành công
- [ ] Nhận phản hồi từ AI
- [ ] Lịch sử chat được lưu

---

## 🐛 **LỖI THƯỜNG GẶP**

### **Lỗi 1: Cột "Ví" hiển thị "9999"**
- ❌ Đây là bug! Ví nên hiển thị **TÊN VÍ** chứ không phải ID
- 🔧 Cần sửa trong `TransactionManagementPage.tsx`

### **Lỗi 2: Dashboard không hiển thị giao dịch**
- ✅ Đã fix! Kiểm tra Console logs:
  - `📦 API Response` phải có data
  - `📝 All Transactions` phải > 0

### **Lỗi 3: 403 Forbidden**
- ❌ Backend chưa được config CORS đúng
- ✅ Đã fix! CORS cho phép localhost:3001

### **Lỗi 4: 401 Unauthorized**
- ❌ Không gửi JWT token
- 🔧 Phải dùng `api` instance, không dùng `axios` trực tiếp

---

## 📊 **KẾT QUẢ MONG ĐỢI**

### ✅ **Pass tất cả test nếu:**
1. ✅ Mỗi user chỉ thấy dữ liệu của mình
2. ✅ Dashboard hiển thị đúng số liệu
3. ✅ CRUD (Thêm/Sửa/Xóa) hoạt động tốt
4. ✅ Charts render đúng
5. ✅ Empty state UI đẹp
6. ✅ Không có lỗi trong Console
7. ✅ Không có lỗi 403/401
8. ✅ JWT token được gửi trong mọi request

---

## 🚀 **CÁCH CHẠY TEST**

### **Bước 1: Khởi động ứng dụng**
```bash
cd "C:\Users\Admin\Downloads\Java Project Final\BTL_JAVA_N14-main"
.\start-all.bat
```

### **Bước 2: Mở Browser**
- Frontend: http://localhost:3001
- Backend API: http://localhost:8080

### **Bước 3: Mở Developer Tools**
- Nhấn F12
- Chuyển sang tab **Console**
- Chuyển sang tab **Network** để xem API calls

### **Bước 4: Test từng chức năng**
- Làm theo checklist trên ☝️
- Đánh dấu ✅ cho mỗi test pass
- Ghi chú ❌ nếu có lỗi

---

## 📝 **BÁO CÁO KẾT QUẢ**

Sau khi test xong, báo cáo theo mẫu:

```
✅ PASS: Dashboard hiển thị đúng dữ liệu
✅ PASS: Data isolation giữa các user
❌ FAIL: Cột "Ví" hiển thị ID thay vì tên
❌ FAIL: Pie chart không render
```

---

## 🎯 **MỤC TIÊU**

- ✅ Tất cả 10 modules hoạt động đúng
- ✅ Không có lỗi trong Console
- ✅ UI/UX đẹp và dễ sử dụng
- ✅ Bảo mật tốt (JWT + Data Isolation)
- ✅ Performance tốt (load nhanh)

---

**Chúc may mắn! 🚀**

