/**
 * Parses environment variables printing out warnings in case of missing
 * ones, makes sure that they're well formed and exports these variables
 * to the rest of the application.
 */

/**
 * Ensures that the given environment variable exists and returns its value
 * as a string.
 */
function getEnvVariable(varName: string): string {
  // Make sure the environment variable whose name is `varName` exists
  const envVar = process.env[varName];
  if (envVar === undefined || envVar.length === 0) {
    console.log(`${varName} environment variable hasn't been provided. Exiting`);
    return '';
  }
  else {
    // Return environment variable value as a string
    return envVar;
  }
}

/**
 * Similar to the getEnvVariable, but also attempts to parse the environment
 * variable value using the supplied callback and returns the callback's
 * return value.
 */
type ParseCb<R> = (envVarName: string, envVarValue: string) => R;
function getAndParseEnvVariable<R>(varName: string, parseCb: ParseCb<R>): R {
  // Try obtaining environment variable value
  const envVarValue = getEnvVariable(varName);

  // Parse the value using the provided callback
  return parseCb(varName, envVarValue);
}

/**
 * A helper that tries parsing environment variable as an integer, terminating
 * process in case of failure.
 *
 * @note This function is intended to be passed as a callback to the getAndParseEnvVariable
 * function.
 */
function parseEnvVariableAsInt(envVarName: string, envVarValue: string): number {
  const intVal = Number.parseInt(envVarValue);
  if (Number.isNaN(intVal)) {
    console.log(`${envVarName} environment variable set to ${envVarValue}, which is not an integer. Exiting.`);
    return -1;
  }
  return intVal;
}

// Export environment variables
export const _SERVER_ADDRESS = getEnvVariable('SERVER_ADDRESS');
export const _SERVER_PORT = getAndParseEnvVariable('SERVER_PORT', parseEnvVariableAsInt);
export const _DB_ADDRESS = getEnvVariable('DB_ADDRESS');
export const _DB_PORT = getAndParseEnvVariable('DB_PORT', parseEnvVariableAsInt);
export const _DB_NAME = getEnvVariable('DB_NAME');
export const _GOOGLE_MAPS_API_KEY = getEnvVariable('GOOGLE_MAPS_API_KEY');
