import { useState } from 'react';
import { UserPlus, Swords, Target } from 'lucide-react';

interface PlayerSelectionModalProps {
    title: string;
    isOpen: boolean;
    onSave: (p1: string, p2: string, p3: string) => void;
}

export const PlayerSelectionModal: React.FC<PlayerSelectionModalProps> = ({ title, isOpen, onSave }) => {
    const [p1, setP1] = useState('');
    const [p2, setP2] = useState('');
    const [p3, setP3] = useState('');

    if (!isOpen) return null;

    return (
        <div className="modal-overlay white-bg">
            <div className="app-container !shadow-none !border-0 bg-white">
                <header className="app-header">
                    <div className="flex items-center gap-3">
                        <Swords className="w-5 h-5" />
                        <span className="header-title uppercase tracking-widest">{title}</span>
                    </div>
                </header>

                <div className="p-6">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-p-blue-bg flex items-center justify-center rounded-xl">
                            <UserPlus className="w-5 h-5 text-p-blue" />
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">Opening Setup</h3>
                            <p className="text-[0.6rem] font-bold text-slate-400 uppercase">Set Initial Players</p>
                        </div>
                    </div>

                    <div className="card-premium">
                        <div className="setup-group">
                            <label className="setup-label">Opening Batsmen</label>
                            <div className="flex flex-col gap-6">
                                <div className="relative">
                                    <input
                                        className="setup-input-underlined"
                                        placeholder="Striker Name"
                                        value={p1}
                                        onChange={(e) => setP1(e.target.value)}
                                        autoFocus
                                    />
                                    <span className="absolute right-0 bottom-3 text-[0.55rem] font-black text-p-blue/30 uppercase tracking-widest border border-p-blue/10 px-1.5 py-0.5 rounded">STR</span>
                                </div>
                                <div className="relative">
                                    <input
                                        className="setup-input-underlined"
                                        placeholder="Non-Striker Name"
                                        value={p2}
                                        onChange={(e) => setP2(e.target.value)}
                                    />
                                    <span className="absolute right-0 bottom-3 text-[0.55rem] font-black text-p-blue/30 uppercase tracking-widest border border-p-blue/10 px-1.5 py-0.5 rounded">NON-STR</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-premium">
                        <div className="setup-group !mb-0">
                            <div className="flex justify-between items-center mb-4">
                                <label className="setup-label !mb-0">Opening Bowler</label>
                                <Target className="w-4 h-4 text-p-blue/20" />
                            </div>
                            <input
                                className="setup-input-underlined"
                                placeholder="Enter Bowler Name"
                                value={p3}
                                onChange={(e) => setP3(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={() => {
                                if (p1 && p2 && p3) onSave(p1, p2, p3);
                            }}
                            disabled={!p1 || !p2 || !p3}
                            className="btn-p w-full !py-4 shadow-xl text-xs tracking-widest"
                        >
                            PROCEED TO MATCH
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
