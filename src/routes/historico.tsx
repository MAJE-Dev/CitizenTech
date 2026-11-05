import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell, Estado, GravidadeTag, StatusTag } from "@/components/citizen";
import { listarLocais } from "@/services/db";
import type { Ocorrencia } from "@/services/ocorrencias";

export const Route = createFileRoute("/historico")({
  head: () => ({
    meta: [
      { title: "Minhas ocorrências — CitizenTech" },
      { name: "description", content: "Veja as ocorrências que você registrou." },
      { property: "og:title", content: "Minhas ocorrências — CitizenTech" },
      { property: "og:description", content: "Histórico das suas ocorrências registradas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Historico,
});

function Historico() {
  const [itens, setItens] = useState<Ocorrencia[] | null>(null);
  useEffect(() => setItens(listarLocais()), []);
  return (
    <Shell>
      <div className="mx-auto max-w-2xl p-4">
        <h1 className="mb-4 text-2xl font-extrabold text-primary">Minhas ocorrências</h1>
        {itens === null && <Estado tipo="loading" msg="Carregando..." />}
        {itens?.length === 0 && <Estado tipo="vazio" msg="Você ainda não registrou nenhuma ocorrência."
          acao={<Link to="/nova" className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground">Registrar agora</Link>} />}
        <ul className="space-y-3">
          {itens?.map((o) => (
            <li key={o.id}>
              <Link to="/ocorrencia/$id" params={{ id: o.id }} className="block rounded-xl bg-card p-4 shadow-sm hover:ring-2 hover:ring-ring">
                <div className="flex justify-between"><span className="font-bold text-primary">{o.id}</span><span className="text-sm text-muted-foreground">{o.abertaEm}</span></div>
                <p className="mt-1 text-sm">{o.tipo} · {o.endereco}</p>
                <div className="mt-2 flex gap-2"><GravidadeTag g={o.gravidade} /><StatusTag s={o.status} /></div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}
