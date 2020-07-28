/**
 * Wraps the NodeJS EventEmitter into a type-safe class.
 */

import { EventEmitter } from "events";

export class TypeSafeEmitter<EventTypes extends Record<PropertyKey, unknown[]>> {
    private emitter = new EventEmitter();

    emit<K extends keyof EventTypes>(
        event: K,
        ...args: EventTypes[K]
    ) {
        // TypeScript infers K as string | symbol | number while EventEmitter.emit
        // accepts string | symbol. toString method makes sure that even if K
        // happens to be a number (which it shouldn't), we'll cast it to string
        // before using it as event name
        return this.emitter.emit(event.toString(), ...args);
    }

    on<K extends keyof EventTypes>(
        event: K,
        listener: (...args: EventTypes[K]) => void
    ) {
        // Must use type-assertion here as EventEmitter.on accepts (..args: any[]) => void
        // callback, hence passing (...args: EventTypes[K]) => void won't compile.
        // However, this is completely safe as long as we always use TypeSafeEmitter
        // to emit events. TypeSafeEmitter.emit will make sure that event arguments
        // are of expected type, so even though the native EventEmitter.on's callback
        // accepts any[], the actual argument type will be EventTypes[K].
        return this.emitter.on(event.toString(), listener as (...args: any[]) => void);
    }
}