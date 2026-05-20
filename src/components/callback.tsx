useEffect(() => {
  const run = async () => {
    console.log("🔥 CALLBACK STARTED");

    console.log("SUPABASE_URL:", import.meta.env.PUBLIC_SUPABASE_URL);
    console.log("SUPABASE_KEY_EXISTS:", !!import.meta.env.PUBLIC_SUPABASE_ANON_KEY);

    setStatus("Check console logs (Step 2 running)");

    // STOP HERE intentionally (no DB calls yet)
  };

  run();
}, []);