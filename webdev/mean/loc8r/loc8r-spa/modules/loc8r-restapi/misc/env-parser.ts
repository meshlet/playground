import fs from 'fs';
import path from 'path';
import {
  convertStrToInt,
  convertStrToBoolean,
  isRecord,
  isKeyOf,
  typeofMatches
} from 'loc8r-common';

/**
 * Parses environment variables according to the environment configuration
 * file (by default this is the top-level .env.config file). In case some
 * variables are missing (but are missing default value in environment
 * configuration object), script exits with an error.
 *
 * If parsing succeeds, scripts exports the Environment object whose
 * properties correspond to available environment variables.
 */

/**
 * A union of string literals defining all possible values for the "type"
 * property of a environment configuration entry.
 */
type EnvConfigEntryTypeNames = 'string' | 'integer' | 'boolean';

/**
 * A union of possible types for environemnt variables' values.
 */
type EnvConfigEntryTypes = string | number | boolean;

/**
 * Type that describes a single environment entry in the environment
 * configuration file.
 */
type EnvConfigEntry = {
  defaultValue?: EnvConfigEntryTypes,
  type: EnvConfigEntryTypeNames
};

/**
 * Environment configuration object type.
 */
type EnvConfig = Record<string, EnvConfigEntry | undefined>;

/**
 * Parse environment configuration file.
 */
function parseEnvConfig(): EnvConfig {
  const envConfig: EnvConfig = {};
  if (process.env.ENV_CONFIG_FILE == null || process.env.ENV_CONFIG_FILE === '') {
    console.log('Environment configuration file must be provided via the ENV_CONFIG_FILE environment variable.');
    process.exit(-1);
  }

  // Build full path to the environment configuration file
  const envConfigPath = path.join(__dirname, '..', 'env-configs', process.env.ENV_CONFIG_FILE);

  // Try reading the path and parsing it as JSON
  try {
    if (!fs.existsSync(envConfigPath)) {
      console.log(`Environment configuration file not found at ${envConfigPath}.`);
      process.exit(-1);
    }

    const json = JSON.parse(fs.readFileSync(envConfigPath, { encoding: 'utf-8' })) as unknown | undefined;
    if (json == null || !isRecord(json)) {
      process.exit(-1);
    }

    // Make sure that each property of the parsed JSON object has EnvConfigEntry
    // type.
    const keys = Object.keys(json);
    for (const key of keys) {
      const envConfigEntry = json[key];
      if (isRecord(envConfigEntry)) {
        const type = envConfigEntry.type;
        if (typeof type !== 'string') {
          console.log(`${key} environment variable in ${envConfigPath} is missing "type" property.`);
          process.exit(-1);
        }
        else if (type !== 'string' && type !== 'integer' && type !== 'boolean') {
          console.log(`"type" property of ${key} environment variable in ${envConfigPath} must have one of the following values: ["string", "integer", "boolean"]`);
          process.exit(-1);
        }

        const defaultValue = envConfigEntry.defaultValue;
        if (typeof defaultValue !== 'undefined' &&
            typeof defaultValue !== 'string' &&
            typeof defaultValue !== 'number' &&
            typeof defaultValue !== 'boolean') {
          console.log(`"defaultValue" property of ${key} environment variable in ${envConfigPath} must either be undefined or be a string, number of a boolean.`);
          process.exit(-1);
        }

        // Make sure that defaultValue has expected type, if provided
        const defaultValueType = typeof defaultValue;
        if (defaultValue != null) {
          if ((type === 'string' && defaultValueType !== 'string') ||
              (type === 'integer' && defaultValueType !== 'number') ||
              (type === 'boolean' && defaultValueType !== 'boolean')) {
            console.log(`"defaultValue" property of ${key} environment variable in ${envConfigPath} has type "${defaultValueType}", while "type" property is set to "${type}"`);
            process.exit(-1);
          }
          else if (type === 'integer' && !Number.isSafeInteger(defaultValue)) {
            console.log(`"type" property of ${key} environment variable in ${envConfigPath} is set to "${type}", but ${defaultValue.toString()} is not a safe integer.`);
            process.exit(-1);
          }
        }

        envConfig[key] = {
          type: type,
          defaultValue: defaultValue
        };
      }
      else {
        console.log(`${key} environment variable in ${envConfigPath} is not an object.`);
        process.exit(-1);
      }
    }
  }
  catch (e) {
    console.log(`Failed to parse the contents of the environment configuration file at ${envConfigPath}.`);
    process.exit(-1);
  }
  return envConfig;
}

