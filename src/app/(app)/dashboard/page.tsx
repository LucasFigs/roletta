"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Moon, Sun, Plus, Dice5, Trash2, LogOut } from "lucide-react";
import { useTheme } from "@/components/global/theme-provider";

type Rolo = {
  id: string;
  name: string;
  description: string | null;
  estimated_cost: number | null;
  created_at: string;
};

export default function Dashboard() {
  const supabase = createClient();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const [user, setUser] = useState<any>(null);
  const [rolos, setRolos] = useState<Rolo[]>([]);
  const [workspaceId, setWorkspaceId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setUser(user);

    const { data: workspace } = await supabase
      .from("workspaces")
      .select("id")
      .eq("created_by", user.id)
      .single();

    if (workspace) {
      setWorkspaceId(workspace.id);

      const { data: rolosData } = await supabase
        .from("rolos")
        .select("*")
        .eq("workspace_id", workspace.id)
        .order("created_at", { ascending: false });

      if (rolosData) setRolos(rolosData as Rolo[]);
    }

    setLoading(false);
  }

  async function handleSortear() {
    if (rolos.length === 0) {
      alert("Crie alguns rolês primeiro!");
      return;
    }

    const random = Math.floor(Math.random() * rolos.length);
    const sorteado = rolos[random];
    alert(`🎉 ${sorteado.name}! 🎉`);
  }

  async function handleCreate() {
    if (!name.trim()) {
      alert("Digite o nome do rolê");
      return;
    }

    const { error } = await supabase.from("rolos").insert({
      name: name.trim(),
      description: description.trim() || null,
      workspace_id: workspaceId,
      estimated_cost: estimatedCost ? parseFloat(estimatedCost) : null,
      is_active: true,
    });

    if (error) {
      alert("Erro: " + error.message);
    } else {
      setName("");
      setDescription("");
      setEstimatedCost("");
      setShowForm(false);
      await loadData();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remover este rolê?")) return;
    await supabase.from("rolos").delete().eq("id", id);
    await loadData();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex justify-between items-center max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-primary">roletta</h1>
          <div className="flex gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Alternar tema"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Sair"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {/* Botões principais */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <Plus size={18} />
            <span className="text-sm font-medium">novo rolê</span>
          </button>
          <button
            onClick={handleSortear}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Dice5 size={18} />
            <span className="text-sm font-medium">sortear</span>
          </button>
        </div>

        {/* Form de criar rolê */}
        {showForm && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <input
              type="text"
              placeholder="nome do rolê"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded-lg bg-muted border-0 focus:ring-1 focus:ring-primary outline-none text-sm"
              autoFocus
            />
            <input
              type="text"
              placeholder="descrição (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded-lg bg-muted border-0 focus:ring-1 focus:ring-primary outline-none text-sm"
            />
            <input
              type="number"
              placeholder="gasto estimado (opcional)"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              className="w-full p-2 rounded-lg bg-muted border-0 focus:ring-1 focus:ring-primary outline-none text-sm"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 p-2 rounded-lg text-sm hover:bg-muted transition-colors"
              >
                cancelar
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 p-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
              >
                salvar
              </button>
            </div>
          </div>
        )}

        {/* Contador */}
        <div className="text-center py-2">
          <span className="text-3xl font-bold text-primary">
            {rolos.length}
          </span>
          <span className="text-muted-foreground text-sm ml-2">
            {rolos.length === 1 ? "rolê" : "rolês"}
          </span>
        </div>

        {/* Lista de rolês */}
        <div className="space-y-2">
          {rolos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              nenhum rolê ainda. crie um!
            </div>
          ) : (
            rolos.map((rolo) => (
              <div
                key={rolo.id}
                className="flex items-center justify-between p-3 bg-card border border-border rounded-xl"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">{rolo.name}</div>
                  {rolo.description && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {rolo.description.length > 50
                        ? rolo.description.substring(0, 50) + "..."
                        : rolo.description}
                    </div>
                  )}
                  {rolo.estimated_cost && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      R$ {rolo.estimated_cost}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(rolo.id)}
                  className="p-2 rounded-full hover:bg-muted transition-colors ml-2"
                  aria-label="Remover rolê"
                >
                  <Trash2 size={14} className="text-muted-foreground" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
