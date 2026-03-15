interface LikertScaleProps {
  value?: number;
  onChange: (value: number) => void;
}

export const LikertScale = ({ value, onChange }: LikertScaleProps) => {
  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap">
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`survey-scale-btn ${value === n ? "active" : ""}`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-1 text-xs text-muted-foreground px-1">
        <span>Egyáltalán nem ért egyet</span>
        <span>Teljesen egyetért</span>
      </div>
    </div>
  );
};
