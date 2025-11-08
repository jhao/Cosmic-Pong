import React from 'react';

const Firework: React.FC<{ left: string; top: string; delay: number }> = ({ left, top, delay }) => {
  const particleCount = 15;
  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * 360;
    particles.push(
      <div
        key={i}
        className="absolute w-1 h-1 bg-yellow-300 rounded-full"
        style={{
          animation: `explode 0.8s ease-out forwards`,
          animationDelay: `${delay + 0.5}s`,
          transform: `rotate(${angle}deg) translateX(40px)`,
          opacity: 0
        }}
      />
    );
  }

  return (
    <div className="absolute" style={{ left, top }}>
      <style>{`
        @keyframes shoot {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-100px); opacity: 0; }
        }
        @keyframes explode {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
      <div
        className="absolute w-2 h-4 bg-white rounded-t-full"
        style={{
          animation: `shoot 0.5s ease-in forwards`,
          animationDelay: `${delay}s`,
          opacity: 0,
        }}
      />
      <div className="relative">{particles}</div>
    </div>
  );
};

const Fireworks: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      <Firework left="20%" top="50%" delay={0} />
      <Firework left="80%" top="40%" delay={0.3} />
      <Firework left="50%" top="60%" delay={0.6} />
    </div>
  );
};

export default Fireworks;
