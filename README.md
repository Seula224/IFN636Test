IFN636: Debate Hall - Task Management System  
Project Overview

This repository contains a full-stack Task Management System designed for the IFN636 Software Life Cycle Management assessment. The project demonstrates a modern software development lifecycle, featuring a React frontend, a Node.js/Express backend, and a robust CI/CD pipeline deployed on AWS.
Key Features

    User Identity Module: Secure registration and login using JWT (JSON Web Tokens).

    Full CRUD Functionality: Create, Read, Update, and Delete debate topics.

    Data Sanitization: Protection against malformed JSON and script injections.

    Automated Quality Assurance: 31 comprehensive integration tests covering edge cases.

Tech Stack

    Frontend: React.js, NPM

    Backend: Node.js, Express.js

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
