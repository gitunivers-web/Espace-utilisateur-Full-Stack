interface SolventisLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function SolventisLogo({ className = "", showText = true, size = 'md' }: SolventisLogoProps) {
  const sizes = {
    sm: { height: 32, iconSize: 32, fontSize: 18, gap: 8 },
    md: { height: 40, iconSize: 40, fontSize: 22, gap: 10 },
    lg: { height: 48, iconSize: 48, fontSize: 28, gap: 12 },
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center ${className}`} style={{ gap: currentSize.gap }}>
      <svg
        width={currentSize.iconSize}
        height={currentSize.iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="48" height="48" rx="12" className="fill-primary" />
        <path
          d="M14 34V14h6v20h-6z"
          className="fill-primary-foreground"
        />
        <path
          d="M24 28V14h6v14h-6z"
          className="fill-emerald-400"
        />
        <path
          d="M34 22V14h-4v8h4z"
          className="fill-primary-foreground opacity-60"
        />
        <circle cx="37" cy="11" r="3" className="fill-emerald-400" />
      </svg>
      
      {showText && (
        <div className="flex flex-col leading-none">
          <span 
            className="font-bold tracking-tight text-foreground"
            style={{ fontSize: currentSize.fontSize }}
          >
            Solventis
          </span>
          <span 
            className="text-muted-foreground font-medium"
            style={{ fontSize: currentSize.fontSize * 0.5 }}
          >
            GROUP
          </span>
        </div>
      )}
    </div>
  );
}
