# Unit Test Plan - Snake Game

## Overview
This test plan covers unit tests for the Snake Game application built with Next.js, React, and Valtio for state management. The tests are organized by feature/component and focus on testing individual units of functionality in isolation.

## Test Categories

### 1. Type Definitions Tests (`src/types/game.ts`)
- **Test Suite**: `types/game.test.ts`
- **Tests**:
  - `Position` interface validation
  - `Apple` interface validation with both regular and gold types
  - `Direction` type validation (UP, DOWN, LEFT, RIGHT)
  - `GameState` interface validation with all required properties
  - `GameActions` interface validation with all required methods

### 2. Game Store Tests (`src/store/gameStore.ts`)
- **Test Suite**: `store/gameStore.test.ts`
- **Tests**:
  - **Initial State**:
    - Should initialize with correct default values
    - Should have snake at center position (12, 12)
    - Should have initial direction as DOWN
    - Should have speed set to 500ms
    - Should have game not started and not over
  
  - **Game Actions**:
    - `startGame()`:
      - Should set gameStarted to true
      - Should set gameOver to false
      - Should generate an apple
    
    - `resetGame()`:
      - Should reset all game state to initial values
      - Should reset snake position to center
      - Should reset score to 0
      - Should generate a new apple
    
    - `changeDirection()`:
      - Should update nextDirection when valid
      - Should prevent reverse direction (UP when going DOWN)
      - Should prevent reverse direction (LEFT when going RIGHT)
      - Should allow perpendicular direction changes
    
    - `moveSnake()`:
      - Should not move if game not started
      - Should not move if game over
      - Should update snake direction to nextDirection
      - Should move snake head in correct direction based on current direction
      - Should add new head to snake array
      - Should remove tail when no apple eaten
      - Should keep tail when apple eaten
      - Should end game when collision detected
    
    - `checkCollision()`:
      - Should return true when snake hits top wall
      - Should return true when snake hits bottom wall
      - Should return true when snake hits left wall
      - Should return true when snake hits right wall
      - Should return true when snake hits itself
      - Should return false when no collision
    
    - `checkAppleCollision()`:
      - Should return true when snake head position matches apple position
      - Should return false when positions don't match
      - Should return false when no apple exists
    
    - `generateApple()`:
      - Should create apple at random position
      - Should not place apple on snake body
      - Should create regular apple (90% chance)
      - Should create gold apple (20% chance)
      - Should set correct points (10 for regular, 50 for gold)
    
    - `increaseSpeed()`:
      - Should decrease speed value (increase actual speed)
      - Should not go below minimum speed (50ms)
      - Should reduce speed by 5ms increments

### 3. Game Hook Tests (`src/hooks/useGameLoop.ts`)
- **Test Suite**: `hooks/useGameLoop.test.ts`
- **Tests**:
  - Should return game state and actions
  - Should start animation frame loop when game starts
  - Should stop animation frame loop when game ends
  - Should handle keyboard events correctly:
    - Arrow keys should change direction
    - Space should start/restart game
    - Should prevent default on handled keys
  - Should call moveSnake at correct intervals based on speed
  - Should cleanup event listeners on unmount
  - Should cleanup animation frame on unmount

### 4. Component Tests

#### GameBoard Component (`src/components/snake/GameBoard.tsx`)
- **Test Suite**: `components/snake/GameBoard.test.tsx`
- **Tests**:
  - Should render board with correct dimensions
  - Should render snake head with correct styling (green-600)
  - Should render snake body with correct styling (green-500)
  - Should render regular apple with correct styling (red-500, rounded)
  - Should render gold apple with correct styling (yellow-400, rounded)
  - Should render empty cells with correct styling (gray-100)
  - Should apply custom className prop
  - Should render correct number of cells (boardWidth × boardHeight)

#### GameScore Component (`src/components/snake/GameScore.tsx`)
- **Test Suite**: `components/snake/GameScore.test.tsx`
- **Tests**:
  - Should display current score
  - Should display snake length
  - Should display speed percentage calculation
  - Should update when game state changes
  - Should calculate speed percentage correctly

#### GameControls Component (`src/components/snake/GameControls.tsx`)
- **Test Suite**: `components/snake/GameControls.test.tsx`
- **Tests**:
  - **Before Game Start**:
    - Should show "Start Game" button
    - Should show keyboard instructions
    - Should call startGame when button clicked
  
  - **During Game**:
    - Should show "Playing..." status
    - Should show control instructions
    - Should show apple scoring information
  
  - **Game Over**:
    - Should show "Game Over!" message
    - Should display final score
    - Should show "Play Again" button
    - Should call resetGame when button clicked

#### SnakeGame Component (`src/components/snake/SnakeGame.tsx`)
- **Test Suite**: `components/snake/SnakeGame.test.tsx`
- **Tests**:
  - Should render all child components
  - Should render game title
  - Should initialize game loop hook
  - Should have proper layout structure

### 5. Context Tests (`src/contexts/GameContext.tsx`)
- **Test Suite**: `contexts/GameContext.test.tsx`
- **Tests**:
  - Should provide game state and actions to children
  - Should throw error when useGame used outside provider
  - Should allow nested components to access context
  - Should update context when game state changes

### 6. Utility Tests (`src/lib/utils.ts`)
- **Test Suite**: `lib/utils.test.ts`
- **Tests**:
  - `cn()` function:
    - Should merge className strings correctly
    - Should handle conditional classes
    - Should handle arrays of classes
    - Should handle undefined/null values
    - Should merge Tailwind classes properly

## Testing Strategy

### Mocking Strategy
- Mock `valtio` proxy and snapshot for isolated testing
- Mock `requestAnimationFrame` and `cancelAnimationFrame` for timing tests
- Mock keyboard events for interaction testing
- Mock Math.random for predictable apple generation tests

### Test Data
- Create test fixtures for game states (initial, playing, game over)
- Create mock snake positions for collision testing
- Create mock apple positions for collision testing

### Test Utilities
- Helper functions to create test game states
- Helper functions to simulate key presses
- Helper functions to advance game time
- Helper functions to create component wrappers with context

### Edge Cases to Test
- Snake eating apple at board edge
- Snake collision with walls at all boundaries
- Snake collision with itself at various body lengths
- Apple generation when board is nearly full
- Direction changes in rapid succession
- Game state transitions (not started → playing → game over)
- Speed changes at minimum and maximum values

## Test File Structure
```
src/
  __tests__/
    types/
      game.test.ts
    store/
      gameStore.test.ts
    hooks/
      useGameLoop.test.ts
    components/
      snake/
        GameBoard.test.tsx
        GameScore.test.tsx
        GameControls.test.tsx
        SnakeGame.test.tsx
    contexts/
      GameContext.test.tsx
    lib/
      utils.test.ts
  __mocks__/
    valtio.ts
    requestAnimationFrame.ts
  test-utils/
    gameStateFixtures.ts
    testHelpers.ts
```

## Required Testing Dependencies
- `@testing-library/react` - React component testing
- `@testing-library/jest-dom` - DOM assertions
- `@testing-library/user-event` - User interaction simulation
- `jest` - Test runner
- `jest-environment-jsdom` - DOM environment for tests

## Test Coverage Goals
- **Statements**: 90%+
- **Branches**: 85%+
- **Functions**: 90%+
- **Lines**: 90%+

Focus areas for high coverage:
- Game logic and state management
- Collision detection algorithms
- Direction change validation
- Apple generation logic
- Score calculation

This comprehensive test plan ensures thorough coverage of all game functionality while maintaining focus on unit testing principles - testing individual components and functions in isolation.
