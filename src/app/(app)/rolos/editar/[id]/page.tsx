"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

type Category = {
  id: string;
  name: string;
  icon: string | null;
};

type Rolo = {
  id: string;
  name: string;
  description: string | null;
  category_id: string | null;
  estimated_cost: number | null;
  energy_level: string | null;
  environment: string | null;
  period: string | null;
  style: string[] | null;
  is_active: boolean;
};

export default function EditarRolePage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [workspaceId, setWorkspaceId] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [energyLevel, setEnergyLevel] = useState("");
  const [environment, setEnvironment] = useState("");
  const [period, setPeriod] = useState("");
  const [styles, setStyles] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);

  const styleOptions = [
    { value: "calmo", label: "Calmo", icon: "😌" },
    { value: "agitado", label: "Agitado", icon: "🎉" },
    { value: "romantico", label: "Romântico", icon: "💕" },
    { value: "aventureiro", label: "Aventureiro", icon: "🧗" },
    { value: "cultural", label: "Cultural", icon: "🎭" },
    { value: "gastronomico", label: "Gastronômico", icon: "🍽️" },
    { value: "esportivo", label: "Esportivo", icon: "⚽" },
    { value: "caseiro", label: "Caseiro", icon: "🏠" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Buscar workspace
    const { data: member } = await supabase
      .from("members")
      .select("workspace_id")
      .eq("profile_id", user.id)
      .single();

    if (member && member.workspace_id) {
      setWorkspaceId(member.workspace_id);

      // Buscar categorias
      const { data: cats } = await supabase
        .from("categories")
        .select("id, name, icon")
        .or(`workspace_id.eq.${member.workspace_id},workspace_id.is.null`)
        .order("name");

      if (cats) setCategories(cats as Category[]);

      // Buscar rolê
      const { data: rolo } = await supabase
        .from("rolos")
        .select("*")
        .eq("id", id)
        .single();

      if (rolo) {
        const roloData = rolo as Rolo;
        setName(roloData.name);
        setDescription(roloData.description || "");
        setCategoryId(roloData.category_id || "");
        setEstimatedCost(roloData.estimated_cost?.toString() || "");
        setEnergyLevel(roloData.energy_level || "");
        setEnvironment(roloData.environment || "");
        setPeriod(roloData.period || "");
        setStyles(roloData.style || []);
        setIsActive(roloData.is_active);
      }
    }

    setLoadingData(false);
  }

  function toggleStyle(styleValue: string) {
    setStyles((prev) =>
      prev.includes(styleValue)
        ? prev.filter((s) => s !== styleValue)
        : [...prev, styleValue],
    );
  }

  async function handleUpdate() {
    if (!name.trim()) {
      alert("Digite o nome do rolê");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("rolos")
      .update({
        name: name.trim(),
        description: description.trim() || null,
        category_id: categoryId || null,
        estimated_cost: estimatedCost ? parseFloat(estimatedCost) : null,
        energy_level: energyLevel || null,
        environment: environment || null,
        period: period || null,
        style: styles.length > 0 ? styles : null,
        is_active: isActive,
      })
      .eq("id", id);

    if (error) {
      alert("Erro ao atualizar rolê: " + error.message);
    } else {
      router.push("/rolos");
    }

    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este rolê?")) return;

    const { error } = await supabase.from("rolos").delete().eq("id", id);

    if (error) {
      alert("Erro ao deletar rolê: " + error.message);
    } else {
      router.push("/rolos");
    }
  }

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold flex-1">Editar Rolê</h1>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 mr-1" />
          Excluir
        </Button>
        <Button onClick={handleUpdate} disabled={loading}>
          <Save className="h-4 w-4 mr-1" />
          Salvar
        </Button>
      </div>

      {/* Form - Mesmo formulário do Novo Rolê */}
      <div className="p-4 space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nome do Rolê *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <Label>Descrição</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label>Categoria</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Características */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Características</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Estilo</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {styleOptions.map((style) => (
                  <Button
                    key={style.value}
                    type="button"
                    variant={
                      styles.includes(style.value) ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => toggleStyle(style.value)}
                    className="gap-1"
                  >
                    {style.icon} {style.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ambiente</Label>
                <Select value={environment} onValueChange={setEnvironment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aberto">🌳 Aberto</SelectItem>
                    <SelectItem value="fechado">🏠 Fechado</SelectItem>
                    <SelectItem value="ambos">🌳🏠 Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Período</Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diurno">☀️ Diurno</SelectItem>
                    <SelectItem value="noturno">🌙 Noturno</SelectItem>
                    <SelectItem value="ambos">☀️🌙 Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nível de Energia</Label>
                <Select value={energyLevel} onValueChange={setEnergyLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leve">⚡ Leve</SelectItem>
                    <SelectItem value="moderado">⚡⚡ Moderado</SelectItem>
                    <SelectItem value="cansativo">⚡⚡⚡ Cansativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Gasto Estimado (R$)</Label>
                <Input
                  type="number"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Checkbox
                id="active"
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(checked as boolean)}
              />
              <Label htmlFor="active" className="cursor-pointer">
                Rolê ativo (aparece nos sorteios)
              </Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
