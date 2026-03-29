interface PredictionRequest {
    templeId: string;
    date: string;
    startTime: string;
    historical_fill_rate: number;
    is_weekend: boolean;
    is_festival: boolean;
}

interface PredictionResponse {
    crowd_level: string;
    estimated_wait_time_mins: number;
    confidence_score: number;
}

export const getCrowdPrediction = async (params: PredictionRequest): Promise<PredictionResponse | null> => {
    try {
        const response = await fetch('http://127.0.0.1:8000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });

        if (!response.ok) {
            console.error('Failed to fetch from AI Service:', response.statusText);
            return null;
        }

        const data = await response.json();
        return data as PredictionResponse;
    } catch (error) {
        console.error('Error connecting to AI Service:', error);
        return null; // Gracefully fallback if AI service is down
    }
};
