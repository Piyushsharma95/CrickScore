import { createClient } from '@supabase/supabase-js';

// Get these from your Supabase Project Settings > API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const saveMatch = async (matchData: any) => {
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
                score_a: matchData.innings === 1 ? matchData.totalRuns : 0, // Simplified
                score_b: matchData.innings === 2 ? matchData.totalRuns : 0,
                winner: matchData.manOfTheMatch?.name, // Simplified
                full_data: matchData
            }
        ]);

    if (error) console.error('Error saving match:', error);
    return { data, error };
};
