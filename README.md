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

---

## 🛠️ Technical Case Study: Frontend Connectivity Migration

When the AWS Public IP changed to 3.107.204.217, the existing production build of the frontend became "stale," as it was still attempting to communicate with the legacy API endpoint. To resolve this environment mismatch, I performed the following three-step migration:

1. **Configuration Update:** I modified frontend/src/axiosConfig.jsx to point to the new Public IP and Backend Port (5001).
2. **Production Re-build:** Since React is a compiled library, simply saving the .jsx file does not update the live site. I executed npm run build within the frontend directory to "bake" the new IP into the static production assets.
3. **Process Refresh:** Finally, I utilized pm2 restart debate-frontend to ensure the process manager was serving the newly generated build folder.

This process was critical in maintaining Environment Parity—ensuring the frontend and backend were perfectly aligned in the new production context.

---

## Test Credential (users)
1. **email:** seula224@gmail.com |   test1@test.com
2. **pass:**  test               |   test
