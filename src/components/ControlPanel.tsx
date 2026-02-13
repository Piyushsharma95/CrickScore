import React, { useState } from 'react';
import { RotateCcw, UserPlus, MoreHorizontal } from 'lucide-react';
import type { ExtraType, WicketType } from '../types';

interface ControlPanelProps {
    onBowl: (runs: number, extraType: ExtraType, wicketType: WicketType, fielderName?: string) => void;
    onUndo: () => void;
    onRetire: () => void;
    onSwap: () => void;
    recentBalls: any[];
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ onBowl, onUndo, onRetire, onSwap, recentBalls }) => {
    const [selectedExtra, setSelectedExtra] = useState<ExtraType>('None');
    const [isWicket, setIsWicket] = useState(false);
    const [showWicketTypeSelector, setShowWicketTypeSelector] = useState(false);
    const [tempWicketType, setTempWicketType] = useState<WicketType>('None');
    const [fielderName, setFielderName] = useState('');
    const [showFielderInput, setShowFielderInput] = useState(false);

    const handleRun = (runs: number) => {
        if (isWicket) {
            setShowWicketTypeSelector(true);
            // We store the runs if it's a RunOut, but typically runs aren't added on wicket unless extras.
            // For now, store runs in a temp state to use in final onBowl?
            // Simplified: Wicket buttons usually don't have runs unless Run Out.
            return;
        }
        onBowl(runs, selectedExtra, 'None');
        setSelectedExtra('None');
        setIsWicket(false);
    };

    const handleWicketReason = (type: WicketType) => {
        if (type === 'Caught' || type === 'Stumped' || type === 'RunOut') {
            setTempWicketType(type);
            setShowFielderInput(true);
            setShowWicketTypeSelector(false);
        } else {
            onBowl(0, selectedExtra, type);
            resetStates();
        }
    };

    const confirmWicketWithFielder = () => {
        onBowl(0, selectedExtra, tempWicketType, fielderName);
        resetStates();
    };

    const resetStates = () => {
        setSelectedExtra('None');
        setIsWicket(false);
        setShowWicketTypeSelector(false);
        setShowFielderInput(false);
        setTempWicketType('None');
        setFielderName('');
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
            <div className="grid grid-cols-12 gap-2 sm:gap-4 px-1 sm:px-2">
                {/* Left Side: Runs Pad (Vertical Emphasis) */}
                <div className="col-span-5 grid grid-cols-2 gap-2 sm:gap-3">
                    {[0, 1, 2, 3, 4, 6].map(r => (
                        <button
                            key={r}
                            onClick={() => handleRun(r)}
                            className="run-circle !w-full shadow-md !text-lg"
                        >
                            {r}
                        </button>
                    ))}
                </div>

                {/* Right Side: Modifiers */}
                <div className="col-span-7 flex flex-col gap-2 sm:gap-3">
                    <div className="grid grid-cols-2 gap-2">
                        {(['Wide', 'NoBall', 'Bye', 'LegBye'] as ExtraType[]).map(type => (
                            <button
                                key={type}
                                onClick={() => toggleExtra(type)}
                                className={`extra-chip-btn !py-2 sm:!py-3 ${selectedExtra === type ? 'active' : ''}`}
                            >
                                {type === 'NoBall' ? 'NB' : type}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setIsWicket(!isWicket)}
                        className={`extra-chip-btn !py-3 sm:!py-4 wicket-btn ${isWicket ? 'active' : ''}`}
                    >
                        {isWicket ? 'CONFIRM OUT' : 'WICKET'}
                    </button>

                    <div className="flex gap-2 mt-auto">
                        <button
                            onClick={onRetire}
                            className="flex-1 p-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-[0.65rem] sm:text-xs flex items-center justify-center gap-1 hover:bg-slate-200 active:scale-95 transition-all"
                        >
                            RETIRE
                        </button>
                        <button
                            onClick={onSwap}
                            className="flex-1 p-2 bg-blue-50 text-blue-700 rounded-xl font-bold text-[0.65rem] sm:text-xs flex items-center justify-center gap-1 hover:bg-blue-100 active:scale-95 transition-all"
                        >
                            SWAP
                        </button>
                    </div>
                </div>
            </div>

            {showWicketTypeSelector && (
                <div className="fixed inset-0 z-[3000] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade">
                    <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl">
                        <div className="p-6 bg-red-600 text-white flex justify-between items-center">
                            <h3 className="font-black uppercase tracking-widest text-sm">Wicket Type</h3>
                            <button onClick={() => setShowWicketTypeSelector(false)} className="opacity-70 hover:opacity-100">CLOSE</button>
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-3">
                            {(['Bowled', 'Caught', 'LBW', 'RunOut', 'Stumped', 'HitWicket'] as WicketType[]).map(type => (
                                <button
                                    key={type}
                                    onClick={() => handleWicketReason(type)}
                                    className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-xs uppercase tracking-tight text-slate-700 hover:border-red-500 hover:bg-red-50 transition-all text-center"
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {showFielderInput && (
                <div className="fixed inset-0 z-[4000] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade">
                    <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl">
                        <div className="p-6 bg-p-blue text-white flex justify-between items-center">
                            <h3 className="font-black uppercase tracking-widest text-sm">
                                {tempWicketType === 'RunOut' ? 'Run Out By' : (tempWicketType === 'Caught' ? 'Caught By' : 'Stumped By')}
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="setup-group">
                                <label className="setup-label">Fielder Name (Optional)</label>
                                <input
                                    className="setup-input-underlined"
                                    placeholder="Enter fielder name"
                                    value={fielderName}
                                    onChange={(e) => setFielderName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={() => setShowFielderInput(false)}
                                    className="btn-s flex-1 !py-4"
                                >
                                    BACK
                                </button>
                                <button
                                    onClick={confirmWicketWithFielder}
                                    className="btn-p flex-1 !py-4"
                                >
                                    CONFIRM
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 flex justify-center">
                <MoreHorizontal className="text-slate-200" />
            </div>
        </div>
    );
};
