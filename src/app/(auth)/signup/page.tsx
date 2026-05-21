"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Preencha todos os campos");
      return;
    }

    if (password.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Conta criada! Verifique seu email.");
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">roletta</h1>
          <p className="text-muted-foreground text-sm mt-2">crie sua conta</p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl bg-muted border-0 focus:ring-1 focus:ring-primary outline-none text-sm"
          />
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-muted border-0 focus:ring-1 focus:ring-primary outline-none text-sm"
          />
          <input
            type="password"
            placeholder="senha (mínimo 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-muted border-0 focus:ring-1 focus:ring-primary outline-none text-sm"
          />
          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full p-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "criando conta..." : "criar conta"}
          </button>
          <button
            onClick={() => router.push("/login")}
            className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            já tenho conta
          </button>
        </div>
      </div>
    </div>
  );
}
