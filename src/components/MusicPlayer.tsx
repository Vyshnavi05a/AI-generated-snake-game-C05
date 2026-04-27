import { useEffect, useRef, useState, useCallback } from 'react';

const TRACKS = [
  { id: 1, title: 'OVERDRIVE.WAV', source: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'NEURAL_GROOVE.MP3', source: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'DEEP_DREAM.FLAC', source: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const skipForward = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  }, []);

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    skipForward();
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-black panel-border p-6 uppercase relative overflow-hidden">
      
      {/* Glitch artifacts */}
      <div className="absolute top-[10%] left-[-10px] w-4 h-[2px] bg-[#00FFFF]" />
      <div className="absolute bottom-[20%] right-[-5px] w-6 h-[4px] bg-[#FF00FF]" />

      <div className="flex items-center justify-between mb-6 border-b-4 border-[#00FFFF] pb-2">
        <div className="flex items-center gap-3 text-[#FF00FF]">
          <span className="font-bold text-xl glitch-text" data-text="A_STREAM_DECODER">
            A_STREAM_DECODER
          </span>
        </div>
        <button
          onClick={toggleMute}
          className="text-[#00FFFF] hover:text-[#FF00FF] transition-none cursor-pointer bg-black border-2 border-[#00FFFF] hover:border-[#FF00FF] px-2"
        >
          {isMuted ? 'VOL:0%' : 'VOL:MAX'}
        </button>
      </div>

      <div className="text-left mb-8 bg-[#FF00FF] text-black p-2 relative">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(0,0,0,0.2)_2px,rgba(0,0,0,0.2)_4px)] pointer-events-none" />
        <h3 className="font-bold text-2xl truncate relative z-10">
          {currentTrack.title}
        </h3>
        <p className="text-black font-bold text-sm mt-1 uppercase relative z-10">
          &gt; T_ID: {currentTrack.id} // ALGO_GEN
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          onClick={skipBack}
          className="flex-1 py-3 text-[#00FFFF] border-2 border-[#00FFFF] hover:bg-[#FF00FF] hover:text-black hover:border-[#FF00FF] transition-none cursor-pointer jarring-btn font-bold"
        >
          &lt;&lt; PREV
        </button>
        <button
          onClick={togglePlay}
          className={`flex-1 py-3 font-bold border-2 transition-none cursor-pointer jarring-btn ${
            isPlaying 
            ? 'bg-[#00FFFF] text-black border-[#00FFFF]' 
            : 'bg-black text-[#FF00FF] border-[#FF00FF]'
          }`}
        >
          {isPlaying ? '|| HALT' : '> EXECUTE'}
        </button>
        <button
          onClick={skipForward}
          className="flex-1 py-3 text-[#00FFFF] border-2 border-[#00FFFF] hover:bg-[#FF00FF] hover:text-black hover:border-[#FF00FF] transition-none cursor-pointer jarring-btn font-bold"
        >
          NEXT &gt;&gt;
        </button>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.source}
        onEnded={handleEnded}
        preload="auto"
      />
    </div>
  );
}

