
# 🎓 Tutone Platform

A full-stack course enrollment platform built using **Node.js**, **Express**, **MongoDB**, and **React.js**, with **Razorpay** integration for secure payments.

---

## 📁 Folder Structure

```text
project-root/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend/
│   └── src/
│       ├── pages/
│       ├── components/
│       └── App.jsx
│   └── index.html
├── .env
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/tutone-platform.git
cd tutone-platform
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

---

### 3. Configure Environment Variables

Create a `.env` file in the `backend/` directory with the following:

```ini
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret
```

---

### 4. Start the Backend Server

```bash
npm start
```

This will start the backend server at:

```
http://localhost:5000
```

---

### 5. Setup Frontend

```bash
cd ../frontend
npm install
npm start
```

This will start the React development server at:

```
http://localhost:3000
```

---

## ✨ Features

- 🔐 User Authentication (JWT)
- 🎓 Course Enrollment
- 💳 Razorpay Payment Integration
- 📚 "My Courses" Dashboard
- 🧠 Role-Based UI for Student, Teacher, Admin
- 🌐 REST API with Express
- 🧩 Modular Folder Structure

---

## 🔧 Technologies Used

- **Frontend:** React.js, TailwindCSS (if used)
- **Backend:** Node.js, Express.js, MongoDB
- **Payment Gateway:** Razorpay
- **Auth:** JWT (JSON Web Tokens)
- **Database:** MongoDB Atlas or local

---

## 📎 API Routes (Backend)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/register` | POST | Register a new user |
| `/api/login` | POST | User login |
| `/api/courses` | GET | Get all available courses |
| `/api/enroll` | POST | Enroll in a course |
| `/user/:userId/courses` | GET | Get enrolled courses |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙋‍♂️ Author

**Sathvik Goli**  
[GitHub](https://github.com/sathvikgoli)  
Feel free to contribute or raise issues.

---
