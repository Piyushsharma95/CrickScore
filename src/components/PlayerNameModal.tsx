import React, { useState, useEffect } from 'react';
import { User, X } from 'lucide-react';

interface PlayerNameModalProps {
    isOpen: boolean;
    title: string;
    initialName?: string;
    onSave: (name: string) => void;
    onClose: () => void;
}

export const PlayerNameModal: React.FC<PlayerNameModalProps> = ({
    isOpen,
    title,
    initialName = '',
    onSave,
    onClose
}) => {
    const [name, setName] = useState(initialName);

    useEffect(() => {
        setName(initialName);
    }, [initialName, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSave(name.trim());
        }
    };

    return (
        <div className="modal-overlay">
            <div className="app-container !shadow-none !border-0 bg-white">
                <header className="app-header">
                    <div className="flex items-center gap-3">
                        <User className="w-5 h-5" />
                        <span className="header-title uppercase tracking-widest">{title}</span>
                    </div>
                    <X className="w-5 h-5 cursor-pointer opacity-50" onClick={onClose} />
                </header>

                <div className="p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="card-premium !mb-8">
                            <div className="setup-group !mb-0">
                                <label className="setup-label">Display Name</label>
                                <input
                                    type="text"
                                    className="setup-input-underlined"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter player name"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn-s flex-1 !py-4"
                            >
                                CANCEL
                            </button>
                            <button
                                type="submit"
                                className="btn-p flex-1 !py-4 shadow-lg shadow-p-blue/20"
                            >
                                SAVE CHANGES
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
