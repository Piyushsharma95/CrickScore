# Cricket Live Score App 🏏

A modern, responsive web application for ball-by-ball cricket scoring.

## Features

- **Ball-by-Ball Scoring**: Track runs, extras, and wickets accurately.
- **Official Rules**: Handles Wides, No Balls, Byes, Leg Byes according to standard cricket rules.
- **Batsman tracking**: Individual scores, balls faced, 4s, 6s, and Strike Rate.
- **Bowler tracking**: Overs, maidens (logic in progress), runs conceded, wickets, and Economy Rate.
- **Live Scoreboard**: Real-time updates of team score, run rate, and current over.
- **Undo Functionality**: Correct mistakes easily.
- **Responsive Design**: Works on mobile and desktop with a premium dark theme.
- **Live Broadcast (New!)**: Push scores to a remote database in real-time.

## Tech Stack

- React 19
- TypeScript
- Vite
- Supabase (Backend/Database)
- Vanilla CSS (with modern variables and responsive layouts)
- Lucide React (Icons)

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd CrickScore
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Supabase Setup:**
    - Create a new project on [Supabase.com](https://supabase.com/).
    - Go to the SQL Editor and run the following query to create the `matches` table:

    ```sql
    create table matches (
      id uuid default uuid_generate_v4() primary key,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null,
      team_a text,
      team_b text,
      score_a integer,
      score_b integer,
      winner text,
      status text default 'LIVE',
      full_data jsonb
    );
    ```

    - In your project root, create a `.env` file:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Build for production:**
    ```bash
    npm run build
    ```

## Project Structure

- `src/components`: UI Components (ScoreHeader, BatsmanCard, BowlerCard, ControlPanel)
- `src/hooks`: Custom hooks (useMatchScoring) for game logic
- `src/types.ts`: TypeScript definitions for cricket entities
- `src/index.css`: Global styles and theming
- `src/supabase.ts`: Supabase client and API functions

## License

MIT
