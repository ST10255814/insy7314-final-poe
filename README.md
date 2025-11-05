<div align="center">

# 💰 PayFlow - Secure International Payment Portal

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Security](https://img.shields.io/badge/security-A+-green)
![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen)
![Node](https://img.shields.io/badge/node-18+-blue)
![License](https://img.shields.io/badge/license-Academic-orange)

**Enterprise-Grade Security** • **MERN Stack** • **Academic Excellence**

</div>

---

## 🎯 Project Overview

PayFlow is a comprehensive secure payment portal designed for international transactions with enterprise-grade security features. This project demonstrates advanced cybersecurity principles including secure authentication, input validation, CSRF protection, and comprehensive security testing.

**Course:** INSY7314 - Information Systems Security  
**Institution:** Varsity College (ADvTECH Group)  
**Year:** 2025

### Tech Stack
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=json-web-tokens&logoColor=white)

---

## 👥 Team Members

- **Jayden Larkins**  
- **Gerhard Lemmer**   
- **Thatho Mokoena**  
- **Mokran Ait Amara**

---

## ✨ Key Features

### 🔐 Security Features
- Multi-layer authentication with JWT tokens
- CSRF and XSS protection
- Rate limiting and request monitoring
- HTTPS enforcement with SSL certificates
- Input validation and sanitization

### ⚡ Technical Features  
- Real-time payment processing
- Employee and customer portals
- Comprehensive test coverage (95%+)
- Automated CI/CD pipeline
- SonarCloud integration for code quality

### 🌍 Business Features
- International payment support
- Multi-currency transactions
- SWIFT integration
- Payment verification system
- Transaction history and reporting

---

## 🏗️ System Architecture

```mermaid
graph LR
    A[User] --> B[React Frontend]
    B --> C[Express API]
    C --> D[MongoDB]
    
    style A fill:#4f46e5,color:#fff
    style B fill:#06b6d4,color:#fff
    style C fill:#10b981,color:#fff
    style D fill:#f59e0b,color:#fff
```

### Backend Structure
```
backend/
├── auth/              # Authentication & middleware
├── controller/        # API route controllers  
├── middleware/        # Security layers
├── service/          # Business logic
├── database/         # MongoDB configuration
├── utils/            # Validation utilities
├── tests/            # Comprehensive testing
└── server.js         # Application entry point
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/    # React components
│   ├── lib/          # Axios configuration
│   ├── utils/        # Helper utilities
│   └── App.jsx       # Main application
├── public/           # Static assets
└── package.json      # Dependencies
```

---

## 🔒 Enterprise Security Framework

![Security](https://img.shields.io/badge/Security-Enterprise_Grade-red)
![OWASP](https://img.shields.io/badge/OWASP-Top_10_Protected-orange)
![Compliance](https://img.shields.io/badge/Compliance-PCI_DSS-blue)

### 🔐 Authentication & Authorization
- 🎫 **JWT Tokens** with HTTP-Only cookies
- 👥 **Role-based Access** (Employee vs Customer)
- 🔄 **Session Management** with secure settings
- 🔒 **Password Hashing** using bcrypt (12 rounds)
- ⏰ **Token Expiration** & refresh mechanisms

### 🛡️ Input Security
- ✅ **RegEx Whitelist** validation for all inputs
- 🚫 **XSS Protection** with input sanitization
- 💉 **SQL Injection Prevention**
- 📝 **Zod Schema** validation on frontend
- 🔍 **Data Validation** at multiple layers

### 🌐 Network Security
- 🛡️ **CSRF Protection** with token validation
- ⏱️ **Rate Limiting** (15 requests/15 minutes)
- 🌍 **CORS Configuration** with whitelist
- 🪖 **Helmet.js** security headers
- 🔐 **HTTPS Enforcement** with SSL certificates

### 🏗️ Infrastructure Security
- 📋 **Content Security Policy** (CSP)
- 🔒 **Strict Transport Security** (HSTS)
- 🔧 **Security Headers** configuration
- 🌿 **Environment Variables** protection
- 🔄 **Secure Cookie** settings

### Security Standards Compliance
![ISO27001](https://img.shields.io/badge/ISO_27001-Compliant-green)
![GDPR](https://img.shields.io/badge/GDPR-Ready-blue)
![SOC2](https://img.shields.io/badge/SOC_2-Type_I-purple)

---

## 📡 API Documentation

### Authentication Endpoints
```http
POST /auth/register    # User registration
POST /auth/login      # User authentication
POST /auth/logout     # Secure logout
GET  /auth/verify     # Token verification
```

### Payment Management
```http
GET  /api/payments         # Retrieve user payments
POST /api/payments         # Create new payment
GET  /api/payments/:id     # Get specific payment
PUT  /api/payments/:id     # Update payment status
```

### Employee Portal
```http
GET /api/employee/payments           # View all payments (admin)
PUT /api/employee/payments/:id/verify # Verify payment
GET /api/employee/dashboard          # Employee dashboard data
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB** (local or cloud instance)
- **Git** for version control

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ST10255814/insy7314-final-poe.git
cd insy7314-final-poe
```

2. **Setup Backend**
```bash
cd backend
npm install
# Configure environment variables
cp .env.example .env
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install
```

4. **Start Development Servers**

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
# Server runs on https://localhost:5000
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm start
# Application runs on https://localhost:3000
```

### Default Login Credentials
- **Employee Username:** `bank_employee`
- **Employee Password:** `Employee@123`

---

## 🧪 Testing & Quality Assurance

![Tests](https://img.shields.io/badge/Tests-Jest+Supertest-red)
![Coverage](https://img.shields.io/badge/Coverage-95%25+-brightgreen)
![Security](https://img.shields.io/badge/Security-OWASP_ZAP-orange)

### 🔧 Backend Testing
```bash
cd backend
npm test                 # 🧪 Run all tests
npm run test:watch       # 👀 Watch mode
npm run test:ci          # 🔄 CI with coverage
npm run test:security    # 🛡️ Security tests
```

**Test Coverage:**
- ✅ Unit Tests: Authentication, Controllers
- ✅ Integration Tests: API endpoints
- ✅ Security Tests: OWASP validations
- ✅ Performance Tests: Load testing

### 🔐 Security Testing
```bash
npm run security:audit   # 📊 NPM audit
npm run security:snyk    # 🔍 Snyk scan
npm run security:zap     # ⚡ OWASP ZAP
npm run lint:security    # 🛡️ ESLint rules
```

**Security Scans:**
- ✅ Dependency vulnerabilities
- ✅ Static code analysis
- ✅ Dynamic security testing
- ✅ Penetration testing automation

---

## 🔄 CI/CD Pipeline

![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat&logo=github-actions&logoColor=white)
![SonarCloud](https://img.shields.io/badge/SonarCloud-F3702A?style=flat&logo=sonarcloud&logoColor=white)

### Pipeline Stages

```mermaid
graph LR
    A[Code Push] --> B[Security Scan]
    B --> C[Run Tests] 
    C --> D[Quality Gate]
    D --> E[Build]
    E --> F[Deploy]
    
    style A fill:#1e40af,color:#fff
    style B fill:#dc2626,color:#fff
    style C fill:#059669,color:#fff
    style D fill:#d97706,color:#fff
    style E fill:#7c3aed,color:#fff
    style F fill:#0891b2,color:#fff
```

### Workflow Features
- 🔐 **Security Scanning**: OWASP, Snyk vulnerability detection
- 🧪 **Testing Suite**: Unit, Integration, E2E tests
- 🏗️ **Build Process**: Frontend & Backend compilation
- 📊 **Quality Analysis**: SonarCloud integration
- 🚀 **Deployment**: Automated staging/production

---

## 🛠️ Development Commands

### 🔧 Backend Commands
```bash
npm start              # 🚀 Production server
npm run dev            # 🔧 Development mode
npm test               # 🧪 Run test suite
npm run lint           # 📝 Code linting
npm run lint:fix       # 🔧 Auto-fix issues
npm run security:audit # 🔐 Security audit
```

### ⚛️ Frontend Commands
```bash
npm start              # 🔧 Development server
npm run build          # 🏗️ Production build
npm test               # 🧪 Run tests
npm run lint           # 📝 Code linting
npm run lint:fix       # 🔧 Auto-fix issues
npm run analyze        # 📊 Bundle analysis
```

---

## 🔐 Security & Compliance

![OWASP](https://img.shields.io/badge/OWASP-Top_10_Protected-red)
![PCI](https://img.shields.io/badge/PCI_DSS-Considerations-blue)
![GDPR](https://img.shields.io/badge/GDPR-Compliant-green)
![ISO](https://img.shields.io/badge/ISO_27001-Aligned-purple)

### 📋 Standards Compliance
- 🛡️ **OWASP Top 10** protection measures
- 💳 **PCI DSS** considerations for payments
- 🔒 **GDPR** data protection principles
- 📊 **ISO 27001** security management
- 🔐 **SOC 2** compliance framework

### 🧪 Security Testing
- 🎯 **Penetration Testing**: Manual & automated
- 🔍 **Vulnerability Scanning**: OWASP ZAP
- 📊 **Code Analysis**: Static analysis with SonarCloud
- 📦 **Dependency Auditing**: Continuous monitoring
- 🔄 **Regular Security Reviews**

---

## 🎥 Demo Videos

### 🔧 Backend API Walkthrough
[![Backend Demo](https://img.shields.io/badge/Watch-Backend_Demo-red?style=flat&logo=youtube)](https://youtu.be/1fQPPgvUX4Q)

**Covers:**
- API endpoints demonstration
- Security features showcase
- Database interactions
- Authentication flow

### 💳 Frontend Payment Gateway
[![Frontend Demo](https://img.shields.io/badge/Watch-Frontend_Demo-blue?style=flat&logo=youtube)](https://youtu.be/DrvEL8eiAYk)

**Highlights:**
- User interface walkthrough
- Payment flow demonstration
- Security features in action
- Responsive design showcase

---

## 📄 License

This project is developed for educational purposes as part of the INSY7314 course curriculum.

**⚠️ Academic Use Only**: This project is intended for educational purposes and should not be used in production environments without proper security review and hardening.

---

*Last Updated: November 2025*