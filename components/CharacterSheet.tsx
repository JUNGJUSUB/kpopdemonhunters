
import React from 'react';
import { Character } from '../types';

interface CharacterSheetProps {
  character: Character;
}

const StatBar: React.FC<{ label: string; value: number; color: string; icon: string; shadow: string }> = ({ label, value, color, icon, shadow }) => (
  <div className="w-full">
    <div className="flex justify-between items-center mb-1 text-sm font-bold text-white">
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span>{value}%</span>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-2.5">
      <div
        className={`h-2.5 rounded-full ${color} ${shadow}`}
        style={{ width: `${value}%`, transition: 'width 0.5s ease-in-out' }}
      ></div>
    </div>
  </div>
);


const CharacterSheet: React.FC<CharacterSheetProps> = ({ character }) => {
  return (
    <div className="w-full md:w-80 p-4 bg-black/50 backdrop-blur-sm border border-brand-purple rounded-lg shadow-neon-purple text-white font-noto-kr">
      <h2 className="text-2xl font-orbitron text-brand-pink text-center mb-4 tracking-widest shadow-neon-pink">{character.name}</h2>
      <div className="space-y-4">
        <StatBar label="체력" value={character.hp} color="bg-green-500" icon="❤️" shadow="shadow-[0_0_8px_rgba(34,197,94,0.8)]"/>
        <StatBar label="스타일" value={character.style} color="bg-brand-pink" icon="✨" shadow="shadow-neon-pink"/>
        <StatBar label="악마 에너지" value={character.demonEnergy} color="bg-brand-purple" icon="😈" shadow="shadow-neon-purple"/>
      </div>
    </div>
  );
};

export default CharacterSheet;
   