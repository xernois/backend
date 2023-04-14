import { Constructor, Type } from "../";

/** 
 * Middleware decorator factory
 * @param {{singleton: boolean}} singleton - Whether the middleware is a singleton
 * @returns {Function} - The middleware decorator 
 */
export function Middleware <T>({singleton = false}) {
    return (target: Constructor<T>, _ ?: unknown) => {
        target.prototype.SINGLETON = singleton;
        target.prototype.TYPE = Type.Middleware;
    };
}