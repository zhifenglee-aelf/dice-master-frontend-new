import React from 'react';

interface DiceFaceProps {
  value: number;
  position: 'front' | 'back' | 'right' | 'left' | 'top' | 'bottom';
}

const DiceFace: React.FC<DiceFaceProps> = ({ value, position }) => {
  const dots = Array(value).fill(0);
  
  const getDotsLayout = () => {
    switch (value) {
      case 1:
        return "grid-center";
      case 2:
        return "grid-diagonal-2";
      case 3:
        return "grid-diagonal-3";
      case 4:
        return "grid-corners";
      case 5:
        return "grid-corners-center";
      case 6:
        return "grid-sides";
      default:
        return "";
    }
  };

  const transforms: Record<string, string> = {
    front: 'rotateY(0deg) translateZ(2rem)',
    back: 'rotateY(180deg) translateZ(2rem)',
    right: 'rotateY(90deg) translateZ(2rem)',
    left: 'rotateY(-90deg) translateZ(2rem)',
    top: 'rotateX(90deg) translateZ(2rem)',
    bottom: 'rotateX(-90deg) translateZ(2rem)',
  };

  return (
    <div
      className={`dice-face absolute w-16 h-16 bg-white rounded-lg ${getDotsLayout()}`}
      style={{ transform: transforms[position] }}
    >
      {dots.map((_, i) => (
        <div
          key={i}
          className="dot w-3 h-3 bg-purple-900 rounded-full"
        />
      ))}
    </div>
  );
};

export default DiceFace;