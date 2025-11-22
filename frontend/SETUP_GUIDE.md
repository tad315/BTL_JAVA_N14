# 🚀 Hướng dẫn cài đặt và chạy Frontend Vissmart

## Bước 1: Cài đặt Node.js

### Windows:
1. Truy cập [https://nodejs.org/](https://nodejs.org/)
2. Tải bản **LTS** (Long Term Support) - khuyến nghị cho hầu hết người dùng
3. Chạy file cài đặt `.msi` và làm theo hướng dẫn
4. Kiểm tra cài đặt thành công:
   ```powershell
   node --version
   npm --version
   ```

### macOS:
1. Sử dụng Homebrew:
   ```bash
   brew install node
   ```
2. Hoặc tải từ [https://nodejs.org/](https://nodejs.org/)

### Linux (Ubuntu/Debian):
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Bước 2: Cài đặt Dependencies

Mở terminal/PowerShell tại thư mục `frontend`:

```powershell
cd frontend
npm install
```

Quá trình này sẽ cài đặt tất cả các packages cần thiết:
- React & React DOM
- TypeScript
- Material-UI
- React Router
- Vite
- Chart.js
- Redux Toolkit
- Axios

## Bước 3: Chạy ứng dụng

### Development Mode (Phát triển)
```powershell
npm run dev
```

Ứng dụng sẽ tự động mở tại: **http://localhost:3000**

### Build Production
```powershell
npm run build
```

Tạo bản build tối ưu trong thư mục `dist/`

### Preview Production Build
```powershell
npm run preview
```

Xem trước bản build production

## Bước 4: Cấu trúc dự án đã tạo

```
frontend/
├── public/              # File tĩnh
│   └── vite.svg        # Logo mặc định
├── src/
│   ├── assets/         # Hình ảnh, fonts
│   ├── components/     # Components tái sử dụng
│   │   ├── CustomCard.tsx
│   │   ├── CustomInput.tsx
│   │   └── LoadingSpinner.tsx
│   ├── pages/          # Các trang
│   │   ├── LandingPage.tsx    ✅ Hoàn thành
│   │   ├── LoginPage.tsx      ✅ Hoàn thành
│   │   ├── RegisterPage.tsx   ✅ Hoàn thành
│   │   └── DashboardPage.tsx  ✅ Hoàn thành
│   ├── services/       # API services
│   ├── store/          # Redux store
│   ├── styles/         # Global styles
│   │   └── global.css
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Component chính
│   └── main.tsx        # Entry point
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Tính năng đã hoàn thành ✅

1. **Landing Page**
   - Logo Vissmart với thiết kế đẹp
   - 2 nút: Đăng nhập / Đăng ký
   - Animations và decorative elements
   - Responsive design

2. **Login Page**
   - Form đăng nhập với email/password
   - Toggle hiển thị password
   - Link quên mật khẩu
   - Link đến trang đăng ký
   - Validation cơ bản

3. **Register Page**
   - Form đăng ký đầy đủ (Họ tên, Email, SĐT, Mật khẩu)
   - Xác nhận mật khẩu
   - Toggle hiển thị password
   - Link đến trang đăng nhập

4. **Dashboard Page**
   - Stats cards: Thu nhập, Chi tiêu, Số dư, Tiết kiệm
   - Layout cho biểu đồ
   - Danh sách giao dịch gần đây
   - Responsive grid layout

5. **Components tái sử dụng**
   - CustomCard: Card component với hover effects
   - CustomInput: Input field styled
   - LoadingSpinner: Loading indicator

## Các bước tiếp theo 🚧

### Phase 1: Authentication & API Integration
- [ ] Kết nối với Backend API
- [ ] Implement JWT authentication
- [ ] Redux store cho user state
- [ ] Protected routes

### Phase 2: Core Features
- [ ] Transaction management page
- [ ] Wallet management
- [ ] Category management
- [ ] Analytics & Charts integration

### Phase 3: Advanced Features
- [ ] Budget tracking
- [ ] Financial goals
- [ ] Reports generation
- [ ] AI Chatbot integration

### Phase 4: Polish
- [ ] Dark mode
- [ ] Multi-language support
- [ ] PWA features
- [ ] Performance optimization

## Troubleshooting

### Lỗi: "npm: command not found"
- Node.js chưa được cài đặt hoặc chưa được thêm vào PATH
- Giải pháp: Cài đặt lại Node.js và restart terminal

### Lỗi: "Cannot find module"
- Dependencies chưa được cài đặt
- Giải pháp: Chạy `npm install`

### Port 3000 đã được sử dụng
- Giải pháo: Thay đổi port trong `vite.config.ts`:
  ```ts
  server: {
    port: 3001, // Đổi sang port khác
  }
  ```

## Scripts hữu ích

```powershell
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Thêm package mới
npm install <package-name>
```

## Tài nguyên

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Material-UI](https://mui.com/)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com/)

## Liên hệ & Hỗ trợ

Nếu gặp vấn đề, vui lòng liên hệ team phát triển hoặc tạo issue trên repository.

---

**Chúc bạn code vui vẻ! 🎉**


