"""
AquaYield - Model Training Script
Trains a RandomForestRegressor on agricultural irrigation data
and exports the serialized model to aquayield_model.pkl.
"""

import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

def main():
    # Load training data
    data_path = os.path.join(os.path.dirname(__file__), "dummy_data.csv")
    df = pd.read_csv(data_path)
    print(f"[AquaYield] Loaded {len(df)} training samples from dummy_data.csv")

    # Define features and target
    features = ["temperature", "humidity", "soil_moisture"]
    target = "irrigation_liters"

    X = df[features]
    y = df[target]

    # Train RandomForestRegressor
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    print("[AquaYield] RandomForestRegressor trained successfully.")

    # Export trained model
    model_path = os.path.join(os.path.dirname(__file__), "aquayield_model.pkl")
    joblib.dump(model, model_path)
    print(f"[AquaYield] Model saved to {model_path}")

if __name__ == "__main__":
    main()
