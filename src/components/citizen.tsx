import { Link } from "@tanstack/react-router";
import { Bell, LayoutGrid, Ticket, Plus, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import type { Gravidade, Ocorrencia, Status } from "@/services/ocorrencias";

export function Shell({ children }: { children: ReactNode }) {
  const nav = [
    { to: "/", label: "Início", icon: LayoutGrid },
    { to: "/nova", label: "Registrar", icon: Plus },
    { to: "/historico", label: "Histórico", icon: Ticket },
  ] as const;
  return (
    <div className="flex min-h-dvh flex-col bg-background font-sans text-foreground">
      <header className="flex items-center justify-between bg-primary px-5 py-3 text-primary-foreground">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <MapPin aria-hidden className="size-6 text-accent" /> CitizenTech
        </Link>
        <div className="flex items-center gap-3">
          <button aria-label="Notificações" className="grid size-10 place-items-center rounded-full bg-primary-foreground/10">
            <Bell className="size-5" aria-hidden />
          </button>
          <div className="hidden rounded-lg bg-primary-foreground/10 px-3 py-1.5 text-sm sm:block">
            <p className="font-semibold">Cidadão Teste</p>
            <p className="text-xs opacity-80">Perfil simulado</p>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <nav aria-label="Menu principal" className="hidden w-24 flex-col items-center gap-2 bg-sidebar-dark py-4 md:flex">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} activeOptions={{ exact: true }}
              className="flex w-20 flex-col items-center gap-1 rounded-lg py-3 text-xs text-primary-foreground/70 hover:text-primary-foreground data-[status=active]:bg-primary-foreground/15 data-[status=active]:text-primary-foreground">
              <Icon className="size-5" aria-hidden /> {label}
            </Link>
          ))}
        </nav>
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
      </div>
      <nav aria-label="Menu principal" className="fixed inset-x-0 bottom-0 flex justify-around border-t bg-card py-2 md:hidden">
        {nav.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} activeOptions={{ exact: true }}
            className="flex min-h-11 flex-col items-center px-4 text-xs text-muted-foreground data-[status=active]:font-bold data-[status=active]:text-primary">
            <Icon className="size-5" aria-hidden /> {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

const gravCls: Record<Gravidade, string> = {
  Grave: "bg-severe text-primary-foreground",
  Moderada: "bg-moderate text-foreground",
  Leve: "bg-mild text-foreground",
};
const statusCls: Record<Status, string> = {
  Recebida: "bg-secondary text-foreground border",
  "Em andamento": "bg-progress text-primary-foreground",
  Concluída: "bg-done text-primary-foreground",
};

export const GravidadeTag = ({ g }: { g: Gravidade }) => (
  <span className={`rounded px-2 py-0.5 text-xs font-bold ${gravCls[g]}`}>● {g}</span>
);
export const StatusTag = ({ s }: { s: Status }) => (
  <span className={`rounded px-2 py-0.5 text-xs font-bold ${statusCls[s]}`}>{s}</span>
);

export function Linha({ rotulo, valor }: { rotulo: string; valor: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <dt className="text-muted-foreground">{rotulo}</dt>
      <dd className="text-right font-semibold">{valor}</dd>
    </div>
  );
}

export function Estado({ tipo, msg, acao }: { tipo: "loading" | "erro" | "vazio"; msg: string; acao?: ReactNode }) {
  return (
    <div role={tipo === "erro" ? "alert" : "status"} aria-live="polite" className="flex flex-col items-center gap-3 p-10 text-center">
      {tipo === "loading" && <span className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" aria-hidden />}
      <p className={`text-base ${tipo === "erro" ? "font-semibold text-severe" : "text-muted-foreground"}`}>{msg}</p>
      {acao}
    </div>
  );
}

const pinCor: Record<Gravidade, string> = { Grave: "bg-severe", Moderada: "bg-moderate", Leve: "bg-mild" };

export function Mapa({ itens, selecionado, onSelect }: { itens: Ocorrencia[]; selecionado?: string; onSelect: (id: string) => void }) {
  return (
    <div className="relative h-full min-h-[420px] overflow-hidden bg-map-land" role="region" aria-label="Mapa das ocorrências">
      <svg className="absolute inset-0 size-full" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden>
        <path d="M0 40 Q20 50 30 70 T45 100 L35 100 Q25 75 15 60 T0 48Z" className="fill-map-water" />
        <rect x="60" y="40" width="15" height="12" rx="2" className="fill-map-park" />
        <rect x="8" y="10" width="10" height="14" rx="2" className="fill-map-park" />
        {[15, 35, 50, 75, 90].map((y) => <line key={"h"+y} x1="0" x2="100" y1={y} y2={y} className="stroke-map-road" strokeWidth="1.4" />)}
        {[20, 40, 60, 85].map((x) => <line key={"v"+x} y1="0" y2="100" x1={x} x2={x} className="stroke-map-road" strokeWidth="1.4" />)}
        <line x1="0" y1="100" x2="100" y2="5" className="stroke-map-road" strokeWidth="2.4" />
      </svg>
      {itens.map((o) => (
        <button key={o.id} onClick={() => onSelect(o.id)}
          aria-label={`${o.tipo}, gravidade ${o.gravidade}, ${o.endereco}`}
          style={{ left: `${o.x}%`, top: `${o.y}%` }}
          className={`absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-card shadow-md transition-transform hover:scale-110 ${pinCor[o.gravidade]} ${selecionado === o.id ? "size-11 ring-4 ring-primary/40" : "size-8"}`}>
          <MapPin className="size-4 text-card" aria-hidden />
        </button>
      ))}
      <p className="absolute bottom-2 right-2 rounded bg-card/90 px-2 py-1 text-xs text-muted-foreground">Mapa ilustrativo · dados simulados</p>
    </div>
  );
}
