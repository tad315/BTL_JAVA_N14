# 💰 Vissmart – Ứng dụng Quản lý Tài chính Thông minh (Hoàn thiện)

<div align="center">
  <img src="frontend/src/assets/Vissmart.png" alt="Vissmart Logo" width="200"/>
  <br />
  <img src="https://img.shields.io/badge/Spring%20Boot-3.3-green" />
  <img src="https://img.shields.io/badge/MySQL-8-blue" />
  <img src="https://img.shields.io/badge/React-18-61dafb" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6" />
  <img src="https://img.shields.io/badge/Vite-5-646cff" />
</div>

## 📖 Giới thiệu

**Vissmart** là hệ thống quản lý tài chính cá nhân trọn vẹn gồm:

- Backend Spring Boot 3 + JWT, tách dữ liệu theo user
- Frontend React/Vite/MUI
- Mô-đun AI chatbot dùng Gemini với context từ dữ liệu cá nhân
- Các trang chức năng: Dashboard, Giao dịch, Ví, Ngân sách, Báo cáo, Phân tích, Cài đặt

Tất cả module đã hoàn thiện và liên kết end-to-end.

## ✨ Tính năng nổi bật

- **Xác thực & phân quyền:** JWT, `@AuthenticationPrincipal`, lọc dữ liệu theo user.
- **Transactions & Wallets:** CRUD, lọc, tìm kiếm, liên kết ví và danh mục.
- **Budgets:** Thiết lập, cảnh báo gần/vượt ngưỡng (BudgetAlert).
- **Dashboard:** Tổng quan thu/chi, biểu đồ, cảnh báo ngân sách, empty state đẹp.
- **Reports & Analytics:** Báo cáo PDF/CSV, biểu đồ xu hướng, phân tích chuyên sâu.
- **Expense Analysis:** Chart nâng cao, so sánh tháng, xu hướng danh mục.
- **Settings:** Cập nhật profile, đổi mật khẩu, sao lưu dữ liệu, xóa tài khoản.
- **AI Chatbot:** Gemini đọc dữ liệu cá nhân qua `/api/chat/context`, tư vấn tài chính sát thực tế.
- **Dev tooling:** Script `start-all.bat`, lệnh riêng backend/frontend, README hướng dẫn Gemini.

## 🏗 Kiến trúc & Công nghệ

| Layer      | Công nghệ chính |
|-----------|-----------------|
| Backend   | Spring Boot 3.3, Spring Security, Spring Data JPA, MySQL, Maven |
| Frontend  | React 18, Vite 5, TypeScript, Material UI, Chart.js, Axios |
| AI        | Google Gemini (`@google/generative-ai`), custom prompt + context |
| DevOps    | Git, npm, Maven Wrapper, start scripts (`start-all.bat`, `start-backend.bat`, `start-frontend.bat`) |

## 🚀 Hướng dẫn chạy dự án

### 1. Yêu cầu hệ thống
- **JDK 21**
- **Node.js 18+ / npm**
- **MySQL 8+** (khởi tạo database trùng cấu hình trong `backend/src/main/resources/application.properties`)

### 2. Clone & chuẩn bị
```bash
git clone https://github.com/tad315/BTL_JAVA_N14.git
cd BTL_JAVA_N14-main
```

### 3. Backend
```bash
cd backend
copy .env.example .env   # nếu có, hoặc chỉnh trực tiếp application.properties
./mvnw.cmd spring-boot:run
```

**Cấu hình quan trọng (`application.properties`):**
- `spring.datasource.*`: thông tin MySQL
- `spring.jpa.hibernate.ddl-auto=update`
- Các thông số mail (nếu dùng reset password)

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
```
Mặc định chạy tại `http://localhost:5173`.

### 5. Chạy nhanh bằng script
```bash
./start-all.bat         # chạy cả backend + frontend + mở trình duyệt
./stop-all.bat          # dừng toàn bộ
```

