import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { SatelliteState, Debris, MissionStatus, MissionConfig, MissionSummary } from './types';
import Sidebar from './components/Sidebar';
import StatusDisplay from './components/StatusDisplay';
import DebrisTable from './components/DebrisTable';
import MissionLog from './components/MissionLog';
import Summary from './components/Summary';
import OrbitalMap from './components/OrbitalMap';
import { initialConfig } from './constants';
import EarthView from './components/EarthView';
import ViewToggle from './components/ViewToggle';
import RealisticEarthView from './components/RealisticEarthView';

const ORBITS = ['orbit_1', 'orbit_2', 'orbit_3', 'orbit_4', 'orbit_5'];

type ViewMode = 'dashboard' | 'earth' | 'realistic';

const DashboardView: React.FC<{ debris: Debris[]; satellite: SatelliteState; isCollecting: boolean; missionLog: string[]; summary: MissionSummary | null; orbits: string[]; }> = 
({ debris, satellite, isCollecting, missionLog, summary, orbits }) => (
    <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <OrbitalMap currentPosition={satellite.position} orbits={orbits} isCollecting={isCollecting} />
            <DebrisTable debris={debris} />
            <MissionLog missionLog={missionLog} />
        </div>
        {summary && <Summary summary={summary} />}
    </>
);

