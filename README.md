# AquaPure • Water Quality Classification Architecture
### Developed with pride by Team Skill G
**Project Owners:** Aqib Pansare & Shamita Marathe

---

## 🌊 Overview
An end-to-end, decoupled machine learning web application that translates 9 raw water sensor metrics into a definitive binary safety verdict (Safe / Unsafe).

- **Backend**: FastAPI (Python 3.11) with zero pandas dependencies for lightweight, crash-free execution. Loads `water_quality_model.pkl` and `scaler.pkl`.
- **Frontend**: React 18 with Vite, Tailwind CSS v4, and Google Font **Poppins**.
- **Aesthetic**: Aquatic glassmorphism design with responsive tactile card sliders, mobile bottom navigation, and glitch-free browser history.

---

## 🚀 Running Locally

### 1. Start the FastAPI Backend
In the project root directory:
```bash
python -m uvicorn api.index:app --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/`
- Prediction Endpoint: `http://localhost:8000/api/predict`

### 2. Start the React Frontend
In a new terminal:
```bash
cd frontend
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## ☁️ Free Deployment Guide (Turnkey & Production Ready)

This repository is pre-configured with **Infrastructure-as-Code** for zero-cost deployment:
- **FastAPI Backend**: [Render](https://render.com) (Free Tier) via `render.yaml`
- **React Frontend**: [Vercel](https://vercel.com) (Free Tier) via `frontend/vercel.json`

---

### Step 1: Push Code to GitHub

Open a terminal in the root directory:
```bash
git add .
git commit -m "feat: complete AquaPure React and FastAPI architecture"
git branch -M main
# Create a new repository on https://github.com/new and link it:
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git
git push -u origin main
```

---

### Step 2: Deploy the FastAPI Backend to Render (Free)

1. Sign up / log in to [Render.com](https://render.com).
2. Click **New +** → **Web Service**.
3. Select **"Build and deploy from a Git repository"** and choose your GitHub repo.
4. Fill in the service configuration:
   - **Name**: `aquapure-fastapi`
   - **Region**: Closest to you (e.g., Frankfurt, Oregon, Singapore)
   - **Branch**: `main`
   - **Root Directory**: `.` *(leave empty or dot)*
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn api.index:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: **Free**
5. Click **Create Web Service**.
6. Wait 1-2 minutes for the deployment to finish. Render will give you a public URL (e.g. `https://aquapure-fastapi.onrender.com`).
   - Test it by opening `https://aquapure-fastapi.onrender.com/` in your browser. You should see `{"status":"online", ...}`.

---

### Step 3: Deploy the React Frontend to Vercel (Free)

1. Sign up / log in to [Vercel.com](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import your GitHub repository.
4. In the configuration screen:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click "Edit" and choose `frontend`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables**:
   - Add a new variable:
     - **Name**: `VITE_API_URL`
     - **Value**: Your Render URL from Step 2 (e.g. `https://aquapure-fastapi.onrender.com`)
6. Click **Deploy**.
7. In ~30 seconds, your site is live worldwide with free SSL (e.g., `https://aquapure.vercel.app`)!

---

### Step 4: Verify Live Integration
- Open your live Vercel website on your phone or laptop.
- Click **"Load Safe Tap Water"** or **"Load Contaminated Water"** to test live model inference!
- You can also open the top-right Settings modal anytime to test latency or switch backend endpoints.
