interface RadioQuestionProps {
  options: string[];
  value?: string;
  onChange: (value: string) => void;
}

export const RadioQuestion = ({ options, value, onChange }: RadioQuestionProps) => {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all duration-200 ${
            value === option
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
