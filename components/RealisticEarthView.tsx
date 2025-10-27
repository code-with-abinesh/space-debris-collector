import React from 'react';
import type { Debris } from '../types';

interface RealisticEarthViewProps {
    debris: Debris[];
}

const RealisticEarthView: React.FC<RealisticEarthViewProps> = ({ debris }) => {
    return (
        <div className="mt-6 w-full h-[500px] flex items-center justify-center relative perspective-800">
            {/* Atmosphere Glow */}
            <div className="absolute w-56 h-56 md:w-80 md:h-80 rounded-full bg-cyan-400/30 blur-2xl"></div>
            
            <div className="w-48 h-48 md:w-64 md:h-64 relative">
                {/* Earth Sphere */}
                <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                        backgroundImage: `radial-gradient(circle at 30% 30%, #4f9ac4, #123e78),
                                          url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><pattern id="land" patternUnits="userSpaceOnUse" width="100" height="100"><path d="M0 50 Q 25 20, 50 50 T 100 50" stroke="%232a642a" fill="none"/></pattern></defs><rect width="100%" height="100%" fill="url(%23land)"/></svg>')`,
                        backgroundSize: '400% 400%',
                        boxShadow: 'inset 10px 0 20px rgba(0,0,0,0.5), 0 0 15px rgba(0,255,255,0.2)',
                        animation: 'spin-realistic-earth 60s linear infinite',
                    }}
                ></div>

                {/* Cloud Layer */}
                <div 
                    className="absolute inset-0 rounded-full opacity-40"
                    style={{
                         backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23f)" opacity="0.4"></rect></svg>'),
                                          radial-gradient(circle at 50% 50%, white, transparent 60%)`,
                        backgroundSize: 'cover',
                        mixBlendMode: 'screen',
                        animation: 'spin-clouds 45s linear infinite',
                    }}
                ></div>

                {/* Debris Orbits */}
                {debris.map((d, index) => {
                    const size = 200 + (index * 40) % 120;
                    const duration = 15 + (index * 5);
                    const delay = Math.random() * -15;
                    const tiltX = 30 + (index * 15) % 45;
                    const tiltZ = (index * 35) % 360;

                    return (
                        <div
                            key={d.id}
                            className="absolute top-1/2 left-1/2"
                            style={{
                                width: `${size}px`,
                                height: `${size / 2}px`,
                                marginTop: `-${size / 4}px`,
                                marginLeft: `-${size / 2}px`,
                                transformStyle: 'preserve-3d',
                                transform: `rotateX(${tiltX}deg) rotateZ(${tiltZ}deg)`,
                            }}
                        >
                            {/* Animated Orbit Path */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    border: '2px dashed rgba(0, 255, 255, 0.7)',
                                    borderRadius: '50%',
                                    animation: `tilted-orbit ${duration * 1.5}s linear infinite reverse`,
                                }}
                            />
                            
                            {/* Debris Container */}
                            <div 
                                className="absolute w-full h-full"
                                style={{
                                    animation: `tilted-orbit ${duration}s linear infinite`,
                                    animationDelay: `${delay}s`,
                                }}
                            >
                                 <div
                                    className={`absolute top-1/2 -mt-1 w-3 h-3 text-sm flex items-center justify-center ${d.status === 'collected' ? 'realistic-collected' : ''}`}
                                    style={{ left: '-3px' }}
                                >
                                    <span
                                      title={`Debris ${d.id}`}
                                      className={d.status === 'in_orbit' ? 'debris-glow' : ''}
                                    >
                                        {d.status === 'in_orbit' ? '🔸' : ''}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RealisticEarthView;