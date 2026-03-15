import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, LogIn, LogOut, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const QUESTION_LABELS: Record<string, string> = {
  q1: "Roma munkaerőpiaci hátrányok valós probléma",
  q2: "Munkáltatók aktív szerepe",
  q3: "Roma származás nem releváns",
  q4: "Munkaerőpiac igazságos",
  q5: "Találkozott roma munkavállalóval",
  q6: "Roma munkavállalók megbízhatóak",
  q7: "Szervezetben dolgoznak romák",
  q8: "Kiválasztási folyamatok alkalmasak",
  q9: "Oktatási rendszer fő ok",
  q10: "Munkáltatói előítéletek szerepe",
  q11: "Készségek hiánya nehezíti",
  q12: "Társadalmi vs vállalati felelősség",
  q13: "Nyitottság roma toborzásra",
  q14: "Előítéletmentes képzés hasznos",
  q15: "Üzleti cél lehet",
  q16: "Ügyfélkapcsolati pozíció kockázat",
  q17: "Vezetői pozíció kockázat",
  q18: "Csapat reakció",
  q19: "Kontrollkérdés (4)",
  q20: "10 év prognózis",
  age_group: "Életkor",
  gender: "Nem",
  region: "Régió",
  position: "Beosztás",
  hiring_involvement: "Felvételi részvétel",
  hiring_decisions_count: "Felvételi döntések száma",
  org_size: "Szervezet mérete",
  industry: "Iparág",
  org_ownership: "Tulajdonosi háttér",
  email: "E-mail",
  created_at: "Kitöltés időpontja",
};

const CSV_COLUMNS = [
  "id", "created_at", "email",
  "q1","q2","q3","q4","q5","q6","q7","q8","q9","q10","q11","q12","q13","q14","q15","q16","q17","q18","q19","q20",
  "age_group","gender","region","position","hiring_involvement","hiring_decisions_count","org_size","industry","org_ownership",
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
                  {Array.from({ length: 20 }, (_, i) => (
                    <th key={i} className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap">
                      K{i + 1}
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
                    {Array.from({ length: 20 }, (_, i) => (
                      <td key={i} className="p-3">{r[`q${i + 1}`] ?? "–"}</td>
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
