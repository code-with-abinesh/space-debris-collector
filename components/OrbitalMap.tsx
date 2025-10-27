import React, { useState, useEffect, useRef } from 'react';

interface OrbitalMapProps {
    currentPosition: string;
    orbits: string[];
    isCollecting: boolean;
}

const OrbitalMap: React.FC<OrbitalMapProps> = ({ currentPosition, orbits, isCollecting }) => {
    const allLocations = ['base', ...orbits];
    const [satelliteTop, setSatelliteTop] = useState(0);
    const listRef = useRef<HTMLUListElement>(null);
    const itemRefs = useRef<Map<string, HTMLLIElement | null>>(new Map());

    useEffect(() => {
        const currentItem = itemRefs.current.get(currentPosition);
        if (currentItem && listRef.current) {
            const listTop = listRef.current.getBoundingClientRect().top;
            const itemTop = currentItem.getBoundingClientRect().top;
            // Calculate offset from the top of the list container
            const offset = itemTop - listTop + currentItem.offsetHeight / 2 - 12; // Center icon (12px is half of 24px height)
            setSatelliteTop(offset);
        }
    }, [currentPosition]);

    return (
        <div className="bg-black/30 p-4 rounded-lg border border-cyan-500/30 h-96 flex flex-col glowing-border">
            <h3 className="text-xl font-semibold text-cyan-300 mb-4 text-center">Orbital Map</h3>
            <div className="relative flex-grow">
                <span
                    style={{ top: `${satelliteTop}px` }}
                    className={`absolute left-0 text-2xl z-10 transition-all duration-700 ease-in-out ${isCollecting ? 'collecting-animation' : ''}`}
                    aria-hidden="true"
                >
                    🛰️
                </span>
                <ul ref={listRef} className="space-y-2 overflow-y-auto h-full pl-8">
                    {allLocations.map(location => (
                        <li
                            key={location}
                            ref={el => itemRefs.current.set(location, el)}
                            className={`
                                p-3 rounded-md transition-all duration-300 flex items-center gap-3 border-l-4
                                ${currentPosition === location
                                    ? 'bg-cyan-500/30 border-cyan-400 text-white font-bold'
                                    : 'bg-gray-800/30 border-transparent text-gray-400'
                                }
                            `}
                        >
                            <span className="capitalize">{location.replace('_', ' ')}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default OrbitalMap;