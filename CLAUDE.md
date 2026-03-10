# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A collection of self-contained browser games. Each game is a **single HTML file** with all CSS and JavaScript inline — no build tools, no dependencies, no bundler.

## Running Games

Open any `.html` file directly in a browser:
```bash
open dogrun.html
open tictactoe.html
```

## Architecture

Each game follows the same pattern:
- Single `<canvas>` element driven by `requestAnimationFrame`
- All graphics drawn with canvas 2D primitives (pixel-art style using filled rectangles)
- No external assets — fonts loaded from Google Fonts (`Press Start 2P`) with monospace fallback
- Game state managed in plain JS objects, no frameworks

### dogrun.html — Retro Endless Runner
- **Game loop**: `update()` → `render()` via `requestAnimationFrame`
- **State phases**: `idle` | `running` | `dead`
- **Rendering layers** (draw order): background sky gradient → parallax clouds → scrolling ground → dog → obstacles → particles → HUD → overlay screens
- **Collision**: AABB with 4px fairness margin
- **Persistence**: high score saved to `localStorage` under key `dogrun_max`
- **Level scaling**: speed starts at 4px/frame, increases by 1.2px per level (max level 10); level up every 200 points × current level

### tictactoe.html — Two-player Tic Tac Toe
- DOM-based (no canvas), pure HTML/CSS/JS

## Visual Conventions (dogrun)
- Background: `#1a1a2e` navy
- Ground: `#4a4a6a`
- Dog: `#222222` black
- HUD: `#00ff88` green, best score in `#ffcc00` yellow
- Obstacle colors: bed `#6a4a8a`, ball `#e05050`, bone `#d4c4a0`, bear `#f0f0f0`
