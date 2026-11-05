import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Shell, Estado, GravidadeTag, StatusTag, Linha } from "@/components/citizen";
import { buscarOcorrencia } from "@/services/ocorrencias";
import { listarComentarios, salvarComentario, type Comentario } from "@/services/db";

export const Route = createFileRoute("/ocorrencia/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Ocorrência ${params.id} — CitizenTech` },
      { name: "description", content: "Detalhes e andamento da ocorrência registrada." },
      { property: "og:title", content: `Ocorrência ${params.id}` },
      { property: "og:description", content: "Acompanhe o andamento do reparo." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Detalhe,
});

function Detalhe() {
  const { id } = Route.useParams();
  const { data, isLoading, error } = useQuery({ queryKey: ["ocorrencia", id], queryFn: () => buscarOcorrencia(id) });
  const [coms, setComs] = useState<Comentario[]>([]);
  const [texto, setTexto] = useState("");
  useEffect(() => setComs(listarComentarios(id)), [id]);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim()) return;
    salvarComentario(id, texto.trim());
    setComs(listarComentarios(id));
    setTexto("");
  };

  return (
    <Shell>
      <div className="mx-auto max-w-2xl p-4">
        <Link to="/" className="mb-4 inline-flex min-h-11 items-center gap-2 font-semibold text-primary"><ArrowLeft className="size-5" aria-hidden /> Voltar ao mapa</Link>
        {isLoading && <Estado tipo="loading" msg="Carregando detalhes..." />}
        {error && <Estado tipo="erro" msg="Não conseguimos abrir esta ocorrência." />}
        {!isLoading && !error && !data && <Estado tipo="vazio" msg="Ocorrência não encontrada." />}
        {data && (
          <article className="space-y-4">
            <header>
              <h1 className="text-2xl font-extrabold text-primary">{data.id}</h1>
              <div className="mt-2 flex gap-2"><GravidadeTag g={data.gravidade} /><StatusTag s={data.status} /></div>
            </header>
            <dl className="rounded-xl bg-card p-4 shadow-sm">
              <Linha rotulo="Aberta em" valor={data.abertaEm} />
              <Linha rotulo="Endereço" valor={data.endereco} />
              <Linha rotulo="Coordenadas" valor={`${data.lat.toFixed(4)}, ${data.lng.toFixed(4)}`} />
            </dl>
            <dl className="rounded-xl bg-card p-4 shadow-sm">
              <Linha rotulo="Tipo" valor={data.tipo} />
              <Linha rotulo="Andamento" valor={data.andamento} />
              <Linha rotulo="Última atualização" valor={data.atualizadaEm} />
              <Linha rotulo="Descrição" valor={data.descricao} />
            </dl>
            <section className="rounded-xl bg-card p-4 shadow-sm" aria-label="Comentários">
              <h2 className="mb-2 text-lg font-bold">Comentários</h2>
              {coms.length === 0 ? <p className="text-sm text-muted-foreground">Ainda não há comentários.</p> : (
                <ul className="mb-3 space-y-2">
                  {coms.map((c, i) => <li key={i} className="rounded-lg bg-secondary p-2 text-sm">{c.texto}<span className="block text-xs text-muted-foreground">{c.data}</span></li>)}
                </ul>
              )}
              <form onSubmit={enviar} className="mt-3 flex gap-2">
                <label className="flex-1"><span className="sr-only">Escreva um comentário</span>
                  <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escreva aqui..." className="w-full rounded-lg border bg-background px-3 py-2.5 text-base placeholder:text-muted-foreground" />
                </label>
                <button className="rounded-lg bg-primary px-4 font-semibold text-primary-foreground">Enviar</button>
              </form>
            </section>
          </article>
        )}
      </div>
    </Shell>
  );
}
