import { useEffect, useState } from "react";

export default function AuthCallback() {
  const [status, setStatus] = useState("PAGE LOADED");

  useEffect(() => {
    console.log("CALLBACK RAN");
    setStatus("CLIENT JS WORKS");
  }, []);

  return <div>{status}</div>;
}