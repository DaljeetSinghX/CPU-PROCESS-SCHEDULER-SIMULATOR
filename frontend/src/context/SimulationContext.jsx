import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';

const SimulationContext = createContext(null);

export const PROCESS_COLORS = [
  '#10B981', // Emerald Green (P1)
  '#8B5CF6', // Purple (P2)
  '#F59E0B', // Amber (P3)
  '#EF4444', // Red (P4)
  '#06B6D4', // Cyan (P5)
  '#EC4899', // Pink (P6)
  '#3B82F6', // Blue (P7)
  '#14B8A6', // Teal (P8)
];

const INITIAL_PROCESSES = [
  { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 2, color: PROCESS_COLORS[0] },
  { id: 'P2', arrivalTime: 2, burstTime: 3, priority: 1, color: PROCESS_COLORS[1] },
  { id: 'P3', arrivalTime: 4, burstTime: 1, priority: 3, color: PROCESS_COLORS[2] },
  { id: 'P4', arrivalTime: 6, burstTime: 4, priority: 4, color: PROCESS_COLORS[3] },
];

export const PRESET_SCENARIOS = {
  default: {
    name: 'Default Balanced Scenario',
    description: '4 processes showcasing general execution across all 4 algorithms.',
    rrQuantum: 4,
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 2, color: PROCESS_COLORS[0] },
      { id: 'P2', arrivalTime: 2, burstTime: 3, priority: 1, color: PROCESS_COLORS[1] },
      { id: 'P3', arrivalTime: 4, burstTime: 1, priority: 3, color: PROCESS_COLORS[2] },
      { id: 'P4', arrivalTime: 6, burstTime: 4, priority: 4, color: PROCESS_COLORS[3] },
    ]
  },
  convoy: {
    name: 'Convoy Effect (FCFS)',
    description: 'Demonstrates one long job blocking shorter subsequent jobs.',
    rrQuantum: 2,
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 12, priority: 3, color: PROCESS_COLORS[0] },
      { id: 'P2', arrivalTime: 1, burstTime: 2, priority: 1, color: PROCESS_COLORS[1] },
      { id: 'P3', arrivalTime: 2, burstTime: 1, priority: 2, color: PROCESS_COLORS[2] },
      { id: 'P4', arrivalTime: 3, burstTime: 2, priority: 4, color: PROCESS_COLORS[3] },
    ]
  },
  priorityTie: {
    name: 'Priority & Tie-breaker',
    description: 'Multiple processes with identical priority values testing arrival tie-breakers.',
    rrQuantum: 3,
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 4, priority: 1, color: PROCESS_COLORS[0] },
      { id: 'P2', arrivalTime: 0, burstTime: 3, priority: 1, color: PROCESS_COLORS[1] },
      { id: 'P3', arrivalTime: 2, burstTime: 5, priority: 2, color: PROCESS_COLORS[2] },
      { id: 'P4', arrivalTime: 4, burstTime: 2, priority: 0, color: PROCESS_COLORS[3] },
    ]
  },
  roundRobinStarvation: {
    name: 'Round Robin Quantum Comparison',
    description: 'Preemptive cyclic execution showing quantum time slicing dynamics.',
    rrQuantum: 2,
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 2, color: PROCESS_COLORS[0] },
      { id: 'P2', arrivalTime: 1, burstTime: 4, priority: 1, color: PROCESS_COLORS[1] },
      { id: 'P3', arrivalTime: 2, burstTime: 2, priority: 3, color: PROCESS_COLORS[2] },
      { id: 'P4', arrivalTime: 3, burstTime: 6, priority: 2, color: PROCESS_COLORS[3] },
    ]
  }
};

