import { promises as fs } from 'fs';
import path from 'path';

export const findTranslationsTargetFiles = async (
  baseDir: string,
  indexFolders: string[],
  jsonFileNames: string[]
): Promise<string[]> => {
  const results: string[] = [];

  const traverse = async (currentDir: string): Promise<void> => {
    let entries;
    try {
      entries = await fs.readdir(currentDir, { withFileTypes: true });
    } catch (error) {
      console.error(`Błąd odczytu katalogu ${currentDir}:`, error);
      return;
    }

    const dirPromises: Promise<void>[] = [];

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        dirPromises.push(traverse(fullPath));
      } else if (entry.isFile()) {
        if (entry.name === 'index.js') {
          const parentDirName = path.basename(currentDir);
          if (indexFolders.includes(parentDirName)) {
            results.push(fullPath);
          }
        } else if (entry.name.endsWith('.json') && jsonFileNames.includes(entry.name)) {
          results.push(fullPath);
        }
      }
    }

    await Promise.all(dirPromises);
  }

  await traverse(baseDir);
  return results;
};

export async function getAllProjectFiles(
  dir: string,
  allowedExtensions: string[],
  excludedFolders: string[]
): Promise<string[]> {
  const results: string[] = [];
  let entries;

  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err) {
    console.error(`Błąd odczytu katalogu ${dir}:`, err);
    return results;
  }

  const subDirPromises: Promise<string[]>[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (excludedFolders.includes(entry.name)) continue;
      subDirPromises.push(getAllProjectFiles(fullPath, allowedExtensions, excludedFolders));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (allowedExtensions.includes(ext)) {
        results.push(fullPath);
      }
    }
  }

  const subDirResults = await Promise.all(subDirPromises);
  for (const subResult of subDirResults) {
    results.push(...subResult);
  }

  return results;
}
