# CPU Process Scheduler Simulator

A high-performance, interactive visual simulator for CPU scheduling algorithms. The application features a native **C++17** simulation engine backend paired with a modern, glassmorphic **React (Vite) + Tailwind CSS (v4)** frontend.

This project serves as an educational tool for visualizing Operating System scheduling dynamics and demonstrates full-stack subprocess integration.

---

## 🚀 Key Features

* **Dual-Layer Architecture**:
  * **C++ Backend**: High-efficiency scheduling logic running as a compiled subprocess.
  * **React Frontend**: Premium responsive dashboard with real-time UI state updates and smooth animations.
* **4 Scheduling Algorithms**:
  * **First-Come, First-Served (FCFS)**: Non-preemptive, arrival-sorted scheduling demonstrating the convoy effect.
  * **Shortest Job First (SJF)**: Non-preemptive scheduling optimized for minimum average waiting time.
  * **Round Robin (RR)**: Preemptive cyclic scheduling with configurable time quantum boundaries.
  * **Priority (Non-Preemptive)**: Executes processes based on priority value with stable arrival tie-breaking.
* **Interactive Visualization**:
  * **Process Configuration**: Dynamically add, modify, generate randomly, or remove processes.
  * **Gantt Chart Timeline**: Color-coded visualization of CPU execution slices and idle states with precise hover tooltip details.
  * **Comparison Leaderboard**: Ranks algorithms by Average Waiting Time and visualizes efficiency metrics.
  * **Preset Scenarios**: Quick-load scenarios (e.g., Convoy Effect, Priority Tie-breakers) to compare performance.

---

## 📂 Project Structure

```text
CPU Process Scheduler Simulator/
├── backend/
│   ├── Process.h         # Common structures (Process, GanttSegment)
│   ├── Scheduler.h       # Base virtual Scheduler class with analytics logic
│   ├── FCFS.cpp          # First-Come First-Served implementation
│   ├── SJF.cpp           # Shortest Job First implementation
│   ├── RoundRobin.cpp    # Round Robin (preemptive) implementation
│   ├── Priority.cpp      # Priority (non-preemptive) implementation
│   ├── main.cpp          # Stdin/Stdout JSON C++ orchestrator
│   └── scheduler.exe     # Compiled C++ simulation engine binary
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ProcessTable.jsx     # Process configuration form & presets
    │   │   ├── GanttChart.jsx       # Visual CPU execution timeline
    │   │   ├── ResultsTable.jsx     # Tabular process breakdown (TAT, WT, CT)
    │   │   └── ComparisonTable.jsx  # Leaderboard comparative analytics
    │   ├── App.jsx                  # Main application orchestrator
    │   ├── index.css                # Tailwind entry & custom global styles
    │   └── main.jsx                 # React root launcher
    ├── index.html                   # HTML entry point
    └── vite.config.js               # Dev server configuration with C++ process proxy
```

---

## ⚙️ How to Compile & Run

### 1. Compile the Backend
Ensure you have a C++ compiler supporting C++17 (e.g., `g++` / MinGW, GCC, Clang, or MSVC) installed and in your PATH. Run the compilation command from the project root:

```bash
g++ -std=c++17 -O2 backend/main.cpp -o backend/scheduler.exe
```
*Note: The frontend expects the compiled binary to be named `scheduler.exe` and located inside the `backend/` directory.*

### 2. Run the Frontend
Navigate to the `frontend/` directory, install package dependencies, and start the development server:

```bash
cd frontend
npm install
npm run dev
```

Open your browser and navigate to the address displayed in the console (typically `http://localhost:5173`).

---

## 📊 Formulas & Calculations

The simulation calculates process metrics using standard OS scheduling equations:

* **Turnaround Time ($TAT$)**:
  $$TAT = CompletionTime - ArrivalTime$$
* **Waiting Time ($WT$)**:
  $$WT = TurnaroundTime - BurstTime$$
* **Averages**:
  $$Average = \frac{\sum_{i=1}^{N} Metric_i}{N}$$

---

## 💼 Resume & Portfolio Highlights

If showcasing this project on your software engineering resume, consider highlighting:
* **Native Subprocess Integration**: Integrated a native C++ computation engine with a Node.js development server middleware, using standard input/output stream pipes to handle simulation execution.
* **Polymorphic Architecture**: Leveraged object-oriented design patterns in C++ with virtual methods and derived subclasses to build modular scheduling algorithms.
* **Interactive UI Visualization**: Developed responsive, animated components including interactive Gantt charts, tabular analytics breakdowns, and comparative execution metrics.
