import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { LikertScale } from "@/components/survey/LikertScale";
import { RadioQuestion } from "@/components/survey/RadioQuestion";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";

type SurveyData = Record<string, string | number | null>;

const SECTIONS = [
  {
    title: "Alapadatok I.",
    intro: "Jelen kutatás célja, hogy feltérképezze a hazai vállalkozások vezetőinek véleményét a roma munkavállalók munkaerőpiaci helyzetéről. A kitöltés kb. 10 percet vesz igénybe.",
    questions: [
      { 
        key: "gender", 
        type: "radio" as const, 
        text: "1. Az Ön neme", 
        options: ["Nő", "Férfi", "Egyéb", "Nem válaszolok"] 
      },
      { 
        key: "company_form", 
        type: "radio" as const, 
        text: "2. Mi az Ön vállalkozásának, cégének társas vállalkozási formája?", 
        options: ["Egyéni vállalkozó", "Egyszemélyes Kft.", "Egyéni cég", "Betéti társaság", "Korlátolt felelősségű társaság (Kft.)", "Részvénytársaság", "Egyik sem ezek közül, ettől eltérő", "Nem válaszolok"] 
      },
      { 
        key: "county", 
        type: "radio" as const, 
        text: "3. Melyik vármegyében található az Ön cégének, vállalkozásának székhelye?", 
        options: ["Budapest", "Bács-Kiskun", "Baranya", "Békés", "Borsod-Abaúj-Zemplén", "Csongrád-Csanád", "Fejér", "Győr-Moson-Sopron", "Hajdú-Bihar", "Heves", "Jász-Nagykun-Szolnok", "Komárom-Esztergom", "Nógrád", "Pest", "Somogy", "Szabolcs-Szatmár-Bereg", "Tolna", "Vas", "Veszprém", "Zala", "Nem válaszolok"] 
      },
    ],
  },
  {
    title: "Alapadatok II.",
    questions: [
      { 
        key: "position", 
        type: "radio" as const, 
        text: "4. Mi az Ön beosztása a vállalaton, cégen belül?", 
        options: ["Tulajdonos / alapító", "Ügyvezető igazgató", "Egyéb felsővezető", "Középvezető", "HR-vezető / HR-szakember", "Szakértő", "Beosztott", "Egyéb, éspedig", "Nem válaszolok"],
        showOther: true,
        otherKey: "position_other"
      },
      { 
        key: "emp_count", 
        type: "radio" as const, 
        text: "5. Mindent összevetve az Önök vállalata, cége hány főt foglalkoztat?", 
        options: ["1–9 fő", "10–49 fő", "50–249 fő", "250–999 fő", "1000 fő vagy több", "Nem válaszolok"] 
      },
      { 
        key: "sector", 
        type: "radio" as const, 
        text: "6. Milyen szektorban tevékenykedik az Önök cége, vállalkozása?", 
        options: ["Mezőgazdaság", "Ipar", "Szolgáltatás", "Pénzügy", "IT / technológia", "Állami / közszféra", "Kereskedelem", "Egyéb", "Nem tudom", "Nem válaszolok"] 
      },
    ],
  },
  {
    title: "Alapadatok III.",
    questions: [
      { 
        key: "ownership", 
        type: "radio" as const, 
        text: "7. Az Önök szervezetének tulajdonosi háttere", 
        options: ["Teljes mértékben magyar tulajdon", "Nemzetközi vállalat", "Vegyes tulajdonviszony", "Nem tudom", "Nem válaszolok"] 
      },
      { 
        key: "hiring_freq", 
        type: "radio" as const, 
        text: "8. Ön milyen gyakran szokott részt venni a vállalatánál történő felvételi döntésekben?", 
        options: ["Nem veszek részt", "Alkalmanként", "Rendszeresen", "Én hozom a végső döntést", "Nem válaszolok"] 
      },
    ],
  },
  {
    title: "Szervezeti működés",
    intro: "A következőkben az Önök vállalatának működésére kérdezünk.",
    questions: [
      { 
        key: "q9", 
        type: "likert" as const, 
        text: "9. Megítélése szerint az Önök szervezetében mennyire érvényesülnek objektív, előre meghatározott szempontok a kiválasztási döntések során?" 
      },
      { 
        key: "q11", 
        type: "radio" as const, 
        text: "11. A tudomása szerint volt-e az Önök szervezetében az elmúlt 3 évben olyan kezdeményezés vagy intézkedés, amely a sokszínűséget, befogadást vagy esélyegyenlőséget támogatta?", 
        options: ["Igen", "Nem", "Nem tudom", "Nem válaszolok"] 
      },
      { 
        key: "q12", 
        type: "likert" as const, 
        text: "12. A megítélése szerint az Önök szervezete mennyire nyitott a hátrányos helyzetű csoportokhoz tartozó munkavállalók foglalkoztatására?" 
      },
      { 
        key: "q13", 
        type: "radio" as const, 
        text: "13. Mennyire tartja szükségesnek a további lépések megtételét a befogadóbb munkahelyi környezet erősítése érdekében?", 
        options: ["Egyáltalán nem tartom szükségesnek", "Inkább nem tartom szükségesnek", "Inkább szükségesnek tartom", "Teljes mértékben szükségesnek tartom"] 
      },
    ],
  },
  {
    title: "Tapasztalatok",
    questions: [
      { 
        key: "q14", 
        type: "radio" as const, 
        text: "14. Találkozott az elmúlt 3 évben olyan helyzettel, amikor roma származású jelentkező is részt vett kiválasztási folyamatban az Önök szervezeténél?", 
        options: ["Igen", "Nem", "Nem tudom", "Nem válaszolok"] 
      },
      { 
        key: "q15", 
        type: "radio" as const, 
        text: "15. Dolgozik jelenleg az Önök szervezetében roma származású munkavállaló az Ön tudomása szerint?", 
        options: ["Igen", "Nem", "Nem tudom", "Nem válaszolok"] 
      },
    ],
  },
  {
    title: "Roma esélyegyenlőség - Vélemények",
    intro: "Kérjük, jelezze, mennyire ért egyet az egyes állításokkal! (1 = egyáltalán nem, 5 = teljes mértékben)",
    questions: [
      { key: "p1", type: "likert" as const, text: "A roma emberek munkaerőpiaci hátrányai ma is valós problémát jelentenek Magyarországon." },
      { key: "p2", type: "likert" as const, text: "A munkáltatóknak felelősségük van a roma esélyegyenlőség előmozdításában." },
      { key: "p3", type: "likert" as const, text: "Az utóbbi években jelentős előrelépések történtek a roma emberek munkaerőpiaci helyzetének javításában." },
      { key: "p4", type: "likert" as const, text: "A roma jelentkezőknek gyakran nehezebb dolguk van az álláskeresés során, mint a nem roma jelentkezőknek." },
      { key: "p5", type: "likert" as const, text: "A munkahelyi diszkrimináció csökkentése fontos feltétele a roma integrációnak." },
      { key: "p6", type: "likert" as const, text: "A magyarországi munkáltatók többsége nyitott a roma munkavállalók foglalkoztatására." },
      { key: "p7", type: "likert" as const, text: "A roma munkavállalók számára ugyanazoknak az előrelépési lehetőségeknek kellene elérhetőnek lenniük." },
      { key: "p8", type: "likert" as const, text: "A roma emberek foglalkoztatási helyzetének javítása társadalmi és gazdasági szempontból is fontos." },
      { key: "p9", type: "likert" as const, text: "A munkahelyi befogadás megerősítése hozzájárulhat a roma közösségek integrációjához." },
      { key: "p10", type: "likert" as const, text: "A roma munkavállalók ugyanolyan megbízhatóak lehetnek, mint bárki más." },
    ],
  },
  {
    title: "Akadályok feltérképezése",
    questions: [
      { key: "b1", type: "likert" as const, text: "A roma munkavállalók munkaerőpiaci hátrányainak fő oka a megfelelő végzettség és a készségek hiánya." },
      { key: "b2", type: "likert" as const, text: "A munkáltatói előítéletek jelentős szerepet játszanak a roma munkavállalók esélyegyenlőtlenségében." },
      { key: "b3", type: "likert" as const, text: "A roma munkavállalók hátrányait inkább társadalmi és intézményi tényezők okozzák." },
      { key: "b4", type: "likert" as const, text: "A roma integráció előmozdítása elsősorban állami és társadalmi feladat, nem a munkáltatóké." },
      { key: "b5", type: "likert" as const, text: "A roma munkavállalók helyzetének javításához célzott támogatásokra és programokra is szükség van." },
      { key: "b6", type: "likert" as const, text: "A roma munkavállalók foglalkoztatási esélyeit jobban javítaná az egységes megközelítés, mint a külön támogatás." },
    ],
  },
  {
    title: "Vállalati intézkedések hasznossága",
    intro: "Ön mennyire tartaná hasznosnak az alábbi vállalati intézkedéseket? (1 = egyáltalán nem, 5 = teljes mértékben)",
    questions: [
      { key: "a1", type: "likert" as const, text: "Tudatos toborzási lépések bevezetése a roma jelentkezők hatékonyabb elérése érdekében." },
      { key: "a2", type: "likert" as const, text: "A vezetők és a kiválasztásban részt vevő munkatársak képzése az előítéletmentes kiválasztásról." },
      { key: "a3", type: "likert" as const, text: "Olyan vállalati célok kijelölése, amelyek a roma esélyegyenlőség javítását is támogatják." },
      { key: "a4", type: "likert" as const, text: "Tudatos lépések megtétele egy befogadóbb munkahelyi környezet kialakítása érdekében." },
      { key: "a5", type: "likert" as const, text: "Olyan belső kommunikációs és vezetői eszközök alkalmazása, amelyek csökkenthetik az ellenállást." },
    ],
  },
  {
    title: "Összefoglalás",
    questions: [
      { 
        key: "future_outlook", 
        type: "radio" as const, 
        text: "19. Mit gondol, a következő 10 évben hogyan alakul a roma emberek munkaerőpiaci esélyegyenlősége Magyarországon?", 
        options: ["Jelentősen romlani fog", "Inkább romlani fog", "Nem változik", "Inkább javulni fog", "Jelentősen javulni fog", "Nem tudom megítélni", "Nem válaszolok"] 
      },
      { 
        key: "effective_step", 
        type: "textarea" as const, 
        text: "20. Ön szerint mi lenne a leghatékonyabb lépés a roma munkavállalók munkaerőpiaci esélyeinek javítására?" 
      },
      { 
        key: "email", 
        type: "text" as const, 
        text: "Ha szeretne értesítést kapni a kutatás eredményeiről, kérjük adja meg az e-mail címét (opcionális):" 
      },
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

  const setValue = (key: string, value: string | number | null) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    return section.questions.every((q) => {
      if (q.key === "email" || q.key === "effective_step") return true; 
      const val = data[q.key];
      return val !== undefined && val !== null && val !== "";
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { error } = await supabase.from("survey_responses").insert(data as any);
      if (error) throw error;

      toast.success("Köszönjük a kitöltést!");
      navigate("/thank-you");
    } catch (err: any) {
      console.error("Supabase Error Details:", err);
      const detailedError = err.details || err.hint || err.message || "Ismeretlen hiba";
      toast.error("Hiba történt a mentés során", { 
        description: `Részletek: ${detailedError}`
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-500">
              Szakasz: {currentSection + 1} / {totalSections}
            </span>
            <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-200" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-10 shadow-xl shadow-slate-200/50">
              <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">{section.title}</h2>
              {section.intro && (
                <p className="text-slate-600 mb-8 leading-relaxed border-l-4 border-primary/20 pl-4 py-1">{section.intro}</p>
              )}

              <div className="space-y-10 mt-6">
                {section.questions.map((q) => (
                  <div key={q.key} className="group">
                    <p className="text-base font-semibold text-slate-800 mb-4 group-hover:text-primary transition-colors duration-200">
                      {q.text}
                    </p>
                    {q.type === "likert" && (
                      <LikertScale 
                        value={data[q.key] as number | undefined} 
                        onChange={(v) => setValue(q.key, v)} 
                      />
                    )}
                    {q.type === "radio" && (
                      <RadioQuestion
                        options={q.options!}
                        value={data[q.key] as string | undefined}
                        onChange={(v) => setValue(q.key, v)}
                        showOther={(q as any).showOther}
                        otherValue={data[(q as any).otherKey] as string}
                        onOtherChange={(v) => setValue((q as any).otherKey, v)}
                      />
                    )}
                    {q.type === "textarea" && (
                      <Textarea
                        placeholder="Írja le véleményét..."
                        value={(data[q.key] as string) || ""}
                        onChange={(e) => setValue(q.key, e.target.value)}
                        className="min-h-[120px] bg-slate-50 border-slate-200 focus:bg-white transition-all"
                      />
                    )}
                    {q.type === "text" && (
                      <Input
                        type="text"
                        placeholder="..."
                        value={(data[q.key] as string) || ""}
                        onChange={(e) => setValue(q.key, e.target.value)}
                        className="bg-slate-50 border-slate-200 focus:bg-white"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-12 pt-8 border-t border-slate-100">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentSection((s) => s - 1)}
                  disabled={currentSection === 0}
                  className="hover:bg-slate-100"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Vissza
                </Button>

                {currentSection < totalSections - 1 ? (
                  <Button
                    onClick={() => setCurrentSection((s) => s + 1)}
                    disabled={!canProceed()}
                    className="px-8 shadow-lg shadow-primary/20"
                  >
                    Következő <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit} 
                    disabled={submitting || !canProceed()}
                    className="px-10 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200"
                  >
                    {submitting ? "Küldés..." : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Beküldés
                      </>
                    )}
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
