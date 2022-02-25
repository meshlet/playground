/**
 * Due to a bug in the @types/connect-redis declaration file, we're
 * using local types for this module.
 */

/// <reference types="express" />
/// <reference types="express-session" />
/// <reference types="redis" />

declare module 'connect-redis' {
    import * as express from 'express';
    import * as session from 'express-session';
    import { createClient } from 'redis';

    function s(options: (options?: session.SessionOptions) => express.RequestHandler): s.RedisStore;

    namespace s {
        type Client = ReturnType<typeof createClient>;
        interface RedisStore extends session.Store {
            new (options: RedisStoreOptions): RedisStore;
            client: Client;
        }
        interface RedisStoreOptions {
            client?: Client | undefined;
            host?: string | undefined;
            port?: number | undefined;
            socket?: string | undefined;
            url?: string | undefined;
            ttl?: number | string | ((store: RedisStore, sess: session.SessionData, sid: string) => number) | undefined;
            disableTTL?: boolean | undefined;
            disableTouch?: boolean | undefined;
            db?: number | undefined;
            pass?: string | undefined;
            prefix?: string | undefined;
            unref?: boolean | undefined;
            serializer?: Serializer | JSON | undefined;
            logErrors?: boolean | ((error: string) => void) | undefined;
            scanCount?: number | undefined;
        }
        interface Serializer {
            stringify: Function;
            parse: Function;
        }
    }

    export = s;
}
