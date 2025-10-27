import React, { useEffect, useRef } from 'react';

interface MissionLogProps {
    missionLog: string[];
}

const MissionLog: React.FC<MissionLogProps> = ({ missionLog }) => {
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [missionLog]);

    return (
        <div className="bg-black/30 p-4 rounded-lg border border-cyan-500/30 h-96 flex flex-col glowing-border">
            <h3 className="text-xl font-semibold text-cyan-300 mb-3 text-center font-display">Action Log / Mission Plan</h3>
            <div ref={logContainerRef} className="overflow-y-auto flex-grow font-mono text-sm space-y-2 pr-2">
                {missionLog.map((log, index) => (
                    <p key={index} className="whitespace-pre-wrap animate-fadeIn">{`[${index.toString().padStart(2, '0')}] ${log}`}</p>
                ))}
            </div>
        </div>
    );
};

export default MissionLog;