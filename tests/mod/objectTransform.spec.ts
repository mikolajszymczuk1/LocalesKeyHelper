import { flattenKeys } from '@/mod/objectTransform';

describe('objectTransform.ts', (): void => {
  describe('flattenKeys', (): void => {
    it('should return an empty array for an empty object', (): void => {
      // Given
      const input = {};

      // When
      const result = flattenKeys(input);

      // Then
      expect(result).toEqual([]);
    });

    it('should return keys for a flat object', (): void => {
      // Given
      const input = { a: 1, b: 2 };

      // When
      const result = flattenKeys(input);

      // Then
      expect(result.sort()).toEqual(['a', 'b'].sort());
    });

    it('should flatten nested objects', (): void => {
      // Given
      const input = { a: { b: 'test1', c: 'test2' }, d: 'test3' };

      // When
      const result = flattenKeys(input);

      // Then
      expect(result.sort()).toEqual(['a.b', 'a.c', 'd'].sort());
    });

    it('should treat arrays as leaf nodes', (): void => {
      // Given
      const input = { a: [1, 2, 3], b: { c: 4 } };

      // When
      const result = flattenKeys(input);

      // Then
      expect(result.sort()).toEqual(['a', 'b.c'].sort());
    });

    it('should treat null values as leaf nodes', (): void => {
      // Given
      const input = { a: null, b: { c: null } };

      // When
      const result = flattenKeys(input);

      // Then
      expect(result.sort()).toEqual(['a', 'b.c'].sort());
    });

    it('should use provided prefix', (): void => {
      // Given
      const input = { a: 1 };
      const prefix = 'test';

      // When
      const result = flattenKeys(input, prefix);

      // Then
      expect(result).toEqual(['test.a']);
    });

    it('should treat functions as leaf nodes', (): void => {
      // Given
      const input = { a: () => { }, b: { c: () => { } } };

      // When
      const result = flattenKeys(input);

      // Then
      expect(result.sort()).toEqual(['a', 'b.c'].sort());
    });

    it('should handle deeply nested objects', (): void => {
      // Given
      const input = { a: { b: { c: 'hello' } }, d: { e: 1, f: { g: 2 } } };

      // When
      const result = flattenKeys(input);

      // Then
      expect(result.sort()).toEqual(['a.b.c', 'd.e', 'd.f.g'].sort());
    });
  });
});
