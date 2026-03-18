interface LikertScaleProps {
  value?: number;
  onChange: (value: number) => void;
  showSpecialOptions?: boolean;
}

export const LikertScale = ({ value, onChange, showSpecialOptions = true }: LikertScaleProps) => {
  const mainOptions = [1, 2, 3, 4, 5];
  const specialOptions = [
    { label: "Nem tudom", value: 98 },
    { label: "Nem válaszolok", value: 99 }
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          {mainOptions.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={`survey-scale-btn w-12 h-12 rounded-full border-2 text-lg font-medium transition-all duration-200 ${
                value === n 
                  ? "bg-primary text-primary-foreground border-primary shadow-md scale-110" 
                  : "bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex justify-between max-w-[280px] text-[10px] text-muted-foreground px-1 uppercase tracking-wider font-semibold">
          <span>Egyáltalán nem</span>
          <span>Teljes mértékben</span>
        </div>
      </div>

      {showSpecialOptions && (
        <div className="flex gap-2 flex-wrap pt-2 border-t border-border/50">
          {specialOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`px-3 py-1.5 rounded-full border text-xs transition-all duration-200 ${
                value === opt.value
                  ? "bg-muted text-muted-foreground border-muted-foreground/30 shadow-sm"
                  : "bg-background text-muted-foreground border-input hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
