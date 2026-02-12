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

## Tech Stack

- React 19
- TypeScript
- Vite
- Vanilla CSS (with modern variables and responsive layouts)
- Lucide React (Icons)

## Getting Started

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Run the development server:
    ```bash
    npm run dev
    ```

3.  Build for production:
    ```bash
    npm run build
    ```

## Project Structure

- `src/components`: UI Components (ScoreHeader, BatsmanCard, BowlerCard, ControlPanel)
- `src/hooks`: Custom hooks (useMatchScoring) for game logic
- `src/types.ts`: TypeScript definitions for cricket entities
- `src/index.css`: Global styles and theming

## License

MIT
