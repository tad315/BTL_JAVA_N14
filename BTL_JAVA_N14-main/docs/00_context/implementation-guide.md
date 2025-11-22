# Kiến trúc kỹ thuật - Ứng dụng Quản lý Chi tiêu

## Tổng quan kiến trúc

### Frontend (Client-side)
- **Framework**: React.js với TypeScript
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI hoặc Ant Design
- **Charts**: Chart.js hoặc Recharts
- **Build Tool**: Vite

### Backend (Server-side)
- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Database**: PostgreSQL
- **Cache**: Redis
- **Message Queue**: RabbitMQ (cho AI processing)

### AI/ML Services
- **Python Service**: FastAPI cho AI recommendations
- **ML Models**: scikit-learn, pandas cho phân tích dữ liệu
- **NLP**: Transformers cho chatbot

## Cấu trúc thư mục dự án

```
personal-finance-app/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store
│   │   └── utils/          # Utility functions
│   └── package.json
├── backend/                 # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/finance/app/
│   │       ├── controller/  # REST controllers
│   │       ├── service/     # Business logic
│   │       ├── repository/ # Data access
│   │       ├── entity/     # JPA entities
│   │       ├── dto/        # Data transfer objects
│   │       └── config/     # Configuration
│   └── pom.xml
├── ai-service/              # Python AI service
│   ├── app/
│   │   ├── models/         # ML models
│   │   ├── services/       # AI services
│   │   └── api/           # FastAPI endpoints
│   └── requirements.txt
└── docs/                   # Documentation
```

## Cơ sở dữ liệu

### Bảng chính
- **users**: Thông tin người dùng
- **wallets**: Ví/tài khoản
- **transactions**: Giao dịch thu chi
- **categories**: Danh mục chi tiêu
- **budgets**: Ngân sách
- **goals**: Mục tiêu tài chính
- **reports**: Báo cáo

### Quan hệ
- User 1:N Wallet
- Wallet 1:N Transaction
- Category 1:N Transaction
- User 1:N Budget
- User 1:N Goal

## API Design

### RESTful Endpoints
```
GET    /api/users/{id}                    # Thông tin user
GET    /api/wallets                       # Danh sách ví
POST   /api/wallets                       # Tạo ví mới
GET    /api/transactions                  # Danh sách giao dịch
POST   /api/transactions                  # Tạo giao dịch
GET    /api/transactions/analytics        # Phân tích chi tiêu
GET    /api/budgets                       # Danh sách ngân sách
POST   /api/budgets                       # Tạo ngân sách
GET    /api/reports                       # Báo cáo
POST   /api/ai/chat                       # Chatbot
GET    /api/ai/recommendations           # AI recommendations
```

## Security

### Authentication & Authorization
- JWT tokens cho authentication
- Role-based access control
- Password encryption với BCrypt

### Data Protection
- HTTPS cho tất cả communications
- Input validation và sanitization
- SQL injection prevention
- XSS protection

## Performance Optimization

### Caching Strategy
- Redis cho session storage
- Cache frequent queries
- CDN cho static assets

### Database Optimization
- Indexing trên các trường thường query
- Connection pooling
- Query optimization

## Deployment

### Development
- Docker Compose cho local development
- Hot reload cho frontend và backend

### Production
- Docker containers
- Kubernetes orchestration
- CI/CD pipeline với GitHub Actions

## Monitoring & Logging

### Application Monitoring
- Spring Boot Actuator
- Prometheus metrics
- Grafana dashboards

### Logging
- Structured logging với Logback
- Centralized logging với ELK stack
- Error tracking với Sentry
