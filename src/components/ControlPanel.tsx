import React, { useState } from 'react';
import { RotateCcw, UserPlus, MoreHorizontal, ArrowRightLeft, Hand } from 'lucide-react';
import type { ExtraType, WicketType } from '../types';

interface ControlPanelProps {
    onBowl: (runs: number, extraType: ExtraType, wicketType: WicketType) => void;
    onUndo: () => void;
    recentBalls: any[];
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ onBowl, onUndo, recentBalls }) => {
    const [selectedExtra, setSelectedExtra] = useState<ExtraType>('None');
    const [isWicket, setIsWicket] = useState(false);

    const handleRun = (runs: number) => {
        onBowl(runs, selectedExtra, isWicket ? 'Bowled' : 'None');
        setSelectedExtra('None');
        setIsWicket(false);
    };

    const toggleExtra = (type: ExtraType) => {
        setSelectedExtra(prev => prev === type ? 'None' : type);
    };

    return (
        <div className="control-panel border-t-2 border-slate-100 shadow-2xl">
            {/* Horizontal Tool Bar */}
            <div className="flex items-center justify-between px-2 mb-4">
                <div className="flex gap-2">
                    <button onClick={onUndo} className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 active:scale-95 transition-all">
                        <RotateCcw className="w-5 h-5 text-slate-600" />
                    </button>
                    <button className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100">
                        <UserPlus className="w-5 h-5 text-slate-600" />
                    </button>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-p-blue-bg rounded-lg">
                    <div className="w-2 h-2 bg-p-blue rounded-full animate-pulse"></div>
                    <span className="text-[0.65rem] font-black text-p-blue uppercase tracking-widest">In Play</span>
                </div>
            </div>

            {/* Ball Sequence Track */}
            <div className="px-2 mb-6">
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    <span className="text-[0.6rem] font-black text-slate-400 uppercase vertical-text">Track</span>
                    <div className="flex gap-2">
                        {recentBalls.map((ball, idx) => (
                            <div key={idx} className={`ball-dot !text-[0.9rem] !w-10 !h-10 ${ball.wicket !== 'None' ? 'wkt' : ''}`}>
                                {ball.wicket !== 'None' ? 'W' : (ball.extraType !== 'None' ?
                                    (ball.extraType === 'Wide' ? 'Wd' : ball.extraType[0]) : ball.runs)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-5 gap-4 px-2">
                {/* Left Side: Runs Pad (Vertical Emphasis) */}
                <div className="col-span-2 grid grid-cols-2 gap-3">
                    {[0, 1, 2, 3, 4, 6].map(r => (
                        <button
                            key={r}
                            onClick={() => handleRun(r)}
                            className="run-circle !w-full shadow-md"
                        >
                            {r}
                        </button>
                    ))}
                </div>

                {/* Right Side: Modifiers */}
                <div className="col-span-3 flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-2">
                        {(['Wide', 'NoBall', 'Bye', 'LegBye'] as ExtraType[]).map(type => (
                            <button
                                key={type}
                                onClick={() => toggleExtra(type)}
                                className={`extra-chip-btn !py-3 ${selectedExtra === type ? 'active' : ''}`}
                            >
                                {type === 'NoBall' ? 'NB' : type}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setIsWicket(!isWicket)}
                        className={`extra-chip-btn !py-4 wicket-btn ${isWicket ? 'active' : ''}`}
                    >
                        {isWicket ? 'CONFIRM WICKET' : 'OUT / WICKET'}
                    </button>

                    <div className="flex gap-2 mt-auto">
                        <button className="flex-1 p-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-200">
                            <Hand className="w-4 h-4" />
                            RETIRE
                        </button>
                        <button className="flex-1 p-3 bg-blue-50 text-blue-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2">
                            <ArrowRightLeft className="w-4 h-4" />
                            SWAP
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-center">
                <MoreHorizontal className="text-slate-200" />
            </div>
        </div>
    );
};
