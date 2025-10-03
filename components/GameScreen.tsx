
import React, { useRef, useEffect } from 'react';
import { Scene, GameLogEntry } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface GameScreenProps {
  gameLog: GameLogEntry[];
  currentScene: Scene;
  onChoice: (choice: string) => void;
  isLoading: boolean;
}

const GameScreen: React.FC<GameScreenProps> = ({ gameLog, currentScene, onChoice, isLoading }) => {
    const logEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [gameLog, currentScene]);

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 bg-black/50 backdrop-blur-sm border border-brand-cyan rounded-lg shadow-neon-cyan font-noto-kr w-full max-w-4xl min-h-[400px]">
      <div className="flex-1 overflow-y-auto pr-4 mb-4 text-gray-200 space-y-4 text-lg leading-relaxed">
        {gameLog.map((entry, index) => (
          <div key={index} className={`animate-fade-in ${entry.type === 'choice' ? 'text-brand-pink italic pl-4 border-l-2 border-brand-pink' : 'text-white'}`}>
            {entry.type === 'choice' && <span className="font-bold mr-2">&gt;</span>}
            <p>{entry.text}</p>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      <div className="mt-auto pt-4 border-t border-brand-cyan/50">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentScene.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => onChoice(choice)}
                disabled={isLoading}
                className="w-full p-4 text-white font-bold font-orbitron bg-brand-purple/50 border-2 border-brand-purple rounded-md transition-all duration-300
                           hover:bg-brand-purple hover:shadow-neon-purple focus:outline-none focus:ring-2 focus:ring-brand-pink
                           disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-600 disabled:shadow-none"
              >
                {choice}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameScreen;
   