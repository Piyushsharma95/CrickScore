import { useState } from 'react';
import { useMatchScoring } from './hooks/useMatchScoring';
import { ScoreHeader } from './components/ScoreHeader';
import { BatsmanCard } from './components/BatsmanCard';
import { BowlerCard } from './components/BowlerCard';
import { ControlPanel } from './components/ControlPanel';
import { MatchSetup } from './components/MatchSetup';
import { PlayerSelectionModal } from './components/PlayerSelectionModal';
import { BowlerSelectionModal } from './components/BowlerSelectionModal';
import { BatsmanSelectionModal } from './components/BatsmanSelectionModal';
import { MatchSummary } from './components/MatchSummary';
import { FullScorecardModal } from './components/FullScorecardModal';
import { ArrowLeft, TrendingUp, FileText } from 'lucide-react';
import type { ExtraType, WicketType, Batsman } from './types';

function App() {
  const {
    matchState,
    startMatch,
    setOpeningPlayers,
    bowlBall,
    undo,
    selectNextBowler,
    selectNextBatsman,
    nextInnings,
    restart,
    retireBatsman,
    swapBatsmen
  } = useMatchScoring();

  const [isFullScorecardOpen, setIsFullScorecardOpen] = useState(false);


  const handleBowl = (runs: number, extraType: ExtraType, wicketType: WicketType, fielderName?: string) => {
    bowlBall(runs, extraType, wicketType, fielderName);
  };

  if (matchState.status === 'SETUP' && matchState.currentBatsmen.length === 0) {
    if (!matchState.config.teamAName) {
      return <MatchSetup onStart={startMatch} />;
    }
    return (
      <PlayerSelectionModal
        title={`${matchState.innings === 1 ? 'First' : 'Second'} Innings Openers`}
        isOpen={true}
        onSave={setOpeningPlayers}
      />
    );
  }

  if (matchState.status === 'INNINGS_BREAK') {
    return (
      <div className="app-container">
        <header className="app-header">
          <div className="flex items-center gap-3">
            <div className="flex flex-col w-5 h-3.5 overflow-hidden rounded-sm border border-white/20 shadow-sm mr-0.5">
              <div className="flex-1 bg-india-saffron"></div>
              <div className="flex-1 bg-white relative flex items-center justify-center">
                <div className="w-[3px] h-[3px] rounded-full border-[0.5px] border-india-blue bg-white"></div>
              </div>
              <div className="flex-1 bg-india-green"></div>
            </div>
            <span className="header-title uppercase tracking-widest leading-none">Innings Break</span>
          </div>
        </header>
        <main className="main-content flex flex-col items-center justify-center p-8 text-center bg-white">
          <div className="w-24 h-24 bg-p-blue-bg flex items-center justify-center rounded-3xl mb-8 shadow-inner">
            <TrendingUp className="w-12 h-12 text-p-blue" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Innining Complete</h2>
          <p className="text-slate-500 mb-10 text-sm font-medium uppercase tracking-widest">
            Target to win: <span className="font-black text-p-blue text-lg">{(matchState.targetRuns || matchState.totalRuns + 1)}</span> runs
          </p>
          <button onClick={nextInnings} className="btn-p w-full !py-5 shadow-2xl shadow-p-blue/20 text-md">
            START SECOND INNINGS
          </button>
        </main>
      </div>
    );
  }

  if (matchState.status === 'COMPLETED') {
    const battedFirst = matchState.config.battingFirst === 'TeamA' ? matchState.config.teamAName : matchState.config.teamBName;
    const battedSecond = matchState.config.battingFirst === 'TeamA' ? matchState.config.teamBName : matchState.config.teamAName;

    return (
      <MatchSummary
        teamA={battedFirst}
        teamB={battedSecond}
        runsA={matchState.firstInningsTotal || 0}
        wicketsA={matchState.firstInningsWickets || 0}
        oversA={matchState.firstInningsOvers || 0}
        runsB={matchState.totalRuns}
        wicketsB={matchState.wickets}
        oversB={matchState.overs}
        target={matchState.targetRuns || 0}
        firstInningsBatsmen={matchState.firstInningsBatsmen || []}
        firstInningsBowlers={matchState.firstInningsBowlers || []}
        secondInningsBatsmen={matchState.battingTeamPlayers}
        secondInningsBowlers={matchState.bowlingTeamBowlers}
        firstInningsFOW={matchState.firstInningsFOW || []}
        secondInningsFOW={matchState.fow || []}
        firstInningsExtras={matchState.firstInningsExtras}
        secondInningsExtras={matchState.extras}
        manOfTheMatch={matchState.manOfTheMatch}
        onRestart={restart}
      />
    );
  }

  return (
    <div className="app-container">
      <header className="app-header shadow-none">
        <div className="flex items-center gap-4">
          <ArrowLeft className="w-6 h-6 cursor-pointer opacity-80 hover:opacity-100" onClick={restart} />
          <div className="flex items-center gap-2">
            <div className="flex flex-col w-5 h-3.5 overflow-hidden rounded-sm border border-white/20 shadow-sm mr-0.5">
              <div className="flex-1 bg-india-saffron"></div>
              <div className="flex-1 bg-white relative flex items-center justify-center">
                <div className="w-[3px] h-[3px] rounded-full border-[0.5px] border-india-blue bg-white"></div>
              </div>
              <div className="flex-1 bg-india-green"></div>
            </div>
            <span className="header-title uppercase tracking-widest leading-none">
              {matchState.battingTeam} v/s {matchState.bowlingTeam}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsFullScorecardOpen(true)}
            className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"
            title="View Full Scorecard"
          >
            <FileText className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-saffron rounded-full animate-pulse"></div>
            <span className="text-[0.6rem] font-black text-white uppercase tracking-widest">Live</span>
          </div>
        </div>
      </header>

      <main className="main-content !p-0">
        <div className="p-4">
          <ScoreHeader
            battingTeam={matchState.battingTeam}
            inningsLabel={`${matchState.innings === 1 ? '1st' : '2nd'} inning`}
            totalRuns={matchState.totalRuns}
            wickets={matchState.wickets}
            overs={matchState.overs}
            ballsInOver={matchState.ballsInCurrentOver}
            isFreeHit={matchState.isFreeHit}
          />

          <div className="card-premium !p-0 overflow-hidden">
            <table className="modern-table">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-[0.6rem] sm:text-[0.65rem]" style={{ width: '40%' }}>Batsman</th>
                  <th className="text-right text-[0.6rem] sm:text-[0.65rem]">R</th>
                  <th className="text-right text-[0.6rem] sm:text-[0.65rem]">B</th>
                  <th className="text-right text-[0.6rem] sm:text-[0.65rem]">4s</th>
                  <th className="text-right text-[0.6rem] sm:text-[0.65rem]">6s</th>
                  <th className="text-right text-[0.6rem] sm:text-[0.65rem]">SR</th>
                </tr>
              </thead>
              <tbody>
                {matchState.currentBatsmen.map((b: Batsman) => (
                  <BatsmanCard key={b.id} batsman={b} isStriker={b.isStriker} />
                ))}
              </tbody>
            </table>
          </div>

          <div className="card-premium !p-0 overflow-hidden mt-2">
            <table className="modern-table">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-[0.6rem] sm:text-[0.65rem]" style={{ width: '40%' }}>Bowler</th>
                  <th className="text-right text-[0.6rem] sm:text-[0.65rem]">O</th>
                  <th className="text-right text-[0.6rem] sm:text-[0.65rem]">M</th>
                  <th className="text-right text-[0.6rem] sm:text-[0.65rem]">R</th>
                  <th className="text-right text-[0.6rem] sm:text-[0.65rem]">W</th>
                  <th className="text-right text-[0.6rem] sm:text-[0.65rem]">ER</th>
                </tr>
              </thead>
              <tbody>
                {matchState.currentBowler && <BowlerCard bowler={matchState.currentBowler} />}
              </tbody>
            </table>
          </div>
        </div>

        <ControlPanel
          onBowl={handleBowl}
          onUndo={undo}
          onRetire={retireBatsman}
          onSwap={swapBatsmen}
          recentBalls={matchState.history.filter((_, idx: number) => {
            const previousLegalBalls = matchState.history.slice(0, idx).filter(h => h.isLegal).length;
            return previousLegalBalls >= matchState.overs * 6;
          })}
        />
      </main>

      <BowlerSelectionModal
        isOpen={matchState.isBowlerSelectionOpen}
        bowlers={matchState.bowlingTeamBowlers}
        lastBowlerId={matchState.lastBowlerId}
        onSelect={selectNextBowler}
      />

      <BatsmanSelectionModal
        isOpen={matchState.isBatterSelectionOpen}
        onSelect={selectNextBatsman}
      />

      <FullScorecardModal
        isOpen={isFullScorecardOpen}
        onClose={() => setIsFullScorecardOpen(false)}
        battingTeam={matchState.battingTeam}
        batsmen={matchState.battingTeamPlayers}
        bowlers={matchState.bowlingTeamBowlers}
        totalRuns={matchState.totalRuns}
        wickets={matchState.wickets}
        overs={matchState.overs}
        ballsInOver={matchState.ballsInCurrentOver}
      />
    </div>
  );
}

export default App;
