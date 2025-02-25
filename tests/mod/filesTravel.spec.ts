import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { findTranslationsTargetFiles, getAllProjectFiles } from '@/mod/filesTravel';

describe('filesTravel.ts', (): void => {
  let tempDir: string;

  beforeAll(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test-'));

    await fs.mkdir(path.join(tempDir, 'pl_PL'));
    await fs.writeFile(path.join(tempDir, 'pl_PL', 'index.js'), 'export default {}');
    await fs.writeFile(path.join(tempDir, 'pl_PL', 'notindex.js'), 'export default {}');

    await fs.mkdir(path.join(tempDir, 'other'));
    await fs.writeFile(path.join(tempDir, 'other', 'index.js'), 'export default {}');

    await fs.writeFile(path.join(tempDir, 'pl.json'), '{"key": "value"}');
    await fs.writeFile(path.join(tempDir, 'random.json'), '{"key": "value"}');

    await fs.mkdir(path.join(tempDir, 'include'));
    await fs.writeFile(path.join(tempDir, 'include', 'file.js'), 'console.log("include");');

    await fs.mkdir(path.join(tempDir, 'exclude'));
    await fs.writeFile(path.join(tempDir, 'exclude', 'file.js'), 'console.log("exclude");');
  });

  afterAll(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('findTranslationsTargetFiles', (): void => {
    it('should find index.js in specified indexFolders and json files in jsonFileNames', async () => {
      // Given
      const indexFolders = ['pl_PL'];
      const jsonFileNames = ['pl.json'];

      // When
      const files = await findTranslationsTargetFiles(tempDir, indexFolders, jsonFileNames);

      // Then
      const expectedIndex = path.join(tempDir, 'pl_PL', 'index.js');
      const expectedJson = path.join(tempDir, 'pl.json');
      const notExpectedIndex = path.join(tempDir, 'other', 'index.js');
      const notExpectedJson = path.join(tempDir, 'random.json');

      expect(files).toContain(expectedIndex);
      expect(files).toContain(expectedJson);
      expect(files).not.toContain(notExpectedIndex);
      expect(files).not.toContain(notExpectedJson);
    });
  });

  describe('getAllProjectFiles', (): void => {
    it('should return files with allowed extensions and exclude specified folders', async () => {
      // Given
      const allowedExtensions = ['.js', '.json'];
      const excludedFolders = ['exclude'];

      // When
      const files = await getAllProjectFiles(tempDir, allowedExtensions, excludedFolders);

      // Then
      const includeFile = path.join(tempDir, 'include', 'file.js');
      const excludeFile = path.join(tempDir, 'exclude', 'file.js');

      expect(files).toContain(includeFile);
      expect(files).not.toContain(excludeFile);
    });
  });
});
