# Cosmic Pong

A futuristic table tennis game with 100 challenging levels. Control your paddle, outsmart the AI opponent, and navigate through unique tables with various obstacles. Unlock levels, achieve high scores, and become the ultimate Cosmic Pong champion.

## Screenshots

*(Here you can add screenshots of the game)*

**Main Menu:**
`[Screenshot of the main menu]`

**Level Select:**
`[Screenshot of the level select screen]`

**Gameplay:**
`[Screenshot of the game in action]`

## Features

-   **100 Unique Levels:** Each level introduces new challenges with different obstacle layouts.
-   **Dynamic Difficulty:** 5 levels of opponent AI difficulty and 5 levels of scene difficulty (affecting ball speed and bounce).
-   **Physics-Based Gameplay:** The ball's reflection angle changes based on where it hits your paddle, giving you precise control.
-   **Obstacles:** Navigate around static and moving obstacles that make each level a unique puzzle.
-   **Progressive Unlocking:** Unlock new levels by winning, progressing through a campaign tree.
-   **Scoring System:** At the end of the campaign, get a final rating based on your performance. Replay to get a better score!
-   **Mobile & Desktop Ready:** Play with touch controls on your phone or with a mouse on your PC.

## How to Play

### Controls
-   **Mobile:** Touch and drag horizontally in the control area at the bottom of the screen to move your paddle.
-   **Desktop:** Move your mouse horizontally to control the paddle.
-   **Serve:** Tap/Click the screen when it's your turn to serve the ball.

### Goal
The goal is to score points by making the ball pass your opponent's baseline.

### Scoring
-   A game is won by reaching 11 points.
-   You must win by a margin of at least 2 points.
-   The loser of a point serves the next ball.

## Build & Deployment

This project is built using [Vite](https://vitejs.dev/) for a fast development experience and an optimized production build.

### Prerequisites
-   [Node.js](https://nodejs.org/) (version 18.x or higher is recommended)
-   [npm](https://www.npmjs.com/) (or [yarn](https://yarnpkg.com/)/[pnpm](https://pnpm.io/))

### Local Development
1.  **Clone the repository** and navigate to the project directory.
2.  **Install dependencies** (only required the first time or when dependencies change):
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev -- --host
    ```
    Passing `--host` makes the dev server reachable from other devices on your network. By default Vite serves at `http://localhost:5173/` with hot module replacement enabled.

### Building for Production
1.  **Create an optimized production build:**
    ```bash
    npm run build
    ```
    This command generates static assets in the `publish/` directory.
2.  **Preview the production build locally (optional but recommended):**
    ```bash
    npm run preview -- --host
    ```
    This runs the compiled assets using Vite's preview server so you can confirm everything works before deploying.

### Deployment
You can deploy the contents of the `publish/` directory to any static web hosting service (e.g., GitHub Pages, Netlify, Vercel, AWS S3).

1.  Run `npm run build` to generate the latest assets.
2.  Upload the files inside `publish/` to your hosting provider following their instructions.
3.  In most cases you only need to serve the generated `index.html`, JavaScript, and CSS files—no additional server-side logic is required.


## Author

This game was created by **Hao Jing**.

Visit his website: [http://haoj.in](http://haoj.in)
