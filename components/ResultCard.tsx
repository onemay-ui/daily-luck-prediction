import React from 'react';
import { FortuneResponse, JiaziStick } from '../types';

interface Props {
  stick: JiaziStick;
  data: FortuneResponse;
  onReset: () => void;
}

export const ResultCard: React.FC<Props> = ({ stick, data, onReset }) => {
  
  // Dynamic color mapping based on result
  const getAuspiciousColor = (level: string) => {
    switch(level) {
      case 'Great Fortune': return 'text-red-600';
      case 'Good Fortune': return 'text-orange-600';
      case 'Caution': return 'text-stone-600';
      default: return 'text-stone-800';
    }
  };

  return (
    <div className="w-full max-w-2xl bg-[#fdfbf7] border-2 border-stone-300 rounded-sm shadow-2xl p-8 relative overflow-hidden animate-fade-in-up">
       {/* Watermark background */}
       <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-stone-200 pb-4 mb-6">
            <div className="flex flex-col">
                <span className="text-stone-400 text-sm tracking-widest uppercase">Jiazi Stick #{stick.id}</span>
                <h2 className="text-5xl font-serif font-bold text-stone-800 mt-1">{stick.name}</h2>
            </div>
            <div className={`text-2xl font-bold border-2 px-4 py-2 rounded ${getAuspiciousColor(data.auspiciousness)} border-current`}>
                {data.auspiciousness === 'Great Fortune' ? '上上籤' : 
                 data.auspiciousness === 'Good Fortune' ? '吉籤' : 
                 data.auspiciousness === 'Caution' ? '下籤' : '中籤'}
            </div>
        </div>

        {/* Animal Spirit Section */}
        <div className="flex flex-col md:flex-row gap-6 mb-8 items-center md:items-start">
            <div className="w-32 h-32 flex-shrink-0 bg-stone-100 rounded-full flex items-center justify-center border-4 border-yellow-500/30 shadow-inner">
                {/* Placeholder for animal icon based on randomness, using emojis for simplicity in code-only solution */}
                <span className="text-6xl" role="img" aria-label="animal">
                   🐉
                </span>
            </div>
            <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-yellow-700">靈獸守護: {data.animalGuardian}</h3>
                <p className="text-stone-500 italic mt-1">"{data.animalTrait}"</p>
                <div className="mt-3 text-sm bg-stone-100 inline-block px-3 py-1 rounded-full text-stone-600">
                   幸運色: {data.luckyColor}
                </div>
            </div>
        </div>

        {/* Poem */}
        <div className="bg-stone-50 p-6 rounded-lg border border-stone-200 mb-8 text-center">
            <div className="font-serif text-lg md:text-xl leading-loose text-stone-800 whitespace-pre-line">
                {data.poem}
            </div>
        </div>

        {/* Advice Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-red-50/50 rounded border border-red-100">
                <h4 className="font-bold text-red-800 mb-2 text-sm uppercase">運勢總評</h4>
                <p className="text-stone-700 text-sm">{data.advice.general}</p>
            </div>
            <div className="p-4 bg-yellow-50/50 rounded border border-yellow-100">
                <h4 className="font-bold text-yellow-800 mb-2 text-sm uppercase">事業/學業</h4>
                <p className="text-stone-700 text-sm">{data.advice.career}</p>
            </div>
            <div className="p-4 bg-pink-50/50 rounded border border-pink-100">
                <h4 className="font-bold text-pink-800 mb-2 text-sm uppercase">感情/人際</h4>
                <p className="text-stone-700 text-sm">{data.advice.love}</p>
            </div>
        </div>

        {/* Footer Action */}
        <div className="text-center">
            <button 
                onClick={onReset}
                className="text-stone-500 hover:text-red-600 border-b border-transparent hover:border-red-600 transition-colors pb-1"
            >
                重抽一籤 (Draw Again)
            </button>
        </div>
      </div>
    </div>
  );
};