/**
 * Parses the environment variable's value according to the type set in the
 * environment configuration.
 */
function parseEnvVar(envVarName: string, envVarValue: string, type: EnvConfigEntryTypeNames) {
  switch (type) {
    case 'string':
      // No need to parse string
      return envVarValue;

    case 'integer': {
      const intVal = convertStrToInt(envVarValue);
      if (Number.isNaN(intVal)) {
        console.log(`${envVarName} environment variable set to ${envVarValue}, which is not an integer.`);
        process.exit(-1);
      }
      return intVal;
    }

    case 'boolean': {
      const boolVal = convertStrToBoolean(envVarValue);
      if (boolVal == null) {
        console.log(`${envVarName} environment variable set to ${envVarValue}, which is not a boolean.`);
        process.exit(-1);
      }
      return boolVal;
    }

    default: {
      // In case EnvConfigEntryTypeNames union gets extended, this makes sure the
      // compilation fails, because type will no longer be of type never.
      const _exhaustiveCheck: never = type;
      return _exhaustiveCheck;
    }
  }
}

/**
 * Exposes process' environment variables.
 *
 * @note This class' properties correspond to all the environment variables
 * available in the app. Upon creation, constructor will initialize those
 * environment variables present in the environment configuration object.
 *
 * @todo This class should be automatically generated from the top-level
 * env-configs/.env.config file that contains all the environment variables. Autogenerator
 * would generate a property for each env. variable, and assign it an inital
 * value according to the "type" property in the environment configuration
 * entry. For this to work, env-parser.ts source would become env-config-parser.ts
 * and would only handle parsing the environment configuration file. Autogenerator
 * would produce environment.ts file that uses env-config-parser.ts to get the
 * env. configuration object and contains the Environment class definition as
 * well as exports an instance of this class.
 *
 * @todo Environment variables missing from the env. configuration are ignored.
 * If process uses them anyways, no errors are reported currently and initial
 * values are returned. It might make sense to introduce getters for env.
 * variables, that would consult whether variables are present in the env. config
 * object and report error if they aren't. This can be done if process isn't
 * running in production.
 */
class Environment {
  public REST_SERVER_ADDRESS = '';
  public REST_SERVER_PORT = -1;
  public DB_ADDRESS = '';
  public DB_PORT = -1;
  public DB_NAME = '';
  public ALLOW_MANUAL_UPDATE_OF_CREATED_ON_PATHS = false;

  constructor(envConfig: EnvConfig) {
    const envVarNames = Object.getOwnPropertyNames(envConfig);
    for (const envVarName of envVarNames) {
      const envConfigEntry = envConfig[envVarName];
      if (envConfigEntry == null) {
        // Ignore environment variable that is missing from the environment config
        continue;
      }

      if (isKeyOf(envVarName, this)) {
        // Read the env. variable from environment
        const envVar = process.env[envVarName];
        if ((envVar == null || envVar.length === 0)) {
          if (envConfigEntry.defaultValue == null) {
            // Environment configuration entry is missing default value, meaning that value should've
            // been provided through environment.
            console.log(`${envVarName} environment variable hasn't been provided but is required.`);
            process.exit(-1);
          }
          if (!typeofMatches(envConfigEntry.defaultValue, this[envVarName])) {
            console.log(
              `The type of ${envVarName} environment variable's default value (${typeof envConfigEntry.defaultValue}) doesn't match expected type (${typeof this[envVarName]}).`);
            process.exit(-1);
          }
          this[envVarName] = envConfigEntry.defaultValue;
        }
        else {
          const parsedValue = parseEnvVar(envVarName, envVar, envConfigEntry.type);
          if (!typeofMatches(parsedValue, this[envVarName])) {
            console.log(
              `The type of ${envVarName} environment variable's value (${typeof parsedValue}) doesn't match expected type (${typeof this[envVarName]}).`);
            process.exit(-1);
          }
          this[envVarName] = parsedValue;
        }
      }
      else {
        console.log(`Environment class is missing the ${envVarName} property, present in the environment configuration object.`);
        process.exit(-1);
      }
    }
  }
}

export const _Env = new Environment(parseEnvConfig());
