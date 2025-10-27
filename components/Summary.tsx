import React, { useState } from 'react';
import type { MissionSummary } from '../types';

interface SummaryProps {
    summary: MissionSummary;
}

const Summary: React.FC<SummaryProps> = ({ summary }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="mt-6 bg-black/30 p-4 rounded-lg border border-green-500/50 glowing-border">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left text-xl font-semibold text-green-300 flex justify-between items-center"
            >
                <span>Mission Summary</span>
                <span>{isOpen ? '▼' : '▶'}</span>
            </button>
            {isOpen && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center animate-fadeIn">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                        <p className="text-lg">Total Debris Collected</p>
                        <p className="text-3xl font-bold text-white">{summary.totalDebrisCollected}</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                        <p className="text-lg">Total Moves Made</p>
                        <p className="text-3xl font-bold text-white">{summary.totalMoves}</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                        <p className="text-lg">Fuel Remaining</p>
                        <p className="text-3xl font-bold text-white">{summary.fuelLeft}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Summary;