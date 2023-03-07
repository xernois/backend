import { Type } from "../enum";
import { Constructor } from "../type";

export function Controller <T>() {
    return (target: Constructor<T>) => {
        target.prototype.TYPE = Type.Controller;
    };
}