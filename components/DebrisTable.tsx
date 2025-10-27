import React from 'react';
import type { Debris } from '../types';

interface DebrisTableProps {
    debris: Debris[];
}

const DebrisTable: React.FC<DebrisTableProps> = ({ debris }) => {
    return (
        <div className="bg-black/30 p-4 rounded-lg border border-cyan-500/30 h-96 flex flex-col glowing-border">
            <h3 className="text-xl font-semibold text-cyan-300 mb-3 text-center font-display">Debris Status</h3>
            <div className="overflow-y-auto flex-grow font-mono">
                <table className="w-full text-left">
                    <thead className="sticky top-0 bg-gray-900/80 backdrop-blur-sm">
                        <tr>
                            <th className="p-2 font-display">ID</th>
                            <th className="p-2 font-display">Orbit</th>
                            <th className="p-2 font-display">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {debris.map(d => (
                            <tr 
                                key={d.id} 
                                className={`border-b border-cyan-800/50 last:border-b-0 transition-all duration-500 ease-in-out
                                ${d.status === 'collected' 
                                    ? 'bg-green-800/30 text-gray-400' 
                                    : 'hover:bg-cyan-700/20'
                                }`}
                            >
                                <td className="p-2">{d.id}</td>
                                <td className="p-2 capitalize">{d.orbit.replace('_', ' ')}</td>
                                <td className={`p-2 font-semibold ${d.status === 'collected' ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {d.status === 'collected' ? 'Collected ✅' : 'In Orbit 🛰️'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DebrisTable;