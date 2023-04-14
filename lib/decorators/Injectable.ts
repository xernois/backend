import { Constructor, Type } from "../";

/**
 * Injectable decorator factory 
 * @returns {Function} - The injectable decorator  
 */
export function Injectable <T>() {
    return (target: Constructor<T>, _ ?: unknown) => {
        target.prototype.SINGLETON = true;
        target.prototype.TYPE = Type.Service;
    };
}