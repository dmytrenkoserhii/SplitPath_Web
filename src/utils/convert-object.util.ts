import { z } from 'zod';

/**
 * Converts a string from snake_case or kebab-case to camelCase.
 * For example, `"hello_world"` or `"hello-world"` becomes `"helloWorld"`.
 *
 * @param str The string to convert.
 * @returns The camelCased string.
 */
export const toCamelCase = (str: string): string => {
  return str
    .replace(/([-_][a-z])/gi, (match) =>
      match.toUpperCase().replace('-', '').replace('_', '')
    )
    .replace(/^[A-Z]/, (match) => match.toLowerCase());
};

/**
 * Converts a string value to its appropriate JavaScript type (boolean, number, Date, or string).
 * It uses a Zod schema to parse and transform the string.
 *
 * @param value The string value to convert.
 * @returns The converted value, or the original string if no conversion is applicable.
 */
export const convertStringToType = (value: string) => {
  if (value === '') {
    return value;
  }

  const stringToTypeSchema = z.union([
    z.literal('true').transform(() => true),
    z.literal('false').transform(() => false),
    z
      .string()
      .refine((value) => !isNaN(Number(value)), {
        message: 'Not a valid number',
      })
      .transform((value) => Number(value)),
    z
      .string()
      .refine((value) => !isNaN(Date.parse(value)), {
        message: 'Not a valid date',
      })
      .transform((value) => new Date(value)),
    z.string(),
  ]);

  const result = stringToTypeSchema.safeParse(value);
  if (result.success) {
    return result.data;
  }
  return value;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyObject = Record<string, any>;

/**
 * Recursively converts the keys of an object to camelCase and its string values to their appropriate types.
 * This function iterates through an object's properties. If a value is an object itself (but not an array),
 * it recursively calls itself on that object. Otherwise, it converts the key to camelCase and the string value to its inferred type.
 *
 * @template T - The expected type of the returned object.
 * @param obj The object to convert.
 * @returns A new object with camelCased keys and type-converted string values.
 */
export const convertObjectKeysToCamelCaseAndConvertStringValuesToType = <
  T extends AnyObject
>(
  obj: AnyObject
): T =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      acc[toCamelCase(key) as keyof T] =
        convertObjectKeysToCamelCaseAndConvertStringValuesToType(value);
    } else {
      acc[toCamelCase(key) as keyof T] = convertStringToType(value) as any;
    }
    return acc;
  }, {} as T);
