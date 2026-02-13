import { X, Trophy, Users, Target } from 'lucide-react';
import type { Batsman, Bowler } from '../types';

interface FullScorecardModalProps {
    isOpen: boolean;
    onClose: () => void;
    battingTeam: string;
    batsmen: Batsman[];
    bowlers: Bowler[];
    totalRuns: number;
    wickets: number;
    overs: number;
    ballsInOver: number;
}

export const FullScorecardModal = ({
    isOpen,
    onClose,
    battingTeam,
    batsmen,
    bowlers,
    totalRuns,
    wickets,
    overs,
    ballsInOver
}: FullScorecardModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade">
            <div className="bg-white w-full max-w-2xl h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-white/20">
                {/* Modal Header */}
                <header className="bg-p-blue p-6 text-white flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-saffron" />
                        </div>
                        <div>
                            <h2 className="font-black text-lg uppercase tracking-wider">Full Scorecard</h2>
                            <p className="text-[0.65rem] opacity-70 font-bold uppercase tracking-widest">{battingTeam} Innings</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </header>

                {/* Score Summary Banner */}
                <div className="bg-p-blue-bg/50 p-6 border-b border-p-blue/5">
                    <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className="text-[0.6rem] font-black text-p-blue/40 uppercase tracking-[0.2em] mb-1">Current Score</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-p-blue">{totalRuns}/{wickets}</span>
                                <span className="text-sm font-bold text-slate-500">({overs}.{ballsInOver} Overs)</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest">Run Rate</span>
                            <p className="text-lg font-black text-slate-700">{(totalRuns / (overs + ballsInOver / 6) || 0).toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
                    {/* Batting Section */}
                    <div className="card-premium !p-0 overflow-hidden border-none shadow-sm">
                        <div className="bg-white border-b border-slate-100 p-4 flex items-center gap-2">
                            <Users className="w-4 h-4 text-p-blue" />
                            <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Batting Performance</span>
                        </div>
                        <table className="modern-table w-full">
                            <thead className="bg-slate-50/80">
                                <tr>
                                    <th className="text-left text-[0.65rem] py-3 pl-4">BATSMAN</th>
                                    <th className="text-right text-[0.65rem] py-3">R</th>
                                    <th className="text-right text-[0.65rem] py-3">B</th>
                                    <th className="text-right text-[0.65rem] py-3">4s</th>
                                    <th className="text-right text-[0.65rem] py-3">6s</th>
                                    <th className="text-right text-[0.65rem] py-3 pr-4">SR</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-50">
                                {batsmen.map((b: Batsman) => (
                                    <tr key={b.id} className={b.isStriker ? 'bg-p-blue-bg/20' : ''}>
                                        <td className="py-3 pl-4">
                                            <div className="flex flex-col">
                                                <span className="text-[0.75rem] font-bold text-slate-800">{b.name} {b.isStriker ? '*' : ''}</span>
                                                <span className="text-[0.55rem] text-slate-400 font-bold uppercase">{b.out || (b.isOut ? 'Out' : 'Not Out')}</span>
                                            </div>
                                        </td>
                                        <td className="text-right text-[0.75rem] font-black text-slate-700">{b.runs}</td>
                                        <td className="text-right text-[0.7rem] text-slate-500">{b.ballsFaced}</td>
                                        <td className="text-right text-[0.7rem] text-slate-400">{b.fours}</td>
                                        <td className="text-right text-[0.7rem] text-slate-400">{b.sixes}</td>
                                        <td className="text-right text-[0.75rem] font-bold text-p-blue pr-4">
                                            {b.ballsFaced > 0 ? ((b.runs / b.ballsFaced) * 100).toFixed(1) : '0.0'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Bowling Section */}
                    <div className="card-premium !p-0 overflow-hidden border-none shadow-sm">
                        <div className="bg-white border-b border-slate-100 p-4 flex items-center gap-2">
                            <Target className="w-4 h-4 text-p-blue" />
                            <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Bowling Analysis</span>
                        </div>
                        <table className="modern-table w-full">
                            <thead className="bg-slate-50/80">
                                <tr>
                                    <th className="text-left text-[0.65rem] py-3 pl-4">BOWLER</th>
                                    <th className="text-right text-[0.65rem] py-3">O</th>
                                    <th className="text-right text-[0.6rem] py-3">M</th>
                                    <th className="text-right text-[0.6rem] py-3">R</th>
                                    <th className="text-right text-[0.65rem] py-3">W</th>
                                    <th className="text-right text-[0.65rem] py-3 pr-4">ECO</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-50">
                                {bowlers.map((bw: Bowler) => (
                                    <tr key={bw.id}>
                                        <td className="py-3 pl-4">
                                            <span className="text-[0.75rem] font-bold text-slate-800">{bw.name}</span>
                                        </td>
                                        <td className="text-right text-[0.75rem] font-bold text-slate-700">{bw.overs}</td>
                                        <td className="text-right text-[0.7rem] text-slate-400">{bw.maidens || 0}</td>
                                        <td className="text-right text-[0.7rem] text-slate-700">{bw.runsConceded}</td>
                                        <td className="text-right text-[0.75rem] font-black text-red-600">{bw.wickets}</td>
                                        <td className="text-right text-[0.75rem] font-bold text-p-blue pr-4">
                                            {bw.overs > 0 ? (bw.runsConceded / bw.overs).toFixed(2) : '0.00'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal Footer */}
                <footer className="p-4 bg-white border-t border-slate-100 shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full btn-p !py-4 shadow-xl"
                    >
                        CONTINUE SCORING
                    </button>
                </footer>
            </div>
        </div>
    );
};
