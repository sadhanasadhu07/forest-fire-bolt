from fastapi import FastAPI, Query
from preprocessing.data_preprocessing import preprocess_data
from segmentation.unet_segmentation import segment_fire
from prediction.lstm_prediction import predict_fire
from simulation.cellular_automata import simulate_fire
from utils.raster_utils import load_raster

app = FastAPI()

@app.get("/predict")
def predict(region: str = Query(...)):
    preprocessed = preprocess_data(region)
    segmented = segment_fire(region)
    prediction = predict_fire(preprocessed)
    simulation_result = simulate_fire(prediction)
    
    return {
        "region": region,
        "preprocessing_summary": preprocessed,
        "segmented_fire_areas": segmented,
        "fire_prediction": prediction,
        "simulation_result": simulation_result
    }