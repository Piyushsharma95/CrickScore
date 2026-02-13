import React, { useState } from 'react';
import { Settings, Bell, Trophy, Swords, Calendar, Clock, MapPin } from 'lucide-react';

interface MatchSetupProps {
    onStart: (teamA: string, teamB: string, overs: number, battingFirst: 'TeamA' | 'TeamB') => void;
}

export const MatchSetup: React.FC<MatchSetupProps> = ({ onStart }) => {
    const [teamA, setTeamA] = useState('');
    const [teamB, setTeamB] = useState('');
    const [overs, setOvers] = useState(16);
    const [tossWinner, setTossWinner] = useState<'TeamA' | 'TeamB'>('TeamA');
    const [choice, setChoice] = useState<'Bat' | 'Bowl'>('Bat');

    const handleStart = (e: React.FormEvent) => {
        e.preventDefault();
        if (!teamA || !teamB) return;

        let battingFirst: 'TeamA' | 'TeamB';
        if (tossWinner === 'TeamA') {
            battingFirst = choice === 'Bat' ? 'TeamA' : 'TeamB';
        } else {
            battingFirst = choice === 'Bat' ? 'TeamB' : 'TeamA';
        }

        onStart(teamA, teamB, overs, battingFirst);
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <div className="flex items-center gap-2">
                    <div className="flex flex-col w-1.5 h-4 overflow-hidden rounded-full border border-white/20">
                        <div className="flex-1 bg-india-saffron"></div>
                        <div className="flex-1 bg-white"></div>
                        <div className="flex-1 bg-india-green"></div>
                    </div>
                    <span className="header-title tracking-widest leading-none">PIYUSH CRICKET</span>
                </div>
                <div className="flex gap-4">
                    <Bell className="w-5 h-5 cursor-pointer text-white/80" />
                    <Settings className="w-5 h-5 cursor-pointer text-white/80" />
                </div>
            </header>

            <main className="main-content">
                <div className="flex items-center gap-3 mb-6 px-1">
                    <div className="bg-p-blue-bg p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-p-blue" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">New Tournament</h2>
                        <p className="text-[0.65rem] font-bold text-slate-400 uppercase">Match Configuration</p>
                    </div>
                </div>

                <form onSubmit={handleStart}>
                    <div className="card-premium">
                        <div className="setup-group">
                            <label className="setup-label">Teams</label>
                            <div className="flex flex-col gap-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="setup-input-underlined"
                                        placeholder="Host Team Name"
                                        value={teamA}
                                        onChange={(e) => setTeamA(e.target.value)}
                                        required
                                        autoComplete="off"
                                    />
                                    <MapPin className="absolute right-0 bottom-3 w-4 h-4 text-slate-300" />
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="setup-input-underlined"
                                        placeholder="Visitor Team Name"
                                        value={teamB}
                                        onChange={(e) => setTeamB(e.target.value)}
                                        required
                                        autoComplete="off"
                                    />
                                    <MapPin className="absolute right-0 bottom-3 w-4 h-4 text-slate-300" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-premium">
                        <div className="setup-group">
                            <label className="setup-label">Toss & Selection</label>
                            <p className="text-[0.65rem] font-bold text-slate-400 uppercase mb-4">Who won the toss?</p>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setTossWinner('TeamA')}
                                    className={`extra-chip-btn flex-1 ${tossWinner === 'TeamA' ? 'active' : ''}`}
                                >
                                    {teamA || 'Team 1'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTossWinner('TeamB')}
                                    className={`extra-chip-btn flex-1 ${tossWinner === 'TeamB' ? 'active' : ''}`}
                                >
                                    {teamB || 'Team 2'}
                                </button>
                            </div>
                        </div>

                        <div className="setup-group">
                            <p className="text-[0.65rem] font-bold text-slate-400 uppercase mb-4">Elected to?</p>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setChoice('Bat')}
                                    className={`extra-chip-btn flex-1 ${choice === 'Bat' ? 'active' : ''}`}
                                >
                                    BAT
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setChoice('Bowl')}
                                    className={`extra-chip-btn flex-1 ${choice === 'Bowl' ? 'active' : ''}`}
                                >
                                    BOWL
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="card-premium">
                        <div className="setup-group !mb-0">
                            <div className="flex justify-between items-center mb-4">
                                <label className="setup-label !mb-0">Match Overs</label>
                                <Clock className="w-4 h-4 text-slate-300" />
                            </div>
                            <input
                                type="number"
                                className="setup-input-underlined"
                                placeholder="16"
                                value={overs}
                                onChange={(e) => setOvers(parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>

                    <div className="mt-8 mb-4">
                        <button type="submit" className="btn-p w-full !py-4 shadow-xl text-md">
                            START MATCH
                        </button>
                    </div>
                </form>
            </main>

            <nav className="bottom-nav">
                <div className="nav-item active">
                    <Trophy className="w-5 h-5" />
                    <span>SCORER</span>
                </div>
                <div className="nav-item">
                    <Swords className="w-5 h-5" />
                    <span>TEAMS</span>
                </div>
                <div className="nav-item">
                    <Settings className="w-5 h-5" />
                    <span>CONFIG</span>
                </div>
            </nav>
        </div>
    );
};
