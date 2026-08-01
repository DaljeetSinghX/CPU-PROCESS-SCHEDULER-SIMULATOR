import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Hourglass, Clock, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export const StatisticsPanel = () => {
  const { currentTickState } = useSimulation();
  const { avgWT, avgTAT, cpuUtil } = currentTickState;

  const statCards = [
    {
      id: 'wt',
      label: 'Avg. Waiting Time',
      value: `${avgWT.toFixed(2)} ticks`,
      icon: Hourglass,
      color: 'from-purple-500/20 to-indigo-500/10',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-300',
      iconColor: 'text-purple-400'
    },
    {
      id: 'tat',
      label: 'Avg. Turnaround Time',
      value: `${avgTAT.toFixed(2)} ticks`,
      icon: Clock,
      color: 'from-cyan-500/20 to-blue-500/10',
      borderColor: 'border-cyan-500/30',
      textColor: 'text-cyan-300',
      iconColor: 'text-cyan-400'
    },
    {
      id: 'util',
      label: 'CPU Utilization',
      value: `${cpuUtil.toFixed(0)}%`,
      icon: Cpu,
      color: 'from-emerald-500/20 to-teal-500/10',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-300',
      iconColor: 'text-emerald-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {statCards.map(card => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`bg-gradient-to-br ${card.color} border ${card.borderColor} backdrop-blur-md rounded-2xl p-5 sm:p-6 flex items-center gap-4 shadow-xl`}
          >
            <div className={`p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 ${card.iconColor}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-300 block">{card.label}</span>
              <span className={`text-xl sm:text-2xl font-black ${card.textColor} tracking-tight font-mono mt-0.5 block`}>
                {card.value}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatisticsPanel;
