<div align="center">
  <img src="./frontend/src/assets/logo.png" alt="AutoCare Logo" width="150" />
  <h1>AutoCare Premium Vehicle Management Platform</h1>
  <p><strong>A sophisticated, enterprise-grade MERN Stack application engineered to digitize automotive service centers.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/Redux_Toolkit-593D88?style=for-the-badge&logo=redux&logoColor=white" alt="Redux Toolkit" />
  </p>
</div>

<br/>

> **Project Mission**: To provide an end-to-end digital ecosystem scaling from user appointment booking to active mechanic servicing pipelines, culminating in cryptographic digital payment verification and professional PDF receipt generation.

---

## 📑 Table of Contents
- [Core Architecture](#-core-architecture)
- [Key Features & Modules](#-key-features--modules)
  - [Role-Based Access Control (RBAC)](#role-based-access-control)
  - [Simulated Razorpay Gateway](#simulated-razorpay-gateway)
  - [High-Definition PDF Generation](#high-definition-pdf-generation)
- [Database Schema (MongoDB)](#-database-schema)
- [Application Workflows](#-application-workflows)
- [Comprehensive Technical Stack](#-comprehensive-technical-stack)
- [Local Installation & Bootstrapping](#-local-installation--bootstrapping)
- [License](#-license)

---

## 🏗️ Core Architecture
AutoCare is segmented into an independent REST API Express backend and a dynamic Vite + React frontend. Global state is exclusively managed via **Redux Toolkit (RTK)** to seamlessly transport complex data bundles globally without prop-drilling, bridging User Auth headers, JWT tokens, and real-time nested array updates (such as Invoice Line Items).

---

## ✨ Key Features & Modules

### 1. Role-Based Access Control (RBAC)
The application dynamically routes users based on their authenticated `{ role: 'Admin' | 'Technician' | 'Customer' }` property securely bound inside the JWT payload.
* **Customer Dashboard**: Book appointments, register owned vehicles dynamically, track active service statuses, and process outstanding invoice payments.
* **Technician Dashboard**: Claim assigned vehicles, execute multi-stage diagnostic checks (`Pending` ➔ `In Progress` ➔ `Completed`), and inject service line-items into billing records.
* **Administrator Portal**: Omniscient view over the garage operations; assign tasks to employees, generate master invoices, and intercept customer communications.

### 2. Simulated Razorpay Gateway Strategy
To accommodate portfolio and demonstration deployments lacking active developer merchant credentials, a bespoke **Razorpay Mock Engine** was constructed natively on the frontend:
* Bypasses the active `checkout.js` origin rejection limits.
* Replicates the exact Indian Gateway UX (Card selection, UPI integrations, and strict responsive CSS animations).
* Integrates robust state validation ensuring 16-digit CCs, valid boundaries (`MM/YY`), and logical CVV codes.
* Safely transmits a backend `'mock_signature_bypass'` cryptographic hash to safely update the underlying `Invoice.paymentStatus` natively to `"Paid"`.

### 3. High-Definition PDF Generation (`jsPDF`)
The platform replaces basic unformatted plaintext receipts with a heavily stylized Vector calculation map.
When invoices are finalized, the system strictly utilizes `document.rect` and text coordinate mapping to plot a beautiful, premium visual receipt featuring dynamic shaded grids, glowing branding columns, and tabular alignments without external HTML-to-PDF rendering bottlenecks.

---

## 🗄️ Database Schema Structures
The MongoDB clusters are tightly coupled via `mongoose.Schema.Types.ObjectId`, establishing rich referential data integrity.
* `Users Model`: Employs `bcryptjs` hashing algorithms pre-save middleware. Distinguishes platform authority via string enums.
* `Vehicles Model`: Belongs strictly to an un-deleted `User`.
* `Appointments Model`: Populates live relationship states tying `Users`, `Vehicles`, and assigned `Technicians`.
* `Invoices Model`: Aggregates dynamic `lineItems: [{ description, cost }]` arrays, calculating subtotals dynamically ahead of Gateway token generation.

---

## 💻 Comprehensive Technical Stack

| Domain | Core Technologies & Libraries |
| :--- | :--- |
| **Frontend Framework** | `React.js` (React 18), `Vite` compiler |
| **Global State** | `redux`, `react-redux`, `@reduxjs/toolkit` |
| **API Networking** | `axios` (Intercepted Headers) |
| **Routing** | `react-router-dom` v6 |
| **Backend Engine** | `Node.js`, `Express.js` API routing |
| **Database** | `MongoDB` Native Cluster via `mongoose` ODM |
| **Security Architecture** | `bcryptjs` cryptography, `jsonwebtoken` (JWT), `cors` management |
| **UX & UI Styling** | Vanilla `CSS3`, `react-toastify` overlay notifications, `jsPDF` manipulation |

---

##  Local Installation & Bootstrapping

To set up this platform in a sandbox environment locally from scratch, ensure you have **Node 18+** and access to a **MongoDB Atlas Cluster**.

### 1. Repository Setup
```bash
git clone https://github.com/Vijaykumar-1121/VechicleManagement.git
cd VechicleManagement
```

### 2. Dual-Environment Install Pipeline
The project utilizes separate `package.json` boundaries to prevent dependency crossover.
```bash
# Setup Backend
cd backend
npm install

# Setup React Frontend
cd ../frontend
npm install
```

### 3. Environment Secrets Configure
Create discrete .env files in both the frontend and backend trees.

**`backend/.env` Requirements**
```env
# Required Node.js environment variables
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0...
JWT_SECRET=any_crypto_secure_randomly_generated_string

# Razorpay Config (Dummy credentials sufficient during bypass testing)
RAZORPAY_KEY_ID=rzp_test_placeholder_key_ab0321
RAZORPAY_KEY_SECRET=secret_placeholder_abcd1234
```

### 4. Application Launch
Start both environments concurrently in separate terminal panels.
```bash
# Terminal 1: Boot Node API
cd backend
npm run dev

# Terminal 2: Boot Vite Compiler
cd frontend
npm run dev
```
Navigate to the localized deployment link provided by Vite (`http://localhost:5173/`).

## Live Demo Link

https://autocare-mvsnb.onrender.com/

---

## 🏛️ License
Available under the MIT Open Source standard pipeline configuration. Architecture designed expressly for professional developer portfolios.