const App: React.FC = () => {
    const [config, setConfig] = useState<MissionConfig>(initialConfig);
    const [satellite, setSatellite] = useState<SatelliteState>({ position: 'base', fuel: config.maxFuel, storage: 0 });
    const [debris, setDebris] = useState<Debris[]>([]);
    const [missionLog, setMissionLog] = useState<string[]>([]);
    const [missionStatus, setMissionStatus] = useState<MissionStatus>('idle');
    const [summary, setSummary] = useState<MissionSummary | null>(null);
    const [isCollecting, setIsCollecting] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
    const movesRef = useRef(0);

    const generateDebris = useCallback((count: number) => {
        const newDebris: Debris[] = [];
        for (let i = 0; i < count; i++) {
            newDebris.push({
                id: `D${i + 1}`,
                orbit: ORBITS[Math.floor(Math.random() * ORBITS.length)],
                status: 'in_orbit',
            });
        }
        setDebris(newDebris);
    }, []);

    const resetMission = useCallback(() => {
        setMissionStatus('idle');
        setMissionLog(['Mission planner initialized. Ready for commands.']);
        setSatellite({ position: 'base', fuel: config.maxFuel, storage: 0 });
        generateDebris(config.debrisCount);
        setSummary(null);
        movesRef.current = 0;
    }, [config, generateDebris]);

    useEffect(() => {
        resetMission();
    }, [config, resetMission]);

    const addLog = (message: string) => {
        setMissionLog(prev => [...prev, message]);
    };

    const findBestTargetOrbit = (currentDebris: Debris[]): string | null => {
        const remainingDebris = currentDebris.filter(d => d.status === 'in_orbit');
        if (remainingDebris.length === 0) return null;

        const orbitCounts = remainingDebris.reduce((acc, d) => {
            acc[d.orbit] = (acc[d.orbit] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        let bestOrbit = '';
        let maxDebris = 0;
        for (const orbit in orbitCounts) {
            if (orbitCounts[orbit] > maxDebris) {
                maxDebris = orbitCounts[orbit];
                bestOrbit = orbit;
            }
        }
        return bestOrbit || remainingDebris[0].orbit; // Fallback to first available
    };

    const runMissionStep = useCallback(() => {
        const currentDebris = [...debris];
        const remainingDebris = currentDebris.filter(d => d.status === 'in_orbit');

        if (remainingDebris.length === 0 && satellite.position === 'base') {
            addLog('✅ Mission Complete: All debris collected and satellite returned to base.');
            setMissionStatus('complete');
            setSummary({
                totalDebrisCollected: debris.length,
                totalMoves: movesRef.current,
                fuelLeft: satellite.fuel
            });
            return;
        }

        if (satellite.position === 'base') {
            if (satellite.storage > 0) {
                addLog(`📦 Emptying storage at base. Removed ${satellite.storage} debris.`);
                setSatellite(s => ({ ...s, storage: 0 }));
            } else if (satellite.fuel < config.maxFuel) {
                addLog(`⛽ Refueling at base. Fuel restored to ${config.maxFuel}.`);
                setSatellite(s => ({ ...s, fuel: config.maxFuel }));
            } else {
                const targetOrbit = findBestTargetOrbit(currentDebris);
                if (targetOrbit) {
                    if (satellite.fuel > 0) {
                        addLog(`🪐 Moving from base to ${targetOrbit} (most debris).`);
                        setSatellite(s => ({ ...s, fuel: s.fuel - 1, position: targetOrbit }));
                        movesRef.current += 1;
                    } else {
                        addLog('❌ CRITICAL ERROR: Not enough fuel to leave base. Mission failed.');
                        setMissionStatus('failed');
                    }
                }
            }
            return;
        }

        const debrisInCurrentOrbit = remainingDebris.filter(d => d.orbit === satellite.position);
        if (debrisInCurrentOrbit.length > 0 && satellite.storage < config.storageCapacity) {
            const debrisToCollect = debrisInCurrentOrbit[0];
            addLog(`♻️ Collecting debris ${debrisToCollect.id} in ${satellite.position}.`);
            setIsCollecting(true);
            setTimeout(() => setIsCollecting(false), 500);
            setDebris(dList => dList.map(d => d.id === debrisToCollect.id ? { ...d, status: 'collected' } : d));
            setSatellite(s => ({ ...s, storage: s.storage + 1 }));
            return;
        }

        const shouldReturnToBase =
            satellite.storage === config.storageCapacity ||
            satellite.fuel <= 1 ||
            remainingDebris.length === 0;

        if (shouldReturnToBase) {
            if (satellite.fuel > 0) {
                let reason = "Returning to base.";
                if (satellite.storage === config.storageCapacity) reason = `🪫 Storage full. ${reason}`;
                else if (satellite.fuel <= 1) reason = `⛽ Fuel critical. ${reason}`;
                else reason = `🛰️ All known debris collected. ${reason}`;
                addLog(reason);
                setSatellite(s => ({ ...s, fuel: s.fuel - 1, position: 'base' }));
                movesRef.current += 1;
            } else {
                addLog(`❌ STRANDED: Out of fuel in ${satellite.position}. Mission failed.`);
                setMissionStatus('failed');
            }
        } else {
            const nextTargetOrbit = findBestTargetOrbit(currentDebris.filter(d => d.orbit !== satellite.position));
            if (nextTargetOrbit) {
                addLog(`🪐 Current orbit clear. Moving from ${satellite.position} to ${nextTargetOrbit}.`);
                setSatellite(s => ({ ...s, fuel: s.fuel - 1, position: nextTargetOrbit }));
                movesRef.current += 1;
            } else {
                addLog("🤔 No other targets found. Returning to base as a precaution.");
                 setSatellite(s => ({ ...s, fuel: s.fuel - 1, position: 'base' }));
                movesRef.current += 1;
            }
        }
    }, [satellite, debris, config.maxFuel, config.storageCapacity]);

    useEffect(() => {
        if (missionStatus === 'running') {
            const timer = setTimeout(() => {
                runMissionStep();
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [missionStatus, runMissionStep, satellite.position, debris]);

    const startMission = () => {
        if (missionStatus !== 'running') {
            resetMission();
            setTimeout(() => {
                setMissionStatus('running');
                addLog('🚀 Mission Started!');
            }, 100);
        }
    };
    
    const renderView = () => {
        switch (viewMode) {
            case 'dashboard':
                return <DashboardView 
                            debris={debris} 
                            satellite={satellite}
                            isCollecting={isCollecting} 
                            missionLog={missionLog} 
                            summary={summary}
                            orbits={ORBITS}
                        />;
            case 'earth':
                return <EarthView debris={debris} />;
            case 'realistic':
                 return <RealisticEarthView debris={debris} />;
            default:
                return null;
        }
    }

    return (
        <div className="min-h-screen font-display flex flex-col items-center p-4">
            <header className="w-full max-w-7xl text-center mb-6">
                <h1 
                  className="text-4xl md:text-5xl font-bold text-cyan-400"
                >
                    <span className="typing-effect">🛰️ Autonomous Space Debris Collection Planner</span>
                </h1>
            </header>
            <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6">
                <Sidebar 
                    config={config} 
                    setConfig={setConfig} 
                    startMission={startMission} 
                    resetMission={resetMission}
                    missionStatus={missionStatus} 
                />
                <main className="flex-grow bg-black/30 rounded-lg p-6 shadow-2xl backdrop-blur-sm border border-cyan-500/30 w-full lg:w-2/3 glowing-border">
                    <StatusDisplay satellite={satellite} maxFuel={config.maxFuel} maxStorage={config.storageCapacity} />
                    <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

export default App;