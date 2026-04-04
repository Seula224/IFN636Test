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

---

## 🚀 CI/CD & Deployment
This project utilizes a **Self-Hosted GitHub Actions Runner** on an AWS EC2 instance. 

### Automation Workflow:
1. **Build:** Installs dependencies and generates the React production build.
2. **Environment:** Dynamically creates the `.env` file using the `PROD` GitHub Secret.
3. **QA:** Executes **31 automated integration tests** (Mocha/Supertest).
4. **Deploy:** Uses PM2 to restart services for zero-downtime updates.

---

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
