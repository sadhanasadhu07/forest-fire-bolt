import React, { useEffect, useRef } from 'react';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
import { PredictionData, Region } from '../types';

// Register chart components
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

interface RiskAnalysisProps {
  predictionData: PredictionData | null;
  selectedRegion: Region | null;
}

const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ predictionData }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !predictionData) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['High Risk', 'Moderate Risk', 'Low Risk'],
        datasets: [{
          data: [
            predictionData.highRiskArea,
            predictionData.moderateRiskArea,
            predictionData.lowRiskArea
          ],
          backgroundColor: ['#ef4444', '#f97316', '#22c55e'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          }
        }
      }
    });

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [predictionData]);

  return (
    <div>
      <h2>Fire Risk Distribution</h2>
      <div style={{ width: '400px', height: '400px' }}>
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default RiskAnalysis;
