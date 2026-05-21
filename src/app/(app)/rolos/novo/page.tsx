"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Sparkles,
  DollarSign,
  Zap,
  ChevronDown,
  Check,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  icon: string | null;
};

export default function NovoRolePage() {
  const supabase = createClient();
  const router = useRouter();

  const [workspaceId, setWorkspaceId] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
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

  const environmentOptions = [
    { value: "aberto", label: "Aberto", icon: "🌳" },
    { value: "fechado", label: "Fechado", icon: "🏠" },
    { value: "ambos", label: "Ambos", icon: "🌳🏠" },
  ];

  const periodOptions = [
    { value: "diurno", label: "Diurno", icon: "☀️" },
    { value: "noturno", label: "Noturno", icon: "🌙" },
    { value: "ambos", label: "Ambos", icon: "☀️🌙" },
  ];

  const energyOptions = [
    {
      value: "leve",
      label: "Leve",
      icon: "⚡",
      description: "Relax, sem esforço",
    },
    {
      value: "moderado",
      label: "Moderado",
      icon: "⚡⚡",
      description: "Um pouco de energia",
    },
    {
      value: "cansativo",
      label: "Intenso",
      icon: "⚡⚡⚡",
      description: "Prepara o pique!",
    },
  ];

  useEffect(() => {
    fetchWorkspaceAndCategories();
  }, []);

  async function fetchWorkspaceAndCategories() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // ALTERNATIVA: Buscar o workspace diretamente pelo created_by
    const { data: workspace } = await supabase
      .from("workspaces")
      .select("id")
      .eq("created_by", user.id)
      .single();

    if (workspace) {
      setWorkspaceId(workspace.id);

      const { data: cats } = await supabase
        .from("categories")
        .select("id, name, icon")
        .or(`workspace_id.eq.${workspace.id},workspace_id.is.null`)
        .order("name");

      if (cats) {
        setCategories(cats as Category[]);
      }
    }
  }

  function toggleStyle(styleValue: string) {
    setStyles((prev) =>
      prev.includes(styleValue)
        ? prev.filter((s) => s !== styleValue)
        : [...prev, styleValue],
    );
  }

  async function handleSubmit() {
    if (!name.trim()) {
      alert("Digite o nome do rolê");
      return;
    }

    if (!workspaceId) {
      alert("Erro: workspace não encontrado. Recarregue a página.");
      return;
    }

    setLoading(true);

    // Construir o objeto exatamente como o banco espera
    const roloData: any = {
      name: name.trim(),
      workspace_id: workspaceId,
      is_active: isActive,
    };

    // Só adicionar se tiver valor (não enviar null/undefined)
    if (description.trim()) roloData.description = description.trim();
    if (selectedCategory?.id) roloData.category_id = selectedCategory.id;
    if (estimatedCost) roloData.estimated_cost = parseFloat(estimatedCost);
    if (energyLevel) roloData.energy_level = energyLevel;
    if (environment) roloData.environment = environment;
    if (period) roloData.period = period;
    if (styles.length > 0) roloData.style = styles;

    console.log("Enviando dados:", roloData);

    const { data, error } = await supabase
      .from("rolos")
      .insert(roloData)
      .select();

    if (error) {
      console.error("Erro detalhado ao salvar:", error);
      alert(`Erro ao salvar rolê: ${error.message} - ${error.details || ""}`);
    } else {
      console.log("Salvo com sucesso:", data);
      router.push("/rolos");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-slate-100 px-4 py-4 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full hover:bg-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex-1">
          Criar Novo Rolê
        </h1>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          <Sparkles className="h-4 w-4 mr-1" />
          {loading ? "Salvando..." : "Publicar"}
        </Button>
      </div>

      <div className="p-4 space-y-5 max-w-2xl mx-auto">
        {/* Nome */}
        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-5 space-y-4">
            <div>
              <Label className="text-sm font-semibold text-slate-700">
                Qual é o rolê? *
              </Label>
              <Input
                placeholder="Ex: Cinema no IMAX, Piquenique no Parque..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 rounded-xl border-slate-200 focus:border-indigo-300"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold text-slate-700">
                Descrição
              </Label>
              <Textarea
                placeholder="Conte um pouco sobre o que esperar desse rolê..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1.5 rounded-xl border-slate-200 focus:border-indigo-300"
              />
            </div>

            {/* Categoria - Usando DropdownMenu em vez de Select */}
            <div>
              <Label className="text-sm font-semibold text-slate-700">
                Categoria
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="mt-1.5 w-full justify-between rounded-xl border-slate-200 bg-white hover:bg-slate-50"
                  >
                    {selectedCategory ? (
                      <span className="flex items-center gap-2">
                        <span className="text-xl">
                          {selectedCategory.icon || "📌"}
                        </span>
                        <span>{selectedCategory.name}</span>
                      </span>
                    ) : (
                      "Selecione uma categoria"
                    )}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 max-h-60 overflow-y-auto rounded-xl">
                  {categories.map((cat) => (
                    <DropdownMenuItem
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat)}
                      className="flex items-center gap-2 py-2 cursor-pointer"
                    >
                      <span className="text-xl">{cat.icon || "📌"}</span>
                      <span className="flex-1">{cat.name}</span>
                      {selectedCategory?.id === cat.id && (
                        <Check className="h-4 w-4 text-indigo-500" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Estilos */}
        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-md font-semibold text-slate-700">
              Estilos
            </CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Pode escolher vários
            </p>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="flex flex-wrap gap-2">
              {styleOptions.map((style) => (
                <Button
                  key={style.value}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => toggleStyle(style.value)}
                  className={`rounded-full gap-1.5 border-slate-200 transition-all ${
                    styles.includes(style.value)
                      ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                      : "bg-white text-slate-600"
                  }`}
                >
                  <span className="text-base">{style.icon}</span>
                  <span className="text-sm">{style.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ambiente e Período */}
        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-md font-semibold text-slate-700">
              Quando e Onde?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-4">
            <div>
              <Label className="text-sm font-semibold text-slate-700">
                Ambiente
              </Label>
              <div className="flex gap-2 mt-1.5">
                {environmentOptions.map((opt) => (
                  <Button
                    key={opt.value}
                    type="button"
                    variant={environment === opt.value ? "default" : "outline"}
                    onClick={() => setEnvironment(opt.value)}
                    className={`flex-1 rounded-xl gap-2 ${
                      environment === opt.value
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                        : "border-slate-200"
                    }`}
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold text-slate-700">
                Período
              </Label>
              <div className="flex gap-2 mt-1.5">
                {periodOptions.map((opt) => (
                  <Button
                    key={opt.value}
                    type="button"
                    variant={period === opt.value ? "default" : "outline"}
                    onClick={() => setPeriod(opt.value)}
                    className={`flex-1 rounded-xl gap-2 ${
                      period === opt.value
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                        : "border-slate-200"
                    }`}
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Energia e Gasto */}
        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-md font-semibold text-slate-700">
              Energia e Gasto
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-4">
            <div>
              <Label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                <Zap className="h-3.5 w-3.5" /> Nível de Energia
              </Label>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                {energyOptions.map((opt) => (
                  <Button
                    key={opt.value}
                    type="button"
                    variant={energyLevel === opt.value ? "default" : "outline"}
                    onClick={() => setEnergyLevel(opt.value)}
                    className={`rounded-xl flex-col h-auto py-2 ${
                      energyLevel === opt.value
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                        : "border-slate-200"
                    }`}
                  >
                    <span className="text-base">{opt.icon}</span>
                    <span className="text-xs">{opt.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5" /> Gasto Estimado (R$)
              </Label>
              <Input
                type="number"
                placeholder="Quanto vai gastar?"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                className="mt-1.5 rounded-xl border-slate-200"
              />
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <Checkbox
                id="active"
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(checked as boolean)}
                className="rounded-md border-slate-300 data-[state=checked]:bg-indigo-500"
              />
              <Label
                htmlFor="active"
                className="text-sm text-slate-600 cursor-pointer"
              >
                ✨ Rolê ativo (aparece nos sorteios)
              </Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
