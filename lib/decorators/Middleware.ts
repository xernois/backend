import { Constructor, Type } from "../";

export function Middleware <T>({singleton = false}) {
    return (target: Constructor<T>, _ ?: unknown) => {
        target.prototype.SINGLETON = singleton;
        target.prototype.TYPE = Type.Middleware;
    };
}