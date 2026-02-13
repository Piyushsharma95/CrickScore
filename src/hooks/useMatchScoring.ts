import { useReducer, useEffect } from 'react';
import type { MatchState, Bowler, Batsman, MatchStatus, ExtraType, WicketType } from '../types';

const INITIAL_STATE: MatchState = {
    status: 'SETUP',
    config: {
        teamAName: '',
        teamBName: '',
        totalOvers: 0,
        battingFirst: 'TeamA',
    },
    innings: 1,
    battingTeam: '',
    bowlingTeam: '',
    totalRuns: 0,
    wickets: 0,
    overs: 0,
    ballsInCurrentOver: 0,
    currentBatsmen: [],
    currentBowler: null,
    battingTeamPlayers: [],
    bowlingTeamBowlers: [],
    history: [],
    fow: [],
    extras: {
        wides: 0,
        noBalls: 0,
        byes: 0,
        legByes: 0,
    },
    isBowlerSelectionOpen: false,
    isBatterSelectionOpen: false,
    isFreeHit: false,
    pastStates: [],
    lastBowlerId: null
};

type Action =
    | { type: 'START_MATCH'; payload: { teamA: string; teamB: string; overs: number; battingFirst: 'TeamA' | 'TeamB' } }
    | { type: 'SET_OPENING_PLAYERS'; payload: { striker: string; nonStriker: string; bowler: string } }
    | { type: 'BOWL_BALL'; payload: { runs: number; extraType: ExtraType; wicketType: WicketType; fielderName?: string } }
    | { type: 'SELECT_NEXT_BOWLER'; payload: { bowlerName: string; isNew: boolean; existingId?: string } }
    | { type: 'SELECT_NEXT_BATSMAN'; payload: { name: string } }
    | { type: 'NEXT_INNINGS' }
    | { type: 'RESTART' }
    | { type: 'UNDO' }
    | { type: 'UPDATE_BATSMAN_NAME'; payload: { id: string; name: string } }
    | { type: 'UPDATE_BOWLER_NAME'; payload: { name: string } }
    | { type: 'RETIRE_BATSMAN' }
    | { type: 'SWAP_BATSMEN' };

function calculateManOfTheMatch(batsmen: Batsman[], bowlers: Bowler[]): { id: string, name: string, reason: string } {
    let bestPlayer: Batsman | Bowler | null = null;
    let maxPoints = -1;
    let reason = '';

    for (const p of batsmen) {
        // Runs are base points
        let pts = p.runs;
        // Boundaries are bonus
        pts += (p.fours * 1) + (p.sixes * 2);
        // Milestones
        if (p.runs >= 30) pts += 10;
        if (p.runs >= 50) pts += 25;
        if (p.runs >= 100) pts += 50;
        // Strike rate bonus (min 10 balls)
        if (p.ballsFaced >= 10) {
            const sr = (p.runs / p.ballsFaced) * 100;
            if (sr > 150) pts += 15;
            if (sr > 200) pts += 25;
        }

        if (pts > maxPoints) {
            maxPoints = pts;
            bestPlayer = p;
            reason = `${p.runs} Runs (${p.ballsFaced} balls)`;
        }
    }

    for (const p of bowlers) {
        // Wickets are worth 25 runs equivalent
        let pts = p.wickets * 25;
        // Milestones
        if (p.wickets >= 3) pts += 30;
        if (p.wickets >= 5) pts += 60;
        // Economy bonus
        const eco = p.overs > 0 ? p.runsConceded / p.overs : 0;
        if (p.overs >= 2) {
            if (eco < 5) pts += 25;
            else if (eco < 7) pts += 15;
        }

        if (pts > maxPoints) {
            maxPoints = pts;
            bestPlayer = p;
            reason = `${p.wickets} Wickets (${p.runsConceded} runs)`;
        }
    }

    if (!bestPlayer) {
        return { id: '0', name: 'N/A', reason: 'N/A' };
    }

    return { id: bestPlayer.id, name: bestPlayer.name, reason };
}

