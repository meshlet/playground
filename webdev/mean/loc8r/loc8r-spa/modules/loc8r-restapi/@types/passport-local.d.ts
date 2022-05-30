/**
 * Due to a bug in the @types/passport-local declaration file, we're
 * using local types for this module.
 */

/// <reference types="passport"/>

declare module 'passport-local' {
  import { Strategy as PassportStrategy } from 'passport-strategy';
  import express from 'express';

  interface IStrategyOptions {
    usernameField?: string | undefined;
    passwordField?: string | undefined;
    session?: boolean | undefined;
    passReqToCallback?: false | undefined;
  }

  interface IStrategyOptionsWithRequest {
      usernameField?: string | undefined;
      passwordField?: string | undefined;
      session?: boolean | undefined;
      passReqToCallback: true;
  }

  interface IVerifyOptions {
      message: string;
  }

  interface VerifyFunctionWithRequest {
      (
          req: express.Request,
          username: string,
          password: string,
          done: (error: any, user?: any, options?: IVerifyOptions) => void
      ): Promise<unknown> | void;
  }

  interface VerifyFunction {
      (
          username: string,
          password: string,
          done: (error: any, user?: any, options?: IVerifyOptions) => void
      ): Promise<unknown> | void;
  }

  class Strategy extends PassportStrategy {
    constructor(
        options: IStrategyOptionsWithRequest,
        verify: VerifyFunctionWithRequest
    );
    constructor(options: IStrategyOptions, verify: VerifyFunction);
    constructor(verify: VerifyFunction);

    name: string;
  }
}
