# OPNET – Join Dots

A neon cyberpunk reimagining of the classic Connect Four formula.

**Theme:** A strategic duel between instinct (Cat – Human) and calculation (Dog – AI Claude). \
**Board Size:** 6 rows × 7 columns\
**Objective:** Connect four pieces in a row (horizontal, vertical, or diagonal).

---

# 1. Core Game Overview

## Players

- 🐱 Cat (Human Player)
- 🐶 Dog (AI powered by Claude)

## Core Rules

- Players alternate turns.
- A piece is dropped into one of 7 columns.
- The piece falls to the lowest available space.
- First player to connect four pieces wins.
- If the board fills with no winner → Draw.

## Visual Feedback

- Smooth drop animation with slight bounce.
- Last move highlighted with a glowing ring.
- Winning four pieces pulse with neon glow animation.
- Board subtly dims during win state.

---

# 2. Core Gameplay Loop

1. Player selects difficulty.
2. Board loads with animated neon background.
3. Cat turn:
   - Hover column → glowing preview indicator.
   - Click → piece drops with animation.
4. Check for win or draw.
5. If game continues:
   - AI thinking state activates.
   - Thinking panel displays reasoning.
   - AI selects move.
   - Piece drops with animation.
6. Repeat until win or draw.
7. Display result screen.
8. Player can:
   - Play again
   - Change difficulty

---

# 3. Win, Lose & Draw Conditions

## Win Condition

- 4 in a row:
  - Horizontal
  - Vertical
  - Diagonal (both directions)

Effects:

- Winning pieces pulse.
- Subtle screen tilt.
- Glow particle burst.

Messages:

- Cat Win: "Cat Outsmarted the Dog!"
- Dog Win: "Dog Calculated the Win!"

## Lose Condition

- AI connects four first.

Effects:

- Slight board vibration.
- Subtle glitch effect.

## Draw Condition

- Board full.
- No winner detected.

Message: "Stalemate. Even brilliance has limits."

---

# 4. Difficulty System

## Easy – "Playful Pup"

- 40% chance random valid move.
- Checks only immediate win or block.
- Does not evaluate multi-step setups.
- Sometimes ignores center priority.
- Thinking time: 0.5–1 second.
- Casual personality responses.

## Medium – "Street Smart"

- Always blocks immediate wins.
- Takes immediate wins.
- Evaluates 2-move threats.
- Prefers center column.
- Avoids most traps.
- Thinking time: 1–1.5 seconds.

## Hard – "Cyber Strategist"

- Minimax algorithm (depth 4–6).
- Heuristic evaluation including:
  - Center control scoring
  - Open three detection
  - Double-threat creation
  - Trap avoidance
- Always blocks and optimizes future plays.
- Thinking time: 1.5–2.5 seconds.
- Analytical personality tone.

---

# 5. AI Integration

## Board Representation (ASCII Format)

```
| . . . . . . . |
| . . . . . . . |
| . . . C D . . |
| . . C D C . . |
| . D C C D . . |
| C D D C D C . |

C = Cat
D = Dog
. = Empty
```

## AI Analysis Steps

1. Check for immediate winning move.
2. Check for immediate block.
3. Evaluate center control.
4. Evaluate 2-step threats.
5. Score board position.
6. Return selected column index.

## Thinking Panel

Displays:

- Round number
- ASCII board
- AI reasoning summary
- Final chosen column

Includes typing animation for immersion.

---

# 6. Advanced Gameplay Elements

## Double Threat Detection

If a player creates two potential wins next turn:

- Highlight both paths faintly.
- Increase tension animation.

## Momentum Indicator (Optional)

Displays board control percentage:

- CAT %
- DOG %

Based on:

- Center control
- Near-wins
- Threat creation

## Speed Escalation

Each new match slightly increases:

- Drop animation speed
- AI thinking speed

Encourages replayability.

---

# 7. UI / UX Design

## Theme

Neon Cyberpunk, Dark Mode

## Background

- Dark blue/slate gradient.
- Floating animated gradient orbs (purple, blue, pink).
- Subtle particle layer.

## Board Styling

- Glassmorphism panel.
- backdrop-blur effect.
- Soft neon grid glow.

## Player Colors

- Cat: Dark purple gradient with glow.
- Dog: White/black gradient with glow.

## Animations

- Smooth hover effects.
- Vertical light beam on column hover.
- Bounce on piece landing.
- Pulsing glow for winning pieces.
- Smooth fade transitions.

## Layout

Responsive design:

- Game board left.
- AI thinking panel right.
- Stacks vertically on mobile.

---

# 8. Technical Requirements

## Framework

- React with Hooks
  - useState
  - useEffect
  - useRef

## Styling

- Tailwind CSS

## Game Logic

- Fully client-side.
- Prevent moves during:
  - Animation
  - AI thinking
- Prevent placement in full column.
- Detect draw state properly.
- Clear highlights on restart.

## State Management

Core state includes:

- board
- currentPlayer
- winner
- isAnimating
- isThinking
- difficulty
- moveHistory

Derived state:

- isGameOver

---

# 9. Engagement Systems

## Win Streak Counter

Tracks:

- Player streak
- AI streak

## Stats Panel

Stored in localStorage:

- Total games
- Wins
- Losses
- Draws
- Longest streak

## Optional Sound Design

- Neon click
- Synth drop sound
- Glitch loss sound
- Rising win tone

---

# 10. Edge Case Handling Checklist

- Prevent move during animation.
- Prevent move during AI thinking.
- Block input if column full.
- Detect draw correctly.
- Cancel AI request on restart.
- Reset board cleanly.
- Track move history with round numbers.

---

# 11. Future Expansion Ideas

- Online multiplayer mode.
- Time attack mode.
- Puzzle mode (solve in X moves).
- Animated character avatars.
- Special modes with power-ups.

---

# Game Identity Statement

OPNET – Join Dots is not just a Connect Four clone.

It is a neon cyber duel between instinct and calculation — where every move is analyzed, every threat glows, and every victory feels earned.

