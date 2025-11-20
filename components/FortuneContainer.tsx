import React from 'react';

interface Props {
  isShaking: boolean;
  onClick: () => void;
  disabled: boolean;
}

export const FortuneContainer: React.FC<Props> = ({ isShaking, onClick, disabled }) => {
  return (
    <div className="relative flex flex-col items-center justify-center my-8">
      {/* The Container (Cylinder) */}
      <div 
        onClick={!disabled ? onClick : undefined}
        className={`
          relative w-48 h-64 bg-red-900 rounded-lg border-4 border-yellow-600 shadow-2xl 
          cursor-pointer transition-transform hover:scale-105 active:scale-95
          flex items-end justify-center overflow-visible
          ${isShaking ? 'shaking' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"></div>
        
        <div className="absolute top-4 w-12 h-12 rounded-full border-2 border-yellow-500 flex items-center justify-center bg-red-800 text-yellow-500 font-bold text-xl shadow-inner">
          籤
        </div>

        {/* The Sticks (Visible at top) */}
        <div className="w-32 h-full relative overflow-hidden">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-[120%] bg-transparent flex justify-center items-end space-x-1">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-3 bg-yellow-100 border border-yellow-700 rounded-t-sm h-[${100 + i*10}%] transform ${isShaking ? `translate-y-${i%2===0?2:-2}` : 'translate-y-12'}`}></div>
                ))}
            </div>
        </div>
      </div>

      {/* Prompt */}
      <div className="mt-6 text-center">
        <button 
            onClick={onClick}
            disabled={disabled}
            className="px-8 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-serif font-bold rounded-full shadow-lg transform transition hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isShaking ? "誠心祈求..." : "搖動籤筒"}
        </button>
        <p className="mt-2 text-stone-500 text-sm">點擊按鈕或籤筒</p>
      </div>
    </div>
  );
};
