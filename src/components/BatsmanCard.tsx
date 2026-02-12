import React from 'react';
import type { Batsman } from '../types';

interface BatsmanCardProps {
    batsman: Batsman;
    isStriker: boolean;
}

export const BatsmanCard: React.FC<BatsmanCardProps> = ({ batsman, isStriker }) => {
    const sr = batsman.ballsFaced > 0 ? ((batsman.runs / batsman.ballsFaced) * 100).toFixed(2) : '0.00';

    return (
        <tr className={isStriker ? 'bg-p-blue-bg' : 'hover:bg-slate-50'}>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    {isStriker && <div className="w-1.5 h-1.5 bg-p-blue rounded-full animate-pulse"></div>}
                    <span className={`player-name-link ${isStriker ? '!text-p-blue' : '!text-slate-600'}`}>
                        {batsman.name}
                    </span>
                    {isStriker && <span className="text-[0.6rem] font-bold text-p-blue-light uppercase tracking-tighter">* STR</span>}
                </div>
            </td>
            <td className="px-2 py-3 text-right font-black text-slate-800">{batsman.runs}</td>
            <td className="px-2 py-3 text-right text-slate-500">{batsman.ballsFaced}</td>
            <td className="px-2 py-3 text-right text-slate-400">{batsman.fours}</td>
            <td className="px-2 py-3 text-right text-slate-400">{batsman.sixes}</td>
            <td className="px-4 py-3 text-right text-p-blue font-black">{sr}</td>
        </tr>
    );
};
