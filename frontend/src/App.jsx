import React from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { Header } from './components/Header';
import { ProcessTable } from './components/ProcessTable';
import { CPUVisualizer } from './components/CPUVisualizer';
import { GanttChart } from './components/GanttChart';
import { StatisticsPanel } from './components/StatisticsPanel';
import { ResultsTable } from './components/ResultsTable';
import { EventConsole } from './components/EventConsole';
import { PlaybackControls } from './components/PlaybackControls';
import { ProcessInspector } from './components/ProcessInspector';
import { SchedulerInfo } from './components/SchedulerInfo';
import { ComparisonTable } from './components/ComparisonTable';
import { AboutTab } from './components/AboutTab';

const MainLayout = () => {
  const { activeTab } = useSimulation();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0B0F19] text-slate-100 font-sans selection:bg-purple-500 selection:text-white">
      
      {/* Top Header Navbar */}
      <Header />

      {/* Main Body */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Simulator Tab View */}
        {activeTab === 'Simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Process Config & Algorithm Controls (3 cols) */}
            <div className="lg:col-span-3 space-y-6">
              <ProcessTable />
            </div>

            {/* Middle Column: Gantt Chart & CPU Pipeline (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <GanttChart />
              <CPUVisualizer />
            </div>

            {/* Right Column: Playback Controls & Terminal Event Console (3 cols) */}
            <div className="lg:col-span-3 space-y-6">
              <PlaybackControls />
              <EventConsole />
            </div>

          </div>
        )}

        {/* Results & Metrics Dedicated Tab View */}
        {activeTab === 'Results' && (
          <div className="space-y-6 max-w-[1400px] mx-auto">
            <StatisticsPanel />
            <ResultsTable />
            <GanttChart />
          </div>
        )}

        {/* Theory & Algorithms Tab */}
        {activeTab === 'Algorithms' && <SchedulerInfo />}

        {/* Comparison Leaderboard Tab */}
        {activeTab === 'Comparison' && <ComparisonTable />}

        {/* System Specs Tab */}
        {activeTab === 'About' && <AboutTab />}

      </main>

      {/* Process Inspector Slide-over Drawer */}
      <ProcessInspector />

    </div>
  );
};

export default function App() {
  return (
    <SimulationProvider>
      <MainLayout />
    </SimulationProvider>
  );
}