## 🤖 Thiết lập Gemini AI
1. Tạo API key tại [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey).
2. **Tùy chọn A (khuyến nghị):** thêm vào `frontend/.env`  
   ```
   VITE_GEMINI_API_KEY=YOUR_KEY_HERE
   ```
3. **Tùy chọn B:** vào trang **Cài đặt → Chat AI – Gemini API Key**, dán key và lưu (được giữ trong `localStorage`, không commit).
4. Chatbot sẽ đọc dữ liệu cá nhân (thu/chi, ví, ngân sách...) và trả lời theo ngữ cảnh.

Chi tiết: `frontend/README_GEMINI_SETUP.md`.

## 📁 Cấu trúc chính
```
BTL_JAVA_N14-main/
├── backend/
│   ├── src/main/java/com/fintrack/backend/
│   │   ├── auth/           # đăng nhập, JWT, user
│   │   ├── transaction/    # giao dịch
│   │   ├── wallet/         # ví
│   │   ├── budget/         # ngân sách
│   │   ├── report & analysis
│   │   ├── chat/           # AI context + lịch sử
│   │   └── setting/        # profile, backup, delete account
│   └── src/main/resources/application.properties
├── frontend/
│   ├── src/components/     # DashboardLayout, BudgetAlert, EmptyState...
│   ├── src/pages/          # Dashboard, Transactions, Budgets, Reports, Settings, Chat...
│   ├── src/services/       # api.ts, geminiService.ts, chatContextService.ts...
│   └── README_GEMINI_SETUP.md
├── SQL/                    # Scripts làm sạch dữ liệu mẫu
├── start-all.bat / start-backend.bat / start-frontend.bat
└── README.md
```

## ✅ Trạng thái Module

| Module | Backend | Frontend | Ghi chú |
|--------|---------|----------|--------|
| Auth & JWT | ✅ | ✅ | Lưu userId/email, logout clear localStorage |
| Wallets | ✅ | ✅ | Dữ liệu theo user, thêm ví mới |
| Budgets | ✅ | ✅ | BudgetAlert, cảnh báo ngưỡng |
| Transactions | ✅ | ✅ | Empty state, lọc, danh mục mặc định |
| Dashboard | ✅ | ✅ | Pie/Bar chart, dữ liệu thực, cảnh báo |
| Reports & Analytics | ✅ | ✅ | Merge branch `Elixe`, xuất PDF/CSV |
| Expense Analysis | ✅ | ✅ | Loại bỏ mock data, API mới |
| Settings | ✅ | ✅ | Sao lưu JSON, xóa tài khoản, cấu hình Gemini |
| Chatbot (Gemini) | ✅ | ✅ | Context cá nhân, lưu API key, UI widget |

## 🧪 Kiểm thử
- Backend: `cd backend && ./mvnw.cmd test`
- Frontend lint: `cd frontend && npm run lint` (còn lại một số cảnh báo lịch sử về `any`/hooks, sẽ dọn ở sprint sau)
- Manual QA: sử dụng script `start-all.bat`, tạo user mới, xác nhận mỗi user chỉ nhìn thấy dữ liệu của mình, chatbot trả lời dựa trên số liệu thực.

## 📤 Đóng góp & Triển khai
- Quy trình Git tiêu chuẩn (fork/branch/PR) hoặc commit trực tiếp nếu thuộc core team.
- Khi cần xuất bản: `git pull origin master`, chạy test/lint, `git commit`, `git push origin master`.

## 👥 Nhóm thực hiện
- Nhóm 14 – Java Project Final  
  - Backend Engineers: Spring Boot, Security, Analytics  
  - Frontend Engineers: React/MUI/Chart.js  
  - AI Engineer: Gemini integration  
  - QA & Docs

---

<div align="center">
  <p>Phát triển với ❤️ – Nếu dự án hữu ích, hãy ⭐ repo!</p>
</div>