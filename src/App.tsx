import { useState, useEffect } from 'react';
import { RiskZone } from './types';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import RegionSelector from './components/RegionSelector';
import RiskAnalysis from './components/RiskAnalysis';
import SimulationPanel from './components/SimulationPanel';
import MapVisualization from './components/MapVisualization';
import DownloadReports from './components/DownloadReports';
import Settings from './components/Settings';
import { Region, PredictionData, SimulationData, ProcessingStep } from './types';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [activeLayer, setActiveLayer] = useState<string>('prediction');
  const [simulationTimeStep, setSimulationTimeStep] = useState<number>(1);
  const [isSimulationPlaying, setIsSimulationPlaying] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [environmentalParams, setEnvironmentalParams] = useState({
    windSpeed: 15,
    humidity: 45,
    temperature: 28
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleRegionSelect = async (region: Region) => {
    setSelectedRegion(region);
    setIsProcessing(true);
    setPredictionData(null);
    setSimulationData(null);
    setActiveView('dashboard'); // Switch to dashboard to show processing

    const steps: ProcessingStep[] = [
      { id: 1, name: 'Loading DEM data (30m resolution)', status: 'pending', progress: 0 },
      { id: 2, name: 'Processing weather data', status: 'pending', progress: 0 },
      { id: 3, name: 'Analyzing LULC data', status: 'pending', progress: 0 },
      { id: 4, name: 'Calculating slope & aspect', status: 'pending', progress: 0 },
      { id: 5, name: 'Running ML prediction model', status: 'pending', progress: 0 },
      { id: 6, name: 'Generating fire spread simulation', status: 'pending', progress: 0 }
    ];

    setProcessingSteps([...steps]);

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      
      steps[i].status = 'processing';
      setProcessingSteps([...steps]);
      
      for (let progress = 0; progress <= 100; progress += 25) {
        await new Promise(resolve => setTimeout(resolve, 80));
        steps[i].progress = progress;
        setProcessingSteps([...steps]);
      }
      
      steps[i].status = 'completed';
      setProcessingSteps([...steps]);
    }

    const mockPrediction: PredictionData = {
      region: region.name,
      timestamp: new Date(),
      riskZones: generateMockRiskZones(region),
      confidence: 0.87 + Math.random() * 0.1,
      totalArea: region.area,
      highRiskArea: region.area * (0.12 + Math.random() * 0.08),
      moderateRiskArea: region.area * (0.20 + Math.random() * 0.10),
      lowRiskArea: region.area * (0.55 + Math.random() * 0.15)
    };

    const mockSimulation: SimulationData = {
      region: region.name,
      timestamp: new Date(),
      timeSteps: [1, 2, 3, 6, 12],
      spreadData: generateMockSpreadData(region),
      totalBurnedArea: [45, 115, 195, 420, 780],
      spreadRate: [22, 32, 28, 35, 30]
    };

    setPredictionData(mockPrediction);
    setSimulationData(mockSimulation);
    setIsProcessing(false);
  };

  const generateMockRiskZones = (region: Region): RiskZone[] => {
  const zones: RiskZone[] = [];
  const centerLat = region.bounds.center[0];
  const centerLng = region.bounds.center[1];

  for (let i = 0; i < 25; i++) {
    const rand = Math.random();
    let risk: 'high' | 'moderate' | 'low';

    if (rand > 0.6) risk = 'high';
    else if (rand > 0.3) risk = 'moderate';
    else risk = 'low';

    zones.push({
      id: i,
      lat: centerLat + (Math.random() - 0.5) * 0.6,
      lng: centerLng + (Math.random() - 0.5) * 0.6,
      risk,
      confidence: 0.65 + Math.random() * 0.35
    });
  }

  return zones;
};

  const generateMockSpreadData = (region: Region) => {
    const spreadData: { [key: number]: any[] } = {};
    const centerLat = region.bounds.center[0];
    const centerLng = region.bounds.center[1];

    [1, 2, 3, 6, 12].forEach(timeStep => {
      const points = [];
      const numPoints = timeStep * 6;
      
      for (let i = 0; i < numPoints; i++) {
        points.push({
          lat: centerLat + (Math.random() - 0.5) * (timeStep * 0.12),
          lng: centerLng + (Math.random() - 0.5) * (timeStep * 0.12),
          intensity: Math.random() * 0.8 + 0.2,
          timestamp: timeStep
        });
      }
      spreadData[timeStep] = points;
    });
    
    return spreadData;
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard
            selectedRegion={selectedRegion}
            predictionData={predictionData}
            simulationData={simulationData}
            isProcessing={isProcessing}
            processingSteps={processingSteps}
            onNavigate={setActiveView}
          />
        );
      case 'select-region':
        return <RegionSelector onRegionSelect={handleRegionSelect} />;
      case 'risk-analysis':
        return <RiskAnalysis predictionData={predictionData} selectedRegion={selectedRegion} />;
      case 'simulation':
        return (
          <SimulationPanel
            simulationData={simulationData}
            simulationTimeStep={simulationTimeStep}
            onTimeStepChange={setSimulationTimeStep}
            isPlaying={isSimulationPlaying}
            onPlayToggle={setIsSimulationPlaying}
            speed={simulationSpeed}
            onSpeedChange={setSimulationSpeed}
            environmentalParams={environmentalParams}
            onEnvironmentalParamsChange={setEnvironmentalParams}
          />
        );
      case 'map':
        return (
          <MapVisualization
            selectedRegion={selectedRegion}
            predictionData={predictionData}
            simulationData={simulationData}
            activeLayer={activeLayer}
            simulationTimeStep={simulationTimeStep}
            onLayerChange={setActiveLayer}
            environmentalParams={environmentalParams}
          />
        );
      case 'download':
        return (
          <DownloadReports
            predictionData={predictionData}
            simulationData={simulationData}
            selectedRegion={selectedRegion}
          />
        );
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard selectedRegion={selectedRegion} predictionData={predictionData} simulationData={simulationData} isProcessing={isProcessing} processingSteps={processingSteps} />;
    }
  };

  return (
  <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
    {/* Navbar is fixed */}
    <Navbar isDarkMode={isDarkMode} onThemeToggle={setIsDarkMode} />

    {/* This div adds top padding to avoid overlay from fixed navbar */}
    <div className="pt-20 flex">
      {/* Sidebar */}
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  </div>
);

return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🔥 Forest Fire Risk Analysis - Heatmap View</h1>
      <Heatmap />
    </div>
  );
  
}

export default App;