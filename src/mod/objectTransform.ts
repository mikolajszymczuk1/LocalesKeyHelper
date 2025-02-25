export const flattenKeys = (
  obj: any,
  prefix: string = '',
  result: string[] = []
): string[] => {
  for (const key in obj) {
    if (!Object.hasOwn(obj, key)) continue;
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      flattenKeys(value, fullKey, result);
    } else {
      result.push(fullKey);
    }
  }

  return result;
}
