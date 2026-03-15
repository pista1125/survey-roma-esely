import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClipboardList, ShieldCheck, Clock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero */}
      <section className="relative flex-1 flex items-center justify-center px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/30" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 max-w-2xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-5xl font-display text-foreground mb-6 leading-tight">
            Roma esélyegyenlőség a munkaerőpiacon
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed">
            Kvantitatív kutatás a munkáltatói attitűdökről és a roma munkavállalók
            munkaerőpiaci esélyegyenlőségéről Magyarországon.
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-6 rounded-xl shadow-lg"
            onClick={() => navigate("/survey")}
          >
            <ClipboardList className="mr-2 h-5 w-5" />
            Kérdőív kitöltése
          </Button>
        </motion.div>
      </section>

      {/* Info cards */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Clock,
              title: "~10 perc",
              desc: "A kérdőív kitöltése mindössze néhány percet vesz igénybe.",
            },
            {
              icon: ShieldCheck,
              title: "Anonim",
              desc: "A válaszok anonim módon kerülnek feldolgozásra.",
            },
            {
              icon: ClipboardList,
              title: "30 kérdés",
              desc: "Kutatási és demográfiai kérdések Likert-skálás és feleletválasztós formátumban.",
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
              className="bg-card rounded-xl border border-border p-6 text-center shadow-sm"
            >
              <card.icon className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-display text-xl text-card-foreground mb-2">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
