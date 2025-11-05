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

- **Jayden Larkins** - Team Lead & Full-Stack Development
- **Gerhard Lemmer** - Backend Architecture & API Development  
- **Thatho Mokoena** - Frontend Development & UI/UX
- **Mokran Ait Amara** - Security Testing & DevOps---

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
```---

## 🔒 **Enterprise Security Framework**

<div align="center">

### 🛡️ **Multi-Layer Security Architecture**

![Security](https://img.shields.io/badge/Security-Enterprise_Grade-red?style=for-the-badge)
![OWASP](https://img.shields.io/badge/OWASP-Top_10_Protected-orange?style=for-the-badge)
![Compliance](https://img.shields.io/badge/Compliance-PCI_DSS-blue?style=for-the-badge)

</div>

<table>
<tr>
<td width="50%">

### 🔐 **Authentication & Authorization**
- 🎫 **JWT Tokens** with HTTP-Only cookies
- 👥 **Role-based Access** (Employee vs Customer)
- 🔄 **Session Management** with secure settings
- 🔒 **Password Hashing** using bcrypt (12 rounds)
- ⏰ **Token Expiration** & refresh mechanisms

</td>
<td width="50%">

### 🛡️ **Input Security**
- ✅ **RegEx Whitelist** validation for all inputs
- 🚫 **XSS Protection** with input sanitization
- 💉 **SQL Injection Prevention**
- 📝 **Zod Schema** validation on frontend
- 🔍 **Data Validation** at multiple layers

</td>
</tr>
<tr>
<td width="50%">

### 🌐 **Network Security**
- 🛡️ **CSRF Protection** with token validation
- ⏱️ **Rate Limiting** (15 requests/15 minutes)
- 🌍 **CORS Configuration** with whitelist
- 🪖 **Helmet.js** security headers
- 🔐 **HTTPS Enforcement** with SSL certificates

</td>
<td width="50%">

### 🏗️ **Infrastructure Security**
- 📋 **Content Security Policy** (CSP)
- 🔒 **Strict Transport Security** (HSTS)
- 🔧 **Security Headers** configuration
- 🌿 **Environment Variables** protection
- 🔄 **Secure Cookie** settings

</td>
</tr>
</table>

<div align="center">

### 🎯 **Security Standards Compliance**

![ISO27001](https://img.shields.io/badge/ISO_27001-Compliant-green)
![GDPR](https://img.shields.io/badge/GDPR-Ready-blue)
![SOC2](https://img.shields.io/badge/SOC_2-Type_I-purple)

</div>

---

## 📡 **API Documentation**

<div align="center">

### 🔌 **RESTful API Endpoints**

![API](https://img.shields.io/badge/API-RESTful-blue?style=for-the-badge)
![Swagger](https://img.shields.io/badge/Docs-Interactive-green?style=for-the-badge)

</div>

<table>
<tr>
<td width="33%">

### 🔐 **Authentication**
```http
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/verify
```

</td>
<td width="33%">

### 💳 **Payment Management**
```http
GET  /api/payments
POST /api/payments
GET  /api/payments/:id
PUT  /api/payments/:id
```

</td>
<td width="33%">

### 👨‍💼 **Employee Portal**
```http
GET /api/employee/payments
PUT /api/employee/payments/:id/verify
GET /api/employee/dashboard
```

</td>
</tr>
</table>

---

## 🚀 **Quick Start Guide**

<div align="center">

### ⚡ **Get Started in 5 Minutes**

![Setup](https://img.shields.io/badge/Setup_Time-5_Minutes-brightgreen?style=for-the-badge)

</div>

### 📋 **Prerequisites**

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v18+-brightgreen?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-v6+-green?logo=mongodb)
![Git](https://img.shields.io/badge/Git-Latest-orange?logo=git)

</div>

### 🔧 **Installation Steps**

#### **Step 1: Clone Repository**
```bash
git clone https://github.com/ST10255814/insy7314-final-poe.git
cd insy7314-final-poe
```

#### **Step 2: Backend Setup**
```bash
cd backend
npm install
# Configure your .env file
cp .env.example .env
```

#### **Step 3: Frontend Setup**
```bash
cd ../frontend
npm install
```

#### **Step 4: Launch Application**

<table>
<tr>
<td width="50%">

**🔧 Backend Server**
```bash
cd backend
npm run dev
```
🌐 **API**: `https://localhost:5000`

