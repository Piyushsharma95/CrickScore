import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';

interface BatsmanSelectionModalProps {
    isOpen: boolean;
    onSelect: (name: string) => void;
}

export const BatsmanSelectionModal: React.FC<BatsmanSelectionModalProps> = ({ isOpen, onSelect }) => {
    const [name, setName] = useState('');

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="app-container !shadow-none !border-0 bg-white">
                <header className="app-header !bg-red-700">
                    <div className="flex items-center gap-3">
                        <UserPlus className="w-5 h-5" />
                        <span className="header-title uppercase tracking-widest">Wicket Down</span>
                    </div>
                </header>

                <div className="p-6">
                    <div className="flex items-center gap-4 mb-8 bg-red-50 p-4 rounded-xl border border-red-100">
                        <div className="w-1.5 h-10 bg-red-600 rounded-full"></div>
                        <div>
                            <p className="text-[0.6rem] font-black text-red-800 uppercase tracking-widest">Action Required</p>
                            <h2 className="text-sm font-bold text-red-900">Select Next Batsman</h2>
                        </div>
                    </div>

                    <div className="setup-group">
                        <label className="setup-label !text-red-700">Player Name</label>
                        <input
                            className="setup-input-underlined !border-red-100 focus:!border-red-600"
                            placeholder="Enter Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={() => {
                                if (name) {
                                    onSelect(name);
                                    setName('');
                                }
                            }}
                            disabled={!name}
                            className="bg-red-700 text-white w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-200 active:scale-95 transition-all"
                        >
                            Confirm Entry
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
