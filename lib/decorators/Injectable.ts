import { Type } from "../enum";
import { Constructor } from "../type";

export function Injectable <T>() {
    return (target: Constructor<T>) => {
        target.prototype.TYPE = Type.Service;
    };
}