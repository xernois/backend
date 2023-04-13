import { Type, Constructor } from "../";

export function Resolver <T>({singleton = false}) {
    return (target: Constructor<T>, _ ?: unknown) => {
        target.prototype.SINGLETON = singleton;
        target.prototype.TYPE = Type.Resolver;
    };
}