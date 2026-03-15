import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { LikertScale } from "@/components/survey/LikertScale";
import { RadioQuestion } from "@/components/survey/RadioQuestion";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";

type SurveyData = Record<string, string | number | null>;

const SECTIONS = [
  {
    title: "1. Általános percepció a roma esélyegyenlőségről",
    questions: [
      { key: "q1", type: "likert" as const, text: "A roma emberek munkaerőpiaci hátrányai ma is valós problémát jelentenek Magyarországon." },
      { key: "q2", type: "likert" as const, text: "A munkáltatóknak aktív szerepet kell vállalniuk a roma esélyegyenlőség javításában." },
      { key: "q3", type: "likert" as const, text: "A roma származás egy állásjelölt megítélésében nem releváns szempont." },
      { key: "q4", type: "likert" as const, text: "A magyar munkaerőpiac alapvetően igazságosan működik a roma jelentkezőkkel szemben." },
    ],
  },
  {
    title: "2. Személyes és szervezeti tapasztalat",
    questions: [
      { key: "q5", type: "radio" as const, text: "Találkozott-e roma származású munkavállalóval vagy állásjelentkezővel a munkája során?", options: ["igen", "nem", "nem tudom / nem derült ki"] },
      { key: "q6", type: "likert" as const, text: "Az Ön tapasztalata alapján roma munkavállalók ugyanolyan megbízhatóak lehetnek, mint más munkavállalók." },
      { key: "q7", type: "radio" as const, text: "A szervezetemben jelenleg is dolgoznak roma származású munkavállalók.", options: ["igen", "nem", "nem tudom"] },
      { key: "q8", type: "likert" as const, text: "A kiválasztási folyamataink alkalmasak arra, hogy csökkentsék az előítéletek hatását." },
    ],
  },
  {
    title: "3. Vélt akadályok",
    questions: [
      { key: "q9", type: "likert" as const, text: "A roma munkavállalók munkaerőpiaci hátrányainak egyik fő oka az oktatási rendszerből fakad." },
      { key: "q10", type: "likert" as const, text: "A munkáltatói előítéletek jelentős szerepet játszanak a roma esélyegyenlőtlenségben." },
      { key: "q11", type: "likert" as const, text: "A roma munkavállalók foglalkoztatását leginkább a megfelelő készségek hiánya nehezíti." },
      { key: "q12", type: "likert" as const, text: "A roma integráció kérdése inkább társadalmi probléma, mint vállalati felelősség." },
    ],
  },
  {
    title: "4. Nyitottság vállalati lépésekre",
    questions: [
      { key: "q13", type: "likert" as const, text: "Nyitott lennék arra, hogy szervezetünk célzottan támogassa roma jelentkezők bevonását a toborzásba." },
      { key: "q14", type: "likert" as const, text: "Hasznosnak tartanám, ha a vezetők képzést kapnának az előítéletmentes kiválasztásról." },
      { key: "q15", type: "likert" as const, text: "A roma esélyegyenlőség javítása üzleti szempontból is értelmezhető cél lehet a vállalatok számára." },
    ],
  },
  {
    title: "5. Komfortzóna és percepció",
    questions: [
      { key: "q16", type: "likert" as const, text: "Nem jelentene számomra kockázatot roma származású munkavállaló felvétele ügyfélkapcsolati szerepkörbe." },
      { key: "q17", type: "likert" as const, text: "Nem jelentene számomra kockázatot roma származású munkavállaló felvétele vezetői potenciállal rendelkező pozícióba." },
      { key: "q18", type: "likert" as const, text: "Egy roma munkavállaló felvétele esetén nem tartanék negatív reakciótól a csapat részéről." },
    ],
  },
  {
    title: "6. Kontrollkérdés",
    questions: [
      { key: "q19", type: "likert" as const, text: "Annak ellenőrzésére, hogy figyelmesen olvassa a kérdéseket, kérjük ennél az állításnál válassza a 4-es értéket.\n\n„Figyelmesen olvasom a kérdőív kérdéseit."" },
    ],
  },
  {
    title: "7. Összegző percepció",
    questions: [
      { key: "q20", type: "radio" as const, text: "Ön szerint a következő 10 évben javulni fog a roma emberek munkaerőpiaci esélyegyenlősége Magyarországon?", options: ["jelentősen romlani fog", "inkább romlani fog", "nem változik", "inkább javulni fog", "jelentősen javulni fog"] },
    ],
  },
  {
    title: "Demográfiai és háttérkérdések",
    intro: "A következő kérdések a válaszadók általános jellemzőire vonatkoznak. Az adatokat kizárólag statisztikai célból használjuk fel, és a kutatás eredményei anonim módon kerülnek feldolgozásra.",
    questions: [
      { key: "age_group", type: "radio" as const, text: "Életkor", options: ["18–29", "30–39", "40–49", "50–59", "60+"] },
      { key: "gender", type: "radio" as const, text: "Nem", options: ["nő", "férfi", "egyéb", "nem kíván válaszolni"] },
      { key: "region", type: "radio" as const, text: "Lakóhely régió", options: ["Budapest", "Közép-Magyarország", "Nyugat-Dunántúl", "Közép-Dunántúl", "Dél-Dunántúl", "Észak-Magyarország", "Észak-Alföld", "Dél-Alföld", "külföld"] },
      { key: "position", type: "radio" as const, text: "Beosztás", options: ["tulajdonos / alapító", "vezérigazgató / felsővezető", "középvezető", "HR vezető / HR szakember", "szakértő", "egyéb"] },
    ],
  },
  {
    title: "Demográfiai kérdések (folytatás)",
    questions: [
      { key: "hiring_involvement", type: "radio" as const, text: "Milyen mértékben vesz részt felvételi döntésekben?", options: ["nem veszek részt", "alkalmanként", "rendszeresen", "én hozom a végső döntést"] },
      { key: "hiring_decisions_count", type: "radio" as const, text: "Az elmúlt 12 hónapban hány felvételi döntésben vett részt?", options: ["0", "1–2", "3–5", "6–10", "10+"] },
      { key: "org_size", type: "radio" as const, text: "A szervezet mérete", options: ["1–9 fő", "10–49 fő", "50–249 fő", "250–999 fő", "1000+ fő"] },
      { key: "industry", type: "radio" as const, text: "Iparág", options: ["pénzügyi szektor", "IT / technológia", "gyártás / ipar", "kereskedelem", "szolgáltatások", "tanácsadás / professzionális szolgáltatások", "állami / közszféra", "egyéb"] },
    ],
  },
  {
    title: "Befejezés",
    questions: [
      { key: "org_ownership", type: "radio" as const, text: "A szervezet tulajdonosi háttere", options: ["magyar tulajdon", "nemzetközi vállalat", "vegyes"] },
      { key: "email", type: "text" as const, text: "Ha szeretne értesítést kapni a kutatás eredményeiről, kérjük adja meg e-mail címét (nem kötelező):" },
    ],
  },
];

const Survey = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [data, setData] = useState<SurveyData>({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const totalSections = SECTIONS.length;
  const progress = ((currentSection + 1) / totalSections) * 100;
  const section = SECTIONS[currentSection];

  const setValue = (key: string, value: string | number) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    return section.questions.every((q) => {
      if (q.key === "email") return true; // optional
      return data[q.key] !== undefined && data[q.key] !== null && data[q.key] !== "";
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(data)) {
        payload[key] = value;
      }

      const { error } = await supabase.from("survey_responses").insert(payload as any);
      if (error) throw error;

      toast.success("Köszönjük a kitöltést!", { description: "A válaszai sikeresen rögzítésre kerültek." });
      navigate("/thank-you");
    } catch (err: any) {
      toast.error("Hiba történt", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              {currentSection + 1} / {totalSections}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-display text-card-foreground mb-2">{section.title}</h2>
              {(section as any).intro && (
                <p className="text-sm text-muted-foreground mb-6 italic">{(section as any).intro}</p>
              )}

              <div className="space-y-8 mt-6">
                {section.questions.map((q) => (
                  <div key={q.key}>
                    <p className="text-sm font-medium text-foreground mb-3 whitespace-pre-line">{q.text}</p>
                    {q.type === "likert" && (
                      <LikertScale value={data[q.key] as number | undefined} onChange={(v) => setValue(q.key, v)} />
                    )}
                    {q.type === "radio" && (
                      <RadioQuestion
                        options={q.options!}
                        value={data[q.key] as string | undefined}
                        onChange={(v) => setValue(q.key, v)}
                      />
                    )}
                    {q.type === "text" && (
                      <input
                        type="email"
                        placeholder="pelda@email.com"
                        value={(data[q.key] as string) || ""}
                        onChange={(e) => setValue(q.key, e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setCurrentSection((s) => s - 1)}
                  disabled={currentSection === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Előző
                </Button>

                {currentSection < totalSections - 1 ? (
                  <Button
                    onClick={() => setCurrentSection((s) => s + 1)}
                    disabled={!canProceed()}
                  >
                    Következő <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={submitting || !canProceed()}>
                    <Send className="mr-2 h-4 w-4" />
                    {submitting ? "Küldés..." : "Beküldés"}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Survey;
