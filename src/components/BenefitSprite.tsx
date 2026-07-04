import React, { useState, useEffect } from 'react';

interface BenefitSpriteProps {
  sheet: string;
  index: number;
  alt: string;
  className?: string;
}

const BenefitSprite: React.FC<BenefitSpriteProps> = ({ sheet, index, alt, className = "" }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageUrl = `/images/${sheet}`;

  useEffect(() => {
    setIsLoaded(false);

    const img = new Image();
    img.src = imageUrl;

    if (img.complete) {
      setIsLoaded(true);
      return;
    }

    img.onload = () => {
      setIsLoaded(true);
    };
    img.onerror = () => {
      setIsLoaded(true);
    };
  }, [imageUrl]);

  // Assuming a 2x2 sprite sheet layout (4 images per sheet)
  // Index 0: Top-Left (0% 0%)
  // Index 1: Top-Right (100% 0%)
  // Index 2: Bottom-Left (0% 100%)
  // Index 3: Bottom-Right (100% 100%)
  const x = (index % 2) * 100;
  const y = Math.floor(index / 2) * 100;

  return (
    <div className="relative w-full h-full bg-white overflow-hidden">
      {/* Shimmer / Spinner Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-50 animate-pulse flex items-center justify-center z-20">
          <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-[var(--accent,#F97316)] animate-spin" />
        </div>
      )}

      {/* Sprite Image Container */}
      <div 
        className={`w-full h-full bg-no-repeat transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundPosition: `${x}% ${y}%`,
          backgroundSize: '200% 200%',
        }}
        role="img"
        aria-label={alt}
      />
    </div>
  );
};

export default BenefitSprite;
