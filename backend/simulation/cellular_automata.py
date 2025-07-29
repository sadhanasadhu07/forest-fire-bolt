def simulate_fire(prediction_result):
    score = prediction_result['fire_risk_score']
    spread_area = score * 1000  # Dummy calculation
    return {
        "spread_estimate": spread_area,
        "severity": "Severe" if score > 0.7 else "Moderate"
    }