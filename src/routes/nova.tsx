import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Shell } from "@/components/citizen";
import { TIPOS, type Gravidade } from "@/services/ocorrencias";
import { salvarOcorrencia } from "@/services/db";

export const Route = createFileRoute("/nova")({
  head: () => ({
    meta: [
      { title: "Registrar ocorrência — CitizenTech" },
      { name: "description", content: "Avise a prefeitura sobre um buraco ou problema na sua rua." },
      { property: "og:title", content: "Registrar ocorrência — CitizenTech" },
      { property: "og:description", content: "Registre um problema urbano em poucos passos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Nova,
});

const campo = "w-full rounded-lg border bg-background px-3 py-3 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

function Nova() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const [tipo, setTipo] = useState(TIPOS[0]);
  const [gravidade, setGravidade] = useState<Gravidade>("Moderada");
  const [endereco, setEndereco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState("");

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (endereco.trim().length < 5) return setErro("Informe o endereço do problema.");
    const hoje = new Date().toLocaleDateString("pt-BR");
    const id = `OC-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100 + Math.random() * 900)}`;
    salvarOcorrencia({
      id, tipo, gravidade, status: "Recebida", endereco: endereco.trim(), descricao: descricao.trim() || "Sem descrição.",
      lat: -23.55 + Math.random() * 0.01, lng: -46.64 + Math.random() * 0.01,
      x: 15 + Math.random() * 70, y: 15 + Math.random() * 70,
      abertaEm: hoje, atualizadaEm: hoje, andamento: "Aguardando vistoria",
    });
    qc.invalidateQueries();
    nav({ to: "/ocorrencia/$id", params: { id } });
  };

  return (
    <Shell>
      <form onSubmit={enviar} className="mx-auto max-w-xl space-y-5 p-4" noValidate>
        <h1 className="text-2xl font-extrabold text-primary">Registrar ocorrência</h1>
        <p className="text-muted-foreground">Conte o que aconteceu. Leva menos de 1 minuto.</p>
        <fieldset>
          <legend className="mb-2 font-semibold">Qual é o problema?</legend>
          <div className="grid grid-cols-2 gap-2">
            {TIPOS.map((t) => (
              <button type="button" key={t} onClick={() => setTipo(t)} aria-pressed={tipo === t}
                className="min-h-12 rounded-lg border bg-card px-3 text-sm font-medium aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground">{t}</button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 font-semibold">Qual a gravidade?</legend>
          <div className="flex gap-2">
            {(["Leve", "Moderada", "Grave"] as Gravidade[]).map((g) => (
              <button type="button" key={g} onClick={() => setGravidade(g)} aria-pressed={gravidade === g}
                className="min-h-12 flex-1 rounded-lg border bg-card font-medium aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground">{g}</button>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor="end" className="mb-2 block font-semibold">Endereço</label>
          <input id="end" value={endereco} onChange={(e) => { setEndereco(e.target.value); setErro(""); }}
            placeholder="Ex.: Rua das Flores, 100" className={campo} aria-invalid={!!erro} aria-describedby={erro ? "erro-end" : undefined} />
          {erro && <p id="erro-end" role="alert" className="mt-1 text-sm font-semibold text-severe">{erro}</p>}
        </div>
        <div>
          <label htmlFor="desc" className="mb-2 block font-semibold">Descrição (opcional)</label>
          <textarea id="desc" rows={3} value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex.: buraco grande perto da faixa" className={campo} />
        </div>
        <button className="min-h-12 w-full rounded-lg bg-primary text-lg font-bold text-primary-foreground">Enviar ocorrência</button>
      </form>
    </Shell>
  );
}
