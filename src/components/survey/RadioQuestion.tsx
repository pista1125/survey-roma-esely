import { Input } from "@/components/ui/input";

interface RadioQuestionProps {
  options: string[];
  value?: string;
  onChange: (value: string) => void;
  showOther?: boolean;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
}

export const RadioQuestion = ({ 
  options, 
  value, 
  onChange, 
  showOther, 
  otherValue, 
  onOtherChange 
}: RadioQuestionProps) => {
  const isOtherSelected = showOther && (
    value === options[options.length - 1] || 
    value?.toLowerCase().includes("egyéb")
  );

  return (
    <div className="space-y-3">
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
      
      {isOtherSelected && onOtherChange && (
        <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <Input
            placeholder="Kérjük, pontosítsa..."
            value={otherValue || ""}
            onChange={(e) => onOtherChange(e.target.value)}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};
