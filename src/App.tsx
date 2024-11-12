import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Zap } from 'lucide-react';
import Die3D from './components/Die3D';
import ScoreCard from './components/ScoreCard';
import ParticleSystem from './components/ParticleSystem';

function App() {
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [message, setMessage] = useState('');
  const [sequence, setSequence] = useState(1);
  const [isShaking, setIsShaking] = useState(false);
  const [particlePosition, setParticlePosition] = useState<{ x: number; y: number } | null>(null);

  const createParticle = useCallback((x: number, y: number, container: HTMLDivElement, type: string) => {
    const particle = document.createElement('div');
    particle.className = `particle ${type}`;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    // Random spread for different directions
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 100 + 50;
    particle.style.setProperty('--spread-x', `${Math.cos(angle) * distance}px`);
    particle.style.setProperty('--spread-y', `${Math.sin(angle) * distance}px`);
    
    // Random trail effect
    particle.style.setProperty('--trail-x', `${(Math.random() - 0.5) * 100}px`);
    particle.style.setProperty('--trail-y', `${-Math.random() * 100 - 50}px`);
    
    container.appendChild(particle);

    const animations = {
      'particle-basic': [
        { transform: 'scale(1) translate(0, 0)', opacity: 1 },
        { transform: `scale(0) translate(${Math.random() * 100 - 50}px, ${-Math.random() * 100}px)`, opacity: 0 }
      ],
      'particle-star': [
        { transform: 'rotate(0deg) scale(1)', opacity: 1 },
        { transform: 'rotate(360deg) scale(0)', opacity: 0 }
      ],
      'particle-spark': [
        { transform: `rotate(${Math.random() * 360}deg) translateX(0)`, opacity: 1 },
        { transform: `rotate(${Math.random() * 360}deg) translateX(${Math.random() * 100 + 50}px)`, opacity: 0 }
      ],
      'particle-ring': [
        { transform: 'scale(1)', opacity: 1, borderWidth: '2px' },
        { transform: 'scale(2)', opacity: 0, borderWidth: '0px' }
      ],
      'particle-trail': {
        duration: 1000,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards',
        iterations: 1
      }
    };

    const animation = particle.animate(
      animations[type as keyof typeof animations] || animations['particle-basic'],
      {
        duration: 1000 + Math.random() * 500,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
      }
    );

    animation.onfinish = () => particle.remove();
  }, []);

  const spawnParticles = useCallback((x: number, y: number) => {
    const container = document.querySelector('.particle-container') as HTMLDivElement;
    if (!container) return;

    const particleTypes = [
      'particle-basic',
      'particle-star',
      'particle-spark',
      'particle-ring',
      'particle-trail'
    ];

    // Spawn multiple waves of particles
    for (let wave = 0; wave < 3; wave++) {
      setTimeout(() => {
        for (let i = 0; i < 8; i++) {
          particleTypes.forEach(type => {
            const offsetX = (Math.random() - 0.5) * 20;
            const offsetY = (Math.random() - 0.5) * 20;
            createParticle(x + offsetX, y + offsetY, container, type);
          });
        }
      }, wave * 100);
    }
  }, [createParticle]);

  const rollDice = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    setMessage('');
    setSequence(Math.floor(Math.random() * 3) + 1);
    
    new Audio('https://www.soundjay.com/misc/sounds/dice-roll-01.mp3').play().catch(() => {});

    setTimeout(() => {
      const finalDice1 = Math.floor(Math.random() * 6) + 1;
      const finalDice2 = Math.floor(Math.random() * 6) + 1;
      setDice1(finalDice1);
      setDice2(finalDice2);
      setIsRolling(false);
      setIsShaking(true);
      
      // Get dice positions for particle effects
      const dice1El = document.querySelector('.dice-container:first-child');
      const dice2El = document.querySelector('.dice-container:last-child');
      
      if (dice1El) {
        const rect1 = dice1El.getBoundingClientRect();
        spawnParticles(rect1.left + rect1.width / 2, rect1.top + rect1.height / 2);
      }
      
      if (dice2El) {
        const rect2 = dice2El.getBoundingClientRect();
        spawnParticles(rect2.left + rect2.width / 2, rect2.top + rect2.height / 2);
      }
      
      const total = finalDice1 + finalDice2;
      if (finalDice1 === finalDice2) {
        setScore(prev => prev + total * 2);
        setMessage('CRITICAL HIT! Score multiplied by 2! ⚡');
      } else {
        setScore(prev => prev + total);
      }

      // Remove screen shake after animation
      setTimeout(() => setIsShaking(false), 500);
    }, 6500);
  };

  const resetGame = () => {
    if (score > highScore) {
      setHighScore(score);
    }
    setScore(0);
    setMessage('SYSTEM RESET');
    setDice1(1);
    setDice2(1);
  };

  useEffect(() => {
    const savedHighScore = localStorage.getItem('diceHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('diceHighScore', highScore.toString());
  }, [highScore]);

  return (
    <div className="min-h-screen bg-gray-900 text-teal-300 tron-bg">
      <div className={`container mx-auto px-4 py-8 relative ${isShaking ? 'screen-shake' : ''}`}>
        <ParticleSystem active={isRolling} position={particlePosition} />
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-teal-500 tron-glow">
              TRON DICE
            </h1>
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" />
              <p className="text-teal-400">Initialize sequence for critical hits</p>
              <Zap className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-lg rounded-xl p-8 border border-teal-500/30 shadow-[0_0_15px_rgba(79,209,197,0.3)] mb-8">
            <div className="flex justify-center gap-16 mb-8">
              <Die3D value={dice1} isRolling={isRolling} sequence={sequence} />
              <Die3D value={dice2} isRolling={isRolling} delay="0.1s" sequence={sequence} />
            </div>

            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={rollDice}
                disabled={isRolling}
                className="px-6 py-3 bg-teal-500/20 border-2 border-teal-400 rounded-lg font-bold transform transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(79,209,197,0.5)] disabled:opacity-50 disabled:cursor-not-allowed text-teal-300"
              >
                {isRolling ? 'PROCESSING...' : 'INITIALIZE'}
              </button>
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-gray-800/50 border-2 border-teal-400/50 rounded-lg font-bold transform transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(79,209,197,0.3)] flex items-center gap-2 text-teal-300"
              >
                <RotateCcw size={20} />
                RESET
              </button>
            </div>

            {message && (
              <div className="text-center text-teal-300 font-bold text-lg mb-4 animate-pulse tron-glow">
                {message}
              </div>
            )}
          </div>

          <ScoreCard currentScore={score} highScore={highScore} />
        </div>
      </div>
    </div>
  );
}

export default App;