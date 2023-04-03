import { Type } from "../enum";
import { Constructor, ControllerOptions } from "../type";

export function Controller <T>(otpions?: ControllerOptions) {
    return (target: Constructor<T>, _?: unknown) => {
        target.prototype.TYPE = Type.Controller;
        target.prototype.BASE_ROUTE = otpions?.path || '';
    };
}