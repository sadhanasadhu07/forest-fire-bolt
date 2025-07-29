from sklearn.preprocessing import MinMaxScaler
import pandas as pd
import os

def preprocess_data(region_name):
    file_path = f"data/{region_name}_weather.csv"
    df = pd.read_csv(file_path)
    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(df)
    return {
        "original_shape": df.shape,
        "scaled_sample": scaled[:5].tolist()
    }