import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, LogIn, LogOut, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const QUESTION_LABELS: Record<string, string> = {
  gender: "Neme",
  company_form: "Vállalkozási forma",
  county: "Vármegye",
  position: "Beosztás",
  position_other: "Beosztás (egyéb)",
  emp_count: "Létszám",
  sector: "Szektor",
  ownership: "Tulajdon",
  hiring_freq: "Felvételi gyakoriság",
  q9: "9. Objektív szempontok",
  q11: "11. Sokszínűségi kezdeményezés",
  q12: "12. Nyitottság hátrányos helyzetűekre",
  q13: "13. További lépések szükségessége",
  q14: "14. Roma jelentkező tapasztalat",
  q15: "15. Jelenlegi roma munkavállaló",
  p1: "P1: Hátrányok valósak",
  p2: "P2: Munkáltatói felelősség",
  p3: "P3: Előrelépések történtek",
  p4: "P4: Álláskeresési nehézség",
  p5: "P5: Diszkrimináció csökkentése",
  p6: "P6: Nyitott munkáltatók",
  p7: "P7: Esélyegyenlőség előrelépésben",
  p8: "P8: Társadalmi/gazdasági fontosság",
  p9: "P9: Befogadás integrációhoz",
  p10: "P10: Megbízhatóság",
  b1: "B1: Végzettség hiánya",
  b2: "B2: Munkáltatói előítéletek",
  b3: "B3: Társadalmi tényezők",
  b4: "B4: Állami feladat",
  b5: "B5: Célzott támogatás",
  b6: "B6: Egységes megközelítés",
  a1: "A1: Tudatos toborzás",
  a2: "A2: Vezetői képzés",
  a3: "A3: Vállalati célok",
  a4: "A4: Befogadó környezet",
  a5: "A5: Belső kommunikáció",
  future_outlook: "19. 10 éves várakozás",
  effective_step: "20. Leghatékonyabb lépés",
  email: "E-mail",
  created_at: "Dátum",
};

const CSV_COLUMNS = [
  "id", "created_at", "email",
  "gender", "company_form", "county", "position", "position_other", "emp_count", "sector", "ownership", "hiring_freq",
  "q9", "q11", "q12", "q13", "q14", "q15",
  "p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10",
  "b1", "b2", "b3", "b4", "b5", "b6",
  "a1", "a2", "a3", "a4", "a5",
  "future_outlook", "effective_step"
];

const Admin = () => {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast.error(error.message);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setResponses([]);
  };

  const fetchResponses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("survey_responses")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error(error.message);
    } else {
      setResponses(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (session) fetchResponses();
  }, [session]);

  const downloadCSV = () => {
    if (responses.length === 0) return;
    const headers = CSV_COLUMNS.map((c) => QUESTION_LABELS[c] || c);
    const rows = responses.map((r) =>
      CSV_COLUMNS.map((c) => {
        const val = r[c];
        if (val === null || val === undefined) return "";
        const str = String(val);
        return str.includes(",") || str.includes('"') || str.includes("\n")
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      }).join(",")
    );
    const bom = "\uFEFF";
    const csv = bom + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kutatás_válaszok_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="bg-card border border-border rounded-xl p-8 w-full max-w-sm shadow-sm">
          <h2 className="text-2xl font-display text-card-foreground mb-6 text-center">Admin belépés</h2>
          <div className="space-y-4">
            <Input placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Jelszó" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} />
            <Button className="w-full" onClick={login}>
              <LogIn className="mr-2 h-4 w-4" /> Belépés
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-display text-foreground">Válaszok összesítése</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchResponses} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Frissítés
            </Button>
            <Button variant="outline" size="sm" onClick={downloadCSV} disabled={responses.length === 0}>
              <Download className="mr-2 h-4 w-4" /> CSV letöltés
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" /> Kilépés
            </Button>
          </div>
        </div>

        <p className="text-muted-foreground mb-4">Összesen {responses.length} kitöltés</p>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap">#</th>
                  <th className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap">Dátum</th>
                  <th className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap">E-mail</th>
                  {CSV_COLUMNS.filter(c => !["id", "created_at", "email"].includes(c)).map((col) => (
                    <th key={col} className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap">
                      {QUESTION_LABELS[col] || col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {responses.map((r, idx) => (
                  <tr key={r.id} className="border-b border-border hover:bg-muted/30">
                    <td className="p-3 text-muted-foreground">{idx + 1}</td>
                    <td className="p-3 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString("hu-HU")}</td>
                    <td className="p-3">{r.email || "–"}</td>
                    {CSV_COLUMNS.filter(c => !["id", "created_at", "email"].includes(c)).map((col) => (
                      <td key={col} className="p-3 max-w-[200px] truncate" title={String(r[col] || "")}>
                        {r[col] ?? "–"}
                      </td>
                    ))}
                  </tr>
                ))}
                {responses.length === 0 && (
                  <tr>
                    <td colSpan={23} className="p-8 text-center text-muted-foreground">
                      Még nincs kitöltés.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
