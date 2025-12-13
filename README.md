# 🎓 Student Management System

A full-stack **Student Management System** built using **React.js**, **Node.js**, **Express**, and **MongoDB**.  
The application supports **JWT-based authentication**, **student CRUD operations**, **search with pagination**, and a **fully responsive UI**.

---

## 🚀 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Express Validator

---

## 📁 Project Structure

student-management-system/

├── frontend/

│ ├── src/

│ ├── public/

│ └── package.json

│

├── backend/

│ ├── models/

│ ├── routes/

│ ├── middleware/

│ ├── controllers/

│ ├── server.js

│ └── package.json

│

└── README.md


---

## ✨ Features

- User login with JWT authentication
- Protected routes (frontend & backend)
- Create, update, and delete students
- Search by Student ID, Name, Email, and Phone number
- Pagination with debounced search
- Fully responsive UI (mobile & desktop)
- Clean and modular project structure

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/student-management-system.git
cd student-management-system
```
### 2️⃣ Open Project in VS Code

- Open VS Code
- Click File → Open Folder
- Select the student-management-system folder

### 3️⃣ Backend Setup

Open a terminal inside the backend folder:

```
cd backend
```

Install dependencies:
```
npm install
```

Create a .env file in the backend folder:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/studentdb
JWT_SECRET=your_jwt_secret
```

Start the backend server:
```
npm run dev
```

Verify that MongoDB is running and connected successfully.

Backend will run on:
```
http://localhost:5000
```

### 4️⃣ Frontend Setup

Open a new terminal and navigate to the frontend folder:
```
cd frontend
```

Install dependencies:
```
npm install
```

Start the frontend application:
```
npm run dev
```

Frontend will run on:
```
http://localhost:3000
```
## Email and Password
```
ADMIN_EMAIL = admin@sms.com
ADMIN_PASSWORD = Admin@123
```

![Screenshot of my project1](https://github.com/siddharth6164/student-management-system/blob/master/frontend/public/SMS1.png)
``` ```
![Screenshot of my project2](https://github.com/siddharth6164/student-management-system/blob/master/frontend/public/SMS2.jpeg)
``` ```
![Screenshot of my project3](https://github.com/siddharth6164/student-management-system/blob/master/frontend/public/SMS3.jpeg)
