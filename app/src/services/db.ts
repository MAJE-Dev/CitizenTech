// Camada de banco de dados local (SQLite via expo-sqlite).
// Tabelas: ocorrencias (registradas pelo cidadão, com foto e localização) e comentarios.
import * as SQLite from "expo-sqlite";
import type { Ocorrencia } from "./ocorrencias";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

// Versão do esquema, guardada no próprio arquivo do banco (PRAGMA user_version).
// Quem já tinha o app instalado mantém os dados: só os passos que faltam são aplicados.
const VERSAO_ESQUEMA = 2;

async function migrar(db: SQLite.SQLiteDatabase) {
  const linha = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version");
  const versao = linha?.user_version ?? 0;
  if (versao >= VERSAO_ESQUEMA) return;
  // Tudo numa transação: se um passo falhar, nada fica pela metade e a próxima abertura repete.
  await db.withTransactionAsync(async () => {
    await aplicarPassos(db, versao);
    await db.execAsync(`PRAGMA user_version = ${VERSAO_ESQUEMA}`);
  });
}

async function aplicarPassos(db: SQLite.SQLiteDatabase, versao: number) {
  if (versao < 1) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ocorrencias (
        id TEXT PRIMARY KEY NOT NULL,
        tipo TEXT NOT NULL,
        gravidade TEXT NOT NULL,
        status TEXT NOT NULL,
        endereco TEXT NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        x REAL NOT NULL,
        y REAL NOT NULL,
        abertaEm TEXT NOT NULL,
        atualizadaEm TEXT NOT NULL,
        andamento TEXT NOT NULL,
        descricao TEXT NOT NULL,
        criadaEm INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS comentarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ocorrenciaId TEXT NOT NULL,
        texto TEXT NOT NULL,
        data TEXT NOT NULL
      );
    `);
  }
  if (versao < 2) {
    // v1.1: foto do problema e marca de "localização real do celular".
    await db.execAsync(`
      ALTER TABLE ocorrencias ADD COLUMN foto TEXT;
      ALTER TABLE ocorrencias ADD COLUMN localReal INTEGER NOT NULL DEFAULT 0;
    `);
  }
}

function abrir() {
  dbPromise ??= (async () => {
    const db = await SQLite.openDatabaseAsync("citizentech.db");
    await migrar(db);
    return db;
  })().catch((e: unknown) => {
    dbPromise = null; // não guarda a falha: a próxima chamada tenta abrir de novo
    throw e;
  });
  return dbPromise;
}

export async function listarLocais(): Promise<Ocorrencia[]> {
  const db = await abrir();
  return db.getAllAsync<Ocorrencia>("SELECT * FROM ocorrencias ORDER BY criadaEm DESC");
}

export async function buscarLocal(id: string): Promise<Ocorrencia | undefined> {
  const db = await abrir();
  return (
    (await db.getFirstAsync<Ocorrencia>("SELECT * FROM ocorrencias WHERE id = ?", [id])) ??
    undefined
  );
}

/**
 * Grava a ocorrência. Devolve `false` (sem gravar nada) se o protocolo já existir no banco,
 * para quem chamou sortear outro: a chave primária garante que nenhum protocolo se repete.
 */
export async function inserirOcorrencia(o: Ocorrencia): Promise<boolean> {
  const db = await abrir();
  const resultado = await db.runAsync(
    `INSERT OR IGNORE INTO ocorrencias (id, tipo, gravidade, status, endereco, lat, lng, x, y, abertaEm, atualizadaEm, andamento, descricao, foto, localReal, criadaEm)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      o.id,
      o.tipo,
      o.gravidade,
      o.status,
      o.endereco,
      o.lat,
      o.lng,
      o.x,
      o.y,
      o.abertaEm,
      o.atualizadaEm,
      o.andamento,
      o.descricao,
      o.foto ?? null,
      o.localReal ?? 0,
      Date.now(),
    ],
  );
  return resultado.changes > 0;
}

export interface Comentario {
  id: number;
  texto: string;
  data: string;
}

export async function listarComentarios(ocorrenciaId: string): Promise<Comentario[]> {
  const db = await abrir();
  return db.getAllAsync<Comentario>(
    "SELECT id, texto, data FROM comentarios WHERE ocorrenciaId = ? ORDER BY id ASC",
    [ocorrenciaId],
  );
}

export async function salvarComentario(ocorrenciaId: string, texto: string): Promise<Comentario> {
  const db = await abrir();
  const data = dataHoraBR(new Date());
  const resultado = await db.runAsync(
    "INSERT INTO comentarios (ocorrenciaId, texto, data) VALUES (?, ?, ?)",
    [ocorrenciaId, texto, data],
  );
  return { id: resultado.lastInsertRowId, texto, data };
}

export const dataBR = (d: Date) =>
  `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

export const dataHoraBR = (d: Date) =>
  `${dataBR(d)} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
