import React, { useState, useCallback, useEffect } from 'react';
import { AppState, JiaziStick, FortuneResponse } from './types';
import { JIAZI_CYCLE } from './constants';
import { audioService } from './services/audioService';
import { getFortuneInterpretation } from './services/geminiService';
import { FortuneContainer } from './components/FortuneContainer';
import { ResultCard } from './components/ResultCard';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [selectedStick, setSelectedStick] = useState<JiaziStick | null>(null);
  const [fortuneData, setFortuneData] = useState<FortuneResponse | null>(null);
  const [shakeCount, setShakeCount] = useState(0);

  // Shaking Logic
  const handleShake = useCallback(() => {
    if (appState !== AppState.IDLE && appState !== AppState.SHAKING) return;

    setAppState(AppState.SHAKING);
    audioService.playShakeSound();
    
    // Increment shake count
    setShakeCount(prev => prev + 1);
  }, [appState]);

  // Effect to determine when shaking is done (simulate physics/randomness)
  useEffect(() => {
    if (appState === AppState.SHAKING) {
      // If shook enough times or random chance
      if (shakeCount > 3) {
         const timeout = setTimeout(() => {
            finishDrawing();
         }, 800);
         return () => clearTimeout(timeout);
      } else {
         const timeout = setTimeout(() => {
            // Stop shaking visual but keep state ready for more shakes or finish
            // In this simple version, we just reset UI state to allow another click/shake
            // But for UX flow, let's auto-finish after a few shakes for smoother experience
            if (Math.random() > 0.7) {
                finishDrawing();
            } else {
               // Brief pause in animation?
            }
         }, 500);
         return () => clearTimeout(timeout);
      }
    }
  }, [shakeCount, appState]);

  const finishDrawing = () => {
    audioService.playDrawSound();
    setAppState(AppState.DRAWN);
    setShakeCount(0);

    // Pick random stick
    const randomIndex = Math.floor(Math.random() * JIAZI_CYCLE.length);
    const stick = JIAZI_CYCLE[randomIndex];
    setSelectedStick(stick);

    // Immediately fetch AI interpretation
    fetchFortune(stick);
  };

  const fetchFortune = async (stick: JiaziStick) => {
    setAppState(AppState.INTERPRETING);
    try {
      const data = await getFortuneInterpretation(stick.name);
      setFortuneData(data);
      setAppState(AppState.RESULT);
      audioService.playRevealSound();
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setSelectedStick(null);
    setFortuneData(null);
  };

  return (
    <div className="min-h-screen bg-[#f2eadd] text-stone-800 flex flex-col items-center p-4">
      
      {/* Header */}
      <header className="w-full max-w-3xl text-center mt-8 mb-4">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-red-900 mb-2 tracking-widest">
          靈獸六十甲子
        </h1>
        <p className="text-stone-600 font-serif italic">
          Spirit Animal Fortune Sticks
        </p>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center relative">
        
        {/* Initial State & Shaking */}
        {(appState === AppState.IDLE || appState === AppState.SHAKING) && (
          <div className="animate-fade-in">
             <FortuneContainer 
                isShaking={appState === AppState.SHAKING} 
                onClick={handleShake}
                disabled={false}
             />
          </div>
        )}

        {/* Loading / Interpreting State */}
        {(appState === AppState.DRAWN || appState === AppState.INTERPRETING) && (
          <div className="flex flex-col items-center justify-center space-y-6 animate-pulse">
             <div className="w-4 h-32 bg-yellow-200 border-2 border-yellow-700 rounded-sm flex items-center justify-center shadow-lg">
                <span className="writing-vertical text-xl font-bold text-red-900">
                    {selectedStick?.name}
                </span>
             </div>
             <p className="text-stone-500 font-serif text-lg">
                {appState === AppState.INTERPRETING ? "靈獸解籤中..." : "籤落..."}
             </p>
             {appState === AppState.INTERPRETING && (
                 <div className="w-64 h-1 bg-stone-300 rounded-full overflow-hidden">
                    <div className="h-full bg-red-800 animate-[loading_1.5s_ease-in-out_infinite]"></div>
                 </div>
             )}
          </div>
        )}

        {/* Result State */}
        {appState === AppState.RESULT && selectedStick && fortuneData && (
           <ResultCard 
             stick={selectedStick} 
             data={fortuneData} 
             onReset={handleReset} 
           />
        )}

        {/* Error State */}
        {appState === AppState.ERROR && (
          <div className="text-center p-8 bg-white rounded shadow-lg border-red-200 border">
            <p className="text-red-600 mb-4">雲霧繚繞，無法看清未來 (Connection Error)</p>
            <button 
                onClick={handleReset}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded text-stone-700"
            >
                重試
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-stone-400 text-xs font-serif">
        © 2025 Spirit Animal Oracle | Powered by Gemini
      </footer>

      <style>{`
        .writing-vertical {
            writing-mode: vertical-rl;
            text-orientation: upright;
        }
        @keyframes loading {
            0% { width: 0%; margin-left: 0; }
            50% { width: 100%; margin-left: 0; }
            100% { width: 0%; margin-left: 100%; }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;
