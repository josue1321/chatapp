# 💬 Real-Time Chat App

A full-stack real-time chat application with user authentication, contact management, and live messaging using **React**, **.NET APIs**, **SignalR**, and **MongoDB**.

> 📚️ **Study Project** — This application was built for learning purposes  
> 🚧 **Work in Progress** — This project is **still under development**

---

## 🧩 Project Structure
📦 **ChatApp/**
├── **frontend/** – React + TypeScript client  
├── **UserApi/** – .NET API for user auth & chat metadata  
└── **ChatApi/** – .NET API for real-time messaging (SignalR + MongoDB)

---

## ✨ Features

### ✅ Core Chat Functionality
- Real-time messaging using SignalR
- MongoDB-based message storage
- Contact list with recent chat activity
- Live conversation updates
- Indication of sent and read messages
- Search for users

### 🔐 User Authentication
- Register / Login (JWT-based)
- Secure token generation

---

## 🛠 Tech Stack

| Frontend            | Backend (User API)   | Backend (Chat API)     |
|---------------------|----------------------|-------------------------|
| React + TypeScript  | .NET Web API + EF    | .NET Web API           |
| Vite                | SQL Server (EF Core) | SignalR               |
| Chakra UI           | JWT Auth             | MongoDB                |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/josue1321/ChatApp.git
cd ChatApp
```
### 2. Setup the Frontend
Change the .env file variable values

```bash
cd frontend
npm install
npm run dev
```
### 3. Setup User API
Open UserApi/UserApi.sln in Visual Studio or VS Code

Update appsettings.json with your SQL Server connection string

Run the API

### 4. Setup Chat API
Open ChatApi/ChatApi.sln

Update appsettings.json with your MongoDB config

Run the API (SignalR will handle WebSocket connections)

## ⚙️ Environment Configuration
### Both APIs need environment configs for:

- Database connection strings

- JWT Secret (User API)

- CORS settings for frontend URL