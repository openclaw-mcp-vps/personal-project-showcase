import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

export async function readStore<T>(fileName: string, fallback: T): Promise<T> {
  try {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, fileName);
    const content = await readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

export async function writeStore<T>(fileName: string, value: T): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, fileName);
  await writeFile(filePath, JSON.stringify(value, null, 2), "utf-8");
}
