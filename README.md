<![CDATA[<div align="center">

# 💧 AquaYield

### AI-Powered Smart Irrigation Prediction System

[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

*An intelligent agricultural system that uses machine learning to predict optimal irrigation requirements based on real-time environmental conditions.*

---

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#1-backend-setup)
  - [Frontend Setup](#2-frontend-setup)
  - [Firebase Setup (Optional)](#3-firebase-setup-optional)
- [API Reference](#-api-reference)
- [Machine Learning Model](#-machine-learning-model)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌍 Overview

**AquaYield** is a full-stack agricultural predictive AI system designed to help farmers make informed irrigation decisions. By inputting real-time environmental parameters — **temperature**, **humidity**, and **soil moisture** — the system uses a trained **RandomForestRegressor** model to predict the optimal amount of water (in liters per hectare) needed for irrigation.

The project addresses a critical environmental challenge: **water conservation in agriculture**. Over-irrigation leads to water waste, soil degradation, and nutrient runoff, while under-irrigation reduces crop yields. AquaYield aims to strike the perfect balance using data-driven predictions.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Predictions** | RandomForestRegressor model predicts irrigation needs in liters/hectare |
| 🌡️ **Environmental Inputs** | Accepts temperature (°C), humidity (%), and soil moisture (%) |
| ⚡ **Real-time API** | FastAPI backend delivers predictions with sub-second response times |
| 🔥 **Firebase Integration** | Prediction history is stored and synced via Cloud Firestore |
| 📜 **Prediction History** | Displays the last 3 predictions with timestamps |
| 🌙 **Premium Dark Theme** | Sleek, modern glassmorphism-based dark UI |
| 📱 **Responsive Design** | Fully responsive across desktop, tablet, and mobile |
| ✨ **Micro-animations** | Smooth transitions, hover effects, and loading states |

---

## 🛠️ Tech Stack

### Backend
- **Python 3.9+** — Core language
- **FastAPI** — High-performance async REST API framework
- **Uvicorn** — ASGI server
- **scikit-learn** — RandomForestRegressor for ML predictions
- **Pandas** — Data loading and preprocessing
- **NumPy** — Numerical operations
- **Joblib** — Model serialization/deserialization
- **Pydantic** — Request/response validation schemas

### Frontend
- **HTML5** — Semantic structure
- **Vanilla CSS** — Custom premium dark theme with CSS custom properties
- **Vanilla JavaScript (ES6+)** — Modular application logic
- **Google Fonts (Inter)** — Modern typography

### Database
- **Firebase Cloud Firestore** — NoSQL database for prediction history

---

## 📁 Project Structure

```
aquayield-project/
│
├── backend/
│   ├── main.py                 # FastAPI server & prediction endpoint
│   ├── train.py                # Model training script
│   ├── dummy_data.csv          # Sample training dataset
│   ├── aquayield_model.pkl     # Trained model artifact (auto-generated)
│   └── requirements.txt        # Python dependencies
│
├── frontend/
│   ├── index.html              # Main dashboard page
│   ├── styles.css              # Premium dark theme stylesheet
│   └── app.js                  # Frontend logic & Firebase integration
│
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.9+** installed ([Download](https://www.python.org/downloads/))
- **pip** package manager
- A modern web browser (Chrome, Firefox, Edge, Safari)
- *(Optional)* A Firebase project for prediction history

### 1. Backend Setup

```bash
# Clone the repository
git clone https://github.com/your-username/aquayield-project.git
cd aquayield-project

# Navigate to backend
cd backend

# Create and activate a virtual environment (recommended)
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Train the ML model (generates aquayield_model.pkl)
python train.py

# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API server will be running at: **http://localhost:8000**

> 💡 Visit **http://localhost:8000/docs** for the auto-generated Swagger API documentation.

### 2. Frontend Setup

The frontend is a static site — no build tools required.

```bash
# From the project root, navigate to frontend
cd frontend

# Option A: Open directly in browser
start index.html               # Windows
# open index.html              # macOS

# Option B: Use a local HTTP server (recommended for ES modules)
python -m http.server 5500
# Then visit http://localhost:5500
```

> ⚠️ **Important:** The frontend uses ES module imports for Firebase SDK. For best results, serve it via an HTTP server rather than opening the file directly.

### 3. Firebase Setup (Optional)

To enable prediction history tracking:

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project
2. Enable **Cloud Firestore** in the project
3. Copy your Firebase configuration object
4. Open `frontend/app.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
};
```

> The system works fully without Firebase — predictions are still computed and displayed. Firebase only adds persistent history tracking.

---

## 📡 API Reference

### Health Check

```
GET /
```

**Response:**
```json
{
  "message": "AquaYield API is running."
}
```

### Predict Irrigation

```
POST /api/predict
```

**Request Body:**
```json
{
  "temperature": 32.0,
  "humidity": 55.0,
  "soil_moisture": 30.0
}
```

| Parameter | Type | Range | Description |
|-----------|------|-------|-------------|
| `temperature` | `float` | 0 – 60 | Current temperature in °C |
| `humidity` | `float` | 0 – 100 | Current relative humidity in % |
| `soil_moisture` | `float` | 0 – 100 | Current soil moisture level in % |

**Response:**
```json
{
  "status": "success",
  "recommended_liters": 3850.25
}
```

| Field | Type | Description |
|-------|------|-------------|
| `status` | `string` | `"success"` on successful prediction |
| `recommended_liters` | `float` | Recommended water in liters per hectare |

---

## 🧠 Machine Learning Model

| Property | Details |
|----------|---------|
| **Algorithm** | `RandomForestRegressor` |
| **Library** | scikit-learn |
| **Estimators** | 100 trees |
| **Features** | Temperature (°C), Humidity (%), Soil Moisture (%) |
| **Target** | Irrigation requirement (liters/hectare) |
| **Training Data** | `dummy_data.csv` — 10 synthetic samples |
| **Serialization** | Joblib (`.pkl` file) |

### Training Data Sample

| Temperature (°C) | Humidity (%) | Soil Moisture (%) | Irrigation (L/Ha) |
|:-:|:-:|:-:|:-:|
| 35 | 40 | 20 | 4,800 |
| 28 | 65 | 55 | 2,200 |
| 42 | 30 | 15 | 5,500 |
| 22 | 75 | 70 | 1,200 |
| 40 | 25 | 10 | 6,000 |

**Key Insight:** The model learns that higher temperatures and lower soil moisture correlate with higher irrigation needs, while higher humidity reduces the water requirement.

### Retraining the Model

To retrain with new data, update `backend/dummy_data.csv` with additional samples and run:

```bash
cd backend
python train.py
```

The new model will be saved to `aquayield_model.pkl` and will be loaded automatically on the next server start.

---

## 📸 Screenshots

### Dashboard — Input View
> *Premium dark-themed dashboard with environmental parameter inputs, glassmorphism cards, and animated header.*

### Prediction Result
> *AI prediction result displayed with recommended liters/hectare and input parameter chips.*

### Prediction History
> *Recent predictions fetched from Firebase Firestore with timestamps.*

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is developed as part of an academic coursework (EVS — Semester IV). Feel free to use and modify for educational purposes.

---

<div align="center">

**Built with 💚 for sustainable agriculture**

*AquaYield — Smart Agriculture AI System © 2026*

</div>
]]>