function matchReducer(state: MatchState, action: Action): MatchState {
    const saveHistory = (newState: MatchState): MatchState => {
        const { pastStates, ...currentStateWithoutHistory } = state;
        const updatedPast = [currentStateWithoutHistory, ...(pastStates || [])].slice(0, 10);
        return { ...newState, pastStates: updatedPast };
    };

    switch (action.type) {
        case 'START_MATCH': {
            const { teamA, teamB, overs, battingFirst } = action.payload;
            return {
                ...INITIAL_STATE,
                status: 'SETUP',
                config: {
                    teamAName: teamA,
                    teamBName: teamB,
                    totalOvers: overs,
                    battingFirst,
                },
                battingTeam: battingFirst === 'TeamA' ? teamA : teamB,
                bowlingTeam: battingFirst === 'TeamA' ? teamB : teamA,
                isBatterSelectionOpen: true,
            };
        }
        case 'RESTART':
            return INITIAL_STATE;
        case 'UNDO': {
            if (!state.pastStates || state.pastStates.length === 0) return state;
            const [previous, ...remaining] = state.pastStates;
            return { ...previous, pastStates: remaining };
        }

        case 'NEXT_INNINGS': {
            const newState = {
                ...state,
                innings: 2,
                status: 'SETUP' as MatchStatus,
                targetRuns: state.totalRuns + 1,
                firstInningsBatsmen: state.battingTeamPlayers,
                firstInningsBowlers: state.bowlingTeamBowlers,
                firstInningsTotal: state.totalRuns,
                firstInningsWickets: state.wickets,
                firstInningsOvers: state.overs,
                firstInningsExtras: { ...state.extras },
                firstInningsFOW: state.fow,
                totalRuns: 0,
                wickets: 0,
                overs: 0,
                ballsInCurrentOver: 0,
                currentBatsmen: [],
                currentBowler: null,
                battingTeamPlayers: [],
                bowlingTeamBowlers: [],
                history: [],
                fow: [],
                extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0 },
                battingTeam: state.bowlingTeam,
                bowlingTeam: state.battingTeam,
                isBatterSelectionOpen: true,
                isBowlerSelectionOpen: false,
            };
            return saveHistory(newState as MatchState);
        }
        case 'SET_OPENING_PLAYERS': {
            const { striker, nonStriker, bowler } = action.payload;
            const b1: Batsman = { id: `b-${Date.now()}-1`, name: striker, runs: 0, ballsFaced: 0, fours: 0, sixes: 0, isStriker: true, isOut: false, out: undefined };
            const b2: Batsman = { id: `b-${Date.now()}-2`, name: nonStriker, runs: 0, ballsFaced: 0, fours: 0, sixes: 0, isStriker: false, isOut: false, out: undefined };
            const bw: Bowler = { id: `bw-${Date.now()}`, name: bowler, overs: 0, ballsBowled: 0, runsConceded: 0, wickets: 0, maidens: 0, wides: 0, noBalls: 0 };

            return {
                ...state,
                status: 'IN_PROGRESS',
                currentBatsmen: [b1, b2],
                battingTeamPlayers: [b1, b2],
                currentBowler: bw,
                bowlingTeamBowlers: [bw],
                isBatterSelectionOpen: false,
                isBowlerSelectionOpen: false,
                lastBowlerId: null
            };
        }
        case 'BOWL_BALL': {
            if (state.status !== 'IN_PROGRESS' || !state.currentBowler) return state;

            const { runs, extraType, wicketType, fielderName } = action.payload;
            const batsmen = state.currentBatsmen.map(b => ({ ...b }));
            const striker = batsmen.find(b => b.isStriker);
            if (!striker) return state;

            let isLegal = true;
            let totalRunsForBall = runs;
            let extrasForBall = 0;
            let ballCounted = 1;

            if (extraType === 'Wide') {
                isLegal = false;
                extrasForBall = 1 + runs;
                totalRunsForBall = extrasForBall;
                ballCounted = 0;
            } else if (extraType === 'NoBall') {
                isLegal = false;
                extrasForBall = 1;
                totalRunsForBall = runs + 1;
                ballCounted = 0;
            } else if (extraType === 'Bye' || extraType === 'LegBye') {
                extrasForBall = runs;
                totalRunsForBall = runs;
            }

            // Update Batsman
            if (extraType !== 'Wide') {
                striker.ballsFaced += 1;
                if (extraType === 'None' || extraType === 'NoBall') {
                    striker.runs += runs;
                    if (runs === 4) striker.fours += 1;
                    if (runs === 6) striker.sixes += 1;
                }
            }

            // Update Bowler Official Rules
            const currentBowler = { ...state.currentBowler };
            if (isLegal) currentBowler.ballsBowled += 1;

            // Bowler only concedes bat runs + wides + noballs. 
            // Byes and Leg Byes are NOT charged to the bowler.
            if (extraType !== 'Bye' && extraType !== 'LegBye') {
                currentBowler.runsConceded += totalRunsForBall;
            }

            // Wicket Credit: Bowler gets credit for Bowled, Caught, LBW, Stumped, Hit Wicket.
            // Bowler does NOT get credit for Run Out.
            // On a No-Ball, only a Run Out is possible (simplified for this app).
            if (wicketType !== 'None') {
                const isBowlerWicket = ['Bowled', 'Caught', 'LBW', 'Stumped', 'HitWicket'].includes(wicketType);
                if (state.isFreeHit || extraType === 'NoBall') {
                    if (wicketType !== 'RunOut') {
                        // Only Run Out allowed on Free Hit or No-Ball
                        action.payload.wicketType = 'None';
                    }
                } else if (extraType === 'Wide') {
                    if (wicketType === 'Stumped' || wicketType === 'RunOut' || wicketType === 'HitWicket') {
                        if (wicketType !== 'RunOut') currentBowler.wickets += 1;
                    } else {
                        action.payload.wicketType = 'None';
                    }
                } else if (isBowlerWicket) {
                    currentBowler.wickets += 1;
                }
            }

            if (extraType === 'Wide') currentBowler.wides += 1;
            if (extraType === 'NoBall') currentBowler.noBalls += 1;

            currentBowler.overs = Math.floor(currentBowler.ballsBowled / 6) + (currentBowler.ballsBowled % 6) / 10;

            // Update State
            const finalWicketType = action.payload.wicketType;
            const newWickets = state.wickets + (finalWicketType !== 'None' ? 1 : 0);
            const newTotalRuns = state.totalRuns + totalRunsForBall;
            let newBallsInOver = state.ballsInCurrentOver + ballCounted;
            let newOvers = state.overs;
            let isOverComplete = false;

            if (newBallsInOver >= 6) {
                newOvers += 1;
                newBallsInOver = 0;
                isOverComplete = true;
            }

            // Rotate Strike
            let shouldRotate = (runs % 2 !== 0);
            if (isOverComplete) shouldRotate = !shouldRotate;
            if (shouldRotate) {
                batsmen.forEach(b => b.isStriker = !b.isStriker);
            }

            // Check Innings End
            let nextStatus: MatchStatus = state.status;
            if (state.innings === 2 && state.targetRuns && newTotalRuns >= state.targetRuns) {
                nextStatus = 'COMPLETED';
            } else if (newWickets >= 10 || (newOvers >= state.config.totalOvers && isOverComplete)) {
                nextStatus = state.innings === 1 ? 'INNINGS_BREAK' : 'COMPLETED';
            }

            // Handle Wicket marking for batsman
            const newFow = [...state.fow];
            if (finalWicketType !== 'None') {
                // For Run Out, usually the one who gets out can be either striker or non-striker.
                // For simplicity, we assume the ball was faced by striker, but we should mark which one got out.
                // In most other cases, it's the striker who is out.
                const outBatsman = batsmen.find(b => b.isStriker);
                if (outBatsman) {
                    outBatsman.isOut = true;
                    if (finalWicketType === 'Bowled') outBatsman.out = `b ${currentBowler.name}`;
                    else if (finalWicketType === 'Caught') outBatsman.out = `c ${fielderName || '?'} b ${currentBowler.name}`;
                    else if (finalWicketType === 'LBW') outBatsman.out = `lbw b ${currentBowler.name}`;
                    else if (finalWicketType === 'RunOut') outBatsman.out = `run out`;
                    else if (finalWicketType === 'Stumped') outBatsman.out = `st ${fielderName || '?'} b ${currentBowler.name}`;
                    else if (finalWicketType === 'HitWicket') outBatsman.out = `hit wicket`;
                    else outBatsman.out = finalWicketType;

                    newFow.push({
                        player: outBatsman.name,
                        score: newTotalRuns,
                        over: newOvers + (newBallsInOver / 10),
                        wicketNum: newWickets
                    });
                }
            }

            const historyEntry = {
                runs: (extraType === 'None' || extraType === 'NoBall') ? runs : 0,
                extras: extrasForBall,
                extraType,
                wicket: finalWicketType,
                isLegal,
                bowlerId: currentBowler.id,
                batsmanId: striker.id,
                fielderName
            };

            const newState: MatchState = {
                ...state,
                status: nextStatus,
                totalRuns: newTotalRuns,
                wickets: newWickets,
                overs: newOvers,
                ballsInCurrentOver: newBallsInOver,
                currentBatsmen: finalWicketType !== 'None' ? batsmen.filter(b => !b.isOut) : batsmen,
                currentBowler,
                battingTeamPlayers: state.battingTeamPlayers.map(p => {
                    const updated = batsmen.find(b => b.id === p.id);
                    return updated ? updated : p;
                }),
                bowlingTeamBowlers: state.bowlingTeamBowlers.map(b => b.id === currentBowler.id ? currentBowler : b),
                extras: {
                    wides: state.extras.wides + (extraType === 'Wide' ? extrasForBall : 0),
                    noBalls: state.extras.noBalls + (extraType === 'NoBall' ? 1 : 0),
                    byes: state.extras.byes + (extraType === 'Bye' ? extrasForBall : 0),
                    legByes: state.extras.legByes + (extraType === 'LegBye' ? extrasForBall : 0),
                },
                history: [...state.history, historyEntry],
                fow: newFow,
                isBowlerSelectionOpen: isOverComplete && nextStatus === 'IN_PROGRESS',
                isBatterSelectionOpen: finalWicketType !== 'None' && newWickets < 10 && nextStatus === 'IN_PROGRESS',
                isFreeHit: extraType === 'NoBall' || (state.isFreeHit && !isLegal),
                lastBowlerId: isOverComplete ? currentBowler.id : state.lastBowlerId
            };

            if (nextStatus === 'COMPLETED') {
                // Determine winner to select MOM from winning side
                const isSecondInningsWinner = newState.targetRuns && newState.totalRuns >= newState.targetRuns;
                let winningBatsmen: Batsman[] = [];
                let winningBowlers: Bowler[] = [];

                if (isSecondInningsWinner) {
                    // Team B won
                    winningBatsmen = newState.battingTeamPlayers;
                    winningBowlers = newState.firstInningsBowlers || [];
                } else {
                    // Team A won
                    winningBatsmen = newState.firstInningsBatsmen || [];
                    winningBowlers = newState.bowlingTeamBowlers;
                }

                newState.manOfTheMatch = calculateManOfTheMatch(winningBatsmen, winningBowlers);
            }

            return saveHistory(newState);
        }
        case 'SELECT_NEXT_BOWLER': {
            const { bowlerName, isNew, existingId } = action.payload;
            let nextBowler: Bowler;
            if (isNew) {
                nextBowler = { id: `bw-${Date.now()}`, name: bowlerName, overs: 0, ballsBowled: 0, runsConceded: 0, wickets: 0, maidens: 0, wides: 0, noBalls: 0 };
                const newState = {
                    ...state,
                    currentBowler: nextBowler,
                    bowlingTeamBowlers: [...state.bowlingTeamBowlers, nextBowler],
                    isBowlerSelectionOpen: false
                };
                return saveHistory(newState);
            } else {
                const existing = state.bowlingTeamBowlers.find(b => b.id === existingId);
                if (!existing) return state;
                const newState = { ...state, currentBowler: existing, isBowlerSelectionOpen: false };
                return saveHistory(newState);
            }
        }
        case 'SELECT_NEXT_BATSMAN': {
            const newBatsman: Batsman = { id: `b-${Date.now()}`, name: action.payload.name, runs: 0, ballsFaced: 0, fours: 0, sixes: 0, isStriker: true, isOut: false, out: undefined };
            // The existing batsman (who was non-striker) stays, new batsman becomes striker
            const updatedBatsmen = state.currentBatsmen.map(b => ({ ...b, isStriker: false }));
            updatedBatsmen.push(newBatsman);

            const newState = {
                ...state,
                currentBatsmen: updatedBatsmen,
                battingTeamPlayers: [...state.battingTeamPlayers, newBatsman],
                isBatterSelectionOpen: false
            };
            return saveHistory(newState);
        }
        case 'UPDATE_BATSMAN_NAME': {
            const newState = {
                ...state,
                currentBatsmen: state.currentBatsmen.map(b => b.id === action.payload.id ? { ...b, name: action.payload.name } : b),
                battingTeamPlayers: state.battingTeamPlayers.map(b => b.id === action.payload.id ? { ...b, name: action.payload.name } : b),
            };
            return saveHistory(newState);
        }
        case 'UPDATE_BOWLER_NAME': {
            if (!state.currentBowler) return state;
            const updated = { ...state.currentBowler, name: action.payload.name };
            const newState = {
                ...state,
                currentBowler: updated,
                bowlingTeamBowlers: state.bowlingTeamBowlers.map(b => b.id === updated.id ? updated : b)
            };
            return saveHistory(newState);
        }
        case 'RETIRE_BATSMAN': {
            const striker = state.currentBatsmen.find(b => b.isStriker);
            if (!striker || state.status !== 'IN_PROGRESS') return state;

            const updatedBatsmen = state.currentBatsmen.map(b =>
                b.id === striker.id ? { ...b, isOut: true, out: 'retired' } : b
            );

            const newState = {
                ...state,
                currentBatsmen: updatedBatsmen.filter(b => !b.isOut),
                battingTeamPlayers: state.battingTeamPlayers.map(p => {
                    const updated = updatedBatsmen.find(b => b.id === p.id);
                    return updated ? updated : p;
                }),
                isBatterSelectionOpen: true
            };
            return saveHistory(newState);
        }
        case 'SWAP_BATSMEN': {
            const newState = {
                ...state,
                currentBatsmen: state.currentBatsmen.map(b => ({ ...b, isStriker: !b.isStriker }))
            };
            return saveHistory(newState);
        }
        default:
            return state;
    }
}

