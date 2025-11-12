interface LendiaLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function LendiaLogo({ className = "", showText = true, size = 'md' }: LendiaLogoProps) {
  const sizes = {
    sm: { circle: 32, text: 80, textSize: 24 },
    md: { circle: 40, text: 100, textSize: 30 },
    lg: { circle: 48, text: 120, textSize: 36 },
  };

  const currentSize = sizes[size];
  const width = showText ? currentSize.circle + currentSize.text : currentSize.circle;

  return (
    <svg
      viewBox={`0 0 ${width} ${currentSize.circle}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circle background */}
      <circle
        cx={currentSize.circle / 2}
        cy={currentSize.circle / 2}
        r={currentSize.circle / 2}
        className="fill-[hsl(280,65%,55%)] dark:fill-[hsl(280,65%,60%)]"
      />
      
      {/* Letter L */}
      <text
        x={currentSize.circle / 2}
        y={currentSize.circle / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-white font-bold"
        fontSize={currentSize.circle * 0.6}
        fontFamily="Inter, sans-serif"
      >
        L
      </text>
      
      {/* Arrow */}
      <g transform={`translate(${currentSize.circle * 0.55}, ${currentSize.circle * 0.35})`}>
        <path
          d="M 0,8 L 8,0 L 8,6 L 14,6 L 14,10 L 8,10 L 8,16 Z"
          className="fill-[hsl(180,100%,45%)] dark:fill-[hsl(180,100%,50%)]"
          transform={`scale(${currentSize.circle / 50})`}
        />
      </g>
      
      {/* Lendia text */}
      {showText && (
        <text
          x={currentSize.circle + 10}
          y={currentSize.circle / 2}
          textAnchor="start"
          dominantBaseline="central"
          className="fill-[hsl(270,35%,25%)] dark:fill-[hsl(280,30%,90%)] font-bold"
          fontSize={currentSize.textSize}
          fontFamily="Inter, sans-serif"
        >
          Lendia
        </text>
      )}
    </svg>
  );
}
