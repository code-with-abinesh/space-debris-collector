import React from 'react';
import type { MissionConfig, MissionStatus } from '../types';

interface SidebarProps {
    config: MissionConfig;
    setConfig: React.Dispatch<React.SetStateAction<MissionConfig>>;
    startMission: () => void;
    resetMission: () => void;
    missionStatus: MissionStatus;
}

interface ParameterControlProps {
    label: string;
    name: keyof MissionConfig;
    value: number;
    min: number;
    max: number;
    onChange: (name: keyof MissionConfig, value: number) => void;
    disabled: boolean;
}

const ParameterControl: React.FC<ParameterControlProps> = ({ label, name, value, min, max, onChange, disabled }) => {
    const handleIncrement = () => {
        if (value < max) onChange(name, value + 1);
    };

    const handleDecrement = () => {
        if (value > min) onChange(name, value - 1);
    };

    return (
        <div className="flex justify-between items-center bg-gray-700/30 p-3 rounded-lg shadow-inner">
            <span className="text-lg text-gray-300">{label}</span>
            <div className="flex items-center gap-4">
                <button
                    onClick={handleDecrement}
                    disabled={disabled || value <= min}
                    className="w-8 h-8 rounded-full bg-cyan-600 text-white font-bold text-xl flex items-center justify-center hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    aria-label={`Decrease ${label}`}
                >
                    -
                </button>
                <span className="font-bold text-2xl text-white w-10 text-center tabular-nums" aria-live="polite">
                    {value}
                </span>
                <button
                    onClick={handleIncrement}
                    disabled={disabled || value >= max}
                    className="w-8 h-8 rounded-full bg-cyan-600 text-white font-bold text-xl flex items-center justify-center hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    aria-label={`Increase ${label}`}
                >
                    +
                </button>
            </div>
        </div>
    );
};


const Sidebar: React.FC<SidebarProps> = ({ config, setConfig, startMission, resetMission, missionStatus }) => {
    
    const handleConfigChange = (name: keyof MissionConfig, value: number) => {
        setConfig(prev => ({ ...prev, [name]: value }));
    };

    const isRunning = missionStatus === 'running';
    const isIdle = missionStatus === 'idle';

    return (
        <aside className="w-full lg:w-1/3 bg-black/30 rounded-lg p-6 shadow-2xl backdrop-blur-sm border border-cyan-500/30 flex flex-col gap-6 h-fit glowing-border">
            <h2 className="text-2xl font-semibold text-cyan-300 border-b-2 border-cyan-500/30 pb-2">Mission Parameters</h2>
            
            <div className="space-y-4">
                <ParameterControl
                    label="Number of Debris"
                    name="debrisCount"
                    value={config.debrisCount}
                    min={1}
                    max={10}
                    onChange={handleConfigChange}
                    disabled={isRunning}
                />
                <ParameterControl
                    label="Max Fuel"
                    name="maxFuel"
                    value={config.maxFuel}
                    min={2}
                    max={20}
                    onChange={handleConfigChange}
                    disabled={isRunning}
                />
                <ParameterControl
                    label="Storage Capacity"
                    name="storageCapacity"
                    value={config.storageCapacity}
                    min={1}
                    max={5}
                    onChange={handleConfigChange}
                    disabled={isRunning}
                />
            </div>

            <div className="mt-4 flex flex-col space-y-4">
                <button
                    onClick={startMission}
                    disabled={isRunning}
                    className={`w-full px-4 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg ${isIdle ? 'animate-pulse' : ''}`}
                >
                    {isRunning ? 'Mission In Progress...' : 'Run Demo Mission'}
                </button>
                <button
                    onClick={resetMission}
                    disabled={isRunning}
                    className="w-full px-4 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    Reset
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;