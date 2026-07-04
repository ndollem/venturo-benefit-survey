import React from 'react';

interface BenefitSpriteProps {
  sheet: string;
  index: number;
  alt: string;
  className?: string;
}

const BenefitSprite: React.FC<BenefitSpriteProps> = ({ sheet, index, alt, className = "" }) => {
  // Assuming a 2x2 sprite sheet layout (4 images per sheet)
  // Index 0: Top-Left (0% 0%)
  // Index 1: Top-Right (100% 0%)
  // Index 2: Bottom-Left (0% 100%)
  // Index 3: Bottom-Right (100% 100%)
  const x = (index % 2) * 100;
  const y = Math.floor(index / 2) * 100;

  return (
    <div 
      className={`relative w-full h-full bg-no-repeat overflow-hidden transition-all duration-300 ${className}`}
      style={{
        backgroundImage: `url(/images/${sheet})`,
        backgroundPosition: `${x}% ${y}%`,
        backgroundSize: '200% 200%',
        backgroundColor: '#FFFFFF' // Fallback white background
      }}
      role="img"
      aria-label={alt}
    />
  );
};

export default BenefitSprite;
