import { Type, Constructor } from "../";


/**
 * Resolver decorator factory
 * @param {{singleton: boolean}} singleton - Whether the resolver is a singleton
 * @returns {Function} - The resolver decorator
 */
export function Resolver <T>({singleton = false}) {
    return (target: Constructor<T>, _ ?: unknown) => {
        target.prototype.SINGLETON = singleton;
        target.prototype.TYPE = Type.Resolver;
    };
}