export function useMatchScoring() {
    const [matchState, dispatch] = useReducer(matchReducer, INITIAL_STATE, (initial) => {
        const saved = localStorage.getItem('cricket_match_state');
        return saved ? JSON.parse(saved) : initial;
    });

    useEffect(() => {
        localStorage.setItem('cricket_match_state', JSON.stringify(matchState));
    }, [matchState]);

    return {
        matchState,
        startMatch: (teamA: string, teamB: string, overs: number, battingFirst: 'TeamA' | 'TeamB') => dispatch({ type: 'START_MATCH', payload: { teamA, teamB, overs, battingFirst } }),
        setOpeningPlayers: (striker: string, nonStriker: string, bowler: string) => dispatch({ type: 'SET_OPENING_PLAYERS', payload: { striker, nonStriker, bowler } }),
        bowlBall: (runs: number, extraType: ExtraType, wicketType: WicketType, fielderName?: string) => dispatch({ type: 'BOWL_BALL', payload: { runs, extraType, wicketType, fielderName } }),
        selectNextBowler: (name: string, isNew: boolean, id?: string) => dispatch({ type: 'SELECT_NEXT_BOWLER', payload: { bowlerName: name, isNew, existingId: id } }),
        selectNextBatsman: (name: string) => dispatch({ type: 'SELECT_NEXT_BATSMAN', payload: { name } }),
        nextInnings: () => dispatch({ type: 'NEXT_INNINGS' }),
        restart: () => {
            localStorage.removeItem('cricket_match_state');
            dispatch({ type: 'RESTART' });
        },
        undo: () => dispatch({ type: 'UNDO' }),
        updateBatsmanName: (id: string, name: string) => dispatch({ type: 'UPDATE_BATSMAN_NAME', payload: { id, name } }),
        updateBowlerName: (name: string) => dispatch({ type: 'UPDATE_BOWLER_NAME', payload: { name } }),
        retireBatsman: () => dispatch({ type: 'RETIRE_BATSMAN' }),
        swapBatsmen: () => dispatch({ type: 'SWAP_BATSMEN' })
    };
}
