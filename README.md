# Grad IQ – INY7314
**Repository:** `insy7314-part2-gradiq`  
**Tech Stack:**  MERN   
**Author(s):** 
- Jayden Larkins
- Gerhard Lemmer
- Thatho Mokoena
- Mokran Ait Amara

**Date:** 02 October 2025 

---
# 📡 PayFlow RESTful API – Backend
Node.js + Express + MongoDB backend for the **PayFlow** payment system project.  
This API powers the React Frontend, handling **authentication and payments**.

---
# 🌐 PayFlow Frontend  
React used along with axios and react-router-dom for efficient api calls and navigation.  

---
## ✨ Features 
### Node.js Backend
- RESTful API built with **Express**.  
- Authentication with **JWT** & **HTTP-Only Cookies**.  
- MongoDB for persistent storage.  
- Secure hashing with **bcrypt** for sensitive information.  
- Rate limiting middleware.
- Helmet for secure headers.
- RegEx Whitelist for all inputs.
- Sanitisation for XSS Protection.
- CORS implementation.  

---

## 🏗️ Architecture
### Backend
- **Express.js** app with modular routes & controllers  
- **Native MongoDB**  
- **JWT authentication middleware**
- **HTTP-Only** cookies  

### Frontend
- **React**
- **React-router-dom** for navigation  
- **Components**  
- **Tailwind.css** for styling  
---
## 📂 All Endpoints  
### 🌐 Public Endpoints
- POST /api/register  
- POST /api/login    

### 📅 Payment Endpoints   
- GET /api/pastPayments  
- POST /api/createPayment 

---
## ⚙️ Installation & Setup  
### Clone the repository and Run  
- git clone https://github.com/VCSTDN2024/insy7314-part2-gradiq.git  
- run 'npm install' in both backend and frontend directories
- add your .env file along with your mongo connection string and JWT_SECRET in the backend directory  
- run 'npm run dev' in backend and 'npm start' in frontend  
- Press 'Windows + R' and then enter 'chrome.exe --ignore-certificate-errors --user-data-dir="C;/temp/chrome_dev" --disable-web-security'  
- Click Enter and broswer 👌  

---
## Demo Links  
TBD
