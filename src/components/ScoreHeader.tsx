import React from 'react';
import { Share2, Zap } from 'lucide-react';

interface ScoreHeaderProps {
    battingTeam: string;
    inningsLabel: string;
    totalRuns: number;
    wickets: number;
    overs: number;
    ballsInOver: number;
    isFreeHit?: boolean;
}

export const ScoreHeader: React.FC<ScoreHeaderProps> = ({
    battingTeam, inningsLabel, totalRuns, wickets, overs, ballsInOver, isFreeHit
}) => {
    const currentOverDisplay = `${overs}.${ballsInOver}`;
    const runRate = (overs > 0 || ballsInOver > 0)
        ? (totalRuns / (overs + ballsInOver / 6)).toFixed(2)
        : '0.00';

    return (
        <div className="score-card shadow-sm border border-p-blue-bg">
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-4 bg-saffron rounded-full"></div>
                        <span className="text-[0.7rem] font-black text-p-blue uppercase tracking-[0.1em]">
                            {inningsLabel} • {battingTeam}
                        </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="score-text text-5xl">{totalRuns}-{wickets}</span>
                        <span className="text-xl font-bold text-p-blue-light">({currentOverDisplay})</span>
                    </div>
                </div>
                <div className="cursor-pointer bg-white p-2 rounded-lg shadow-sm">
                    <Share2 className="w-5 h-5 text-p-blue-light" />
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-p-blue/5">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-widest">Run Rate</span>
                        <div className="flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-saffron fill-saffron" />
                            <span className="text-lg font-black text-slate-800">{runRate}</span>
                        </div>
                    </div>
                </div>


                {isFreeHit ? (
                    <div className="bg-saffron px-3 py-1.5 rounded-lg animate-pulse-live shadow-lg shadow-saffron/20 border border-saffron-light">
                        <span className="text-[0.6rem] font-black text-white uppercase tracking-widest">FREE HIT</span>
                    </div>
                ) : (
                    <div className="bg-p-blue px-3 py-1.5 rounded-lg">
                        <span className="text-[0.6rem] font-black text-white uppercase tracking-widest">LIVE SCORE</span>
                    </div>
                )}
            </div>
        </div>
    );
};
