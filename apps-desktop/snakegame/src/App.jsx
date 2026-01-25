import { useState, useEffect, useCallback, useRef } from 'react'

const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SPEED = 150

const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
}

function App() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }])
  const [food, setFood] = useState({ x: 15, y: 15 })
  const [direction, setDirection] = useState({ x: 1, y: 0 })
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore')
    return saved ? parseInt(saved, 10) : 0
  })
  const [isPaused, setIsPaused] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  const directionRef = useRef(direction)
  const gameLoopRef = useRef(null)

  const generateFood = useCallback((currentSnake) => {
    let newFood
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      }
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [])

  const resetGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }]
    setSnake(initialSnake)
    setFood(generateFood(initialSnake))
    setDirection({ x: 1, y: 0 })
    directionRef.current = { x: 1, y: 0 }
    setGameOver(false)
    setScore(0)
    setIsPaused(false)
    setGameStarted(true)
  }, [generateFood])

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused || !gameStarted) return

    setSnake(prevSnake => {
      const currentDirection = directionRef.current
      const head = prevSnake[0]
      const newHead = {
        x: head.x + currentDirection.x,
        y: head.y + currentDirection.y,
      }

      // Check wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true)
        return prevSnake
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true)
        return prevSnake
      }

      const newSnake = [newHead, ...prevSnake]

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(prev => {
          const newScore = prev + 10
          if (newScore > highScore) {
            setHighScore(newScore)
            localStorage.setItem('snakeHighScore', newScore.toString())
          }
          return newScore
        })
        setFood(generateFood(newSnake))
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [food, gameOver, isPaused, gameStarted, generateFood, highScore])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ') {
        e.preventDefault()
        if (gameOver) {
          resetGame()
        } else if (gameStarted) {
          setIsPaused(prev => !prev)
        } else {
          setGameStarted(true)
        }
        return
      }

      if (e.key === 'Enter' && !gameStarted) {
        setGameStarted(true)
        return
      }

      const newDirection = DIRECTIONS[e.key]
      if (newDirection && gameStarted && !gameOver) {
        // Prevent 180-degree turns
        const currentDir = directionRef.current
        if (newDirection.x !== -currentDir.x || newDirection.y !== -currentDir.y) {
          directionRef.current = newDirection
          setDirection(newDirection)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameOver, gameStarted, resetGame])

  // Game loop
  useEffect(() => {
    if (gameStarted && !gameOver && !isPaused) {
      gameLoopRef.current = setInterval(moveSnake, INITIAL_SPEED)
    }
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [moveSnake, gameStarted, gameOver, isPaused])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-4 tracking-wider">
        🐍 Snake Game
      </h1>

      <div className="flex gap-8 mb-4">
        <div className="text-xl text-green-400 font-semibold">
          Score: {score}
        </div>
        <div className="text-xl text-yellow-400 font-semibold">
          High Score: {highScore}
        </div>
      </div>

      <div
        className="relative bg-gray-800 border-4 border-purple-500 rounded-lg shadow-2xl shadow-purple-500/20"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE
        }}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: GRID_SIZE }).map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute w-full border-t border-gray-500"
              style={{ top: i * CELL_SIZE }}
            />
          ))}
          {Array.from({ length: GRID_SIZE }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute h-full border-l border-gray-500"
              style={{ left: i * CELL_SIZE }}
            />
          ))}
        </div>

        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute rounded-sm transition-all duration-75 ${
              index === 0
                ? 'bg-green-400 shadow-lg shadow-green-400/50'
                : 'bg-green-500'
            }`}
            style={{
              left: segment.x * CELL_SIZE + 1,
              top: segment.y * CELL_SIZE + 1,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute bg-red-500 rounded-full shadow-lg shadow-red-500/50 animate-pulse"
          style={{
            left: food.x * CELL_SIZE + 2,
            top: food.y * CELL_SIZE + 2,
            width: CELL_SIZE - 4,
            height: CELL_SIZE - 4,
          }}
        />

        {/* Overlays */}
        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg">
            <p className="text-2xl text-white font-bold mb-2">Press SPACE or ENTER</p>
            <p className="text-lg text-gray-300">to start the game</p>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg">
            <p className="text-3xl text-yellow-400 font-bold">PAUSED</p>
            <p className="text-lg text-gray-300 mt-2">Press SPACE to continue</p>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg">
            <p className="text-3xl text-red-500 font-bold mb-2">GAME OVER</p>
            <p className="text-xl text-white mb-4">Final Score: {score}</p>
            <p className="text-lg text-gray-300">Press SPACE to play again</p>
          </div>
        )}
      </div>

      <div className="mt-6 text-gray-400 text-center">
        <p className="mb-2">Use <span className="text-white font-semibold">Arrow Keys</span> to move</p>
        <p>Press <span className="text-white font-semibold">SPACE</span> to pause/resume</p>
      </div>

      {/* Mobile controls */}
      <div className="mt-6 grid grid-cols-3 gap-2 md:hidden">
        <div />
        <button
          className="bg-purple-600 hover:bg-purple-500 text-white p-4 rounded-lg active:scale-95 transition-transform"
          onClick={() => {
            if (!gameOver && gameStarted) {
              const currentDir = directionRef.current
              if (currentDir.y !== 1) {
                directionRef.current = DIRECTIONS.ArrowUp
                setDirection(DIRECTIONS.ArrowUp)
              }
            }
          }}
        >
          ↑
        </button>
        <div />
        <button
          className="bg-purple-600 hover:bg-purple-500 text-white p-4 rounded-lg active:scale-95 transition-transform"
          onClick={() => {
            if (!gameOver && gameStarted) {
              const currentDir = directionRef.current
              if (currentDir.x !== 1) {
                directionRef.current = DIRECTIONS.ArrowLeft
                setDirection(DIRECTIONS.ArrowLeft)
              }
            }
          }}
        >
          ←
        </button>
        <button
          className="bg-green-600 hover:bg-green-500 text-white p-4 rounded-lg active:scale-95 transition-transform"
          onClick={() => {
            if (gameOver) {
              resetGame()
            } else if (!gameStarted) {
              setGameStarted(true)
            } else {
              setIsPaused(prev => !prev)
            }
          }}
        >
          {gameOver ? '↻' : isPaused ? '▶' : '⏸'}
        </button>
        <button
          className="bg-purple-600 hover:bg-purple-500 text-white p-4 rounded-lg active:scale-95 transition-transform"
          onClick={() => {
            if (!gameOver && gameStarted) {
              const currentDir = directionRef.current
              if (currentDir.x !== -1) {
                directionRef.current = DIRECTIONS.ArrowRight
                setDirection(DIRECTIONS.ArrowRight)
              }
            }
          }}
        >
          →
        </button>
        <div />
        <button
          className="bg-purple-600 hover:bg-purple-500 text-white p-4 rounded-lg active:scale-95 transition-transform"
          onClick={() => {
            if (!gameOver && gameStarted) {
              const currentDir = directionRef.current
              if (currentDir.y !== -1) {
                directionRef.current = DIRECTIONS.ArrowDown
                setDirection(DIRECTIONS.ArrowDown)
              }
            }
          }}
        >
          ↓
        </button>
        <div />
      </div>
    </div>
  )
}

export default App
