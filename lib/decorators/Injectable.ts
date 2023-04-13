import { Constructor, Type } from "../";

export function Injectable <T>() {
    return (target: Constructor<T>, _ ?: unknown) => {
        target.prototype.SINGLETON = true;
        target.prototype.TYPE = Type.Service;
    };
}