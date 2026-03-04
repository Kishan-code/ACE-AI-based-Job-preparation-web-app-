# 🎯 (ACE) Job Preparation Web App

> **Ace Your Interviews with AI-Powered Analysis** — An intelligent platform that analyzes your resume against job descriptions and generates personalized interview insights, questions, and comprehensive feedback.

<p align="center">

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.2-13AA52?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Google GenAI](https://img.shields.io/badge/Google-GenAI-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)

</p>

---

## 📋 Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Usage Guide](#usage-guide)
- [Contributing](#contributing)
- [Author](#author)

---

## 🌟 Features

### 🎓 Smart Resume Analysis
- Upload your resume (PDF format) and get instant AI-powered analysis  
- Intelligent matching against job descriptions  
- Detailed compatibility scoring with visual feedback  

### 🤖 AI-Powered Interview Questions
- Generate customized interview questions based on your profile  
- Expertly crafted follow-up questions  
- Questions tailored to your experience level  

### 📄 AI-Generated Tailored Resume
- Automatically generates a resume optimized for the target job description  
- Highlights relevant skills based on role requirements  
- Download as a print-ready PDF  

### 📊 Comprehensive Interview Reports
- Strength and weakness analysis  
- Skill gap identification (High / Medium / Low)  
- Personalized day-by-day preparation strategy  

### 👤 Authentication & Profiles
- Secure JWT-based login system  
- Avatar upload  
- Interview history tracking  

### 📱 Responsive UI
- Mobile & Desktop friendly  
- Smooth animations  
- Dark-themed interface  

---

## 📸 Screenshots



### Splash Screen
![Splash Screen](./screenshots/splash-screen-loader.png)

### Home Page
![Home Page 1](./screenshots/home-page-1.png)
![Home Page 2](./screenshots/home-page-2.png)

### Interview Report
![Interview Report 1](./screenshots/interview-report-file-1.png)
![Interview Report 2](./screenshots/interview-report-file-2.png)

### User Management
![Login Page](./screenshots/login-page.png)
![Registration Page](./screenshots/registration-page.png)
![Profile Page](./screenshots/profile-page.png)

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|------------|----------|
| React 19 | UI Development |
| Vite | Build Tool |
| Redux Toolkit | State Management |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| React Router | Routing |
| Axios | API Requests |

### Backend

| Technology | Purpose |
|------------|----------|
| Node.js + Express | Server |
| MongoDB | Database |
| Mongoose | ODM |
| Google GenAI | AI Analysis |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Multer | File Upload |
| ImageKit | Image Storage |
| Puppeteer | PDF Generation |
| pdf-parse | PDF Text Extraction |

---

## 📁 Project Structure

```
Job-Preparation-Web-App/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── store/
│   │   └── App.jsx
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── services/
│   └── package.json
│
└── screenshots/
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- Google GenAI API Key
- ImageKit Account

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Kishan-code/Job-Preparation-Web-App.git
cd Job-Preparation-Web-App
```

---

### 2️⃣ Setup Backend

```bash
cd server
npm install
```

Create `.env` file:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_GENAI_API_KEY=your_key
IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_PRIVATE_KEY=your_key
IMAGEKIT_URL_ENDPOINT=your_url
CLIENT_URL=http://localhost:5173
```

Run server:

```bash
npm run dev
```

---

### 3️⃣ Setup Frontend

```bash
cd ../client
npm install
npm run dev
```

Visit:

```
http://localhost:5173
```

---

## 📖 Usage Guide

1. Register/Login  
2. Upload Resume (PDF)  
3. Add Self Description  
4. Paste Job Description  
5. Click Analyze  
6. View Interview Report  
7. Download Tailored Resume PDF  

---

## 🤝 Contributing

1. Fork the repository  
2. Create feature branch  
3. Commit changes  
4. Push and open Pull Request  

---

## 👤 Author

**Kishan Kumar**  
Full Stack Developer  

📧 kumarkishan78254@gmail.com  
🐙 https://github.com/Kishan-code  
💼 https://www.linkedin.com/in/kishan-kumar-6772a2338/

---

<p align="center">
⭐ If you found this helpful, please consider giving it a star!
</p>
