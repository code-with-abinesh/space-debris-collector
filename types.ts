
export interface MissionConfig {
    debrisCount: number;
    maxFuel: number;
    storageCapacity: number;
}

export interface SatelliteState {
    position: string;
    fuel: number;
    storage: number;
}

export interface Debris {
    id: string;
    orbit: string;
    status: 'in_orbit' | 'collected';
}

export type MissionStatus = 'idle' | 'running' | 'complete' | 'failed';

export interface MissionSummary {
    totalDebrisCollected: number;
    totalMoves: number;
    fuelLeft: number;
}