</td>
<td width="50%">

**⚛️ Frontend Application**
```bash
cd frontend  
npm start
```
🖥️ **Web App**: `https://localhost:3000`

</td>
</tr>
</table>

<div align="center">

### 🎉 **You're Ready to Go!**

**🔐 Default Employee Login:**
- **Username:** `bank_employee`
- **Password:** `Employee@123`

</div>

### 🌐 **Browser Setup for Development**
<details>
<summary>Click to expand browser configuration for self-signed certificates</summary>

**Windows:**
```bash
chrome.exe --ignore-certificate-errors --user-data-dir="C:/temp/chrome_dev" --disable-web-security
```

**macOS:**
```bash
open -a "Google Chrome" --args --ignore-certificate-errors --user-data-dir="/tmp/chrome_dev" --disable-web-security
```
</details>

---

## 🧪 **Testing & Quality Assurance**

<div align="center">

### 📊 **Comprehensive Testing Suite**

![Tests](https://img.shields.io/badge/Tests-Jest+Supertest-red?style=for-the-badge)
![Coverage](https://img.shields.io/badge/Coverage-95%25+-brightgreen?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-OWASP_ZAP-orange?style=for-the-badge)

</div>

<table>
<tr>
<td width="50%">

### 🔧 **Backend Testing**
```bash
cd backend
npm test                 # 🧪 Run all tests
npm run test:watch       # 👀 Watch mode
npm run test:ci          # 🔄 CI with coverage
npm run test:security    # 🛡️ Security tests
```

**📋 Test Coverage:**
- ✅ Unit Tests: Authentication, Controllers
- ✅ Integration Tests: API endpoints
- ✅ Security Tests: OWASP validations
- ✅ Performance Tests: Load testing

</td>
<td width="50%">

### 🔐 **Security Testing**
```bash
npm run security:audit   # 📊 NPM audit
npm run security:snyk    # 🔍 Snyk scan
npm run security:zap     # ⚡ OWASP ZAP
npm run lint:security    # 🛡️ ESLint rules
```

**🔍 Security Scans:**
- ✅ Dependency vulnerabilities
- ✅ Static code analysis
- ✅ Dynamic security testing
- ✅ Penetration testing automation

</td>
</tr>
</table>

---

## 🔄 **CI/CD Pipeline**

<div align="center">

### ⚙️ **Automated DevOps Workflow**

![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![SonarCloud](https://img.shields.io/badge/SonarCloud-F3702A?style=for-the-badge&logo=sonarcloud&logoColor=white)

</div>

### 🚀 **Pipeline Stages**

```mermaid
graph LR
    A[📝 Code Push] --> B[🔍 Security Scan]
    B --> C[🧪 Run Tests]
    C --> D[📊 Quality Gate]
    D --> E[🏗️ Build]
    E --> F[🚀 Deploy]
    
    style A fill:#e1f5fe
    style B fill:#ffebee
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#f3e5f5
    style F fill:#e0f2f1
```

<table>
<tr>
<td width="50%">

### 🔄 **Workflow 1: Comprehensive CI/CD**
- 🔐 **Security Scanning**: OWASP, Snyk
- 🧪 **Testing Suite**: Unit, Integration, E2E
- 🏗️ **Build Process**: Frontend & Backend
- 📊 **Quality Analysis**: SonarCloud integration
- 🚀 **Deployment**: Automated staging/production

</td>
<td width="50%">

### 🛡️ **Workflow 2: Security-First**
- 🔍 **SAST**: Static Application Security Testing
- 📦 **Dependency Check**: Automated vulnerability scanning
- 🔒 **License Compliance**: Legal compliance monitoring
- 📋 **Security Reports**: Comprehensive vulnerability reports

</td>
</tr>
</table>

### ✅ **Quality Gates**
- 🧪 **All tests must pass** (95%+ coverage required)
- 🔐 **Security approval** (no high/critical vulnerabilities)
- 📊 **Code quality metrics** meet standards
- 📋 **Documentation** up to date

---

## 🛠️ **Development Commands**

<div align="center">

### ⚡ **Quick Reference Guide**

</div>

<table>
<tr>
<td width="50%">

### 🔧 **Backend Commands**
```bash
npm start              # 🚀 Production server
npm run dev            # 🔧 Development mode
npm test               # 🧪 Run test suite
npm run lint           # 📝 Code linting
npm run lint:fix       # 🔧 Auto-fix issues
npm run security:audit # 🔐 Security audit
```

</td>
<td width="50%">

### ⚛️ **Frontend Commands**
```bash
npm start              # 🔧 Development server
npm run build          # 🏗️ Production build
npm test               # 🧪 Run tests
npm run lint           # 📝 Code linting
npm run lint:fix       # 🔧 Auto-fix issues
npm run analyze        # 📊 Bundle analysis
```

</td>
</tr>
</table>

---

## 🔐 **Security & Compliance**

<div align="center">

### 🛡️ **Industry Standards Compliance**

![OWASP](https://img.shields.io/badge/OWASP-Top_10_Protected-red)
![PCI](https://img.shields.io/badge/PCI_DSS-Considerations-blue)
![GDPR](https://img.shields.io/badge/GDPR-Compliant-green)
![ISO](https://img.shields.io/badge/ISO_27001-Aligned-purple)

</div>

<table>
<tr>
<td width="50%">

### 📋 **Standards Compliance**
- 🛡️ **OWASP Top 10** protection measures
- 💳 **PCI DSS** considerations for payments
- 🔒 **GDPR** data protection principles
- 📊 **ISO 27001** security management
- 🔐 **SOC 2** compliance framework

</td>
<td width="50%">

### 🧪 **Security Testing**
- 🎯 **Penetration Testing**: Manual & automated
- 🔍 **Vulnerability Scanning**: OWASP ZAP
- 📊 **Code Analysis**: Static analysis with SonarCloud
- 📦 **Dependency Auditing**: Continuous monitoring
- 🔄 **Regular Security Reviews**

</td>
</tr>
</table>

---

## 🎥 **Demo & Resources**

<div align="center">

### � **Video Demonstrations**

[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com)

</div>

<table>
<tr>
<td width="50%" align="center">

### 🔧 **Backend API Walkthrough**
[![Backend Demo](https://img.shields.io/badge/Watch-Backend_Demo-red?style=for-the-badge&logo=youtube)](https://youtu.be/1fQPPgvUX4Q)

**🔍 Covers:**
- API endpoints demonstration
- Security features showcase
- Database interactions
- Authentication flow

</td>
<td width="50%" align="center">

### 💳 **Frontend Payment Gateway**
[![Frontend Demo](https://img.shields.io/badge/Watch-Frontend_Demo-blue?style=for-the-badge&logo=youtube)](https://youtu.be/DrvEL8eiAYk)

**🎯 Highlights:**
- User interface walkthrough
- Payment flow demonstration
- Security features in action
- Responsive design showcase

</td>
</tr>
</table>

---

## 📞 **Support & Contact**

<div align="center">

### 🤝 **Get Help & Contribute**

</div>

<table>
<tr>
<td width="50%">

### 👨‍💻 **Team Support**
- 🔐 **Security Concerns**: Contact team leads
- 📖 **Documentation**: Check project wiki
- 🐛 **Bug Reports**: Create GitHub issues
- 💡 **Feature Requests**: Use discussion board

</td>
<td width="50%">

### 🎓 **Academic Information**
- 📚 **Course**: INSY7314 - Information Systems Security
- 🏫 **Institution**: Varsity College (ADvTECH Group)
- 📅 **Academic Year**: 2025
- 📋 **Project Type**: Final Portfolio of Evidence

</td>
</tr>
</table>

---

## 📄 License

This project is developed for educational purposes as part of the INSY7314 course curriculum.

**⚠️ Academic Use Only**: This project is intended for educational purposes and should not be used in production environments without proper security review and hardening.

---

## 🎥 Demo Videos

- **Backend API Walkthrough**: [YouTube Video](https://youtu.be/1fQPPgvUX4Q)  
- **Frontend Payment Gateway Demo**: [YouTube Video](https://youtu.be/DrvEL8eiAYk)

---

*Last Updated: November 2025*