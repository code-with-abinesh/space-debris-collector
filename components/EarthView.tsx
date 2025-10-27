import React from 'react';
import type { Debris } from '../types';

interface EarthViewProps {
    debris: Debris[];
}

const EarthView: React.FC<EarthViewProps> = ({ debris }) => {
    return (
        <div className="mt-6 w-full h-[500px] flex items-center justify-center overflow-hidden relative">
            <div className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full bg-blue-500 earth-sphere"
                style={{
                    backgroundImage: 'linear-gradient(to top, #005c97, #363795)',
                    boxShadow: 'inset 0 0 20px #000, 0 0 40px -10px #0ff',
                }}
            >
                {/* Simplified land mass shapes */}
                 <div className="absolute w-20 h-16 bg-green-700/80 rounded-full top-5 left-10 blur-[2px] opacity-80"></div>
                 <div className="absolute w-12 h-12 bg-green-700/80 rounded-full bottom-8 right-12 blur-[2px] opacity-80"></div>
                 <div className="absolute w-8 h-20 bg-green-700/80 rounded-full top-20 right-5 blur-[2px] opacity-80"></div>
            </div>

            {debris.map((d, index) => {
                const radius = 120 + (index * 25) % 100; // Varying radii for orbits
                const duration = 10 + (index * 3); // Varying speeds
                const delay = Math.random() * -10; // Random start position
                return (
                    <React.Fragment key={d.id}>
                        {/* Visual Orbit Path */}
                        <div
                            className="absolute top-1/2 left-1/2 rounded-full"
                            style={{
                                width: `${radius * 2}px`,
                                height: `${radius * 2}px`,
                                marginTop: `-${radius}px`,
                                marginLeft: `-${radius}px`,
                                border: '1px dashed rgba(0, 255, 255, 0.3)',
                                animation: `spin-earth ${duration * 2}s linear infinite reverse`,
                            }}
                        />
                        {/* Debris Animation Container */}
                        <div
                            className="absolute w-full h-full orbit-container"
                            style={{
                                '--radius': `${radius}px`,
                                '--duration': `${duration}s`,
                                '--delay': `${delay}s`,
                            } as React.CSSProperties}
                        >
                            <div
                                className={`absolute top-1/2 left-1/2 -mt-1 -ml-1 w-3 h-3 text-xs flex items-center justify-center debris-satellite ${d.status === 'collected' ? 'collected' : ''}`}
                            >
                                <span title={`Debris ${d.id}`}>{d.status === 'in_orbit' ? '♻️' : ''}</span>
                            </div>
                        </div>
                    </React.Fragment>
                );
            })}

        </div>
    );
};

export default EarthView;