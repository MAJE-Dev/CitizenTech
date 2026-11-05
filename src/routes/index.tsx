import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, X, Plus } from "lucide-react";
import { Shell, Mapa, Estado, GravidadeTag, StatusTag, Linha } from "@/components/citizen";
import { listarOcorrencias, TIPOS } from "@/services/ocorrencias";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CitizenTech — Mapa de ocorrências da cidade" },
      { name: "description", content: "Veja e acompanhe buracos, bueiros e problemas na sua rua." },
      { property: "og:title", content: "CitizenTech — Mapa de ocorrências" },
      { property: "og:description", content: "Registre e acompanhe problemas urbanos no seu bairro." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Inicio,
});

function Inicio() {
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ["ocorrencias"], queryFn: listarOcorrencias });
  const [filtro, setFiltro] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [sel, setSel] = useState<string>();

  const itens = (data ?? []).filter((o) => (!filtro || o.tipo === filtro) &&
    (o.endereco + o.id).toLowerCase().includes(busca.toLowerCase()));
  const atual = itens.find((o) => o.id === sel);

  return (
    <Shell>
      <div className="flex flex-wrap items-center gap-3 border-b bg-card px-4 py-3">
        <label className="relative flex-1 min-w-52">
          <span className="sr-only">Buscar por endereço ou protocolo</span>
          <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar endereço ou protocolo"
            className="w-full rounded-lg border bg-background py-2.5 pl-3 pr-10 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          <Search className="absolute right-3 top-3 size-5 text-muted-foreground" aria-hidden />
        </label>
        <Link to="/nova" className="flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 font-semibold text-primary-foreground">
          <Plus className="size-5" aria-hidden /> Nova ocorrência
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b bg-card px-4 py-2" role="group" aria-label="Filtrar por tipo">
        {[null, ...TIPOS].map((t) => (
          <button key={t ?? "todos"} onClick={() => setFiltro(t)} aria-pressed={filtro === t}
            className="flex min-h-9 shrink-0 items-center gap-1 rounded-md border px-3 text-sm aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground">
            {t ?? "Todos"} {filtro === t && t && <X className="size-3" aria-hidden />}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[380px_1fr]">
        <section aria-label="Lista de ocorrências" className="order-2 max-h-[70vh] overflow-y-auto border-r bg-card lg:order-1">
          {isLoading && <Estado tipo="loading" msg="Carregando ocorrências..." />}
          {error && <Estado tipo="erro" msg={(error as Error).message}
            acao={<button onClick={() => refetch()} className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground">Tentar de novo</button>} />}
          {data && itens.length === 0 && <Estado tipo="vazio" msg="Nenhuma ocorrência encontrada. Tente outro filtro." />}
          <ul>
            {itens.map((o) => (
              <li key={o.id}>
                <button onClick={() => setSel(o.id)} aria-current={sel === o.id}
                  className="w-full border-b px-4 py-3 text-left hover:bg-secondary aria-[current=true]:bg-secondary">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">{o.id}</span>
                    <span className="text-xs text-muted-foreground">{o.abertaEm}</span>
                  </div>
                  <p className="mt-1 text-sm">{o.tipo} · {o.endereco}</p>
                  <div className="mt-2 flex gap-2"><GravidadeTag g={o.gravidade} /><StatusTag s={o.status} /></div>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="relative order-1 lg:order-2">
          <Mapa itens={itens} selecionado={sel} onSelect={setSel} />
          {atual && (
            <div className="absolute left-1/2 top-4 w-80 max-w-[90%] -translate-x-1/2 rounded-xl bg-card p-4 shadow-xl" role="dialog" aria-label={`Resumo da ocorrência ${atual.id}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-extrabold text-primary">{atual.id}</h2>
                  <div className="mt-1 flex gap-2"><GravidadeTag g={atual.gravidade} /><StatusTag s={atual.status} /></div>
                </div>
                <button aria-label="Fechar resumo" onClick={() => setSel(undefined)} className="grid size-9 place-items-center rounded-md hover:bg-secondary"><X className="size-4" aria-hidden /></button>
              </div>
              <dl className="mt-3 rounded-lg bg-secondary px-3 py-1">
                <Linha rotulo="Aberta em" valor={atual.abertaEm} />
                <Linha rotulo="Tipo" valor={atual.tipo} />
                <Linha rotulo="Endereço" valor={atual.endereco} />
              </dl>
              <Link to="/ocorrencia/$id" params={{ id: atual.id }} className="mt-3 block rounded-lg bg-primary py-2.5 text-center font-semibold text-primary-foreground">
                Ver detalhes
              </Link>
            </div>
          )}
          <div className="flex flex-wrap gap-4 border-t bg-card px-4 py-2 text-xs text-muted-foreground">
            <span>Toque num ponto do mapa para ver o resumo</span>
            <span className="ml-auto flex gap-3">
              <span><span className="text-severe">●</span> Grave</span>
              <span><span className="text-moderate">●</span> Moderada</span>
              <span><span className="text-mild">●</span> Leve</span>
            </span>
          </div>
        </section>
      </div>
    </Shell>
  );
}
