// Camada de banco de dados local (SQLite via expo-sqlite).
// Tabelas: ocorrencias (registradas pelo cidadão) e comentarios.
import * as SQLite from "expo-sqlite";
import type { Ocorrencia } from "./ocorrencias";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function abrir() {
  dbPromise ??= (async () => {
    const db = await SQLite.openDatabaseAsync("citizentech.db");
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
    return db;
  })();
  return dbPromise;
}

export async function listarLocais(): Promise<Ocorrencia[]> {
  const db = await abrir();
  return db.getAllAsync<Ocorrencia>("SELECT * FROM ocorrencias ORDER BY criadaEm DESC");
}

export async function salvarOcorrencia(o: Ocorrencia): Promise<void> {
  const db = await abrir();
  await db.runAsync(
    `INSERT INTO ocorrencias (id, tipo, gravidade, status, endereco, lat, lng, x, y, abertaEm, atualizadaEm, andamento, descricao, criadaEm)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      Date.now(),
    ],
  );
}

export interface Comentario {
  texto: string;
  data: string;
}

export async function listarComentarios(ocorrenciaId: string): Promise<Comentario[]> {
  const db = await abrir();
  return db.getAllAsync<Comentario>(
    "SELECT texto, data FROM comentarios WHERE ocorrenciaId = ? ORDER BY id ASC",
    [ocorrenciaId],
  );
}

export async function salvarComentario(ocorrenciaId: string, texto: string): Promise<void> {
  const db = await abrir();
  await db.runAsync("INSERT INTO comentarios (ocorrenciaId, texto, data) VALUES (?, ?, ?)", [
    ocorrenciaId,
    texto,
    dataHoraBR(new Date()),
  ]);
}

export const dataBR = (d: Date) =>
  `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

export const dataHoraBR = (d: Date) =>
  `${dataBR(d)} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
