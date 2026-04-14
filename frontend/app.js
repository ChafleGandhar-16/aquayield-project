// ═══════════════════════════════════════════════════════
//  AquaYield - Frontend Application Logic
//  Handles prediction requests & Firebase Firestore sync
// ═══════════════════════════════════════════════════════

// --- Firebase SDK Imports (v9+ modular) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    limit,
    getDocs,
    serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// --- Firebase Configuration ---
// ⚠️ Replace with your actual Firebase project credentials
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
};

// Initialize Firebase & Firestore
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// --- DOM References ---
const form = document.getElementById("prediction-form");
const predictBtn = document.getElementById("predict-btn");
const btnText = predictBtn.querySelector(".btn-text");
const btnLoader = predictBtn.querySelector(".btn-loader");
const resultSection = document.getElementById("result-section");
const resultLiters = document.getElementById("result-liters");
const resultDetails = document.getElementById("result-details");
const errorSection = document.getElementById("error-section");
const errorMessage = document.getElementById("error-message");
const historyList = document.getElementById("history-list");

// --- API Configuration ---
const API_URL = "http://localhost:8000/api/predict";

// ─────────────────────────────────────────────
//  Prediction Form Handler
// ─────────────────────────────────────────────
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Harvest input values
    const temperature = parseFloat(document.getElementById("temperature").value);
    const humidity = parseFloat(document.getElementById("humidity").value);
    const soil_moisture = parseFloat(document.getElementById("soil_moisture").value);

    // Validate
    if (isNaN(temperature) || isNaN(humidity) || isNaN(soil_moisture)) {
        showError("Please fill in all fields with valid numbers.");
        return;
    }

    // Set loading state
    setLoading(true);
    hideError();
    hideResult();

    try {
        // Call FastAPI backend
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ temperature, humidity, soil_moisture }),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.status === "success") {
            // Display result
            showResult(data.recommended_liters, { temperature, humidity, soil_moisture });

            // Save to Firestore
            await saveToFirestore(temperature, humidity, soil_moisture, data.recommended_liters);

            // Refresh history
            await loadHistory();
        } else {
            showError("Unexpected response from the server.");
        }
    } catch (err) {
        console.error("[AquaYield] Prediction error:", err);

        if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
            showError(
                "Cannot connect to the AI backend. Please ensure the FastAPI server is running on http://localhost:8000"
            );
        } else {
            showError(err.message || "An unexpected error occurred.");
        }
    } finally {
        setLoading(false);
    }
});

// ─────────────────────────────────────────────
//  UI State Management
// ─────────────────────────────────────────────
function setLoading(isLoading) {
    predictBtn.disabled = isLoading;
    btnText.hidden = isLoading;
    btnLoader.hidden = !isLoading;
}

function showResult(liters, inputs) {
    resultLiters.textContent = liters.toLocaleString(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
    });

    resultDetails.innerHTML = `
        <div class="detail-chip">
            <span class="label">Temperature</span>
            <span class="value">${inputs.temperature}°C</span>
        </div>
        <div class="detail-chip">
            <span class="label">Humidity</span>
            <span class="value">${inputs.humidity}%</span>
        </div>
        <div class="detail-chip">
            <span class="label">Soil Moisture</span>
            <span class="value">${inputs.soil_moisture}%</span>
        </div>
    `;

    resultSection.hidden = false;
    resultSection.style.animation = "none";
    // Trigger reflow for re-animation
    void resultSection.offsetHeight;
    resultSection.style.animation = "fadeInUp 0.5s ease both";
}

function hideResult() {
    resultSection.hidden = true;
}

function showError(msg) {
    errorMessage.textContent = msg;
    errorSection.hidden = false;
    errorSection.style.animation = "none";
    void errorSection.offsetHeight;
    errorSection.style.animation = "fadeInUp 0.4s ease both";
}

function hideError() {
    errorSection.hidden = true;
}

// ─────────────────────────────────────────────
//  Firestore Integration
// ─────────────────────────────────────────────
async function saveToFirestore(temperature, humidity, soil_moisture, recommended_liters) {
    try {
        await addDoc(collection(db, "predictions_history"), {
            temperature,
            humidity,
            soil_moisture,
            recommended_liters,
            timestamp: serverTimestamp(),
        });
        console.log("[AquaYield] Prediction saved to Firestore.");
    } catch (err) {
        console.warn("[AquaYield] Firestore write failed (credentials may not be configured):", err.message);
    }
}

async function loadHistory() {
    try {
        const q = query(
            collection(db, "predictions_history"),
            orderBy("timestamp", "desc"),
            limit(3)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            historyList.innerHTML = `<li class="history-empty">No predictions recorded yet.</li>`;
            return;
        }

        historyList.innerHTML = "";
        snapshot.forEach((doc) => {
            const d = doc.data();
            const time = d.timestamp
                ? new Date(d.timestamp.seconds * 1000).toLocaleString()
                : "Just now";

            const li = document.createElement("li");
            li.innerHTML = `
                <div class="history-params">
                    <span>🌡️ ${d.temperature}°C</span>
                    <span>💧 ${d.humidity}%</span>
                    <span>🌱 ${d.soil_moisture}%</span>
                </div>
                <div class="history-result">${d.recommended_liters.toLocaleString()} L/Ha</div>
                <div class="history-time">${time}</div>
            `;
            historyList.appendChild(li);
        });
    } catch (err) {
        console.warn("[AquaYield] Firestore read failed:", err.message);
    }
}

// ─────────────────────────────────────────────
//  Initialize: Load history on page load
// ─────────────────────────────────────────────
loadHistory();
