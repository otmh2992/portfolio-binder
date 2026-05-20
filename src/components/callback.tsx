import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const [status, setStatus] = useState("STARTING");

  useEffect(() => {
    const run = async () => {
      console.log("CALLBACK STARTED");

      const { data, error } = await supabase
        .from("email_verifications")
        .select("*")
        .limit(1);

      console.log("SUPABASE RESPONSE:", { data, error });

      setStatus(error ? "ERROR" : "SUCCESS");
    };

    run();
  }, []);

  return <div>{status}</div>;
}