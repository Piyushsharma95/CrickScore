import React, { useRef } from 'react';
import { ArrowLeft, Share2, Download, Trophy, Target, Clock, Star, Users, ChevronRight } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Batsman, Bowler, FOW } from '../types';

interface MatchSummaryProps {
    teamA: string;
    teamB: string;
    runsA: number;
    wicketsA: number;
    oversA: number;
    runsB: number;
    wicketsB: number;
    oversB: number;
    target: number;
    firstInningsBatsmen: Batsman[];
    firstInningsBowlers: Bowler[];
    secondInningsBatsmen: Batsman[];
    secondInningsBowlers: Bowler[];
    firstInningsFOW: FOW[];
    secondInningsFOW: FOW[];
    firstInningsExtras?: { wides: number, noBalls: number, byes: number, legByes: number };
    secondInningsExtras?: { wides: number, noBalls: number, byes: number, legByes: number };
    manOfTheMatch?: { name: string, reason: string } | null;
    onRestart: () => void;
}

export const MatchSummary: React.FC<MatchSummaryProps> = (props) => {
    const {
        teamA, teamB, runsA, wicketsA, oversA, runsB, wicketsB, oversB,
        target, firstInningsBatsmen, firstInningsBowlers, secondInningsBatsmen, secondInningsBowlers,
        firstInningsFOW, secondInningsFOW, firstInningsExtras, secondInningsExtras,
        manOfTheMatch, onRestart
    } = props;

    const summaryRef = useRef<HTMLDivElement>(null);

    const getWinnerMessage = () => {
        if (target > 0 && runsB >= target) {
            return `${teamB} won by ${10 - wicketsB} wickets`;
        } else if (runsA > runsB) {
            return `${teamA} won by ${runsA - runsB} runs`;
        }
        return "Match Tied";
    };

    const downloadPDF = async () => {
        if (!summaryRef.current) return;

        const canvas = await html2canvas(summaryRef.current, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            windowWidth: 800 // Consistent width for PDF layout
        });

        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const imgHeight = (canvasHeight * pdfWidth) / canvasWidth;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        pdf.save(`piyush_cricket_${teamA}_vs_${teamB}.pdf`);
    };

    const formatExtraString = (ex: any) => {
        if (!ex) return "0";
        const sum = (ex.wides || 0) + (ex.noBalls || 0) + (ex.byes || 0) + (ex.legByes || 0);
        return `${sum} (b ${ex.byes || 0}, lb ${ex.legByes || 0}, w ${ex.wides || 0}, nb ${ex.noBalls || 0})`;
    };

    const InningsSection = ({ team, runs, wickets, overs, batsmen, bowlers, fow, extras }: any) => {
        const rr = overs > 0 ? (runs / overs).toFixed(2) : '0.00';
        const playedBatsmen = batsmen.filter((b: any) => b.ballsFaced > 0 || b.out || b.isOut);
        const didNotBat = batsmen.filter((b: any) => !(b.ballsFaced > 0 || b.out || b.isOut));

        return (
            <div className="match-card">
                <div className="match-card-header !bg-p-blue">
                    <span className="team-name-lg text-white">{team}</span>
                    <span className="total-score-lg text-white">
                        {runs}/{wickets} <span className="text-[0.65rem] opacity-70">({overs} Ov)</span>
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="modern-table">
                        <thead className="bg-slate-50">
                            <tr>
                                <th style={{ width: '45%' }}>Batter</th>
                                <th className="text-right">R</th>
                                <th className="text-right">B</th>
                                <th className="text-right">4s</th>
                                <th className="text-right">6s</th>
                                <th className="text-right">SR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {playedBatsmen.map((b: any) => (
                                <tr key={b.id}>
                                    <td>
                                        <div className="player-name-link !text-p-blue-light flex items-center gap-1">
                                            {b.name} <ChevronRight className="w-2.5 h-2.5 opacity-30" />
                                        </div>
                                        <div className="how-out-text">{b.out || (b.isStriker ? 'not out' : 'not out')}</div>
                                    </td>
                                    <td className="stat-val-bold !text-slate-800">{b.runs}</td>
                                    <td className="stat-val !text-slate-500">{b.ballsFaced}</td>
                                    <td className="stat-val !text-slate-400">{b.fours}</td>
                                    <td className="stat-val !text-slate-400">{b.sixes}</td>
                                    <td className="stat-val !text-p-blue font-bold">{(b.ballsFaced > 0 ? (b.runs / b.ballsFaced * 100).toFixed(2) : '0.00')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-4 py-3 border-t border-slate-100 flex justify-between bg-white text-[0.8rem]">
                    <span className="font-bold text-slate-400 uppercase tracking-widest text-[0.6rem]">Extras</span>
                    <span className="font-medium text-slate-700">{formatExtraString(extras)}</span>
                </div>

                <div className="total-summary-row !bg-p-blue-bg !text-p-blue">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-p-blue-light" />
                        <span className="text-[0.65rem] font-bold uppercase tracking-widest">Innings Total</span>
                    </div>
                    <span className="font-extrabold">{runs}/{wickets} <span className="opacity-60 font-medium">({overs} Ov, RR {rr})</span></span>
                </div>

                {didNotBat.length > 0 && (
                    <div className="p-4 border-t border-slate-50 text-[0.75rem]">
                        <span className="font-bold text-slate-400 uppercase tracking-widest mr-2 text-[0.6rem]">DNB:</span>
                        <span className="font-semibold text-p-blue-light">{didNotBat.map((b: any) => b.name).join(', ')}</span>
                    </div>
                )}

                <div className="overflow-x-auto border-t border-slate-100">
                    <table className="modern-table">
                        <thead className="bg-slate-50">
                            <tr>
                                <th style={{ width: '45%' }}>Bowler</th>
                                <th className="text-right">O</th>
                                <th className="text-right">M</th>
                                <th className="text-right">R</th>
                                <th className="text-right">W</th>
                                <th className="text-right">ECO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bowlers.map((bw: any) => (
                                <tr key={bw.id}>
                                    <td className="font-bold text-slate-700">{bw.name}</td>
                                    <td className="stat-val">{bw.overs}</td>
                                    <td className="stat-val text-slate-400">{bw.maidens || 0}</td>
                                    <td className="stat-val">{bw.runsConceded}</td>
                                    <td className="stat-val font-black text-slate-900">{bw.wickets}</td>
                                    <td className="stat-val !text-p-blue font-bold">{(bw.overs > 0 ? (bw.runsConceded / bw.overs).toFixed(2) : '0.00')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {fow && fow.length > 0 && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50/20">
                        <div className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-widest mb-3">Fall of Wickets</div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-[0.7rem]">
                            {fow.map((wf: any, i: number) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <span className="w-5 h-5 flex items-center justify-center bg-p-blue-bg text-p-blue rounded-full font-black text-[0.55rem]">{wf.wicketNum}</span>
                                    <span className="font-bold text-slate-700 whitespace-nowrap">{wf.score}/{wf.wicketNum}</span>
                                    <span className="text-slate-400 truncate">({wf.over.toFixed(1)} ov)</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="app-container">
            <header className="app-header shadow-none border-b border-white/10">
                <div className="flex items-center gap-3">
                    <ArrowLeft className="w-5 h-5 cursor-pointer text-white/80 hover:text-white" onClick={onRestart} />
                    <span className="header-title !text-white !uppercase tracking-widest">Match Report</span>
                </div>
                <div className="flex gap-4">
                    <Share2 className="w-5 h-5 cursor-pointer text-white/80 hover:text-white" />
                    <Download className="w-5 h-5 cursor-pointer text-white/80 hover:text-white" onClick={downloadPDF} />
                </div>
            </header>

            <main className="main-content !p-0" ref={summaryRef}>
                <div className="py-8 text-center border-b border-slate-100 bg-white">
                    <h2 className="text-p-blue font-black text-xl tracking-[0.3em] uppercase">Piyush Cricket</h2>
                    <p className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-widest mt-1">Official Match Report</p>
                </div>

                <div className="result-hero-p">
                    <div className="inline-block px-3 py-1 bg-saffron text-white rounded-full text-[0.6rem] font-black uppercase tracking-widest mb-4">
                        Match Concluded
                    </div>
                    <h1 className="text-white font-black text-3xl tracking-tight mb-8">
                        {getWinnerMessage()}
                    </h1>

                    <div className="flex items-center justify-center gap-10">
                        <div className="flex flex-col items-center">
                            <Target className="w-5 h-5 text-saffron mb-2" />
                            <span className="text-[0.6rem] font-bold text-white/50 uppercase tracking-widest">Target</span>
                            <span className="text-lg font-black text-white">{target}</span>
                        </div>
                        <div className="w-px h-10 bg-white/10"></div>
                        <div className="flex flex-col items-center">
                            <Clock className="w-5 h-5 text-saffron mb-2" />
                            <span className="text-[0.6rem] font-bold text-white/50 uppercase tracking-widest">Duration</span>
                            <span className="text-lg font-black text-white">{(oversA + oversB).toFixed(1)} Ov</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 sm:p-6 pb-24">
                    {manOfTheMatch && (
                        <div className="mom-card-premium !mb-10 p-6 !rounded-3xl flex items-center gap-8 text-white relative overflow-hidden">
                            <div className="absolute -right-6 -bottom-6 opacity-10 rotate-12">
                                <Trophy className="w-48 h-48" />
                            </div>
                            <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-xl border border-white/5 shadow-inner">
                                <Star className="w-9 h-9 text-saffron fill-saffron animate-pulse" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="label-mom mb-1">Man of the Match</h3>
                                <p className="text-2xl font-black tracking-tight">{manOfTheMatch.name}</p>
                                <div className="mt-2 inline-flex items-center gap-2 bg-saffron/20 border border-saffron/20 px-3 py-1 rounded-lg">
                                    <span className="text-[0.65rem] font-extrabold uppercase tracking-widest">{manOfTheMatch.reason}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-4 px-1">
                            <Users className="w-4 h-4 text-p-blue" />
                            <span className="text-[0.7rem] font-black text-p-blue uppercase tracking-widest">First Innings Summary</span>
                        </div>
                        <InningsSection
                            team={teamA}
                            runs={runsA}
                            wickets={wicketsA}
                            overs={oversA}
                            batsmen={firstInningsBatsmen}
                            bowlers={firstInningsBowlers}
                            fow={firstInningsFOW}
                            extras={firstInningsExtras}
                        />
                    </div>

                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-4 px-1">
                            <Users className="w-4 h-4 text-p-blue" />
                            <span className="text-[0.7rem] font-black text-p-blue uppercase tracking-widest">Second Innings Summary</span>
                        </div>
                        <InningsSection
                            team={teamB}
                            runs={runsB}
                            wickets={wicketsB}
                            overs={oversB}
                            batsmen={secondInningsBatsmen}
                            bowlers={secondInningsBowlers}
                            fow={secondInningsFOW}
                            extras={secondInningsExtras}
                        />
                    </div>

                    <div className="mt-16 text-center border-t border-slate-100 pt-12">
                        <div className="w-12 h-1 bg-p-blue mx-auto rounded-full mb-6"></div>
                        <p className="text-[0.7rem] font-black text-p-blue uppercase tracking-[0.6em] mb-2">Piyush Cricket</p>
                        <p className="text-[0.55rem] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                            Elite Cricket Match Analytics • International Standard Reporting<br />
                            © {new Date().getFullYear()} PIYUSH CRICKET
                        </p>
                    </div>
                </div>
            </main>

            <div className="p-6 bg-white border-t border-slate-100 sticky bottom-0 flex gap-4 backdrop-blur-md bg-white/90 z-[200]">
                <button
                    onClick={downloadPDF}
                    className="flex-1 flex items-center justify-center gap-3 font-black py-4 px-6 rounded-2xl border-2 border-p-blue text-p-blue hover:bg-p-blue-bg active:scale-95 transition-all text-[0.7rem] uppercase tracking-widest"
                >
                    <Download className="w-5 h-5" />
                    SHARE PDF
                </button>
                <button
                    onClick={onRestart}
                    className="flex-1 bg-p-blue text-white shadow-2xl shadow-p-blue/20 font-black py-4 px-6 rounded-2xl hover:bg-p-blue-light active:scale-95 transition-all text-[0.7rem] uppercase tracking-widest"
                >
                    NEW FIXTURE
                </button>
            </div>
        </div>
    );
};
