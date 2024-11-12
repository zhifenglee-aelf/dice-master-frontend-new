import React from 'react';
import { Trophy, Cpu } from 'lucide-react';

interface ScoreCardProps {
  currentScore: number;
  highScore: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ currentScore, highScore }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 text-center transform hover:scale-105 transition-transform border border-teal-500/30 shadow-[0_0_15px_rgba(79,209,197,0.3)]">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Cpu size={20} className="text-teal-400" />
          <p className="text-teal-400">CURRENT</p>
        </div>
        <p className="text-3xl font-bold text-teal-300 tron-glow">{currentScore}</p>
      </div>
      <div className="bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 text-center transform hover:scale-105 transition-transform border border-teal-500/30 shadow-[0_0_15px_rgba(79,209,197,0.3)]">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy size={20} className="text-teal-400" />
          <p className="text-teal-400">MAXIMUM</p>
        </div>
        <p className="text-3xl font-bold text-teal-300 tron-glow">{highScore}</p>
      </div>
    </div>
  );
}

export default ScoreCard;