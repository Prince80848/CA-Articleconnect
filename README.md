# ArticleConnect - CA Articleship Platform

ArticleConnect is a comprehensive MERN stack platform designed to bridge the gap between Chartered Accountancy (CA) students and CA firms across India. It streamlines the articleship structured placement process by providing a centralized hub for job postings, applications, and premium candidate features.

## 🚀 Key Features

### 👨‍🎓 For Students
*   **Profile Creation:** Build a detailed profile including ICAI registration, skills, and academic history.
*   **Resume Management:** Upload and manage PDF resumes (reliably stored via Cloudinary).
*   **Job Seeking:** Browse active articleship openings, filter by location/skills, and apply directly.
*   **Premium Subscriptions:** Purchase Premium/Pro plans via **Razorpay** to get profile boosts, unlimited applications, and priority support.

### 🏢 For Firms
*   **Firm Registration:** Secure sign-up process with an Admin verification gate to ensure authenticity.
*   **Job Management:** Post, edit, close, and delete job listings (specifying salary, locations, out-station requirements).
*   **Candidate Management:** Review applications via a seamless Kanban-style tracking system (Applied → Shortlisted → Interviewed → Hired/Rejected).
*   **Resume Viewing:** Directly view applicant resumes in an inline Google Docs viewer or download them natively.

### 👑 For Admins
*   **Dashboard Oversight:** Complete control over managing users, firms, jobs, and applications.
*   **Firm Verification:** Approve or reject newly registered firms before they can post jobs.
*   **Global Access:** Ability to edit or moderate any job posting or application status.

---

## 🛠️ Technology Stack

The project is structured as a monorepo containing distinct `frontend` and `backend` directories.

*   **Frontend:** React 18, Vite, Tailwind CSS (Custom `#8D1589` brand palette), Redux Toolkit, React Router, React Hot Toast.
*   **Backend:** Node.js, Express.js, MongoDB + Mongoose, JWT Authentication.
*   **Infrastructure & Third-Party APIs:**
    *   **Cloudinary:** Secure cloud storage and delivery of PDF resumes via `.secure_url`.
    *   **Razorpay:** Integrated payment gateway for processing secure student/firm subscription payments.
    *   **Vercel:** Production hosting environment for both the Vite React frontend and the Serverless Express backend.

---

## 💻 Local Development Setup

To run this project locally, you will need Node.js and a MongoDB Database setup.

### 1. Clone the repository
```bash
git clone https://github.com/Prince80848/CA-Articleconnect.git
cd CA-Articleconnect
```

### 2. Backend Setup
Navigate into the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173

# Razorpay Keys
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Cloudinary Keys (Make sure Cloud Name is a single word, no spaces!)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Create a `.env` or `.env.local` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

---

## ☁️ Deployment Notes (Vercel)

Both the frontend and backend are optimized for Vercel. 

### Backend Vercel Caveats
1.  **Environment Variables:** When deploying the backend to Vercel, ensure you assign the environment variables in the Vercel Dashboard precisely. Do NOT include trailing spaces or hidden newline (`\r\n`) characters, as it will crash SDKs like Cloudinary and Razorpay.
2.  **MongoDB IP Whitelist:** Vercel serverless functions change IPs constantly. Your MongoDB Atlas cluster's Network Access MUST have `0.0.0.0/0` (Allow Access From Anywhere) enabled, otherwise DB operations (like saving a payment hook) will result in random `500` timeout errors.
3.  **Local Storage Migration:** Vercel does not persist changes to the local file system. Features like Resumes require external cloud storage (Cloudinary) to securely persist files across stateless invocations.

---
*Developed for the CA Articleship Community.*
