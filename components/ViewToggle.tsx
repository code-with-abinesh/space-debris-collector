import React from 'react';

type ViewMode = 'dashboard' | 'earth' | 'realistic';

interface ViewToggleProps {
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, setViewMode }) => {
    
    const baseClasses = "px-4 py-2 rounded-t-lg font-bold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400";
    const activeClasses = "bg-cyan-600/30 text-cyan-300";
    const inactiveClasses = "bg-gray-800/50 hover:bg-gray-700/50 text-gray-400";

    return (
        <div className="mt-6 border-b-2 border-cyan-500/30 flex items-center">
            <button 
                onClick={() => setViewMode('dashboard')}
                className={`${baseClasses} ${viewMode === 'dashboard' ? activeClasses : inactiveClasses}`}
            >
                Dashboard
            </button>
            <button 
                onClick={() => setViewMode('earth')}
                className={`${baseClasses} ${viewMode === 'earth' ? activeClasses : inactiveClasses}`}
            >
                Earth View
            </button>
            <button 
                onClick={() => setViewMode('realistic')}
                className={`${baseClasses} ${viewMode === 'realistic' ? activeClasses : inactiveClasses}`}
            >
                Realistic View
            </button>
        </div>
    );
};

export default ViewToggle;