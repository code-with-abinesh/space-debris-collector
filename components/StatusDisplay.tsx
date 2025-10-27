import React from 'react';
import type { SatelliteState } from '../types';

interface StatusDisplayProps {
    satellite: SatelliteState;
    maxFuel: number;
    maxStorage: number;
}

const ProgressBar: React.FC<{ value: number; max: number; label: string; color: string }> = ({ value, max, label, color }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-lg font-medium">{label}</span>
                <span className="text-lg font-bold">{value} / {max}</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-4">
                <div
                    className={`${color} h-4 rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};


const StatusDisplay: React.FC<StatusDisplayProps> = ({ satellite, maxFuel, maxStorage }) => {
    return (
        <div className="bg-black/30 p-4 rounded-lg border border-cyan-500/30 glowing-border">
            <h3 className="text-xl font-semibold text-cyan-300 mb-4 text-center">Satellite Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="text-center">
                    <p className="text-lg font-medium">Position</p>
                    <p className="text-2xl font-bold text-white uppercase">{satellite.position.replace('_', ' ')}</p>
                </div>
                <ProgressBar value={satellite.fuel} max={maxFuel} label="Fuel" color="bg-green-500" />
                <ProgressBar value={satellite.storage} max={maxStorage} label="Storage" color="bg-yellow-500" />
            </div>
        </div>
    );
};

export default StatusDisplay;