export const SimulationProvider = ({ children }) => {
  const [processes, setProcesses] = useState(INITIAL_PROCESSES);
  const [algorithm, setAlgorithm] = useState('FCFS');
  const [rrQuantum, setRrQuantum] = useState(4);
  const [activeTab, setActiveTab] = useState('Simulator'); // 'Simulator', 'Algorithms', 'Comparison', 'About'
  
  const [simulationResults, setSimulationResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Playback Control State
  const [currentTick, setCurrentTick] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 0.25, 0.5, 1, 2, 5
  const [inspectedProcessId, setInspectedProcessId] = useState(null);

  const timerRef = useRef(null);

  // Auto Assign Colors to processes
  const getProcessColor = (index) => PROCESS_COLORS[index % PROCESS_COLORS.length];

  // Run Backend Simulation API
  const runSimulation = async (procsToSimulate = processes, quantum = rrQuantum) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rrQuantum: Number(quantum),
          processes: procsToSimulate.map(p => ({
            id: p.id,
            arrivalTime: Number(p.arrivalTime),
            burstTime: Number(p.burstTime),
            priority: Number(p.priority),
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Simulation API returned error');
      }

      const data = await response.json();
      setSimulationResults(data);
      setCurrentTick(0);
      setIsPlaying(false);
      return data;
    } catch (err) {
      console.error('Simulation error:', err);
      setError(err.message || 'Failed to connect to C++ Scheduler engine');
    } finally {
      setLoading(false);
    }
  };

  // Run initial simulation on load
  useEffect(() => {
    runSimulation();
  }, []);

  // Compute Total Duration (Max Ticks) for active algorithm
  const maxTicks = useMemo(() => {
    if (!simulationResults || !simulationResults[algorithm]) return 0;
    const timeline = simulationResults[algorithm].timeline || [];
    if (timeline.length === 0) return 0;
    return timeline[timeline.length - 1].endTime;
  }, [simulationResults, algorithm]);

  // Derived Tick State for real-time visualization
  const currentTickState = useMemo(() => {
    if (!simulationResults || !simulationResults[algorithm]) {
      return {
        events: [],
        currentEvent: null,
        readyQueue: [],
        runningProcessId: 'IDLE',
        completedProcesses: [],
        newProcesses: [],
        ganttSegments: [],
        remainingBursts: {},
        processStates: {},
        timeSlice: 0,
        totalTimeSlice: 0,
        contextSwitches: 0,
        cpuStatus: 'IDLE',
        avgWT: 0,
        avgTAT: 0,
        cpuUtil: 100
      };
    }

    const algoData = simulationResults[algorithm];
    const events = algoData.events || [];
    const timeline = algoData.timeline || [];
    const fullProcs = algoData.processes || [];

    // Filter events up to currentTick
    const pastEvents = events.filter(e => e.tick <= currentTick);
    const lastEvent = pastEvents.length > 0 ? pastEvents[pastEvents.length - 1] : null;

    // Determine current running process & CPU status
    let runningId = 'IDLE';
    let readyQ = [];
    let remainingBursts = {};
    let processStates = {};
    let timeSlice = 0;
    let totalTimeSlice = 0;

    // Initialize all processes
    processes.forEach(p => {
      remainingBursts[p.id] = p.burstTime;
      processStates[p.id] = p.arrivalTime > currentTick ? 'NEW' : 'READY';
    });

    if (lastEvent) {
      runningId = lastEvent.runningProcessId || 'IDLE';
      readyQ = lastEvent.readyQueue || [];
      timeSlice = lastEvent.timeSlice || 0;
      totalTimeSlice = lastEvent.totalTimeSlice || 0;
    }

    // Determine exact status of each process at currentTick
    const completedProcs = [];
    const newProcs = [];

    processes.forEach(p => {
      const fullProcData = fullProcs.find(fp => fp.id === p.id);
      if (fullProcData && currentTick >= fullProcData.completionTime) {
        processStates[p.id] = 'TERMINATED';
        remainingBursts[p.id] = 0;
        completedProcs.push(p.id);
      } else if (currentTick < p.arrivalTime) {
        processStates[p.id] = 'NEW';
        newProcs.push(p.id);
      } else if (p.id === runningId) {
        processStates[p.id] = 'RUNNING';
        // Compute remaining burst at currentTick
        const executedTicks = timeline
          .filter(seg => seg.processId === p.id && seg.startTime < currentTick)
          .reduce((acc, seg) => acc + (Math.min(currentTick, seg.endTime) - seg.startTime), 0);
        remainingBursts[p.id] = Math.max(0, p.burstTime - executedTicks);
      } else if (readyQ.includes(p.id)) {
        processStates[p.id] = 'READY';
        const executedTicks = timeline
          .filter(seg => seg.processId === p.id && seg.startTime < currentTick)
          .reduce((acc, seg) => acc + (Math.min(currentTick, seg.endTime) - seg.startTime), 0);
        remainingBursts[p.id] = Math.max(0, p.burstTime - executedTicks);
      }
    });

    // Enforce IDLE at start (currentTick = 0) and completion (currentTick >= maxTicks)
    if (currentTick === 0) {
      runningId = 'IDLE';
      timeSlice = 0;
      totalTimeSlice = 0;
      readyQ = processes.filter(p => p.arrivalTime === 0).map(p => p.id);
    } else if (currentTick >= maxTicks || (maxTicks > 0 && completedProcs.length === processes.length)) {
      runningId = 'IDLE';
      timeSlice = 0;
      totalTimeSlice = 0;
      readyQ = [];
    } else if (runningId !== 'IDLE' && completedProcs.includes(runningId)) {
      runningId = 'IDLE';
      timeSlice = 0;
      totalTimeSlice = 0;
    }

    // Trim Gantt Timeline to currentTick
    const ganttSegments = [];
    timeline.forEach(seg => {
      if (seg.startTime < currentTick) {
        ganttSegments.push({
          ...seg,
          endTime: Math.min(seg.endTime, currentTick)
        });
      }
    });

    // Compute live context switches up to currentTick
    let liveSwitches = 0;
    for (let i = 1; i < ganttSegments.length; i++) {
      if (ganttSegments[i].processId !== 'IDLE' && ganttSegments[i-1].processId !== 'IDLE' && ganttSegments[i].processId !== ganttSegments[i-1].processId) {
        liveSwitches++;
      }
    }

    // CPU Status
    let cpuStatus = 'IDLE';
    if (currentTick > 0 && currentTick < maxTicks && runningId && runningId !== 'IDLE' && !completedProcs.includes(runningId)) {
      cpuStatus = 'RUNNING';
    } else {
      cpuStatus = 'IDLE';
    }



    return {
      events: pastEvents,
      allEvents: events,
      currentEvent: lastEvent,
      readyQueue: readyQ,
      runningProcessId: runningId,
      completedProcesses: completedProcs,
      newProcesses: newProcs,
      ganttSegments,
      remainingBursts,
      processStates,
      timeSlice,
      totalTimeSlice,
      contextSwitches: liveSwitches,
      cpuStatus,
      avgWT: algoData.avgWaitingTime || 0,
      avgTAT: algoData.avgTurnaroundTime || 0,
      avgRT: algoData.avgResponseTime || 0,
      cpuUtil: algoData.cpuUtilization || 100,
      fullProcesses: fullProcs
    };
  }, [simulationResults, algorithm, currentTick, processes]);

  // Handle Playback Interval
  useEffect(() => {
    if (isPlaying) {
      const baseInterval = 1000; // 1 second per tick at 1x
      const intervalMs = baseInterval / speed;

      timerRef.current = setInterval(() => {
        setCurrentTick(prev => {
          if (prev >= maxTicks) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, maxTicks]);

  // Controls
  const play = () => {
    if (currentTick >= maxTicks) {
      setCurrentTick(0);
    }
    setIsPlaying(true);
  };

  const pause = () => setIsPlaying(false);

  const resetPlayback = () => {
    setIsPlaying(false);
    setCurrentTick(0);
    setProcesses(INITIAL_PROCESSES);
    setAlgorithm('FCFS');
    setRrQuantum(4);
    runSimulation(INITIAL_PROCESSES, 4);
  };


  const nextTick = () => {
    setIsPlaying(false);
    if (currentTick < maxTicks) {
      setCurrentTick(prev => prev + 1);
    }
  };

  const prevTick = () => {
    setIsPlaying(false);
    if (currentTick > 0) {
      setCurrentTick(prev => prev - 1);
    }
  };

  const loadPreset = (scenarioKey) => {
    const preset = PRESET_SCENARIOS[scenarioKey];
    if (preset) {
      setProcesses(preset.processes);
      setRrQuantum(preset.rrQuantum);
      runSimulation(preset.processes, preset.rrQuantum);
    }
  };

  const addProcess = () => {
    const nextNum = processes.length + 1;
    const newP = {
      id: `P${nextNum}`,
      arrivalTime: Math.floor(Math.random() * 6),
      burstTime: Math.floor(Math.random() * 6) + 1,
      priority: Math.floor(Math.random() * 5) + 1,
      color: getProcessColor(processes.length)
    };
    const updated = [...processes, newP];
    setProcesses(updated);
    runSimulation(updated, rrQuantum);
  };

  const removeProcess = (id) => {
    if (processes.length <= 1) return;
    const updated = processes.filter(p => p.id !== id);
    setProcesses(updated);
    runSimulation(updated, rrQuantum);
  };

  const updateProcess = (id, field, value) => {
    const updated = processes.map(p => p.id === id ? { ...p, [field]: value } : p);
    setProcesses(updated);
    runSimulation(updated, rrQuantum);
  };

  const generateRandomProcesses = () => {
    const count = Math.floor(Math.random() * 3) + 3; // 3 to 5 processes
    const generated = [];
    for (let i = 0; i < count; i++) {
      generated.push({
        id: `P${i + 1}`,
        arrivalTime: i === 0 ? 0 : Math.floor(Math.random() * 6),
        burstTime: Math.floor(Math.random() * 7) + 1,
        priority: Math.floor(Math.random() * 5) + 1,
        color: getProcessColor(i)
      });
    }
    setProcesses(generated);
    runSimulation(generated, rrQuantum);
  };

  return (
    <SimulationContext.Provider
      value={{
        processes,
        setProcesses,
        algorithm,
        setAlgorithm,
        rrQuantum,
        setRrQuantum,
        activeTab,
        setActiveTab,
        simulationResults,
        loading,
        error,
        currentTick,
        setCurrentTick,
        maxTicks,
        isPlaying,
        play,
        pause,
        resetPlayback,
        nextTick,
        prevTick,
        speed,
        setSpeed,
        inspectedProcessId,
        setInspectedProcessId,
        currentTickState,
        runSimulation,
        loadPreset,
        addProcess,
        removeProcess,
        updateProcess,
        generateRandomProcesses
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within SimulationProvider');
  }
  return context;
};
