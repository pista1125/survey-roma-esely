import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="text-3xl font-display text-foreground mb-4">Köszönjük!</h1>
        <p className="text-muted-foreground mb-8">
          A válaszai sikeresen rögzítésre kerültek. Köszönjük, hogy hozzájárult a kutatásunkhoz!
        </p>
        <Button variant="outline" onClick={() => navigate("/")}>
          Vissza a főoldalra
        </Button>
      </motion.div>
    </div>
  );
};

export default ThankYou;
