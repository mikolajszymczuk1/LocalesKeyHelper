import { promises as fs } from 'fs';
import path from 'path';

export const parseJsFileContent = (content: string): any => {
  let cleaned = content.replace(/^\s*export\s+default\s+/, '').trim();

  if (cleaned.endsWith(';')) {
    cleaned = cleaned.slice(0, -1);
  }

  const wrapped = `(${cleaned})`;

  try {
    return new Function(`return ${wrapped}`)();
  } catch (error) {
    throw new Error(`Błąd parsowania zawartości pliku JS: ${error}`);
  }
};

export const loadTranslationsFilesContent = async (filePaths: string[]): Promise<{ [filePath: string]: any }> => {
  const entries = await Promise.all(
    filePaths.map(async (filePath) => {
      const ext = path.extname(filePath);
      try {
        const content = await fs.readFile(filePath, 'utf8');
        const parsed = ext === '.json'
          ? JSON.parse(content)
          : parseJsFileContent(content);

        return [filePath, parsed] as [string, any];
      } catch (error) {
        console.error(`Błąd ładowania pliku ${filePath}:`, error);
        return [filePath, null] as [string, any];
      }
    })
  );

  return Object.fromEntries(entries);
};
