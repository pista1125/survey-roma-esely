import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const CreateAdmin = () => {
  const [status, setStatus] = useState("Creating...");

  useEffect(() => {
    const create = async () => {
      const { data, error } = await supabase.auth.signUp({
        email: "pista1125@gmail.com",
        password: "Kerdoiv1125+",
      });
      if (error) {
        setStatus("Error: " + error.message);
      } else {
        setStatus("Admin fiók létrehozva! Most már beléphetsz az /admin oldalon. ID: " + data.user?.id);
        // sign out after creation
        await supabase.auth.signOut();
      }
    };
    create();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-card border border-border rounded-xl p-8 max-w-md text-center">
        <p className="text-foreground">{status}</p>
      </div>
    </div>
  );
};

export default CreateAdmin;
