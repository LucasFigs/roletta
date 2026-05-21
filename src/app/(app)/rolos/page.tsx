"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Eye, Filter } from "lucide-react";

type Rolo = {
  id: string;
  name: string;
  description: string | null;
  estimated_cost: number | null;
  energy_level: string | null;
  environment: string | null;
  period: string | null;
  is_active: boolean;
  categories: { name: string; icon: string | null } | null;
};

export default function RolosPage() {
  const supabase = createClient();
  const router = useRouter();

  const [rolos, setRolos] = useState<Rolo[]>([]);
  const [workspaceId, setWorkspaceId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkspaceAndRolos();
  }, []);

  async function fetchWorkspaceAndRolos() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: member } = await supabase
      .from("members")
      .select("workspace_id")
      .eq("profile_id", user.id)
      .single();

    if (member && member.workspace_id) {
      setWorkspaceId(member.workspace_id);
      await fetchRolos(member.workspace_id);
    }

    setLoading(false);
  }

  async function fetchRolos(workspaceIdValue: string) {
    const { data } = await supabase
      .from("rolos")
      .select(
        `
        *,
        categories (
          name,
          icon
        )
      `,
      )
      .eq("workspace_id", workspaceIdValue)
      .order("created_at", { ascending: false });

    if (data) {
      setRolos(data as Rolo[]);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este rolê?")) return;

    const { error } = await supabase.from("rolos").delete().eq("id", id);

    if (error) {
      alert("Erro ao deletar rolê: " + error.message);
    } else {
      setRolos(rolos.filter((rolo) => rolo.id !== id));
    }
  }

  function getEnergyLevelColor(level: string | null) {
    switch (level) {
      case "leve":
        return "bg-green-100 text-green-700";
      case "moderado":
        return "bg-yellow-100 text-yellow-700";
      case "cansativo":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  function getEnvironmentIcon(environment: string | null) {
    switch (environment) {
      case "aberto":
        return "🌳";
      case "fechado":
        return "🏠";
      case "ambos":
        return "🌳🏠";
      default:
        return "📍";
    }
  }

  function getPeriodIcon(period: string | null) {
    switch (period) {
      case "diurno":
        return "☀️";
      case "noturno":
        return "🌙";
      case "ambos":
        return "☀️🌙";
      default:
        return "⏰";
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Meus Rolês</h1>
        <Button size="sm" onClick={() => router.push("/rolos/novo")}>
          <Plus className="h-4 w-4 mr-1" />
          Novo Rolê
        </Button>
      </div>

      {/* Lista de rolês */}
      <div className="p-4 space-y-3">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        ) : rolos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum rolê cadastrado</p>
            <Button
              variant="link"
              onClick={() => router.push("/rolos/novo")}
              className="mt-2"
            >
              Criar primeiro rolê
            </Button>
          </div>
        ) : (
          rolos.map((rolo) => (
            <Card key={rolo.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">
                        {rolo.categories?.icon || "🎉"}
                      </span>
                      <h3 className="font-semibold text-lg">{rolo.name}</h3>
                      {!rolo.is_active && (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                          Inativo
                        </span>
                      )}
                    </div>

                    {rolo.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {rolo.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mb-3">
                      {rolo.estimated_cost && (
                        <span className="text-xs bg-muted px-2 py-1 rounded-full">
                          R$ {rolo.estimated_cost}
                        </span>
                      )}
                      {rolo.energy_level && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getEnergyLevelColor(rolo.energy_level)}`}
                        >
                          {rolo.energy_level === "leve" && "⚡ Leve"}
                          {rolo.energy_level === "moderado" && "⚡⚡ Moderado"}
                          {rolo.energy_level === "cansativo" &&
                            "⚡⚡⚡ Cansativo"}
                        </span>
                      )}
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">
                        {getEnvironmentIcon(rolo.environment)}{" "}
                        {rolo.environment || "Ambiente"}
                      </span>
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">
                        {getPeriodIcon(rolo.period)} {rolo.period || "Período"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/rolos/${rolo.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/rolos/editar/${rolo.id}`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(rolo.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
