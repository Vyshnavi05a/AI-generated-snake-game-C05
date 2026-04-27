import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00FFFF] font-mono relative flex flex-col md:flex-row overflow-hidden">
      {/* Glitch & CRT Overlays */}
      <div className="bg-noise" />
      <div className="scanlines" />

      {/* Tearing background lines */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,0,255,0.05)_10px,rgba(255,0,255,0.05)_20px)] pointer-events-none" />

      {/* Main Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center p-4 md:p-8 gap-8 md:gap-12 z-10 selection:bg-[#FF00FF] selection:text-black">
        
        {/* Left Side: Game */}
        <main className="flex-1 flex justify-center items-center w-full min-w-0">
          <SnakeGame />
        </main>

        {/* Right Side: Music Player */}
        <aside className="w-full md:w-[350px] shrink-0">
          <MusicPlayer />
          
          <div className="mt-8 text-left text-xl text-[#00FFFF] space-y-1 font-mono uppercase tracking-widest border-l-4 border-[#FF00FF] pl-4">
            <p className="glitch-text text-sm" data-text="&gt; OP_CODE: TERMINAL_ECHO">&gt; OP_CODE: TERMINAL_ECHO</p>
            <p className="text-xs">&gt; HOST_LINK: UNSTABLE</p>
            <div className="mt-4 inline-block bg-[#FF00FF] text-black px-2 py-1 text-sm animate-pulse glitch-box">
              [ WARNING: OVERFLOW ]
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}


