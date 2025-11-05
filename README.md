# 💰 PayFlow - Secure International Payment Portal

**Repository:** `insy7314-final-poe`  
**Tech Stack:** MERN (MongoDB, Express.js, React, Node.js)  
**Course:** INSY7314 - Information Systems Security  
**Project Type:** Final Portfolio of Evidence (POE)

## 👥 Team Members
- **Jayden Larkins** - Full-stack Development & Security Implementation
- **Gerhard Lemmer** - Backend Architecture & API Development  
- **Thatho Mokoena** - Frontend Development & UI/UX
- **Mokran Ait Amara** - Security Testing & DevOps

**Date:** November 2025

---

## 🎯 Project Overview

PayFlow is a comprehensive secure payment portal designed for international transactions with enterprise-grade security features. This project demonstrates advanced cybersecurity principles including secure authentication, input validation, CSRF protection, and comprehensive security testing.

### 🌟 Key Highlights
- **🔐 Enterprise Security**: Multi-layer security with JWT, CSRF protection, rate limiting
- **🌍 International Support**: Multi-currency payment processing
- **⚡ Performance**: Optimized React frontend with efficient API communication
- **🧪 Comprehensive Testing**: 95%+ code coverage with Jest and Supertest
- **🚀 CI/CD Pipeline**: Automated testing, security scanning, and deployment
- **📊 Monitoring**: SonarCloud integration for code quality and security analysis

---

## �️ Architecture

### Backend (Node.js + Express)
```
backend/
├── auth/               # Authentication middleware & utilities
├── controller/         # API route controllers
├── middleware/         # Security middleware (CSRF, rate limiting, etc.)
├── service/           # Business logic services
├── database/          # MongoDB connection & configuration
├── utils/             # Validation utilities
├── tests/             # Jest test suites
└── server.js          # Application entry point
```

### Frontend (React + Tailwind CSS)
```
frontend/
├── src/
│   ├── components/    # React components
│   ├── lib/          # Axios configuration
│   ├── utils/        # Helper utilities
│   └── App.jsx       # Main application
├── public/           # Static assets
└── package.json      # Dependencies & scripts
```

---

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens** with HTTP-Only cookies
- **Employee vs Customer** role-based access control
- **Session management** with secure cookie settings
- **Password hashing** using bcrypt (12 rounds)

### Input Security
- **RegEx whitelist validation** for all inputs
- **XSS protection** with input sanitization
- **SQL injection prevention** with parameterized queries
- **Zod schema validation** on frontend

### Network Security
- **CSRF protection** with token validation
- **Rate limiting** (15 requests per 15 minutes)
- **CORS configuration** with whitelist
- **Helmet.js** for secure HTTP headers
- **HTTPS enforcement** with SSL certificates

### Infrastructure Security
- **Content Security Policy (CSP)**
- **Strict Transport Security (HSTS)**
- **Security headers** configuration
- **Environment variable** protection

---

## 📡 API Endpoints

### 🔐 Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication
- `POST /auth/logout` - Secure logout
- `GET /auth/verify` - Token verification

### 💳 Payment Management
- `GET /api/payments` - Retrieve user payments
- `POST /api/payments` - Create new payment
- `GET /api/payments/:id` - Get specific payment
- `PUT /api/payments/:id` - Update payment status

### 👨‍💼 Employee Portal
- `GET /api/employee/payments` - View all payments (admin)
- `PUT /api/employee/payments/:id/verify` - Verify payment
- `GET /api/employee/dashboard` - Employee dashboard data

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ST10255814/insy7314-final-poe.git
cd insy7314-final-poe
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

4. **Start Development Servers**

Backend:
```bash
cd backend
npm run dev
```

Frontend (new terminal):
```bash
cd frontend
npm start
```

5. **Access the Application**
- Frontend: `https://localhost:3000`
- Backend API: `https://localhost:5000`

### 🌐 Browser Setup for Development
For development with self-signed certificates:
```bash
# Windows
chrome.exe --ignore-certificate-errors --user-data-dir="C:/temp/chrome_dev" --disable-web-security

# macOS
open -a "Google Chrome" --args --ignore-certificate-errors --user-data-dir="/tmp/chrome_dev" --disable-web-security
```

---

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test                # Run tests
npm run test:watch      # Watch mode
npm run test:ci         # CI mode with coverage
```

### Security Testing
```bash
npm run security:audit  # NPM audit
npm run security:snyk   # Snyk vulnerability scan
npm run lint            # ESLint security rules
```

## � CI/CD Pipeline

### GitHub Actions Workflows

#### 1. **Comprehensive CI/CD** (`.github/workflows/ci-cd.yml`)
- **Security Scanning**: OWASP dependency check, Snyk vulnerability scan
- **Backend Testing**: Jest unit tests with coverage reporting
- **Frontend Building**: React application build verification
- **Code Quality**: ESLint, Prettier, SonarCloud analysis
- **Deployment**: Automated deployment to staging/production

#### 2. **Security Scanning** (`.github/workflows/security-scan.yml`)
- Dedicated security vulnerability assessment
- SAST (Static Application Security Testing)
- Dependency vulnerability scanning

#### 3. **Dependency Monitoring** (`.github/workflows/dependency-check.yml`)
- Automated dependency updates
- Security patch notifications
- License compliance checking

### Quality Gates
- ✅ All tests must pass (95%+ coverage)
- ✅ Security scan approval required
- ✅ Code quality metrics meet standards
- ✅ No high/critical security vulnerabilities

---

## 🛠️ Development Scripts

### Backend
```bash
npm start              # Production server
npm run dev            # Development with nodemon
npm test               # Run tests
npm run lint           # ESLint check
npm run lint:fix       # Auto-fix linting issues
npm run security:audit # Security audit
```

### Frontend
```bash
npm start              # Development server
npm run build          # Production build
npm run lint           # ESLint check
npm run lint:fix       # Auto-fix linting issues
npm run security:audit # Security audit
```

---

## 🔐 Security Compliance

### Standards Compliance
- **OWASP Top 10** protection measures implemented
- **PCI DSS** considerations for payment processing
- **GDPR** data protection principles
- **ISO 27001** security management practices

### Security Testing
- **Penetration Testing**: Manual and automated
- **Vulnerability Scanning**: Regular OWASP ZAP scans
- **Code Analysis**: Static analysis with SonarCloud
- **Dependency Auditing**: Continuous monitoring

---

## 📞 Support & Contact

### Team Contacts
- **Security Concerns**: Contact team leads directly
- **Documentation**: Check project wiki

### Course Information
- **Course**: INSY7314 - Information Systems Security
- **Institution**: Varsity College (ADvTECH Group)
- **Academic Year**: 2025

---

## 📄 License

This project is developed for academic purposes as part of the INSY7314 course curriculum.

**⚠️ Academic Use Only**: This project is intended for educational purposes and should not be used in production environments without proper security review and hardening.

---

## 🎥 Demo Links

> **Backend API Walkthrough**: [YouTube Video](https://youtu.be/1fQPPgvUX4Q)  
> **Frontend Payment Gateway Demo**: [YouTube Video](https://youtu.be/DrvEL8eiAYk)  

---

*Last Updated: November 2025*  
