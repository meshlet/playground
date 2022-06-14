/**
 * Provides additional interfaces and types in Express namespace.
 *
 * These declarations are merged with types from other
 * packages (Express, passport etc.).
 */
declare namespace Express {
  interface User {
    email: string;
  }
}