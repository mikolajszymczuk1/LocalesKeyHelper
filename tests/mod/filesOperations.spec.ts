import { promises as fs } from 'fs';
import { parseJsFileContent, loadTranslationsFilesContent } from '@/mod/filesOperations';

describe('filesOperations.ts', (): void => {
  describe('parseJsFileContent', (): void => {
    it('should parse valid JS content without trailing semicolon', () => {
      // Given
      const content = "export default { a: 1, b: 'test' }";

      // When
      const result = parseJsFileContent(content);

      // Then
      expect(result).toEqual({ a: 1, b: 'test' });
    });

    it('should parse valid JS content with trailing semicolon', () => {
      // Given
      const content = "export default { a: 2, b: 'example' };";

      // When
      const result = parseJsFileContent(content);

      // Then
      expect(result).toEqual({ a: 2, b: 'example' });
    });

    it('should trim whitespace and parse correctly', () => {
      // Given
      const content = "   export default    {a:3, b:'whitespace'}   ;   ";

      // When
      const result = parseJsFileContent(content);

      // Then
      expect(result).toEqual({ a: 3, b: 'whitespace' });
    });

    it('should throw an error for invalid JS content', () => {
      // Given
      const content = "export default { a: , b: 'fail' }";

      // When & Then
      expect(() => parseJsFileContent(content)).toThrow(/Błąd parsowania/);
    });
  });

  describe('loadTranslationsFilesContent', (): void => {
    let readFileSpy: jest.SpyInstance;

    beforeEach(() => {
      readFileSpy = jest.spyOn(fs, 'readFile');
    });

    afterEach(() => {
      readFileSpy.mockRestore();
    });

    it('should load and parse JSON file content', async () => {
      // Given
      const filePaths = ['file1.json'];
      const jsonContent = '{"key": "value"}';
      readFileSpy.mockResolvedValueOnce(jsonContent);

      // When
      const result = await loadTranslationsFilesContent(filePaths);

      // Then
      expect(result).toEqual({ 'file1.json': { key: 'value' } });
    });

    it('should load and parse JS file content', async () => {
      // Given
      const filePaths = ['file2.js'];
      const jsContent = "export default { foo: 'bar' }";
      readFileSpy.mockResolvedValueOnce(jsContent);

      // When
      const result = await loadTranslationsFilesContent(filePaths);

      // Then
      expect(result).toEqual({ 'file2.js': { foo: 'bar' } });
    });

    it('should load and parse multiple files and return combined result', async () => {
      // Given
      const filePaths = ['file1.json', 'file2.js'];
      const jsonContent = '{"jsonKey": 123}';
      const jsContent = "export default { jsKey: 'abc' }";
      readFileSpy
        .mockResolvedValueOnce(jsonContent)
        .mockResolvedValueOnce(jsContent);

      // When
      const result = await loadTranslationsFilesContent(filePaths);

      // Then
      expect(result).toEqual({
        'file1.json': { jsonKey: 123 },
        'file2.js': { jsKey: 'abc' },
      });
    });

    it('should return null for file that fails to load', async () => {
      // Given
      const filePaths = ['file1.json', 'fileError.js'];
      const jsonContent = '{"valid": true}';
      const spy = jest.spyOn(console, 'error').mockImplementation(() => { });
      readFileSpy
        .mockResolvedValueOnce(jsonContent)
        .mockRejectedValueOnce(new Error('Read error'));

      // When
      const result = await loadTranslationsFilesContent(filePaths);

      // Then
      expect(result).toEqual({
        'file1.json': { valid: true },
        'fileError.js': null,
      });

      spy.mockRestore();
    });
  });
});
