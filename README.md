<<<<<<< HEAD
# 🏛️ IFN636: Online Debate Platform
[![CI/CD Pipeline](https://github.com/Seula224/IFN636Test/actions/workflows/IFN636Seula.yml/badge.svg)](https://github.com/Seula224/IFN636Test/actions/workflows/IFN636Seula.yml)

## 📋 Project Overview
A full-stack CRUD application developed for **IFN636 Software Life Cycle Management**. This platform allows users to manage debate topics through a secure, automated lifecycle deployed on AWS.

### 🛠️ Tech Stack
* **Frontend:** React.js
* **Backend:** Node.js / Express
* **Database:** MongoDB 
* **Reverse Proxy:** Nginx
* **Process Manager:** PM2
=======
IFN636: Debate Hall - Task Management System  
Project Overview

This repository contains a full-stack Task Management System designed for the IFN636 Software Life Cycle Management assessment. The project demonstrates a modern software development lifecycle, featuring a React frontend, a Node.js/Express backend, and a robust CI/CD pipeline deployed on AWS.
Key Features

    User Identity Module: Secure registration and login using JWT (JSON Web Tokens).

    Full CRUD Functionality: Create, Read, Update, and Delete debate topics.

    Data Sanitization: Protection against malformed JSON and script injections.
>>>>>>> 40ba24b54753cce5502c5fdf7dc4d46601f511f6

    Automated Quality Assurance: 31 comprehensive integration tests covering edge cases.

<<<<<<< HEAD
## 🚀 CI/CD & Deployment
This project utilizes a **Self-Hosted GitHub Actions Runner** on an AWS EC2 instance. 

### Automation Workflow:
1. **Build:** Installs dependencies and generates the React production build.
2. **Environment:** Dynamically creates the `.env` file using the `PROD` GitHub Secret.
3. **QA:** Executes **31 automated integration tests** (Mocha/Supertest).
4. **Deploy:** Uses PM2 to restart services for zero-downtime updates.
=======
Tech Stack

    Frontend: React.js, NPM
>>>>>>> 40ba24b54753cce5502c5fdf7dc4d46601f511f6

    Backend: Node.js, Express.js

<<<<<<< HEAD
## 🧪 Testing Status
* ✅ **User Auth:** Registration & Login logic.
* ✅ **CRUD Logic:** Create, Read, Update, and Delete validations.
* ✅ **Security:** Ownership verification and token integrity.
* **Results:** `31 passing`

---

## 🔗 Live Access
* **Public URL:** [http://3.107.204.217:3000](http://3.107.204.217:3000)
* **Instance ID:** `i-077d39f508add1c96` (Seula Koo)



## 👤 Author
**Seula Koo** | Student ID: **n11797231** | QUT 2026
=======
    Database: MongoDB Atlas (Cloud)

    DevOps & Deployment: * CI/CD: GitHub Actions

        Runner: Self-Hosted (AWS EC2)

        Process Management: PM2

        Environment Security: GitHub Secrets & .env injection

ΩI/CD Pipeline Architecture

The project utilizes a custom GitHub Actions workflow tailored for a self-hosted environment. This ensures that every code push to main is automatically verified and deployed.
Pipeline Stages:

    Build Phase: Installs dependencies for both Frontend and Backend and generates the production build of the React application.

    Security & Environment Phase: Dynamically generates a .env file on the production server using GitHub Repository Secrets.

    Test Phase: Executes 31 Automated Integration Tests using Mocha and Supertest.

    Deployment Phase: Automatically restarts the application services using PM2, ensuring zero-downtime updates.

Testing Evidence

The system includes a rigorous testing suite that validates the system's infrastructure, security, and core logic.

Test Categories:

    ✅ User Identity: Registration, Login, and Password Protection.

    ✅ System Infrastructure: Database connectivity and Environment variable loading.

    ✅ Core CRUD: Validating that users can only modify their own data.

    ✅ Negative Testing: Graceful handling of expired tokens, malformed JSON, and invalid IDs.

Current Status: 31 passing (847ms)
Local Setup Instructions

    Clone the Repository:
    Bash

    git clone https://github.com/Seula224/IFN636Test.git
    cd IFN636Test

    Environment Configuration:
    Create a .env file in the /backend directory:
    Code snippet

    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    PORT=5001

    Install & Run:
    Bash

    # Install Backend
    cd backend && npm install
    npm start

    # Install Frontend (New Terminal)
    cd frontend && npm install
    npm start

Author

    Name: Seula Koo

    Student ID: n11797231

    University: Queensland University of Technology (QUT)
>>>>>>> 40ba24b54753cce5502c5fdf7dc4d46601f511f6
