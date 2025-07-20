# 🧠 TUTONE - Online Course Platform

TUTONE is a full-stack web application that allows users to browse, enroll, and rate online courses. It supports user authentication, secure payments via Razorpay, and personalized dashboards.

## 🚀 Features

- 👤 User Authentication (JWT-based)
- 💳 Razorpay Payment Integration
- 📚 Enroll in Courses
- ⭐ Rate & Review Courses
- 🧾 My Courses Section
- 🧩 RESTful APIs (Node.js + Express)
- 💾 MongoDB for Data Storage
- ⚛️ React.js Frontend (Vite)
- 🔒 Protected Routes & Authorization

## 🛠️ Tech Stack

### Frontend
- React.js (with Vite)
- Tailwind CSS
- Context API & Local Storage

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Razorpay API
- JSON Web Tokens (JWT)
- Bcrypt for Password Hashing

---

## 🖼️ Screenshots

| Home Page | Payment | My Courses |
|----------|----------|-------------|
| ![Home](screenshots/home.png) | ![Payment](screenshots/payment.png) | ![My Courses](screenshots/mycourses.png) |

---

## 🧩 Folder Structure
project-root/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── server.js
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ ├── components/
│ │ └── App.jsx
│ └── index.html
├── .env
└── README.md

yaml
Copy
Edit



## ⚙️ Getting Started

### 1. Clone the Repository

git clone https://github.com/yourusername/tutone-platform.git
cd tutone-platform

2. Setup Backend
bash
Copy
Edit
cd backend
npm install

3. Create a .env file:

ini
Copy
Edit
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret

Run the backend:

bash
Copy
Edit
npm start


4. Setup Frontend
bash
Copy
Edit
cd frontend
npm install
npm run dev
