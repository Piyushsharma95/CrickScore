export type RunType = 0 | 1 | 2 | 3 | 4 | 6;
export type ExtraType = 'None' | 'Wide' | 'NoBall' | 'Bye' | 'LegBye';
export type WicketType = 'None' | 'Bowled' | 'Caught' | 'LBW' | 'RunOut' | 'Stumped' | 'HitWicket';
export type MatchStatus = 'SETUP' | 'IN_PROGRESS' | 'INNINGS_BREAK' | 'COMPLETED';

export interface Player {
    id: string;
    name: string;
}

export interface Batsman extends Player {
    runs: number;
    ballsFaced: number;
    fours: number;
    sixes: number;
    isStriker: boolean;
    out?: string; // Description of dismissal, e.g., "b. Bowler"
    isOut?: boolean;
}

export interface FOW {
    player: string;
    score: number;
    over: number;
    wicketNum: number;
}

export interface Bowler extends Player {
    overs: number; // e.g. 0.1, 0.2
    ballsBowled: number; // total legal balls
    runsConceded: number;
    wickets: number;
    maidens: number;
    wides: number;
    noBalls: number;
}

export interface BallEvent {
    runs: number;
    extras: number;
    extraType: ExtraType;
    isLegal: boolean;
    wicket: WicketType;
    bowlerId: string;
    batsmanId: string;
    fielderName?: string;
}

export interface MatchConfig {
    teamAName: string;
    teamBName: string;
    totalOvers: number;
    battingFirst: 'TeamA' | 'TeamB';
}

export interface MatchState {
    status: MatchStatus;
    config: MatchConfig;
    innings: 1 | 2;
    battingTeam: string;
    bowlingTeam: string;

    // Scoring
    totalRuns: number;
    wickets: number;
    overs: number;
    ballsInCurrentOver: number;
    targetRuns?: number; // For 2nd innings

    // Players
    currentBatsmen: Batsman[]; // Only the 2 on crease
    currentBowler: Bowler | null; // Can be null between overs

    // Rosters/Stats
    battingTeamPlayers: Batsman[]; // All players who have batted/are batting
    bowlingTeamBowlers: Bowler[]; // All bowlers used
    firstInningsBatsmen?: Batsman[];
    firstInningsBowlers?: Bowler[];
    firstInningsTotal?: number;
    firstInningsWickets?: number;
    firstInningsOvers?: number;
    firstInningsExtras?: { wides: number, noBalls: number, byes: number, legByes: number };
    firstInningsFOW?: FOW[];
    secondInningsFOW?: FOW[];

    history: BallEvent[];
    fow: FOW[];
    extras: {
        wides: number;
        noBalls: number;
        byes: number;
        legByes: number;
    };

    // UI State trigger
    isBowlerSelectionOpen: boolean;
    isBatterSelectionOpen: boolean; // For new batsman
    isFreeHit: boolean; // Next ball is a Free Hit (after No Ball)
    message?: string; // For alerts like "End of Innings"
    manOfTheMatch?: Player & { reason: string };
    pastStates?: any[];
    lastBowlerId: string | null;
}
