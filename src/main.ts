import path from 'path';
import { promises as fs } from 'fs';
import { findTranslationsTargetFiles, getAllProjectFiles } from '@/mod/filesTravel';
import { loadTranslationsFilesContent } from '@/mod/filesOperations';
import { flattenKeys } from '@/mod/objectTransform';

const main = async (): Promise<void> => {
  const args = process.argv.slice(2);
  const isLive = args[0] === 'live';

  const pathTest = '/src/testData';
  const pathLive = '/app/javascript/apps';
  const baseDir = path.join(process.cwd(), isLive ? pathLive : pathTest);

  const indexFolders = ['pl_PL', 'en_GB', 'lt_LT', 'uk_UA', 'cs_CZ'];
  const jsonFileNames = ['pl.json', 'en.json', 'cs.json', 'uk.json'];
  const allowedExtensions = ['.js', '.ts', '.vue'];
  const ignoreDirectories = ['node_modules', ...indexFolders];

  try {
    // Step 1: Find all translations files
    const filesWithTranslations = await findTranslationsTargetFiles(baseDir, indexFolders, jsonFileNames)
    console.log('Znalezione pliki z tłumaczeniami:');
    console.log(filesWithTranslations);
    console.log('-------------------------------- \n\n');

    // Step 2: Load and process translations files
    const contents = await loadTranslationsFilesContent(filesWithTranslations);

    // Step 3: Get all project files and their contents
    console.log(`Przeszukanie katalogu ${baseDir} \n\n`);
    const projectFiles = await getAllProjectFiles(baseDir, allowedExtensions, ignoreDirectories);
    const projectFilesContents = await Promise.all(
      projectFiles.map(async (file) => {
        try {
          const text = await fs.readFile(file, 'utf-8');
          return { file, text };
        } catch (err) {
          return { file, text: '' };
        }
      })
    );

    // Step 4: Flatten keys and find unused keys
    let counter = 0;
    for (const filePath in contents) {
      if (!Object.hasOwn(contents, filePath)) {
        continue;
      }

      const fileContent = contents[filePath];
      const keys = flattenKeys(fileContent);
      const unusedKeys: string[] = [];

      for (const key of keys) {
        const onlyKeyToCheck = key.split('.').pop();
        const regex = new RegExp(`(?:['"]${onlyKeyToCheck}['"]|\\.${onlyKeyToCheck}\\b)`, 'g');

        let isUsed = false;
        for (const { text } of projectFilesContents) {
          if (regex.test(text)) {
            isUsed = true;
            break;
          }
        }

        if (!isUsed) {
          unusedKeys.push(onlyKeyToCheck!);
          counter++;
        }
      }

      console.log(`Niezastosowane klucze w pliku ${filePath}:`);
      console.log(unusedKeys);
      console.log('-------------------------------- \n\n');
    }

    console.log(`\n Znaleziono ${counter} niezastosowanych kluczy`);
  } catch (err) {
    console.error('Błąd podczas przeszukiwania:', err);
  }
};

main();
