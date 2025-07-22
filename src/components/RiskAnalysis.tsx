import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { PredictionData, Region } from '../types';

interface RiskAnalysisProps {
  predictionData: PredictionData | null;
  selectedRegion: Region | null;
}

const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ predictionData, selectedRegion }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!chartRef.current || !predictionData || !window.Chart) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart
    if (chartRef.current.chart) {
      chartRef.current.chart.destroy();
    }

    const chart = new window.Chart(ctx, {
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

    chartRef.current.chart = chart;

    return () => {
      if (chart) chart.destroy();
    };
  }, [predictionData]);

  const formatArea = (area: number) => {
    return area.toLocaleString(undefined, { maximumFractionDigits: 1 });
  };

  const formatPercentage = (value: number, total: number) => {
    return ((value / total) * 100).toFixed(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Risk Analysis
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Comprehensive fire risk assessment and statistical analysis
        </p>
      </div>

      {!predictionData ? (
        <div className="bg-white dark:bg-gray-800 p-12 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Analysis Data Available
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Please select a region and run the prediction model to view risk analysis.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Region Selection
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Risk Distribution
              </h3>
            </div>
            <div className="h-64 relative">
              <canvas ref={chartRef}></canvas>
            </div>
          </motion.div>

          {/* Risk Statistics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Risk Statistics
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">High Risk Areas</span>
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">
                    {formatPercentage(predictionData.highRiskArea, predictionData.totalArea)}%
                  </span>
                </div>
                <p className="text-sm text-red-600 dark:text-red-400">
                  {formatArea(predictionData.highRiskArea)} km² of total area
                </p>
              </div>

              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Moderate Risk Areas</span>
                  <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    {formatPercentage(predictionData.moderateRiskArea, predictionData.totalArea)}%
                  </span>
                </div>
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  {formatArea(predictionData.moderateRiskArea)} km² of total area
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Low Risk Areas</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatPercentage(predictionData.lowRiskArea, predictionData.totalArea)}%
                  </span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {formatArea(predictionData.lowRiskArea)} km² of total area
                </p>
              </div>
            </div>
          </motion.div>

          {/* Model Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Model Performance & Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {(predictionData.confidence * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Model Confidence</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${predictionData.confidence * 100}%` }}
                  />
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  94.2%
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Model Accuracy</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div className="bg-green-600 h-2 rounded-full w-[94.2%] transition-all duration-1000" />
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {predictionData.riskZones.length}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Risk Zones Identified</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Analysis Parameters</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-blue-700 dark:text-blue-300">
                <div>
                  <span className="font-medium">Resolution:</span> 30m
                </div>
                <div>
                  <span className="font-medium">Model:</span> Random Forest
                </div>
                <div>
                  <span className="font-medium">Features:</span> 12 variables
                </div>
                <div>
                  <span className="font-medium">Updated:</span> {predictionData.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default RiskAnalysis;