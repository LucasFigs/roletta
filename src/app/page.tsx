import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Heart, MapPin, Dice5 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">Roletta</h1>
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Criar Conta</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1">
        <div className="container px-4 py-12 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Sorteador de Programações
              <span className="text-primary"> para o Fim de Semana</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Nunca mais fique sem ideias! Combine rolês com seu parceiro(a),
              organize viagens e deixe o sorteio decidir por vocês.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="text-lg">
                  Começar Agora
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg">
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/50">
        <div className="container px-4 py-12 md:py-20">
          <div className="mx-auto max-w-5xl">
            <h3 className="text-2xl font-bold text-center mb-12">
              Como funciona?
            </h3>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold">Match de Ideias</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Curta ou dispense ideias como no Tinder. Só entram no sorteio
                  os matches!
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Dice5 className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold">Sorteio Inteligente</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Filtre por gasto, energia, ambiente e deixe a sorte decidir.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold">Histórico</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Registre avaliações e reviva os melhores momentos.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold">Planejador de Viagens</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Calcule custos e ranqueie destinos do mais barato ao mais
                  caro.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 WeekendFlow. Divirta-se planejando seus fins de semana!</p>
        </div>
      </footer>
    </div>
  );
}
