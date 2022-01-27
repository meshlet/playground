/**
 * @file Helpers providing isolated functionality common to rest of the app.
 *
 * Contains functionality useful both for server and client.
 */

/**
 * Converts string to an integer.
 *
 * @return An integer if conversion succeeds, NaN otherwise.
 */
export function _convertStrToInt(value: string): number {
  if (value.trim().length === 0) {
    return NaN;
  }

  const num = Number(value);
  return Number.isSafeInteger(num) ? num : NaN;
}

/**
 * Converts string to a float.
 *
 * @returns A float if conversion succeeds, NaN otherwise.
 */
export function _convertStrToFloat(value: string): number {
  if (value.trim().length === 0) {
    return NaN;
  }

  return Number(value);
}

/**
 * Converts string to a boolean.
 *
 * @returns True if one of 'true', '1', 'yes', false if one of 'false',
 * '0', 'no', otherwise undefined.
 */
export function _convertStrToBoolean(value: string): boolean | undefined {
  if (value === 'true' || value === '1' || value === 'yes') {
    return true;
  }
  else if (value === 'false' || value === '0' || value === 'no') {
    return false;
  }
  return undefined;
}
