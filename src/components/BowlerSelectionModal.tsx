import React, { useState } from 'react';
import { Target, UserPlus, Users, ChevronRight } from 'lucide-react';
import type { Bowler } from '../types';

interface BowlerSelectionModalProps {
    isOpen: boolean;
    bowlers: Bowler[];
    lastBowlerId?: string | null;
    onSelect: (name: string, isNew: boolean, id?: string) => void;
}

export const BowlerSelectionModal: React.FC<BowlerSelectionModalProps> = ({ isOpen, bowlers, onSelect, lastBowlerId }) => {
    const [newBowler, setNewBowler] = useState('');
    const [mode, setMode] = useState<'SELECT' | 'NEW'>(bowlers.length > 0 ? 'SELECT' : 'NEW');

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="app-container !shadow-none !border-0 bg-white">
                <header className="app-header">
                    <div className="flex items-center gap-3">
                        <Target className="w-5 h-5" />
                        <span className="header-title uppercase tracking-widest">Next Bowler</span>
                    </div>
                </header>

                <div className="p-6">
                    <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
                        <button
                            className={`flex-1 py-3 text-[0.7rem] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'SELECT' ? 'bg-white text-p-blue shadow-sm' : 'text-slate-500'}`}
                            onClick={() => setMode('SELECT')}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Users className="w-3.5 h-3.5" />
                                Existing
                            </div>
                        </button>
                        <button
                            className={`flex-1 py-3 text-[0.7rem] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'NEW' ? 'bg-white text-p-blue shadow-sm' : 'text-slate-500'}`}
                            onClick={() => setMode('NEW')}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <UserPlus className="w-3.5 h-3.5" />
                                New
                            </div>
                        </button>
                    </div>

                    {mode === 'SELECT' ? (
                        <div className="space-y-3">
                            {bowlers.length === 0 ? (
                                <div className="text-center py-16">
                                    <Target className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No previous bowlers</p>
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    {bowlers.map(b => (
                                        <button
                                            key={b.id}
                                            onClick={() => onSelect(b.name, false, b.id)}
                                            disabled={b.id === lastBowlerId}
                                            className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${b.id === lastBowlerId ? 'opacity-30 border-slate-100 cursor-not-allowed' : 'border-slate-200 bg-white hover:border-p-blue hover:shadow-lg'}`}
                                        >
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-slate-800 uppercase tracking-tight">{b.name}</span>
                                                    {b.id === lastBowlerId && <span className="text-[0.55rem] font-black bg-red-50 text-red-600 px-1.5 py-0.5 rounded uppercase">Last Over</span>}
                                                </div>
                                                <div className="flex gap-3 mt-1">
                                                    <span className="text-[0.65rem] font-bold text-slate-400 uppercase">{b.overs} Ov • {b.wickets} Wkt • Eco {(b.runsConceded / (b.overs || 1)).toFixed(2)}</span>
                                                </div>
                                            </div>
                                            <ChevronRight className={`w-5 h-5 ${b.id === lastBowlerId ? 'text-slate-200' : 'text-p-blue-light'}`} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-2">
                            <div className="card-premium !p-6">
                                <div className="setup-group !mb-0">
                                    <label className="setup-label">Entering Bowler</label>
                                    <div className="relative">
                                        <input
                                            className="setup-input-underlined"
                                            placeholder="Full Name"
                                            value={newBowler}
                                            onChange={(e) => setNewBowler(e.target.value)}
                                            autoFocus
                                        />
                                        <Target className="absolute right-0 bottom-3 w-4 h-4 text-p-blue/20" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <button
                                    onClick={() => {
                                        if (newBowler) onSelect(newBowler, true);
                                    }}
                                    disabled={!newBowler}
                                    className="btn-p w-full !py-4 shadow-xl text-xs tracking-widest"
                                >
                                    CONFIRM & START OVER
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
