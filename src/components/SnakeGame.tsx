import { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 15 },
  { x: 10, y: 16 },
  { x: 10, y: 17 }
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 120;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 10, y: 5 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const directionRef = useRef(INITIAL_DIRECTION);
  const containerRef = useRef<HTMLDivElement>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsPlaying(true);
    setIsGameOver(false);
    containerRef.current?.focus();
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isPlaying) return;

      const { key } = e;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        e.preventDefault();
      }

      const currentDir = directionRef.current;
      let newDir = currentDir;

      switch (key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) newDir = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) newDir = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) newDir = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) newDir = { x: 1, y: 0 };
          break;
      }

      directionRef.current = newDir;
      setDirection(newDir);
    },
    [isPlaying]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          handleGameOver();
          return prevSnake;
        }

        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const currentSpeed = Math.max(40, INITIAL_SPEED - Math.floor(score / 40) * 10);
    const interval = setInterval(moveSnake, currentSpeed);
    return () => clearInterval(interval);
  }, [isPlaying, isGameOver, food, generateFood, score]);

  const handleGameOver = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return (
    <div 
      className="flex flex-col items-center p-4 panel-border bg-black focus:outline-none glitch-box uppercase w-full"
      tabIndex={0}
      ref={containerRef}
    >
      
      {/* Header Info */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b-2 border-[#FF00FF] pb-2">
        <div className="flex items-center gap-2 text-[#00FFFF]">
          <span className="font-bold text-2xl glitch-text" data-text="XOR_SNAKE.EXE">
            XOR_SNAKE.EXE
          </span>
        </div>
        
        <div className="flex gap-6 mt-2 md:mt-0 font-bold text-xl">
          <div className="flex items-center gap-2">
            <span className="text-[#FF00FF]">MEM_ALLOC:</span>
            <span className="text-[#00FFFF]">{score}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#FF00FF]">PEAK:</span>
            <span className="text-[#00FFFF]">{highScore}</span>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative border-4 border-[#00FFFF] bg-black">
        <div 
          className="grid relative z-10"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(100vw - 64px, 450px)',
            height: 'min(100vw - 64px, 450px)'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.some((segment) => segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={index}
                className={`w-full h-full ${
                  isSnakeHead 
                    ? 'bg-[#FF00FF]'
                    : isSnakeBody
                    ? 'bg-[repeating-linear-gradient(45deg,#FF00FF,#FF00FF_2px,black_2px,black_4px)]'
                    : isFood
                    ? 'bg-[#00FFFF] animate-ping'
                    : 'bg-transparent border border-[#00FFFF]/10'
                }`}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {(!isPlaying && !isGameOver) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
            <div className="text-[#00FFFF] border-2 border-[#FF00FF] p-6 text-center glitch-box bg-black">
              <button
                onClick={startGame}
                className="px-6 py-2 bg-[#FF00FF] text-black font-bold text-2xl uppercase jarring-btn transition-none cursor-pointer border-2 border-transparent"
              >
                [ EXECUTE ROUTINE ]
              </button>
              <p className="mt-6 text-[#FF00FF] text-lg">&gt; INPUT: ARROWS/WASD</p>
            </div>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-[#FF00FF]/20 flex flex-col items-center justify-center z-20">
            <div className="text-black border-4 border-[#FF00FF] p-6 text-center glitch-box bg-[#00FFFF]">
              <h2 className="text-4xl font-bold mb-4 uppercase glitch-text" data-text="KERNEL_PANIC">
                KERNEL_PANIC
              </h2>
              <p className="font-bold text-2xl mb-8">STACK DUMP: {score}</p>
              <button
                onClick={startGame}
                className="px-6 py-2 bg-black text-[#00FFFF] font-bold text-xl uppercase jarring-btn transition-none border-2 border-transparent cursor-pointer"
              >
                [ FORCE REBOOT ]
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
