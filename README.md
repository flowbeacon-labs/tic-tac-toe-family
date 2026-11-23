# Family Tic-Tac-Toe — Flowbeacon Arcade

A child-friendly, entirely original 2D Tic-Tac-Toe browser game. No external libraries or assets, no accounts and no server required.

## Play locally

Open `index.html` in a modern web browser (Chrome, Edge, Safari). Keep `index.html`, `style.css`, and `game.js` together in the same folder. The game also works without internet.

## Features

- Two named players sharing one device, or a single player against the computer (Easy / Medium / Hard).
- Big touch-friendly 3×3 board, accessible keyboard-activated buttons, clear turn indicators, winning-line highlights and celebration animation.
- Choose Best of 3, 5, 7, 9, custom **odd** Best of N (1–99), or Unlimited.
- A *series* ends when one player wins more than half the chosen number of **decisive** rounds. Draws do not consume a decisive game; they are tracked separately.
- X and O are attached to players by name, so swapping the symbols does not change who earned points. Optional automatic swap between rounds; manual swap before any moves in the new round.
- Winning score, drawn rounds, round history (latest 40 shown), and browser-local save/resume.
- The Easy computer makes intentionally imperfect moves; Medium often defends; Hard uses minimax.
- The Reset scores button resets the current match only. Starting a new match also replaces current locally saved scores.

## GitHub Pages

1. Create a public repository such as `flowbeacon-labs/tic-tac-toe-family`.
2. Upload all three files (`index.html`, `game.js`, `style.css`) to the repository root, plus this README.
3. Go to repository **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, select `main` and `/ (root)`, then **Save**.
4. When GitHub Pages finishes building, your site is at `https://flowbeacon-labs.github.io/tic-tac-toe-family/`.
5. The game can be added as a separate card to the Flowbeacon Arcade launcher.

## Privacy / persistence

All scores and names are saved only in that browser via `localStorage`. They are not synchronized to other devices and can disappear if browser storage is cleared. No analytics or network requests.

## Keyboard

Tab to choose a square, Enter or Space to mark it. Both people use the same screen. Mobile users can simply tap a square.