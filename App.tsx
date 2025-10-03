
import React, { useState, useCallback, useEffect } from 'react';
import { GameState, Character, Scene, GameLogEntry } from './types';
import { INITIAL_CHARACTER, INITIAL_SCENE } from './constants';
import { generateScene, getInitialScenePrompt, getNextScenePrompt } from './services/gameService';
import CharacterSheet from './components/CharacterSheet';
import GameScreen from './components/GameScreen';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START_SCREEN);
  const [character, setCharacter] = useState<Character>(INITIAL_CHARACTER);
  const [characterName, setCharacterName] = useState<string>('');
  const [currentScene, setCurrentScene] = useState<Scene>(INITIAL_SCENE);
  const [gameLog, setGameLog] = useState<GameLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const parseAndUpdateStats = useCallback((sceneText: string) => {
    const hpRegex = /\(체력\s*([+-])(\d+)\)/;
    const styleRegex = /\(스타일\s*([+-])(\d+)\)/;
    const demonRegex = /\(악마 에너지\s*([+-])(\d+)\)/;
  
    let newHp = character.hp;
    let newStyle = character.style;
    let newDemonEnergy = character.demonEnergy;
  
    const hpMatch = sceneText.match(hpRegex);
    if (hpMatch) {
      const operator = hpMatch[1];
      const value = parseInt(hpMatch[2], 10);
      newHp = operator === '+' ? newHp + value : newHp - value;
    }
  
    const styleMatch = sceneText.match(styleRegex);
    if (styleMatch) {
      const operator = styleMatch[1];
      const value = parseInt(styleMatch[2], 10);
      newStyle = operator === '+' ? newStyle + value : newStyle - value;
    }
  
    const demonMatch = sceneText.match(demonRegex);
    if (demonMatch) {
      const operator = demonMatch[1];
      const value = parseInt(demonMatch[2], 10);
      newDemonEnergy = operator === '+' ? newDemonEnergy + value : newDemonEnergy - value;
    }
    
    setCharacter(prev => ({
        ...prev,
        hp: Math.max(0, Math.min(100, newHp)),
        style: Math.max(0, Math.min(100, newStyle)),
        demonEnergy: Math.max(0, Math.min(100, newDemonEnergy)),
    }));

  }, [character]);

  const fetchScene = useCallback(async (prompt: string) => {
    setIsLoading(true);
    setError('');
    const scene = await generateScene(prompt);
    
    if (scene.sceneDescription.includes("오류가 발생했습니다")) {
        setError("API 통신 중 문제가 발생했습니다. API 키를 확인해주세요.");
    } else {
        setCurrentScene(scene);
        setGameLog(prev => [...prev, { type: 'scene', text: scene.sceneDescription }]);
        parseAndUpdateStats(scene.sceneDescription);
        if (scene.sceneDescription.includes("GAME_OVER") || scene.choices.length === 0) {
            setGameState(GameState.GAME_OVER);
        }
    }
    setIsLoading(false);
  }, [parseAndUpdateStats]);
  
  const handleStartGame = () => {
    setGameState(GameState.CHARACTER_CREATION);
  };

  const handleCharacterCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (characterName.trim()) {
      const newCharacter = { ...INITIAL_CHARACTER, name: characterName.trim() };
      setCharacter(newCharacter);
      setGameState(GameState.PLAYING);
      fetchScene(getInitialScenePrompt(newCharacter));
    }
  };

  const handleChoice = (choice: string) => {
    if (isLoading) return;
    setGameLog(prev => [...prev, { type: 'choice', text: choice }]);
    const prompt = getNextScenePrompt(currentScene, choice);
    fetchScene(prompt);
  };

  const handleRestart = () => {
      setCharacter(INITIAL_CHARACTER);
      setCurrentScene(INITIAL_SCENE);
      setGameLog([]);
      setGameState(GameState.START_SCREEN);
      setCharacterName('');
      setError('');
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.START_SCREEN:
        return (
          <div className="text-center text-white animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-orbitron text-brand-pink mb-4 tracking-widest" style={{ textShadow: '0 0 15px #ec4899' }}>K-POP DEMON HUNTERS</h1>
            <p className="text-xl text-brand-cyan mb-8 font-noto-kr">K-POP 아이돌의 화려함 뒤에 숨겨진 악마 사냥꾼의 삶</p>
            <button onClick={handleStartGame} className="px-8 py-4 bg-brand-pink text-white font-bold text-xl rounded-md shadow-neon-pink transition-all hover:scale-105">
              게임 시작
            </button>
          </div>
        );
      case GameState.CHARACTER_CREATION:
        return (
          <div className="text-center text-white animate-fade-in">
            <h2 className="text-4xl font-orbitron text-brand-cyan mb-6">당신의 아이돌 이름을 정해주세요</h2>
            <form onSubmit={handleCharacterCreate} className="flex flex-col items-center gap-4">
              <input
                type="text"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="아이돌 이름 입력"
                className="w-80 p-3 bg-transparent border-2 border-brand-purple text-white text-center text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-brand-pink"
              />
              <button type="submit" className="px-8 py-3 bg-brand-purple text-white font-bold text-lg rounded-md shadow-neon-purple transition-all hover:scale-105 disabled:opacity-50" disabled={!characterName.trim()}>
                활동 시작
              </button>
            </form>
          </div>
        );
      case GameState.PLAYING:
        return (
          <div className="w-full h-full flex flex-col md:flex-row gap-8 items-start animate-fade-in">
            <CharacterSheet character={character} />
            <GameScreen gameLog={gameLog} currentScene={currentScene} onChoice={handleChoice} isLoading={isLoading} />
          </div>
        );
      case GameState.GAME_OVER:
        return (
             <div className="text-center text-white animate-fade-in flex flex-col items-center">
                <h2 className="text-5xl font-orbitron text-red-500 mb-6" style={{ textShadow: '0 0 15px red' }}>GAME OVER</h2>
                <div className="max-w-2xl bg-black/50 p-6 rounded-lg border border-red-500 mb-8">
                    <p className="text-lg font-noto-kr leading-relaxed">{currentScene.sceneDescription.replace("GAME_OVER", "").trim()}</p>
                </div>
                <button onClick={handleRestart} className="px-8 py-4 bg-brand-cyan text-white font-bold text-xl rounded-md shadow-neon-cyan transition-all hover:scale-105">
                    다시 도전하기
                </button>
            </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-brand-bg bg-grid-pattern p-4 sm:p-8 flex flex-col justify-center items-center">
      {error && <div className="absolute top-4 bg-red-500/80 text-white p-3 rounded-lg shadow-lg">{error}</div>}
      {renderContent()}
       {/* FIX: Removed non-standard 'jsx' and 'global' props from the style tag. This is a Next.js syntax and is not supported in a standard React setup. */}
       <style>{`
          .bg-grid-pattern {
            background-image: 
              linear-gradient(rgba(10, 10, 10, 0.95), rgba(10, 10, 10, 0.95)),
              linear-gradient(to right, #1e1b4b 1px, transparent 1px),
              linear-gradient(to bottom, #1e1b4b 1px, transparent 1px);
            background-size: 100% 100%, 40px 40px, 40px 40px;
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
       `}</style>
    </main>
  );
};

export default App;
