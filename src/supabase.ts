import { createClient } from '@supabase/supabase-js';

// Get these from your Supabase Project Settings > API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const createLiveMatch = async (teamA: string, teamB: string, overs: number) => {
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase keys missing. Live mode disabled.');
        return null;
    }

    const { data, error } = await supabase
        .from('matches')
        .insert([
            {
                team_a: teamA,
                team_b: teamB,
                score_a: 0,
                score_b: 0,
                status: 'LIVE',
                full_data: { config: { teamAName: teamA, teamBName: teamB, totalOvers: overs } }
            }
        ])
        .select()
        .single();

    if (error) {
        console.error('Error creating live match:', error);
        return null;
    }
    return data?.id;
};

export const updateMatch = async (matchId: string, matchData: any) => {
    if (!supabaseUrl || !supabaseAnonKey || !matchId) return;

    const { error } = await supabase
        .from('matches')
        .update({
            score_a: matchData.innings === 1 ? matchData.totalRuns : matchData.firstInningsTotal,
            score_b: matchData.innings === 2 ? matchData.totalRuns : 0,
            status: matchData.status === 'COMPLETED' ? 'COMPLETED' : 'LIVE',
            winner: matchData.manOfTheMatch?.name,
            full_data: matchData
        })
        .eq('id', matchId);

    if (error) console.error('Error updating match:', error);
};

export const saveMatch = async (matchData: any) => {
    // If it was a live match, we just do a final update to ensure status is COMPLETED
    if (matchData.isLive && matchData.matchId) {
        return updateMatch(matchData.matchId, matchData);
    }

    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase keys missing. Saving to localStorage instead.');
        const history = JSON.parse(localStorage.getItem('match_history') || '[]');
        history.push({ ...matchData, created_at: new Date().toISOString() });
        localStorage.setItem('match_history', JSON.stringify(history));
        return;
    }

    const { data, error } = await supabase
        .from('matches')
        .insert([
            {
                team_a: matchData.config.teamAName,
                team_b: matchData.config.teamBName,
                score_a: matchData.innings === 1 ? matchData.totalRuns : matchData.firstInningsTotal,
                score_b: matchData.innings === 2 ? matchData.totalRuns : 0,
                winner: matchData.manOfTheMatch?.name,
                status: 'COMPLETED',
                full_data: matchData
            }
        ]);

    if (error) console.error('Error saving match:', error);
    return { data, error };
};
