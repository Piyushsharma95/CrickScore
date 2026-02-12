import React from 'react';
import type { Bowler } from '../types';

interface BowlerCardProps {
    bowler: Bowler;
}

export const BowlerCard: React.FC<BowlerCardProps> = ({ bowler }) => {
    const er = bowler.overs > 0 ? (bowler.runsConceded / (bowler.overs)).toFixed(2) : '0.00';

    return (
        <tr className="bg-p-blue-bg/30">
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-p-blue uppercase tracking-tight text-[0.8rem]">
                        {bowler.name}
                    </span>
                    <span className="text-[0.55rem] font-black text-p-blue/40 border border-p-blue/10 px-1 py-0.5 rounded uppercase">BWL</span>
                </div>
            </td>
            <td className="px-2 py-3 text-right font-bold text-slate-700">{bowler.overs}</td>
            <td className="px-2 py-3 text-right text-slate-500">{bowler.maidens}</td>
            <td className="px-2 py-3 text-right text-slate-700">{bowler.runsConceded}</td>
            <td className="px-2 py-3 text-right font-black text-red-600">{bowler.wickets}</td>
            <td className="px-4 py-3 text-right text-p-blue font-black">{er}</td>
        </tr>
    );
};
